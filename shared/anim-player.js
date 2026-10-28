// 動畫故事播放器(共用,WY16 由第一課播放器抽出):逐幕播放 CSS/SVG 動畫,字幕同步顯示,
// 旁白:有 AI 配音音檔就播音檔,否則用瀏覽器內建朗讀(speechSynthesis);不支援朗讀或關掉旁白時,照時間軸顯示字幕。
// 各課的 animation.js 只負責提供資料與道具(PROPS),呼叫 mountAnimation()。網址 ?speed=N 可加速(測試用)。
import { escapeHTML } from './terms.js?v=571e329';
import { initPage, narrationOn, disableSetting, overlayOpen, onSwipe } from './page.js?v=571e329';
import { characterURL as imageURL } from './assets.js?v=571e329';

// 語音:只選華語。先 zh-TW,再其他華語(zh-CN、zh-SG、cmn、zh-Hans、zh-Hant、單獨的 zh);
// ⛔ 粵語(zh-HK、yue)等其他語言。語音清單可能晚一點才載入,所以每次朗讀時重找。
// prefer:'male'/'female'(角色設定 voice;孔子 male,WY23;小沈復 female,WY28):同一層裡先挑看得出是該性別的,
// 依序 zh-TW → 其他華語 → 都沒有就照原本的順序;其他角色不受影響。
const VOICE_TIERS = [
  (l) => /^zh-TW$/i.test(l),
  (l) => /^(zh-(CN|SG|Hans|Hant)|cmn)(-|$)/i.test(l),
  (l) => /^zh$/i.test(l),
];
// 看得出是男聲:名稱含 male/男(female 不算),或微軟公開的華語男聲名稱。
// Google(Android)的語音代號看不出性別,沒有可靠對照表,所以不列(找不到男聲就照原本的順序)。
const MALE_NAME = /\bmale\b|男|\b(Zhiwei|Yunjhe|Kangkang|Yunxi|Yunyang|Yunjian)\b/i;
export const isMaleVoice = (v) => MALE_NAME.test(`${v.name ?? ''} ${v.voiceURI ?? ''}`);
// 看得出是女聲:名稱含 female/女,或微軟、蘋果公開的華語女聲名稱(WY28:內建朗讀沒有童聲,小沈復挑女聲再小幅拉高)。
const FEMALE_NAME = /\bfemale\b|女|\b(Hanhan|Yating|HsiaoChen|HsiaoYu|Huihui|Yaoyao|Xiaoxiao|Xiaoyi|Xiaobei|Xiaoni|Mei-?Jia|Ting-?Ting)\b/i;
export const isFemaleVoice = (v) => FEMALE_NAME.test(`${v.name ?? ''} ${v.voiceURI ?? ''}`);
const PREFER = { male: isMaleVoice, female: isFemaleVoice };
export function pickVoiceFrom(voices, { prefer } = {}) {
  const lang = (v) => String(v.lang ?? '').replace('_', '-');
  const want = PREFER[prefer];
  if (want) {
    for (const tier of VOICE_TIERS) {
      const v = voices.find((x) => tier(lang(x)) && want(x));
      if (v) return v;
    }
  }
  for (const tier of VOICE_TIERS) {
    const v = voices.find((x) => tier(lang(x)));
    if (v) return v;
  }
  return null;
}

