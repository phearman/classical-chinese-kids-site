// 〈古代神話與寓言選〉「神話」動畫故事資料(WY26 PR-B1,單一資料來源)。依 lessons/shenhua-yuyan/storyboard.md 十二幕(CPM 2026-10-22 核准)。
// 角色圖:使用者 2026-10-22 待裁 61 挑定盤古 A、女媧 B、共工 C、祝融 C、顓頊 A、夸父 A(暫定)(shared/characters/*.webp);
// 換圖只要換同名 webp(夸父 B/C 出來後),這裡不必改。背景與道具為程式繪製(shared/myth-props.js)。
// 旁白、字幕皆為本站自行撰寫;字卡是原典(〈夸父逐日〉全文)與故事卡出處的摘句,版本見 storyboard.md「原典字卡出處」。情節為教學改編。
//
// scene:bg 背景(paper/chaos/sky/garden)、card 畫面字卡(空字串=這一幕不放字卡)、source 字卡出處(書名+篇名,顯示在字卡下方)、lines 旁白(at=幕內第幾秒出現)、
//        items 畫面元件:actor 角色 / text 浮字 / prop 道具(見 animation.js 的 PROPS)
// 位置一律用舞台百分比:x=水平中心、y=底部(角色)或中心(文字),h=角色高度。
// 安全處理(CPM 核准):共工只衝不傷;盤古化身用對照圖;「斷鼇足」只用旁白帶過;不放猛獸食人與殺黑龍;夸父只畫跪下。
import { narrator } from '../../shared/roles.js?v=ad37985';

export const animMeta = {
  title: '動畫故事：古代神話',
  note: '情節為教學改編；旁白依原典與故事卡改寫成白話。',
};

export const roles = { narrator };

