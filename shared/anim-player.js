// 動畫故事播放器(共用,WY16 由第一課播放器抽出):逐幕播放 CSS/SVG 動畫,字幕同步顯示,
// 旁白:有 AI 配音音檔就播音檔,否則用瀏覽器內建朗讀(speechSynthesis);不支援朗讀或關掉旁白時,照時間軸顯示字幕。
// 各課的 animation.js 只負責提供資料與道具(PROPS),呼叫 mountAnimation()。網址 ?speed=N 可加速(測試用)。
import { escapeHTML } from './terms.js?v=a0a4eef';
import { initPage, narrationOn, disableSetting, overlayOpen, onSwipe } from './page.js?v=a0a4eef';
import { characterURL as imageURL } from './assets.js?v=a0a4eef';

// 語音:只選華語。先 zh-TW,再其他華語(zh-CN、zh-SG、cmn、zh-Hans、zh-Hant、單獨的 zh);
// ⛔ 粵語(zh-HK、yue)等其他語言。語音清單可能晚一點才載入,所以每次朗讀時重找。
export function pickVoiceFrom(voices) {
  const lang = (v) => String(v.lang ?? '').replace('_', '-');
  return voices.find((v) => /^zh-TW$/i.test(lang(v)))
    ?? voices.find((v) => /^(zh-(CN|SG|Hans|Hant)|cmn)(-|$)/i.test(lang(v)))
    ?? voices.find((v) => /^zh$/i.test(lang(v)))
    ?? null;
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
  let holdSince = 0;         // 正在等上一句念完的開始時間(performance.now);0=沒在等
  const HOLD_MAX = 15000;    // 最多等 15 秒,裝置朗讀卡住時動畫不會永遠停住

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
      <p class="voice-note" id="voice-note" role="status" hidden>這台裝置沒有華語朗讀語音，旁白只顯示字幕。</p>
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
    const style = `--x:${it.x}%;--y:${it.y}%;--d:${delay}s;animation-delay:${delay}s;`;
    if (it.kind === 'actor') {
      return `<img class="actor${anim}" src="${imageURL(`${it.who}.webp`)}" alt="" style="${style}--h:${it.h}%;">`;
    }
    if (it.kind === 'text') {
      return `<span class="ftext ${it.cls ?? ''}${anim}" style="${style}--s:${it.size};">${escapeHTML(it.text)}</span>`;
    }
    if (!PROPS[it.name]) throw new Error(`未知道具：${it.name}`);
    return `<div class="prop prop-${it.name}" style="${style}">${PROPS[it.name]()}</div>`;
  }

  function renderScene() {
    const s = scenes[idx];
    stage.className = `stage bg-${s.bg}${playing ? '' : ' is-paused'}`;
    stage.style.setProperty('--speed', SPEED);
    stage.setAttribute('aria-label', `第 ${idx + 1} 幕：${s.title}。${s.card}`);
    stage.innerHTML = `<div class="card">${escapeHTML(s.card)}</div>${s.items.map((it) => itemHTML(it, elapsed)).join('')}`;
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

  // 取消正在念的(換幕、拖動、關旁白、片尾):讓所有舊回呼過期,並為當前實例補發一次 end
  function stopSpeech() {
    speechGen += 1;
    if (current) finishInst(current);
    if (synth) synth.cancel();
    speaking = false;
  }

  function speak(line, id) {
    if (!narration) return;
    stopSpeech();
    const entry = audioFiles[id];
    if (entry?.file) playAudio(line, id, entry);
    else speakWithSynth(line, id);
  }

  function playAudio(line, id, entry) {
    const inst = begin(line, id, 'audio');
    const a = new Audio(audioURL(entry));
    a.playbackRate = Math.min(SPEED, 2);
    inst.audio = a;
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
    if (inst.gen !== speechGen || inst.ended) return; // 過期的回呼一律忽略
    lastAudioError = String(why ?? 'error');
    finishInst(inst);
    speakWithSynth(inst.line, inst.id);
  }

  let noVoice = false;
  function noMandarinVoice() {
    noVoice = true;
    $('voice-note').hidden = false;
  }

  function speakWithSynth(line, id) {
    if (!synth) return;
    // 只用華語語音;裝置有語音清單、卻沒有任何華語語音時,不朗讀(⛔ 自動改用粵語等),提示使用者只看字幕
    const voices = synth.getVoices();
    const voice = pickVoiceFrom(voices);
    if (voices.length && !voice) { noMandarinVoice(); return; }
    const inst = begin(line, id, 'speech');
    const u = new SpeechSynthesisUtterance(line.say ?? line.text); // say:同音字版,避免多音字念錯
    const r = roles[line.role];
    u.lang = 'zh-TW';
    if (voice) u.voice = voice;
    u.pitch = r.pitch;
    u.rate = r.rate * Math.min(SPEED, 2);
    u.onend = () => { if (inst.gen === speechGen) finishInst(inst); };
    u.onerror = u.onend;
    synth.speak(u);
  }

  function pauseNarration(on) {
    if (synth) { if (on) synth.resume(); else synth.pause(); }
    if (current?.audio && !current.ended) {
      if (on) startAudio(current);
      else current.audio.pause();
    }
  }

  function setPlaying(on) {
    playing = on;
    stage.classList.toggle('is-paused', !on);
    $('play').textContent = on ? '⏸' : '▶';
    $('play').setAttribute('aria-label', on ? '暫停' : '播放');
    $('bigplay').hidden = true;
    pauseNarration(on);
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
    const s = scenes[idx];
    const next = s.lines[shown + 1];
    // 上一句還沒念完、下一句又到點:時間停在下一句之前,念完才推進(避免截斷旁白);最多等 HOLD_MAX
    const due = next && elapsed + dt * SPEED >= next.at;
    if (due && speaking && (!holdSince || now - holdSince < HOLD_MAX)) {
      if (!holdSince) holdSince = now;
      elapsed = Math.max(elapsed, next.at - 0.001);
      stage.classList.add('is-waiting');
      updateBar();
      requestAnimationFrame(tick);
      return;
    }
    holdSince = 0;
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
  $('bigplay').addEventListener('click', () => { setPlaying(true); $('play').focus(); });
  $('play').addEventListener('click', () => {
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
  if (params.has('speed')) window.__anim = () => ({ idx, elapsed, playing, shown, ended, subtitle: subtitle.textContent, speaking, dragging, gen: speechGen, narrationSource, audioSrc: current?.audio?.src ?? '', audioPaused: current?.audio ? current.audio.paused : null, lastAudioError, holding: !!holdSince, noVoice });
}
