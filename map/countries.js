// 文言文地圖・國家視角(WY60 段 A):日本、朝鮮半島、越南、菲律賓的時期表。
// 研究底稿與完整引文:docs/research/wy60/japan-korea.md、vietnam-philippines-sea.md(使用者 2026-11-01 裁 CPM 待裁 51「按建議」)。
// 規則:名稱與年代只寫出處明寫的;出處之間不一致就並列,不代為取捨;殖民、戰爭只寫年份與條約,不加評價。
// 欄位:year=「同一時期」對照用的代表年份;slice=沿用的現有疆界切片(null=不畫疆界);
//   need=之後要補的新切片年份(段 A 用;段 B 已補完,沒有 slice=疆界資料沒有這個時期,原因寫在 info);
//   clio=地圖上要加深的政權(切片裡的英文名);info=說明卡的段落;src=[出處名稱, 網址]。

const WD = (q) => [`Wikidata ${q}`, `https://www.wikidata.org/wiki/${q}`];
const MOE = (w) => [`教育部《重編國語辭典修訂本》「${w}」`, `https://dict.revised.moe.edu.tw/search.jsp?md=1&word=${encodeURIComponent(w)}`];
const KYOHAKU = ['京都國立博物館〈日本の歴史年表〉(博物館ディクショナリー 248)', 'https://www.kyohaku.go.jp/jp/learn/home/dictio/kouko/248/'];
const TNM = ['東京國立博物館 本館展示說明(2019-02-10)', 'https://www.tnm.jp/modules/r_exhibition/index.php?controller=hall&date=2019-02-10&hid=12&lang=en'];
const NMK = ['韓國國立中央博物館 常設展', 'https://www.museum.go.kr/ENG/contents/E0201010000.do'];
const NMK_HALL = (name, hall, code) => [`韓國國立中央博物館〈${name}〉`, `https://www.museum.go.kr/ENG/contents/${hall}.do?showHallId=760&showroomCode=${code}`];
const BOCA_KR = ['外交部領事事務局〈韓國〉', 'https://www.boca.gov.tw/sp-foof-countrycp-03-2-aff61-04-1.html'];
const BOCA_KP = ['外交部領事事務局〈北韓〉', 'https://www.boca.gov.tw/sp-foof-countrycp-03-121-0eca2-04-1.html'];
const BTLS = (n, t) => [`越南國家歷史博物館〈${t}〉`, `https://baotanglichsu.vn/en/Articles/${n}`];
const USSH = ['越南國家大學河內社會人文大學〈Studying the period of Chinese domination (179 BC - 938 AD)〉', 'https://ussh.vnu.edu.vn/eng/news/tin-hoat-dong/nghien-cuu-thoi-ky-bac-thuoc-179-tcn-938-scn-trong-lich-su-viet-nam-15742.html'];
const TECO_VN = ['駐越南台北經濟文化辦事處〈越南國情簡介〉', 'https://www.roc-taiwan.org/vn/post/116.html'];
const TECO_PH = ['駐菲律賓台北經濟文化辦事處〈菲律賓國情簡介〉', 'https://www.roc-taiwan.org/ph/post/287.html'];
const OH_US = ['美國國務院歷史文獻辦公室〈The Philippine-American War, 1899–1902〉', 'https://history.state.gov/milestones/1899-1913/war'];
const MING321 = ['《明史》卷三百二十一〈安南〉(維基文庫)', 'https://zh.wikisource.org/zh-hant/明史/卷321'];
const MING324 = ['《明史》卷三百二十四〈暹羅〉(維基文庫)', 'https://zh.wikisource.org/zh-hant/明史/卷324'];
const SD = (path, t) => [`美國國務院歷史文獻辦公室〈${t}〉`, `https://history.state.gov/milestones/${path}`];
const NPS = (path, t) => [`美國國家公園管理局〈${t}〉`, `https://www.nps.gov/${path}`];
const LOC_CN = ['美國國會圖書館〈Chinese Collection〉', 'https://guides.loc.gov/asian-collections/chinese-collection'];
const LOC_RE = ['美國國會圖書館〈Reconstruction: A Resource Guide〉', 'https://guides.loc.gov/reconstruction'];
const QSG528 = ['《清史稿》卷五百二十八〈屬國三・暹羅〉(維基文庫)', 'https://zh.wikisource.org/zh-hant/清史稿/卷528'];