export const scenes = [
  {
    id: 's1', title: '開場', duration: 8, bg: 'paper',
    card: '',
    lines: [
      { at: 1, role: 'narrator', text: '很久很久以前，人們好奇天地是怎麼來的，就用想像力編出了神話。' },
    ],
    items: [
      { kind: 'text', text: '古代神話', x: 50, y: 40, size: 14, anim: 'pop', cls: 'title' },
      { kind: 'text', text: '天地是怎麼來的？', x: 50, y: 66, size: 6, anim: 'fade', delay: 3, cls: 'fine' },
    ],
  },
  {
    id: 's2', title: '盤古撐天', duration: 22, bg: 'chaos',
    card: '天地渾沌如雞子，盤古生其中。……天日高一丈，地日厚一丈，盤古日長一丈。', source: '徐整《三五曆紀》',
    lines: [
      { at: 1, role: 'narrator', text: '傳說天和地原本混在一起，像一顆大雞蛋，巨人盤古就在裡面誕生。' },
      { at: 9, role: 'narrator', text: '天每天高一丈，大地每天厚一丈，盤古也每天長高一丈，把天和地撐得越來越遠。' },
    ],
    items: [
      { kind: 'prop', name: 'egg', x: 50, y: 50 },
      { kind: 'prop', name: 'skyEarth', x: 50, y: 50 },
      { kind: 'actor', who: 'pangu', x: 50, y: 92, h: 62, anim: 'riseUp', delay: 5 },
    ],
  },
  {
    id: 's3', title: '盤古化身', duration: 16, bg: 'paper',
    card: '氣成風雲，聲為雷霆，左眼為日，右眼為月，……血液為江河，……髮髭為星辰，皮毛為草木。', source: '《五運歷年記》',
    lines: [
      { at: 1, role: 'narrator', text: '盤古最後倒下以後，他呼出的氣變成風和雲，聲音變成雷，' },
      { at: 8, role: 'narrator', text: '眼睛變成太陽和月亮，血變成江河，頭髮鬍子變成星星，皮膚和毛變成草木。' },
    ],
    items: [
      { kind: 'actor', who: 'pangu', x: 18, y: 96, h: 56, anim: 'fadeOut', delay: 1 }, // 慢慢躺下淡出,不畫死去的樣子
      { kind: 'prop', name: 'chart', x: 50, y: 50 },
    ],
  },
  {
    id: 's4', title: '天破了', duration: 12, bg: 'sky',
    card: '往古之時，四極廢，九州裂，天不兼覆，地不周載。', source: '《淮南子‧覽冥訓》',
    lines: [
      { at: 1, role: 'narrator', text: '不知道過了多久，撐天的柱子壞了，天破了洞，大地也裂開，大火燒個不停，大水也退不下去。' },
    ],
    items: [
      { kind: 'prop', name: 'broken', x: 50, y: 50 },
    ],
  },
  {
    id: 's5', title: '女媧補天', duration: 20, bg: 'sky',
    card: '女媧煉五色石以補蒼天，斷鼇足以立四極，……積蘆灰以止淫水。', source: '《淮南子‧覽冥訓》',
    lines: [
      { at: 1, role: 'narrator', text: '女媧煉了五種顏色的石頭，把天上的洞一個一個補好；' },
      { at: 9, role: 'narrator', text: '又用大海龜的腳立起四根天柱，把蘆葦燒成灰擋住大水。' },
      { at: 15, role: 'narrator', text: '天補好了，大家又能平安過日子。' },
    ],
    items: [
      { kind: 'prop', name: 'mend', x: 50, y: 50 },
      { kind: 'actor', who: 'nuwa', x: 26, y: 98, h: 64, anim: 'fade' }, // 站在前兩根天柱中間,不壓柱
    ],
  },
  {
    id: 's6', title: '共工撞山', duration: 20, bg: 'sky',
    card: '昔者共工與顓頊爭為帝，怒而觸不周之山，天柱折，地維絕。', source: '《淮南子‧天文訓》',
    lines: [
      { at: 1, role: 'narrator', text: '《淮南子》的另一篇〈天文訓〉說：水神共工和顓頊爭著當天帝。' },
      { at: 7, role: 'narrator', text: '共工一生氣，低頭撞向不周山，撐天的柱子斷了！' },
    ],
    items: [
      { kind: 'text', text: '說法一：《淮南子‧天文訓》', x: 30, y: 90, size: 4.5, cls: 'tag' }, // 放下方,不和字卡搶位置
      { kind: 'prop', name: 'buzhou', x: 50, y: 50 },
      { kind: 'actor', who: 'zhuanxu', x: 12, y: 96, h: 54 },
      { kind: 'actor', who: 'gonggong', x: 56, y: 96, h: 54, anim: 'charge', delay: 4 }, // 只畫往前衝,撞擊與裂痕由道具畫
    ],
  },
  {
    id: 's7', title: '天傾西北', duration: 12, bg: 'paper',
    card: '天傾西北，故日月星辰移焉；地不滿東南，故水潦塵埃歸焉。', source: '《淮南子‧天文訓》',
    lines: [
      { at: 1, role: 'narrator', text: '從此天往西北傾斜，太陽、月亮和星星都往那邊移動；' },
      { at: 6, role: 'narrator', text: '大地的東南角塌了下去，所以江河都往東南流。' },
    ],
    items: [
      { kind: 'prop', name: 'tilt', x: 50, y: 50 },
    ],
  },
  {
    id: 's8', title: '另一種說法', duration: 12, bg: 'sky',
    card: '乃與祝融戰，不勝而怒。乃頭觸不周山崩，天柱折。', source: '司馬貞〈三皇本紀〉',
    lines: [
      { at: 1, role: 'narrator', text: '不過，唐代的〈三皇本紀〉說，和共工打仗的是火神祝融，共工打輸了才去撞山。' },
      { at: 9, role: 'narrator', text: '同一個神話，不同的書，說法不一樣。' },
    ],
    items: [
      { kind: 'text', text: '說法二：〈三皇本紀〉', x: 50, y: 90, size: 4.5, cls: 'tag' },
      { kind: 'actor', who: 'gonggong', x: 26, y: 96, h: 50 },
      { kind: 'text', text: 'VS', x: 50, y: 62, size: 10, anim: 'pop', delay: 2, cls: 'mark' },
      { kind: 'actor', who: 'zhurong', x: 76, y: 96, h: 54, anim: 'fromRight', delay: 1 },
    ],
  },
  {
    id: 's9', title: '夸父追日', duration: 14, bg: 'garden',
    card: '夸父與日逐走，入日。', source: '《山海經‧海外北經》',
    lines: [
      { at: 1, role: 'narrator', text: '還有一位巨人叫夸父。' },
      { at: 4, role: 'narrator', text: '他和太陽賽跑，一直追到太陽快要落下的地方。' },
    ],
    items: [
      { kind: 'prop', name: 'sunset', x: 50, y: 50 },
      { kind: 'actor', who: 'kuafu', x: 56, y: 96, h: 60, anim: 'runIn' },
    ],
  },
  {
    id: 's10', title: '喝乾河水', duration: 14, bg: 'garden',
    card: '渴，欲得飲，飲於河、渭，河、渭不足，北飲大澤。', source: '《山海經‧海外北經》',
    lines: [
      { at: 1, role: 'narrator', text: '夸父跑得好渴，一口氣喝光了黃河和渭水，' },
      { at: 7, role: 'narrator', text: '還是不夠，又往北方去找大湖的水。' },
    ],
    items: [
      { kind: 'prop', name: 'rivers', x: 50, y: 50 },
      { kind: 'actor', who: 'kuafu', x: 22, y: 96, h: 58, anim: 'slowBob' },
    ],
  },
  {
    id: 's11', title: '手杖變桃林', duration: 16, bg: 'garden',
    card: '未至，道渴而死。棄其杖，化為鄧林。', source: '《山海經‧海外北經》',
    lines: [
      { at: 1, role: 'narrator', text: '可是還沒走到，夸父就倒在半路上。', say: '可是還沒走到，夸父就島在半路上。' }, // WY35:「倒」被念成 ㄉㄠˋ
      { at: 7, role: 'narrator', text: '他丟下的手杖，長成了一大片桃林。' },
    ],
    items: [
      { kind: 'actor', who: 'kuafu', x: 20, y: 96, h: 56, anim: 'fadeOut', delay: 3 }, // 累得跪下、淡出
      { kind: 'prop', name: 'grove', x: 50, y: 50 },
    ],
  },
  {
    id: 's12', title: '收尾', duration: 10, bg: 'paper',
    card: '',
    lines: [
      { at: 1, role: 'narrator', text: '天地、日月、河流、樹林……古人用想像力，為身邊的世界找到了答案。' },
      { at: 7, role: 'narrator', text: '你會怎麼解釋呢？' },
    ],
    items: [
      { kind: 'prop', name: 'icons', x: 50, y: 50 },
      { kind: 'text', text: '古人用想像力解釋世界', x: 50, y: 82, size: 5.5, anim: 'fade', delay: 2, cls: 'title' },
    ],
  },
];

