// 網站背景音樂(WY11):全部用 Web Audio 即時合成,⛔ 載入任何音檔(CLAUDE.md 聲音條)。
// 三首五聲音階(宮商角徵羽 = C D E G A)短循環:動畫=story、閱讀頁=read、測驗與講堂=quiz,依網址自動選。
// 播放規則:
//   - 預設關閉;開關存本機 ccc:music('on'/'off'),讀寫失敗只在本頁有效。
//   - 使用者真的點/按過(isTrusted)才建立或喚醒 AudioContext(iOS、Android 的自動播放限制)。
//   - 旁白開始(document 上的 narration:start)降到 30%,全部結束(narration:end)後回升。
//   - 分頁切到背景就 suspend(排程時間跟著凍結,回來不會補排一堆音),回前景再 resume。
// 參考遊戲集錦 dev/shared/sound.js 的字串譜、前瞻排程、軟限幅做法(兩個 repo 不共用檔)。

// ---------------------------------------------------------------- 曲譜
// 一格=八分音符;音名起音、`-` 延長上一個音、`.` 休止;打擊聲部 W=木魚、B=小鈴。
const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export function noteFrequency(name) {
  const m = /^([A-G])(#|b)?(\d)$/.exec(name);
  if (!m) return null;
  const midi = (Number(m[3]) + 1) * 12 + NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  return 440 * 2 ** ((midi - 69) / 12);
}

export const HITS = Object.freeze(['W', 'B']);

// 字串譜 → { steps, notes:[{ step, length, freq }|{ step, length:1, hit }] };音名錯誤丟錯(由測試把關)。
export function parseTrack(notes) {
  const cells = notes.trim().split(/\s+/);
  const out = [];
  cells.forEach((cell, step) => {
    if (cell === '.') return;
    if (HITS.includes(cell)) { out.push({ step, length: 1, hit: cell }); return; }
    if (cell === '-') {
      const last = out.at(-1);
      if (last && !last.hit && last.step + last.length === step) last.length += 1;
      return;
    }
    const freq = noteFrequency(cell);
    if (!freq) throw new Error(`未知音名 ${cell}`);
    out.push({ step, length: 1, freq, name: cell });
  });
  return { steps: cells.length, notes: out };
}

// 低音、分解和弦用的和弦(只用五聲音):根音 [低, 高]
const ROOT = { C: ['C3', 'C4'], D: ['D3', 'D4'], E: ['E3', 'E4'], G: ['G2', 'G3'], A: ['A2', 'A3'] };
const ARP = { A: ['A2', 'E3', 'A3', 'C4'], C: ['C3', 'G3', 'C4', 'E4'], D: ['D3', 'A3', 'D4', 'E4'], G: ['G2', 'D3', 'G3', 'A3'] };
const bars = (list) => list.join('  ');
const each = (roots, fn) => bars(roots.split(' ').map(fn));

export const SONGS = Object.freeze({
  // ① 動畫故事:徵調(G 為主音),活潑,八分音符為主
  story: {
    title: '動畫:撥弦小調',
    bpm: 112,
    tracks: [
      { voice: 'pluck', gain: 0.5, notes: bars([
        'G4 - A4 C5 D5 - C5 A4', 'G4 - - . E4 G4 A4 -', 'C5 - D5 E5 D5 C5 A4 C5', 'D5 - - - . . D5 E5',
        'G5 - E5 D5 E5 - D5 C5', 'A4 - C5 A4 G4 - E4 G4', 'A4 C5 D5 E5 D5 - C5 A4', 'G4 - - - . . . .',
        'E5 - D5 E5 G5 - E5 D5', 'C5 - D5 C5 A4 - G4 A4', 'C5 - A4 C5 D5 E5 D5 C5', 'A4 - - - . . A4 C5',
        'D5 - E5 D5 C5 A4 G4 A4', 'C5 - D5 - E5 - G5 -', 'E5 D5 C5 A4 G4 A4 C5 D5', 'G4 - - - - - . .',
      ]) },
      { voice: 'bass', gain: 0.42, notes: each('G E C D E A C G C A C A D C A G',
        (r) => `${ROOT[r][0]} - . ${ROOT[r][1]} ${ROOT[r][0]} - ${ROOT[r][1]} .`) },
      { voice: 'perc', gain: 0.22, notes: each('1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
        (n) => (n === '4' ? 'W . W . W . W W' : 'W . . W . . W .')) },
      { voice: 'perc', gain: 0.16, notes: each('1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
        (n) => (n === '1' ? 'B . . . . . . .' : '. . . . . . . .')) },
    ],
  },
  // ② 閱讀頁:羽調(A 為主音),安靜、留白,無鼓
  read: {
    title: '閱讀:笛聲慢板',
    bpm: 66,
    tracks: [
      { voice: 'flute', gain: 0.34, notes: bars([
        'A4 - - - C5 - D5 -', 'E5 - - - - - . .', 'D5 - C5 - A4 - G4 -', 'A4 - - - - - . .',
        'C5 - - - D5 - E5 -', 'G5 - - - E5 - - -', 'D5 - - - C5 - D5 -', 'E5 - - - - - . .',
        '. . . . . . . .', 'E5 - - - G5 - E5 -', 'D5 - - - C5 - - -', 'A4 - C5 - D5 - - -',
        'C5 - - - A4 - - -', 'G4 - - - - - . .', 'A4 - - - C5 - - -', 'D5 - E5 - D5 - C5 -',
        'A4 - - - - - - -', '. . . . . . . .', 'E4 - - - G4 - A4 -', 'A4 - - - - - . .',
      ]) },
      { voice: 'pluck', gain: 0.3, notes: each('A C D A C G D A A C D A C G A D A A G A',
        (r) => `${ARP[r][0]} . ${ARP[r][1]} . ${ARP[r][2]} . ${ARP[r][3]} .`) },
      { voice: 'perc', gain: 0.14, notes: each('1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
        (n) => (n === '1' ? 'B . . . . . . .' : '. . . . . . . .')) },
    ],
  },
  // ③ 測驗、講堂:宮調(C 為主音),輕快
  quiz: {
    title: '測驗:輕快宮調',
    bpm: 126,
    tracks: [
      { voice: 'pluck', gain: 0.5, notes: bars([
        'C5 . E5 . G5 - E5 D5', 'C5 - A4 C5 D5 - . .', 'E5 . G5 . A5 - G5 E5', 'D5 - - - . . . .',
        'C5 D5 E5 G5 E5 D5 C5 A4', 'G4 - A4 - C5 - . .', 'D5 . E5 . D5 C5 A4 C5', 'D5 - - - . . . .',
        'G5 . E5 . G5 - A5 G5', 'E5 - D5 - C5 - . .', 'A4 . C5 . D5 E5 D5 C5', 'A4 - G4 - . . . .',
        'C5 D5 E5 . G5 . E5 D5', 'C5 - A4 - G4 - A4 -', 'C5 . D5 . E5 D5 E5 G5', 'C5 - - - . . . .',
      ]) },
      { voice: 'bass', gain: 0.4, notes: each('C A C G C G D G C A A G C A D C',
        (r) => `${ROOT[r][0]} . ${ROOT[r][1]} . ${ROOT[r][0]} . ${ROOT[r][1]} .`) },
      { voice: 'perc', gain: 0.2, notes: each('1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
        () => 'W . . . W . W .') },
    ],
  },
});

// 依網址選曲:動畫頁=story、測驗與講堂=quiz、其他(首頁、故事、課文、人物)=read
export function songForPath(pathname = '') {
  if (/\/animation\.html$/.test(pathname)) return 'story';
  if (/\/quiz\.html$/.test(pathname) || /\/classroom\//.test(pathname)) return 'quiz';
  return 'read';
}

// ---------------------------------------------------------------- 音量
// 各曲音量係數:用 OfflineAudioContext 經正式音色與總線渲染一整輪實測 RMS 校準,三首差距 ≤ 1 dB
// (tests/audio-browser.test.js 把關;改曲譜或音色後要重量、重調這裡)。
export const SONG_LEVEL = Object.freeze({ story: 0.77, read: 0.51, quiz: 0.84 }); // 2026-10-20 實測:三首約 -34 dBFS RMS

// 整體音量刻意溫和:總線 0.25;旁白時再降到 30%
export const LEVELS = Object.freeze({ master: 0.25, music: 0.7, duck: 0.3 });
const DUCK_DOWN = 0.15, DUCK_UP = 0.6; // 秒:降下快、回升慢
const FADE_IN = 1.5, FADE_OUT = 0.5, LOOKAHEAD = 0.25, TICK_MS = 60;
export const MEDIA_TITLE = '文言文小幫手 背景音樂'; // 系統媒體控制條上顯示的名稱(WY38)
// 軟限幅(總線後):|x| ≤ knee 原樣通過,超過才平滑壓縮,疊音也不削波;⛔ 內建 DynamicsCompressor(會吃起音)
const LIMIT = { knee: 0.6, width: 1, range: 4, size: 2049 };
export function limiterCurve({ knee, width, range, size } = LIMIT) {
  const curve = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const u = ((i / (size - 1)) * 2 - 1) * range;
    const a = Math.abs(u);
    curve[i] = a <= knee ? u : Math.sign(u) * (knee + (1 - knee) * Math.tanh((a - knee) / width));
  }
  return curve;
}

export const MUSIC_KEY = 'ccc:music';
// 一首曲子一輪的秒數
export const loopSeconds = (name) => parseTrack(SONGS[name].tracks[0].notes).steps * 30 / SONGS[name].bpm;

// ---------------------------------------------------------------- 合成(即時播放與離線渲染共用)
// 總線:曲子 bus → 降音 duck → 總音量 master → 軟限幅 → 喇叭
function makeOutput(context, duckLevel = 1) {
  const master = context.createGain();
  const duck = context.createGain();
  const limiter = context.createWaveShaper?.() ?? null;
  master.gain.setValueAtTime(limiter ? LEVELS.master / LIMIT.range : LEVELS.master, context.currentTime);
  duck.gain.setValueAtTime(duckLevel, context.currentTime);
  duck.connect(master);
  if (limiter) {
    limiter.curve = limiterCurve();
    master.connect(limiter);
    limiter.connect(context.destination);
  } else master.connect(context.destination);
  return { master, duck };
}

// 一首曲子的排程狀態;at=第 0 格的時間
function makeTrack(context, name, at, out) {
  const s = SONGS[name];
  const bus = context.createGain();
  bus.connect(out);
  const parts = s.tracks.map((t) => ({ ...t, ...parseTrack(t.notes) }));
  return { name, parts, step: 30 / s.bpm, steps: parts[0].steps, at, next: 0, bus, live: new Set(), timer: null, cleanup: null, level: LEVELS.music * SONG_LEVEL[name] };
}

// 排第 t.next 格的所有音(每個音一組振盪器+增益,結束自動斷開)
function scheduleStep(context, t) {
  const when = t.at + t.next * t.step;
  const index = t.next % t.steps;
  const osc = (type, freq) => {
    const o = context.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, when);
    return o;
  };
  const decay = (level, length) => { // 撥弦:5ms 起音後指數衰減
    const g = context.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(level, when + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, when + length);
    return g;
  };
  const shape = (level, hold) => { // 笛:80ms 柔和起音→維持→150ms 收尾
    const g = context.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(level, when + 0.08);
    if (hold > 0.08) g.gain.setValueAtTime(level, when + hold);
    g.gain.linearRampToValueAtTime(0, when + hold + 0.15);
    return g;
  };
  const wire = (o, g, end, extra = null) => {
    o.connect(g);
    g.connect(t.bus);
    o.start(when);
    o.stop(end);
    t.live.add(o);
    o.onended = () => { t.live.delete(o); o.disconnect(); g.disconnect(); extra?.disconnect(); };
  };
  const VOICES = {
    pluck(n, len, level) { // 仿古箏:三角波+高八度正弦泛音,尾音略長於譜面
      const length = Math.min(1.5, len + 0.5);
      wire(osc('triangle', n.freq), decay(level, length), when + length);
      wire(osc('sine', n.freq * 2), decay(level * 0.25, Math.min(0.4, length)), when + 0.4);
    },
    flute(n, len, level) { // 笛:正弦+5Hz 輕顫音
      const o = osc('sine', n.freq);
      const hold = Math.max(0.1, len - 0.05);
      const end = when + hold + 0.15;
      try {
        const lfo = osc('sine', 5);
        const depth = context.createGain();
        depth.gain.setValueAtTime(n.freq * 0.006, when);
        lfo.connect(depth);
        depth.connect(o.frequency);
        lfo.start(when);
        lfo.stop(end);
        t.live.add(lfo);
        lfo.onended = () => { t.live.delete(lfo); lfo.disconnect(); depth.disconnect(); };
      } catch { /* 不支援調變時就不顫音 */ }
      wire(o, shape(level, hold), end);
    },
    bass(n, len, level) {
      const length = Math.min(1.2, len + 0.3);
      wire(osc('triangle', n.freq), decay(level, length), when + length);
    },
    perc(n, len, level) {
      if (n.hit === 'W') { // 木魚:正弦 900→700Hz、60ms
        const o = osc('sine', 900);
        o.frequency.exponentialRampToValueAtTime(700, when + 0.06);
        wire(o, decay(level, 0.06), when + 0.07);
      } else { // 小鈴:高音正弦+非整數倍泛音、長衰減
        wire(osc('sine', 2093), decay(level, 1.4), when + 1.4);
        wire(osc('sine', 2093 * 2.76), decay(level * 0.3, 0.6), when + 0.6);
      }
    },
  };
  for (const part of t.parts) {
    for (const n of part.notes) if (n.step === index) VOICES[part.voice](n, n.length * t.step, part.gain);
  }
  t.next += 1;
}

