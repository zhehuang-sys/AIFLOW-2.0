# AIFlow Backend Logic & Signal Scanning Guide / 后端逻辑与信号扫描指南

This document outlines the theoretical backend architecture required to power the frontend "AI Agent Scout" features, including signal prioritization, matching algorithms, and scanning methodologies.

本文档概述了支持前端“AI Agent Scout”功能所需的理论后端架构，包括信号优先级、匹配算法和扫描方法。

---

## English Documentation

### 1. Signal Prioritization & Scanning Strategies

The system relies on aggregating data from multiple sources to build a "Rich Prospect Profile". Backup scanning method always consider Google Site: Command

| Signal Type | Where to Scan (Data Sources) | Extraction Method |
| :--- | :--- | :--- |
| **Hiring Trends** | Company Careers Page (`/jobs`, `/careers`), LinkedIn Jobs API, Greenhouse/Lever API. | Scrape job titles. Analyze keywords (e.g., "React", "Enterprise Sales"). Calculate hiring velocity (jobs posted last 30 days). |
| **Tech Stack** | HTTP Headers, Source Code, BuiltWith API, Wappalyzer. | Detect specific JS libraries, Analytics tags, CRM pixels, or Commerce platforms (Shopify, Magento). |
| **Funding News** | Crunchbase, Pitchbook, Google News API, PR Newswire. | NLP Entity Extraction on recent news articles to identify "Series A", "Raise", "$50M". |
| **Social Activity** | LinkedIn Activity Tab, X (Twitter) User Timeline. | **Sentiment Analysis:** Is the user complaining? **Topic Modeling:** Are they talking about "AI"? **Engagement:** Did they like a competitor's post? |
| **GitHub Activity** | GitHub API (User Events). | Commit frequency, languages used in repositories, "Star" activity on specific repos. |

### 2. Matching Modes Logic

The "Matching Mode" determines the threshold for similarity between the User's ICP Description and the Found Prospect.

#### A. Focus Mode (Strict)
*   **Logic:** Boolean AND + High Vector Similarity.
*   **Threshold:** Cosine Similarity > 0.85.
*   **Behavior:** Must match *all* critical keywords (e.g., must be "VP" level, must use "Shopify").
*   **Use Case:** ABM Campaigns, High-Ticket Sales.

#### B. Scale Mode (Balanced)
*   **Logic:** Boolean OR + Medium Vector Similarity.
*   **Threshold:** Cosine Similarity > 0.70.
*   **Behavior:** Matches *most* criteria. If "VP" is requested, "Director" might be accepted if other signals are strong.
*   **Use Case:** General Cold Outreach.

#### C. Max Scale Mode (Broad)
*   **Logic:** Lookalike Modeling / Nearest Neighbors.
*   **Threshold:** Cosine Similarity > 0.55.
*   **Behavior:** Finds prospects "semantically similar" to your seed list, even if titles or industries differ slightly.
*   **Use Case:** Brand Awareness, Top of Funnel.

### 3. Backend Architecture (Conceptual)

1.  **Input Queue:** User submits ICP text + URL.
2.  **Orchestrator:**
    *   **Planner Agent (LLM):** Breaks down the ICP into search queries (e.g., "SaaS companies in Fintech hiring Sales VPs").
3.  **Scraper Workers:**
    *   **Google Search Scraper:** Executes queries to find company domains.
    *   **Deep Scraper:** Visits identified domains to extract signals (Tech stack, Careers).
4.  **Enrichment Service:** Matches domains to People Data (using providers like Apollo, PeopleDataLabs, or LinkedIn scraping).
5.  **Scoring Engine:**
    *   Embeds the User's ICP text into a Vector (e.g., OpenAI `text-embedding-3-small`).
    *   Embeds the Prospect's Profile (Title + Bio + Company Desc).
    *   Calculates Cosine Similarity.
6.  **Ranking:** Sorts results based on the selected **Signal Priority** (e.g., if "Hiring" is prioritized, boost scores for companies with >5 open roles).

