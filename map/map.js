// 文言文地圖(WY42-B2):照定案稿(docs/mockups/wy42/d-final.html)做的正式頁。
// 資料:places.js(各則、地點、國別)、borders/(世界歷史疆界切片,Cliopatria CC BY 4.0)、world-base.js(Natural Earth 底圖)。
// 標記:「AI 推算」=原文沒寫、AI 推算的年代或地點(含原文只寫國別、點標在該國都城的);地點推算的點加虛線圈。
import { initPage } from '../shared/page.js?v=bac9363';
import { escapeHTML as esc } from '../shared/terms.js?v=bac9363';
import { ERAS, STATES, ITEMS, PLACE_BY_ID, placeOf, coordsOf, sliceFor, isGuessed } from './places.js?v=bac9363';
import { WORLD_BASE as B } from './world-base.js?v=bac9363';
import { twCards, checkOf } from './taiwan-world.js?v=bac9363';
import { eraCards, KINDS } from './era-cards.js?v=bac9363';
import { COMICS } from '../idioms/comics.js?v=bac9363';
import { ECHOES } from './echoes.js?v=bac9363';
import { comicBodyHTML } from '../idioms/comic-view.js?v=bac9363';
import { COUNTRIES, LATER, PH_LINKS } from './countries.js?v=bac9363';
import { POEMS } from './poems.js?v=bac9363';
import { FAMILIES, famsOfBld } from './families.js?v=bac9363';

initPage({ paged: true });
const app = document.getElementById('app');
const NS = 'http://www.w3.org/2000/svg';
const COS = Math.cos((B.lat0 * Math.PI) / 180), K = B.width / ((B.box.e - B.box.w) * COS);
// 太平洋置中(選項,記在本機):接縫切在西經 30 度,接縫以西(美洲、格陵蘭)整塊搬到亞洲右邊。
// 路徑以「每一圈(M 開頭)」為單位搬,圈不切開,所以接縫附近的島嶼不會斷掉。
const PREF = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v === '1'; } catch { return d; } };
const savePref = (k, on) => { try { localStorage.setItem(k, on ? '1' : '0'); } catch { /* 無痕或封鎖時只在本頁有效 */ } };
let pac = PREF('ccc:map-pacific', false);
const SEAM_X = (-30 - B.box.w) * COS * K;
const wx = (x) => (pac && x < SEAM_X ? x + B.width : x);
const P = ([lon, lat]) => [wx((lon - B.box.w) * COS * K), (B.box.n - lat) * K];
const wrapCache = new Map();
const wrapD = (d) => {
  if (!pac || !d) return d;
  let r = wrapCache.get(d);
  if (r === undefined) {
    r = d.split(/(?=M)/).map((ring) => {
      const xs = [...ring.matchAll(/(-?\d+(?:\.\d+)?) -?\d/g)].map((m) => +m[1]);
      if (!xs.length || xs.reduce((a, b) => a + b, 0) / xs.length >= SEAM_X) return ring;
      return ring.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, a, b) => `${Math.round((+a + B.width) * 10) / 10} ${b}`);
    }).join('');
    wrapCache.set(d, r);
  }
  return r;
};
// 經度範圍轉成 viewBox;太平洋置中時跨過接縫的範圍,右邊界加一圈
const boxView = ([x1, y1], [x2, y2]) => [x1, y1, (x2 < x1 ? x2 + B.width : x2) - x1, y2 - y1];
const TYPE = { lesson: '課文', person: '人物', comic: '成語漫畫', poem: '詩詞' };
const PIN = { lesson: 'var(--accent)', person: '#4f6b8a', comic: 'var(--moss)', poem: '#8a5a7a' };
const GO = { lesson: '讀課文', person: '看人物', comic: '看漫畫' };
// 頁腳來源連結(新分頁開)
const CCBY = 'https://creativecommons.org/licenses/by/4.0/';
// 外部連結(延伸閱讀):新分頁開、不帶來源網址,加「↗」表示會離開本站
// 連結、圖片網址一律經 esc() 跳脫(WY77):資料裡帶 " < > & 也不會破壞 HTML;text 由呼叫端先 esc
const LX = (href, text) => `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${text} <span aria-hidden="true">↗</span><span class="sr-only">(開新分頁,離開本站)</span></a>`;
const L = (href, text) => `<a href="${esc(href)}" target="_blank" rel="noopener">${text}</a>`;
const FILLS = ['#c9a27e', '#9fb38a', '#a9b7c9', '#d1a7a0', '#c2b37a', '#b3a2c4', '#8fb3ad', '#d4b48c', '#a8b98f', '#c7a3b4'];
// 各年代一開始看的範圍 [西經, 南緯, 東經, 北緯]
// 本土在別處、在臺灣也有領土的政權:國名另外標在臺灣島上([經度, 緯度])
// 一個國家可標多處([[經度, 緯度], …]);1930 年(中華民國)朝鮮、臺灣屬日本,菲律賓屬美國,原資料沒有另外的國名(WY61)
const LABEL_AT = { 'tw-hx': { 'Dutch Republic': [120.55, 23.3], 'Spanish Empire': [121.65, 25.0] }, 'tw-rz': { 'Empire of Japan': [120.9, 23.6] },
  roc: { 'Empire of Japan': [[127.6, 37.2], [120.9, 23.6]], 'United States of America': [[121.9, 16.2]] },
  // 國家視角(WY60):統治者本土在別處的時期,國名在該國再標一次
  'kr-jprule': { 'Empire of Japan': [127.6, 37.2] }, 'ph-es': { 'Spanish Empire': [122.6, 12.2] }, 'ph-us': { 'United States of America': [122.6, 12.2] },
  'vn-han': { 'Han Dynasty': [105.6, 20.6] }, 'vn-nbc': { 'Western Jin': [105.6, 20.6] }, 'vn-tang': { 'Tang Dynasty': [105.6, 20.6] },
  // WY60 段 B 新切片
  'vn-ming': { 'Ming Dynasty': [105.6, 20.6] }, 'ph-cw': { 'United States of America': [122.6, 12.2] }, 'ph-jp': { 'Empire of Japan': [122.6, 12.2] },
  'kr-later3': { Hubaekje: [126.9, 35.3] }, 'kr-div38': { 'United States of America': [127.8, 36.4], 'Union of Soviet Socialist Republics': [126.9, 40.2] } };
const CN = [96, 18, 128, 46], TW = [116.5, 20.5, 124.5, 26.5];
const VIEW = { myth: [104, 30, 122, 40.5], xia: [104, 30, 122, 40.5], shang: [104, 28, 124, 42], xz: [100, 26, 126, 44], cq: [105, 28.5, 122.5, 41], zg: [104, 28.5, 122.5, 41.5], qin: [98, 20, 126, 44],
  xh: [96, 20, 126, 45], dh: [96, 20, 126, 45], sg: [96, 18, 126, 45], xj: [96, 18, 128, 46], dj: [92, 18, 128, 46], nbc: [100, 20, 125, 44], sui: [90, 16, 130, 48], tang: [70, 14, 130, 50],
  wd: [96, 18, 128, 46], bs: CN, ns: CN, yuan: [70, 12, 145, 62], ming: [90, 16, 130, 48], qing: [88, 16, 130, 52], roc: [80, 15, 140, 54], prc: [80, 15, 140, 54], roctw: [108, 16, 128, 30],
  out: [62, 5, 125, 45], 'tw-pre': TW, 'tw-hx': TW, 'tw-mz': TW, 'tw-ql': TW, 'tw-rz': TW, 'tw-zh': TW };
// 航線的視野:包住所有點,四周留一點空白(WY48)
// 示意航線(WY74):有名字的站 [名稱, 經度, 緯度, 路別];[null, 經度, 緯度]=經過點,只讓海路繞開陸地,不畫點、站名、箭頭,說明文字也不列
const routeStops = (r) => r.filter((q) => q[0]);
const routeText = (r) => routeStops(r).map((q, i) => (i ? ` →${q[3] ? `(${esc(q[3])})` : ''} ` : '') + esc(q[0])).join('');
const routeView = (r) => { const xs = r.map((q) => q[1]), ys = r.map((q) => q[2]); const pad = Math.max(5, (Math.max(...xs) - Math.min(...xs)) * 0.15);
  return boxView(P([Math.min(...xs) - pad, Math.max(...ys) + pad]), P([Math.max(...xs) + pad, Math.min(...ys) - pad])); };
// 國家視角的時期:用該國的視野(WY60)
const COUNTRY_OF = Object.fromEntries(COUNTRIES.map((c) => [c.id, c]));
// 時期可以有自己的視野(WY60 段 C2 美國),沒有就用該國的視野
// 東界超過 180 度(俄羅斯的楚科奇,WY66):太平洋置中時照寫,一般模式到 180 度為止(接縫以東在地圖最左邊)
const viewOf = (era) => { const [w, s, e, n] = VIEW[era] || ERAS.find((x) => x.id === era)?.view || COUNTRY_OF[ERAS.find((x) => x.id === era)?.track]?.view || CN; return boxView(P([w, n]), P([pac ? e : Math.min(e, 180), s])); };

// 完整朝代序列(WY47):沒有故事的年代也列出(灰色、標「尚無故事」),點了照樣切換疆界;track 切換中國朝代/臺灣時期線
const trackOf = (e) => e.track || 'cn';
const erasOf = (t) => ERAS.filter((e) => trackOf(e) === t);
const statesOf = (era) => STATES[era] || [];
const stateOf = (it) => statesOf(it.era).find((s) => s.id === it.state);
const itemsOf = (era) => ITEMS.filter((i) => i.era === era);
const groupsOf = (era) => [...statesOf(era).map((s) => [s, itemsOf(era).filter((i) => i.state === s.id)]), [null, itemsOf(era).filter((i) => !i.state)]].filter(([, a]) => a.length);
const noState = (era) => (era === 'myth' ? '傳說' : era === 'out' ? '域外' : '沒有國別');

// 標記(使用者裁 CPM 待裁 41 B):年代或地點由 AI 推算的(isGuessed),清單、說明一律標「AI 推算」並寫出依據;
// 地點是推算的(原文沒寫地點、只寫國別而點在都城、或古今對照待查證),地圖點另加虛線圈,選中時名牌也寫「AI 推算」
const yearGuess = (it) => it.basis === 'speaker' || it.basis === 'book' || it.basis === 'authorGuess';
const pointGuess = (it) => Boolean(it.placeGuess) || placeOf(it)?.status === '待查證';
const badges = (it) => (isGuessed(it) ? '<span class="cmap-ai">AI 推算</span>' : '');

const sp = new URLSearchParams(location.search);
const st = { era: ERAS.some((e) => e.id === sp.get('era')) ? sp.get('era') : 'cq', region: null, item: null, view: null, tab: 'list', polity: null, twc: null, route: null, layers: { today: false, echo: false, bld: false, bldall: false, fam: false }, echo: null, bld: null, fam: null };
const pv = COUNTRIES.find((c) => c.id === sp.get('pv')); if (pv && !sp.get('era')) st.era = pv.start; // ?pv=jp:直接開某國視角(WY60)
const pre = ITEMS.find((i) => i.title === sp.get('item'));
if (pre) Object.assign(st, { era: pre.era, region: pre.state, item: pre, fitPoem: pre.t === 'poem' });
const eras = () => erasOf(trackOf(ERAS.find((e) => e.id === st.era)));
const cnt = (e) => itemsOf(e.id).length;
const has = (e) => cnt(e) || cardsOf(e.id).length; // 有故事或說明卡的年代不標灰
const mobile = () => matchMedia('(max-width: 767px)').matches;

