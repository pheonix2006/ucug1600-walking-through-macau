const raw = String.raw;

const C = {
  ink: "#1D2433",
  muted: "#566276",
  paper: "#F7F2EA",
  paper2: "#F1E8DA",
  border: "#D8CAB6",
  red: "#A23B3B",
  teal: "#1C7773",
  gold: "#C38A2E",
  green: "#587A46",
  blue: "#315F93",
  dark: "#151A22",
  white: "#FFFFFF",
  translucent: "#151A22AA",
  softWhite: "#FFFFFFD9",
  blackFade: "#00000080",
};

const IMG = {
  borderHall: raw`E:\Project\1600\slide\assets\selected_frames\border_hall.jpg`,
  borderQueue: raw`E:\Project\1600\slide\assets\selected_frames\border_queue.jpg`,
  portBus: raw`E:\Project\1600\slide\assets\selected_frames\port_bus_transfer.jpg`,
  busWindow: raw`E:\Project\1600\slide\assets\selected_frames\bus_window.jpg`,
  parisRoad: raw`E:\Project\1600\slide\assets\selected_frames\cotai_skyline.jpg`,
  streetFood: raw`E:\Project\1600\slide\assets\selected_frames\street_food_signs.jpg`,
  streetSigns: raw`E:\Project\1600\slide\assets\selected_frames\street_dense_signs.jpg`,
  roadToRuins: raw`E:\Project\1600\slide\assets\selected_frames\street_to_ruins.jpg`,
  ruins: raw`E:\Project\1600\slide\assets\selected_frames\ruins_clean_facade.jpg`,
  ruinsDetail: raw`E:\Project\1600\slide\assets\selected_frames\ruins_detail.jpg`,
  ruinsSquare: raw`E:\Project\1600\slide\assets\selected_frames\ruins_public_square.jpg`,
  crypt: raw`E:\Project\1600\slide\assets\selected_frames\crypt_sign.jpg`,
  fortView: raw`E:\Project\1600\slide\assets\selected_frames\fort_path_city.jpg`,
  fortGate: raw`E:\Project\1600\slide\assets\selected_frames\fort_gate_stone_path.jpg`,
  fortPath: raw`E:\Project\1600\slide\assets\selected_frames\fort_path_city.jpg`,
  busInterior: raw`E:\Project\1600\slide\assets\selected_frames\transit_bus.jpg`,
  venetianExterior: raw`E:\Project\1600\slide\assets\selected_frames\venetian_exterior.jpg`,
  venetianDome: raw`E:\Project\1600\slide\assets\selected_frames\venetian_dome.jpg`,
  venetianCanal: raw`E:\Project\1600\slide\assets\selected_frames\venetian_canal.jpg`,
  venetianShop: raw`E:\Project\1600\slide\assets\selected_frames\venetian_facade_clock.jpg`,
  venetianCorridor: raw`E:\Project\1600\slide\assets\selected_frames\venetian_corridor.jpg`,
  nbaStore: raw`E:\Project\1600\slide\assets\selected_frames\nba_merch_wall.jpg`,
  nbaCollectibles: raw`E:\Project\1600\slide\assets\selected_frames\nba_collectibles.jpg`,
  nbaGame: raw`E:\Project\1600\slide\assets\selected_frames\nba_court_space.jpg`,
  nbaScore: raw`E:\Project\1600\slide\assets\selected_frames\nba_score_feedback.jpg`,
};

const montagePath = raw`E:\Project\1600\slide\assets\opening_montage.mp4`;

function bg(ctx, slide, fill = C.paper) {
  ctx.addShape(slide, { x: 0, y: 0, width: ctx.W, height: ctx.H, fill });
}

function rect(ctx, slide, x, y, width, height, fill, line = C.border) {
  return ctx.addShape(slide, {
    x, y, width, height,
    fill,
    line: { style: "solid", fill: line, width: line === "none" ? 0 : 1 },
  });
}

