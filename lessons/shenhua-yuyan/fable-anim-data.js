import { narrator } from '../../shared/roles.js?v=62dbb37';
export const animMeta = { title: '動畫故事：古代寓言', note: '情節為教學改編；旁白依原典摘句與故事卡改寫成白話。' };
export const roles = { narrator };
const L = (text) => ({ at: 1, role: 'narrator', text });
// 整幅道具(樂工、京臺、推理線索)鋪滿舞台;小件(竽、大雁、糧袋、放大鏡、空位子)放在 x、y(中心點,舞台百分比)。
const FULL_PROPS = new Set(['musicians', 'terrace', 'reasoning']);
const prop = (name, x, y, delay = 0) => (FULL_PROPS.has(name) ? { kind: 'prop', name, x: 50, y: 50, delay } : { kind: 'prop', name, x, y, delay });
const actor = (who, x, y, h = 55, flip = false) => ({ kind: 'actor', who, x, y, h, flip, anim: 'fade' });
const scene = (id, title, duration, bg, card, text, items) => ({ id: `s${id}`, title, duration, bg, card, source: card ? (id <= 5 ? '《韓非子‧內儲說上》' : '《戰國策‧楚策四》') : '', lines: [L(text)], items });
export const scenes = [
 scene(1,'開場',8,'paper','', '寓言常用一個小故事，讓我們想一想做人做事的道理。這次要看竽聲，還要看大雁。',[prop('yu',34,58),prop('goose',70,40)]),
 scene(2,'三百人合奏',18,'court','齊宣王使人吹竽，必三百人。南郭處士請為王吹竽，','齊宣王喜歡聽很多人一起吹竽，每次一定要三百個人合奏。南郭處士也來報名，可是他其實不會吹。',[prop('musicians',50,58),prop('yu',93,82),actor('qi-xuan',15,96,58),actor('nanguo-n1',80,96,54,true)]),
 scene(3,'混在隊伍裡',16,'court','宣王說之，廩食以數百人。','在熱鬧的聲音裡，南郭只要跟著大家比手勢，看起來就像真的在演奏，也和其他人一樣領到糧食。',[prop('musicians',48,57),prop('grain',91,86,3),actor('nanguo-n1',80,96,54,true),actor('qi-xuan',15,96,58)]),
 scene(4,'改成逐一聽',18,'court','宣王死，湣王立，好一一聽之，','後來齊湣王即位。他喜歡一個一個聽，想知道每位樂工吹得怎麼樣。南郭一聽，心裡很慌。',[prop('musicians',48,58),actor('qi-min',15,96,56),actor('nanguo-n1',80,96,54,true)]),
 scene(5,'溜走與想一想',14,'paper','處士逃。','他抱著竽悄悄離開了。這個故事提醒我們：想混過去也許一時容易，真正能幫助自己的還是練好本領。',[prop('emptySeat',34,82),actor('nanguo-n2',72,96,60,true)]),
 scene(6,'京臺看雁',16,'sky','更羸與魏王處京臺之下，仰見飛鳥。更羸謂魏王曰：「臣為王引弓虛發而下鳥。」','另一個故事裡，射箭高手更羸陪魏王站在高臺下。他說：「我不用放箭，只拉一下空弓，就能讓鳥掉下來。」',[prop('terrace',50,68),prop('goose',80,42),actor('genglei',22,96,60),actor('wei-wang',58,96,58,true)]),
 scene(7,'空弓一響',16,'sky','有間，雁從東方來，更羸以虛發而下之。','不久，一隻大雁從東方飛來。更羸拉一下空弓，大雁真的掉了下來，魏王看得目瞪口呆。',[prop('terrace',50,70),prop('fallingGoose',82,48,4),actor('genglei',22,96,60),actor('wei-wang',58,96,58,true)]),
 scene(8,'細看線索',18,'paper','其飛徐而鳴悲。飛徐者，故瘡痛也；鳴悲者，久失群也。','更羸解釋：這隻雁飛得慢，是舊傷還在痛；叫聲悲傷，是離開雁群很久了。牠一聽到弦聲就驚慌往高處飛，舊傷撐不住，就掉下來了。',[prop('reasoning',50,49),prop('gooseLeft',50,94),prop('magnifier',92,10),actor('genglei',13,96,54),actor('wei-wang',87,96,52,true)]),
 scene(9,'收尾',10,'paper','', '南郭的故事說真本領要靠準備；更羸的故事說判斷要靠觀察。你會怎麼把這兩個提醒用在生活裡？',[prop('yu',26,56),prop('magnifier',52,58),prop('goose',78,44)]),
];
export const sayReplacements = {};
export const sayApproved = [];
export const polyphones = ['竽','處','齊','湣','更','羸','京','臺','虛','發','強','好','說','為','數','一','會','得','還','只'];
const line = (id) => scenes[Number(id.match(/\d+/)[0]) - 1].lines[0].text;
export const readingChecked = [{ id:'s2-1', spoken:line('s2-1'), char:'竽', nth:0, reading:'ㄩˊ' }];
export const pendingListen = [
 ['s2-1','處','ㄔㄨˇ'],['s2-1','齊','ㄑㄧˊ'],['s2-1','宣','ㄒㄩㄢ'],['s4-1','湣','ㄇㄧㄣˇ'],['s6-1','更','ㄍㄥ'],['s6-1','羸','ㄌㄟˊ'],['s6-1','臺','ㄊㄞˊ'],
].map(([id,char,reading]) => ({ id, spoken:line(id), char, nth:0, reading }));
