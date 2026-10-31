// 臺灣時期線「當時的世界」說明卡(WY48)。使用者 2026-10-31:「台灣是被殖民國家。是否能增補一些,相關殖民國家當時的情況,為什麼會跑來台灣。」
// 寫法(CPM 派工):客觀、中性用語(統一用「統治」「殖民」等事實性用語,不加褒貶);衝突事件只寫原因與結果、不寫血腥細節;
// 原住民族是當時的主體之一(每張卡的「在地的人」)。內容一律自寫,⛔ 照搬課本或網站文字;每張卡附出處並標已查證/待查證。
// 欄位:era=對應 places.js 的臺灣時期線年代;who/world/why/end=四個問題(原住民族時期用 intro 段落,不套「誰來了」格式);
// people=在地的人;todo=還沒找到出處的說法(有就整張標「待查證」);route=示意航線([名稱, 經度, 緯度],依序連線;城市座標為概略位置,只作示意);src=出處(ok=已查證)。
// ⚠ 內容先經使用者同意才發佈(CPM 轉交)。

const S = {
  ith: { t: '黃富三〈A Brief History of Taiwan〉,中央研究院臺灣史研究所', u: 'https://www.ith.sinica.edu.tw/file/File/research%20group/Fu-San%20Huang-A%20Brief%20History%20of%20Taiwan.pdf' },
  madou: { t: '《原住民族重大歷史事件補充教材:麻豆社事件》,國家教育研究院', u: 'https://stv.naer.edu.tw/data/supplementary/%E5%8E%9F%E4%BD%8F%E6%B0%91%E6%97%8F%E9%87%8D%E5%A4%A7%E6%AD%B7%E5%8F%B2%E4%BA%8B%E4%BB%B6%E8%A3%9C%E5%85%85%E6%95%99%E6%9D%90-%E9%BA%BB%E8%B1%86%E7%A4%BE%E4%BA%8B%E4%BB%B6.pdf' },
  mudan: { t: '《原住民族重大歷史事件補充教材:牡丹社事件》,國家教育研究院', u: 'https://stv.naer.edu.tw/data/supplementary/%E5%8E%9F%E4%BD%8F%E6%B0%91%E6%97%8F%E9%87%8D%E5%A4%A7%E6%AD%B7%E5%8F%B2%E4%BA%8B%E4%BB%B6%E8%A3%9C%E5%85%85%E6%95%99%E6%9D%90-%E7%89%A1%E4%B8%B9%E7%A4%BE%E4%BA%8B%E4%BB%B6.pdf' },
  dajia: { t: '《原住民族重大歷史事件補充教材:大甲西社事件》,國家教育研究院', u: 'https://stv.naer.edu.tw/data/supplementary/%E5%8E%9F%E4%BD%8F%E6%B0%91%E6%97%8F%E9%87%8D%E5%A4%A7%E6%AD%B7%E5%8F%B2%E4%BA%8B%E4%BB%B6%E8%A3%9C%E5%85%85%E6%95%99%E6%9D%90-%E5%A4%A7%E7%94%B2%E8%A5%BF%E7%A4%BE%E4%BA%8B%E4%BB%B6.pdf' },
  kang: { t: '康培德〈荷蘭時期涉外事件〉,《原住民族文獻》第 21 期,原住民族委員會', u: 'https://ihc.cip.gov.tw/EJournal/EJournalCat/250' },
  guo: { t: '〈郭懷一抗荷事件〉,臺灣小故事 101,國家教育研究院', u: 'https://taiwanstory.naer.edu.tw/main_2_21.html' },
  wushe: { t: '〈霧社事件〉,中央研究院臺灣史研究所原住民族研究專區', u: 'https://ip.ith.sinica.edu.tw/digit-2.html' },
  handover: { t: '〈依約接收〉,中央研究院臺灣史研究所檔案館', u: 'https://archives.ith.sinica.edu.tw/collections_con.php?no=166' },
  yifu: { t: '〈「一府」:從臺南府城入臺的欽差大臣〉,中央研究院臺灣史研究所檔案館', u: 'https://archives.ith.sinica.edu.tw/collections_con.php?no=150' },
  zeelandia: { t: '〈熱蘭遮城〉,國家文化記憶庫(文化部)', u: 'https://tcmb.culture.tw/zh-tw/detail?id=161884&indexCode=Culture_Place' },
  salvador: { t: '〈聖薩爾瓦多街〉,國家文化記憶庫(文化部)', u: 'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Place&id=258849' },
  tamsui: { t: '〈淡水紅毛城〉,國家文化記憶庫(文化部)', u: 'https://tcmb.culture.tw/zh-tw/detail?indexCode=BOCH_CountryCulture_11&id=19831228000002' },
  keelung: { t: '〈歷史沿革〉,基隆市政府', u: 'https://www.klcg.gov.tw/tw/klcg1/3173.html' },
  voc: { t: '〈尋找東方金銀島:荷蘭人遇見臺灣東部村社〉特展,國立臺灣史前文化博物館', u: 'https://special.nmp.gov.tw/2016VOTI/show02.html' },
  tribes: { t: '〈原住民族 16 族簡介〉,原住民族委員會', u: 'https://www.cip.gov.tw/zh-tw/tribe/grid-list/index.html?cumid=8F19BF08AE220D65' },
  // WY49 原住民族的來源(研究底稿 docs/research/wy49-indigenous-origins.md;△ 出處已於施工時核對原文,紀錄在 docs/research/wy48/sources.md)
  nmpNeo: { t: '國立臺灣史前文化博物館考古學習網〈新石器時代〉', u: 'https://archae.nmp.gov.tw/c-04.html' },
  nmpChangbin: { t: '國立臺灣史前文化博物館 臺灣史前文化雲〈長濱文化〉', u: 'https://icloud.nmp.gov.tw/Classroom/Prehistoric?a=74' },
  nmpBaxian: { t: '國立臺灣史前文化博物館〈八仙洞遺址超過2萬年考古重大發現〉(2009-07-24)', u: 'https://archae.nmp.gov.tw/a-news01728d.html?PAGE=1&ID=109' },
  ko2014: { t: 'Ko 等(2014)Early Austronesians: Into and Out of Taiwan,《American Journal of Human Genetics》94:426–436(亮島人)', u: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3951936/' },
  zuozhen: { t: 'Han Cheung(2017-03-26)Taiwan in Time: The former oldest human in Taiwan,《Taipei Times》(左鎮人)', u: 'https://www.taipeitimes.com/News/feat/archives/2017/03/26/2003667486' },
  tsutaya: { t: 'Tsutaya 等(2025)A male Denisovan mandible from Pleistocene Taiwan,《Science》388:176–180(澎湖原人)', u: 'https://doi.org/10.1126/science.ads3888' },
  blust: { t: 'Blust(1999)Subgrouping, circularity and extinction(Zeitoun & Li 編,中央研究院,頁 31–94);同一分法見 Blust(2013)《The Austronesian Languages》修訂版 §2.1.1', u: 'https://openresearch-repository.anu.edu.au/handle/1885/10191' },
  gray: { t: 'Gray、Drummond、Greenhill(2009)Language phylogenies reveal expansion pulses and pauses in Pacific settlement,《Science》323:479–483', u: 'https://doi.org/10.1126/science.1166858' },
  kotu: { t: 'Ko、Tu、Ko(2026)《Journal of Human Genetics》71(2):63–72(回顧論文,2025 年先上線)', u: 'https://doi.org/10.1038/s10038-025-01380-8' },
  chang2015: { t: 'Chang 等(2015)《PNAS》112(44):13537–13542(構樹)', u: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4640734' },
  liu2023: { t: 'Liu、Ko、Stoneking(2023)《PNAS Nexus》2(5):pgad122', u: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10187666/' },
  atayal: { t: '原住民族委員會〈泰雅族〉', u: 'https://www.cip.gov.tw/zh-tw/tribe/grid-list/8C87B4AF56B788EED0636733C6861689/info.html?cumid=8F19BF08AE220D65' },
  paiwan: { t: '原住民族委員會〈排灣族〉', u: 'https://www.cip.gov.tw/zh-tw/tribe/grid-list/67E3CC5AE2F10A8BD0636733C6861689/info.html?cumid=8F19BF08AE220D65' },
  bunun: { t: '原住民族委員會〈布農族〉', u: 'https://www.cip.gov.tw/zh-tw/tribe/grid-list/F39C8394699DD2D6D0636733C6861689/info.html?cumid=8F19BF08AE220D65' },
  puyuma: { t: '原住民族委員會〈卑南族〉', u: 'https://www.cip.gov.tw/zh-tw/tribe/grid-list/913F9B9D35D49AC3D0636733C6861689/info.html?cumid=8F19BF08AE220D65' },
  tsou: { t: '原住民族委員會〈鄒族〉', u: 'https://www.cip.gov.tw/zh-tw/tribe/grid-list/AE6EE12F5F284D59D0636733C6861689/info.html?cumid=8F19BF08AE220D65' },
  yami: { t: '原住民族委員會〈雅美族〉', u: 'https://www.cip.gov.tw/zh-tw/tribe/grid-list/5839F78F6C869EE4D0636733C6861689/info.html?cumid=8F19BF08AE220D65' },
  flood: { t: '伊婉‧貝林(2012)〈洪水‧漂流‧遷徙:原住民口傳文學中的漂流記〉,《原住民族文獻》第 2 期,原住民族委員會', u: 'https://ihc.cip.gov.tw/EJournal/EJournalCat/32' },
  kavalan: { t: 'Uki Bauki(2019-11-15)〈第一個復名的平埔族群:噶瑪蘭族〉,《原視界》,原住民族文化事業基金會', u: 'https://insight.ipcf.org.tw/article/218' },
  siraya: { t: '中央社(2026-07-30)〈政院核定西拉雅為原住民第17族 平埔族首例、8月中起可登記身分〉', u: 'https://www.cna.com.tw/news/aipl/202607300176.aspx' },
  siraya2: { t: '中央社(2026-10-14)〈西拉雅族7月獲政院核定 1336人已完成身分登記〉', u: 'https://cna.com.tw/news/ahel/202610140036.aspx' },
  // 待查證補查(2026-10-31)
  koxinga: { t: '戴寶村〈國姓爺的歷史與傳說〉,吳三連臺灣史料基金會「台灣之窗」(2001-04-30)', u: 'https://www.twcenter.org.tw/thematic_series/history_class/tw_window/e02_20010430' },
  dadu: { t: '宋竹勛〈被遺忘的大肚王國〉,東海大學大肚山地方知識平台', u: 'https://dadu3.thu.edu.tw/history_d.php?i=13' },
  meiji: { t: '教育部《重編國語辭典修訂本》「明治維新」(教育部教育百科)', u: 'https://pedia.cloud.edu.tw/Entry/Detail/?title=%E6%98%8E%E6%B2%BB%E7%B6%AD%E6%96%B0' },
  ndl: { t: '日本國立國會圖書館〈軍人になるには－明治後期－〉(1873 年徵兵令)', u: 'https://www.ndl.go.jp/en/landmarks/column/military' },
  roc1949: { t: '歐素瑛〈臺灣省參議會與中華民國政府遷臺〉,《臺灣學研究》第 13 期,國立中央圖書館臺灣分館(2012)', u: 'https://wwwacc.ntl.edu.tw/public/Attachment/281415584816.pdf' },
  move: { t: '〈中央政府遷臺〉,國家發展委員會檔案管理局 檔案支援教學網', u: 'https://art.archives.gov.tw/tw/art/1484.html' },
  surrender: { t: '〈中國戰區臺灣省受降儀式〉,國家發展委員會檔案管理局', u: 'https://art.archives.gov.tw/tw/art/1788.html' },
};
const src = (...keys) => keys.map((k) => ({ ...S[k], ok: true }));

export const TW_WORLD = Object.freeze([
  {
    id: 'origin', era: 'tw-pre', tab: '祖先從哪裡來', title: '祖先從哪裡來?',
    intro: [
      '很久很久以前,臺灣就有人住了。考古學家在臺東長濱的八仙洞,找到敲打做成的石器,和兩萬多年前生火的火塘,這叫「長濱文化」。',
      '大約六千年前,一群會做陶器的人,從中國東南沿海來到臺灣。他們的陶器上有繩子壓出來的花紋,考古學家叫它「大坌坑文化」。許多學者認為,他們就是原住民族最早的祖先之一。',
      '科學家還在馬祖亮島挖到一具八千多年前的人骨,叫「亮島人」。檢查他從母親那邊傳下來的 DNA(粒線體 DNA),發現和今天的阿美族、泰雅族非常接近,是目前找到最古老的「遠親」。',
      { h: '小心舊說法', p: '以前課本說「左鎮人」有兩、三萬年,後來重新測定只有約三千年;叫做「澎湖原人」的化石,則是另一種古人類「丹尼索瓦人」,不是原住民族的祖先。科學會修正自己,這也是學習的一部分。' },
    ],
    route: [],
    src: src('nmpChangbin', 'nmpBaxian', 'nmpNeo', 'ko2014', 'zuozhen', 'tsutaya'),
  },
  {
    id: 'austronesian', era: 'tw-pre', tab: '南島語族的老家', title: '臺灣是南島語族的老家',
    intro: [
      '南島語族是世界上分布最廣的語言家族之一:西邊到非洲旁的馬達加斯加,東邊到太平洋的復活節島,一共有一千兩百多種語言。',
      '語言學家把這些語言畫成一棵「族譜樹」,發現最上面的 10 根大樹枝裡,有 9 根只長在臺灣,其他一千多種語言全擠在剩下的那 1 根上。就像一個家族最老、最多分支的地方,通常就是老家。所以許多學者認為:臺灣是南島語族的原鄉。',
      { fig: 'austronesian' },
      '大約四千多年前,南島民族的祖先已經從臺灣到了菲律賓,再一站一站划向大海。連一種叫「構樹」的植物都跟著他們旅行:科學家檢查太平洋島上構樹的 DNA,追回來發現源頭在臺灣。',
      { h: '還在討論的問題', p: '當年是很多人一起遷徙,還是少數人把語言帶出去?海外的南島人和臺灣哪一族最親?有些大樹枝該怎麼分,學者也還在討論。科學家還在研究。' },
    ],
    route: [],
    src: src('blust', 'gray', 'kotu', 'chang2015', 'liu2023'),
  },
  {
    id: 'stories', era: 'tw-pre', tab: '各族的起源故事', title: '各族自己說的起源',
    intro: [
      '除了考古和 DNA,每一族都有祖先流傳下來的起源故事。這是各族自己的歷史,和科學說法並列,沒有誰比較高。同一族的不同部落,說法也不一樣。',
      { list: ['泰雅族:祖先從一塊裂開的大石頭裡走出來。', '排灣族:古陶壺是祖先誕生的地方。', '布農族:天上掉下一顆葫蘆,裂開走出一男一女。', '卑南族:有祖先從竹子生出、從石頭生出兩種說法。', '鄒族:大神哈默用楓葉造出了鄒族人。', '達悟族:巨石落到海裡裂開,走出了一位男神。'] },
      '你發現了嗎?很多族都有大洪水的故事:水淹大地時,大家逃到玉山或大霸尖山上避難。',
    ],
    route: [],
    src: src('atayal', 'paiwan', 'bunun', 'puyuma', 'tsou', 'yami', 'flood'),
  },
  {
    id: 'pingpu', era: 'tw-pre', tab: '平埔族群與今天', title: '平埔族群與今天的原住民族',
    intro: [
      '過去被稱為「平埔族」的原住民族群,有西拉雅、凱達格蘭、噶瑪蘭、巴宰等。',
      '政府認定的原住民族原本有 16 族。噶瑪蘭族在 2002 年被政府認定,是第一個復名的平埔族群。2026 年 7 月,西拉雅族被核定為第 17 族,是平埔族群第一個透過新法律取得身分的例子;還有好幾個平埔族群正在申請。',
      '(資料日期:2026 年 10 月)',
    ],
    route: [],
    src: src('tribes', 'kavalan', 'siraya', 'siraya2'),
  },
  {
    id: 'pre', era: 'tw-pre', tab: '1624 年以前', title: '在這之前,已有原住民族世居',
    intro: [
      '臺灣原住民族屬於南島語族,早在外來政權到達之前,就在平原和山區建立部落,各有自己的語言、土地範圍和社會規範。學界有人認為臺灣可能是南島語族最早的故鄉,這點還在討論中。',
      '16 世紀起,福建漁民常到臺灣沿海捕魚,漢人商人也和原住民族交換鹿皮等物產;日本商人則往來於臺灣和呂宋(在今菲律賓)之間。1602 年,明朝將領沈有容曾來臺灣追剿海盜。',
      '1624 年荷蘭人來到大員(今臺南安平)時,附近西拉雅族的新港、蕭壠、麻豆、目加溜灣等大社,是當地主要的力量。',
    ],
    route: [],
    src: src('ith', 'madou', 'tribes'),
  },
  {
    id: 'nl', era: 'tw-hx', title: '荷蘭(1624~1662)',
    who: '來的是荷蘭東印度公司(VOC),1602 年成立的貿易公司。它在亞洲的總部設在巴達維亞(今印尼雅加達),在臺灣以大員為據點,派「長官」治理。',
    world: '那時是大航海時代,歐洲國家爭著到亞洲買賣中國生絲、日本白銀和東南亞香料。葡萄牙已經有澳門,西班牙有馬尼拉,荷蘭也需要一個靠近中國的港口;荷蘭當時正和西班牙交戰,於是轉向日本取得白銀。',
    why: '荷蘭先在 1622 年佔領澎湖,1624 年明朝派兵進攻,雙方約定荷蘭退到臺灣,明朝讓商人到臺灣和荷蘭人交易。大員位在中國、日本和東南亞之間,荷蘭在這裡轉運中國和日本的貨物,臺灣本地則大量出口鹿皮。',
    end: '1661 年 4 月,鄭成功的軍隊從鹿耳門登陸,先取普羅民遮城(今赤崁樓的前身),再包圍熱蘭遮城。九個月後,荷蘭在 1662 年 2 月投降離開,統治臺灣約 38 年。',
    people: '原住民族各社有自己的打算:1629 年麻豆社伏擊荷蘭士兵,1635 年荷蘭出兵後雙方簽約,麻豆社歸順。1652 年,漢人郭懷一因為人頭稅加重、收成不好又遭稅吏勒索而起事,失敗後荷蘭人和漢人更加互不信任。',
    route: [['阿姆斯特丹', 4.90, 52.37], ['巴達維亞(今雅加達)', 106.81, -6.13], ['大員', 120.16, 23.00]],
    src: src('ith', 'madou', 'kang', 'guo', 'zeelandia', 'voc'),
  },
  {
    id: 'es', era: 'tw-hx', title: '西班牙(1626~1642,臺灣北部)',
    who: '西班牙從 1571 年起統治菲律賓的呂宋,以馬尼拉為據點。1626 年,西班牙遠征隊從呂宋北上,在雞籠的社寮島(今基隆和平島)登陸,建了聖薩爾瓦多城。',
    world: '西班牙是當時的海上強國,中國和日本的商人都到馬尼拉做生意。西班牙和荷蘭是敵對的歐洲國家;西班牙傳教士也想以臺灣為跳板,到日本傳教。',
    why: '荷蘭佔了大員以後,威脅到中國和馬尼拉之間的貿易航線,西班牙便佔領臺灣北部,保護航線、牽制荷蘭。1628~1629 年,西班牙又到淡水建了聖多明哥城。',
    end: '臺灣北部的貿易一直虧損,要靠馬尼拉補貼;1630 年代日本禁止外國人來往,傳教計畫也落空。1642 年荷蘭北上攻下雞籠,西班牙撤離臺灣,前後 16 年。',
    people: '1636 年,原住民族攻擊淡水的聖多明哥城;1638 年西班牙撤出淡水,只留少數兵力守雞籠。',
    route: [['馬尼拉', 120.98, 14.59], ['雞籠', 121.77, 25.16], ['淡水', 121.43, 25.18]],
    src: src('ith', 'salvador', 'tamsui', 'keelung'),
  },
  {
    id: 'mz', era: 'tw-mz', title: '明鄭(1662~1683)',
    who: '鄭成功是福建沿海海上勢力的領袖,以金門、廈門為據點,奉明朝為正統、對抗清朝。1661 年,他率領約 2 萬 5 千人從金門出發,經過澎湖來到臺灣。',
    world: '清朝取代明朝以後,逐步控制中國各地,仍有支持明朝的勢力在沿海抵抗。1659 年鄭成功北攻南京失敗,需要新的根據地。',
    why: '臺灣有許多還沒開墾的土地,可以耕種、養活軍隊。曾替荷蘭人當通譯的何斌,獻上了鹿耳門水道的地圖。',
    end: '鄭成功在 1662 年去世,由兒子鄭經、孫子鄭克塽接續。1683 年清朝將領施琅攻下澎湖,鄭克塽投降,鄭氏統治臺灣約 22 年結束。',
    people: '明鄭在臺灣屯田開墾;因為大量開墾土地,和中部的大肚王國不斷發生衝突。1668 年,鄭經派兵趕走仍留在雞籠的荷蘭人。',
    route: [['廈門', 118.09, 24.48], ['澎湖', 119.58, 23.57], ['大員', 120.16, 23.00]],
    src: src('ith', 'yifu', 'keelung', 'koxinga', 'dadu'),
  },
  {
    id: 'ql', era: 'tw-ql', title: '清領(1683~1895)',
    who: '清朝打敗明鄭以後,把臺灣納入版圖,1684 年設臺灣府,隸屬福建省,府城在今臺南,下轄臺灣、鳳山、諸羅三縣。',
    world: '19 世紀後期,日本和歐美國家在東亞擴張勢力;1874 年日本出兵臺灣以後,清朝改為積極治理臺灣,1885 年臺灣建省,劉銘傳任首任巡撫。',
    why: '清朝出兵攻下澎湖,結束了明鄭政權,臺灣隨之納入清朝。之後福建、廣東的移民大量渡海來臺開墾,漢人人口從約 10 萬增加到約 250 萬。',
    end: '1894 年清朝在甲午戰爭中戰敗,1895 年 4 月 17 日簽訂《馬關條約》,把臺灣、澎湖割讓給日本。',
    people: '1732 年,中部的大甲西社等因為被官府大量徵調勞役而起事,後來被清軍平定,協助清軍的岸裡社成為中部最大的勢力。1871 年琉球船難者在恆春半島和排灣族發生衝突,日本以此為理由,在 1874 年出兵攻打牡丹社、高士佛社(牡丹社事件)。',
    route: [['北京', 116.40, 39.90], ['福州', 119.30, 26.07], ['臺灣府', 120.20, 23.00]],
    src: src('ith', 'yifu', 'handover', 'dajia', 'mudan'),
  },
  {
    id: 'rz', era: 'tw-rz', title: '日本(1895~1945)',
    who: '日本依《馬關條約》取得臺灣,設臺灣總督府統治,首任總督是樺山資紀。1895 年 6 月,清朝代表和樺山資紀在基隆外海的船上辦理交接。',
    world: '日本從明治維新以後學習西方、建立現代軍隊,開始向外擴張:1874 年出兵臺灣,1895 年在甲午戰爭打敗清朝。後來日本在 1931 年佔領中國東北,1937 年與中國全面開戰,1941 年太平洋戰爭爆發,臺灣成為日本向南擴張的基地。',
    why: '甲午戰爭清朝戰敗,依《馬關條約》割讓臺灣、澎湖給日本。臺灣民主國和各地義勇抵抗約 5 個月後,日本才控制全島。',
    end: '1945 年 8 月 15 日日本宣布投降,10 月 25 日在臺北公會堂(今中山堂)舉行受降典禮,日本統治臺灣約 50 年結束。',
    people: '1930 年,賽德克族在莫那．魯道領導下起事,反抗強制勞役、低工資和文化壓抑,日本出動軍警與飛機鎮壓,倖存的族人被遷到川中島(霧社事件)。',
    route: [['東京', 139.75, 35.68], ['基隆', 121.74, 25.13]],
    src: src('ith', 'handover', 'mudan', 'wushe', 'surrender', 'meiji', 'ndl'),
  },
  {
    id: 'zh', era: 'tw-zh', title: '中華民國(1945~)',
    who: '1945 年日本投降以後,中華民國政府接收臺灣,設立臺灣省行政長官公署,由陳儀擔任行政長官。',
    world: '第二次世界大戰剛結束,中國國內的局勢很快又陷入戰爭。1949 年中華人民共和國成立,中華民國政府遷到臺灣。',
    why: '臺灣原本由日本統治,日本戰敗以後,由中華民國政府接收。',
    endLabel: '後來', end: '中華民國政府從此以臺灣為中心持續治理到今天。朝代線上的「中華人民共和國」和「中華民國(臺灣)」兩個年代,就是這之後的情況。',
    route: [['南京', 118.80, 32.06], ['臺北', 121.51, 25.04]],
    src: src('ith', 'surrender', 'roc1949', 'move'),
  },
]);

export const twCards = (era) => TW_WORLD.filter((c) => c.era === era);
export const checkOf = (c) => (c.todo?.length ? '待查證' : '已查證');