function text(ctx, slide, value, x, y, width, height, opts = {}) {
  return ctx.addText(slide, {
    text: value,
    x, y, width, height,
    fontSize: opts.size ?? 28,
    color: opts.color ?? C.ink,
    bold: opts.bold ?? false,
    typeface: opts.face ?? "Microsoft YaHei",
    align: opts.align ?? "left",
    valign: opts.valign ?? "top",
    fill: opts.fill ?? "#00000000",
    line: { style: "solid", fill: "#00000000", width: 0 },
    insets: opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

function title(ctx, slide, kicker, value, sub) {
  text(ctx, slide, kicker, 58, 36, 640, 24, { size: 16, color: C.red, bold: true });
  text(ctx, slide, value, 56, 66, 820, 72, { size: 34, color: C.ink, bold: true, face: "Microsoft YaHei UI" });
  if (sub) text(ctx, slide, sub, 58, 137, 900, 36, { size: 16, color: C.muted });
}

function footer(ctx, slide, n) {
  text(ctx, slide, "UCUG1600 Intercultural Communication | Fieldwork in Macau", 58, 684, 760, 22, { size: 11, color: "#748094" });
  text(ctx, slide, String(n).padStart(2, "0"), 1180, 682, 45, 22, { size: 12, color: "#748094", align: "right" });
}

async function image(ctx, slide, path, x, y, width, height, fit = "cover") {
  await ctx.addImage(slide, { path, x, y, width, height, fit, alt: path });
}

async function photoPanel(ctx, slide, path, x, y, width, height, label, fit = "cover") {
  rect(ctx, slide, x - 4, y - 4, width + 8, height + 8, C.white, "none");
  await image(ctx, slide, path, x, y, width, height, fit);
  if (label) {
    rect(ctx, slide, x, y + height - 38, width, 38, "#111827CC", "none");
    text(ctx, slide, label, x + 14, y + height - 30, width - 28, 20, { size: 12, color: C.white });
  }
}

function bullet(ctx, slide, items, x, y, width, size = 19, gap = 40) {
  items.forEach((item, i) => {
    rect(ctx, slide, x, y + i * gap + 6, 8, 8, item.color ?? C.red, "none");
    text(ctx, slide, item.text ?? item, x + 22, y + i * gap, width - 22, 28, { size, color: item.muted ? C.muted : C.ink, bold: item.bold ?? false });
  });
}

function callout(ctx, slide, value, x, y, width, height, fill = C.softWhite, color = C.ink) {
  rect(ctx, slide, x, y, width, height, fill, "none");
  text(ctx, slide, value, x + 18, y + 16, width - 36, height - 24, { size: 18, color, bold: true, valign: "middle" });
}

function chip(ctx, slide, value, x, y, width, fill = C.red) {
  rect(ctx, slide, x, y, width, 30, fill, "none");
  text(ctx, slide, value, x + 12, y + 6, width - 24, 16, { size: 11, color: C.white, bold: true, align: "center" });
}

async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.dark);
  await image(ctx, slide, IMG.ruins, 0, 0, 640, 720);
  await image(ctx, slide, IMG.venetianDome, 640, 0, 640, 720);
  rect(ctx, slide, 0, 0, 1280, 720, "#10141CCC", "none");
  text(ctx, slide, "Walking Through\nMany Macaus", 74, 112, 780, 180, { size: 56, color: C.white, bold: true, face: "Aptos Display" });
  text(ctx, slide, "How Urban Spaces Translate Cultural Identity", 78, 315, 690, 38, { size: 24, color: "#F2D7A0" });
  text(ctx, slide, "穿行于多个澳门：城市空间如何翻译文化身份", 78, 368, 760, 34, { size: 22, color: C.white, bold: true });
  rect(ctx, slide, 78, 450, 520, 2, "#F2D7A0", "none");
  text(ctx, slide, "UCUG1600 Final Presentation", 80, 472, 520, 24, { size: 15, color: "#D5DCE8" });
  return slide;
}

async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.paper);
  title(ctx, slide, "OPENING", "One route, many cultural identities", "开场先让观众跟着路线移动，而不是先听概念。");
  const imgs = [IMG.borderHall, IMG.portBus, IMG.roadToRuins, IMG.fortGate, IMG.venetianCanal, IMG.nbaScore];
  for (let i = 0; i < imgs.length; i++) {
    const x = 58 + (i % 3) * 390;
    const y = 190 + Math.floor(i / 3) * 190;
    await photoPanel(ctx, slide, imgs[i], x, y, 350, 160, ["Border", "Transfer", "Street", "Fort", "Venetian", "NBA screen"][i]);
  }
  callout(ctx, slide, `播放视频：${montagePath}`, 640, 610, 560, 50, "#1D2433", C.white);
  footer(ctx, slide, 2);
  return slide;
}