app.innerHTML = `
  <main class="cmap" data-tab="list">
    <div class="cmap-tabs" role="tablist"><button type="button" role="tab" id="t-list" aria-selected="true">年代清單</button><button type="button" role="tab" id="t-map" aria-selected="false">地圖</button></div>
    <nav class="cmap-list" id="m-list" aria-label="年代清單"></nav>
    <button type="button" class="cmap-fold-list" id="m-fold-list" aria-controls="m-list" aria-expanded="true"></button>
    <div class="cmap-split-v" id="m-split-list" role="separator" aria-orientation="vertical" aria-controls="m-list" aria-label="拖拉調整年代清單寬度(方向鍵也可以)" tabindex="0"></div>
    <section class="cmap-cards" id="m-cards" aria-label="年代清單"></section>
    <section class="cmap-right">
      <div class="cmap-axis"><div class="cmap-pv" data-where="axis"></div><button type="button" class="cmap-nav" id="m-prev" aria-label="上一個年代">‹</button><div class="cmap-track" id="m-track"></div><button type="button" class="cmap-nav" id="m-next" aria-label="下一個年代">›</button></div>
      <div class="cmap-box" id="m-box">
        <svg class="cmap-svg" id="m-svg" role="group" aria-label="地圖(標記可用 Tab 選、Enter 打開)"></svg>
        <div class="cmap-legend" id="m-legend"></div>
        <div class="cmap-tools"><button type="button" id="m-in" aria-label="放大">＋</button><button type="button" id="m-out" aria-label="縮小">－</button><button type="button" id="m-home" aria-label="回到這個年代的範圍">⌂</button><button type="button" id="m-layers" aria-label="圖層" aria-expanded="false" aria-controls="m-layer-panel">層</button></div>
        <div class="cmap-layers" id="m-layer-panel" hidden><b>圖層</b><label><input type="checkbox" data-layer="today"> 今日行政區界線</label><label><input type="checkbox" data-layer="echo"> 以古鑑今</label><label><input type="checkbox" data-layer="bld"> 重要建築</label><label class="cmap-sub"><input type="checkbox" data-layer="bldall"> 全部年代(含當時還沒蓋的)</label><label><input type="checkbox" data-layer="fam"> 地方家族(臺灣時期線)</label><small>今日界線:Natural Earth(公有領域)、內政部國土測繪中心(政府資料開放授權條款);經本站簡化。點國家看「今日大約位於」。</small><b>地圖</b><label><input type="checkbox" data-opt="refit"> 換時期時拉回該國範圍</label><label><input type="checkbox" data-opt="pac"> 太平洋置中</label><small>沒勾時,換時期會保留目前的縮放與位置;按 ⌂ 隨時拉回。</small></div>
        <p class="cmap-credit"><span>疆界:${L('https://github.com/Seshat-Global-History-Databank/cliopatria', 'Cliopatria')}(Seshat,${L(CCBY, 'CC BY 4.0')},經本站簡化)・地點座標:${L('https://www.geonames.org/', 'GeoNames')}(${L(CCBY, 'CC BY 4.0')})・部分國名:${L('https://www.wikidata.org/', 'Wikidata')}(${L('https://creativecommons.org/publicdomain/zero/1.0/', 'CC0')})・底圖:${L('https://www.naturalearthdata.com/', 'Natural Earth')}(${L('https://www.naturalearthdata.com/about/terms-of-use/', '公有領域')})・示意,非精確疆界</span></p>
      </div>
      <div class="cmap-dwrap"><div class="cmap-dhead"><div class="cmap-split-h" id="m-split-detail" role="separator" aria-orientation="horizontal" aria-label="拖拉調整說明區高度(方向鍵也可以)" tabindex="0"></div><b id="m-dtitle"></b><span class="cmap-tz" role="group" aria-label="說明文字大小"><button type="button" id="m-tz-dn" aria-label="文字縮小">A−</button><span id="m-tz-v">100%</span><button type="button" id="m-tz-up" aria-label="文字放大">A+</button></span><button type="button" class="cmap-fold-detail" id="m-fold-detail" aria-controls="m-detail" aria-expanded="true"></button></div>
      <div class="cmap-detail" id="m-detail" aria-live="polite"></div></div>
    </section>
  </main>`;
const $ = (id) => app.querySelector(`#${id}`);
const root = app.querySelector('.cmap'), svg = $('m-svg'), box = $('m-box');

// ---------------------------------------------------------------- 臺灣時期線「當時的世界」說明卡(WY48)
// 說明卡:臺灣時期線(WY48/49)+各朝代(WY50/51)
const cardsOf = (era) => [...twCards(era), ...eraCards(era)];
const curCard = () => { const cs = cardsOf(st.era); return cs.find((c) => c.id === st.twc) || cs[0]; };
// 示意圖(WY49 卡 2):南島語族的語言族譜樹。依 Blust(1999)的分法,第一層 10 根大枝裡 9 根只在臺灣(左邊九行),
// 其他一千多種語言都在第 10 根「馬來—玻里尼西亞語族」上(最下面那根再分出許多小枝)。程式繪製,不是比例圖。
const FIGS = {
  // 國旗變遷(WY50):依《中華民國國徽國旗法》第 2~4 條——旗面 3:2、青天占 1/4、白日半徑:青天橫長=1:8、光芒頂點到圓心=白日半徑 2 倍、
  // 青圈寬=白日直徑 1/15、12 道光芒各 30 度且一道朝正上方。配色:內政部只給參考色(青 C100 M80 K20、紅 Y100 M100 K5~10%),本站換算。
  // 五色旗:由上而下紅黃藍白黑(國立歷史博物館說明);比例與各條寬度沒有找到出處,畫成等寬示意。
  flags: () => {
    const W = 150, H = 100, cx = W / 4, cy = H / 4, r = W / 2 / 8, R = 2 * r, ri = R / (2 * Math.cos(Math.PI / 12)), ring = r + (2 * r) / 15;
    const star = Array.from({ length: 24 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 12, d = i % 2 ? ri : R; return `${(cx + d * Math.cos(a)).toFixed(2)} ${(cy + d * Math.sin(a)).toFixed(2)}`; }).join('L');
    const five = ['#d7262b', '#f2c018', '#2f5fa8', '#ffffff', '#1d1d1d'].map((c, i) => `<rect x="0" y="${i * 20}" width="150" height="20" fill="${c}"/>`).join('');
    return `<figure class="cmap-fig cmap-flags">
      <div><svg viewBox="0 0 150 100" role="img" aria-label="五色旗:由上而下紅、黃、藍、白、黑五條橫條">${five}<rect x=".5" y=".5" width="149" height="99" class="f-edge"/></svg><small>五色旗(1912 年起)</small></div>
      <div><svg viewBox="0 0 150 100" role="img" aria-label="青天白日滿地紅旗"><rect width="150" height="100" fill="#ec0000"/><rect width="75" height="50" fill="#0029cc"/>
        <path d="M${star}Z" fill="#ffffff"/><circle cx="${cx}" cy="${cy}" r="${ring.toFixed(2)}" fill="#0029cc"/><circle cx="${cx}" cy="${cy}" r="${r.toFixed(2)}" fill="#ffffff"/><rect x=".5" y=".5" width="149" height="99" class="f-edge"/></svg><small>青天白日滿地紅(1928 年起)</small></div>
      <figcaption>本站依《國徽國旗法》的比例繪製;五色旗各條寬度沒有找到規定,畫成等寬示意。</figcaption></figure>`;
  },
  austronesian: () => {
    const TW = ['泰雅語群', '東臺灣語群(阿美、噶瑪蘭等)', '卑南語', '排灣語', '魯凱語', '鄒語群', '布農語', '西部平原語群', '西北臺灣語群'];
    const row = 19, top = 22, rx = 18, bx = 70, H = top + row * 10 + 84;
    const ys = [...TW.map((_, i) => top + i * row), top + 9 * row + 22];
    const branch = (y, cls) => `<path d="M${rx} ${H / 2 - 10}C${bx - 30} ${H / 2 - 10} ${bx - 34} ${y} ${bx} ${y}" class="${cls}"/>`;
    const fan = Array.from({ length: 14 }, (_, i) => { const y2 = ys[9] - 16 + i * 4.6; return `<path d="M${bx + 92} ${ys[9]}L${bx + 160} ${y2}" class="t-mp"/>`; }).join('');
    return `<figure class="cmap-fig"><svg viewBox="0 0 340 ${H}" role="img" aria-label="南島語族族譜樹:第一層十根大枝,九根只在臺灣,其他一千多種語言都在第十根上">
      <rect x="${bx - 6}" y="${top - 12}" width="${340 - bx}" height="${row * 9 + 4}" rx="6" class="t-box"/>
      ${ys.map((y, i) => branch(y, i < 9 ? 't-tw' : 't-mp')).join('')}
      <circle cx="${rx}" cy="${H / 2 - 10}" r="5" class="t-root"/>
      ${TW.map((t, i) => `<circle cx="${bx}" cy="${ys[i]}" r="3.2" class="t-twd"/><text x="${bx + 7}" y="${ys[i] + 4}" class="t-lab">${t}</text>`).join('')}
      <path d="M${bx} ${ys[9]}L${bx + 92} ${ys[9]}" class="t-mp"/>${fan}
      <text x="${bx + 4}" y="${ys[9] - 6}" class="t-lab b">馬來—玻里尼西亞語族</text>
      <text x="${bx + 4}" y="${ys[9] + 56}" class="t-lab s">其他一千多種語言:菲律賓、印尼、馬達加斯加、太平洋島嶼…</text>
      <text x="${340 - 4}" y="${top - 2}" class="t-lab s" text-anchor="end">只在臺灣</text>
    </svg><figcaption>示意圖:第一層 10 根大枝,有 9 根只在臺灣(Blust 1999 的分法,本站繪製)</figcaption></figure>`;
  },
};

// 說明卡內文的一段:字串=一段文字;{ h, p }=小標+一段;{ list }=條列;{ fig }=示意圖(WY49);
// { orig, tr, h?, note? }=原文+白話對照,白話可收合(手機預設收起);{ gloss }=難詞(WY50/51)
const block = (b) => typeof b === 'string' ? `<p>${esc(b)}</p>`
  : b.orig ? `<div class="cmap-pair">${b.h ? `<h3>${esc(b.h)}</h3>` : ''}<p class="cmap-orig">${esc(b.orig)}</p>
      <details class="cmap-tr"${mobile() ? '' : ' open'}><summary>白話</summary><p>${esc(b.tr)}</p></details>${b.note ? `<p class="cmap-note">${esc(b.note)}</p>` : ''}</div>`
  : b.gloss ? `<h3>難詞</h3><dl class="cmap-gloss">${b.gloss.map(([w, d]) => `<dt>${esc(w)}</dt><dd>${esc(d)}</dd>`).join('')}</dl>`
  : b.fams ? `${b.h ? `<h3>${esc(b.h)}</h3>` : ''}<p>${esc(b.p)}</p><p class="cmap-famlinks">${b.fams.map((id) => FAMILIES.find((f) => f.id === id)).map((f) => `<button type="button" class="cmap-eralink" data-fam="${esc(f.id)}">${esc(f.name)} →</button>`).join(' ')}</p>` // WY75:按了跳到地圖上的家族
  : b.list ? `<ul class="cmap-tw-list">${b.list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`
  : b.fig ? FIGS[b.fig]?.() || '' : `${b.h ? `<h3>${esc(b.h)}</h3>` : ''}<p>${esc(b.p)}</p>`;
function twCardHTML() {
  const cs = cardsOf(st.era), c = curCard(); if (!c) return '';
  const sec = (h, t) => (t ? `<h3>${h}</h3><p>${esc(t)}</p>` : '');
  const chk = checkOf(c);
  const k = c.kind && KINDS[c.kind];
  return `<div class="cmap-card cmap-tw${k ? ` k-${c.kind}` : ''}">
    ${cs.length > 1 ? `<div class="cmap-tw-tabs" role="group" aria-label="說明卡">${cs.map((x) => `<button type="button" data-card="${x.id}" aria-pressed="${x === c}">${esc(x.tab || x.title.replace(/\(.*$/, ''))}</button>`).join('')}</div>` : ''}
    ${k || c.label ? `<p class="cmap-kindline">${k ? `<span class="cmap-kind k-${c.kind}">${k.tag}</span>${k.note ? esc(k.note) : ''}` : ''}${c.label ? `<span class="cmap-label">${esc(c.label)}</span>` : ''}</p>` : ''}
    <h2>${c.who ? '當時的世界:' : ''}${esc(c.title)}<span class="${chk === '已查證' ? 'cmap-ok' : 'cmap-ai'}">${chk}</span></h2>
    ${c.intro ? c.intro.map(block).join('') : sec('誰來了、從哪裡來', c.who) + sec('那時的世界', c.world) + sec('為什麼是臺灣', c.why) + sec(c.endLabel || '怎麼結束', c.end)}
    ${sec('在地的人', c.people)}
    ${c.todo?.length ? `<p class="cmap-src"><span class="cmap-ai">待查證</span> ${c.todo.map(esc).join(';')}</p>` : ''}
    ${c.route.length ? `<p class="cmap-routeline">示意航線:${routeText(c.route)}</p>` : ''}
    ${c.route.length ? `<button type="button" class="cmap-go" data-route="${c.id}">${st.route === c.id && !mobile() ? '收起航線' : '在地圖上看示意航線 →'}</button>` : ''}
    <details class="cmap-src"><summary>出處(${c.src.length})</summary><ul>${c.src.map((x) => `<li><a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(x.t)}</a> ${x.ok ? '已查證' : '<span class="cmap-ai">待查證</span>'}</li>`).join('')}</ul>
      <p>${c.route.length ? '內容由本站依上列資料自行撰寫;航線只是示意,不是真正的航路。' : c.intro?.some((b) => b.orig) ? '原文照錄維基文庫(標點依該站;簡體、異體字改為通行繁體字);白話與說明由本站依上列資料自行撰寫。' : '內容由本站依上列資料自行撰寫。'}</p></details>
  </div>`;
}