---

## 中文文档 (Chinese Documentation)

### 1. 信号优先级与扫描策略

系统依赖于聚合多源数据来构建“丰富潜在客户画像”。

| 信号类型 | 扫描位置 (数据源) | 提取方法 |
| :--- | :--- | :--- |
| **招聘趋势 (Hiring)** | 公司招聘页面 (`/jobs`), LinkedIn Jobs, ATS系统 (Greenhouse/Lever)。 | 爬取职位名称。分析关键词（如 "React", "B2B Sales"）。计算招聘速度（过去30天发布的职位数）。 |
| **技术栈 (Tech Stack)** | HTTP Header, 网页源代码, BuiltWith API, Wappalyzer。 | 检测特定的JS库、分析代码、CRM像素点或电商平台指纹（Shopify, Magento）。 |
| **融资新闻 (Funding)** | Crunchbase, 36Kr, Google News, PR Newswire。 | 对近期新闻进行 NLP 实体提取，识别 "A轮", "融资", "5000万" 等关键词。 |
| **社交活跃度 (Social)** | LinkedIn 动态栏, X (Twitter) 时间线。 | **情感分析：** 用户是在抱怨痛点吗？ **主题建模：** 他们在讨论 "AI" 吗？ **互动：** 他们是否点赞了竞品的帖子？ |
| **GitHub 活跃度** | GitHub API (User Events)。 | 代码提交频率、仓库使用的编程语言、对特定仓库的 Star 操作。 |

### 2. 匹配模式逻辑 (Matching Modes)

“匹配模式”决定了用户输入的 ICP 描述与发现的潜在客户之间的相似度阈值。

#### A. 聚焦模式 (Focus - 严格)
*   **逻辑：** 布尔 AND 运算 + 高向量相似度。
*   **阈值：** 余弦相似度 > 0.85。
*   **行为：** 必须匹配 *所有* 关键条件（例如：必须是 "副总裁" 级别，必须使用 "Shopify"）。
*   **场景：** ABM 营销，高客单价销售。

#### B. 扩展模式 (Scale - 平衡)
*   **逻辑：** 布尔 OR 运算 + 中等向量相似度。
*   **阈值：** 余弦相似度 > 0.70。
*   **行为：** 匹配 *大部分* 条件。如果要求 "副总裁"，但其他信号很强，"总监" 级别也会被接受。
*   **场景：** 通用冷外联 (Cold Outreach)。

#### C. 最大扩展模式 (Max Scale - 广泛)
*   **逻辑：** 相似受众建模 (Lookalike) / 最近邻搜索。
*   **阈值：** 余弦相似度 > 0.55。
*   **行为：** 寻找与种子列表“语义相似”的潜在客户，即使职位或行业略有不同。
*   **场景：** 品牌知名度推广，漏斗顶部获客。

### 3. 后端架构 (概念性)

1.  **输入队列：** 用户提交 ICP 文本 + 网站 URL。
2.  **编排器 (Orchestrator)：**
    *   **规划 Agent (LLM)：** 将 ICP 分解为搜索查询（例如：“正在招聘销售副总裁的金融科技 SaaS 公司”）。
3.  **爬虫 Worker：**
    *   **Google 搜索爬虫：** 执行查询以查找公司域名。
    *   **深度爬虫：** 访问识别出的域名以提取信号（技术栈，招聘页面）。
4.  **丰富服务 (Enrichment)：** 将域名与人员数据匹配（使用 Apollo, PeopleDataLabs 或 LinkedIn 数据源）。
5.  **评分引擎：**
    *   将用户的 ICP 文本嵌入为向量 (Vector)。
    *   将潜在客户的资料（职位 + 简介 + 公司描述）嵌入为向量。
    *   计算余弦相似度。
6.  **排名 (Ranking)：** 根据选定的 **信号优先级** 对结果进行排序（例如：如果优先考虑“招聘趋势”，则提高拥有 >5 个开放职位的公司的分数）。