async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.paper);
  title(ctx, slide, "RESEARCH TURN", "AI gave us an entry point, not the final answer", "AI 是头脑风暴工具；fieldwork 负责修正问题。");
  rect(ctx, slide, 80, 210, 300, 280, C.white, C.border);
  text(ctx, slide, "Before fieldwork", 105, 238, 250, 30, { size: 24, bold: true });
  bullet(ctx, slide, [
    "Bilingual street names\n双名街道",
    "Soundscape map\n声音地图",
  ], 112, 300, 235, 19, 78);
  rect(ctx, slide, 467, 315, 70, 10, C.gold, "none");
  text(ctx, slide, "critical revision", 425, 340, 150, 20, { size: 12, color: C.muted, align: "center" });
  rect(ctx, slide, 620, 190, 500, 320, C.dark, "none");
  text(ctx, slide, "After fieldwork", 650, 222, 360, 32, { size: 24, bold: true, color: C.white });
  text(ctx, slide, "The route itself became the framework.", 650, 284, 390, 42, { size: 25, bold: true, color: "#F2D7A0" });
  text(ctx, slide, "Instead of forcing the data into AI-generated topics, we asked how different urban spaces translate Macau's cultural identity.", 650, 360, 400, 88, { size: 18, color: "#E8EDF5" });
  footer(ctx, slide, 3);
  return slide;
}

async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.paper);
  title(ctx, slide, "METHOD", "How do spaces communicate culture?", "研究问题与方法：直接观察、影像记录、路线分析、感官观察。");
  callout(ctx, slide, "How do Macau's urban spaces communicate multiple cultural identities through language, architecture, sound, consumer symbols, and movement?", 80, 190, 1120, 92, C.dark, C.white);
  const methods = [
    ["Direct observation", "直接观察"],
    ["Photo / video documentation", "照片与视频记录"],
    ["Walking route analysis", "路线分析"],
    ["Sensory notes", "声音与氛围观察"],
  ];
  methods.forEach((m, i) => {
    const x = 90 + i * 285;
    rect(ctx, slide, x, 335, 245, 140, C.white, C.border);
    text(ctx, slide, m[0], x + 22, 370, 200, 32, { size: 20, bold: true, align: "center" });
    text(ctx, slide, m[1], x + 22, 414, 200, 28, { size: 17, color: C.muted, align: "center" });
  });
  text(ctx, slide, "No formal interviews: our claims focus on observable public-space symbols, not personal opinions.", 120, 535, 1040, 28, { size: 18, color: C.red, bold: true, align: "center" });
  footer(ctx, slide, 4);
  return slide;
}

async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.paper);
  title(ctx, slide, "ROUTE", "Our route became our framework", "每次地点转换，都是文化解释框架的转换。");
  const stops = [
    ["Border", "口岸"],
    ["Coach / Hotel", "大巴与酒店"],
    ["Streets", "大三巴周边"],
    ["Heritage", "大三巴 / 大炮台"],
    ["Transit", "公交转场"],
    ["Spectacle", "威尼斯人 / NBA"],
  ];
  stops.forEach((s, i) => {
    const x = 85 + i * 190;
    rect(ctx, slide, x, 300, 116, 116, i % 2 === 0 ? C.white : C.paper2, C.border);
    text(ctx, slide, String(i + 1), x + 42, 314, 32, 28, { size: 20, bold: true, color: C.red, align: "center" });
    text(ctx, slide, s[0], x + 8, 346, 100, 32, { size: 14, bold: true, align: "center", valign: "middle" });
    text(ctx, slide, s[1], x + 8, 390, 100, 18, { size: 11, color: C.muted, align: "center" });
    if (i < stops.length - 1) rect(ctx, slide, x + 116, 353, 74, 6, C.gold, "none");
  });
  callout(ctx, slide, "Route is not background information. It is the analytical structure.", 240, 505, 800, 58, C.dark, C.white);
  footer(ctx, slide, 5);
  return slide;
}

async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.paper);
  title(ctx, slide, "MACAU AS BORDER", "Entering another cultural order", "进入澳门首先是一种边境与秩序的体验。");
  await photoPanel(ctx, slide, IMG.borderHall, 58, 190, 650, 420, "Port / wayfinding / crossing");
  rect(ctx, slide, 760, 205, 390, 250, C.white, C.border);
  text(ctx, slide, "Claim", 790, 232, 100, 26, { size: 18, color: C.red, bold: true });
  text(ctx, slide, "Before seeing landmarks, we experienced queues, signs, checkpoints, buses, and spatial order.", 790, 275, 310, 110, { size: 24, bold: true });
  chip(ctx, slide, "Self / Other", 790, 500, 130, C.teal);
  chip(ctx, slide, "Non-verbal order", 938, 500, 160, C.red);
  footer(ctx, slide, 6);
  return slide;
}

