// 以古鑑今(WY56):今天的地名、省名裡看得到的過去。使用者裁 CPM 待裁 45~47「按建議」;研究底稿 docs/research/wy56-past-in-present.md。
// 寫法:只寫出處明白寫出的內容;說法不一的並列(一說/兩說),不選邊;沒找到可靠出處的不放(排除清單見 docs/research/wy56/cards.md)。
// 欄位:at=今日地點的經緯度(Wikidata P625,CC0);place=今日地點名稱;eras=相關的地圖年代(出處寫到的才列);
//       body=內文,每句自寫;src=出處。地圖上「以古鑑今」圖層打開時標「古」字;點國家時,年代相符、點落在該國疆界內的會列在卡片下方。
const MOE = (w) => `https://dict.revised.moe.edu.tw/search.jsp?md=1&word=${encodeURIComponent(w)}`;
const MOEID = (id) => `https://dict.revised.moe.edu.tw/dictView.jsp?ID=${id}`;
const D = (w) => ({ t: `教育部《重編國語辭典修訂本》「${w}」`, u: MOE(w) });
const S = {
  henan: D('河南省'), hebei: D('河北省'), hunan: D('湖南省'), hubei: D('湖北省'), shandong: D('山東省'),
  luguo: { t: '教育部《重編國語辭典修訂本》「魯國」', u: MOEID(65991) },
  jizhou: D('冀州'), yuzhou: D('豫州'), jiuzhou: { t: '教育部《重編國語辭典修訂本》「九州」', u: MOEID(92105) },
  xian: { t: '教育部《重編國語辭典修訂本》「西安市」', u: MOEID(104266) }, changan: { t: '教育部《重編國語辭典修訂本》「長安」', u: MOEID(123770) },
  kaifeng: D('開封市'), bianliang: D('汴梁'), beisong: D('北宋'), nansong: D('南宋'),
  songshi88: { t: '《宋史‧地理志四》臨安府條(維基文庫)', u: 'https://zh.wikisource.org/wiki/%E5%AE%8B%E5%8F%B2/%E5%8D%B7088' },
  yumen: D('玉門關'), yangguan: { t: '教育部《重編國語辭典修訂本》「陽關」', u: MOEID(157518) }, yangguan3: { t: '教育部《重編國語辭典修訂本》「陽關三疊」', u: MOEID(157521) },
  chiayi: { t: '嘉義市政府〈嘉義的歷史沿革〉', u: 'https://www.chiayi.gov.tw/News_Content.aspx?n=512&s=216171' },
  keelung: { t: '基隆市政府〈歷史沿革〉', u: 'https://www.klcg.gov.tw/tw/klcg1/3173.html' },
  wanhua: { t: '臺北市萬華區公所〈歷史沿革〉', u: 'https://whdo.gov.taipei/cp.aspx?n=CAA666D84C56861F' },
  customs: { t: '財政部關務署高雄關〈歷史沿革〉', u: 'https://web.customs.gov.tw/kaohsiung/singlehtml/495' },
  zuoying: { t: '高雄市左營區公所〈歷史沿革〉', u: 'https://kcgtdo.kcg.gov.tw/cp.aspx?n=98D8DF6E26991CCD' },
  xinying: { t: '臺南市新營區公所〈歷史沿革〉', u: 'https://xinying.tainan.gov.tw/cp.aspx?n=8163' },
};
const src = (...k) => k.map((x) => S[x]);