// 朗讀用同音字對照(say 只能做這些替換;字幕仍顯示 text)
// WY35(使用者 2026-10-23 試聽):第 11 幕「倒在半路上」的「倒」被內建語音念成 ㄉㄠˋ,改念同音的「島」(ㄉㄠˇ)
export const sayReplacements = { 倒: '島' };
// 核准使用 say 的句子(每句都經使用者試聽確認);新增 say 必須先登記在這裡
export const sayApproved = [
  { id: 's11-1', why: '倒→島(倒在半路上,ㄉㄠˇ)' },
];

// ---------------------------------------------------------------- 讀音防呆(比照第 7 課)
// 以實際朗讀的句子為準:句子裡每個多音字與少見人名、地名都要登記讀音(依教育部《重編國語辭典修訂本》)。
export const polyphones = [
  '參', '曾', '教', '省', '樂', '行', '重', '長', '為', '少', '好', '看', '了', '得', '和',
  '數', '當', '還', '卷', '應', '轉', '幾', '沒', '分', '將', '都', '只',
  '要', '說', '會', '傳', '血', '頭', '倒', '喝', '解', '答', '從', '那', '角', '打',
  '共', '顓', '頊', '媧', '周', '渭', '夸', '煉',
  '島', // WY35:say 換上的同音字也登記讀音(使用者已確認)
  '地', // WY35:單獨的「地」會被內建語音念成 ㄉㄜ˙(使用者 10-23 試聽第 7 幕),改寫成「大地」;每個「地」都列入試聽
];