async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.paper);
  title(ctx, slide, "MOVEMENT", "Movement changed what we could see", "观察不是静止发生的，而是在车窗、公交与步行中发生。");
  await photoPanel(ctx, slide, IMG.busWindow, 58, 190, 350, 330, "coach window");
  await photoPanel(ctx, slide, IMG.parisRoad, 465, 190, 350, 330, "Cotai skyline");
  await photoPanel(ctx, slide, IMG.busInterior, 872, 190, 350, 330, "public transit");
  callout(ctx, slide, "Intercultural communication happened not only inside places, but also between places.", 180, 565, 920, 58, C.dark, C.white);
  footer(ctx, slide, 7);
  return slide;
}

async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.dark);
  await image(ctx, slide, IMG.ruins, 0, 0, 760, 720);
  rect(ctx, slide, 0, 0, 760, 720, "#00000055", "none");
  text(ctx, slide, "Macau as Heritage", 820, 88, 340, 40, { size: 26, color: "#F2D7A0", bold: true });
  text(ctx, slide, "Heritage is not silent;\nit tells a story.", 820, 145, 360, 105, { size: 35, color: C.white, bold: true });
  text(ctx, slide, "The Ruins of St. Paul's presents Macau through Catholic memory, Portuguese colonial history, and world heritage.", 822, 300, 350, 105, { size: 19, color: "#E8EDF5" });
  text(ctx, slide, "Crowds and tourist photography also turn heritage into a contemporary tourism narrative.", 822, 438, 350, 86, { size: 19, color: "#E8EDF5" });
  footer(ctx, slide, 8);
  return slide;
}

async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.paper);
  title(ctx, slide, "HERITAGE DEPTH", "From sacred memory to city view", "同一组遗产空间把宗教记忆、历史遗址与现代城市放在同一画面。");
  await photoPanel(ctx, slide, IMG.crypt, 70, 205, 340, 300, "sacred memory");
  await photoPanel(ctx, slide, IMG.ruinsDetail, 470, 205, 340, 300, "stone / facade / visitors");
  await photoPanel(ctx, slide, IMG.fortGate, 870, 205, 340, 300, "fort gate / stone path");
  callout(ctx, slide, "Standing inside a historical site, we look at the modern city: history and modernity appear in the same frame.", 175, 555, 930, 58, C.dark, C.white);
  footer(ctx, slide, 9);
  return slide;
}

async function slide10(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.paper);
  title(ctx, slide, "EVERYDAY STREET", "Culture also happens in ordinary streets", "街道、招牌、小吃、人流和餐饮空间共同构成日常澳门。");
  await photoPanel(ctx, slide, IMG.streetSigns, 58, 190, 530, 380, "dense signs / crowd");
  await photoPanel(ctx, slide, IMG.roadToRuins, 625, 190, 260, 180, "street to landmark");
  await photoPanel(ctx, slide, IMG.streetFood, 915, 190, 260, 180, "food street");
  rect(ctx, slide, 625, 415, 550, 126, C.white, C.border);
  text(ctx, slide, "AI reminded us to notice street names. Fieldwork showed that linguistic landscape also appears in shop signs, menus, displays, crowds, and movement.", 650, 445, 500, 62, { size: 20, bold: true });
  footer(ctx, slide, 10);
  return slide;
}

async function slide11(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.paper);
  title(ctx, slide, "SENSORY LAYER", "Sound helped us distinguish spaces", "声音不是独立声景研究，而是辅助理解空间差异的非语言层。");
  const rows = [
    ["Border", "broadcasts / footsteps / queues", C.teal],
    ["Historic street", "crowds / shop calls / visitor languages", C.gold],
    ["Heritage site", "photo sounds / guide voices / open-space echo", C.green],
    ["Venetian & NBA", "indoor music / screens / game sounds", C.red],
  ];
  rows.forEach((r, i) => {
    const y = 205 + i * 92;
    rect(ctx, slide, 110, y, 230, 58, r[2], "none");
    text(ctx, slide, r[0], 132, y + 17, 185, 20, { size: 20, color: C.white, bold: true });
    rect(ctx, slide, 358, y, 790, 58, C.white, C.border);
    text(ctx, slide, r[1], 385, y + 17, 720, 20, { size: 20, color: C.ink });
  });
  callout(ctx, slide, "We treat sound as a sensory layer, not as a full systematic audio study.", 240, 600, 800, 52, C.dark, C.white);
  footer(ctx, slide, 11);
  return slide;
}