// 離線渲染(試聽樣本與響度測試):在給定的 context(通常是 OfflineAudioContext)從 0 秒起排完 seconds 秒,
// 經過和即時播放相同的音色、總線與限幅器;不淡入。
export function renderSong(context, name, seconds = loopSeconds(name)) {
  const { duck } = makeOutput(context);
  const t = makeTrack(context, name, 0, duck);
  t.bus.gain.setValueAtTime(t.level, 0);
  while (t.at + t.next * t.step < seconds) scheduleStep(context, t);
  return t;
}

// ---------------------------------------------------------------- 播放器
// env 可注入(測試用假的 document/localStorage/AudioContext/setTimeout),不需要真的音訊裝置。
export function createMusic(env = globalThis, { song = songForPath(env.location?.pathname) } = {}) {
  const doc = env.document;
  const readPref = () => {
    try { return env.localStorage?.getItem(MUSIC_KEY) === 'on'; } catch { return null; } // null=讀不到
  };
  let on = readPref() ?? false;
  let context = null, out = null, track = null;
  // 旁白狀態:talking=正在念的句數(start/end 成對,保險起見不低於 0);held=那一句被暫停了(沒在發聲)
  let talking = 0, held = false;
  const fading = new Set();

  const supported = () => !!(env.AudioContext || env.webkitAudioContext);
  const hidden = () => doc?.visibilityState === 'hidden';
  const now = () => context.currentTime;
  const ducked = () => talking > 0 && !held;

  // 只有使用者真的操作才建立/喚醒(iOS 要在 touchend/click 裡 resume 才算數)
  function unlock(event) {
    if (!event?.isTrusted || !on || hidden() || !supported()) return;
    try {
      if (!context) {
        const Ctx = env.AudioContext || env.webkitAudioContext;
        context = new Ctx();
        out = makeOutput(context, ducked() ? LEVELS.duck : 1);
      }
      // 每次手勢都再試一次:iOS 在 pointerdown 裡的 resume 可能一直不成立,要等 touchend/click
      if (context.state !== 'running') Promise.resolve(context.resume()).catch(() => {}).finally(sync);
    } catch { context = null; return; } // 不支援或被拒絕:靜默,頁面照常
    sync();
  }
  for (const type of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) doc?.addEventListener(type, unlock, true);

  // 別頁改過開關(bfcache 恢復、回前景、別的分頁):先重讀偏好、通知 ⚙ 更新,再決定要不要恢復音訊
  function refresh() {
    const stored = readPref();
    if (stored === null || stored === on) return;
    on = stored;
    doc?.dispatchEvent?.(new (env.CustomEvent ?? CustomEvent)('ccc:music', { detail: { on } }));
    if (!on) { stopTrack(); mediaStopped(); try { context?.suspend(); } catch { /* 忽略 */ } }
  }
  function wake() {
    refresh();
    if (!context || !on || hidden()) return;
    try { Promise.resolve(context.resume()).catch(() => {}).finally(sync); } catch { /* 忽略 */ }
  }
  doc?.addEventListener('visibilitychange', () => {
    if (hidden()) { try { context?.suspend(); } catch { /* 忽略 */ } return; }
    wake();
  });
  env.addEventListener?.('pageshow', (e) => { if (e?.persisted) wake(); });
  env.addEventListener?.('storage', (e) => { if (e?.key === MUSIC_KEY || e?.key === null) wake(); });

  // 旁白降音:念的時候 30%;那句被暫停(narration:pause)就回升,續播(narration:resume)再降
  function applyDuck() {
    if (!out) return;
    const t = now(), down = ducked();
    out.duck.gain.cancelScheduledValues?.(t);
    out.duck.gain.setValueAtTime(out.duck.gain.value, t);
    out.duck.gain.linearRampToValueAtTime(down ? LEVELS.duck : 1, t + (down ? DUCK_DOWN : DUCK_UP));
  }
  doc?.addEventListener('narration:start', () => { talking += 1; held = false; applyDuck(); });
  doc?.addEventListener('narration:end', () => { talking = Math.max(0, talking - 1); if (!talking) held = false; applyDuck(); });
  doc?.addEventListener('narration:pause', () => { held = true; applyDuck(); });
  doc?.addEventListener('narration:resume', () => { held = false; applyDuck(); });

  // ---- 系統媒體控制條(WY38,使用者 Android 實機:播放時系統跳出「…+音符」長條)
  // 播放時給它正確的名稱;關掉背景音樂時讓音訊真的停(淡出後 suspend),控制條才會消失。
  // 系統控制條上按暫停=關掉背景音樂(同 ⚙);旁白朗讀是另一條路(speechSynthesis/Audio),不受影響。
  const media = () => env.navigator?.mediaSession ?? null;
  function mediaPlaying() {
    const ms = media();
    if (!ms) return;
    try {
      if (env.MediaMetadata && !ms.metadata) ms.metadata = new env.MediaMetadata({ title: MEDIA_TITLE, artist: '文言文小幫手' });
      ms.playbackState = 'playing';
      ms.setActionHandler?.('pause', () => { setEnabled(false); doc?.dispatchEvent?.(new (env.CustomEvent ?? CustomEvent)('ccc:music', { detail: { on } })); });
    } catch { /* 不支援就算了 */ }
  }
  function mediaStopped() {
    const ms = media();
    if (!ms) return;
    try { ms.playbackState = 'none'; ms.metadata = null; ms.setActionHandler?.('pause', null); } catch { /* 不支援就算了 */ }
  }
  let suspendTimer = null;
  // 關掉後等淡出做完才 suspend(避免喀一聲);期間又打開就取消
  function suspendSoon() {
    if (suspendTimer !== null) env.clearTimeout?.(suspendTimer);
    suspendTimer = env.setTimeout?.(() => { suspendTimer = null; if (!on) { try { context?.suspend(); } catch { /* 忽略 */ } } }, FADE_OUT * 1000 + 80) ?? null;
  }

  // ---- 前瞻排程:每 60ms 排未來 0.25 秒的音;計時器被延遲時跳過已過時的格子,⛔ 補排
  function startTrack() {
    for (const old of [...fading]) release(old);
    const at = now() + 0.05;
    track = makeTrack(context, song, at, out.duck);
    track.bus.gain.setValueAtTime(0, at);
    track.bus.gain.linearRampToValueAtTime(track.level, at + FADE_IN);
    tick();
    mediaPlaying();
  }
  function tick() {
    const t = track;
    if (!t) return;
    t.timer = null;
    try {
      const due = Math.ceil((now() - t.at) / t.step);
      if (due > t.next) t.next = due;
      while (t.at + t.next * t.step < now() + LOOKAHEAD) scheduleStep(context, t);
    } catch { stopTrack(); return; }
    t.timer = env.setTimeout?.(tick, TICK_MS) ?? null;
  }
  function stopTrack() {
    const t = track;
    if (!t) return;
    track = null;
    if (t.timer !== null) env.clearTimeout?.(t.timer);
    t.timer = null;
    try {
      const n = now();
      t.bus.gain.cancelScheduledValues?.(n);
      t.bus.gain.setValueAtTime(t.bus.gain.value, n);
      t.bus.gain.linearRampToValueAtTime(0, n + FADE_OUT);
      for (const o of t.live) { try { o.stop(n + FADE_OUT); } catch { /* 已停 */ } }
    } catch { /* 停止失敗不影響頁面 */ }
    fading.add(t);
    t.cleanup = env.setTimeout?.(() => { t.cleanup = null; release(t); }, FADE_OUT * 1000 + 50) ?? null;
    if (!on) { mediaStopped(); suspendSoon(); }
  }
  function release(t) {
    fading.delete(t);
    if (t.cleanup != null) env.clearTimeout?.(t.cleanup);
    t.cleanup = null;
    for (const o of t.live) { try { o.stop(); } catch { /* 已停 */ } }
    try { t.bus.disconnect(); } catch { /* 已斷 */ }
  }

  function sync() {
    const want = on && !!context && context.state === 'running' && !hidden();
    if (want && !track) startTrack();
    else if (!on && track) stopTrack(); // 背景分頁靠 suspend 凍結,不必停曲
  }

  // 開關:由 ⚙ 設定呼叫;event 是那次點擊(手勢內才能啟動音訊)
  function setEnabled(value, event) {
    on = !!value;
    if (on && suspendTimer !== null) { env.clearTimeout?.(suspendTimer); suspendTimer = null; }
    try { env.localStorage?.setItem(MUSIC_KEY, on ? 'on' : 'off'); } catch { /* 只在本頁有效 */ }
    if (on) unlock(event);
    sync();
  }

  return {
    supported,
    enabled: () => on,
    setEnabled,
    song: () => song,
    // 測試與試聽用的狀態快照
    state: () => ({
      on, song, context: context ? context.state : null, playing: track?.name ?? null,
      talking, held, duck: ducked() ? LEVELS.duck : 1, live: track ? track.live.size : 0, fading: fading.size,
    }),
  };
}

// 全站共用一個(page.js 建立;同一頁再呼叫回傳同一個)
let site = null;
export function siteMusic() {
  if (!site) site = createMusic(globalThis);
  return site;
}