// 國家視角:順序就是選單順序;start=切到這國時先看的時期;view=視野 [西經, 南緯, 東經, 北緯]
export const COUNTRIES = Object.freeze([
  { id: 'cn', name: '中國', start: 'cq' },
  { id: 'tw', name: '臺灣', start: 'tw-hx' },
  { id: 'jp', name: '日本', start: 'jp-heian', view: [122, 24, 148, 46] },
  { id: 'kr', name: '朝鮮半島', start: 'kr-joseon', view: [118, 30, 136, 46] },
  { id: 'vn', name: '越南', start: 'vn-ly', view: [98, 12, 116, 28] },
  { id: 'ph', name: '菲律賓', start: 'ph-es', view: [110, 3, 132, 27] },
  // WY60 段 C1(使用者 2026-11-04 裁 CPM 待裁 56「按建議」)
  { id: 'th', name: '泰國', start: 'th-ayutthaya', view: [94, 5, 108, 21] },
  // overview=整體視角:各段沒有出處明寫的起訖,只寫代表年份;不加深、不列進「同一時期」對照
  { id: 'sea', name: '東南亞(其他)', start: 'sea-1640', view: [92, -11, 128, 24], overview: true },
  // WY60 段 C2:美國(西經寫負數);各時期另有自己的視野
  { id: 'us', name: '美國', start: 'us-civil', view: [-128, 22, -62, 52] },
]);
// 之後再做(目前沒有)
export const LATER = Object.freeze([]);

const E = (track, id, name, time, year, slice, o = {}) => ({ id: `${track}-${id}`, track, name, time, year, slice, clio: [], info: [], src: [], ...o });

