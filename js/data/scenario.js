/**
 * scenario.js — 完整 8 節點測試劇本
 * 流程：酒館接任務 -> 森林迷霧 -> 森林遭遇伏擊（劣勢/先手兩分支）-> 溪畔休整與開門 -> 遺跡星紋解謎 -> 星蝕密室決戰 -> 五重結局（含血量歸零隕落）
 */

export const SCENARIO_NODES = {
  /* ==================== 節點 1：酒館接任務 ==================== */
  tavern_intro: {
    id: "tavern_intro",
    chapter: "第一章 · 鏽錨酒館",
    location: "灰燼鎮 · 鏽錨酒館",
    title: "雨夜中的黑蠟懸賞",
    paragraphs: [
      "鉛灰色的暴雨拍打著「鏽錨酒館」的彩繪窗欞，爐火在潮濕的空氣裡發出噼啪輕響，烤麥酒與松木煙草的氣味瀰漫整個大廳。",
      "角落陰影處，一名披著深褐兜帽的學者「艾德溫」朝你招手。他在油漬斑駁的橡木桌上攤開一卷火漆羊皮紙，低聲說道：「幽影林地深處的『斷星遺跡』因昨夜雷暴重新顯露入口。我需要一位可靠之人，替我取回失落其中的古代聖物——『星蝕羅盤』。」",
      "羊皮紙邊角殘留著微弱的銀色星紋與幾滴乾涸的暗紅血跡，顯然你並非第一個接下這份委託的人。壁爐火光映在你的臉龐上，該如何回應這位神祕的雇主？",
    ],
    quote: "「事成之後，兩百枚王國金幣歸你所有。但請記住——別讓森林裡的綠皮畜生搶先一步。」",
    choices: [
      {
        id: "tavern_cha",
        label: "以老練口才試探雇主，並索討預支物資與情報",
        sub: "展現談判手腕，爭取藥水補給與遺跡線索",
        check: { stat: "cha", dc: 45 },
        outcomes: {
          critSuccess: {
            text: "你的言辭既銳利又從容，徹底折服了艾德溫。他低聲讚嘆你絕非等閒之輩，立刻從斗篷暗袋中取出珍稀的「月光甘露」與「沉甸銀幣袋」作為定金，還壓低嗓音透露了遺跡祭壇的星象順序密語！",
            addItems: [
              { id: "wax_contract", qty: 1 },
              { id: "moonlight_elixir", qty: 1 },
              { id: "silver_pouch", qty: 1 },
            ],
            setFlags: { knowsRuneHint: true },
            nextNode: "forest_path",
          },
          success: {
            text: "你點出羊皮紙上的血跡並提出合理條件。艾德溫猶豫片刻後點頭妥協，預先遞給你一瓶「初級治療藥水」與半張遺跡草圖，提醒你祭壇遵循『日、月、星』的輪轉順序。",
            addItems: [
              { id: "wax_contract", qty: 1 },
              { id: "minor_potion", qty: 1 },
            ],
            setFlags: { knowsRuneHint: true },
            nextNode: "forest_path",
          },
          failure: {
            text: "艾德溫冷冷收緊兜帽，拒絕任何預支：「賞金只留給活著帶回羅盤的人。」你只能拿著委託書，在雨聲中獨自啟程。",
            addItems: [{ id: "wax_contract", qty: 1 }],
            nextNode: "forest_path",
          },
          critFailure: {
            text: "你過於咄咄逼人的語氣惹惱了雇主與鄰桌的醉漢傭兵！混亂推搡間你的手肘重重撞上橡木酒桶（失去 2 HP），在眾人嘲笑聲中抓起委託書匆匆離開酒館。",
            damage: 2,
            addItems: [{ id: "wax_contract", qty: 1 }],
            nextNode: "forest_path",
          },
        },
      },
      {
        id: "tavern_int",
        label: "不動聲色地端詳羊皮紙上的古符文與殘留血跡",
        sub: "嘗試以學識提前破譯遺跡機關的秘密",
        check: { stat: "int", dc: 48 },
        outcomes: {
          critSuccess: {
            text: "你的雙眼瞬間捕捉到羊皮紙夾層的暗紋！你不僅完整破譯了斷星祭壇的『熾日 → 寒月 → 碎星』密語，更從信封褶皺中摸出一枚雇主自己都未察覺的「古代星辰護符」！",
            addItems: [
              { id: "wax_contract", qty: 1 },
              { id: "ancient_charm", qty: 1 },
            ],
            setFlags: { knowsRuneHint: true },
            nextNode: "forest_path",
          },
          success: {
            text: "你從捲邊的精靈古字中辨認出關鍵提示——遺跡核心機關與天象交替『日、月、星』息息相關。收好契約後，你胸有成竹地踏入雨幕。",
            addItems: [{ id: "wax_contract", qty: 1 }],
            setFlags: { knowsRuneHint: true },
            nextNode: "forest_path",
          },
          failure: {
            text: "燭火搖曳，那些古老符文早已被雨水暈開，你未能解讀出有效資訊，只得先簽下契約出發。",
            addItems: [{ id: "wax_contract", qty: 1 }],
            nextNode: "forest_path",
          },
          critFailure: {
            text: "你俯身細看時，羊皮紙殘留的一絲殘缺防護咒驟然反噬！刺目銀光灼痛雙眼與太陽穴（失去 2 HP），令你狼狽後退一步。",
            damage: 2,
            addItems: [{ id: "wax_contract", qty: 1 }],
            nextNode: "forest_path",
          },
        },
      },
      {
        id: "tavern_direct",
        label: "乾脆俐落地簽下火漆契約，立刻動身前往幽影林地",
        sub: "不浪費時間，直接展開行動（無需檢定）",
        directOutcome: {
          text: "你以沾滿黑墨的鵝毛筆簽下大名。艾德溫將封蠟契約交到你手中，目送你推開酒館厚重的木門，步入漸歇的夜雨與林地迷霧。",
          addItems: [{ id: "wax_contract", qty: 1 }],
          nextNode: "forest_path",
        },
      },
    ],
  },

  /* ==================== 節點 2：森林前奏 ==================== */
  forest_path: {
    id: "forest_path",
    chapter: "第二章 · 幽影林地",
    location: "幽影林地 · 迷霧古道",
    title: "林間低語與隱藏的殺機",
    paragraphs: [
      "離開灰燼鎮兩小時後，高聳扭曲的古柏遮蔽了蒼白月光。腳下濕滑的苔蘚散發著腐葉氣息，濃霧在樹幹間緩緩流動。",
      "忽然，前方十步處一根被利刃削斷的樹枝引起了你的警覺——灌木叢後傳來壓抑的尖細竊笑與弓弦拉緊的輕微吱呀聲。顯然，一群哥布林掠奪者早已在這條必經小徑設下埋伏！",
      "在箭矢尚未破空之前，你必須立刻做出判斷。",
    ],
    choices: [
      {
        id: "forest_dex",
        label: "放輕腳步隱入霧靄，反過來潛行摸清伏兵位置",
        sub: "若成功將奪得戰鬥先手，失敗則可能直接遭到箭雨偷襲",
        check: { stat: "dex", dc: 48 },
        outcomes: {
          critSuccess: {
            text: "你的腳步宛如幽靈無聲！你悄然繞到一名落單哥布林斥候背後將其制伏，不僅徹底避開絆索陷阱，還順手繳獲了「黑鐵斥候匕首」與一瓶「初級治療藥水」，牢牢掌控戰局高地！",
            addItems: [
              { id: "iron_dagger", qty: 1 },
              { id: "minor_potion", qty: 1 },
            ],
            nextNode: "forest_ambush_advantage",
          },
          success: {
            text: "你借著古樹陰影靈巧側移，精準辨識出樹冠上的弓手與草叢中的絆索，成功佔據居高臨下的突襲位置！",
            nextNode: "forest_ambush_advantage",
          },
          failure: {
            text: "腳下一截腐朽枯枝發出清脆的喀嚓聲！剎那間，數支粗製羽箭撕裂濃霧朝你襲來，肩膀一陣劇痛（承受伏擊傷害），哥布林們嚎叫著蜂擁而出！",
            damage: 5,
            nextNode: "forest_ambush",
          },
          critFailure: {
            text: "你在濃霧中一腳踩中生鏽捕獸夾，劇痛令你重心失衡，緊接著兩支冷箭劃破斗篷（承受重創）！鮮血滴落苔蘚，哥布林伏兵已將你團團包圍！",
            damage: 8,
            nextNode: "forest_ambush",
          },
        },
      },
      {
        id: "forest_luk",
        label: "憑藉冒險者的第六感，改走左側隱蔽的舊獵人捷徑",
        sub: "賭一把命運——也許能繞過伏擊甚至有所奇遇",
        check: { stat: "luk", dc: 50 },
        outcomes: {
          critSuccess: {
            text: "命運女神對你露出了微笑！這條野鹿踏出的小徑不僅完美避開整座哥布林伏擊圈，你還在枯朽樹洞裡發現前任冒險者遺留的「月光甘露」與一把閃耀銀光的「星銀鑰匙」，直抵遺跡外圍！",
            addItems: [
              { id: "moonlight_elixir", qty: 1 },
              { id: "star_silver_key", qty: 1 },
            ],
            nextNode: "forest_aftermath",
          },
          success: {
            text: "捷徑讓你巧妙避開了正面箭雨與陷阱，雖然仍撞見了巡邏中的哥布林隊長小隊，但對方毫無防備，主動權在你手上！",
            nextNode: "forest_ambush_advantage",
          },
          failure: {
            text: "這條所謂的捷徑竟直通哥布林營地外緣！一支放哨冷箭迎面飛來劃傷你的手臂，尖銳的號角聲瞬間響徹樹林！",
            damage: 6,
            nextNode: "forest_ambush",
          },
          critFailure: {
            text: "腳下泥坡驟然崩塌，你滾落滿布毒棘的溝壑，全身刮傷之際恰好摔進哥布林伏兵的包圍圈正中央！",
            damage: 9,
            nextNode: "forest_ambush",
          },
        },
      },
    ],
  },

  /* ==================== 節點 3A：森林遭遇伏擊（正面陷入包圍） ==================== */
  forest_ambush: {
    id: "forest_ambush",
    chapter: "第三章 · 血刃伏擊",
    location: "幽影林地 · 枯骨林間空地",
    title: "綠皮掠奪者的圍殺",
    paragraphs: [
      "三名眼冒兇光的哥布林掠奪者與一名披著殘破鎖子甲的獨眼哥布林隊長從蕨叢躍出！生鏽的彎刀與骨矛在月光下泛著森冷寒芒。",
      "你注意到哥布林隊長的腰間懸掛著一把散發微弱青藍星光的青銅古鑰——那極可能是開啟斷星遺跡的重要鑰匙。",
      "（提示：若生命值偏低，隨時可點擊右側「背包物品欄」中的藥水回復 HP 再作決斷！）",
    ],
    choices: [
      {
        id: "ambush_str",
        label: "怒喝迎戰，以壓倒性的正面攻勢擊潰哥布林隊長",
        sub: "硬碰硬的近身死鬥，奪取隊長腰間的符文鑰匙",
        check: { stat: "str", dc: 52 },
        outcomes: {
          critSuccess: {
            text: "你爆發出雷霆般的氣勢，一擊震飛哥布林隊長的戰斧並將牠擊倒在地！其餘哥布林嚇得尖叫四散。你毫髮無傷，從容拾起「染血的符文鑰匙」與一瓶「初級治療藥水」！",
            addItems: [
              { id: "runic_key", qty: 1 },
              { id: "minor_potion", qty: 1 },
            ],
            nextNode: "forest_aftermath",
          },
          success: {
            text: "刀光交錯間，你雖被側翼冷刃劃破衣袖受了點輕傷，仍一舉擊潰隊長並迫使伏兵潰逃，成功奪下「染血的符文鑰匙」！",
            damage: 3,
            addItems: [{ id: "runic_key", qty: 1 }],
            nextNode: "forest_aftermath",
          },
          failure: {
            text: "敵眾我寡，哥布林長矛趁隙刺中你的側腹！你咬緊牙關揮開包圍網，浴血殺出一條生路衝向林地深處。",
            damage: 6,
            nextNode: "forest_aftermath",
          },
          critFailure: {
            text: "腳下泥濘令你攻勢落空，慘遭三名哥布林合力圍砍重創！千鈞一髮之際你滾落斜坡才甩開追兵，氣喘吁吁地逃往溪畔。",
            damage: 10,
            nextNode: "forest_aftermath",
          },
        },
      },
      {
        id: "ambush_dex",
        label: "翻滾閃避亂刃，借古樹掩護逐一反制伏兵",
        sub: "以靈動身法化解圍攻並設法順手奪鑰",
        check: { stat: "dex", dc: 50 },
        outcomes: {
          critSuccess: {
            text: "你如林間獵豹般蹬樹騰躍，接連放倒兩名弓手，更在擦身瞬間精準扯斷哥布林隊長腰繩，無傷奪走「染血的符文鑰匙」與「沉甸銀幣袋」！",
            addItems: [
              { id: "runic_key", qty: 1 },
              { id: "silver_pouch", qty: 1 },
            ],
            nextNode: "forest_aftermath",
          },
          success: {
            text: "你靈巧避開致命一擊，僅受輕微擦傷便反制了兩名斥候，趁亂奪得「染血的符文鑰匙」並脫離戰圈。",
            damage: 2,
            addItems: [{ id: "runic_key", qty: 1 }],
            nextNode: "forest_aftermath",
          },
          failure: {
            text: "你在翻滾時被裸露樹根絆了一下，背部結結實實捱了一記鈍擊！你強忍劇痛拉開距離，匆忙撤出林間空地。",
            damage: 6,
            nextNode: "forest_aftermath",
          },
          critFailure: {
            text: "躲閃路線正好撞上埋伏在側翼的骨矛陣，渾身多處掛彩！你只能拚盡全力衝破濃霧逃出生天。",
            damage: 9,
            nextNode: "forest_aftermath",
          },
        },
      },
      {
        id: "ambush_cha",
        label: "釋放森然氣場高聲喝斥，震懾膽怯的哥布林族群",
        sub: "不戰而屈人之兵，賭牠們會懼怕強者威壓",
        check: { stat: "cha", dc: 54 },
        outcomes: {
          critSuccess: {
            text: "你的嗓音在迷霧中如古龍低吟般迴盪！迷信的哥布林誤以為冒犯了林地大領主，當場嚇得伏地求饒，獻上「染血的符文鑰匙」與「月光甘露」後屁滾尿流地逃進黑夜！",
            addItems: [
              { id: "runic_key", qty: 1 },
              { id: "moonlight_elixir", qty: 1 },
            ],
            nextNode: "forest_aftermath",
          },
          success: {
            text: "獨眼隊長忌憚你鎮定自若的神情，低吼一聲示意撤退。牠們倉皇退入霧中，遺落了腰間的「染血的符文鑰匙」。",
            addItems: [{ id: "runic_key", qty: 1 }],
            nextNode: "forest_aftermath",
          },
          failure: {
            text: "哥布林隊長看穿了你的虛張聲勢，獰笑著率眾撲上！你挨了一記冷刃後奮力突圍脫身。",
            damage: 5,
            nextNode: "forest_aftermath",
          },
          critFailure: {
            text: "你的挑釁徹底激怒了嗜血的綠皮群！牠們紅著眼發起瘋狂圍毆，你身受重傷才勉強殺出重圍。",
            damage: 9,
            nextNode: "forest_aftermath",
          },
        },
      },
    ],
  },

  /* ==================== 節點 3B：森林先手突襲（優勢分支） ==================== */
  forest_ambush_advantage: {
    id: "forest_ambush_advantage",
    chapter: "第三章 · 林間突襲",
    location: "幽影林地 · 岩坡高地",
    title: "居高臨下的反制良機",
    paragraphs: [
      "你伏在長滿青苔的巨岩後方，下方十步正是毫無察覺的哥布林伏兵營地。獨眼隊長正得意地把玩一把閃爍星紋微光的「染血的符文鑰匙」，身旁篝火邊堆著幾只裝滿劣質火油的陶罐。",
      "主動權牢牢掌握在你手中，該如何一舉瓦解這群伏兵？",
    ],
    choices: [
      {
        id: "adv_str",
        label: "自高地雷霆躍下，直取哥布林隊長首級",
        sub: "趁敵人不備發動先手強攻（難度較低）",
        check: { stat: "str", dc: 42 },
        outcomes: {
          critSuccess: {
            text: "如同蒼鷹撲兔！你一擊便將獨眼隊長震暈在地，其餘斥候作鳥獸散。你無傷奪得「染血的符文鑰匙」與一瓶珍貴的「月光甘露」！",
            addItems: [
              { id: "runic_key", qty: 1 },
              { id: "moonlight_elixir", qty: 1 },
            ],
            nextNode: "forest_aftermath",
          },
          success: {
            text: "突然襲擊打得哥布林措手不及！雖然混戰中被流刃劃傷了手背，你仍俐落奪下「染血的符文鑰匙」並迫退敵軍。",
            damage: 2,
            addItems: [{ id: "runic_key", qty: 1 }],
            nextNode: "forest_aftermath",
          },
          failure: {
            text: "獨眼隊長反應比預期更快，倉促舉盾擋下你的突襲並反手斬中你的左肩！短兵相接後你趁霧抽身前往遺跡。",
            damage: 5,
            nextNode: "forest_aftermath",
          },
          critFailure: {
            text: "躍下岩坡時踩滑濕苔扭傷腳踝，竟一頭栽進哥布林矛陣遭敵人反撲重創！你拚死突圍才得以撤離。",
            damage: 8,
            nextNode: "forest_aftermath",
          },
        },
      },
      {
        id: "adv_int",
        label: "精準擊碎營火旁的火油罐，以烈焰與濃煙製造大混亂",
        sub: "運用環境戰術智取敵營，避免硬戰",
        check: { stat: "int", dc: 44 },
        outcomes: {
          critSuccess: {
            text: "陶罐應聲碎裂，火龍騰空而起！哥布林們尖叫奔逃，你趁煙塵掩護從容撿走「染血的符文鑰匙」與一塊刻有祭壇密語的「古代石板碎片」，毫髮無傷！",
            addItems: [
              { id: "runic_key", qty: 1 },
              { id: "tablet_fragment", qty: 1 },
            ],
            setFlags: { knowsRuneHint: true },
            nextNode: "forest_aftermath",
          },
          success: {
            text: "烈焰與黑煙瞬間吞噬營地！你在哥布林驚慌失措之際俐落搶走「染血的符文鑰匙」，安全踏上通往遺跡的石階。",
            addItems: [{ id: "runic_key", qty: 1 }],
            nextNode: "forest_aftermath",
          },
          failure: {
            text: "火油潑灑方向偏了半尺，炸飛的滾燙餘燼與流矢擦傷了你的手臂，你只得趁亂匆匆撤離林地。",
            damage: 4,
            nextNode: "forest_aftermath",
          },
          critFailure: {
            text: "火油罐在過近的距離轟然引爆！熾熱氣浪將你震飛撞上樹幹，你忍痛爬起身踉蹌逃往遺跡方向。",
            damage: 8,
            nextNode: "forest_aftermath",
          },
        },
      },
    ],
  },

  /* ==================== 節點 4：斷星溪畔與遺跡大門 ==================== */
  forest_aftermath: {
    id: "forest_aftermath",
    chapter: "第四章 · 斷星門扉",
    location: "斷星溪畔 · 遺跡前哨",
    title: "被藤蔓封鎖的精靈石門",
    paragraphs: [
      "穿出陰鬱林線後，一道清冽的銀色溪流橫亙眼前。跨過殘破石橋，半沉於山壁中的「斷星遺跡」終於露出巍峨輪廓——兩尊無頭精靈石像守望著刻滿星軌的青銅巨門。",
      "此刻四周萬籟俱寂，正是整理傷口、飲用藥水回復體力的絕佳片刻。門扉中央有一個隱晦的星形鎖孔，而石門上方與岩壁裂隙則看似也能強行闖入。",
    ],
    choices: [
      {
        id: "gate_use_key",
        label: "【道具觸發】插入符文鑰匙，無聲開啟古代精靈暗門",
        sub: "持有『染血的符文鑰匙』或『星銀鑰匙』時可安全解鎖並窺見壁畫線索",
        requiresAnyItem: ["runic_key", "star_silver_key"],
        special: true,
        directOutcome: {
          text: "鑰匙與星形鎖孔嚴絲合縫！清越的共鳴聲在石壁間迴盪，沉重青銅門無聲滑開。門內壁畫清晰繪著『白晝化為銀月，銀月喚醒繁星』的古老序列——你牢牢記下了這道解謎線索！",
          setFlags: { knowsRuneHint: true },
          nextNode: "ruins_entrance",
        },
      },
      {
        id: "gate_con",
        label: "運起全身氣力與耐力，硬生生推開鏽蝕的藤蔓石門",
        sub: "考驗體魄極限，但可能觸動門上的老舊機關",
        check: { stat: "con", dc: 48 },
        outcomes: {
          critSuccess: {
            text: "你如巨熊般抵住門扉，竟以驚人耐力頂開千斤石門！震動間門楣暗格掉落一瓶保存完好的「初級治療藥水」，正好補充足夠戰力！",
            addItems: [{ id: "minor_potion", qty: 1 }],
            nextNode: "ruins_entrance",
          },
          success: {
            text: "青筋暴起、汗水浸透衣領，你終於在石門間擠出一道可供通行的縫隙，順利步入幽暗外廳。",
            nextNode: "ruins_entrance",
          },
          failure: {
            text: "石門紋絲不動之際，門縫驟然彈出數根生鏽毒針劃傷你的掌心！你咬牙再次發力，終於負傷擠入門內。",
            damage: 4,
            nextNode: "ruins_entrance",
          },
          critFailure: {
            text: "猛烈推擠引發門楣風化石塊崩落，沉重碎石重重砸中你的肩膀！你強忍劇痛爬過瓦礫進入遺跡。",
            damage: 7,
            nextNode: "ruins_entrance",
          },
        },
      },
      {
        id: "gate_dex",
        label: "沿著濕滑岩壁攀爬，從上層通風裂隙潛入遺跡",
        sub: "避開正面大門，從高處偵察遺跡內部",
        check: { stat: "dex", dc: 46 },
        outcomes: {
          critSuccess: {
            text: "你如夜貓般輕盈翻入上層迴廊！居高臨下間，整個解謎大廳的地面星軌與『日 → 月 → 星』能量流向一覽無遺！",
            setFlags: { knowsRuneHint: true },
            nextNode: "ruins_entrance",
          },
          success: {
            text: "你穩健抓緊岩縫藤蔓，俐落滑落至遺跡外廳地板，未發出半點聲響。",
            nextNode: "ruins_entrance",
          },
          failure: {
            text: "青苔比想像中濕滑，你在裂隙邊緣腳下一空，重重摔落在冰冷石階上！",
            damage: 4,
            nextNode: "ruins_entrance",
          },
          critFailure: {
            text: "借力的岩塊突然崩斷，你從數公尺高處失足墜落撞上石柱，悶哼一聲幾乎岔氣！",
            damage: 7,
            nextNode: "ruins_entrance",
          },
        },
      },
    ],
  },

  /* ==================== 節點 5：遺跡星紋解謎 ==================== */
  ruins_entrance: {
    id: "ruins_entrance",
    chapter: "第五章 · 星紋迴廊",
    location: "斷星遺跡 · 星象解謎祭壇",
    title: "三環星象儀的古老試煉",
    paragraphs: [
      "遺跡內部瀰漫著幽藍色的螢光苔蘚與微弱的臭氧氣息。大廳中央矗立著一座同心圓石製祭壇，三道可旋轉的秘銀星環分別鐫刻著『熾日』、『寒月』與『碎星』浮雕。",
      "祭壇底座的精靈銘文閃爍著淡金光輝，唯有解開這道星象鎖，通往深處「星蝕密室」的奧術結界才會退散；一旦出錯，周圍石柱上蓄勢待發的雷光符文必將降下懲戒。",
    ],
    quote: "「白晝隕落，銀輝繼承，群星於永夜中甦醒。」",
    clueFlag: "knowsRuneHint",
    clueText: "📜 線索回響：你已掌握『日 → 月 → 星』的古代秘語！本次進行【智力】解謎檢定額外獲得 +10 加值！",
    choices: [
      {
        id: "puzzle_int",
        label: "依碑文與星軌邏輯推演，依序轉動『熾日 → 寒月 → 碎星』星環",
        sub: "正統解謎之道（若擁有線索將大幅提升成功率）",
        check: { stat: "int", dc: 52, flagBonus: { flag: "knowsRuneHint", amount: 10, label: "遺跡線索" } },
        outcomes: {
          critSuccess: {
            text: "三道星環完美咬合，穹頂灑下宛如晨曦般的星辰祝福之光！你的傷口在暖流中奇蹟癒合（回復 5 HP），暗格更彈出一枚「星辰護佑聖印」，密室巨門隨之敞開！",
            heal: 5,
            addItems: [{ id: "star_seal", qty: 1 }],
            nextNode: "ruins_sanctum",
          },
          success: {
            text: "伴隨沉穩的機括咬合聲，三枚符文依次亮起柔和金芒。奧術結界化作光塵消散，通往核心密室的大門緩緩開啟。",
            nextNode: "ruins_sanctum",
          },
          failure: {
            text: "最後一道星環偏差了半寸！石柱瞬間迸發刺目奧術電弧劈中你的雙手，所幸能量衝擊也讓大門鎖芯卡死彈開。",
            damage: 5,
            nextNode: "ruins_sanctum",
          },
          critFailure: {
            text: "星環逆轉觸發了最高級別的防禦脈衝！紫黑雷光正面貫穿胸口令你單膝跪地，直至祭壇魔力耗盡，結界才轟然瓦解。",
            damage: 9,
            nextNode: "ruins_sanctum",
          },
        },
      },
      {
        id: "puzzle_luk",
        label: "閉上雙眼傾聽魔力流動，憑藉直覺盲轉古老星環",
        sub: "將一切交託給命運與直覺",
        check: { stat: "luk", dc: 54 },
        outcomes: {
          critSuccess: {
            text: "不可思議的奇蹟！你隨手一轉竟精準對齊隱藏的秘寶刻度——結界無聲消散的同時，祭壇旁竟升起一只古銅匣，裡面靜靜躺著「月光甘露」！",
            addItems: [{ id: "moonlight_elixir", qty: 1 }],
            nextNode: "ruins_sanctum",
          },
          success: {
            text: "咔噠一聲清響，三道星環誤打誤撞歸位！結界微光熄滅，前方的深邃密室向你敞開。",
            nextNode: "ruins_sanctum",
          },
          failure: {
            text: "一道尖銳的奧術警鳴響起，寒冰射線擦過你的臂膀留下霜灼傷痕，片刻後老化的結界才自行崩散。",
            damage: 5,
            nextNode: "ruins_sanctum",
          },
          critFailure: {
            text: "你恰好轉中了雙重懲戒符文！冰霜與雷鳴同時在祭壇爆發，你浴血硬撐才踏進崩解後的密室大門。",
            damage: 9,
            nextNode: "ruins_sanctum",
          },
        },
      },
      {
        id: "puzzle_con",
        label: "無視繁瑣謎題，硬扛結界反噬直接擊碎祭壇鎖芯",
        sub: "以強橫體魄蠻力破局，風險高但乾脆直接",
        check: { stat: "con", dc: 55 },
        outcomes: {
          critSuccess: {
            text: "奧術結界竟在你磅礴氣血的衝擊下寸寸碎裂！反彈的餘波未能傷你分毫，碎裂能量反而凝華成一顆價值連城的「凝結魔力晶石」落入你手！",
            addItems: [{ id: "mana_crystal", qty: 1 }],
            nextNode: "ruins_sanctum",
          },
          success: {
            text: "你雙臂護頭硬生生扛住一陣魔力震盪（僅受微傷），成功撞碎鎖芯、強行撕開通往密室的缺口！",
            damage: 2,
            nextNode: "ruins_sanctum",
          },
          failure: {
            text: "結界爆裂的氣浪將你掀飛數步重摔在地，所幸封印核心也隨之碎裂，道路已開。",
            damage: 6,
            nextNode: "ruins_sanctum",
          },
          critFailure: {
            text: "狂暴的奧術反衝狠狠重創內腑，你嘴角溢血、踉蹌穿過煙霧瀰漫的破碎門扉。",
            damage: 10,
            nextNode: "ruins_sanctum",
          },
        },
      },
    ],
  },

  /* ==================== 節點 6：星蝕密室最終對決 ==================== */
  ruins_sanctum: {
    id: "ruins_sanctum",
    chapter: "第六章 · 星蝕密室",
    location: "斷星遺跡 · 核心聖壇",
    title: "甦醒的黑曜石像鬼守衛",
    paragraphs: [
      "踏入圓頂密室的瞬間，漫天人造星圖在穹頂緩緩旋轉。中央白玉石柱之上，目標聖物「星蝕羅盤」正懸浮在淡金星火中輕輕轉動。",
      "然而你剛邁出一步，石柱後方那尊高達三公尺的黑曜石像鬼驟然張開雙翼！熔金色的雙瞳在黑暗中點燃，沉重石爪刮過地面迸出刺眼火花——這座遺跡的最後守衛已然甦醒！",
      "這將是決定命運的最終一戰。（若你還留有藥水，現在就是最後的補給時機！）",
    ],
    choices: [
      {
        id: "boss_str",
        label: "正面迎擊黑曜石像鬼，以絕對武力粉碎守衛並奪取羅盤",
        sub: "硬核決戰——擊碎守衛核心或血戰突圍",
        check: { stat: "str", dc: 58 },
        outcomes: {
          critSuccess: {
            text: "驚天動地的一擊！你精準貫穿黑曜石像鬼胸口的熔金核心，龐然巨獸化作漫天璀璨星塵崩解！你毫髮無傷地摘下「星蝕羅盤」，並拾起閃耀神光的「守衛者的星核」！",
            addItems: [
              { id: "astral_compass", qty: 1 },
              { id: "guardian_core", qty: 1 },
            ],
            nextNode: "ending_legend",
          },
          success: {
            text: "歷經一番驚心動魄的死鬥，你硬扛一記石尾橫掃後反手重創守衛，趁其崩塌前穩穩奪下「星蝕羅盤」，凱旋撤離密室！",
            damage: 4,
            addItems: [{ id: "astral_compass", qty: 1 }],
            nextNode: "ending_victory",
          },
          failure: {
            text: "黑曜利爪撕裂你的防禦留下深可見骨的血痕！你強忍劇痛翻滾上前一把抓起「星蝕羅盤」，在崩塌落石中狼狽衝出遺跡！",
            damage: 7,
            addItems: [{ id: "astral_compass", qty: 1 }],
            nextNode: "ending_scarred",
          },
          critFailure: {
            text: "石像鬼的巨拳將你狠狠拍飛撞上石壁，全身骨頭彷彿散架！眼看穹頂開始坍塌，若還能喘息，你只能放棄羅盤拚死爬出遺跡……",
            damage: 11,
            nextNode: "ending_escape",
          },
        },
      },
      {
        id: "boss_dex",
        label: "施展極限身法繞開石爪封鎖，凌空攫取羅盤脫身",
        sub: "以速度與精準度智取聖物，避免與巨獸纏鬥",
        check: { stat: "dex", dc: 56 },
        outcomes: {
          critSuccess: {
            text: "你的身影快得留下殘影！石像鬼的巨爪尚未合攏，你已借石柱騰空而起，優雅奪得「星蝕羅盤」之餘，更順手摘下一顆鑲嵌在祭壇頂端的「星輝寶石」！",
            addItems: [
              { id: "astral_compass", qty: 1 },
              { id: "astral_gem", qty: 1 },
            ],
            nextNode: "ending_legend",
          },
          success: {
            text: "千鈞一髮之際，你自石爪下方滑步穿過，穩穩抄起「星蝕羅盤」並縱身躍出逐漸閉合的密室大門！",
            addItems: [{ id: "astral_compass", qty: 1 }],
            nextNode: "ending_victory",
          },
          failure: {
            text: "你雖成功抓到「星蝕羅盤」，卻在躍離祭壇時被狂暴石風與利爪掃中後背，負傷衝出遺跡！",
            damage: 6,
            addItems: [{ id: "astral_compass", qty: 1 }],
            nextNode: "ending_scarred",
          },
          critFailure: {
            text: "腳下碎石打滑令你重心盡失，直接被石像鬼一掌掃飛重創！你只能眼睜睜看著羅盤被落石掩埋，勉強逃出生天……",
            damage: 10,
            nextNode: "ending_escape",
          },
        },
      },
      {
        id: "boss_cha",
        label: "高聲呼喚古代星靈之名，以誠摯意志與守衛靈魂共鳴",
        sub: "嘗試安撫千年執念，和平取得星蝕羅盤",
        check: { stat: "cha", dc: 56 },
        outcomes: {
          critSuccess: {
            text: "你的話語如星河清泉洗淨了守衛千年的狂躁！黑曜石像鬼收起雙翼單膝跪地，以古老禮節雙手奉上「星蝕羅盤」，並賜予你「精靈王庭的祝福」！",
            addItems: [
              { id: "astral_compass", qty: 1 },
              { id: "elven_blessing", qty: 1 },
            ],
            nextNode: "ending_legend",
          },
          success: {
            text: "石像鬼熔金雙瞳中的殺意漸漸平息。牠深深凝視你片刻後退開一步，默許你帶走「星蝕羅盤」。",
            addItems: [{ id: "astral_compass", qty: 1 }],
            nextNode: "ending_victory",
          },
          failure: {
            text: "千年孤寂早已侵蝕了守衛的神智，牠僅停頓半秒便咆哮撲來！你捱了一記重擊後強行搶下「星蝕羅盤」逃離！",
            damage: 6,
            addItems: [{ id: "astral_compass", qty: 1 }],
            nextNode: "ending_scarred",
          },
          critFailure: {
            text: "你的呼喚誤觸了守衛最痛苦的背叛記憶！熾熱星火吐息正面將你吞噬，你九死一生才爬出密室逃亡……",
            damage: 10,
            nextNode: "ending_escape",
          },
        },
      },
      {
        id: "boss_int",
        label: "洞悉石像鬼背後的魔力節點，精準切斷祭壇供能迴路",
        sub: "以智慧癱瘓古代魔像，兵不血刃",
        check: { stat: "int", dc: 58 },
        outcomes: {
          critSuccess: {
            text: "你一眼看穿三處隱蔽魔導節點並瞬間截斷魔流！黑曜石像鬼凝固為一座宏偉雕像，底座暗箱更自動開啟——你同時獲得「星蝕羅盤」與珍貴的「古代星紋手稿」！",
            addItems: [
              { id: "astral_compass", qty: 1 },
              { id: "astral_manuscript", qty: 1 },
            ],
            nextNode: "ending_legend",
          },
          success: {
            text: "供能中斷令石像鬼動作瞬間遲緩如泥沼！你從容取下「星蝕羅盤」，優雅步出核心密室。",
            addItems: [{ id: "astral_compass", qty: 1 }],
            nextNode: "ending_victory",
          },
          failure: {
            text: "切斷節點時爆發失控魔力電弧灼傷了你的雙臂，所幸石像鬼也短暫停機，讓你趁機奪得「星蝕羅盤」脫身！",
            damage: 6,
            addItems: [{ id: "astral_compass", qty: 1 }],
            nextNode: "ending_scarred",
          },
          critFailure: {
            text: "你誤斷了祭壇的穩定迴路引發劇烈魔力爆炸！飛石與衝擊波將你重創，你只能空手逃出崩塌中的密室……",
            damage: 10,
            nextNode: "ending_escape",
          },
        },
      },
    ],
  },

  /* ==================== 多重結局節點 ==================== */
  ending_legend: {
    id: "ending_legend",
    isEnding: true,
    endingTier: "legend",
    chapter: "終章 · 傳奇結局",
    location: "灰燼鎮 · 鏽錨酒館",
    title: "【傳奇結局】星辰的見證者",
    paragraphs: [
      "黎明初現，你推開鏽錨酒館的木門，將散發璀璨星火的「星蝕羅盤」與遺跡中的稀世秘寶一同置於橡木桌上。整個酒館瞬間鴉雀無聲，艾德溫震驚得說不出話來，隨即奉上雙倍賞金與法師議會的最高敬意。",
      "那天之後，吟遊詩人在大陸每座城邦傳唱你的名字——那位穿越幽影林地、解開千年星紋、連古代守衛都為之折服的傳奇冒險者。屬於你的史詩，此刻才剛剛揭開序幕。",
    ],
  },

  ending_victory: {
    id: "ending_victory",
    isEnding: true,
    endingTier: "victory",
    chapter: "終章 · 勝利結局",
    location: "灰燼鎮 · 鏽錨酒館",
    title: "【勝利結局】滿載而歸的冒險者",
    paragraphs: [
      "晨霧散盡時，你帶著完好無損的「星蝕羅盤」平安返回灰燼鎮。艾德溫如約點清兩百枚閃亮金幣交到你手中，酒館老闆也豪邁地為你斟滿一杯熱騰騰的香料麥酒。",
      "壁爐火光溫暖而寧靜，你輕撫著背包裡的戰利品，嘴角揚起一抹微笑——下一張懸賞告示，又將指引你前往哪片未知的秘境呢？",
    ],
  },

  ending_scarred: {
    id: "ending_scarred",
    isEnding: true,
    endingTier: "scarred",
    chapter: "終章 · 險勝結局",
    location: "灰燼鎮 · 鎮口石橋",
    title: "【險勝結局】浴血歸途",
    paragraphs: [
      "衣衫襤褸、遍體鱗傷的你緊緊抱著「星蝕羅盤」，終於在日出時分踉蹌走回灰燼鎮的石橋。雖然這趟旅程遠比想像中兇險，但你終究靠著頑強意志完成了委託。",
      "艾德溫驚嘆於你的毅力，除了如數支付賞金，還額外請來鎮上牧師為你包紮傷口。你明白，唯有經歷生死考驗的旅人，才能真正踏上強者之路。",
    ],
  },

  ending_escape: {
    id: "ending_escape",
    isEnding: true,
    endingTier: "escape",
    chapter: "終章 · 生還結局",
    location: "幽影林地邊緣",
    title: "【生還結局】黯然撤退",
    paragraphs: [
      "身後的斷星遺跡在轟鳴中徹底坍塌，將「星蝕羅盤」與千年秘辛重新深埋地底。你倚著潮濕的古樹劇烈喘息，慶幸自己至少保住了性命。",
      "雖然此行未能完成委託，但活著就有捲土重來的希望。待傷勢痊癒、整頓行裝後，這片暗黑奇幻大陸仍有數不盡的傳說等待你書寫。",
    ],
  },

  ending_death: {
    id: "ending_death",
    isEnding: true,
    endingTier: "death",
    chapter: "終章 · 隕落結局",
    location: "幽暗歸途",
    title: "【隕落結局】長眠於星影之下",
    paragraphs: [
      "最後一絲體力自指尖流逝，你的視線漸漸被冰冷的星塵與黑暗吞沒。幽影林地的晚風吹過你手中的火漆契約，將這段未竟的旅途化為酒館中令人唏噓的傳聞。",
      "命運的骰子偶爾無情，但冒險者永遠可以重啟命運之輪——再次挑戰，改寫屬於你的結局吧。",
    ],
  },
};