// ---------------------------------------------------------------- 國家視角(WY60,使用者 2026-11-01 裁 CPM 待裁 51)
// 選單:一顆下拉按鈕「視角 ○○ ▾」(桌機在時間軸左邊;手機另放在年代清單最上面),後續國家灰色不能點。
const curTrack = () => trackOf(ERAS.find((e) => e.id === st.era));
const isCountry = (e) => Boolean(e && COUNTRY_OF[trackOf(e)]?.view);
const pvHTML = (where) => {
  const c = COUNTRY_OF[curTrack()], id = `m-pv-${where}`;
  return `<button type="button" class="cmap-pv-btn" aria-haspopup="true" aria-expanded="false" aria-controls="${id}">視角 <b>${esc(c.name)}</b> <span aria-hidden="true">▾</span></button>
    <div class="cmap-pv-menu" id="${id}" role="menu" aria-label="選擇國家視角" hidden>${COUNTRIES.map((x) => `<button type="button" role="menuitemradio" aria-checked="${x.id === c.id}" data-pv="${x.id}">${esc(x.name)}<small>${erasOf(x.id).length} 個時期</small></button>`).join('')}
      ${LATER.length ? '<b>之後再做</b>' : ''}${LATER.map((n) => `<button type="button" role="menuitem" class="later" disabled>${esc(n)}</button>`).join('')}</div>`;
};
const closePV = () => { for (const m of app.querySelectorAll('.cmap-pv-menu')) { m.hidden = true; m.previousElementSibling?.setAttribute('aria-expanded', 'false'); } };
function setTrack(t) { const c = COUNTRY_OF[t]; if (c && t !== curTrack()) setEra(c.start, true); }
// 「同一時期」對照:用這個時期的代表年份,查每個視角當年是哪個時期(時期表裡沒有的寫「—」)
const yearOf = (t) => { const s = t.replace(/約|\(.*$/, '').trim(); if (!s) return null; const n = Number(s.replace(/^前/, '')); return Number.isNaN(n) ? null : s.startsWith('前') ? -n : n; };
const spanOf = (e) => { if (!e.time.includes('~')) return null; const [a, b] = e.time.split('~'); return [yearOf(a) ?? -Infinity, yearOf(b) ?? Infinity]; };
const sameTime = (y) => COUNTRIES.filter((c) => !c.overview).map((c) => [c, erasOf(c.id).filter((e) => { const sp = spanOf(e); return sp && sp[0] <= y && y <= sp[1]; })]);
function periodHTML(e) {
  const c = COUNTRY_OF[e.track], y = e.year;
  const map = c.overview ? `地圖:${yearText(+e.slice.replace('bc', '-'))}左右的疆界。這個視角涵蓋好幾國,不加深單一政權;點國家可以看說明。`
    : e.slice ? (e.clio.length ? `地圖:${yearText(+e.slice.replace('bc', '-'))}左右的疆界。加深的是這時統治今日${esc(c.name)}一帶的政權範圍。` : `地圖:${yearText(+e.slice.replace('bc', '-'))}左右的疆界;疆界資料沒有這時期的${esc(c.name)}政權。`)
    : e.need != null ? '地圖:這個時期的疆界資料還沒做好,之後補上;現在只顯示底圖。' : '地圖:疆界資料沒有這個時期,只顯示底圖。';
  const links = e.track === 'ph' ? PH_LINKS : [];
  return `<div class="cmap-card cmap-pvcard">
    <p class="cmap-kindline"><span class="cmap-kind k-pv">${esc(c.name)}</span>${e.group ? `${esc(e.group)}・越南史書稱「北屬時期」` : ''}</p>
    <h2>${esc(e.name)}<span class="${e.check ? 'cmap-ai' : 'cmap-ok'}">${e.check || '已查證'}</span></h2>
    <p>年代:${esc(e.time.replace(/^~/, '~ ').replace(/~$/, '~ 今'))}</p>
    ${e.info.map((t) => `<p>${esc(t)}</p>`).join('')}
    <p class="cmap-src">${map}</p>
    ${e.table ? `<div class="cmap-pvlink"><h3>${esc(e.table.h)}</h3><table class="cmap-pvtable">${e.table.rows.map(([a, b]) => `<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td></tr>`).join("")}</table><p class="cmap-src">${esc(e.table.note)}</p></div>` : ""}
    ${e.box ? `<div class="cmap-pvlink"><h3>${esc(e.box.h)}</h3><ul>${e.box.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
    ${links.length ? `<div class="cmap-pvlink"><h3>和臺灣的淵源</h3><ul>${links.map((l) => `<li>${esc(l.text)} ${l.href ? LX(l.href, esc(l.label)) : `<button type="button" class="cmap-eralink" data-go="${l.go.join(' ')}">${esc(l.label)}</button>`}</li>`).join('')}</ul></div>` : ''}
    <div class="cmap-same"><h3>同一時期(${yearText(y)}左右)</h3><table>${sameTime(y).map(([x, list]) => `<tr${x.id === c.id ? ' class="cur"' : ''}><th scope="row">${esc(x.name)}</th><td>${list.length ? list.map((p) => (p.id === e.id ? `<b>${esc(p.name)}</b>` : `<button type="button" class="cmap-eralink" data-era="${p.id}">${esc(p.name)}</button>`)).join('、') : '—'}</td></tr>`).join('')}</table>
      <p class="cmap-src">「—」代表時期表裡沒有列那一年,不代表沒有人住。各國的時期表都只是通行分法,起訖各說不一。</p></div>
    <p class="cmap-src">這個時期還沒有故事,先提供時期對照與疆界。</p>
    <details class="cmap-src"><summary>出處(${e.src.length})</summary><ul>${e.src.map(([t, u]) => `<li>${L(u, esc(t))}</li>`).join('')}</ul><p>內容由本站依上列資料自行撰寫;各說不一的並列。</p></details>
  </div>`;
}

// ---------------------------------------------------------------- 清單(桌機)、卡片(手機)、時間軸
function renderList() {
  $('m-list').innerHTML = eras().map((e, i, a) => `${e.group && e.group !== a[i - 1]?.group ? `<p class="cmap-grp">${esc(e.group)}</p>` : ''}
    <div class="cmap-era${e.id === st.era ? ' open cur' : ''}${has(e) ? '' : ' none'}"><button type="button" data-era="${e.id}" aria-expanded="${e.id === st.era}"><b>${e.name}</b><small>${e.time}</small><span class="cmap-cnt">${cnt(e) || (has(e) ? '說明卡' : '尚無故事')}</span></button>
      <div class="cmap-era-body">${e.id !== st.era ? '' : groupsOf(e.id).map(([s, a]) => `
        <button type="button" class="cmap-st${s && st.region === s.id ? ' sel' : ''}" ${s ? `data-state="${s.id}"` : 'disabled'}>${s ? esc(s.name) : noState(e.id)}<span class="cmap-cnt">${a.length}</span></button>
        ${a.map((it) => `<button type="button" class="cmap-it${st.item === it ? ' sel' : ''}" data-i="${ITEMS.indexOf(it)}"><span class="cmap-ty ${it.t}">${TYPE[it.t]}</span>${esc(it.title)}${badges(it)}${coordsOf(it) ? '' : '<span class="cmap-nomap">無定點</span>'}</button>`).join('')}`).join('')}</div></div>`).join('');
}
function renderCards() {
  const curE = ERAS.find((e) => e.id === st.era);
  $('m-cards').innerHTML = `<div class="cmap-pv" data-where="cards">${pvHTML('cards')}</div><div class="cmap-chips">${eras().map((e) => `<button type="button" data-era="${e.id}" aria-pressed="${e.id === st.era}"${has(e) ? '' : ' class="none"'}>${e.name} ${cnt(e) || `<small>${has(e) ? '說明卡' : '尚無故事'}</small>`}</button>`).join('')}</div>` +
    (isCountry(curE) ? periodHTML(curE) : cardsOf(st.era).length ? twCardHTML() : cnt(curE) ? '' : '<p class="cmap-none-msg">這個年代尚無故事;切到「地圖」可以看當時的疆界。</p>') +
    groupsOf(st.era).map(([s, a]) => `<h3>${s ? esc(s.name) : noState(st.era)}<span class="cmap-cnt">${a.length}</span></h3><div class="cmap-grid">${a.map((it) => `
      <button type="button" class="cmap-cardbtn" data-i="${ITEMS.indexOf(it)}"><span><span class="cmap-ty ${it.t}">${TYPE[it.t]}</span> ${badges(it)}</span><b>${esc(it.title)}</b><small>${esc(it.text)}</small></button>`).join('')}</div>`).join('');
}
function renderAxis() {
  app.querySelector('.cmap-pv[data-where="axis"]').innerHTML = pvHTML('axis');
  $('m-track').innerHTML = eras().map((e) => `<button type="button" class="cmap-stop${e.id === st.era ? ' cur' : ''}${has(e) ? '' : ' none'}" data-era="${e.id}" aria-pressed="${e.id === st.era}"><b>${e.name}</b><small>${cnt(e) ? `${cnt(e)} 則` : has(e) ? '說明卡' : '尚無故事'}</small></button>`).join('');
  const tr = $('m-track'), cur = tr.querySelector('.cur'); // 目前的年代捲到中間、看得見(不用 scrollIntoView,免得整頁跟著捲)
  if (cur) tr.scrollLeft = cur.offsetLeft - tr.offsetLeft - (tr.clientWidth - cur.offsetWidth) / 2;
}
function renderDetail() {
  const it = st.item, d = $('m-detail');
  if (st.fam && !it && !st.polity) { d.innerHTML = famHTML(st.fam); $('m-back')?.addEventListener('click', () => setTab('list')); return; }
  if (st.bld && !it && !st.polity) { d.innerHTML = bldHTML(st.bld); return; }
  if (st.echo && !it && !st.polity) { d.innerHTML = echoHTML(st.echo); return; }
  if (st.polity && !it) {
    const p = st.polity;
    d.innerHTML = `<div class="cmap-card"><h2>${esc(p.z)}${p.nt ? '<span class="cmap-ai">AI 判斷</span>' : ''}${p.zs === 'ai' ? '<span class="cmap-ai">國名 AI 整理</span>' : p.zs === 'wikidata' ? '' : '<span class="cmap-cap">中文名待補</span>'}</h2>
      <p>${esc(p.n)}・這份疆界資料記它存在於 ${yearText(p.y[0])}~${yearText(p.y[1])}</p>${p.nt ? `<p class="cmap-src">${esc(p.nt)}</p>` : ''}
      <div class="cmap-today" id="m-today"></div>${echoesIn(p)}${p.bn ? `<p class="cmap-src">${esc(p.bn)}</p>` : ''}<p class="cmap-src">中文名${p.zs === 'ai' ? '由 AI 整理、待校' : p.zs === 'wikidata' ? '取自 Wikidata' : '還沒有,先顯示英文'}。${BORDER_NOTE}</p></div>`;
    fillToday(p);
    return;
  }
  const ce = ERAS.find((e) => e.id === st.era);
  if (!it && isCountry(ce)) { d.innerHTML = mobile() ? `<div class="cmap-card empty">${esc(ce.name)} ${esc(ce.time)}:說明與「同一時期」對照在「年代清單」分頁。${mapKeys()}</div>` : periodHTML(ce); return; }
  if (!it && cardsOf(st.era).length) {
    const c = curCard();
    d.innerHTML = mobile() ? `<div class="cmap-card empty">${st.route ? `示意航線:${routeText(c.route)}` : `說明卡在「年代清單」分頁。${mapKeys()}`}</div>` : twCardHTML();
    return;
  }
  if (!it) {
    d.innerHTML = `<div class="cmap-card empty">${mobile() ? '點清單裡任一則,地圖會標出它發生的地方。' : '點左邊任一則,地圖會標出它發生的地方;拖曳地圖可以看同時期的其他國家。'}${mapKeys()}</div>`;
    return;
  }
  if (it.t === 'poem') { d.innerHTML = poemHTML(it); $('m-back')?.addEventListener('click', () => setTab('list')); return; }
  const era = ERAS.find((e) => e.id === it.era), s = stateOf(it), pl = placeOf(it);
  const when = it.basis === 'myth' ? `神話,不推算年代(${esc(it.when)})`
    : it.basis === 'text' ? `${era.name}(原文:${esc(it.when)})`
    : it.basis === 'author' ? `${era.name}(${esc(it.when)})`
    : it.basis === 'authorGuess' ? `${era.name} <span class="cmap-ai">AI 推算</span> 作者跨兩個朝代,寫作年代沒有出處,依規則掛前一朝(${esc(it.when)})`
    : `${era.name} <span class="cmap-ai">AI 推算</span> 原文沒寫年代(${esc(it.when)}),依${it.basis === 'speaker' ? '說故事的人的時代' : '成書時代'}推算`;
  let where = `${s ? esc(s.name) + '・' : ''}${esc(it.text)}`;
  if (it.placeGuess) where += ` <span class="cmap-ai">AI 推算</span> ${esc(it.placeGuess)}`;
  if (pl) where += `<br><small class="cmap-src">今地:${esc(pl.modern)}${pl.status === '待查證' ? ' <span class="cmap-ai">AI 推算</span> 古今對照待查證' : `(${esc(pl.src)})`}</small>`;
  if (!coordsOf(it)) where += '<br><small class="cmap-src">這則沒有確定地點,地圖上不標點。</small>';
  d.innerHTML = `<div class="cmap-card"><h2><span class="cmap-ty ${it.t}">${TYPE[it.t]}</span>${esc(it.title)}</h2>
    <p>年代:${when}</p><p>地點:${where}</p><p class="cmap-src">出處:${esc(it.src)}${it.sub ? '　' + esc(it.sub) : ''}</p>
    <a class="cmap-go" href="../${it.href}"${it.t === 'comic' ? ` data-comic="${esc(new URLSearchParams(it.href.split('?')[1]).get('id'))}"` : ''}>${GO[it.t]} →</a><button type="button" class="cmap-back" id="m-back">← 回清單</button></div>`;
  $('m-back')?.addEventListener('click', () => setTab('list'));
}
// 詩詞卡(WY52):原文與白話逐句對照、難詞、作者、地點與出處,全部在說明區看完,不另開頁
const stopsOf = (it) => [it.place, ...[].concat(it.to || [])].filter(Boolean).map((id) => PLACE_BY_ID[id]);
function poemHTML(it) {
  const p = POEMS[it.title], era = ERAS.find((e) => e.id === it.era), stops = stopsOf(it);
  const where = stops.length > 1 ? `<p class="cmap-routeline">詩裡的路線:${stops.map((x) => esc(x.name)).join(' → ')}</p>` : '';
  return `<div class="cmap-card cmap-poem"><h2><span class="cmap-ty poem">${TYPE.poem}</span>${esc(it.title)}</h2>
    <p class="cmap-poem-by">${esc(era.name)}${badges(it)}・${esc(p.author)}<small>${esc(p.form)}</small></p>
    ${p.lines.map(block).join('')}
    ${p.note ? `<p class="cmap-note">${esc(p.note)}</p>` : ''}
    ${block({ gloss: p.gloss })}
    <h3>作者</h3><p>${esc(p.about)}</p>
    <h3>詩裡的地方</h3>${where}${stops.length ? '' : `<p>${p.off.length ? '詩裡的地名查不到可以引用的出處' : '詩裡沒有寫到地名'},地圖上不標點,只列在清單裡。</p>`}<ul class="cmap-tw-list">${stops.map((x) => `<li>${esc(x.name)}:今${esc(x.modern)}(${esc(x.src)})</li>`).join('')}
      ${p.off.map(([n, why]) => `<li>${esc(n)}:${esc(why)}</li>`).join('')}</ul>
    <p class="cmap-src">年代:${esc(era.name)}${isGuessed(it) ? ' <span class="cmap-ai">AI 推算</span>' : ''}。${esc(it.when)}。${stops.length ? `地圖上的點是今天縣市的位置,只是示意${stops.length > 1 ? ';路線也只是示意,不是真正走的路' : ''}。` : ''}</p>
    <details class="cmap-src"><summary>出處(${p.src.length})</summary><ul>${p.src.map((x) => `<li>${L(x.u, esc(x.t))}</li>`).join('')}</ul>
      <p>原文照錄維基文庫(標點依該站;異體字改為通行繁體字);白話、難詞與說明由本站依上列資料自行撰寫。</p></details>
    <button type="button" class="cmap-back" id="m-back">← 回清單</button></div>`;
}
// 說明區標題列:顯示目前說明卡的標題;選了新的項目或國家時自動展開
function syncDetailHead() {
  const ce = ERAS.find((e) => e.id === st.era);
  $('m-dtitle').textContent = st.item?.title || st.polity?.z || st.fam?.name || st.bld?.name || st.echo?.title || (isCountry(ce) ? `${COUNTRY_OF[ce.track].name}・${ce.name}` : curCard()?.title) || '說明';
  const key = st.item ? `i:${st.item.title}` : st.polity ? `p:${st.polity.n}` : st.fam ? `f:${st.fam.id}` : st.bld ? `b:${st.bld.id}` : st.echo ? `e:${st.echo.id}` : '';
  if (lastPick !== null && key && key !== lastPick && root.classList.contains('fold-detail')) setFold('detail', false);
  lastPick = key;
}
// 地圖圖例(手機不顯示圖例,改寫在說明區):斜線、虛線圈、疆界說明
const mapKeys = () => {
  const keys = [sliceFor(st.era) ? '<i class="cmap-sw bare"></i>灰色斜線=當時沒有國家政權的地區(不代表無人居住)' : '', itemsOf(st.era).some(pointGuess) ? '<i class="cmap-sw guess"></i>點加虛線圈=地點 AI 推算' : '',
    st.layers.bld ? `<i class="cmap-sw bld"></i>樓閣=重要建築(${st.layers.bldall ? '全部年代' : '只顯示這個年代結束前已經蓋好的'})${curTrack() === 'tw' ? ';日本、韓國、越南、菲律賓、泰國、美國、荷蘭、俄羅斯的建築:把地圖縮小就看得到' : ''}` : '',
    st.layers.fam && curTrack() === 'tw' ? '<i class="cmap-sw fam"></i>家=地方家族(只顯示這個年代有活動的家族)' : ''].filter(Boolean);
  return `${keys.length ? `<p class="cmap-keys">${keys.join('　')}</p>` : ''}${sliceFor(st.era) ? `<p class="cmap-src">${BORDER_NOTE}</p>` : ''}`;
};
// ---------------------------------------------------------------- 今昔對比(WY54)
// 點國家:列出「今日大約位於」的國家與一級行政區(比例由 docs/research/wy54/build-today.mjs 預先算好,按年代載入);
// 圖層「今日行政區界線」:今日國界(細實線)與一級行政區(細虛線)疊在歷史疆界上。用詞一律「今日大約位於」,不寫「屬於」。
const todayCache = new Map();
const todayJSON = (f) => { if (!todayCache.has(f)) todayCache.set(f, fetch(`today/${f}.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null)); return todayCache.get(f); };
const TODAY_SRC = '比例由本站預先計算:邊界都經過簡化,比例只是約略值。今日國界與行政區:Natural Earth(實際控制線,公有領域);臺灣縣市:內政部國土測繪中心開放資料。中國、臺灣、日本、南北韓、蒙古列到一級行政區,其他國家只列到國家;國名取 Wikidata(CC0)並經本站校對。';
async function fillToday(p) {
  const name = sliceFor(st.era, st.region || st.item?.state);
  const [rows, names] = await Promise.all([name ? todayJSON(name) : null, todayJSON('names')]);
  const box = $('m-today'); if (!box || st.polity !== p) return;
  const list = rows?.[p.n];
  if (!list || !names) { box.innerHTML = ''; return; }
  box.innerHTML = `<h3>今日大約位於</h3><ul>${list.map(([c, pct, a1]) => {
    const sub = a1.reduce((a, x) => a + x[1], 0), rest = pct - sub;
    return `<li><b>${esc(names[c] || c)}</b> 約 ${pct}%<i class="cmap-bar" style="width:${Math.max(4, pct)}px"></i>${a1.length ? `<small>${a1.map(([k, v]) => `${esc(names[k] || k)} ${v}%`).join('、')}${rest > 0 ? `、其他 ${rest}%` : ''}</small>` : ''}</li>`;
  }).join('')}</ul><p class="cmap-src">${TODAY_SRC}</p>
    <details class="cmap-src"><summary>資料來源與授權</summary><p>${TODAY_CREDIT}</p></details>`;
}
// 政府資料開放授權條款要求的署名格式(CPM 待裁 45 A)
const TODAY_CREDIT = `今日國界與一級行政區:${L('https://www.naturalearthdata.com/', 'Natural Earth')} 1:10m v5.1.2(公有領域)。臺灣縣市:內政部國土測繪中心 2025 直轄市、縣市界線(TWD97經緯度)開放資料(下載日 2026-11-01)。此開放資料依政府資料開放授權條款(Open Government Data License)進行公眾釋出,使用者於遵守本條款各項規定之前提下,得利用之。授權條款:${L('https://data.gov.tw/license', 'https://data.gov.tw/license')}。本站經簡化並計算重疊比例。`;
const LAYER_KEY = (k) => `ccc:map-layer-${k}`;
const layerPref = (k) => { try { return localStorage.getItem(LAYER_KEY(k)); } catch { return null; } };
const fineLand = () => todayJSON('land-detail');
const layerOn = (k) => { try { return localStorage.getItem(LAYER_KEY(k)) === '1'; } catch { return false; } };
// ---------------------------------------------------------------- 以古鑑今(WY56)
// 圖層打開時,地圖上在今日地點標「古」;點國家時,年代相符、點落在該國疆界內的條目列在「今日大約位於」下方。
const eraName = (id) => ERAS.find((e) => e.id === id)?.name || id;
function echoHTML(e) {
  return `<div class="cmap-card cmap-echo"><p class="cmap-kindline"><span class="cmap-kind k-echo">以古鑑今</span>今日地點:${esc(e.place)}</p><h2>${esc(e.title)}</h2>
    ${e.body.map((t) => `<p>${esc(t)}</p>`).join('')}
    ${e.eras.length ? `<p>相關年代:${e.eras.map((x) => `<button type="button" class="cmap-eralink" data-era="${x}">${esc(eraName(x))} →</button>`).join(' ')}</p>` : ''}
    <details class="cmap-src"><summary>出處(${e.src.length})</summary><ul>${e.src.map((x) => `<li>${L(x.u, esc(x.t))}</li>`).join('')}</ul><p>內容由本站依上列資料自行撰寫;說法不一的並列。座標:Wikidata(CC0)。</p></details></div>`;
}
// 點在不在多邊形內(SVG 路徑,偶奇規則)
const inPath = (d, [x, y]) => { let c = false; for (const ring of d.split('M').filter(Boolean)) { const pts = ring.replace('Z', '').split('L').map((t) => t.split(' ').map(Number)); for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } } return c; };
const echoesIn = (p) => { const list = ECHOES.filter((e) => e.eras.includes(st.era) && inPath(wrapD(p.d), P(e.at))); return list.length ? `<h3>以古鑑今</h3><p>${list.map((e) => `<button type="button" class="cmap-eralink" data-echo="${e.id}">${esc(e.title)} →</button>`).join(' ')}</p>` : ''; };
// ---------------------------------------------------------------- 重要建築(WY55)
// 圖層打開時,只顯示目前年代結束前已經蓋好的建築(依建造年份);勾「全部年代」則全部顯示。圖示為本站 SVG 繪製的小樓閣;
// 點位只標到城市的(approx)外加虛線圈,和 AI 推算點位同一種樣式。臺灣:文化部文化資產局開放資料;中國:各篇原文與出處。
const bldJSON = () => todayJSON('../buildings'); // 同一個快取:today/../buildings.json
// 其他國家的建築(WY57):中國朝代線只放中國與臺灣;臺灣時期線與各國視角才顯示其他國家(使用者 2026-11-07 裁:放「臺灣與世界」)
const bldOnTrack = (b) => b.region === 'tw' || b.region === 'cn' || curTrack() !== 'cn';
const eraEnd = (id) => { const t = (ERAS.find((e) => e.id === id)?.time || '').split('~').pop().trim(); if (!t) return 9999; const n = Number(t.replace(/[^0-9]/g, '')); return t.startsWith('前') ? -n : n || 9999; };
const BOCH_CREDIT = `文化部文化資產局 2026 文資局古蹟/文資局歷史建築開放資料(下載日 2026-11-01)。此開放資料依政府資料開放授權條款(Open Government Data License)進行公眾釋出,使用者於遵守本條款各項規定之前提下,得利用之。授權條款:${L('https://data.gov.tw/license', 'https://data.gov.tw/license')}。本站經摘要改寫。`;
function bldHTML(b) {
  return `<div class="cmap-card cmap-bld"><p class="cmap-kindline"><span class="cmap-kind k-bld">重要建築</span>${b.status ? esc(b.status) + '・' : ''}今日位置:${esc(b.where)}${b.approx ? '<span class="cmap-ai">大致位置</span>' : ''}</p><h2>${esc(b.name)}</h2>
    ${b.img ? `<figure class="cmap-bldimg"><img src="${esc(b.img.src)}" alt="${esc(b.name)}${b.img.kind === 'ai' ? '(示意圖)' : ''}" width="800" height="533" loading="lazy" decoding="async">
      <figcaption>${b.img.kind === 'ai' ? '<span class="cmap-ai">示意圖,不是照片</span> AI 生成,本站製作' : `${esc(b.img.label || '照片')}:${esc(b.img.artist)}/${L(b.img.page, '維基共享資源')}/${L(b.img.licenseUrl || b.img.page, esc(b.img.license))}(經本站裁切縮圖)`}</figcaption></figure>` : ''}
    <p>建造:${esc(b.built)}</p><p>${esc(b.history)}</p>
    ${b.link ? `<p>和中國、臺灣的往來:${esc(b.link)}</p>` : ''}
    ${b.rebuilt ? `<p class="cmap-note">重建、遷移:${esc(b.rebuilt)}</p>` : ''}
    ${b.inscription ? `<p>題字:${esc(b.inscription)}</p>` : ''}
    ${b.text ? `<p>相關篇目:${[b.text, b.alsoText].filter(Boolean).map((x) => L(x.wikisource, `${esc(x.author)}〈${esc(x.title)}〉`)).join('、')}${b.quote ? `;「${esc(b.quote)}」` : ''}</p>` : ''}
    ${b.approx ? '<p class="cmap-src">確切位置不明,點只標到城市。</p>' : ''}
    ${famsOfBld(b.id).length ? `<p>地方家族:${famsOfBld(b.id).map((f) => `<button type="button" class="cmap-eralink" data-fam="${esc(f.id)}">${esc(f.name)} →</button>`).join(' ')}</p>` : ''}
    ${b.more?.length ? `<h3>延伸閱讀</h3><ul class="cmap-more">${b.more.map((x) => `<li>${LX(x.u, esc(x.t))}</li>`).join('')}</ul>` : ''}
    <details class="cmap-src"><summary>出處(${b.src.length})</summary><ul>${b.src.map((x) => `<li>${L(x.u, esc(x.t))}</li>`).join('')}</ul><p>${b.region === 'tw' ? BOCH_CREDIT : '內容由本站依上列資料自行撰寫;座標:Wikidata(CC0)。'}</p></details></div>`;
}
// ---------------------------------------------------------------- 地方家族(WY75,使用者 2026-11-07 裁 5 題皆 A)
// 圖層只在臺灣時期線:依家族活躍的年代顯示(f.eras);宅第已是重要建築卡的,兩邊互相連過去,不重寫。
// 卡片:任何一條出處待查證,標題旁標「部分待查證」;有爭議的段落收合(使用者 11-07 裁 CD3 待裁 1=A),各說法並列、各附出處,不下評價。
const famsOn = () => (curTrack() === 'tw' ? FAMILIES.filter((f) => (st.layers.fam && f.eras.includes(st.era)) || st.fam === f) : []);
const srcLi = (x) => `<li>${L(x.u, esc(x.t))} ${x.ok ? '已查證' : '<span class="cmap-ai">待查證</span>'}</li>`;
function famHTML(f) {
  const part = f.src.some((x) => !x.ok) || f.today.some((x) => x.check);
  return `<div class="cmap-card cmap-fam"><p class="cmap-kindline"><span class="cmap-kind k-fam">地方家族</span>${f.tags.length ? f.tags.map((t) => `<span class="cmap-label">${esc(t)}</span>`).join('') : '<span class="cmap-ai">起家方式:出處待查證</span>'}今日位置:${esc(f.where)}${f.approx ? '<span class="cmap-ai">大致位置</span>' : ''}</p>
    <h2>${esc(f.name)}<span class="${part ? 'cmap-ai' : 'cmap-ok'}">${part ? '部分待查證' : '已查證'}</span></h2>
    <p>活躍年代:${f.eras.map((id) => esc(eraName(id))).join('、')}</p>${f.eras.includes(st.era) ? '' : `<p class="cmap-src">地圖目前是「${esc(eraName(st.era))}」,不在這一家的活躍年代內;圖層只會在活躍年代顯示這一家。</p>`}${f.eraNote ? `<p class="cmap-src">${esc(f.eraNote)}</p>` : ''}
    <h3>主要人物</h3><ul class="cmap-tw-list">${f.people.map((p) => `<li><b>${esc(p.n)}</b>(${esc(p.life)}):${esc(p.role)}</li>`).join('')}</ul>
    <h3>這一家做了什麼</h3>${f.story.map((t) => `<p>${esc(t)}</p>`).join('')}
    <h3>今天的關聯</h3><ul class="cmap-tw-list">${f.today.map((x) => `<li>${esc(x.t)}${x.check ? ' <span class="cmap-ai">待查證</span>' : ''}${x.bld ? ` <button type="button" class="cmap-eralink" data-bld="${esc(x.bld)}">看這棟建築 →</button>` : ''}</li>`).join('')}</ul>
    ${f.dispute?.length ? `<details class="cmap-dispute"><summary>有爭議的事(${f.dispute.length}) <span class="cmap-ai">有爭議</span></summary>${f.dispute.map((d) => `<p>${esc(d.p)}</p><ul class="cmap-tw-list">${d.views.map((v) => `<li>${esc(v.p)}(${L(v.u, esc(v.t))})</li>`).join('')}</ul>`).join('')}<p class="cmap-src">不同說法並列,本站不下評價。</p></details>` : ''}
    ${f.approx ? `<p class="cmap-src">確切位置不明,點只標到${esc(f.approx)}。</p>` : ''}
    <details class="cmap-src"><summary>出處(${f.src.length})</summary><ul>${f.src.map(srcLi).join('')}</ul><p>內容由本站依上列資料自行撰寫;座標:${esc(f.atSrc)}。${BOCH_CREDIT}</p></details>
    <button type="button" class="cmap-back" id="m-back">← 回清單</button></div>`;
}
// 每張疆界切片都附的說明(CPM 2026-10-31):資料來源、示意、參考書目(只列書名,不抄任何圖)
const BORDER_NOTE = '疆界依 Cliopatria 學術資料庫,邊界經簡化,細部與史書有出入,僅供示意;正式考據可參考譚其驤《中國歷史地圖集》。';
const yearText = (y) => (y < 0 ? `前 ${-y} 年` : `${y} 年`);

