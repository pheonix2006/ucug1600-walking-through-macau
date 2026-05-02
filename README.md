# 穿行于多个澳门：城市空间如何翻译文化身份

> *Walking Through Many Macaus: How Urban Spaces Translate Cultural Identity*

HKUST(GZ) UCUG1600 跨文化交流课程 — 澳门实地考察项目。通过照片、视频和步行观察，探讨澳门城市空间如何通过语言、建筑、声音、消费符号和移动路线呈现多重文化身份。

---

## 项目结构

```
├── data/                          # 原始实地拍摄视频（约 1.5GB，需单独下载，见下方说明）
│   ├── 01_入境口岸与接驳大巴/
│   ├── 02_酒店娱乐场与路氹车窗/
│   ├── 03_大三巴周边街道与用餐/
│   ├── 04_大三巴牌坊圣物宝库大炮台/
│   ├── 05_公交地铁与返程交通/
│   ├── 06_威尼斯人商场酒店/
│   └── 07_澳门官方NBA店/
│
├── field_trip_analysis/           # 视频素材整理与分析
│   ├── classification.md          # 69 条视频的分类报告（按地点、内容、置信度标注）
│   ├── manifest.json / .csv       # 视频文件清单索引
│   ├── frames/                    # 每条视频抽取的关键帧截图（每条 3 帧）
│   ├── sheets/                    # 视频封面与帧预览拼图
│   ├── review_sheets_20260502/    # 分批审查用的大幅预览图
│   ├── scripts/                   # 素材处理脚本（如 raw 视频替换）
│   └── backups/                   # 历史版本备份
│
├── report/                        # 最终研究报告
│   ├── main.tex                   # LaTeX 源文件
│   ├── main.pdf                   # 编译后的 PDF
│   ├── Walking_Through_Many_Macaus_Report.tex / .pdf  # 另一版本
│   ├── figures/                   # 报告插图（7 张，对应 7 个地点）
│   └── preview/                   # 报告页面预览图
│
├── slide/                         # 课堂展示 PPT 及配套材料
│   ├── Walking_Through_Many_Macaus.pptx   # 最终 15 页展示文稿
│   ├── speaker_script_zh_en.md    # 逐页中英对照演讲稿与 Q&A 准备
│   ├── outline.md                 # 展示结构大纲
│   ├── script.md                  # 演讲脚本
│   ├── assets/
│   │   ├── opening_montage.mp4    # 开场 montage 视频
│   │   └── selected_frames/       # PPT 使用的高清精选帧（26 张）
│   ├── deck_build/                # PPT 程序化构建配置（layout JSON + slides 模板）
│   └── README.md                  # 展示使用说明
│
├── notes/                         # 项目讨论与决策记录
│   ├── project_decisions.md       # 已确认 / 待确认的项目决策
│   ├── report_structure.md        # 报告章节结构草案
│   ├── presentation_page_structure.md  # PPT 页面规划
│   ├── presentation_speaker_notes.md   # 演讲备注
│   ├── high_score_framework.md    # 评分标准分析
│   └── material_evidence_map.md   # 素材—论点对应关系
│
├── syllabus.md                    # 课程大纲
├── Fieldwork Tutorial.pptx        # 实地考察教程（课程提供）
└── .gitignore
```

---

## 下载原始视频

原始视频文件（约 1.5GB）因体积过大未纳入 Git 仓库，通过 GitHub Releases 分发：

1. 前往 [Releases 页面](https://github.com/pheonix2006/ucug1600-walking-through-macau/releases/tag/v1.0) 下载 `1600视频压缩包.zip`
2. 解压后将文件夹放入项目根目录，确保目录结构与上方一致：

```
项目根目录/
├── data/          ← 解压到这里
│   ├── 01_入境口岸与接驳大巴/
│   ├── ...
```

---

## 核心论点

我们原本以为澳门的跨文化交流主要体现在中葡双语路牌和声音景观中；但实地调查后发现，更重要的模式是**空间切换**：从口岸、酒店娱乐场、历史城区、大三巴，到威尼斯人和 NBA 店，每个空间都把澳门翻译成一种不同的文化身份。

---

## License

本项目仅供学术交流使用，视频素材涉及同行同学肖像，请勿二次传播。
