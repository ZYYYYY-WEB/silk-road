/* =========================================================
   丝路上的回响 · Echo on the Silk Road
   纯前端静态交互 · 中英双语 · 海陆双线商旅小游戏
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- 全局状态 ---------------- */
  var state = {
    lang: "zh",
    completed: 0,          // 陆上丝路已抵达站数 (0..8)
    choices: {},           // 各站抉择记录 { index: "A" | "B" }
    explored: {},          // 海上丝路已探访港口
    activeStation: null,   // 当前弹窗对应的陆上站点索引
    modalRender: null      // 当前弹窗渲染函数（用于语言切换时重绘）
  };

  /* ---------------- 静态界面文案 ---------------- */
  var I18N = {
    zh: {
      navOrigin: "溯源",
      navJourney: "重走丝路",
      navHeritage: "丝韵新生",
      navResonance: "文明回响",

      heroEyebrow: "古丝绸之路 · 海陆双线",
      heroTitle: "丝路上的回响",
      heroSubtitle: "跨越山海，以丝为媒，听见文明的双向回响",
      heroGuide: "两千年前，驼铃起于长安，风帆扬于闽港。丝绸携东方风雅西传，异域风物随长风东归。丝绸之路从不是单向的输出，而是一场跨越亚欧非的文明互鉴。滚动探索，或点击开启旅程，重走千年丝路古道。",
      btnStart: "开启丝路旅程",
      swipeHint: "左右滑动 · 点击箭头切换页面",
      btnStartHere: "从长安启程",
      nodeStart: "起点",
      pageHero: "封面",
      pageOrigin: "序章 · 溯源",
      pageJourney: "重走丝路",
      pageHeritage: "古今对话",

      originTag: "序章 · 溯源",
      originTitle: "溯源：一条古道，双向风华",
      originCore: "西汉张骞凿空西域，正式开启陆上丝绸之路；唐宋海运繁盛，海上丝路逐步兴盛，形成海陆并行的文明通道。千百年间，丝路不仅是丝绸、瓷器、香料的商贸通道，更是艺术、宗教、科技、民俗的交流纽带。东方纹样西传重塑中亚、西亚审美，异域技艺、文化东融丰富华夏文明肌理，双向奔赴，生生不息。",
      timelineTitle: "千年脉络",
      artifactTitle: "文物见证 · 点击查看",

      journeyTag: "核心互动 · 重走丝路",
      journeyTitle: "重走丝路",
      journeyDesc: "你化身古代商旅，沿真实历史站点逐站前行。重走丝绸之路，重走的不只是商道，更是文明互鉴的长河。",
      overlandTitle: "陆上丝绸之路 · 主线商旅",
      overlandSub: "长安 → 敦煌 → 吐鲁番（高昌）→ 喀什（疏勒）→ 撒马尔罕 → 德黑兰（古安息）→ 巴格达（古条支）→ 君士坦丁堡",
      overlandHint: "点击闪烁的站点开始行程，已抵达的站点会持续散发微光。",
      btnReset: "重新启程",
      btnStartQuanzhou: "从泉州启程",
      maritimeTitle: "海上丝绸之路 · 支线科普",
      maritimeSub: "泉州 → 占城 → 马六甲 → 锡兰山 → 古里 → 霍尔木兹",
      maritimeHint: "点击任一港口，查看海上丝路的史实科普。",
      btnMapReal: "查看真实路线地图",
      btnMapHide: "收起真实地图",
      btnMapLoading: "正在加载百度地图…",
      btnMapFail: "地图加载失败，已展示手绘路线",
      baiduNote: "底图 © 百度地图 · 箭头为行进方向，点击站点图标可查看史实科普",
      geoClickHint: "点击查看史实科普",
      routeOverlandName: "陆上丝绸之路",
      routeMaritimeName: "海上丝绸之路",

      heritageTag: "古今对话 · 丝韵新生",
      heritageTitle: "丝韵新生：从古韵流光到当代风华",
      heritageLeftTitle: "古韵纹样 · 千年流光",
      heritageLeftText: "千年前，丝路纹样跨越山海、双向融合。中原卷草纹、宝相花西传滋养中亚艺术，波斯联珠纹、异域几何纹样东融，重塑华夏丝织美学。这些交融而生的纹样，是文明互鉴最细腻的视觉见证。",
      heritageRightTitle: "当代风华 · 活态传承",
      heritageRightText: "千年丝路从未落幕。如今，传统丝绸纹样与现代设计、时尚文创、国潮美学结合，走出博物馆、走进大众生活。新时代的丝绸文化，延续着丝路互通共生的精神，成为中外文化交流的全新载体。",
      patternTip: "点击纹样卡片，查看溯源与传播路径",

      resonanceTag: "尾声 · 文明回响",
      resonanceTitle: "文明无界，回响不息",
      resonanceText: "丝绸之路，从来不是一条简单的地理古道，而是一场跨越千年的文明对话。它没有绝对的东西方界限，没有单一的文化输出，唯有双向的奔赴、包容的接纳、共生的成长。古丝路上，以丝为媒、联通世界；新征程上，以文为桥、共赴山海。千年丝韵生生不息，文明互鉴回响至今。",
      tagInclusive: "包容",
      tagMutual: "互鉴",
      tagSymbiosis: "共生",

      footerTitle: "丝路上的回响·Echo on the Silk Road",
      footerComp: "第十四届全国大学生数字媒体科技作品及创意竞赛",

      kickerStart: "起点",
      kickerStation: "第 {n} 站",
      kickerEnd: "终点",
      kickerPort: "海上丝路 · 港口",
      kickerPattern: "纹样溯源",
      kickerArtifact: "文物解说",
      choiceLabel: "你的抉择 · 双向交流",
      originLabel: "源流",
      btnContinue: "继续前行",
      btnFinish: "完成旅程",
      btnBack: "返回路线",
      tagEast: "东艺西传",
      tagWest: "西学东渐",
      tagEastEn: "East → West",
      tagWestEn: "West → East",
      lockedHint: "请先抵达上一站，再继续西行。",
      exploredTag: "已探访",
      summaryTitle: "旅途圆满落幕",
      progressLabel: "已抵达 {n} / 8",
      exploredLabel: "已探访 {n} / 6",
      btnPortContinue: "继续前行",
      portSummaryTitle: "海上丝路探访完成",
      creditLabel: "图片来源",
      resetToast: "旅程已重置，从长安重新启程。"
    },
    en: {
      navOrigin: "Origin",
      navJourney: "The Journey",
      navHeritage: "Silk Revival",
      navResonance: "Resonance",

      heroEyebrow: "The Ancient Silk Road · Land & Sea",
      heroTitle: "Echo on the Silk Road",
      heroSubtitle: "Across Mountains and Seas, Bridging Civilizations Through Silk",
      heroGuide: "Two thousand years ago, camel bells rang out from Chang'an and sails set off from ancient coastal ports. Oriental silk spread westward, while exotic cultures and treasures traveled eastward. The Silk Road was never a one-way export, but a timeless dialogue and mutual learning between civilizations across Eurasia and Africa. Scroll down or start your journey to explore the ancient route.",
      btnStart: "Start Journey",
      swipeHint: "Swipe or click the arrows to navigate",
      btnStartHere: "Start from Chang'an",
      nodeStart: "Start",
      pageHero: "Cover",
      pageOrigin: "Prologue",
      pageJourney: "The Journey",
      pageHeritage: "Dialogue",

      originTag: "Prologue · Origin",
      originTitle: "Origin: A Road Connecting Dual Civilizations",
      originCore: "In the Western Han Dynasty, Zhang Qian's expedition opened up the overland Silk Road. During the Tang and Song dynasties, maritime trade flourished, forming a dual land and sea trade route. For thousands of years, the Silk Road was not only a trade channel for silk, porcelain and spices, but also a vital bond for the exchange of art, religion, technology and folk customs. Eastern aesthetics spread westward, while foreign crafts and cultures integrated into Chinese civilization, creating mutual prosperity and enduring vitality.",
      timelineTitle: "A Millennium of Routes",
      artifactTitle: "Artifacts · Click to Explore",

      journeyTag: "Interactive Core · Journey",
      journeyTitle: "Journey Along the Silk Road",
      journeyDesc: "Step into the shoes of an ancient merchant and travel along real historical stations. Each stop offers a factual introduction and a two-way exchange choice — Option A witnesses Eastern culture spreading westward, while Option B reveals Western culture traveling eastward. What you retrace is not merely a trade route, but a long river of mutual learning.",
      overlandTitle: "The Overland Silk Road · Main Route",
      overlandSub: "Chang'an → Dunhuang → Turpan (Gaochang) → Kashgar (Shule) → Samarkand → Tehran (Ancient Anxi) → Baghdad (Ancient Tiaozhi) → Constantinople",
      overlandHint: "Click the glowing station to begin. Stations you have reached keep a soft shimmer.",
      btnReset: "Restart",
      btnStartQuanzhou: "Start from Quanzhou",
      maritimeTitle: "The Maritime Silk Road · Exploration",
      maritimeSub: "Quanzhou → Champa → Malacca → Ceylon → Calicut → Hormuz",
      maritimeHint: "Click any port to read its historical introduction.",
      btnMapReal: "View Real Route Map",
      btnMapHide: "Hide Real Map",
      btnMapLoading: "Loading Baidu Map…",
      btnMapFail: "Map failed to load — showing the hand-drawn route",
      baiduNote: "Base map © Baidu Maps · Arrows show direction of travel; click a station icon for historical info",
      geoClickHint: "Click for historical info",
      routeOverlandName: "The Land Silk Road",
      routeMaritimeName: "The Maritime Silk Road",

      heritageTag: "Dialogue Across Time · Revival of Silk",
      heritageTitle: "Revival of Silk: From Ancient Elegance to Modern Vitality",
      heritageLeftTitle: "Ancient Patterns · A Millennium of Radiance",
      heritageLeftText: "Thousands of years ago, Silk Road patterns blended mutually across mountains and seas. Chinese curly grass patterns and treasure flower patterns nourished Central Asian art, while Persian pearl patterns and foreign geometric patterns integrated into Chinese silk aesthetics. These inclusive patterns are the most delicate visual witness of civilizational mutual learning.",
      heritageRightTitle: "Modern Vitality · Living Heritage",
      heritageRightText: "The thousand-year Silk Road never fades. Today, traditional silk patterns are combined with modern design, cultural and creative products, and national trend aesthetics, stepping out of museums and into public life. The silk culture in the new era inherits the inclusive spirit of the ancient Silk Road and becomes a new carrier of Sino-foreign cultural exchanges.",
      patternTip: "Click a pattern card to see its origin and spread",

      resonanceTag: "Epilogue · Resonance",
      resonanceTitle: "Boundless Civilization, Enduring Echo",
      resonanceText: "The Silk Road is never merely an ancient geographical route, but a thousand-year dialogue between civilizations. It has no absolute East-West boundaries or one-way cultural export, only mutual dedication, inclusive acceptance and common growth. In ancient times, silk connected the world; in the new era, culture builds bridges across mountains and seas. The charm of silk endures forever, and the resonance of civilizational mutual learning never fades.",
      tagInclusive: "Inclusive",
      tagMutual: "Mutual Learning",
      tagSymbiosis: "Coexistence",

      footerTitle: "Echo on the Silk Road",
      footerComp: "The 14th National College Student Digital Media Technology Works and Creativity Competition",

      kickerStart: "Starting Point",
      kickerStation: "Station {n}",
      kickerEnd: "Destination",
      kickerPort: "Maritime Silk Road · Port",
      kickerPattern: "Pattern Origin",
      kickerArtifact: "Artifact",
      choiceLabel: "Your Choice · Two-Way Exchange",
      originLabel: "Origin",
      btnContinue: "Continue the Journey",
      btnFinish: "Complete the Journey",
      btnBack: "Back to the Route",
      tagEast: "East → West",
      tagWest: "West → East",
      tagEastEn: "East → West",
      tagWestEn: "West → East",
      lockedHint: "Please reach the previous station before heading further west.",
      exploredTag: "Explored",
      summaryTitle: "Journey Completed",
      progressLabel: "Reached {n} / 8",
      exploredLabel: "Explored {n} / 6",
      btnPortContinue: "Continue the Journey",
      portSummaryTitle: "Maritime Route Completed",
      creditLabel: "Image source",
      resetToast: "Journey reset. Starting again from Chang'an."
    }
  };

  function t(key, vars) {
    var s = (I18N[state.lang] && I18N[state.lang][key]) || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.replace("{" + k + "}", vars[k]);
      });
    }
    return s;
  }
  function L(obj) { return obj ? obj[state.lang] : ""; }

  /* ---------------- 数据 · 时间轴 ---------------- */
  var TIMELINE = [
    {
      dynasty: { zh: "汉", en: "Han" },
      title: { zh: "张骞凿空西域", en: "Zhang Qian's Expedition" },
      text: {
        zh: "西汉时期，张骞两次出使西域，凿空西域，正式开启陆上丝绸之路，中原与中亚、西亚的商贸与文化通道自此贯通。",
        en: "In the Western Han Dynasty, Zhang Qian twice traveled to the Western Regions, opening the overland Silk Road and linking the Central Plains with Central and West Asia."
      }
    },
    {
      dynasty: { zh: "唐", en: "Tang" },
      title: { zh: "丝路鼎盛，万国来朝", en: "The Golden Age of the Silk Road" },
      text: {
        zh: "唐代丝路进入鼎盛，长安汇聚万国商旅，陆上丝路与海上航线并行，丝绸、瓷器、乐舞、宗教艺术双向流动。",
        en: "In the Tang Dynasty the Silk Road reached its peak. Chang'an gathered merchants from across the world, and land and sea routes carried silk, porcelain, music and religious art in both directions."
      }
    },
    {
      dynasty: { zh: "宋", en: "Song" },
      title: { zh: "海上丝路兴盛", en: "Rise of the Maritime Silk Road" },
      text: {
        zh: "宋代造船与航海技术进步，市舶司管理远洋贸易，海上丝路迅速兴盛，泉州、广州等港口联通南洋与印度洋。",
        en: "With advances in shipbuilding and navigation, and with the Maritime Trade Office managing ocean trade, the maritime Silk Road flourished; ports such as Quanzhou and Guangzhou connected to the South China Sea and the Indian Ocean."
      }
    },
    {
      dynasty: { zh: "明", en: "Ming" },
      title: { zh: "郑和下西洋", en: "Zheng He's Voyages" },
      text: {
        zh: "明代郑和七下西洋，海上丝路成熟航线延伸至波斯湾与非洲东岸，形成贯通亚欧非的文明交流网络。",
        en: "In the Ming Dynasty, Zheng He's seven voyages extended the mature maritime Silk Road to the Persian Gulf and the east coast of Africa, forming a network of exchange across Asia, Europe and Africa."
      }
    }
  ];

  /* ---------------- 数据 · 文物 ---------------- */
  var ARTIFACTS = [
    {
      name: { zh: "鎏金铜蚕", en: "Gilt Bronze Silkworm" },
      short: { zh: "汉代丝绸业繁盛的实物见证", en: "A witness of the prosperous Han silk industry" },
      text: {
        zh: "汉代丝绸业繁盛的实物见证，是丝路贸易兴起的标志性文物，承载着东方丝织技艺的千年底蕴。",
        en: "A physical witness of the prosperous silk industry in the Han Dynasty, marking the origin of Silk Road trade and carrying the heritage of ancient Chinese silk weaving technology."
      },
      img: "images/silk-silkworm.jpg",
      credit: { zh: "新浪图片", en: "Sina Photos" }
    },
    {
      name: { zh: "宋代海船残件", en: "Song Dynasty Ship Ruins" },
      short: { zh: "印证宋代海上丝路的繁荣", en: "Proof of the booming Song maritime Silk Road" },
      text: {
        zh: "印证宋代海上丝路的繁荣，见证中国与南洋、印度洋诸国的远洋贸易往来。",
        en: "Proof of the booming maritime Silk Road in the Song Dynasty, witnessing the overseas trade between China and countries in the South China Sea and Indian Ocean."
      },
      img: "images/song-ship.jpg",
      credit: { zh: "人民网 · 傅诗如摄（泉州湾古船陈列馆）", en: "People's Daily Online · Photo by Fu Shiru (Quanzhou Bay Ancient Ship Gallery)" }
    }
  ];

  /* ---------------- 数据 · 陆上丝路站点 ---------------- */
  var OVERLAND = [
    {
      id: "changan",
      name: { zh: "长安", en: "Chang'an" },
      sub: { zh: "今西安 · 丝路起点", en: "Xi'an Today · Start of the Silk Road" },
      intro: {
        zh: "丝路起点，盛唐京华。长安是古代东方的商贸与文化核心，精美的丝绸、瓷器、茶叶在此集结，等待踏上西行之路。你整装出发，携中原丝韵，开启跨越亚欧的商旅旅程。",
        en: "The starting point of the Silk Road and the prosperous capital of the Tang Dynasty. As the core of ancient Eastern trade and culture, Chang'an gathered exquisite silk, porcelain and tea, waiting to travel westward. You start your journey with oriental silk charm, embarking on a business trip across Eurasia."
      },
      x: 66, y: 160,
      options: [
        {
          key: "→",
          side: "east",
          label: { zh: "整理行囊，向西出发", en: "Pack Up and Head West" },
          text: {
            zh: "你集结中原丝绸、锦缎、瓷器与茶文化整装出发。作为丝路起点，长安承载着华夏成熟的丝织技艺、农耕文明与礼乐美学，即将向西方世界开启一场千年文化输出与对话。",
            en: "You set off with ancient Chinese silk, porcelain and tea culture. As the starting point of the Silk Road, Chang'an carried mature Chinese weaving techniques, agricultural civilization and ritual aesthetics, starting a millennium cultural dialogue with the West."
          }
        }
      ]
    },
    {
      id: "dunhuang",
      name: { zh: "敦煌", en: "Dunhuang" },
      sub: { zh: "丝路咽喉 · 戈壁明珠", en: "Throat of the Silk Road · Pearl of the Gobi" },
      intro: {
        zh: "丝路咽喉，戈壁明珠。敦煌是中原通往西域的门户，也是东西方文化交融的第一站。中原丝绸在此集散，西域的玉石、乐器、佛教艺术自此东传，莫高窟壁画中留存着千年丝路的交融之美。",
        en: "The throat of the Silk Road and a pearl in the Gobi Desert. Dunhuang was the gateway from the Central Plains to the Western Regions and the first hub of Sino-Western cultural integration. Central Plains silk was distributed here, while Western jade, musical instruments and Buddhist art spread eastward, leaving the beauty of cultural integration in Mogao Grottoes murals."
      },
      x: 190, y: 110,
      options: [
        {
          key: "A", side: "east",
          label: { zh: "兑换西域玉石留存纪念", en: "Trade for Western Jade as a Keepsake" },
          text: {
            zh: "你以中原丝绸换取西域美玉。敦煌作为首座交融枢纽，华夏工整的服饰纹样、礼乐审美随丝绸西传，初步影响西域服饰与装饰风格，开启东方美学的对外浸润。",
            en: "You exchange Chinese silk for Western Region jade. As the first integration hub, Dunhuang witnessed the westward spread of Chinese costumes, patterns and ritual aesthetics, which initially influenced West Asian decorative art."
          }
        },
        {
          key: "B", side: "west",
          label: { zh: "休整补给，感受胡风东传", en: "Rest and Feel the Eastward Wave" },
          text: {
            zh: "你驻足敦煌市集，发现西域胡旋舞、吹奏乐器、佛教壁画艺术已在此落地生根。这些西亚、中亚艺术元素随后东传中原，深刻改变了隋唐乐舞与绘画风格。",
            en: "You experience exotic markets in Dunhuang. Western dances, musical instruments and Buddhist murals took root here and spread eastward, greatly transforming the art and music style of the Sui and Tang dynasties."
          }
        }
      ]
    },
    {
      id: "turpan",
      name: { zh: "吐鲁番（高昌）", en: "Turpan (Gaochang)" },
      sub: { zh: "西域绿洲 · 丝路重镇", en: "An Oasis and Key Town on the Silk Road" },
      intro: {
        zh: "西域绿洲，丝路重镇。高昌依托绿洲文明，成为丝路中段核心商贸城市。中原丝织品在此深受追捧，当地的葡萄、瓜果、棉纺织技术则顺着丝路传入中原，丰富了两地的物产与民生。",
        en: "An oasis in the Western Regions and an important town on the Silk Road. Relying on oasis civilization, Gaochang became a core trade city in the middle section of the Silk Road. Central Plains silk was widely popular here, while local grapes, fruits and cotton weaving technology spread to the Central Plains, enriching the products and lives of both regions."
      },
      x: 320, y: 152,
      options: [
        {
          key: "A", side: "east",
          label: { zh: "采购西域特产", en: "Buy Western Region Specialties" },
          text: {
            zh: "高昌城邦贵族盛行穿戴中原锦绣衣衫。你带来的丝绸服饰、刺绣工艺，让简约华丽的中原服饰文化深度融入西域贵族生活，成为东方审美西传的重要载体。",
            en: "Nobles in Gaochang loved Chinese silk costumes. The silk and embroidery techniques you brought accelerated the spread of Eastern costume aesthetics and deeply influenced Western Region dressing culture."
          }
        },
        {
          key: "B", side: "west",
          label: { zh: "记录风土人文", en: "Record Local Customs" },
          text: {
            zh: "你观察到高昌成熟的绿洲农耕技术与葡萄酿造工艺。经由丝路，西域葡萄、苜蓿、棉花种植技术东传中原，丰富了中国古代农耕体系与民众生活方式。",
            en: "You observe advanced oasis farming and wine-making techniques in Gaochang. Western crop planting and brewing technologies spread eastward, enriching ancient China's agricultural system and daily life."
          }
        }
      ]
    },
    {
      id: "kashgar",
      name: { zh: "喀什（疏勒）", en: "Kashgar (Shule)" },
      sub: { zh: "葱岭门户 · 中西分界", en: "Gateway to the Pamirs · Boundary of East and West" },
      intro: {
        zh: "葱岭门户，中西分界。喀什是汉代疏勒古国故地，是中原通往中亚的最后关口。至此，东方丝绸正式走出华夏疆域，即将踏入中亚文明圈，开启真正的跨洲贸易旅程。",
        en: "The gateway to the Pamir Mountains and the boundary between China and the West. Kashgar, the ancient Shule Kingdom, was the last pass from the Central Plains to Central Asia. Here, oriental silk officially went out of Chinese territory and entered the Central Asian civilization circle, starting a real transcontinental trade journey."
      },
      x: 450, y: 100,
      options: [
        {
          key: "A", side: "east",
          label: { zh: "休整蓄力，翻越葱岭", en: "Rest and Cross the Pamirs" },
          text: {
            zh: "喀什作为出境门户，中原严谨的商贸规则、度量方式、丝织分类标准在此向西输出，为中亚跨境贸易带去了成熟的东方商业秩序与手工业规范。",
            en: "As the western gateway of China, Kashgar witnessed the westward spread of Chinese trade rules, measurement standards and silk classification systems, bringing mature Eastern commercial norms to Central Asia."
          }
        },
        {
          key: "B", side: "west",
          label: { zh: "与当地商旅交流经验", en: "Talk with Local Merchants" },
          text: {
            zh: "你与中亚商旅交流，习得西域长途驼运、山地通商、跨境结算的商贸经验。这些域外经商模式与避险智慧随后传入中原，完善了古代中国的跨境商贸体系。",
            en: "You learn long-distance caravan trade experience from Central Asian merchants. Western cross-border trade strategies and logistics experience spread eastward and improved ancient China's foreign trade system."
          }
        }
      ]
    },
    {
      id: "samarkand",
      name: { zh: "撒马尔罕", en: "Samarkand" },
      sub: { zh: "中亚文明核心 · 丝路商都", en: "Core of Central Asian Civilization · Silk Road Capital" },
      intro: {
        zh: "中亚文明核心，丝路繁华商都。撒马尔罕是粟特文明的中心，丝路贸易的重要中转站。中原丝绸在此风靡贵族圈层，当地的金银器制作、琉璃工艺反向传入中国，影响了唐代手工业审美与技艺。",
        en: "The core of Central Asian civilization and a prosperous commercial capital on the Silk Road. As the center of Sogdian civilization and an important transit hub, Samarkand made Chinese silk popular among the nobility. Local gold and silver ware making and glaze craftsmanship spread back to China, influencing the handicraft aesthetics and skills of the Tang Dynasty."
      },
      x: 580, y: 150,
      options: [
        {
          key: "A", side: "east",
          label: { zh: "售卖丝绸换取异域珍宝", en: "Sell Silk for Exotic Treasures" },
          text: {
            zh: "撒马尔罕粟特贵族极度推崇中原锦缎。细腻雅致的中式花鸟纹样、对称构图美学深刻重塑了中亚宫廷装饰风格，让东方纹样成为中亚艺术主流元素。",
            en: "Sogdian nobles admired Chinese brocade greatly. Delicate Chinese flower-and-bird patterns and symmetrical aesthetics reshaped Central Asian court decoration and became mainstream local artistic elements."
          }
        },
        {
          key: "B", side: "west",
          label: { zh: "学习当地手工技艺", en: "Learn Local Craftsmanship" },
          text: {
            zh: "你观摩粟特金银锤揲、琉璃烧制技艺。此后粟特立体金属工艺、通透琉璃美学东传大唐，直接推动唐代金银器、玻璃器皿工艺走向鼎盛。",
            en: "You learn Sogdian metal forging and glaze firing techniques. These Western crafts spread to the Tang Dynasty and directly promoted the prosperity of Chinese gold and silver ware and glass art."
          }
        }
      ]
    },
    {
      id: "tehran",
      name: { zh: "德黑兰（古安息）", en: "Tehran (Ancient Anxi)" },
      sub: { zh: "波斯古国 · 丝路西段枢纽", en: "Ancient Persia · Hub of the Western Silk Road" },
      intro: {
        zh: "波斯古国，丝路西段枢纽。安息（古波斯）是丝路西段核心贸易帝国，掌控着中西贸易的关键通道。波斯的联珠纹、纹样艺术与中国丝绸纹样融合，诞生了独具特色的丝路复合美学，实现艺术双向交融。",
        en: "The ancient Persian Empire and the core hub of the western Silk Road. Anxi (ancient Persia) controlled the key channel of Sino-Western trade. Persian pearl patterns and artistic aesthetics integrated with Chinese silk patterns, forming a unique inclusive Silk Road aesthetic."
      },
      x: 710, y: 105,
      options: [
        {
          key: "A", side: "east",
          label: { zh: "交流纹样设计技艺", en: "Exchange Pattern Design Techniques" },
          text: {
            zh: "你将中式卷草纹、宝相花纹样传播至波斯。柔美灵动的东方曲线纹样，弥补了波斯几何纹样的硬朗，丰富了西亚装饰艺术的层次感与柔和美感。",
            en: "You spread Chinese curly grass and treasure flower patterns to Persia. The soft Eastern linear patterns complemented rigid Persian geometric designs, enriching the layering and elegance of West Asian decorative art."
          }
        },
        {
          key: "B", side: "west",
          label: { zh: "完成丝绸交割，继续西进", en: "Complete the Silk Trade and Head West" },
          text: {
            zh: "你吸收波斯经典联珠纹、翼马纹样美学。这些极具异域特色的波斯纹样沿丝路东传，与唐风美学融合，诞生了独一无二的「丝路混合纹样」艺术风格。",
            en: "You absorb classic Persian pearl patterns and winged horse patterns. These exotic designs spread eastward, merged with Tang aesthetics, and created a unique inclusive “Silk Road mixed pattern” art style."
          }
        }
      ]
    },
    {
      id: "baghdad",
      name: { zh: "巴格达（古条支）", en: "Baghdad (Ancient Tiaozhi)" },
      sub: { zh: "西亚文明中心 · 阿拉伯商贸重镇", en: "Center of West Asian Civilization · Arabian Trade City" },
      intro: {
        zh: "西亚文明中心，阿拉伯商贸重镇。巴格达是阿拔斯王朝的都城，汇聚亚欧非商旅。中国丝绸在此成为顶级奢侈品，而阿拉伯的天文、医药、航海技术则通过丝路东传，推动了东方科技发展。",
        en: "The center of West Asian civilization and an important Arabian trade town. As the capital of the Abbasid Caliphate, Baghdad gathered merchants from Asia, Europe and Africa. Chinese silk became a top luxury here, while Arabian astronomy, medicine and navigation technology spread eastward, promoting the development of Eastern science and technology."
      },
      x: 840, y: 155,
      options: [
        {
          key: "A", side: "east",
          label: { zh: "了解异域科技文化", en: "Explore Foreign Science and Culture" },
          text: {
            zh: "巴格达学者研习中原丝织技术、造纸术与农耕历法。东方实用科技与人文知识在此被吸收、翻译、改良，成为西亚阿拉伯文明发展的重要养分。",
            en: "Scholars in Baghdad studied Chinese silk weaving, papermaking and agricultural calendars. Eastern practical technologies were absorbed and improved, becoming important nutrients for the development of Arabian civilization."
          }
        },
        {
          key: "B", side: "west",
          label: { zh: "休整后奔赴终点", en: "Rest and Head for the Destination" },
          text: {
            zh: "你接触到阿拉伯天文历法、医药典籍与航海理论。这些先进的西方科技文化沿丝路东传，为宋元时期中国天文、医学、航海技术的革新提供了全新思路。",
            en: "You learn Arabian astronomy, medical classics and navigation theories. These advanced Western technologies spread eastward, providing new innovation ideas for Chinese astronomy, medicine and navigation in the Song and Yuan dynasties."
          }
        }
      ]
    },
    {
      id: "constantinople",
      name: { zh: "君士坦丁堡", en: "Constantinople" },
      sub: { zh: "丝路西极 · 欧亚交汇之巅", en: "Western End of the Silk Road · Crossroads of Eurasia" },
      intro: {
        zh: "丝路西极，欧亚交汇之巅。君士坦丁堡是古代地中海文明核心，也是陆上丝路的最终终点。历经千里跋涉，东方丝绸抵达欧洲，惊艳西方世界，成为东西方文明千年对话的最佳见证。",
        en: "The western end of the Silk Road and the intersection of Eurasian civilizations. As the core of ancient Mediterranean civilization, Constantinople was the final destination of the overland Silk Road. After a long journey, oriental silk reached Europe, stunning the Western world and becoming an eternal witness of Sino-Western civilizational dialogue."
      },
      x: 950, y: 110,
      summary: [
        {
          zh: "旅途圆满落幕！你跨越八座丝路重镇，见证了丝绸西传、风物东归。丝路从不是单一的商贸古道，而是包容互鉴、共生共荣的文明长河。",
          en: "Journey Completed! You have traveled through eight important Silk Road towns, witnessing the westward spread of silk and the eastward integration of exotic cultures. The Silk Road is never a single trade route, but a long river of inclusive and mutually beneficial civilizations."
        },
        {
          zh: "抵达丝路西极！从长安到君士坦丁堡，你亲历完整的双向文明交融：东方丝织、纹样、工艺、科技西传滋养亚欧大陆；西方艺术、技艺、天文医学东润华夏。丝路从来不是单向输出，而是一场跨越千年的平等交流、双向成就、文明共生。",
          en: "You have reached the western end of the Silk Road! From Chang'an to Constantinople, you witnessed complete two-way cultural integration. Eastern silk craftsmanship, patterns and technologies nourished Eurasia, while Western art, astronomy and medicine enriched Chinese civilization. The Silk Road represents equal communication, mutual achievement and coexistence of civilizations."
        }
      ]
    }
  ];

  /* ---------------- 数据 · 海上丝路港口 ---------------- */
  var MARITIME = [
    {
      id: "quanzhou",
      name: { zh: "泉州", en: "Quanzhou" },
      sub: { zh: "东方第一港", en: "The First Oriental Port" },
      text: {
        zh: "宋元东方第一大港，海上丝路的起点，千帆竞渡，联通南洋与印度洋。",
        en: "The largest oriental port in the Song and Yuan dynasties, the starting point of the maritime Silk Road, connecting the South China Sea and the Indian Ocean."
      },
      x: 90, y: 120
    },
    {
      id: "champa",
      name: { zh: "占城", en: "Champa" },
      sub: { zh: "越南南部古港", en: "An Ancient Port in Southern Vietnam" },
      text: {
        zh: "越南南部古港，海上丝路首站中转，是中国与南洋诸国贸易的核心枢纽。",
        en: "An ancient port in southern Vietnam, the first transit station of the maritime Silk Road and a core trade hub between China and Southeast Asian countries."
      },
      x: 280, y: 80
    },
    {
      id: "malacca",
      name: { zh: "马六甲", en: "Malacca" },
      sub: { zh: "南洋咽喉要道", en: "The Throat of the South Seas" },
      text: {
        zh: "南洋咽喉要道，掌控海上丝路核心航道，是东西方商船必经之地。",
        en: "The strategic throat of the South China Sea, controlling the core waterway of the maritime Silk Road and a must-pass for Sino-Western merchant ships."
      },
      x: 470, y: 140
    },
    {
      id: "ceylon",
      name: { zh: "锡兰山", en: "Ceylon" },
      sub: { zh: "印度洋贸易中转站", en: "Indian Ocean Trade Transit" },
      text: {
        zh: "斯里兰卡古港，印度洋贸易中转站，承接东西方物产与文化流转。",
        en: "An ancient port in Sri Lanka, an Indian Ocean trade transit hub undertaking the circulation of products and cultures between the East and the West."
      },
      x: 640, y: 90
    },
    {
      id: "calicut",
      name: { zh: "古里", en: "Calicut" },
      sub: { zh: "印度洋核心商港", en: "Core Port of the Indian Ocean" },
      text: {
        zh: "印度卡利卡特，古代印度洋核心商港，中西远洋贸易的重要节点。",
        en: "Calicut, India, the core commercial port of the ancient Indian Ocean and an important node of Sino-Western ocean trade."
      },
      x: 790, y: 145
    },
    {
      id: "hormuz",
      name: { zh: "霍尔木兹", en: "Hormuz" },
      sub: { zh: "波斯湾门户", en: "Gateway to the Persian Gulf" },
      text: {
        zh: "波斯湾门户，海上丝路西段终点，联通西亚与北非文明。",
        en: "The gateway to the Persian Gulf, the western end of the maritime Silk Road, connecting West Asian and North African civilizations."
      },
      x: 930, y: 100
    }
  ];

  /* ---------------- 数据 · 丝路纹样 ---------------- */
  var CREDIT_NSM = { zh: "中国丝绸博物馆", en: "China National Silk Museum" };

  var PATTERNS = [
    {
      id: "juancao",
      name: { zh: "卷草纹", en: "Curly Grass Pattern" },
      origin: { zh: "中原", en: "Central Plains" },
      side: "east",
      desc: {
        zh: "中原传统纹样，以柔美连绵的曲线见长。随丝绸西传，为波斯几何纹样注入灵动层次，滋养了中亚与西亚的装饰艺术。",
        en: "A traditional Central Plains pattern known for its soft, continuous curves. Spreading westward with silk, it brought flowing rhythm to Persian geometric design and nourished Central and West Asian decorative art."
      },
      img: "images/pattern-juancao.jpg",
      credit: CREDIT_NSM
    },
    {
      id: "baoxiang",
      name: { zh: "宝相花", en: "Treasure Flower" },
      origin: { zh: "中原", en: "Central Plains" },
      side: "east",
      desc: {
        zh: "融汇佛教艺术而生的中原装饰纹样。随丝路西传至中亚，成为当地艺术中备受推崇的东方母题，见证东方审美的对外浸润。",
        en: "A Central Plains decorative motif born from Buddhist art. Traveling west along the Silk Road to Central Asia, it became a highly admired Eastern motif and witnessed the outward reach of Eastern aesthetics."
      },
      img: "images/pattern-baoxiang.jpg",
      credit: CREDIT_NSM
    },
    {
      id: "lianzhu",
      name: { zh: "联珠纹", en: "Linked Pearl Pattern" },
      origin: { zh: "波斯", en: "Persia" },
      side: "west",
      desc: {
        zh: "波斯萨珊风格的代表纹样，以圆珠环绕为主构。沿丝路东传中原，在唐代丝绸上大放异彩，与唐风美学融合共生。",
        en: "A signature motif of Sassanian Persia, built around encircling pearl roundels. It spread eastward along the Silk Road, flourished on Tang Dynasty silk, and merged with Tang aesthetics."
      },
      img: "images/pattern-lianzhu.jpg",
      credit: CREDIT_NSM
    },
    {
      id: "jihe",
      name: { zh: "几何纹", en: "Geometric Pattern" },
      origin: { zh: "中亚 · 西亚", en: "Central & West Asia" },
      side: "west",
      desc: {
        zh: "源自中亚、西亚的异域几何纹样，东融华夏丝织美学，与中原纹样交织出丝路独有的复合美感。",
        en: "Foreign geometric motifs from Central and West Asia integrated into Chinese silk aesthetics, interweaving with Central Plains patterns to form a distinctive Silk Road composite beauty."
      },
      img: "images/pattern-jihe.jpg",
      credit: CREDIT_NSM
    }
  ];

  /* ---------------- 数据 · 当代创新 ---------------- */
  var MODERN = [
    {
      name: { zh: "当代丝绸服饰", en: "Modern Silk Fashion" },
      text: {
        zh: "传统纹样走出博物馆，融入现代剪裁与时尚语境，让千年丝韵成为可穿着的当代表达。",
        en: "Traditional patterns step out of museums and into modern tailoring and fashion, turning a millennium of silk charm into a wearable contemporary expression."
      },
      img: "images/modern-fashion.jpg",
      credit: CREDIT_NSM
    },
    {
      name: { zh: "丝绸文创产品", en: "Silk Cultural Products" },
      text: {
        zh: "以丝路纹样为灵感的文化创意设计，将文明互鉴的故事带入日常生活与大众审美。",
        en: "Cultural and creative designs inspired by Silk Road patterns bring the story of mutual learning into daily life and public aesthetics."
      },
      img: "images/modern-product.jpg",
      credit: CREDIT_NSM
    },
    {
      name: { zh: "非遗创新作品", en: "Intangible Heritage Innovation" },
      text: {
        zh: "传统丝织与非遗技艺在当代创新中延续，让古老工艺在新的时代语境里继续生长。",
        en: "Traditional silk weaving and intangible heritage techniques continue through contemporary innovation, letting ancient craftsmanship grow in a new era."
      },
      img: "images/modern-craft.jpg",
      credit: CREDIT_NSM
    }
  ];

  /* ---------------- DOM ---------------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var els = {
    langToggle: $("#langToggle"),
    deck: $("#deck"),
    pages: $$(".page"),
    dots: $("#pageDots"),
    prevBtn: $("#prevPage"),
    nextBtn: $("#nextPage"),
    startJourney: $("#startJourney"),
    timeline: $("#timeline"),
    artifacts: $("#artifacts"),
    overlandNodes: $("#overlandNodes"),
    maritimeNodes: $("#maritimeNodes"),
    overlandProgress: $("#overlandProgress"),
    maritimeProgress: $("#maritimeProgress"),
    progressText: $("#progressText"),
    maritimeText: $("#maritimeText"),
    patternCards: $("#patternCards"),
    modernCards: $("#modernCards"),
    resetJourney: $("#resetJourney"),
    startMaritime: $("#startMaritime"),
    baiduPanelOverland: $("#baiduPanelOverland"),
    baiduPanelMaritime: $("#baiduPanelMaritime"),
    baiduMapOverland: $("#baiduMapOverland"),
    baiduMapMaritime: $("#baiduMapMaritime"),
    baiduToggleOverland: $("#baiduToggleOverland"),
    baiduToggleMaritime: $("#baiduToggleMaritime"),
    modal: $("#modal"),
    modalBody: $("#modalBody"),
    toast: $("#toast")
  };

  /* ---------------- 渲染 · 静态文案 ---------------- */
  function applyI18n() {
    $$("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = I18N[state.lang][key];
      if (typeof val === "string") el.textContent = val;
    });
    document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
    $$("#langToggle button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === state.lang);
    });
  }

  /* ---------------- 渲染 · 溯源 ---------------- */
  function renderTimeline() {
    els.timeline.innerHTML = TIMELINE.map(function (item) {
      return '<div class="tl-item">' +
        '<div class="tl-head">' +
          '<span class="tl-dynasty">' + L(item.dynasty) + '</span>' +
          '<h4 class="tl-title">' + L(item.title) + '</h4>' +
        '</div>' +
        '<p class="tl-text">' + L(item.text) + '</p>' +
      '</div>';
    }).join("");
  }

  function renderArtifacts() {
    els.artifacts.innerHTML = ARTIFACTS.map(function (a, i) {
      return '<button class="artifact" type="button" data-artifact="' + i + '">' +
        '<span class="artifact-icon"><img src="' + a.img + '" alt="' + L(a.name) + '" loading="lazy"></span>' +
        '<span class="artifact-info">' +
          '<h4>' + L(a.name) + '</h4>' +
          '<p>' + L(a.short) + '</p>' +
          '<span class="artifact-more">' + t("kickerArtifact") + " ›" + '</span>' +
        '</span>' +
      '</button>';
    }).join("");
  }

  function openArtifact(i) {
    var a = ARTIFACTS[i];
    showModal(function () {
      return '' +
        '<div class="m-head">' +
          '<span class="m-kicker">' + t("kickerArtifact") + '</span>' +
          '<h3 class="m-title" id="modalTitle">' + L(a.name) + '</h3>' +
          '<p class="m-sub">' + L(a.short) + '</p>' +
        '</div>' +
        '<div class="m-divider"></div>' +
        '<figure class="m-photo"><img src="' + a.img + '" alt="' + L(a.name) + '"></figure>' +
        '<p class="m-credit">' + t("creditLabel") + ' · ' + L(a.credit) + '</p>' +
        '<p class="m-desc">' + L(a.text) + '</p>' +
        '<div class="m-actions"><button class="btn btn-mini" type="button" data-close>' + t("btnBack") + '</button></div>';
    });
  }

  /* ---------------- 渲染 · 路线节点 ---------------- */
  function nodeClass(index, kind) {
    if (kind === "overland") {
      if (index < state.completed) return "done";
      if (index === state.completed) return "current";
      return "locked";
    }
    return state.explored[MARITIME[index].id] ? "done" : "idle";
  }

  function renderNodes() {
    els.overlandNodes.innerHTML = OVERLAND.map(function (s, i) {
      var cls = nodeClass(i, "overland");
      var disabled = cls === "locked" ? ' aria-disabled="true"' : "";
      var flag = (i === 0 && state.completed === 0)
        ? '<span class="node-flag">' + t("nodeStart") + '</span>' : "";
      return '<button class="node ' + cls + '" type="button" data-station="' + i + '"' + disabled +
        ' style="left:' + (s.x / 1000 * 100) + '%;top:' + (s.y / 240 * 100) + '%">' +
        flag + '<span class="dot"></span><span class="lbl">' + L(s.name) + '</span>' +
      '</button>';
    }).join("");

    if (els.startJourney) els.startJourney.hidden = state.completed > 0;

    els.maritimeNodes.innerHTML = MARITIME.map(function (p, i) {
      var cls = nodeClass(i, "maritime");
      return '<button class="node ' + cls + '" type="button" data-port="' + i + '"' +
        ' style="left:' + (p.x / 1000 * 100) + '%;top:' + (p.y / 240 * 100) + '%">' +
        '<span class="dot"></span><span class="lbl">' + L(p.name) + '</span>' +
      '</button>';
    }).join("");

    if (els.startMaritime) els.startMaritime.hidden = Object.keys(state.explored).length > 0;

    updateProgress();
  }

  function setPathProgress(pathEl, fraction) {
    if (!pathEl) return;
    var len = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = len;
    pathEl.style.strokeDashoffset = len * (1 - Math.max(0, Math.min(1, fraction)));
  }

  function updateProgress() {
    els.progressText.textContent = t("progressLabel", { n: state.completed });
    var exploredCount = Object.keys(state.explored).length;
    els.maritimeText.textContent = t("exploredLabel", { n: exploredCount });
    requestAnimationFrame(function () {
      setPathProgress(els.overlandProgress, state.completed === 0 ? 0 : state.completed / (OVERLAND.length - 1));
      setPathProgress(els.maritimeProgress, exploredCount === 0 ? 0 : exploredCount / MARITIME.length);
    });
  }

  /* ---------------- 弹窗 ---------------- */
  function showModal(renderFn) {
    state.modalRender = renderFn;
    els.modalBody.innerHTML = renderFn();
    els.modal.classList.add("open");
    els.modal.setAttribute("aria-hidden", "false");
    var card = $(".modal-card", els.modal);
    if (card) card.scrollTop = 0;
  }

  function closeModal() {
    els.modal.classList.remove("open");
    els.modal.setAttribute("aria-hidden", "true");
    state.modalRender = null;
  }

  function refreshModal() {
    if (state.modalRender && els.modal.classList.contains("open")) {
      els.modalBody.innerHTML = state.modalRender();
    }
  }

  /* ---------------- 站点弹窗 ---------------- */
  function kickerFor(i) {
    if (i === 0) return t("kickerStart");
    if (i === OVERLAND.length - 1) return t("kickerEnd");
    return t("kickerStation", { n: i });
  }

  function optionHTML(station, opt, i) {
    var westCls = opt.side === "west" ? " west" : "";
    var keyHTML = /[A-Za-z]/.test(opt.key) ? opt.key : "→";
    return '<button class="option' + westCls + '" type="button" data-choice="' + i + '">' +
      '<span class="o-top">' +
        '<span class="o-key">' + keyHTML + '</span>' +
        '<span class="o-label">' + L(opt.label) + '</span>' +
        '<span class="o-tag">' + (opt.side === "west" ? t("tagWest") : t("tagEast")) + '</span>' +
      '</span>' +
    '</button>';
  }

  function resultHTML(opt) {
    var westCls = opt.side === "west" ? " west" : "";
    return '<div class="result' + westCls + '">' +
      '<div class="result-head">' +
        '<span class="result-key">' + (/[A-Za-z]/.test(opt.key) ? opt.key : "→") + '</span>' +
        '<span class="result-label">' + L(opt.label) + '</span>' +
        '<span class="result-tag">' + (opt.side === "west" ? t("tagWest") : t("tagEast")) + '</span>' +
      '</div>' +
      '<p>' + L(opt.text) + '</p>' +
    '</div>';
  }

  function renderStation(i) {
    var s = OVERLAND[i];
    var isEnd = i === OVERLAND.length - 1;
    var chosen = state.choices[i];
    var opt = chosen ? s.options[Number(chosen)] : null;

    var body = '' +
      '<div class="m-head">' +
        '<span class="m-kicker">' + kickerFor(i) + '</span>' +
        '<h3 class="m-title" id="modalTitle">' + L(s.name) + '</h3>' +
        '<p class="m-sub">' + L(s.sub) + '</p>' +
      '</div>' +
      '<p class="m-desc">' + L(s.intro) + '</p>';

    if (s.options) {
      body += '<div class="m-divider"></div>';
      if (opt) {
        body += resultHTML(opt);
      } else {
        body += '<p class="m-label">' + t("choiceLabel") + '</p><div class="options">';
        body += s.options.map(function (o, k) { return optionHTML(s, o, k); }).join("");
        body += '</div>';
      }
    }

    if (isEnd) {
      body += '<div class="summary">' +
        '<h4>' + t("summaryTitle") + '</h4>' +
        s.summary.map(function (p) { return '<p>' + L(p) + '</p>'; }).join("") +
      '</div>';
    }

    // 操作区
    body += '<div class="m-actions">';
    if (chosen !== undefined && chosen !== null) {
      body += '<button class="btn btn-primary" type="button" data-continue="' + i + '">' +
        (isEnd ? t("btnFinish") : t("btnContinue")) + '</button>';
    } else if (isEnd) {
      body += '<button class="btn btn-primary" type="button" data-continue="' + i + '">' + t("btnFinish") + '</button>';
    } else {
      body += '<button class="btn btn-mini" type="button" data-close>' + t("btnBack") + '</button>';
    }
    body += '</div>';

    return body;
  }

  function openStation(i) {
    state.activeStation = i;
    showModal(function () { return renderStation(i); });
  }

  function completeStation(i) {
    if (state.choices[i] === undefined && OVERLAND[i].options && i !== 0) {
      // 尚未抉择，不允许直接完成
      return;
    }
    if (i + 1 > state.completed) state.completed = i + 1;
    if (i === OVERLAND.length - 1) state.completed = OVERLAND.length;
    renderNodes();

    if (i < OVERLAND.length - 1) {
      // 自动跳转到下一站
      openStation(i + 1);
      scrollNodeIntoView(i + 1);
    } else {
      closeModal();
      showToast(t("summaryTitle"));
    }
  }

  // 将指定节点滚动到地图可视区域中间
  function scrollIntoCenter(node) {
    if (!node) return;
    var scroller = node.closest(".map-scroll");
    if (!scroller) return;
    var left = node.offsetLeft + node.offsetWidth / 2 - scroller.clientWidth / 2;
    if (scroller.scrollTo) {
      scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    } else {
      scroller.scrollLeft = Math.max(0, left);
    }
  }

  function scrollNodeIntoView(index) {
    scrollIntoCenter($('[data-station="' + index + '"]', els.overlandNodes));
  }

  function scrollPortIntoView(index) {
    scrollIntoCenter($('[data-port="' + index + '"]', els.maritimeNodes));
  }

  /* ---------------- 港口弹窗 ---------------- */
  function renderPort(i) {
    var p = MARITIME[i];
    var isEnd = i === MARITIME.length - 1;
    return '' +
      '<div class="m-head">' +
        '<span class="m-kicker">' + t("kickerPort") + '</span>' +
        '<h3 class="m-title" id="modalTitle">' + L(p.name) + '</h3>' +
        '<p class="m-sub">' + L(p.sub) + '</p>' +
      '</div>' +
      '<div class="m-divider"></div>' +
      '<p class="m-desc">' + L(p.text) + '</p>' +
      '<div class="m-actions">' +
        '<button class="btn btn-mini" type="button" data-close>' + t("btnBack") + '</button>' +
        '<button class="btn btn-primary" type="button" data-port-continue="' + i + '">' +
          (isEnd ? t("btnFinish") : t("btnPortContinue")) +
        '</button>' +
      '</div>';
  }

  function openPort(i) {
    showModal(function () { return renderPort(i); });
    scrollPortIntoView(i);
  }

  function completePort(i) {
    var p = MARITIME[i];
    state.explored[p.id] = true;
    renderNodes();
    if (i < MARITIME.length - 1) {
      openPort(i + 1);
    } else {
      closeModal();
      showToast(t("portSummaryTitle"));
    }
  }

  /* ---------------- 渲染 · 古今对话 ---------------- */
  function renderHeritage() {
    els.patternCards.innerHTML = PATTERNS.map(function (p, i) {
      var westCls = p.side === "west" ? " west" : "";
      return '<button class="pattern-card" type="button" data-pattern="' + i + '">' +
        '<span class="pc-photo"><img src="' + p.img + '" alt="' + L(p.name) + '" loading="lazy"></span>' +
        '<span class="pc-name">' + L(p.name) + '</span>' +
        '<span class="pc-dir' + westCls + '">' + (p.side === "west" ? t("tagWest") : t("tagEast")) + '</span>' +
      '</button>';
    }).join("");

    els.modernCards.innerHTML = MODERN.map(function (m) {
      return '<div class="modern-card">' +
        '<span class="modern-icon"><img src="' + m.img + '" alt="' + L(m.name) + '" loading="lazy"></span>' +
        '<div class="modern-info"><h4>' + L(m.name) + '</h4><p>' + L(m.text) + '</p>' +
          '<span class="mc-credit">' + t("creditLabel") + ' · ' + L(m.credit) + '</span>' +
        '</div>' +
      '</div>';
    }).join("");
  }

  function openPattern(i) {
    var p = PATTERNS[i];
    showModal(function () {
      return '' +
        '<div class="m-head">' +
          '<span class="m-kicker">' + t("kickerPattern") + '</span>' +
          '<h3 class="m-title" id="modalTitle">' + L(p.name) + '</h3>' +
          '<p class="m-sub">' + t("originLabel") + ' · ' + L(p.origin) + ' · ' +
            (p.side === "west" ? t("tagWest") : t("tagEast")) + '</p>' +
        '</div>' +
        '<figure class="m-photo"><img src="' + p.img + '" alt="' + L(p.name) + '"></figure>' +
        '<p class="m-credit">' + t("creditLabel") + ' · ' + L(p.credit) + '</p>' +
        '<p class="m-desc">' + L(p.desc) + '</p>' +
        '<div class="m-actions"><button class="btn btn-mini" type="button" data-close>' + t("btnBack") + '</button></div>';
    });
  }

  /* ---------------- 提示 ---------------- */
  var toastTimer = null;
  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove("show"); }, 2200);
  }

  /* ---------------- 整页切换 ---------------- */
  var PAGE_KEYS = ["pageHero", "pageOrigin", "pageJourney", "pageHeritage"];
  var currentPage = 0;

  function renderDots() {
    if (!els.dots) return;
    els.dots.innerHTML = PAGE_KEYS.map(function (k, i) {
      return '<button type="button" data-dot="' + i + '" aria-label="' + t(k) + '">' +
        '<span>' + t(k) + '</span></button>';
    }).join("");
  }

  function updateDots() {
    if (els.dots) {
      $$("[data-dot]", els.dots).forEach(function (b) {
        b.classList.toggle("active", Number(b.getAttribute("data-dot")) === currentPage);
      });
    }
    if (els.prevBtn) els.prevBtn.disabled = currentPage === 0;
    if (els.nextBtn) els.nextBtn.disabled = currentPage === els.pages.length - 1;
  }

  function updateNav() {
    $$("#siteNav [data-goto]").forEach(function (b) {
      b.classList.toggle("active", Number(b.getAttribute("data-goto")) === currentPage);
    });
  }

  function revealIn(pageEl) {
    if (!pageEl) return;
    $$(".reveal", pageEl).forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, 6) * 80 + "ms";
      el.classList.add("in");
    });
  }

  function offsetWithin(el, ancestor) {
    var y = 0;
    while (el && el !== ancestor) { y += el.offsetTop; el = el.offsetParent; }
    return y;
  }

  function scrollToAnchor(anchor) {
    var target = $(anchor);
    if (!target) return;
    var page = target.closest(".page");
    if (!page) return;
    var top = offsetWithin(target, page) - 8;
    if (page.scrollTo) page.scrollTo({ top: top, behavior: "smooth" });
    else page.scrollTop = top;
  }

  function goTo(index, anchor) {
    if (!els.pages.length) return;
    index = Math.max(0, Math.min(els.pages.length - 1, index));
    if (index === currentPage) {
      if (anchor) scrollToAnchor(anchor);
      return;
    }
    var forward = index > currentPage;
    var from = els.pages[currentPage];
    var to = els.pages[index];

    els.pages.forEach(function (p) {
      p.classList.remove("enter-left", "enter-right", "leave-left", "leave-right");
    });

    // 入场起始态 → 强制重排 → 切换到激活态，触发过渡
    to.classList.add(forward ? "enter-right" : "enter-left");
    void to.offsetWidth;
    to.classList.remove("enter-right", "enter-left");
    to.classList.add("active");

    from.classList.remove("active");
    from.classList.add(forward ? "leave-left" : "leave-right");

    currentPage = index;
    updateDots();
    updateNav();
    revealIn(to);

    window.clearTimeout(goTo._cleanup);
    goTo._cleanup = window.setTimeout(function () {
      from.classList.remove("leave-left", "leave-right");
    }, 700);

    if (anchor) {
      window.setTimeout(function () { scrollToAnchor(anchor); }, 140);
    } else {
      to.scrollTop = 0;
    }
  }

  function nextPage() { goTo(currentPage + 1); }
  function prevPage() { goTo(currentPage - 1); }

  function isModalOpen() { return els.modal.classList.contains("open"); }

  var swipe = { x: 0, y: 0, on: false };
  function swipeStart(x, y, target) {
    if (isModalOpen()) { swipe.on = false; return; }
    // 起点落在可横向滚动的地图或百度地图内时不触发翻页，避免与地图交互冲突
    if (target && target.closest && target.closest(".baidu-map")) { swipe.on = false; return; }
    var scroller = target && target.closest ? target.closest(".map-scroll") : null;
    if (scroller && scroller.scrollWidth > scroller.clientWidth + 4) { swipe.on = false; return; }
    swipe.x = x; swipe.y = y; swipe.on = true;
  }
  function swipeEnd(x, y) {
    if (!swipe.on) return;
    swipe.on = false;
    if (isModalOpen()) return;
    var dx = x - swipe.x, dy = y - swipe.y;
    if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.1) return;
    if (dx < 0) nextPage(); else prevPage();
  }

  /* ---------------- 百度地图 · 真实丝路路线 ---------------- */
  var BAIDU_AK = "Df8STi96zf8R33HdORrOFlsiYpazlErr";
  var baiduState = { loading: false, ready: false, failed: false, cbs: [], maps: {} };

  // 站点坐标（经纬度，BD-09 偏差在洲际缩放级别可忽略）
  var ROUTE_GEO = {
    overland: [
      { name: { zh: "长安", en: "Chang'an" }, lng: 108.94, lat: 34.34 },
      { name: { zh: "敦煌", en: "Dunhuang" }, lng: 94.66, lat: 40.14 },
      { name: { zh: "吐鲁番", en: "Turpan" }, lng: 89.19, lat: 42.95 },
      { name: { zh: "喀什", en: "Kashgar" }, lng: 75.99, lat: 39.47 },
      { name: { zh: "撒马尔罕", en: "Samarkand" }, lng: 66.98, lat: 39.65 },
      { name: { zh: "德黑兰", en: "Tehran" }, lng: 51.39, lat: 35.69 },
      { name: { zh: "巴格达", en: "Baghdad" }, lng: 44.36, lat: 33.31 },
      { name: { zh: "君士坦丁堡", en: "Constantinople" }, lng: 28.98, lat: 41.01 }
    ],
    maritime: [
      { name: { zh: "泉州", en: "Quanzhou" }, lng: 118.68, lat: 24.87 },
      { name: { zh: "占城", en: "Champa" }, lng: 109.22, lat: 13.77 },
      { name: { zh: "马六甲", en: "Malacca" }, lng: 102.25, lat: 2.19 },
      { name: { zh: "锡兰山", en: "Ceylon" }, lng: 79.86, lat: 6.93 },
      { name: { zh: "古里", en: "Calicut" }, lng: 75.78, lat: 11.25 },
      { name: { zh: "霍尔木兹", en: "Hormuz" }, lng: 56.30, lat: 27.10 }
    ]
  };

  function loadBaidu(cb) {
    if (baiduState.ready && window.BMap) { cb(true); return; }
    if (baiduState.failed) { cb(false); return; }
    if (baiduState.loading) { baiduState.cbs.push(cb); return; }
    baiduState.loading = true;
    baiduState.cbs.push(cb);
    var settled = false;
    function finish(ok) {
      if (settled) return;
      settled = true;
      baiduState.loading = false;
      baiduState.ready = !!ok;
      baiduState.failed = !ok;
      var cbs = baiduState.cbs;
      baiduState.cbs = [];
      cbs.forEach(function (fn) { fn(ok); });
    }
    // 百度 API 内部使用 document.write，动态插入时必须携带 callback 参数，
    // 否则脚本会被浏览器的 document.write 拦截而不生效。
    window.__baiduReady = function () {
      var tries = 0;
      (function poll() {
        if (window.BMap) { finish(true); return; }
        if (++tries > 30) { finish(!!window.BMap); return; }
        window.setTimeout(poll, 100);
      })();
    };
    var s = document.createElement("script");
    s.src = "https://api.map.baidu.com/api?v=3.0&ak=" + BAIDU_AK + "&callback=__baiduReady";
    s.async = true;
    s.onerror = function () { finish(false); };
    (document.body || document.head).appendChild(s);
    window.setTimeout(function () { finish(!!window.BMap); }, 12000);
  }

  function setMapBtn(btn, key) {
    if (!btn) return;
    btn.setAttribute("data-i18n", key);
    btn.textContent = t(key);
  }

  function showMapMsg(mapEl, msg) {
    if (!mapEl) return;
    clearMapMsg(mapEl);
    var d = document.createElement("div");
    d.className = "baidu-msg";
    d.textContent = msg;
    mapEl.appendChild(d);
  }

  function clearMapMsg(mapEl) {
    if (!mapEl) return;
    var old = $(".baidu-msg", mapEl);
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }

  function openGeo(kind, i) {
    if (kind === "overland") openStation(i);
    else openPort(i);
  }

  function drawRoute(kind, bmap) {
    var data = ROUTE_GEO[kind];
    var pts = data.map(function (d) { return new BMap.Point(d.lng, d.lat); });
    bmap.clearOverlays();

    // 路线主线（加粗金色）
    bmap.addOverlay(new BMap.Polyline(pts, {
      strokeColor: "#C9A44C", strokeWeight: 6, strokeOpacity: 0.95
    }));

    // 行进方向箭头：按每段真实方位旋转
    for (var k = 0; k < pts.length - 1; k++) {
      var a = data[k], b = data[k + 1];
      var mid = new BMap.Point((a.lng + b.lng) / 2, (a.lat + b.lat) / 2);
      var deg = Math.atan2(
        (b.lng - a.lng) * Math.cos((a.lat + b.lat) / 2 * Math.PI / 180),
        (b.lat - a.lat)
      ) * 180 / Math.PI;
      var arrow = new BMap.Label(
        '<span style="display:block;line-height:0;transform:rotate(' + deg.toFixed(1) + 'deg)">' +
        '<svg width="16" height="16" viewBox="0 0 14 14"><path d="M7 1 L12 12 L7 9 L2 12 Z" fill="#8A322A" stroke="#FBF8F2" stroke-width="1"/></svg>' +
        '</span>',
        { position: mid, offset: new BMap.Size(-8, -8) }
      );
      arrow.setStyle({ border: "none", background: "transparent", padding: "0" });
      bmap.addOverlay(arrow);
    }

    // 路线名称标注（置于路线中段）
    var midIdx = Math.floor((data.length - 1) / 2);
    var routeName = kind === "overland" ? t("routeOverlandName") : t("routeMaritimeName");
    var nameLabel = new BMap.Label(routeName, {
      position: pts[midIdx], offset: new BMap.Size(-58, -42)
    });
    nameLabel.setStyle({
      color: "#8A322A", fontSize: "13px", fontWeight: "600", fontFamily: "inherit",
      border: "1px solid rgba(160,58,49,.45)", borderRadius: "999px",
      background: "rgba(251,248,242,.95)", padding: "4px 14px",
      boxShadow: "0 4px 12px rgba(44,68,72,.16)"
    });
    bmap.addOverlay(nameLabel);

    // 站点图标（可点击查看史实科普）
    pts.forEach(function (pt, i) {
      var marker = new BMap.Marker(pt, { enableMassClear: false });
      var name = L(data[i].name);
      var label = new BMap.Label(name, { offset: new BMap.Size(14, -10) });
      label.setStyle({
        color: "#203638", fontSize: "12px", fontFamily: "inherit", cursor: "pointer",
        border: "1px solid rgba(201,164,76,.6)", borderRadius: "6px",
        background: "rgba(251,248,242,.94)", padding: "2px 7px"
      });
      marker.setLabel(label);
      marker.setTitle(name + " · " + t("geoClickHint"));
      marker.addEventListener("click", function () { openGeo(kind, i); });
      label.addEventListener("click", function () { openGeo(kind, i); });
      bmap.addOverlay(marker);
    });
    return pts;
  }

  function renderBaiduMap(kind, mapEl) {
    if (!window.BMap || !mapEl) return;
    clearMapMsg(mapEl);
    void mapEl.offsetWidth;
    var entry = baiduState.maps[kind];
    if (entry && entry.map) { drawRoute(kind, entry.map); return; }
    var data = ROUTE_GEO[kind];
    var bmap = new BMap.Map(mapEl);
    bmap.centerAndZoom(new BMap.Point(data[0].lng, data[0].lat), 4);
    bmap.enableScrollWheelZoom(true);
    baiduState.maps[kind] = { map: bmap };
    var pts = drawRoute(kind, bmap);
    bmap.setViewport(pts, { margins: [40, 40, 40, 40] });
  }

  function refreshBaiduLabels() {
    Object.keys(baiduState.maps).forEach(function (kind) {
      var entry = baiduState.maps[kind];
      if (entry && entry.map) drawRoute(kind, entry.map);
    });
  }

  function toggleBaidu(kind, btn) {
    var panel = kind === "overland" ? els.baiduPanelOverland : els.baiduPanelMaritime;
    var mapEl = kind === "overland" ? els.baiduMapOverland : els.baiduMapMaritime;
    if (!panel || !mapEl) return;
    if (!panel.hidden) {
      panel.hidden = true;
      setMapBtn(btn, "btnMapReal");
      return;
    }
    panel.hidden = false;
    setMapBtn(btn, "btnMapHide");
    if (window.BMap) { renderBaiduMap(kind, mapEl); return; }
    if (baiduState.failed) { showMapMsg(mapEl, t("btnMapFail")); return; }
    showMapMsg(mapEl, t("btnMapLoading"));
    loadBaidu(function (ok) {
      if (ok) {
        if (!panel.hidden) renderBaiduMap(kind, mapEl);
      } else if (!panel.hidden) {
        showMapMsg(mapEl, t("btnMapFail"));
        showToast(t("btnMapFail"));
      }
    });
  }

  /* ---------------- 语言切换 ---------------- */
  function setLang(lang) {
    state.lang = lang;
    applyI18n();
    renderTimeline();
    renderArtifacts();
    renderNodes();
    renderHeritage();
    renderDots();
    updateDots();
    updateNav();
    refreshModal();
    refreshBaiduLabels();
  }

  /* ---------------- 事件 ---------------- */
  function bindEvents() {
    els.langToggle.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-lang]");
      if (btn) setLang(btn.getAttribute("data-lang"));
    });

    // 页面切换：导航按钮 / 品牌标识
    document.addEventListener("click", function (e) {
      var nav = e.target.closest("[data-goto]");
      if (!nav) return;
      e.preventDefault();
      goTo(Number(nav.getAttribute("data-goto")), nav.getAttribute("data-anchor"));
    });

    // 页面指示点
    if (els.dots) {
      els.dots.addEventListener("click", function (e) {
        var b = e.target.closest("[data-dot]");
        if (b) goTo(Number(b.getAttribute("data-dot")));
      });
    }
    if (els.prevBtn) els.prevBtn.addEventListener("click", prevPage);
    if (els.nextBtn) els.nextBtn.addEventListener("click", nextPage);

    // 滑动切换（触摸 + 鼠标拖拽），弹窗打开时禁用
    if (els.deck) {
      els.deck.addEventListener("touchstart", function (e) {
        var tp = e.changedTouches[0];
        swipeStart(tp.clientX, tp.clientY, e.target);
      }, { passive: true });
      els.deck.addEventListener("touchend", function (e) {
        var tp = e.changedTouches[0];
        swipeEnd(tp.clientX, tp.clientY);
      }, { passive: true });
      els.deck.addEventListener("mousedown", function (e) {
        if (e.button !== 0) return;
        swipeStart(e.clientX, e.clientY, e.target);
      });
      els.deck.addEventListener("mouseup", function (e) {
        swipeEnd(e.clientX, e.clientY);
      });
    }

    // 从长安启程
    if (els.startJourney) {
      els.startJourney.addEventListener("click", function () { openStation(0); });
    }

    // 从泉州启程（海上丝路）
    if (els.startMaritime) {
      els.startMaritime.addEventListener("click", function () { openPort(0); });
    }

    // 百度地图真实路线开关
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-baidu]");
      if (!b) return;
      toggleBaidu(b.getAttribute("data-baidu"), b);
    });

    // 文物
    els.artifacts.addEventListener("click", function (e) {
      var el = e.target.closest("[data-artifact]");
      if (el) openArtifact(Number(el.getAttribute("data-artifact")));
    });

    // 陆上站点
    els.overlandNodes.addEventListener("click", function (e) {
      var el = e.target.closest("[data-station]");
      if (!el) return;
      if (el.classList.contains("locked")) { showToast(t("lockedHint")); return; }
      openStation(Number(el.getAttribute("data-station")));
    });

    // 海上港口
    els.maritimeNodes.addEventListener("click", function (e) {
      var el = e.target.closest("[data-port]");
      if (el) openPort(Number(el.getAttribute("data-port")));
    });

    // 纹样
    els.patternCards.addEventListener("click", function (e) {
      var el = e.target.closest("[data-pattern]");
      if (el) openPattern(Number(el.getAttribute("data-pattern")));
    });

    // 弹窗内交互
    els.modalBody.addEventListener("click", function (e) {
      var choice = e.target.closest("[data-choice]");
      if (choice) {
        var optIndex = Number(choice.getAttribute("data-choice"));
        var stationIndex = state.activeStation;
        if (stationIndex === null) return;
        state.choices[stationIndex] = String(optIndex);
        els.modalBody.innerHTML = renderStation(stationIndex);
        return;
      }
      var cont = e.target.closest("[data-continue]");
      if (cont) {
        completeStation(Number(cont.getAttribute("data-continue")));
        return;
      }
      var portCont = e.target.closest("[data-port-continue]");
      if (portCont) {
        completePort(Number(portCont.getAttribute("data-port-continue")));
      }
    });

    els.modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeModal();
    });

    // 键盘：Esc 关闭弹窗，左右方向键切换页面
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeModal(); return; }
      if (isModalOpen()) return;
      if (e.key === "ArrowRight") nextPage();
      else if (e.key === "ArrowLeft") prevPage();
    });

    // 重置
    els.resetJourney.addEventListener("click", function () {
      state.completed = 0;
      state.choices = {};
      state.explored = {};
      state.activeStation = null;
      renderNodes();
      showToast(t("resetToast"));
    });
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    applyI18n();
    renderTimeline();
    renderArtifacts();
    renderNodes();
    renderHeritage();
    renderDots();
    updateDots();
    updateNav();
    bindEvents();
    revealIn(els.pages[0]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();