// ---------------------------------------------------------------- 地圖
const el = (tag, attrs = {}, text) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text != null) e.textContent = text; return e; };
// 地圖標記可用鍵盤操作(WY78):Tab 選到、Enter 或空白鍵等於點一下;名稱同滑鼠停留的提示;地圖重畫後焦點回到同一個標記
let refocus = null;
const act = (g, key, label, run) => {
  for (const [k, v] of Object.entries({ tabindex: '0', role: 'button', 'aria-label': label, 'data-k': key })) g.setAttribute(k, v);
  g.addEventListener('click', (ev) => { ev.stopPropagation(); if (!dragged) run(); });
  g.addEventListener('keydown', (ev) => { if (ev.key !== 'Enter' && ev.key !== ' ') return; ev.preventDefault(); ev.stopPropagation(); refocus = key; run(); });
};
const cache = new Map();
async function slice(name, level) {
  const key = `${name}-${level}`;
  if (!cache.has(key)) cache.set(key, fetch(`borders/${key}.json`).then((r) => (r.ok ? r.json() : null)).then((j) => {
    if (j) for (const p of j.polities) { const n = p.d.match(/-?\d+/g).map(Number); let [x1, y1, x2, y2] = [Infinity, Infinity, -Infinity, -Infinity]; for (let i = 0; i < n.length; i += 2) { x1 = Math.min(x1, n[i]); x2 = Math.max(x2, n[i]); y1 = Math.min(y1, n[i + 1]); y2 = Math.max(y2, n[i + 1]); } p.w = x2 - x1; p.h = y2 - y1; }
    return j;
  }).catch(() => null));
  return cache.get(key);
}
const vb = () => svg.getAttribute('viewBox').split(' ').map(Number);
const unitsPerPx = (v = vb()) => 1 / Math.min(svg.clientWidth / v[2], svg.clientHeight / v[3]);
let drawSeq = 0;
async function drawMap() {
  const seq = ++drawSeq;
  // 詩詞(WY52):選中時地圖移到包住詩裡各站的範圍(唐、元的全國視野太大,路線會看不清楚)
  // 只在剛選中時縮放一次(fitPoem);之後按 ⌂ 照舊回到這個年代的範圍
  if (st.fitPoem) { st.fitPoem = false; const s = st.item?.t === 'poem' ? stopsOf(st.item) : []; if (!st.view && s.length) st.view = routeView(s.map((q) => [q.name, ...q.at])); }
  const v = st.view || viewOf(st.era);
  svg.setAttribute('viewBox', v.join(' '));
  const u = unitsPerPx(v);
  const name = sliceFor(st.era, st.region || st.item?.state);
  const data = name ? await slice(name, v[2] > 3000 ? 'world' : 'detail') : null;
  if (seq !== drawSeq) return; // 已有更新的一次重畫
  const frag = document.createDocumentFragment();
  // 放大到東亞沿海時(WY59):改用高精度陸地,疆界填色也用它裁切,海岸線才不會有鋸齒;框外照舊用一般底圖
  const fine = v[2] < 160 ? await fineLand() : null;
  if (seq !== drawSeq) return;
  const landD = fine ? fine.d : wrapD(B.land);
  frag.append(el('path', { d: wrapD(B.land), class: 'm-land' + (fine ? ' under' : '') }));
  if (fine) {
    const [x1, y1, x2, y2] = fine.box, big = 1e5;
    const cp = el('clipPath', { id: 'm-clip' });
    cp.append(el('path', { d: fine.d }), el('path', { d: `M${-big} ${-big}H${big}V${y1}H${-big}ZM${-big} ${y2}H${big}V${big}H${-big}ZM${-big} ${y1}H${x1}V${y2}H${-big}ZM${x2} ${y1}H${big}V${y2}H${x2}Z` }));
    const defs0 = el('defs'); defs0.append(cp); frag.append(defs0);
    frag.append(el('path', { d: fine.d, class: 'm-land fine' }));
  }
  if (data) { // 當時沒有國家政權的陸地:灰色斜線(各政權底下先鋪一層不透明底色蓋掉斜線)
    const pat = el('pattern', { id: 'm-hatch', patternUnits: 'userSpaceOnUse', width: 8 * u, height: 8 * u, patternTransform: 'rotate(45)' });
    pat.append(el('rect', { width: 8 * u, height: 8 * u, class: 'm-hatch-bg' }), el('rect', { width: 3 * u, height: 8 * u, class: 'm-hatch-ln' }));
    const defs = el('defs'); defs.append(pat); frag.append(defs);
    frag.append(el('path', { d: landD, class: 'm-bare', fill: 'url(#m-hatch)' }));
  }
  for (const k of ['huang', 'yangtze', 'han']) frag.append(el('path', { d: B[k], class: 'm-river' }));
  const selState = statesOf(st.era).find((s) => s.id === (st.region || st.item?.state));
  const eraClio = st.polity ? [] : ERAS.find((e) => e.id === st.era)?.clio || []; // 國家視角:加深這時統治該國一帶的政權(WY60)
  const counts = {}; for (const it of itemsOf(st.era)) if (it.state) counts[it.state] = (counts[it.state] || 0) + 1;
  if (data) {
    const base = el('g', { class: 'm-polbase', ...(fine ? { 'clip-path': 'url(#m-clip)' } : {}) });
    for (const p of data.polities) base.append(el('path', { d: wrapD(p.d) }));
    frag.append(base);
    const g = el('g', { class: 'm-pols' + (selState?.clio || st.polity || eraClio.length ? ' has-sel' : ''), ...(fine ? { 'clip-path': 'url(#m-clip)' } : {}) });
    data.polities.forEach((p, i) => {
      const path = el('path', { d: wrapD(p.d), class: 'm-pol' + ((selState?.clio === p.n || st.polity?.n === p.n || eraClio.includes(p.n)) ? ' sel' : ''), fill: FILLS[i % FILLS.length] });
      path.addEventListener('click', () => { if (dragged) return; st.polity = st.polity?.n === p.n ? null : p; st.item = null; st.echo = null; st.bld = null; st.fam = null; st.region = statesOf(st.era).find((s) => s.clio === p.n)?.id || null; update(); });
      g.append(path);
    });
    frag.append(g);
    const fs = 13 * u;
    for (const p of data.polities) { // 國名:畫面上太小的國家不寫字,放大後才出現
      if (p.w / u < 40 || p.h / u < 14) continue;
      frag.append(el('text', { x: wx(p.l[0]), y: p.l[1] + fs * 0.35, class: 'm-pname' + (p.zs === 'ai' ? ' ai' : p.zs === 'wikidata' ? '' : ' en'), 'font-size': (p.w / u > 140 ? fs * 1.25 : fs).toFixed(1) }, p.nt ? `${p.z}?` : p.z));
    }
    for (const [n, at] of Object.entries(LABEL_AT[st.era] || {})) { // 本土在別處的政權,在臺灣島上再標一次國名
      const p = data.polities.find((q) => q.n === n); if (!p) continue;
      for (const pt of Array.isArray(at[0]) ? at : [at]) {
        const [x, y] = P(pt);
        frag.append(el('text', { x, y: y + fs * 0.35, class: 'm-pname' + (p.zs === 'ai' ? ' ai' : p.zs === 'wikidata' ? '' : ' en'), 'font-size': fs.toFixed(1) }, p.nt ? `${p.z}?` : p.z));
      }
    }
  } else {
    const ce = ERAS.find((e) => e.id === st.era), cv = isCountry(ce) && COUNTRY_OF[ce.track].view;
    const msg = cv ? (ce.need != null ? '這個時期的疆界資料還沒做好,之後補上' : '疆界資料沒有這個時期')
      : { myth: '神話沒有國別,只標原文寫到的山川', out: '佛經故事,發生在古印度', xia: '夏:傳說/考古推定,疆界資料沒有夏', 'tw-pre': '疆界資料沒有這時期的臺灣政權' }[st.era] || '';
    const at = cv ? [(cv[0] + cv[2]) / 2, (cv[1] + cv[3]) / 2 + 4] : { out: [80, 22], 'tw-pre': [120.9, 23.6] }[st.era] || [113, 36];
    const [x, y] = P(at);
    frag.append(el('text', { x, y, class: 'm-none', 'font-size': (15 * u).toFixed(1) }, msg));
  }
  // 今日行政區界線(圖層,WY54)
  if ((st.layers.today || (st.layers.bld && layerPref('today') === null)) && data) { // 開「重要建築」時一併顯示今日行政區虛線,除非使用者另外關過「今日行政區界線」
    const [l1, l0] = await Promise.all([todayJSON('lines-a1'), todayJSON('lines-a0')]);
    if (seq !== drawSeq) return;
    if (l1) frag.append(el('path', { d: wrapD(l1.d), class: 'm-today1' }));
    if (l0) frag.append(el('path', { d: wrapD(l0.d), class: 'm-today0' }));
  }
  // 重要建築(圖層,WY55):小樓閣圖示
  if (st.layers.bld || st.bld) { // 從家族卡跳過來的建築:圖層沒開也畫出那一棟
    const list = await bldJSON(); if (seq !== drawSeq) return;
    const end = eraEnd(st.era);
    // 聚合(WY59):螢幕上距離 26px 以內的建築併成一個數字圈;點了放大到能分開(圖示在螢幕上的大小固定)
    const shown = st.layers.bld ? (list || []).filter((b) => (st.layers.bldall || b.y <= end) && bldOnTrack(b)) : (list || []).filter((b) => b === st.bld);
    const groups = groupNear(shown, v, u);
    for (const gr of groups.filter((q) => q.m.length > 1 && !q.m.includes(st.bld))) { // 聚合圈
      const c = el('g', { class: 'm-clu' });
      c.append(el('circle', { cx: gr.x, cy: gr.y, r: 13 * u }), el('text', { x: gr.x, y: gr.y + 4.5 * u, 'font-size': (13 * u).toFixed(1) }, gr.m.length), el('title', {}, `${gr.m.length} 處重要建築,點了放大`));
      act(c, `bc:${gr.m[0].id}`, `${gr.m.length} 處重要建築,點了放大`, () => zoomTo(gr.m.map((b) => P(b.at))));
      frag.append(c);
    }
    for (const b of groups.filter((q) => q.m.length === 1 || q.m.includes(st.bld)).flatMap((q) => q.m)) {
      const [x, y] = P(b.at), on = st.bld?.id === b.id, s = (on ? 1.35 : 1) * u;
      const g = el('g', { class: 'm-bld' + (on ? ' on' : '') + (b.approx ? ' approx' : '') });
      if (b.approx) g.append(el('circle', { cx: x, cy: y, r: 12 * s, class: 'm-guess', stroke: '#8a5a2b' }));
      g.append(el('path', { d: `M${x - 8 * s} ${y + 7 * s}h${16 * s}v${-2.5 * s}h${-3 * s}v${-5 * s}h${4 * s}l${-9 * s} ${-7 * s}l${-9 * s} ${7 * s}h${4 * s}v${5 * s}h${-3 * s}z` }), el('title', {}, `重要建築:${b.name}`));
      act(g, `b:${b.id}`, `重要建築:${b.name}`, () => { st.bld = b; st.fam = null; st.item = null; st.polity = null; st.echo = null; update(); });
      frag.append(g);
    }
  }
  // 地方家族(圖層,WY75):「家」字圓點;靠近的併成數字圈(和建築同一套聚合);宅第就是建築卡的,建築圖層開著時往右上錯開
  const fams = famsOn();
  if (fams.length) {
    const bldOn = st.layers.bld ? new Set(((await bldJSON()) || []).filter((b) => st.layers.bldall || b.y <= eraEnd(st.era)).map((b) => b.id)) : new Set();
    if (seq !== drawSeq) return;
    const off = (f) => (f.today.some((x) => x.bld && bldOn.has(x.bld)) ? [11 * u, -11 * u] : [0, 0]);
    const groups = groupNear(fams, v, u, (f) => { const [x, y] = P(f.at), [dx, dy] = off(f); return [x + dx, y + dy]; });
    for (const gr of groups.filter((q) => q.m.length > 1 && !q.m.includes(st.fam))) {
      const c = el('g', { class: 'm-fclu' });
      c.append(el('circle', { cx: gr.x, cy: gr.y, r: 12 * u }), el('text', { x: gr.x, y: gr.y + 4.5 * u, 'font-size': (12 * u).toFixed(1) }, gr.m.length), el('title', {}, `${gr.m.length} 個地方家族,點了放大`));
      act(c, `fc:${gr.m[0].id}`, `${gr.m.length} 個地方家族,點了放大`, () => zoomTo(gr.m.map((f) => P(f.at))));
      frag.append(c);
    }
    for (const f of groups.filter((q) => q.m.length === 1 || q.m.includes(st.fam)).flatMap((q) => q.m)) {
      const [x0, y0] = P(f.at), [dx, dy] = off(f), x = x0 + dx, y = y0 + dy, on = st.fam === f;
      const g = el('g', { class: 'm-fam' + (on ? ' on' : '') + (f.approx ? ' approx' : '') });
      if (f.approx) g.append(el('circle', { cx: x, cy: y, r: 14 * u, class: 'm-guess', stroke: '#2f6f62' }));
      g.append(el('circle', { cx: x, cy: y, r: (on ? 11 : 9) * u }), el('text', { x, y: y + 3.8 * u, 'font-size': (11 * u).toFixed(1) }, '家'), el('title', {}, `地方家族:${f.name}`));
      act(g, `f:${f.id}`, `地方家族:${f.name}`, () => { st.fam = f; st.bld = null; st.item = null; st.polity = null; st.echo = null; update(); });
      frag.append(g);
    }
  }
  // 以古鑑今的「古」字標記(圖層,WY56)
  if (st.layers.echo) for (const e of ECHOES) {
    const [x, y] = P(e.at), on = st.echo === e;
    const g = el('g', { class: 'm-echo' + (on ? ' on' : '') });
    g.append(el('circle', { cx: x, cy: y, r: (on ? 12 : 10) * u }), el('text', { x, y: y + 4.2 * u, 'font-size': (12 * u).toFixed(1) }, '古'), el('title', {}, `以古鑑今:${e.title}`));
    act(g, `e:${e.id}`, `以古鑑今:${e.title}`, () => { st.echo = e; st.item = null; st.polity = null; st.bld = null; st.fam = null; update(); });
    frag.append(g);
  }
  // 都城(★)與數量泡泡
  for (const s of statesOf(st.era)) {
    const cap = PLACE_BY_ID[s.capital]; if (!cap) continue;
    const [x, y] = P(cap.at); const r = 4 * u;
    frag.append(el('path', { d: star(x, y, r), class: 'm-cap' }));
    if (counts[s.id]) {
      const bx = x + 9 * u, by = y - 9 * u;
      frag.append(el('circle', { cx: bx, cy: by, r: 8 * u, class: 'm-bub' }));
      frag.append(el('text', { x: bx, y: by + 3.8 * u, class: 'm-bubt', 'font-size': (11 * u).toFixed(1) }, counts[s.id]));
    }
  }
  // 各則的點
  for (const it of itemsOf(st.era)) {
    const at = coordsOf(it); if (!at) continue;
    const [x, y] = P(at); const on = st.item === it;
    const g = el('g', { class: 'm-pin' + (pointGuess(it) ? ' guess' : '') + (st.region && it.state !== st.region && !on ? ' dim' : '') });
    if (on) g.append(el('circle', { cx: x, cy: y, r: 11 * u, class: 'm-pulse', stroke: PIN[it.t] }));
    if (pointGuess(it)) g.append(el('circle', { cx: x, cy: y, r: (on ? 9 : 7) * u, class: 'm-guess', stroke: PIN[it.t] }));
    g.append(el('circle', { cx: x, cy: y, r: (on ? 6 : 4) * u, fill: PIN[it.t] }));
    g.append(el('title', {}, pointGuess(it) ? `${it.title}(地點 AI 推算)` : it.title));
    act(g, `i:${ITEMS.indexOf(it)}`, pointGuess(it) ? `${it.title}(地點 AI 推算)` : it.title, () => pick(it));
    frag.append(g);
  }
  // 選中的那一則:路線+名牌
  if (st.item && coordsOf(st.item)) {
    const [x, y] = P(coordsOf(st.item));
    // 路線:to 可以是一站或依序好幾站(WY52 詩詞);詩詞另在各站畫圓點與站名
    const stops = stopsOf(st.item);
    stops.slice(1).forEach((q, i) => {
      const [x1, y1] = P(stops[i].at), [x2, y2] = P(q.at); const mx = (x1 + x2) / 2 - (y2 - y1) * 0.18, my = (y1 + y2) / 2 + (x2 - x1) * 0.18;
      frag.append(el('path', { d: `M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}`, class: 'm-route' }));
      const a = Math.atan2(y2 - my, x2 - mx), h = 10 * u;
      frag.append(el('path', { d: `M${x2} ${y2}L${x2 - h * Math.cos(a - 0.45)} ${y2 - h * Math.sin(a - 0.45)}L${x2 - h * Math.cos(a + 0.45)} ${y2 - h * Math.sin(a + 0.45)}Z`, class: 'm-routeHead' }));
    });
    if (st.item.t === 'poem') stops.slice(1).forEach((q) => {
      const [sx, sy] = P(q.at), fs = 13 * u, w = (q.name.length + 1) * fs;
      let lx = sx + 8 * u; if (lx + w > v[0] + v[2] - 50 * u) lx = sx - 8 * u - w;
      frag.append(el('circle', { cx: sx, cy: sy, r: 5 * u, class: 'm-stop' }));
      frag.append(el('rect', { x: lx, y: sy - fs * 1.3, width: w, height: fs * 1.5, rx: 4 * u, class: 'm-tag' }));
      frag.append(el('text', { x: lx + fs * 0.5, y: sy - fs * 0.15, class: 'm-tagt', 'font-size': fs.toFixed(1) }, q.name));
    });
    const tag = pointGuess(st.item) ? `${st.item.title}・AI 推算` : st.item.title;
    const fs = 14 * u, w = (tag.length + 1) * fs;
    let lx = x + 9 * u; if (lx + w > v[0] + v[2] - 50 * u) lx = x - 9 * u - w;
    frag.append(el('rect', { x: lx, y: y - fs * 1.6, width: w, height: fs * 1.5, rx: 4 * u, class: 'm-tag' }));
    frag.append(el('text', { x: lx + fs * 0.5, y: y - fs * 0.45, class: 'm-tagt', 'font-size': fs.toFixed(1) }, tag));
  }
  // 臺灣時期說明卡的示意航線(WY48):依序連線;WY74 起整條用平順曲線穿過經過點,箭頭、圓點、站名只畫在有名字的站
  const rc = st.route && cardsOf(st.era).find((c) => c.id === st.route);
  if (rc) {
    const pts = rc.route.map((q) => P([q[1], q[2]])), fs = 13 * u, f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    const at = (j) => pts[Math.max(0, Math.min(pts.length - 1, j))];
    let from = 0;
    rc.route.forEach((q, i) => {
      if (!i || !q[0]) return;
      let d = `M${f(pts[from])}`, c2 = pts[from];
      for (let j = from; j < i; j++) { // Catmull-Rom 換成三次貝茲曲線,線經過每個點且轉折平順
        const p0 = at(j - 1), p1 = pts[j], p2 = pts[j + 1], p3 = at(j + 2);
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += `C${f(c1)} ${f(c2)} ${f(p2)}`;
      }
      frag.append(el('path', { d, class: 'm-route' + (q[3] === '陸路' ? ' land' : '') }));
      const [x2, y2] = pts[i], a = Math.atan2(y2 - c2[1], x2 - c2[0]), h = 10 * u;
      frag.append(el('path', { d: `M${x2} ${y2}L${x2 - h * Math.cos(a - 0.45)} ${y2 - h * Math.sin(a - 0.45)}L${x2 - h * Math.cos(a + 0.45)} ${y2 - h * Math.sin(a + 0.45)}Z`, class: 'm-routeHead' }));
      from = i;
    });
    const placed = [], hit = (l, t, w) => placed.some(([a, b, c]) => l < a + c && a < l + w && Math.abs(t - b) < fs * 1.5);
    rc.route.forEach((q, i) => {
      if (!q[0]) return;
      const [x, y] = pts[i], w = (q[0].length + 1) * fs;
      let lx = x + 8 * u; if (lx + w > v[0] + v[2] - 50 * u) lx = x - 8 * u - w; // 靠右邊的站名改放左邊,免得被裁掉或被縮放鈕蓋住
      if (hit(lx, y, w)) lx = lx > x ? x - 8 * u - w : x + 8 * u; // 和前一站的站名疊在一起就換邊(雞籠、淡水很近,WY74)
      placed.push([lx, y, w]);
      frag.append(el('circle', { cx: x, cy: y, r: 5 * u, class: 'm-stop' }));
      frag.append(el('rect', { x: lx, y: y - fs * 1.3, width: w, height: fs * 1.5, rx: 4 * u, class: 'm-tag' }));
      frag.append(el('text', { x: lx + fs * 0.5, y: y - fs * 0.15, class: 'm-tagt', 'font-size': fs.toFixed(1) }, q[0]));
    });
  }
  // 重畫前焦點還在地圖標記上才還原(打開卡片後地圖可能重畫不只一次;已 Tab 到別處或切走分頁就不搶回,Codex 審查)
  const fk = svg.contains(document.activeElement) ? document.activeElement.getAttribute('data-k') : null, kb = fk !== null && fk === refocus;
  refocus = null;
  svg.replaceChildren(frag);
  if (fk) (svg.querySelector(`[data-k="${CSS.escape(fk)}"]`) || (kb ? svg.querySelector('[role="button"]') : null))?.focus({ preventScroll: true }); // 鍵盤放大聚合圈後它不在了 ⇒ 焦點給第一個標記
  const era = ERAS.find((e) => e.id === st.era);
  $('m-legend').innerHTML = `<p><b>${era.name}</b> ${era.time}${name ? `・疆界是 ${yearText(+name.replace('bc', '-'))}左右的樣子` : ''}${era.note ? `・${era.note}` : ''}${era.clio?.length ? '・加深=這時統治這一帶的政權' : ''}・國名加虛線=AI 整理・帶「?」=原資料有疑問,點國家看說明${name ? '・<i class="cmap-sw bare"></i>灰色斜線=當時沒有國家政權的地區(不代表無人居住)' : ''}${itemsOf(st.era).some(pointGuess) ? '・<i class="cmap-sw guess"></i>點加虛線圈=地點 AI 推算' : ''}</p>`;
}
function star(x, y, r) {
  let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ' ' + (y + Math.sin(a) * rr).toFixed(1); }
  return d + 'Z';
}