export const ECHOES = Object.freeze([
  { id: 'river-lake', title: '黃河、洞庭湖與省名', place: '河南省', at: [113.5, 33.9], eras: [],
    body: ['河南省因為位在黃河以南而得名,河北省則因為地處黃河以北而得名。', '湖南、湖北的名字也是這樣來的:湖南省在洞庭湖以南,湖北省在洞庭湖以北。', '河南簡稱「豫」,河北簡稱「冀」,湖北簡稱「鄂」。'],
    src: src('henan', 'hebei', 'hunan', 'hubei') },
  { id: 'shandong-lu', title: '山東為什麼叫「魯」', place: '山東曲阜', at: [116.98333, 35.6], eras: ['xz'],
    body: ['山東省簡稱「魯」,因為周朝時魯國在這裡建國。', '魯國原本由周武王封給弟弟周公旦,周公留在朝中輔佐天子,便改封他的長子伯禽為魯侯。', '魯國以曲阜為國都,也就是今天的山東曲阜,後來被楚國所滅。', '至於「山東」這個省名,是因為它位在太行山以東。'],
    src: src('shandong', 'luguo') },
  { id: 'jizhou-yuzhou', title: '冀州、豫州在哪裡', place: '河北省', at: [114.50861, 38.04222], eras: [],
    body: ['今天河北省簡稱「冀」,河南省簡稱「豫」。', '古代有「九州」的說法,冀州、豫州都是其中之一。', '冀州包括今河北、山西兩省等地;豫州包括今河南省等地。', '九州怎麼分,歷來說法不一,有《禹貢》、《爾雅》、《周禮》等不同版本。'],
    src: src('hebei', 'henan', 'jizhou', 'yuzhou', 'jiuzhou') },
  { id: 'capitals', title: '長安、汴京、臨安在哪', place: '西安市', at: [108.94222, 34.26111], eras: ['sui', 'tang', 'bs', 'ns'],
    body: ['西安是古都,漢、隋、唐都在這裡建都。', '今天西安市南部的長安,是周朝鎬京、秦朝咸陽、漢朝長安的故地。', '開封古稱汴梁,也叫汴京,北宋就建都在汴京。', '靖康之禍後,宋高宗南渡,建都臨安,稱為南宋;《宋史‧地理志》記臨安府「本杭州」。'],
    src: src('xian', 'changan', 'kaifeng', 'bianliang', 'beisong', 'nansong', 'songshi88') },
  { id: 'chiayi', title: '諸羅為什麼改叫嘉義', place: '嘉義市', at: [120.44972, 23.48], eras: ['tw-ql'],
    body: ['嘉義舊稱「諸羅」:平埔族有個諸羅山社,荷蘭人把社名音譯成 Tirosen,漢人再寫成「諸羅山」。', '乾隆 51 年(1786)林爽文起事,圍攻諸羅城,城內百姓協助清軍守城。', '清廷以「嘉其死守城池之忠義」為由,在第二年下詔,把「諸羅」改稱「嘉義」。'],
    src: src('chiayi') },
  { id: 'keelung', title: '雞籠怎麼變成基隆', place: '基隆市', at: [121.7419, 25.12825], eras: ['tw-hx', 'tw-ql'],
    body: ['1626 年,西班牙遠征隊從呂宋出發,在社寮島(今基隆和平島)登陸,並在島的西南端築「聖薩爾瓦多城」。', '1642 年,荷蘭人攻下社寮島,把這座城改名為「北荷蘭」。', '1875 年,清廷把一直沿用的「雞籠」改名「基隆」,取「基地昌隆」的吉祥意思。'],
    src: src('keelung') },
  { id: 'wanhua', title: '萬華的舊名「艋舺」', place: '臺北市萬華區', at: [121.483, 25.0333], eras: ['tw-rz'],
    body: ['萬華舊稱「艋舺」。', '萬華區公所引用日治時期民俗學者池田敏雄的說法:凱達格蘭族人划獨木舟,載番薯等土產到河邊和漢人交易,漢人把這種船叫「蟒葛」或「蟒甲」,「艋舺」就是指這些船聚集的地方。', '1920 年(大正 9 年),日本人改稱「萬華」,取「萬年均能繁華」的意思。'],
    src: src('wanhua') },
  { id: 'kaohsiung', title: '打狗怎麼變成高雄', place: '高雄市', at: [120.2975, 22.615], eras: ['tw-ql', 'tw-rz'],
    body: ['明清時期,這裡官方稱「打鼓」、民間稱「打狗」,兩個名字都是當地平埔族馬卡道族語的發音。', '高雄關網頁說,這個名字的意思是附近長滿樹林,例如紅樹林。', '1920 年,日本人依「打狗」的日文讀音,把地名改為「高雄」。'],
    src: src('customs') },
  { id: 'zuoying', title: '左營、新營的「營」', place: '高雄市左營區', at: [120.294, 22.6822], eras: ['tw-mz'],
    body: ['左營古名興隆里,從明鄭時代起就是軍隊屯田的地方。', '「左營」名稱的由來有兩說:一說是「左」鎮在這裡紮營;另一說是營地紮在城的左邊。', '新營區公所說,鄭成功為防備清兵來襲,在這一帶駐軍,因此先有「舊營」,後有「新營」。', '舊營大約在今天鹽水區南方兩公里處。'],
    src: src('zuoying', 'xinying') },
  { id: 'yumen-yangguan', title: '玉門關與陽關', place: '甘肅敦煌西北', at: [93.863826, 40.352172], eras: ['xh', 'dh', 'tang'],
    body: ['玉門關是兩漢時期通往西域的關口,位在敦煌西北約七十五公里處。', '因為大量和闐玉從這裡運進中土,所以叫「玉門關」。', '陽關是漢代在敦煌西南設置的關口,因為在玉門關的南邊而叫「陽關」,是出塞必經的地方。', '唐朝王維〈渭城曲〉有「西出陽關無故人」一句,後人把這首詩譜成送別曲〈陽關三疊〉。'],
    src: src('yumen', 'yangguan', 'yangguan3') },
]);