async function slide12(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.dark);
  await image(ctx, slide, IMG.venetianDome, 0, 0, 1280, 720);
  rect(ctx, slide, 0, 0, 1280, 720, "#00000080", "none");
  text(ctx, slide, "Macau as Global Spectacle", 72, 72, 520, 32, { size: 24, color: "#F2D7A0", bold: true });
  text(ctx, slide, "A designed Europe\ninside Macau", 72, 125, 570, 105, { size: 44, color: C.white, bold: true });
  text(ctx, slide, "The Venetian creates a global consumption experience through European facades, domes, canals, lighting, and shopping routes.", 75, 280, 530, 78, { size: 22, color: "#E8EDF5" });
  rect(ctx, slide, 720, 118, 420, 210, "#FFFFFFD9", "none");
  text(ctx, slide, "Contrast", 750, 145, 130, 24, { size: 17, color: C.red, bold: true });
  text(ctx, slide, "St. Paul's is inherited heritage.\nThe Venetian is designed heritage-like spectacle.", 750, 190, 350, 66, { size: 21, color: C.ink, bold: true });
  footer(ctx, slide, 12);
  return slide;
}

async function slide13(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.paper);
  title(ctx, slide, "GLOBAL POPULAR CULTURE", "Global culture becomes interactive", "NBA 店说明跨文化交流也发生在全球品牌、商品和身体参与中。");
  await photoPanel(ctx, slide, IMG.nbaStore, 58, 190, 270, 320, "team merchandise");
  await photoPanel(ctx, slide, IMG.nbaCollectibles, 355, 190, 270, 320, "collectible figures");
  await photoPanel(ctx, slide, IMG.nbaGame, 652, 190, 270, 320, "interactive court");
  await photoPanel(ctx, slide, IMG.nbaScore, 949, 190, 270, 320, "score feedback");
  callout(ctx, slide, "American sports culture is commodified, gamified, and experienced through screens, products, and physical participation.", 170, 575, 940, 58, C.dark, C.white);
  footer(ctx, slide, 13);
  return slide;
}

async function slide14(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.paper);
  title(ctx, slide, "SYNTHESIS", "Four spaces, four translations of Macau", "这些不是分散景点，而是四种翻译澳门的方式。");
  const cols = [
    ["Border", "regulated crossing space", "Self / Other\nnon-verbal order", C.teal],
    ["Heritage", "religious and colonial memory", "cultural memory\nstorytelling", C.green],
    ["Everyday Street", "lived commercial street", "linguistic landscape\nsensory observation", C.gold],
    ["Global Spectacle", "consumption and popular culture", "globalization\ncultural performance", C.red],
  ];
  cols.forEach((col, i) => {
    const x = 70 + i * 300;
    rect(ctx, slide, x, 205, 260, 330, C.white, C.border);
    rect(ctx, slide, x, 205, 260, 54, col[3], "none");
    text(ctx, slide, col[0], x + 14, 222, 232, 22, { size: 20, color: C.white, bold: true, align: "center" });
    text(ctx, slide, "Macau as...", x + 22, 292, 210, 20, { size: 14, color: C.muted, align: "center" });
    text(ctx, slide, col[1], x + 22, 325, 216, 66, { size: 22, color: C.ink, bold: true, align: "center", valign: "middle" });
    text(ctx, slide, col[2], x + 22, 430, 216, 56, { size: 16, color: C.muted, align: "center" });
  });
  callout(ctx, slide, "Intercultural communication is spatial switching: moving through different systems of meaning.", 220, 575, 840, 66, C.dark, C.white);
  footer(ctx, slide, 14);
  return slide;
}

async function slide15(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(ctx, slide, C.dark);
  await image(ctx, slide, IMG.fortView, 0, 0, 1280, 720);
  rect(ctx, slide, 0, 0, 1280, 720, "#000000A6", "none");
  text(ctx, slide, "Conclusion", 78, 75, 300, 32, { size: 24, color: "#F2D7A0", bold: true });
  text(ctx, slide, "Macau is not one story\ntranslated into two languages.", 78, 135, 850, 105, { size: 41, color: C.white, bold: true });
  text(ctx, slide, "It is many cultural stories experienced through movement.", 78, 280, 770, 50, { size: 30, color: "#F2D7A0", bold: true });
  text(ctx, slide, "The value of our fieldwork was not proving the AI-generated topic, but revising it through what we actually saw, heard, and recorded.", 80, 395, 760, 78, { size: 22, color: "#E8EDF5" });
  text(ctx, slide, "澳门不是一个故事被翻译成两种语言，而是多个文化故事在人的移动中被不断体验。", 80, 530, 850, 34, { size: 21, color: C.white, bold: true });
  return slide;
}

const slides = [
  slide01, slide02, slide03, slide04, slide05,
  slide06, slide07, slide08, slide09, slide10,
  slide11, slide12, slide13, slide14, slide15,
];

export async function renderSlide(index, presentation, ctx) {
  return slides[index - 1](presentation, ctx);
}