// ---------------------------------------------------------------- 互動
// 桌機收合(WY53):年代清單欄、下方說明區;狀態記在本機(讀寫失敗就預設展開)。收合後地圖區變大,ResizeObserver 會重畫,viewBox 不變所以中心與縮放保留。
// 說明區收合時,點了地圖上或清單裡的項目、國家,說明區自動展開。
const FOLD_KEY = { list: 'ccc:map-fold-list', detail: 'ccc:map-fold-detail' };
const readFold = (k) => { try { return localStorage.getItem(FOLD_KEY[k]) === '1'; } catch { return false; } };
function setFold(k, on, save = true) {
  root.classList.toggle(`fold-${k}`, on);
  if (save) { try { localStorage.setItem(FOLD_KEY[k], on ? '1' : '0'); } catch { /* 無痕或封鎖時只在本頁有效 */ } }
  const b = $(`m-fold-${k}`);
  b.setAttribute('aria-expanded', String(!on));
  if (k === 'list') { b.setAttribute('aria-label', on ? '展開年代清單' : '收合年代清單'); b.title = on ? '展開年代清單' : '收合年代清單'; b.innerHTML = on ? '<span aria-hidden="true">›</span><span class="cmap-fold-txt">年代清單</span>' : '<span aria-hidden="true">‹</span><span class="cmap-fold-hint">收合</span>'; } // 寫出「收合」兩字,讓人看得出可以收(使用者 2026-11-01)
  else { b.setAttribute('aria-label', on ? '展開說明' : '收合說明'); b.innerHTML = on ? '展開 <span aria-hidden="true">▴</span>' : '收合 <span aria-hidden="true">▾</span>'; }
}
let lastPick = null; // null=頁面剛載入,第一次畫面不算「選了新項目」
function update() { renderList(); renderCards(); renderAxis(); renderDetail(); syncDetailHead(); if (!mobile() || st.tab === 'map') drawMap(); }
// 換時期(使用者 2026-11-04):預設保留目前的縮放與位置;勾「換時期時拉回該國範圍」才回到該時期的範圍。換國家視角一律拉回。
let refit = PREF('ccc:map-refit', false);
function setEra(id, fit = refit) {
  Object.assign(st, { era: id, region: null, item: null, view: fit ? null : st.view, polity: null, twc: null, route: null, echo: null, bld: null, fam: null });
  try { history.replaceState(null, '', `?era=${encodeURIComponent(id)}`); } catch { /* 網址改不了也不影響閱讀 */ } // 網址記住目前年代,可以直接分享(WY60)
  update();
}
function pick(it) { Object.assign(st, { item: it, region: it.state, view: null, polity: null, echo: null, bld: null, fam: null, fitPoem: it.t === 'poem' }); if (mobile()) setTab('map'); else update(); }
function setTab(t) {
  st.tab = t; root.dataset.tab = t;
  $('t-list').setAttribute('aria-selected', t === 'list'); $('t-map').setAttribute('aria-selected', t === 'map');
  update(); app.scrollTop = 0;
}
$('t-list').addEventListener('click', () => setTab('list'));
$('t-map').addEventListener('click', () => setTab('map'));
const go = (d) => { const list = eras(), i = list.findIndex((e) => e.id === st.era) + d; if (list[i]) setEra(list[i].id); };
document.addEventListener('keydown', (e) => { if (e.key !== 'Escape') return; const open = app.querySelector('.cmap-pv-menu:not([hidden])'); if (open) { closePV(); open.previousElementSibling.focus(); } });
$('m-prev').addEventListener('click', () => go(-1));
$('m-next').addEventListener('click', () => go(1));
// ---------------------------------------------------------------- 看漫畫:網頁版彈出視窗(WY53)
// 寬螢幕且用滑鼠(≥768px、pointer: fine)時,「看漫畫 →」在地圖上開彈出視窗,不離開地圖;手機照舊開漫畫頁。
// 用原生 <dialog>:開啟時焦點留在視窗內、Esc 關閉;另加右上 × 與點背景關閉;關閉後焦點回到原本那顆按鈕;背景不捲動。
const comicModal = () => matchMedia('(min-width: 768px) and (pointer: fine)').matches;
let dlg = null, opener = null;
async function openComic(slug, from) {
  const comic = COMICS.find((c) => c.slug === slug); if (!comic) return false;
  const [{ ZHUYIN, ZHUYIN_NOTES }, { idiomURL }] = await Promise.all([import('../idioms/zhuyin.js'), import('../idioms/list.js')]);
  if (!dlg) {
    dlg = document.createElement('dialog');
    dlg.className = 'cmap-modal';
    dlg.setAttribute('aria-labelledby', 'cmap-modal-title');
    dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('.cmap-modal-x')) dlg.close(); }); // 點背景(dialog 本身)或 × 關閉
    dlg.addEventListener('close', () => { document.documentElement.classList.remove('cmap-noscroll'); opener?.focus(); opener = null; });
    document.body.append(dlg);
  }
  const href = `../idioms/comic.html?id=${encodeURIComponent(slug)}`;
  dlg.innerHTML = `<div class="cmap-modal-box"><button type="button" class="cmap-modal-x" aria-label="關閉">×</button>
    <div class="comic-view">${comicBodyHTML(comic, { readings: ZHUYIN[comic.word], readingNote: ZHUYIN_NOTES[comic.word], idiomHref: idiomURL(comic.word), base: '../idioms/', page: false, headingId: 'cmap-modal-title' })}</div>
    <a class="cmap-modal-page" href="${esc(href)}" target="_blank" rel="noopener">開新頁看完整漫畫 ↗</a></div>`;
  opener = from;
  document.documentElement.classList.add('cmap-noscroll');
  dlg.showModal();
  dlg.querySelector('.cmap-modal-x').focus();
  return true;
}
app.addEventListener('click', (ev) => {
  const a = ev.target.closest('a[data-comic]');
  if (a && comicModal() && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) { ev.preventDefault(); openComic(a.dataset.comic, a); return; }
  const b = ev.target.closest('button');
  if (!b?.matches('.cmap-pv-btn') && !ev.target.closest('.cmap-pv-menu')) closePV(); // 點選單以外的地方就收起
  if (!b || !app.contains(b)) return;
  if (b.matches('.cmap-pv-btn')) { const m = b.nextElementSibling, open = m.hidden; closePV(); m.hidden = !open; b.setAttribute('aria-expanded', String(open)); if (open) m.querySelector('[aria-checked="true"]')?.focus(); return; }
  if (b.dataset.pv) { closePV(); setTrack(b.dataset.pv); return; }
  if (b.dataset.go) { const [era, card] = b.dataset.go.split(' '); setEra(era); st.twc = card; update(); return; }
  if (b.dataset.fam) { Object.assign(st, { fam: FAMILIES.find((f) => f.id === b.dataset.fam), bld: null, item: null, polity: null, echo: null }); if (mobile()) setTab('map'); else update(); return; }
  if (b.dataset.bld) { const from = st.fam, era = st.era; bldJSON().then((list) => { if (st.fam !== from || st.era !== era) return; Object.assign(st, { bld: (list || []).find((x) => x.id === b.dataset.bld) || null, fam: null, item: null, polity: null, echo: null }); if (mobile()) setTab('map'); else update(); }); return; }
  if (b.dataset.echo) { st.echo = ECHOES.find((e) => e.id === b.dataset.echo); st.item = null; st.polity = null; st.bld = null; st.fam = null; if (mobile()) setTab('map'); else update(); return; }
  if (b.dataset.card) { st.twc = b.dataset.card; st.route = null; st.view = null; update(); return; }
  if (b.dataset.route) { // 看航線:地圖移到包住整條航線的範圍;桌機再按一次收起
    const c = cardsOf(st.era).find((x) => x.id === b.dataset.route);
    const off = st.route === c.id && !mobile();
    Object.assign(st, { twc: c.id, route: off ? null : c.id, view: off ? null : routeView(c.route), item: null, polity: null });
    if (mobile() && !off) setTab('map'); else update();
    return;
  }
  if (b.dataset.era) setEra(b.dataset.era);
  else if (b.dataset.state) { Object.assign(st, { region: st.region === b.dataset.state ? null : b.dataset.state, item: null, polity: null }); update(); }
  else if (b.dataset.i) pick(ITEMS[+b.dataset.i]);
});