// 使用者已試聽確認的
export const readingChecked = [
  { id: 's11-1', spoken: '可是還沒走到，夸父就島在半路上。', char: '島', nth: 0, reading: 'ㄉㄠˇ' }, // WY35:使用者確認「倒」要念 ㄉㄠˇ
];

// 還沒人聽過的(本課旁白全部待使用者試聽;讀音依教育部辭典。共工、顓頊、女媧、不周山 2026-10-22 已查《重編國語辭典修訂本》,
// 長(ㄓㄤˇ)、渭 這次辭典查詢被擋,先用一般讀音,見 lessons/shenhua-yuyan/storyboard.md「讀音防呆」)
export const pendingListen = [
  { id: 's1-1', spoken: '很久很久以前，人們好奇天地是怎麼來的，就用想像力編出了神話。', char: '好', nth: 0, reading: 'ㄏㄠˋ' },
  { id: 's1-1', spoken: '很久很久以前，人們好奇天地是怎麼來的，就用想像力編出了神話。', char: '地', nth: 0, reading: 'ㄉㄧˋ' },
  { id: 's1-1', spoken: '很久很久以前，人們好奇天地是怎麼來的，就用想像力編出了神話。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's2-1', spoken: '傳說天和地原本混在一起，像一顆大雞蛋，巨人盤古就在裡面誕生。', char: '傳', nth: 0, reading: 'ㄔㄨㄢˊ' },
  { id: 's2-1', spoken: '傳說天和地原本混在一起，像一顆大雞蛋，巨人盤古就在裡面誕生。', char: '說', nth: 0, reading: 'ㄕㄨㄛ' },
  { id: 's2-1', spoken: '傳說天和地原本混在一起，像一顆大雞蛋，巨人盤古就在裡面誕生。', char: '和', nth: 0, reading: 'ㄏㄜˊ' },
  { id: 's2-1', spoken: '傳說天和地原本混在一起，像一顆大雞蛋，巨人盤古就在裡面誕生。', char: '地', nth: 0, reading: 'ㄉㄧˋ' },
  { id: 's2-2', spoken: '天每天高一丈，大地每天厚一丈，盤古也每天長高一丈，把天和地撐得越來越遠。', char: '地', nth: 0, reading: 'ㄉㄧˋ' },
  { id: 's2-2', spoken: '天每天高一丈，大地每天厚一丈，盤古也每天長高一丈，把天和地撐得越來越遠。', char: '長', nth: 0, reading: 'ㄓㄤˇ' },
  { id: 's2-2', spoken: '天每天高一丈，大地每天厚一丈，盤古也每天長高一丈，把天和地撐得越來越遠。', char: '和', nth: 0, reading: 'ㄏㄜˊ' },
  { id: 's2-2', spoken: '天每天高一丈，大地每天厚一丈，盤古也每天長高一丈，把天和地撐得越來越遠。', char: '地', nth: 1, reading: 'ㄉㄧˋ' },
  { id: 's2-2', spoken: '天每天高一丈，大地每天厚一丈，盤古也每天長高一丈，把天和地撐得越來越遠。', char: '得', nth: 0, reading: 'ㄉㄜ˙' },
  { id: 's3-1', spoken: '盤古最後倒下以後，他呼出的氣變成風和雲，聲音變成雷，', char: '倒', nth: 0, reading: 'ㄉㄠˇ' },
  { id: 's3-1', spoken: '盤古最後倒下以後，他呼出的氣變成風和雲，聲音變成雷，', char: '和', nth: 0, reading: 'ㄏㄜˊ' },
  { id: 's3-2', spoken: '眼睛變成太陽和月亮，血變成江河，頭髮鬍子變成星星，皮膚和毛變成草木。', char: '和', nth: 0, reading: 'ㄏㄜˊ' },
  { id: 's3-2', spoken: '眼睛變成太陽和月亮，血變成江河，頭髮鬍子變成星星，皮膚和毛變成草木。', char: '血', nth: 0, reading: 'ㄒㄧㄝˇ' },
  { id: 's3-2', spoken: '眼睛變成太陽和月亮，血變成江河，頭髮鬍子變成星星，皮膚和毛變成草木。', char: '頭', nth: 0, reading: 'ㄊㄡˊ' },
  { id: 's3-2', spoken: '眼睛變成太陽和月亮，血變成江河，頭髮鬍子變成星星，皮膚和毛變成草木。', char: '和', nth: 1, reading: 'ㄏㄜˊ' },
  { id: 's4-1', spoken: '不知道過了多久，撐天的柱子壞了，天破了洞，大地也裂開，大火燒個不停，大水也退不下去。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's4-1', spoken: '不知道過了多久，撐天的柱子壞了，天破了洞，大地也裂開，大火燒個不停，大水也退不下去。', char: '了', nth: 1, reading: 'ㄌㄜ˙' },
  { id: 's4-1', spoken: '不知道過了多久，撐天的柱子壞了，天破了洞，大地也裂開，大火燒個不停，大水也退不下去。', char: '了', nth: 2, reading: 'ㄌㄜ˙' },
  { id: 's4-1', spoken: '不知道過了多久，撐天的柱子壞了，天破了洞，大地也裂開，大火燒個不停，大水也退不下去。', char: '地', nth: 0, reading: 'ㄉㄧˋ' },
  { id: 's5-1', spoken: '女媧煉了五種顏色的石頭，把天上的洞一個一個補好；', char: '媧', nth: 0, reading: 'ㄨㄚ' },
  { id: 's5-1', spoken: '女媧煉了五種顏色的石頭，把天上的洞一個一個補好；', char: '煉', nth: 0, reading: 'ㄌㄧㄢˋ' },
  { id: 's5-1', spoken: '女媧煉了五種顏色的石頭，把天上的洞一個一個補好；', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's5-1', spoken: '女媧煉了五種顏色的石頭，把天上的洞一個一個補好；', char: '頭', nth: 0, reading: 'ㄊㄡ˙' },
  { id: 's5-1', spoken: '女媧煉了五種顏色的石頭，把天上的洞一個一個補好；', char: '好', nth: 0, reading: 'ㄏㄠˇ' },
  { id: 's5-3', spoken: '天補好了，大家又能平安過日子。', char: '好', nth: 0, reading: 'ㄏㄠˇ' },
  { id: 's5-3', spoken: '天補好了，大家又能平安過日子。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's6-1', spoken: '《淮南子》的另一篇〈天文訓〉說：水神共工和顓頊爭著當天帝。', char: '說', nth: 0, reading: 'ㄕㄨㄛ' },
  { id: 's6-1', spoken: '《淮南子》的另一篇〈天文訓〉說：水神共工和顓頊爭著當天帝。', char: '共', nth: 0, reading: 'ㄍㄨㄥ' },
  { id: 's6-1', spoken: '《淮南子》的另一篇〈天文訓〉說：水神共工和顓頊爭著當天帝。', char: '和', nth: 0, reading: 'ㄏㄜˊ' },
  { id: 's6-1', spoken: '《淮南子》的另一篇〈天文訓〉說：水神共工和顓頊爭著當天帝。', char: '顓', nth: 0, reading: 'ㄓㄨㄢ' },
  { id: 's6-1', spoken: '《淮南子》的另一篇〈天文訓〉說：水神共工和顓頊爭著當天帝。', char: '頊', nth: 0, reading: 'ㄒㄩˋ' },
  { id: 's6-1', spoken: '《淮南子》的另一篇〈天文訓〉說：水神共工和顓頊爭著當天帝。', char: '當', nth: 0, reading: 'ㄉㄤ' },
  { id: 's6-2', spoken: '共工一生氣，低頭撞向不周山，撐天的柱子斷了！', char: '共', nth: 0, reading: 'ㄍㄨㄥ' },
  { id: 's6-2', spoken: '共工一生氣，低頭撞向不周山，撐天的柱子斷了！', char: '頭', nth: 0, reading: 'ㄊㄡˊ' },
  { id: 's6-2', spoken: '共工一生氣，低頭撞向不周山，撐天的柱子斷了！', char: '周', nth: 0, reading: 'ㄓㄡ' },
  { id: 's6-2', spoken: '共工一生氣，低頭撞向不周山，撐天的柱子斷了！', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's7-1', spoken: '從此天往西北傾斜，太陽、月亮和星星都往那邊移動；', char: '從', nth: 0, reading: 'ㄘㄨㄥˊ' },
  { id: 's7-1', spoken: '從此天往西北傾斜，太陽、月亮和星星都往那邊移動；', char: '和', nth: 0, reading: 'ㄏㄜˊ' },
  { id: 's7-1', spoken: '從此天往西北傾斜，太陽、月亮和星星都往那邊移動；', char: '都', nth: 0, reading: 'ㄉㄡ' },
  { id: 's7-1', spoken: '從此天往西北傾斜，太陽、月亮和星星都往那邊移動；', char: '那', nth: 0, reading: 'ㄋㄚˋ' },
  { id: 's7-2', spoken: '大地的東南角塌了下去，所以江河都往東南流。', char: '地', nth: 0, reading: 'ㄉㄧˋ' },
  { id: 's7-2', spoken: '大地的東南角塌了下去，所以江河都往東南流。', char: '角', nth: 0, reading: 'ㄐㄧㄠˇ' },
  { id: 's7-2', spoken: '大地的東南角塌了下去，所以江河都往東南流。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's7-2', spoken: '大地的東南角塌了下去，所以江河都往東南流。', char: '都', nth: 0, reading: 'ㄉㄡ' },
  { id: 's8-1', spoken: '不過，唐代的〈三皇本紀〉說，和共工打仗的是火神祝融，共工打輸了才去撞山。', char: '說', nth: 0, reading: 'ㄕㄨㄛ' },
  { id: 's8-1', spoken: '不過，唐代的〈三皇本紀〉說，和共工打仗的是火神祝融，共工打輸了才去撞山。', char: '和', nth: 0, reading: 'ㄏㄜˊ' },
  { id: 's8-1', spoken: '不過，唐代的〈三皇本紀〉說，和共工打仗的是火神祝融，共工打輸了才去撞山。', char: '共', nth: 0, reading: 'ㄍㄨㄥ' },
  { id: 's8-1', spoken: '不過，唐代的〈三皇本紀〉說，和共工打仗的是火神祝融，共工打輸了才去撞山。', char: '打', nth: 0, reading: 'ㄉㄚˇ' },
  { id: 's8-1', spoken: '不過，唐代的〈三皇本紀〉說，和共工打仗的是火神祝融，共工打輸了才去撞山。', char: '共', nth: 1, reading: 'ㄍㄨㄥ' },
  { id: 's8-1', spoken: '不過，唐代的〈三皇本紀〉說，和共工打仗的是火神祝融，共工打輸了才去撞山。', char: '打', nth: 1, reading: 'ㄉㄚˇ' },
  { id: 's8-1', spoken: '不過，唐代的〈三皇本紀〉說，和共工打仗的是火神祝融，共工打輸了才去撞山。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's8-2', spoken: '同一個神話，不同的書，說法不一樣。', char: '說', nth: 0, reading: 'ㄕㄨㄛ' },
  { id: 's9-1', spoken: '還有一位巨人叫夸父。', char: '還', nth: 0, reading: 'ㄏㄞˊ' },
  { id: 's9-1', spoken: '還有一位巨人叫夸父。', char: '夸', nth: 0, reading: 'ㄎㄨㄚ' },
  { id: 's9-2', spoken: '他和太陽賽跑，一直追到太陽快要落下的地方。', char: '和', nth: 0, reading: 'ㄏㄜˊ' },
  { id: 's9-2', spoken: '他和太陽賽跑，一直追到太陽快要落下的地方。', char: '要', nth: 0, reading: 'ㄧㄠˋ' },
  { id: 's9-2', spoken: '他和太陽賽跑，一直追到太陽快要落下的地方。', char: '地', nth: 0, reading: 'ㄉㄧˋ' },
  { id: 's10-1', spoken: '夸父跑得好渴，一口氣喝光了黃河和渭水，', char: '夸', nth: 0, reading: 'ㄎㄨㄚ' },
  { id: 's10-1', spoken: '夸父跑得好渴，一口氣喝光了黃河和渭水，', char: '得', nth: 0, reading: 'ㄉㄜ˙' },
  { id: 's10-1', spoken: '夸父跑得好渴，一口氣喝光了黃河和渭水，', char: '好', nth: 0, reading: 'ㄏㄠˇ' },
  { id: 's10-1', spoken: '夸父跑得好渴，一口氣喝光了黃河和渭水，', char: '喝', nth: 0, reading: 'ㄏㄜ' },
  { id: 's10-1', spoken: '夸父跑得好渴，一口氣喝光了黃河和渭水，', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's10-1', spoken: '夸父跑得好渴，一口氣喝光了黃河和渭水，', char: '和', nth: 0, reading: 'ㄏㄜˊ' },
  { id: 's10-1', spoken: '夸父跑得好渴，一口氣喝光了黃河和渭水，', char: '渭', nth: 0, reading: 'ㄨㄟˋ' },
  { id: 's10-2', spoken: '還是不夠，又往北方去找大湖的水。', char: '還', nth: 0, reading: 'ㄏㄞˊ' },
  { id: 's11-1', spoken: '可是還沒走到，夸父就島在半路上。', char: '還', nth: 0, reading: 'ㄏㄞˊ' },
  { id: 's11-1', spoken: '可是還沒走到，夸父就島在半路上。', char: '沒', nth: 0, reading: 'ㄇㄟˊ' },
  { id: 's11-1', spoken: '可是還沒走到，夸父就島在半路上。', char: '夸', nth: 0, reading: 'ㄎㄨㄚ' },
  { id: 's11-2', spoken: '他丟下的手杖，長成了一大片桃林。', char: '長', nth: 0, reading: 'ㄓㄤˇ' },
  { id: 's11-2', spoken: '他丟下的手杖，長成了一大片桃林。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's12-1', spoken: '天地、日月、河流、樹林……古人用想像力，為身邊的世界找到了答案。', char: '地', nth: 0, reading: 'ㄉㄧˋ' },
  { id: 's12-1', spoken: '天地、日月、河流、樹林……古人用想像力，為身邊的世界找到了答案。', char: '為', nth: 0, reading: 'ㄨㄟˋ' },
  { id: 's12-1', spoken: '天地、日月、河流、樹林……古人用想像力，為身邊的世界找到了答案。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's12-1', spoken: '天地、日月、河流、樹林……古人用想像力，為身邊的世界找到了答案。', char: '答', nth: 0, reading: 'ㄉㄚˊ' },
  { id: 's12-2', spoken: '你會怎麼解釋呢？', char: '會', nth: 0, reading: 'ㄏㄨㄟˋ' },
  { id: 's12-2', spoken: '你會怎麼解釋呢？', char: '解', nth: 0, reading: 'ㄐㄧㄝˇ' },
];