// audioFiles/audioMeta:AI 配音清單(沒有就給空的);audioBase:音檔資料夾網址
export function mountAnimation({ animMeta, roles, scenes, PROPS, audioFiles = {}, audioMeta = { provider: '' }, audioBase = null }) {
  initPage({ paged: true });
  const params = new URLSearchParams(location.search);
  const SPEED = Math.max(1, Number(params.get('speed')) || 1);
  const app = document.getElementById('app');
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  const hasAudio = Object.keys(audioFiles).length > 0; // 有 AI 配音音檔
  // 音檔網址帶內容雜湊:重產後檔名不變也不會播到快取的舊檔
  const audioURL = (entry) => new URL(`${entry.file}?h=${entry.hash}`, audioBase).href;
  const TOTAL = scenes.reduce((sum, x) => sum + x.duration, 0);

  // ---------------------------------------------------------------- 狀態
  let idx = 0;
  let elapsed = 0;
  let playing = false;
  const canSpeak = !!synth || hasAudio;
  let narration = canSpeak && narrationOn(); // 旁白開關在 ⚙ 設定裡,存本機
  let shown = -1;            // 本幕已顯示到第幾句
  let speaking = false;
  let last = 0;
  let ended = false;
  let holdWaited = 0;        // 已經在播放中等了上一句多久(毫秒;暫停的時間不算);0=沒在等
  // 最多等 15 秒,裝置朗讀卡住時動畫不會永遠停住(測試可用 ?holdmax= 縮短,只在 ?speed= 測試模式有效)
  const HOLD_MAX = params.has('speed') && Number(params.get('holdmax')) > 0 ? Number(params.get('holdmax')) : 15000;

  // ---------------------------------------------------------------- 畫面骨架
  // 頁面說明;矮螢幕時收進 ⓘ 彈出視窗(CSS 決定顯示哪一個)
  const NOTE = `${escapeHTML(animMeta.note)}角色圖由 AI 生成，背景與道具為程式繪製。${hasAudio ? `旁白由 AI 語音（${escapeHTML(audioMeta.provider)}）產生。` : canSpeak ? '旁白用的是手機／電腦內建語音，不同裝置聲音不同。' : '這個瀏覽器不支援朗讀，只顯示字幕。'}`;

  // 一屏版面(WY13):舞台依剩餘高度縮放(保持 16:9),字幕、控制列、進度條固定在下方
  app.innerHTML = `
    <main class="anim-view">
      <h1 class="sr-only">${escapeHTML(animMeta.title)}</h1>
      <div class="stage-wrap">
        <div class="stage-box">
          <div class="stage" id="stage" role="img" aria-roledescription="動畫畫面"></div>
          <button type="button" class="bigplay" id="bigplay"><span>▶ 開始播放<small>約 ${Math.floor(TOTAL / 60)} 分 ${TOTAL % 60} 秒</small></span></button>
        </div>
      </div>
      <p class="subtitle" id="subtitle" aria-live="polite"></p>
      <div class="controls" role="group" aria-label="播放控制">
        <button type="button" id="prev" aria-label="上一幕">⏮</button>
        <button type="button" id="play" aria-label="播放">▶</button>
        <button type="button" id="next" aria-label="下一幕">⏭</button>
        <button type="button" id="about" class="about-btn" aria-label="關於這段動畫" aria-haspopup="dialog">ⓘ</button>
        <select id="chapter" class="chapter-pick" aria-label="選擇分幕">${scenes.map((s, i) => `<option value="${i}">${i + 1}. ${escapeHTML(s.title)}</option>`).join('')}</select>
      </div>
      <div class="seekbar">
        <input type="range" id="seek" class="seek" min="0" max="${TOTAL}" step="1" value="0" aria-label="播放進度">
        <span class="seek-time" id="seektime" aria-hidden="true"></span>
      </div>
      <p class="voice-note" id="voice-note" role="status" hidden><span id="voice-note-text"></span><button type="button" class="voice-note-close" id="voice-note-close" aria-label="關閉提示">✕</button></p>
      <p class="anim-note" id="anim-note">${NOTE}</p>
      <dialog class="note-dialog" id="about-dialog" aria-labelledby="about-title">
        <form method="dialog" class="note-card">
          <h2 id="about-title">關於這段動畫</h2>
          <p>${NOTE}</p>
          <button value="close">關閉</button>
        </form>
      </dialog>
    </main>`;
  if (!canSpeak) disableSetting('set-narration', '這個瀏覽器不支援朗讀，只顯示字幕');

  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const subtitle = $('subtitle');

  function itemHTML(it, sceneElapsed) {
    const delay = ((it.delay ?? 0) - sceneElapsed) / SPEED;
    const anim = it.anim ? ` anim-${it.anim}` : '';
    const style = `--x:${it.x}%;--y:${it.y}%;--d:${delay}s;--flip:${it.flip ? -1 : 1};animation-delay:${delay}s;`;
    if (it.kind === 'actor') {
      return `<img class="actor${anim}" src="${imageURL(`${it.who}.webp`)}" alt="" style="${style}--h:${it.h}%;">`;
    }
    if (it.kind === 'text') {
      return `<span class="ftext ${it.cls ?? ''}${anim}" style="${style}--s:${it.size};">${escapeHTML(it.text)}</span>`;
    }
    if (!PROPS[it.name]) throw new Error(`未知道具：${it.name}`);
    return `<div class="prop prop-${it.name}${anim}" style="${style}">${PROPS[it.name]()}</div>`;
  }

  function renderScene() {
    const s = scenes[idx];
    stage.className = `stage bg-${s.bg}${playing ? '' : ' is-paused'}`;
    stage.style.setProperty('--speed', SPEED);
    stage.setAttribute('aria-label', `第 ${idx + 1} 幕：${s.title}。${s.card ?? ''}${s.source ? `（${s.source}）` : ''}`);
    // card 空白=這一幕不放字卡(例如開場、收尾)
    // source(可省):字卡出處,顯示在字卡下方
    stage.innerHTML = `${s.card ? `<div class="card">${escapeHTML(s.card)}${s.source ? `<span class="card-src">${escapeHTML(s.source)}</span>` : ''}</div>` : ''}${s.items.map((it) => itemHTML(it, elapsed)).join('')}`;
    $('chapter').value = String(idx);
    shown = s.lines.filter((l) => l.at <= elapsed).length - 1;
    subtitle.innerHTML = shown >= 0 ? lineHTML(s.lines[shown]) : '';
  }

  function lineHTML(line) {
    return `<span class="who">${escapeHTML(roles[line.role].label)}</span>${escapeHTML(line.text)}`;
  }

  // ---------------------------------------------------------------- 旁白播放(AI 配音音檔優先,沒有或失敗才用內建朗讀)
  // 每一次念一句都是一個「播放實例」,帶世代編號 gen:只有當前實例的回呼能改狀態,而且每個實例只結束一次。
  // 事件(給 BGM 降音用):document 上的 narration:start / narration:end,一定成對;
  //   念到一半按暫停發 narration:pause、續播發 narration:resume(只在 start 與 end 之間);
  //   e.detail = { id: '幕-句', source: 'audio' | 'speech' }
  let speechGen = 0;
  let current = null; // { gen, id, source, line, audio, ended }
  let narrationSource = '';
  let lastAudioError = '';

  function emit(type, inst) {
    document.dispatchEvent(new CustomEvent(type, { detail: { id: inst.id, source: inst.source } }));
  }

  function begin(line, id, source) {
    const inst = { gen: ++speechGen, id, source, line, audio: null, ended: false };
    current = inst;
    speaking = true;
    narrationSource = source;
    emit('narration:start', inst);
    return inst;
  }

  // 結束一個實例:每個實例只發一次 narration:end;不是當前實例就不動 speaking
  function finishInst(inst) {
    if (inst.ended) return;
    inst.ended = true;
    if (inst.audio) {
      inst.audio.onended = null;
      inst.audio.onerror = null;
      inst.audio.pause();
    }
    emit('narration:end', inst);
    if (current === inst) {
      current = null;
      speaking = false;
    }
  }

  // 取消正在念的(換幕、拖動、關旁白、片尾):讓所有舊回呼過期,為當前實例補發一次 end,並清掉還沒送出的待念句
  // 只有真的在念時才 cancel():Android Chrome 在 cancel() 之後馬上 speak(),常常整句沒聲音(WY17)
  function stopSpeech() {
    speechGen += 1;
    pendingLine = null;
    const busy = (!!current && !current.ended) || !!synth?.speaking || !!synth?.pending;
    if (current) finishInst(current);
    if (synth && busy) { synth.cancel(); lastCancelAt = performance.now(); }
    speaking = false;
    return busy;
  }

  // ---------------------------------------------------------------- 待念句(WY17 收單 1)
  // 內建朗讀不直接送出,先放進「待念句」:播放中、旁白開著、語音清單載入好、cancel 後的間隔過了,才送出。
  // 間隔只算播放中的時間;暫停時不送(WebKit、Chromium 開始新句會重設暫停狀態),續播才送;
  // 拖動、切幕、關旁白(都會呼叫 stopSpeech)時清掉。待念期間算「正在念」,下一句不會插進來。
  const AFTER_CANCEL_MS = 150;
  let lastCancelAt = -Infinity; // 最近一次 cancel() 的時間:任何新句都要離它至少 AFTER_CANCEL_MS
  let pendingLine = null; // { line, id, readyAt(播放中:可送出的時間點), left(暫停中:還要等幾毫秒) }
  function queueSynth(line, id, waitMs) {
    pendingLine = { line, id, readyAt: performance.now() + waitMs, left: waitMs };
    speaking = true;
    flushPending();
  }
  // 暫停時把剩下的間隔存起來,續播再接著等
  function holdPending(on) {
    if (!pendingLine) return;
    if (on) pendingLine.readyAt = performance.now() + pendingLine.left;
    else pendingLine.left = Math.max(0, pendingLine.readyAt - performance.now());
  }
  function flushPending() {
    if (!pendingLine) return;
    const ready = Math.max(pendingLine.readyAt, lastCancelAt + AFTER_CANCEL_MS);
    if (!playing || !narration || !voicesSettled || performance.now() < ready) return;
    const { line, id } = pendingLine;
    pendingLine = null;
    speaking = false;
    speakWithSynth(line, id);
  }

  function speak(line, id) {
    if (!narration) return;
    stopSpeech();
    const entry = audioFiles[id];
    if (entry?.file) { playAudio(line, id, entry); return; }
    queueSynth(line, id, Math.max(0, lastCancelAt + AFTER_CANCEL_MS - performance.now()));
  }

  // 手機瀏覽器(iOS Safari、部分 Android)要在使用者按下去的那一刻先念過一次,之後的朗讀才會出聲:
  // 按「開始播放/播放」時先念一個無聲的空白句「解鎖」(WY17)
  let unlocked = false;
  function unlockSpeech() {
    if (!synth || !narration || unlocked) return;
    unlocked = true;
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    u.__prime = true;
    synth.speak(u);
  }

  // ---------------------------------------------------------------- 沒聲音的提示(可關)
  // kind:no-mandarin=沒有華語語音;error=朗讀出錯;slow=念了 4 秒(播放中的時間)還沒出聲
  const NOTES = {
    'no-mandarin': '這台裝置沒有華語朗讀語音，旁白只顯示字幕。',
    error: '沒有聽到旁白嗎？請確認手機的媒體音量已調高，以及 ⚙ 設定裡的「旁白朗讀」是開著的；不想聽也可以關掉旁白，只看字幕。',
    slow: '語音還在準備……沒聽到的話，請確認媒體音量與 ⚙ 設定裡的「旁白朗讀」。',
  };
  const SLOW_MS = 4000;
  let noteKind = '';
  const dismissed = new Set();
  function showNote(kind) {
    if (dismissed.has(kind)) return;
    if (noteKind === 'no-mandarin' && kind !== 'no-mandarin') return; // 沒有華語語音的提示最重要,不被蓋掉
    noteKind = kind;
    $('voice-note-text').textContent = NOTES[kind];
    $('voice-note').hidden = false;
  }
  // 之後念出聲(onstart)或音檔開始播放,就把提示收起來
  function clearVoiceNote() {
    if (!noteKind) return;
    noteKind = '';
    $('voice-note').hidden = true;
  }
  $('voice-note-close').addEventListener('click', () => {
    if (noteKind) dismissed.add(noteKind);
    noteKind = '';
    $('voice-note').hidden = true;
  });

  const live = (inst) => inst.gen === speechGen && !inst.ended; // 回呼只對「目前這一句、還沒結束」有效

  function playAudio(line, id, entry) {
    const inst = begin(line, id, 'audio');
    const a = new Audio(audioURL(entry));
    a.playbackRate = Math.min(SPEED, 2);
    inst.audio = a;
    a.onplaying = () => { if (live(inst)) clearVoiceNote(); };
    a.onended = () => { if (inst.gen === speechGen) finishInst(inst); };
    a.onerror = () => audioFailed(inst, a.error?.code);
    startAudio(inst);
  }

  // 首次播放與續播共用:失敗就改用內建朗讀念同一句;被暫停打斷(AbortError)不算失敗
  function startAudio(inst) {
    inst.audio.play().catch((err) => {
      if (err?.name !== 'AbortError') audioFailed(inst, err?.message);
    });
  }

  function audioFailed(inst, why) {
    if (!live(inst)) return; // 過期的回呼一律忽略
    lastAudioError = String(why ?? 'error');
    finishInst(inst);
    queueSynth(inst.line, inst.id, 0);
  }

  // ---------------------------------------------------------------- 語音挑選
  // Android Chrome 一開始 getVoices() 常常回空清單:先等 voiceschanged(最多 VOICE_WAIT_MS)再挑華語語音
  const VOICE_WAIT_MS = 1500;
  let voicesSettled = !synth || synth.getVoices().length > 0;
  if (!voicesSettled) {
    const done = () => { if (voicesSettled) return; voicesSettled = true; flushPending(); };
    synth.addEventListener?.('voiceschanged', done, { once: true });
    setTimeout(done, VOICE_WAIT_MS);
  }
  // voice-unavailable 只代表那一個語音不能用:記下來,換下一個華語語音再念;全部失敗才算沒有華語(WY17 收單 4)
  const badVoices = new Set();
  const voiceKey = (v) => v.voiceURI || v.name || v.lang;
  let lastVoiceLang = '';
  let lastVoiceName = '';

  function speakWithSynth(line, id) {
    if (!synth) return;
    // 只指定華語語音(⛔ 粵語等);清單裡找不到華語時「不指定語音、只設 lang=zh-TW」照念(WY17 追修):
    // Android Chrome 的 getVoices() 常只列一部分,沒列出中文時 Google TTS 照樣念得出來。
    // 真的不能念(language-unavailable/voice-unavailable,或念了 SLOW_MS 都沒出聲)才提示「沒有華語」。
    const r = roles[line.role];
    const all = synth.getVoices();
    const voice = pickVoiceFrom(all.filter((v) => !badVoices.has(voiceKey(v))), { prefer: r.voice });
    const inst = begin(line, id, 'speech');
    inst.silentMs = 0;
    inst.unlisted = all.length > 0 && !voice; // 清單裡沒有華語,靠 lang 念
    const u = new SpeechSynthesisUtterance(line.say ?? line.text); // say:同音字版,避免多音字念錯
    u.lang = 'zh-TW';
    if (voice) u.voice = voice;
    lastVoiceLang = voice?.lang ?? '';
    lastVoiceName = voice?.name ?? '';
    u.pitch = r.pitch;
    u.rate = r.rate * Math.min(SPEED, 2);
    u.onstart = () => {
      if (!live(inst)) return;
      inst.started = true;
      clearVoiceNote();
    };
    u.onend = () => { if (inst.gen === speechGen) finishInst(inst); };
    u.onerror = (e) => {
      if (!live(inst)) return; // 切幕、拖動後舊句晚到的錯誤,不影響目前的提示
      if (e?.error === 'voice-unavailable' || e?.error === 'language-unavailable') {
        if (!voice) { finishInst(inst); showNote('no-mandarin'); return; } // 沒指定語音也不能念:不再重試
        badVoices.add(voiceKey(voice));
        finishInst(inst);
        queueSynth(line, id, 0); // 換下一個華語語音再念;都不能用時 speakWithSynth 會顯示「沒有華語」
        return;
      }
      if (e?.error && !['interrupted', 'canceled'].includes(e.error)) showNote('error');
      finishInst(inst);
    };
    synth.speak(u);
  }

  // 每一格(播放中):送出待念句;念了 SLOW_MS(只算播放中的時間)還沒出聲就溫和提示
  function speechTick(dtMs) {
    flushPending();
    if (current && current.source === 'speech' && live(current) && !current.started) {
      current.silentMs += dtMs;
      if (current.silentMs >= SLOW_MS) showNote(current.unlisted ? 'no-mandarin' : 'slow');
    }
  }

  function pauseNarration(on) {
    if (synth) { if (on) synth.resume(); else synth.pause(); }
    if (current?.audio && !current.ended) {
      if (on) startAudio(current);
      else current.audio.pause();
    }
    if (current && !current.ended && !!current.held === on) {
      current.held = !on;
      emit(on ? 'narration:resume' : 'narration:pause', current);
    }
  }

  function setPlaying(on) {
    playing = on;
    stage.classList.toggle('is-paused', !on);
    $('play').textContent = on ? '⏸' : '▶';
    $('play').setAttribute('aria-label', on ? '暫停' : '播放');
    $('bigplay').hidden = true;
    pauseNarration(on);
    holdPending(on);
    if (on) { last = performance.now(); requestAnimationFrame(tick); }
  }

  function go(i, { autoplay = playing } = {}) {
    stopSpeech();
    ended = false;
    idx = Math.max(0, Math.min(scenes.length - 1, i));
    elapsed = 0;
    renderScene();
    updateBar();
    if (autoplay && !playing) setPlaying(true);
  }

  // ---------------------------------------------------------------- 進度條(可拖、可點、可用鍵盤)
  // 拖動時先暫停推進與旁白,拖動中只預覽位置;放開才提交並依原本狀態恢復;pointercancel 則回到拖動前的位置。
  let dragging = false;
  let dragFrom = null; // { t: 拖動前的整數秒, wasPlaying }
  const sceneStart = (i) => scenes.slice(0, i).reduce((sum, x) => sum + x.duration, 0);
  const fmt = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

  // 滑桿值、時間、幕號都用同一個整數秒(向下取整)
  const currentSec = () => Math.floor(sceneStart(idx) + Math.min(elapsed, scenes[idx].duration));

  function updateBar() {
    const sec = currentSec();
    const seek = $('seek');
    if (!dragging) seek.value = String(sec);
    seek.style.setProperty('--pct', `${(Number(seek.value) / TOTAL) * 100}%`);
    const label = `第 ${idx + 1} 幕・${fmt(sec)} / ${fmt(TOTAL)}`;
    seek.setAttribute('aria-valuetext', label);
    $('seektime').textContent = label;
  }

  // 跳到全片第 t 秒:換到對應的幕、依幕內秒數重建畫面;正在念的旁白取消,之後的下一句照常開始念
  function seekTo(t) {
    t = Math.max(0, Math.min(TOTAL, t));
    let i = 0;
    while (i < scenes.length - 1 && t >= sceneStart(i + 1)) i += 1;
    stopSpeech();
    ended = false;
    idx = i;
    elapsed = t - sceneStart(i);
    renderScene();
    updateBar();
  }

  function finish() {
    stopSpeech(); // 片尾也要清掉旁白,補發 narration:end
    setPlaying(false);
    ended = true;
    // 課文學習頁和動畫頁在同一課資料夾(相對於頁面網址)
    const studyHref = 'study.html';
    subtitle.innerHTML = `<span class="who">完</span>看完了！按 ▶ 可以再看一次，或<a href="${studyHref}">去讀課文 →</a>`;
  }

  function tick(now) {
    if (!playing) return;
    const dt = Math.min(0.25, (now - last) / 1000);
    last = now;
    speechTick(dt * 1000);
    const s = scenes[idx];
    const next = s.lines[shown + 1];
    // 上一句還沒念完、下一句又到點:時間停在下一句之前,念完才推進(避免截斷旁白);最多等 HOLD_MAX
    const due = next && elapsed + dt * SPEED >= next.at;
    if (due && speaking && holdWaited < HOLD_MAX) {
      holdWaited += dt * 1000; // dt 只算播放中的時間(續播時 last 會重設),暫停期間不累計
      elapsed = Math.max(elapsed, next.at - 0.001);
      stage.classList.add('is-waiting');
      updateBar();
      requestAnimationFrame(tick);
      return;
    }
    holdWaited = 0;
    stage.classList.remove('is-waiting');
    elapsed += dt * SPEED;
    if (next && elapsed >= next.at) {
      shown += 1;
      subtitle.innerHTML = lineHTML(next);
      speak(next, `${s.id}-${shown + 1}`);
    }
    updateBar();
    // 幕結束:時間到且旁白念完(最多多等 6 秒)
    if (elapsed >= s.duration && (!speaking || elapsed >= s.duration + 6)) {
      if (idx < scenes.length - 1) go(idx + 1, { autoplay: true });
      else { finish(); return; }
    }
    requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------------- 操作
  $('bigplay').addEventListener('click', () => { unlockSpeech(); setPlaying(true); $('play').focus(); });
  $('play').addEventListener('click', () => {
    unlockSpeech();
    if (ended) { go(0); setPlaying(true); return; }
    setPlaying(!playing);
  });
  $('prev').addEventListener('click', () => go(idx - 1));
  $('next').addEventListener('click', () => go(idx + 1));
  document.addEventListener('ccc:pref', (e) => {
    if (e.detail.name !== 'narration') return;
    narration = canSpeak && e.detail.value !== 'off';
    if (!narration) stopSpeech();
  });
  function dragStart() {
    if (dragging) return;
    dragFrom = { t: currentSec(), wasPlaying: playing };
    dragging = true;
    if (playing) setPlaying(false);
    stopSpeech();
  }

  function dragEnd(commit) {
    if (!dragging) return;
    const { t, wasPlaying } = dragFrom;
    dragging = false;
    dragFrom = null;
    seekTo(commit ? Number($('seek').value) : t);
    if (wasPlaying) setPlaying(true); // setPlaying 會重設計時基準
  }

  // 拖動中:只預覽(已暫停,不會換幕、不念旁白);方向鍵或點擊(沒有在拖)則直接跳
  $('seek').addEventListener('input', (e) => { seekTo(Number(e.target.value)); });
  $('seek').addEventListener('pointerdown', dragStart);
  document.addEventListener('pointerup', () => dragEnd(true));
  $('seek').addEventListener('pointercancel', () => dragEnd(false));
  $('chapter').addEventListener('change', (e) => go(Number(e.target.value)));
  $('about').addEventListener('click', () => $('about-dialog').showModal());
  $('about-dialog').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });
  $('about-dialog').addEventListener('close', () => $('about').focus());
  onSwipe(document.querySelector('.stage-wrap'), (d) => go(idx + d));
  document.addEventListener('keydown', (e) => {
    if (overlayOpen() || e.target.closest('input, textarea, select')) return;
    if (e.key === 'ArrowRight') go(idx + 1);
    else if (e.key === 'ArrowLeft') go(idx - 1);
    else if (e.key === ' ' && !e.target.closest('button')) { e.preventDefault(); $('play').click(); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing) setPlaying(false); });

  renderScene();
  updateBar();
  // 測試用(網址帶 ?speed= 時):回報目前狀態
  if (params.has('speed')) window.__anim = () => ({ idx, elapsed, playing, shown, ended, subtitle: subtitle.textContent, speaking, dragging, gen: speechGen, narrationSource, audioSrc: current?.audio?.src ?? '', audioPaused: current?.audio ? current.audio.paused : null, lastAudioError, holding: holdWaited > 0, holdWaited, lastVoiceLang, lastVoiceName, noVoice: noteKind === 'no-mandarin', noteKind, pending: !!pendingLine });
}