// 拖曳、雙指縮放、滾輪縮放:移動中只改 viewBox,停下來再重畫(字的大小、要載入粗/細切片都重算)
const W = B.width, H = B.height;
const clamp = ([x, y, w, h]) => { const r = h / w, x0 = pac ? SEAM_X : 0; w = Math.min(Math.max(w, MIN_W), W); h = w * r; return [Math.min(Math.max(x, x0 - w * 0.3), x0 + W - w * 0.7), Math.min(Math.max(y, -h * 0.3), H - h * 0.7), w, h]; };
// 放大上限(WY59):畫面寬最小 12 地圖單位(約經度 0.4 度),臺灣單一縣市放得下、建築圖示分得開
const MIN_W = 12;
// 聚合(WY59,WY75 起建築與家族共用):螢幕上距離 26px 以內的併成一組;已放到最大就不再聚合(有些點相距不到 1 公里,怎麼放大都分不開)
function groupNear(list, v, u, at = (b) => P(b.at)) {
  const groups = [], near = v[2] <= MIN_W * 1.05 ? 0 : 26 * u;
  for (const b of list) { const [x, y] = at(b); const gr = near && groups.find((q) => Math.hypot(q.x - x, q.y - y) < near); if (gr) { gr.m.push(b); gr.x = (gr.x * (gr.m.length - 1) + x) / gr.m.length; gr.y = (gr.y * (gr.m.length - 1) + y) / gr.m.length; } else groups.push({ x, y, m: [b] }); }
  return groups;
}
// 放大到包住這些點(聚合圈用):四周留白,但不小於放大上限
function zoomTo(pts) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), [, , w0, h0] = vb(), r = h0 / w0;
  let w = Math.max((Math.max(...xs) - Math.min(...xs)) * 1.8, (Math.max(...ys) - Math.min(...ys)) * 1.8 / r, MIN_W);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  st.view = clamp([cx - w / 2, cy - (w * r) / 2, w, w * r]); drawMap();
}
const ptrs = new Map(); let start = null, dragged = false, settle = 0;
const commit = () => { clearTimeout(settle); settle = setTimeout(() => { st.view = vb(); drawMap(); }, 140); };
box.addEventListener('pointerdown', (e) => { if (e.target.closest('.cmap-tools')) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]); start = { v: vb(), p: [...ptrs.values()].map((p) => [...p]), u: unitsPerPx() }; dragged = false; });
box.addEventListener('pointermove', (e) => {
  if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  const p = [...ptrs.values()], [x, y, w, h] = start.v;
  if (p.length === 1 && start.p.length === 1) {
    const dx = p[0][0] - start.p[0][0], dy = p[0][1] - start.p[0][1];
    if (!dragged && Math.hypot(dx, dy) > 6) { dragged = true; box.classList.add('drag'); box.setPointerCapture(e.pointerId); }
    if (dragged) svg.setAttribute('viewBox', clamp([x - dx * start.u, y - dy * start.u, w, h]).join(' '));
  } else if (p.length === 2 && start.p.length === 2) {
    dragged = true;
    const d0 = Math.hypot(start.p[0][0] - start.p[1][0], start.p[0][1] - start.p[1][1]), d1 = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]);
    const k = d0 / Math.max(d1, 1); svg.setAttribute('viewBox', clamp([x + (w - w * k) / 2, y + (h - h * k) / 2, w * k, h * k]).join(' '));
  }
});
const end = (e) => {
  if (!ptrs.delete(e.pointerId)) return;
  box.classList.remove('drag');
  if (ptrs.size) start = { v: vb(), p: [...ptrs.values()].map((p) => [...p]), u: unitsPerPx() };
  if (dragged) commit();
  setTimeout(() => { if (!ptrs.size) dragged = false; }, 0);
};
box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
const zoom = (k, cx = 0.5, cy = 0.5) => { const [x, y, w, h] = vb(); svg.setAttribute('viewBox', clamp([x + w * cx * (1 - k), y + h * cy * (1 - k), w * k, h * k]).join(' ')); commit(); };
box.addEventListener('wheel', (e) => { e.preventDefault(); const r = svg.getBoundingClientRect(); zoom(e.deltaY > 0 ? 1.2 : 1 / 1.2, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); }, { passive: false });
$('m-in').addEventListener('click', () => zoom(1 / 1.5));
box.addEventListener('dblclick', (e) => { if (e.target.closest('.cmap-tools, .cmap-layers')) return; const r = svg.getBoundingClientRect(); zoom(1 / 2, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); }); // 雙擊/雙點放大(WY59)
$('m-out').addEventListener('click', () => zoom(1.5));
$('m-home').addEventListener('click', () => { st.view = st.route ? routeView(curCard().route) : null; drawMap(); });
const lp = $('m-layer-panel');
for (const k of Object.keys(st.layers)) { st.layers[k] = layerOn(k); lp.querySelector(`[data-layer="${k}"]`).checked = st.layers[k]; }
$('m-layers').addEventListener('click', () => { const open = lp.hidden; lp.hidden = !open; $('m-layers').setAttribute('aria-expanded', String(open)); });
lp.querySelector('[data-opt="refit"]').checked = refit; lp.querySelector('[data-opt="pac"]').checked = pac;
lp.addEventListener('change', (e) => {
  const o = e.target.dataset.opt; if (!o) return;
  savePref(o === 'pac' ? 'ccc:map-pacific' : 'ccc:map-refit', e.target.checked);
  if (o === 'refit') { refit = e.target.checked; return; }
  const v = st.view || vb(), cx = v[0] + v[2] / 2; // 換置中方式時,畫面停在同一個地方
  pac = e.target.checked;
  if (pac && cx < SEAM_X) v[0] += W; else if (!pac && cx >= W) v[0] -= W;
  st.view = clamp(v); drawMap();
});
lp.addEventListener('change', (e) => { const k = e.target.dataset.layer; if (!k) return; st.layers[k] = e.target.checked; try { localStorage.setItem(LAYER_KEY(k), e.target.checked ? '1' : '0'); } catch { /* 只在本頁有效 */ } update(); });
// 說明區文字縮放(WY59):90%、100%、125%、150%,記在本機;用 CSS zoom,版面寬度跟著縮,文字自動換行、不會橫捲
const TZ = [0.9, 1, 1.25, 1.5];
let tz = (() => { try { const v = Number(localStorage.getItem('ccc:map-text-zoom')); return TZ.includes(v) ? v : 1; } catch { return 1; } })();
const setTz = (v) => { tz = v; root.style.setProperty('--tz', String(v)); $('m-tz-v').textContent = `${Math.round(v * 100)}%`; $('m-tz-dn').disabled = v === TZ[0]; $('m-tz-up').disabled = v === TZ.at(-1); try { localStorage.setItem('ccc:map-text-zoom', String(v)); } catch { /* 只在本頁有效 */ } };
setTz(tz);
$('m-tz-dn').addEventListener('click', () => setTz(TZ[Math.max(0, TZ.indexOf(tz) - 1)]));
$('m-tz-up').addEventListener('click', () => setTz(TZ[Math.min(TZ.length - 1, TZ.indexOf(tz) + 1)]));
setFold('list', readFold('list'), false); setFold('detail', readFold('detail'), false);
$('m-fold-list').addEventListener('click', () => setFold('list', !root.classList.contains('fold-list')));
$('m-fold-detail').addEventListener('click', () => setFold('detail', !root.classList.contains('fold-detail')));
// 拖拉分隔線(使用者 2026-11-04,桌機):年代清單寬度、說明區高度;記在本機,方向鍵每次 16px
const SPLIT = { list: { key: 'ccc:map-list-w', css: '--lw', min: 200, max: () => Math.min(600, innerWidth * 0.5) },
  detail: { key: 'ccc:map-detail-h', css: '--dh', min: 60, max: () => { const r = root.querySelector('.cmap-right').getBoundingClientRect(); return r.bottom - box.getBoundingClientRect().top - 240; } } }; // 地圖至少留 240px