export const COUNTRY_ERAS = Object.freeze([
  // ---------------------------------------------------------------- 日本:政治史分期以 Wikidata 為主,京都國立博物館(文化史分期)寫進說明
  E('jp', 'jomon', '繩文時代', '約前13000~前400', -900, null, {
    info: ['起訖各說不一:Wikidata 記約前 13000 年到前 400 年;京都國立博物館記約前 10,000 年到約前 5 世紀。'], src: [WD('Q52824'), KYOHAKU] }),
  E('jp', 'yayoi', '彌生時代', '前300~250', -100, null, {
    info: ['起訖各說不一:Wikidata 記前 300 年到 250 年;京都國立博物館記約前 5 世紀到約 3 世紀;教育部辭典「彌生文化」寫約西元前 2 世紀到 3 世紀。', '教育部辭典「彌生文化」:遺址發現漢代銅鏡和王莽時代的貨泉。'],
    src: [WD('Q207858'), KYOHAKU, MOE('彌生文化')] }),
  E('jp', 'kofun', '古墳時代', '250~538', 380, '380', {
    info: ['Wikidata 記 250~538 年;京都國立博物館記約 3 世紀到 6 世紀。'], src: [WD('Q459939'), KYOHAKU] }),
  E('jp', 'asuka', '飛鳥時代', '538~710', 610, '610', { clio: ['Asuka Japan'],
    info: ['起點有兩說:Wikidata 記 538 年,京都國立博物館記 592 年。', '教育部辭典「大化革新」:有意吸取中國唐代的制度與文化。'], src: [WD('Q210688'), KYOHAKU, MOE('大化革新')] }),
  E('jp', 'nara', '奈良時代', '710~794', 740, '740', { clio: ['Nara Japan'],
    info: ['教育部辭典「遣唐使」:日本派到唐朝的使節,學習唐朝的政法、文教。'], src: [WD('Q189178'), KYOHAKU, MOE('遣唐使')] }),
  E('jp', 'heian', '平安時代', '794~1185', 1050, '1050', { clio: ['Heian Japan'],
    info: ['結束年有兩說:Wikidata、京都國立博物館記 1185 年;東京國立博物館記 1192 年。', '教育部辭典「空海」:西元 804 年留學長安。'], src: [WD('Q193292'), KYOHAKU, TNM, MOE('空海')] }),
  E('jp', 'kamakura', '鎌倉時代', '1185~1333', 1300, '1300', { clio: ['Kamakura Shogunate'],
    info: ['起點有兩說:Wikidata、京都國立博物館、教育部辭典「鐮倉幕府」記 1185 年;也有 1192 年的說法。', '教育部辭典寫作「鐮倉」,Wikidata 寫作「鎌倉」。'], src: [WD('Q236205'), KYOHAKU, MOE('鐮倉幕府')] }),
  E('jp', 'muromachi', '室町時代', '1336~1573', 1550, '1550', { clio: ['Warring States Japan'],
    info: ['Wikidata 記 1336~1573 年;京都國立博物館把 1333~1392 年另列「南北朝時代」,室町從 1392 年算起。', '含南北朝時代(日本)與戰國時代(日本);教育部辭典「戰國時代」第 2 義:西元 1467~1573 年。', '地圖用 1550 年的疆界,畫的是戰國時代各地割據的樣子。'],
    src: [WD('Q334845'), WD('Q264012'), KYOHAKU, MOE('戰國時代')] }),
  E('jp', 'azuchi', '安土桃山時代', '1568~1600', 1590, '1590', { clio: ['Warring States Japan'],
    info: ['Wikidata 記 1568~1600 年;京都國立博物館稱「桃山時代」,記 1573~1615 年。', '疆界資料把 1590 年的日本仍標為「戰國時代」。'], src: [WD('Q319531'), KYOHAKU] }),
  E('jp', 'edo', '江戶時代', '1603~1868', 1780, '1780', { clio: ['Tokugawa Shogunate'],
    info: ['Wikidata、東京國立博物館記 1603~1868 年;京都國立博物館記 1615~1868 年。'], src: [WD('Q184963'), TNM, KYOHAKU] }),
  E('jp', 'meiji', '明治', '1868~1912', 1900, '1900', { clio: ['Empire of Japan'],
    info: ['Wikidata 記 1868~1912 年;教育部辭典「明治」寫 1867~1912 年,「明治維新」寫 1868 年 10 月 23 日改年號為明治。'], src: [WD('Q3125096'), MOE('明治'), MOE('明治維新')] }),
  E('jp', 'taisho', '大正', '1912~1926', 1920, '1920', { clio: ['Empire of Japan'], src: [MOE('大正'), WD('Q329174')] }),
  E('jp', 'showa', '昭和', '1926~1989', 1930, '1930', { clio: ['Empire of Japan'],
    info: ['地圖用 1930 年的疆界,只代表 1945 年以前;1945~1989 年的疆界沒有補(段 B 只補了各時期缺的切片,昭和沿用 1930 年)。'], src: [MOE('昭和'), WD('Q327567')] }),
  E('jp', 'heisei', '平成', '1989~2019', 2000, '2000', { clio: ['Japan'], src: [WD('Q234510')] }),
  E('jp', 'reiwa', '令和', '2019~', 2020, '2000', { clio: ['Japan'], info: ['地圖沿用 2000 年的疆界。'], src: [WD('Q62609017')] }),

  // ---------------------------------------------------------------- 朝鮮半島
  E('kr', 'gojoseon', '古朝鮮', '前2333~前108', -100, 'bc100', { clio: ['Gojoseon'],
    info: ['年代只找到 Wikidata 一個說法(前 2333~前 108 年);韓國國立中央博物館說古朝鮮是半島上第一個國家,沒有寫年代。', '教育部辭典「樂浪」:漢武帝滅朝鮮時所設置。', '疆界資料只有前 100 年這張畫出古朝鮮,比 Wikidata 記的結束年晚,兩份資料不一致。'],
    src: [WD('Q28405'), NMK_HALL('古朝鮮', 'E0201030400', 'DM0048'), MOE('樂浪')] }),
  E('kr', 'three', '三國時代', '前18~660', 530, '530', { clio: ['Goguryeo', 'Baekje', 'Silla'],
    info: ['高句麗、百濟、新羅三國並立(另有伽倻)。Wikidata 記前 18~660 年;外交部領事事務局寫西元前 1 世紀到 7 世紀。', '教育部辭典「新羅」:文字、曆法、律令制度、服飾等都依唐朝的樣式。'],
    src: [WD('Q165292'), BOCA_KR, MOE('新羅')] }),
  E('kr', 'nsk', '統一新羅・渤海', '676~935', 740, '740', { clio: ['Unified Silla', 'Balhae'],
    info: ['統一新羅:韓國國立中央博物館記 676~935 年;Wikidata 記 668~935 年;外交部領事事務局寫 676~918 年。', '渤海:698~926 年(韓國國立中央博物館、Wikidata)。'],
    src: [NMK_HALL('統一新羅', 'E0201030900', 'DM0034'), WD('Q715257'), BOCA_KR, NMK_HALL('渤海', 'E0201031000', 'DM0010'), WD('Q28322')] }),
  E('kr', 'later3', '後三國', '892~936', 915, '915', { clio: ['Unified Silla', 'Hubaekje', 'Taebong'], info: ['年代只找到 Wikidata 一個說法。', '地圖用 915 年的疆界:疆界資料裡的泰封從 911 年才開始有。'], src: [WD('Q698268')] }),
  E('kr', 'goryeo', '高麗', '918~1392', 1050, '1050', { clio: ['Goryeo'], src: [NMK, BOCA_KR, WD('Q28208')] }),
  E('kr', 'joseon', '朝鮮王朝', '1392~1897', 1640, '1640', { clio: ['Joseon'],
    info: ['韓國國立中央博物館、Wikidata 記 1392~1897 年;外交部領事事務局寫 1392~1910 年(把大韓帝國算在內)。', '教育部辭典「諺文」:原名「訓民正音」;Wikidata 記 1443 年創制、1446 年頒布。'],
    src: [NMK, WD('Q28179'), BOCA_KR, MOE('諺文'), WD('Q18990')] }),
  E('kr', 'empire', '大韓帝國', '1897~1910', 1900, '1900', { clio: ['Korean Empire'], src: [NMK, WD('Q28233')] }),
  E('kr', 'jprule', '日本統治時期', '1910~1945', 1930, '1930', { clio: ['Empire of Japan'],
    info: ['1910 年簽訂併合條約,大韓帝國併入日本;到 1945 年結束(Wikidata)。', '疆界資料把這時的朝鮮半島畫在「日本帝國」裡。'], src: [WD('Q503585'), WD('Q495558')] }),
  E('kr', 'div38', '北緯 38 度線分治', '1945~1948', 1947, '1947', { clio: ['United States of America', 'Union of Soviet Socialist Republics'],
    info: ['外交部領事事務局:美、蘇軍隊分別進駐,以北緯 38 度線分治。', '疆界資料把 38 度線以南畫在「美國」、以北畫在「蘇聯」的範圍裡;同一年的日本也畫在「美國」裡。', '時期名稱取自外交部領事事務局〈韓國〉頁的原文「以北緯38度線分治」。'], src: [BOCA_KR, WD('Q484104')] }),
  E('kr', 'modern', '南韓/北韓', '1948~', 2000, '2000', { clio: ['Republic of Korea', "Democratic People's Republic of Korea"],
    info: ['南韓(大韓民國)1948 年 8 月 15 日成立;北韓(朝鮮民主主義人民共和國)1948 年 9 月 9 日成立。', '教育部辭典:「南韓」「北韓」分別是兩國的通稱。'],
    src: [BOCA_KR, BOCA_KP, MOE('南韓'), MOE('北韓'), WD('Q884'), WD('Q423')] }),

  // ---------------------------------------------------------------- 越南:中國統治的各段依朝代分,群組名「中國王朝統治時期」
  E('vn', 'vanlang', '文郎國', '約前700~前300', -500, null, {
    info: ['越南國家歷史博物館:前 7 世紀建立,前 3 世紀衰落。'], src: [BTLS('4192/van-lang-au-lac-states', 'Van Lang – Au Lac States'), WD('Q1763996')] }),
  E('vn', 'aulac', '甌雒國', '前256~前206', -210, 'bc210', { clio: ['Âu Lạc'],
    info: ['Wikidata 記前 256~前 206 年;疆界資料記前 256~前 209 年。'], src: [WD('Q867227'), BTLS('4192/van-lang-au-lac-states', 'Van Lang – Au Lac States')] }),
  E('vn', 'nanyue', '南越國', '前203~前111', -150, 'bc150', { clio: ['Nanyue'],
    info: ['Wikidata 記成立年有前 206、前 203 兩說,結束年記前 110 年;漢朝從前 111 年開始統治(見下一段)。'], src: [WD('Q827040'), USSH] }),
  E('vn', 'han', '漢朝統治', '前111~40', -100, 'bc100', { clio: ['Han Dynasty'], group: '中國王朝統治時期',
    info: ['設交趾郡。'], src: [WD('Q2631302'), WD('Q2591393'), BTLS('4196/vietnam-from-the-1st-to-the-10th-centuries-ad', 'Vietnam from the 1st to the 10th centuries AD')] }),
  E('vn', 'nbc', '東漢~南朝統治', '43~544', 300, '300', { clio: ['Western Jin'], group: '中國王朝統治時期',
    info: ['地圖用 300 年的疆界,這時統治這一帶的是西晉。'], src: [WD('Q3477199')] }),
  E('vn', 'vanxuan', '萬春國', '544~602', 570, '570', { clio: ['Early Lý Dynasty'],
    info: ['李賁建立。結束年有 602、603 兩說(Wikidata 兩個項目)。'], src: [WD('Q2441129'), WD('Q1886032')] }),
  E('vn', 'tang', '隋唐統治', '602~938', 740, '740', { clio: ['Tang Dynasty'], group: '中國王朝統治時期',
    info: ['唐朝設安南都護府(Wikidata 記 679~866 年)。', '結束年有兩說:Wikidata 記 905 年;越南國家歷史博物館、河內社會人文大學記 938 年。'],
    src: [WD('Q403273'), WD('Q1155895'), BTLS('4196/vietnam-from-the-1st-to-the-10th-centuries-ad', 'Vietnam from the 1st to the 10th centuries AD'), USSH] }),
  E('vn', 'ngo', '吳朝・丁朝・前黎朝', '939~1009', 975, '975', { clio: ['Ngô Dynasty'],
    info: ['越南國家歷史博物館把三朝合寫為 938~1009 年;Wikidata 記吳朝 939~965、丁朝 968~980、前黎朝 980~1009 年;駐越南台北經濟文化辦事處寫西元 968 年成為獨立國家。', '地圖用 975 年的疆界;疆界資料把這時的越南標成「吳朝」(原資料的名字),975 年當時實為丁朝。'],
    src: [BTLS('4200/ngo-dinh-anterior-le-dynasties-938-1009-ad', 'Ngo - Dinh - Anterior Le Dynasties (938-1009 AD.)'), WD('Q703919'), WD('Q1372154'), WD('Q1317884'), TECO_VN] }),
  E('vn', 'ly', '李朝', '1009~1225', 1050, '1050', { clio: ['Ngô Dynasty'],
    info: ['越南國家歷史博物館記 1009~1225 年;Wikidata 記到 1226 年。', '疆界資料把這時的越南標成「吳朝」(原資料的名字),點國家可以看說明。'],
    src: [BTLS('4201/ly-tran-dynasties-1009-1400-ad', 'Ly – Tran Dynasties (1009-1400 AD.)'), WD('Q878309')] }),
  E('vn', 'tran', '陳朝', '1225~1400', 1300, '1300', { clio: ['Ngô Dynasty'],
    info: ['越南國家歷史博物館記 1225 年開始;Wikidata 記 1226 年開始。', '疆界資料把這時的越南標成「吳朝」(原資料的名字)。'],
    src: [BTLS('4201/ly-tran-dynasties-1009-1400-ad', 'Ly – Tran Dynasties (1009-1400 AD.)'), WD('Q3111454')] }),
  E('vn', 'ho', '胡朝', '1400~1407', 1405, '1405', { clio: ['Ngô Dynasty'],
    info: ['越南國家歷史博物館:1400 年胡季犛即位,國號改為大虞。', '疆界資料把這時的越南標成「吳朝」(原資料的名字)。'], src: [BTLS('4202/ho-dynasty-1400-1407-ad', 'Ho Dynasty (1400-1407 AD.)'), WD('Q1209047')] }),
  E('vn', 'ming', '明朝統治', '1407~1427', 1420, '1420', { clio: ['Ming Dynasty'], group: '中國王朝統治時期',
    info: ['《明史‧安南傳》:改安南為交阯,設三司。'], src: [WD('Q2338187'), MING321] }),
  E('vn', 'le', '後黎朝', '1428~1789', 1550, '1550', { clio: ['Đại Việt', 'Lê Dynasty'],
    info: ['越南國家歷史博物館分為黎初(1428~1527)、莫朝(1527~1592)、黎中興(1533~1788);Wikidata 記後黎朝到 1789 年。', '地圖用 1550 年的疆界,這時莫朝與黎朝並立。', '河內文廟—國子監保存 82 塊進士題名碑,記錄 1442~1779 年的科舉(UNESCO 世界記憶名錄)。'],
    src: [BTLS('4203/le-mac-restored-le-dynasties-1428-1788-ad', 'Le-Mac-Restored Le Dynasties (1428-1788 AD.)'), WD('Q878276'),
      ['UNESCO 世界記憶名錄提名書〈Stone Stele Records of Royal Examinations of the Le and Mac Dynasties (1442-1779)〉', 'https://media.unesco.org/sites/default/files/webform/mow001/vietnam_stone_stele_records_royal_examinations_le_mac_dynasties.pdf']] }),
  E('vn', 'tayson', '西山朝', '1778~1802', 1780, '1780', { clio: ['Tây Sơn dynasty'],
    src: [BTLS('4204/tay-son-dynasty-1778-1802-ad', 'Tay Son dynasty (1778-1802 AD)'), WD('Q1034173')] }),
  E('vn', 'nguyen', '阮朝', '1802~1883', 1850, '1850', { clio: ['Nguyễn dynasty'],
    info: ['越南國家歷史博物館把阮朝分為 1802~1883 年與 1883~1945 年兩段;後一段見「法屬時期」。'], src: [BTLS('4205/the-nguyen-dynasty-1802-1945-ad', 'The Nguyen dynasty (1802-1945 AD.)'), WD('Q6500483')] }),
  E('vn', 'fr', '法屬時期', '1883~1945', 1930, '1930', { clio: ['French Indochina'],
    info: ['起點有三說:1883 年(越南國家歷史博物館、駐越南台北經濟文化辦事處)、1884 年安南保護國、1887 年法屬印度支那(Wikidata)。阮朝在這段時期仍然存在。'],
    src: [BTLS('4205/the-nguyen-dynasty-1802-1945-ad', 'The Nguyen dynasty (1802-1945 AD.)'), TECO_VN, WD('Q185682'), WD('Q10828323')] }),
  E('vn', 'split', '南北兩政權', '1945~1976', 1965, '1965', { clio: ['Democratic Republic of Vietnam', 'Republic of Vietnam'],
    info: ['北方:越南民主共和國,Wikidata 記 1945 年成立;教育部辭典「越南社會主義共和國」寫 1946 年。', '南方:越南國(1949~1955)、越南共和國(1955~1975)(Wikidata)。教育部辭典:1954 年日內瓦會議後沿北緯 17 度分成南北越。'],
    src: [WD('Q172640'), WD('Q1193879'), WD('Q180573'), MOE('越南社會主義共和國')] }),
  E('vn', 'srv', '越南社會主義共和國', '1976~', 2000, '2000', { clio: ['Socialist Republic of Vietnam'],
    info: ['教育部辭典:1976 年 7 月 2 日南北越正式合併。'], src: [MOE('越南社會主義共和國'), WD('Q881')] }),

  // ---------------------------------------------------------------- 菲律賓
  E('ph', 'pre', '殖民前各地政權', '~1565', 1550, '1550', { clio: ['Tondo', 'Rajahnate of Cebu', 'Namayan', 'Sultanate of Maguindanao', 'Sultanate of Sulu'],
    info: ['各島同時有好幾個政權,不是前後相接。Wikidata 記:Tondo 900~1589、Ma-i 971~1400、宿霧(Rajahnate of Cebu)1450~1565、蘇祿蘇丹國 1405~1915、馬京達瑙蘇丹國 1515~1889。', '除蘇祿、馬京達瑙以外,其他政權沒有找到有出處的中文名,先寫英文。', '《明史‧蘇祿傳》記永樂十五年蘇祿東王、西王、峒王來朝。'],
    src: [WD('Q1642472'), WD('Q4401176'), WD('Q4401071'), WD('Q422065'), WD('Q248572'), ['《明史》卷三百二十五〈蘇祿〉(維基文庫)', 'https://zh.wikisource.org/zh-hant/明史/卷325']] }),
  E('ph', 'es', '西班牙統治', '1565~1898', 1640, '1640', { clio: ['Spanish Empire'],
    info: ['駐菲律賓台北經濟文化辦事處:1521 年麥哲倫率西班牙遠征隊到達;1565 年西班牙人進據,1571 年建立殖民政府。', '疆界資料把西班牙統治的範圍畫在「西班牙帝國」裡。'],
    src: [TECO_PH, WD('Q2721139')] }),
  E('ph', 'rep1', '第一共和', '1899~1901', 1899, null, {
    info: ['菲律賓第一共和國(馬洛洛斯共和國),Wikidata 記 1899 年 1 月 23 日到 1901 年 3 月 23 日。', '疆界資料 1899 年把馬尼拉一帶畫在美國、宿霧一帶畫在西班牙,沒有畫出第一共和,所以這個時期不畫疆界。'], src: [WD('Q1361989'), OH_US] }),
  E('ph', 'us', '美國統治', '1898~1935', 1930, '1930', { clio: ['United States of America'],
    info: ['美國國務院歷史文獻辦公室:西班牙依《巴黎條約》把菲律賓割讓給美國。', '疆界資料把這時的菲律賓畫在「美國」裡。'], src: [OH_US, TECO_PH, WD('Q6042084')] }),
  E('ph', 'cw', '自治邦', '1935~1946', 1940, '1940', { clio: ['United States of America'],
    info: ['美國國務院歷史文獻辦公室:1935 年成為自治邦。', '疆界資料把這時的菲律賓畫在「美國」裡。'], src: [OH_US, WD('Q146328')] }),
  E('ph', 'jp', '日本佔領', '1942~1945', 1943, '1943', { clio: ['Empire of Japan'],
    info: ['Wikidata 記 1942 年 5 月 8 日到 1945 年 7 月 5 日;1943~1945 年另有菲律賓第二共和國。', '疆界資料把這時的菲律賓畫在「日本帝國」裡。'], src: [WD('Q3175954'), WD('Q2027229')] }),
  E('ph', 'modern', '菲律賓共和國', '1946~', 2000, '2000', { clio: ['Republic of the Philippines'],
    info: ['教育部辭典「菲律賓共和國」:西元 1946 年 7 月 4 日獨立。'], src: [MOE('菲律賓共和國'), TECO_PH, WD('Q928')] }),
  // ---------------------------------------------------------------- 泰國(時期名用 Wikidata 繁中標籤;地圖國名是全站共用的切片資料,不一樣的在說明卡寫「地圖上標為○○」)
  E('th', 'early', '早期各國(羅渦等)', '~1238', 740, '740', { clio: ['Lavo Kingdom', 'Haripuñjaya'],
    info: ['羅渦:Wikidata 記 700~1388 年。', '地圖用 740 年的疆界,這時今泰國一帶有羅渦與 Haripuñjaya(沒有找到有出處的中文名,先寫英文)。'], src: [WD('Q1332305'), WD('Q255931')] }),
  E('th', 'sukhothai', '素可泰王國', '1238~1438', 1300, '1300', { clio: ['Sukhothai Kingdom'],
    info: ['Wikidata 記 1238~1438 年。', '地圖上標為「素可泰」。'], src: [WD('Q863279')] }),
  E('th', 'ayutthaya', '大城王國', '1350~1767', 1640, '1640', { clio: ['Ayutthaya Kingdom'],
    info: ['Wikidata 記 1350 年到 1767 年 4 月 7 日。', '地圖上標為「阿瑜陀耶」。'], src: [WD('Q841364'), MING324, QSG528],
    box: { h: '和中國的往來', items: ['《明史‧暹羅傳》:「洪武三年,命使臣呂宗俊等齎詔諭其國。」十年賜印,「文曰『暹羅國王之印』」。', '《清史稿‧暹羅傳》:「順治九年十二月,暹羅遣使請貢」;康熙年間「定暹羅貢期三年一次」。', '原文照錄維基文庫;教育部辭典「暹羅」:泰國的舊名。'] } }),
  E('th', 'thonburi', 'Thonburi', '1768~1782', 1780, '1780', { clio: ['Thonburi Kingdom'], check: '待查證',
    info: ['Wikidata 記 1768~1782 年。', '中文名待查證:教育部辭典、Wikidata 都沒有中文名,先寫英文。地圖上標為「吞武里王朝」(本站 AI 整理)。'], src: [WD('Q1115291')] }),
  E('th', 'rattanakosin', '拉達那哥欣王國', '1782~1932', 1850, '1850', { clio: ['Rattanakosin Kingdom'],
    info: ['Wikidata 記 1782 年到 1932 年 6 月 24 日。', '地圖上標為「暹羅」;教育部辭典「暹羅」:泰國的舊名。'], src: [WD('Q1155700'), MOE('暹羅')] }),
  E('th', 'cm', '君主立憲以後', '1932~', 2000, '2000', { clio: ['Kingdom of Thailand'],
    info: ['1932 年 6 月 24 日改為君主立憲(Wikidata)。', '教育部辭典「泰王國」:1939 年定國名為泰王國,簡稱「泰國」。'], src: [WD('Q2120252'), MOE('泰王國')] }),

  // ---------------------------------------------------------------- 東南亞(其他):整體視角,五段只寫代表年份;越南、菲律賓、泰國另有自己的視角
  E('sea', '740', '印度化諸王國', '740 年前後', 740, '740', {
    info: ['疆界資料裡:今曼谷一帶屬羅渦,吳哥一帶屬真臘,蒲甘一帶屬驃國,巨港、麻六甲、新加坡一帶屬三佛齊,雅加達一帶屬巽他王國。'], src: [WD('Q1332305'), WD('Q234197')] }),
  E('sea', '1300', '大陸區王國與滿者伯夷', '1300 年前後', 1300, '1300', {
    info: ['疆界資料裡:今曼谷一帶屬羅渦,吳哥一帶屬高棉,仰光一帶屬勃固王朝,巨港一帶屬滿者伯夷,雅加達一帶屬巽他王國,麻六甲、新加坡一帶屬 Malaya。', '滿者伯夷:Wikidata 記 1293~1527 年。'], src: [WD('Q49326'), WD('Q863279')] }),
  E('sea', '1640', '蘇丹國與歐洲人到來', '1640 年前後', 1640, '1640', {
    info: ['疆界資料裡:今曼谷一帶屬阿瑜陀耶,吳哥一帶屬高棉,仰光、蒲甘一帶屬 First Toungoo Empire,巨港一帶屬巨港蘇丹國,雅加達一帶屬 Sultanate of Banten,麻六甲屬葡萄牙帝國,新加坡一帶屬柔佛蘇丹王朝,汶萊屬 Sultanate of Brunei。', '沒有找到有出處的中文名的政權,先寫英文。'], src: [WD('Q841364'), WD('Q734867'), WD('Q887803')] }),
  E('sea', '1930', '殖民時期', '1930 年前後', 1930, '1930', {
    info: ['疆界資料裡:今曼谷一帶屬暹羅,吳哥、永珍一帶屬法屬印度支那,仰光一帶屬英屬印度,雅加達、巨港一帶屬荷屬東印度,麻六甲、新加坡、汶萊屬大英帝國。'], src: [WD('Q185682'), WD('Q1155700')] }),
  E('sea', '2000', '獨立以後', '2000 年前後', 2000, '2000', {
    info: ['疆界資料裡:泰國、柬埔寨、緬甸、寮國、印度尼西亞、馬來西亞、新加坡、汶萊(Sultanate of Brunei)各自獨立。'], src: [WD('Q869'), WD('Q252'), WD('Q833')] }),
  // ---------------------------------------------------------------- 美國(使用者 2026-11-04 裁 CPM 待裁 56):只做 1607 起;原住民族時期只放文字
  // 分期依據:美國國務院歷史文獻辦公室 Milestones 的章節年段(docs/research/wy60/usa.md 第一、二節)
  E('us', 'native', '原住民族時期', '~1607', 1550, null, {
    info: ['美國國家公園管理局:原住民族在今維吉尼亞州至少已住了 1 萬 6 千年,在今俄亥俄州東北部至少 1 萬 3 千年。', '疆界資料只畫出少數幾個群體,所以這個時期只放文字、不畫地圖。'],
    src: [NPS('articles/settlejames.htm', 'Settling the James River'), NPS('articles/000/timeline-of-native-american-cultures.htm', 'Timeline of Native American Cultures')] }),
  E('us', 'colony', '殖民地時期', '1607~1775', 1640, '1640', { clio: ['English Colonial Empire', 'New Netherland', 'New Sweden'], view: [-100, 18, -55, 52],
    info: ['美國國家公園管理局:1607 年在詹姆斯鎮的定居點,後來發展成繁榮的殖民地。', '地圖用 1640 年的疆界:英格蘭、荷蘭、瑞典、法國在北美東岸各有殖民地。'],
    src: [NPS('jame/index.htm', 'Historic Jamestowne'), WD('Q179997')] }),
  E('us', 'found', '獨立戰爭與建國', '1775~1789', 1780, '1780', { clio: ['United States of America'], view: [-95, 24, -62, 50],
    info: ['教育部辭典「美國獨立宣言」:西元 1776 年 7 月 4 日,北美十三州殖民地的代表發表。', '1783 年 9 月 3 日在巴黎簽訂和約;憲法在 1789 年生效(美國國務院歷史文獻辦公室)。'],
    src: [MOE('美國獨立宣言'), SD('1776-1783/treaty', 'Treaty of Paris, 1783'), SD('1784-1800/convention-and-ratification', 'Constitutional Convention and Ratification, 1787–1789'), WD('Q40949')] }),
  E('us', 'west', '早期共和與西進', '1789~1860', 1850, '1850', { clio: ['United States of America'],
    info: ['美國國務院歷史文獻辦公室:1803 年向法國買下路易斯安那。', '疆界資料沒有把西部部分地區畫進美國(灰色斜線)。'],
    src: [SD('1801-1829/louisiana-purchase', 'Louisiana Purchase, 1803'), SD('1830-1860/china-1', 'The Opening to China Part I'), SD('1830-1860/opening-to-japan', 'The United States and the Opening to Japan, 1853'), WD('Q1326406')],
    box: { h: '和中國、日本的往來', items: ['1844 年美國和清朝簽訂〈望廈條約〉,是兩國第一個正式條約(美國國務院歷史文獻辦公室)。', '1853 年 7 月 8 日美國培里率艦隊駛入今東京灣;1854 年 3 月 31 日和日本簽訂條約(美國國務院歷史文獻辦公室)。'] } }),
  E('us', 'civil', '南北戰爭', '1861~1865', 1863, '1863', { clio: ['United States of America', 'Confederate States of America'],
    info: ['教育部辭典「南北戰爭」:十九世紀發生於美國的內戰;1865 年南方投降,美國終告統一。', 'Wikidata 記 1861 年 4 月 12 日到 1865 年 4 月 9 日。', '疆界資料把南方各州畫成「美利堅邦聯」。'],
    src: [MOE('南北戰爭'), WD('Q8676'), WD('Q81931')] }),
  E('us', 'gilded', '重建與工業化', '1865~1898', 1880, '1880', { clio: ['United States of America'],
    info: ['美國國會圖書館:重建時期從 1865 年到 1877 年。', '疆界資料沒有把西部部分地區畫進美國(灰色斜線)。'],
    src: [LOC_RE, LOC_CN, SD('1866-1898/chinese-immigration', 'Chinese Immigration and the Chinese Exclusion Acts')],
    box: { h: '和中國的往來', items: ['美國國會圖書館的中文館藏,從 1869 年收到清朝同治皇帝所贈 10 種 933 冊書開始;今天藏書 120 萬冊以上,最古老的是 975 年雷峰塔出土的佛經。', '1882 年美國通過法律,暫停華工移民;到 1943 年才廢止(美國國務院歷史文獻辦公室)。'] } }),
  E('us', 'wars', '兩次世界大戰', '1898~1945', 1930, '1930', { clio: ['United States of America'],
    info: ['第一次世界大戰 1914~1918 年、第二次世界大戰 1939~1945 年(Wikidata)。', '疆界資料把這時的菲律賓也畫在「美國」裡。'],
    src: [WD('Q361'), WD('Q362'), SD('1866-1898/spanish-american-war', 'The Spanish-American War, 1898'), MOE('清華大學')],
    box: { h: '和臺灣、中國、菲律賓的往來', items: ['1898 年美西戰爭後,西班牙把關島、波多黎各割讓給美國,並同意把菲律賓賣給美國(美國國務院歷史文獻辦公室)。', '教育部辭典「清華大學」:原為以美國退還的庚子賠款辦理的留美預備學校;1956 年在臺灣新竹復校。'] } }),
  E('us', 'post', '冷戰至今', '1945~', 2000, '2000', { clio: ['United States of America'],
    info: ['冷戰:Wikidata 記 1945 年到 1991 年 12 月 25 日。'],
    src: [WD('Q8683'), SD('1945-1952', 'The Early Cold War'), SD('1953-1960/taiwan-strait-crises', 'The Taiwan Straits Crises: 1954–55 and 1958'), WD('Q7524749'), SD('1977-1980/china-policy', 'China Policy'), MOE('臺灣關係法')],
    box: { h: '和臺灣、中國、日本的往來', items: ['1945~1952 年美國佔領並協助重建日本(美國國務院歷史文獻辦公室)。', '1954 年美國和中華民國簽訂〈中美共同防禦條約〉。', '1979 年 1 月 1 日美國和中華人民共和國建交;同年 4 月 10 日〈臺灣關係法〉成為美國法律。教育部辭典:為維持與臺灣的非正式官方關係而制定的國內法。'] } }),
]);

// 菲律賓與臺灣的淵源(使用者 2026-11-01 裁按建議):每個菲律賓時期的說明卡都附,連到站上已有的說明卡,不重寫
export const PH_LINKS = Object.freeze([
  { text: '1626~1642 年西班牙從菲律賓北上,佔領雞籠(今基隆)、淡水', go: ['tw-hx', 'es'], label: '臺灣・荷西時期 →' },
  { text: '南島語族:語言學與基因研究認為從臺灣經菲律賓向外擴散', go: ['tw-pre', 'austronesian'], label: '臺灣・南島語族的老家 →' },
  { text: '蘭嶼雅美(達悟)族與菲律賓巴丹島:遷徙傳說、金銀鍛冶技術從巴丹島傳入', href: 'https://www.cip.gov.tw/zh-tw/tribe/grid-list/5839F78F6C869EE4D0636733C6861689/info.html?cumid=8F19BF08AE220D65', label: '原住民族委員會〈雅美族〉' },
]);