const setSplit = (k, px, save = true) => {
  const c = SPLIT[k], v = Math.round(Math.min(Math.max(px, c.min), Math.max(c.min, c.max())));
  root.style.setProperty(c.css, `${v}px`); root.classList.add(`sized-${k}`);
  $(`m-split-${k}`).setAttribute('aria-valuenow', String(v));
  if (save) { try { localStorage.setItem(c.key, String(v)); } catch { /* 只在本頁有效 */ } }
};
// 讀回記住的大小;版面排好後才夾住(地圖至少 240px),視窗變小時也重新夾住
const restoreSplits = () => { for (const k of Object.keys(SPLIT)) { try { const v = Number(localStorage.getItem(SPLIT[k].key)); if (v > 0) setSplit(k, v, false); } catch { /* 用預設 */ } } };
addEventListener('resize', restoreSplits);
for (const k of Object.keys(SPLIT)) {
  const h = $(`m-split-${k}`), cur = () => (k === 'list' ? $('m-list').getBoundingClientRect().width : root.querySelector('.cmap-dwrap').getBoundingClientRect().height);
  h.addEventListener('pointerdown', (e) => {
    e.preventDefault(); h.setPointerCapture(e.pointerId); h.classList.add('on');
    const p0 = k === 'list' ? e.clientX : e.clientY, v0 = cur();
    const mv = (ev) => setSplit(k, k === 'list' ? v0 + ev.clientX - p0 : v0 - (ev.clientY - p0), false);
    const up = () => { h.classList.remove('on'); h.removeEventListener('pointermove', mv); setSplit(k, cur()); };
    h.addEventListener('pointermove', mv); h.addEventListener('pointerup', up, { once: true }); h.addEventListener('pointercancel', up, { once: true });
  });
  h.addEventListener('keydown', (e) => {
    const d = { list: { ArrowLeft: -16, ArrowRight: 16 }, detail: { ArrowUp: 16, ArrowDown: -16 } }[k][e.key];
    if (d) { e.preventDefault(); setSplit(k, cur() + d); }
  });
  h.addEventListener('dblclick', () => { root.style.removeProperty(SPLIT[k].css); root.classList.remove(`sized-${k}`); try { localStorage.removeItem(SPLIT[k].key); } catch { /* 只在本頁有效 */ } }); // 雙擊回到預設
}
new ResizeObserver(() => { if (!mobile() || st.tab === 'map') drawMap(); }).observe(box);

if (pre && mobile()) setTab('map'); else update();
requestAnimationFrame(restoreSplits);
