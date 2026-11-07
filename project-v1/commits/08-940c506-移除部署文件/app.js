/* =========================================================
   范博韬 · Personal Page
   Digital twin — first-version local knowledge base
   ========================================================= */

(() => {
  "use strict";

  const GREETING =
    "你好，我是范博韬的数字分身。\n\n" +
    "想快速了解他的专业背景、能力积累、保研去向或未来方向？直接问我，或从下面的问题开始。";

  const INITIAL_PROMPTS = [
    "本科是什么专业？",
    "本科阶段积累了什么能力？",
    "未来想做什么方向？",
    "保研去了哪里？",
  ];

  const FOLLOW_UPS = {
    major: ["本科阶段积累了什么能力？", "现在在学什么？", "保研去了哪里？"],
    skills: ["现在在学什么？", "未来想做什么方向？", "你的做事风格是什么？"],
    direction: ["保研去了哪里？", "现在在学什么？", "本科是什么专业？"],
    zju: ["未来想做什么方向？", "现在在学什么？", "本科阶段积累了什么能力？"],
    current: ["未来想做什么方向？", "保研去了哪里？", "本科是什么专业？"],
    interests: ["你的做事风格是什么？", "现在在学什么？", "未来想做什么方向？"],
    trait: ["未来想做什么方向？", "本科是什么专业？", "保研去了哪里？"],
    intro: ["本科是什么专业？", "本科阶段积累了什么能力？", "未来想做什么方向？"],
    contact: ["本科是什么专业？", "未来想做什么方向？", "保研去了哪里？"],
    fallback: ["本科是什么专业？", "本科阶段积累了什么能力？", "未来想做什么方向？"],
  };

  const PROFILE_SUMMARY =
    "我是范博韬，哈尔滨工程大学（211、双一流）智能科学与工程学院自动化专业 2023 级本科生，2027.06 毕业，目前已保研至浙江大学电子信息专业。\n\n" +
    "本科加权平均分 92.2，专业排名 13/167（前 8%）；获国家励志奖学金、黑龙江省三好学生、固德威奖学金、校一等奖学金（两次）、校级优秀共青团干部。\n\n" +
    "科研方面：参与国家级创新项目“海洋探险者”长航时波浪航行器（核心成员，负责 SolidWorks 建模与 STAR-CCM+ CFD 仿真）；国家发明专利《波浪推进海洋航行器水翼转轴固定装置》第三发明人；第一作者论文《Application and Parameter Optimization of Q-Learning Algorithm in Path Planning》（ICMLM 2026 录用）。\n\n" +
    "竞赛：美赛特等奖提名 F 奖（前 2%）、全国大学生数学建模竞赛黑龙江省一等奖（前 10%）。\n\n" +
    "关注方向：控制算法、具身智能、AI Agent。联系方式：手机 17313048569，邮箱 botao_fan@163.com。";

  const KB = [
    {
      id: "english",
      test: /(英语|英文|外语|CET|四级|六级|四六级|托福|雅思)/i,
      answer:
        "英语水平：CET-4 528、CET-6 513。\n\n" +
        "平时能阅读英文文献，也在论文中做过中英文撰写与翻译。",
    },
    {
      id: "gpa",
      test: /(绩点|GPA|加权|平均分|平均|排名|成绩|分数|课程|学业)/i,
      answer:
        "本科加权平均分 92.2，专业排名 13/167，约前 8%。\n\n" +
        "主要课程分数：线性代数 98、概率论与数理统计 97、现代控制理论 95、电力电子技术 94、电路基础 94、自动控制理论 93、电子技术 A 92。",
    },
    {
      id: "honors",
      test: /(奖学金|荣誉|奖项|奖励|表彰|获奖|奖|三好|优秀|国家励志|固德威|共青团)/,
      answer:
        "本科阶段获得过国家励志奖学金、黑龙江省三好学生、固德威奖学金、校一等奖学金（两次），以及校级优秀共青团干部。\n\n" +
        "竞赛方面还有美赛特等奖提名 F 奖（前 2%）和全国大学生数学建模竞赛黑龙江省一等奖（前 10%）。",
    },
    {
      id: "competition",
      test: /(竞赛|比赛|赛事|美赛|数学建模|数模|国赛|F\s*奖|特等奖|省一|一等奖|建模比赛)/,
      answer:
        "比较有代表性的竞赛经历有两项：\n\n" +
        "• 美国大学生数学建模竞赛，特等奖提名 F 奖（前 2%），第一作者，2025.01：构建三营养级季节性循环生态动力学模型，结合 Beverton-Holt 与 Logistic 增长模型，分析化学制剂对生态稳定性的扰动，并用层次分析法评估有机农业指标。\n\n" +
        "• 全国大学生数学建模竞赛，黑龙江省一等奖（前 10%），第二作者，2024.09：用多目标优化与遗传算法建模，融合蒙特卡洛模拟与贝叶斯更新，解决次品率不确定下的抽样检测与拆解策略问题。\n\n" +
        "两项比赛中我都主要担任论文手，负责撰写、翻译、可视化和团队成果整合。",
    },
    {
      id: "patent",
      test: /(专利|发明|转轴|固定装置|陶瓷轴承|发明人)/,
      answer:
        "我参与了一项国家发明专利《波浪推进海洋航行器水翼转轴固定装置》，是第三发明人，2025.04–2025.11。\n\n" +
        "该专利针对水下牵引机转轴磨损、寿命短的问题，引入陶瓷轴承与特殊结构轴承盖套，并设计弹性水翼限位杆与滑动轨道配合，降低摩擦、吸收冲击载荷。\n\n" +
        "我主要负责舱体 SolidWorks 三维建模，主导总体视图、剖视图和爆炸图，完成零部件序号标注，并参与部分专利说明书撰写。",
    },
    {
      id: "paper",
      test: /(论文|文章|学术|ICMLM|Q[- ]?learning|路径规划|强化学习|第一作者|一作|发表|录用)/i,
      answer:
        "我目前有一篇第一作者论文《Application and Parameter Optimization of Q-Learning Algorithm in Path Planning》，已被 ICMLM 2026 录用，2026.01 至今。\n\n" +
        "研究内容是在未知环境下用马尔可夫决策过程（MDP）建模 Q-learning 路径规划，重点分析 ε-greedy 策略衰减机制和学习率 α 对收敛性的影响，在二维栅格环境中做多场景仿真，实现无先验地图下的无碰撞路径求解。我负责研究思路、实验方案、对比实验和论文撰写。",
    },
    {
      id: "research",
      test: /(科研|项目|课题|实验|航行器|波浪|CFD|仿真|SolidWorks|STAR-CCM|舱体|水翼|三维建模)/i,
      answer:
        "本科科研主要围绕长航时波浪航行器和强化学习路径规划。\n\n" +
        "在国家级创新项目“海洋探险者”长航时波浪航行器设计与制造中，我作为核心成员（2024.07–2025.07）负责舱体三维建模与数值模拟：用 SolidWorks 建模，基于 STAR-CCM+ 建立二维非定常 CFD 模型，研究设计参数对水动力性能、推进效率和能量捕获的影响，处理仿真数据并做可视化对比。\n\n" +
        "另一项是第一作者论文（ICMLM 2026 录用），研究 Q-learning 在未知环境路径规划中的参数优化。",
    },
    {
      id: "internship",
      test: /(实习|工作经历|工作经验|职场|internship)/i,
      answer:
        "我目前的经历以科研项目、论文专利和竞赛为主，这份保研简历里没有单独列出实习经历。\n\n" +
        "后续如果补充实习简历，我会再把实习内容加进来。",
    },
    {
      id: "politics",
      test: /(党员|政治面貌|政治|入党)/,
      answer: "我是中共党员。",
    },
    {
      id: "direction",
      test: /(未来|职业|就业|工作|工作方向|工作规划|想工作|想从事|想做什么|发展规划|规划|方向|目标|长期|深造|读研后)/,
      answer:
        "我未来想工作的方向，是 AI Agent、具身智能和控制算法的交叉领域。\n\n" +
        "具体来说，我希望把控制论的系统性和 AI 的学习、决策能力结合起来，让智能体在真实环境中完成感知、决策与行动的闭环。现阶段会继续补足算法与工程能力，也希望在真实项目里验证自己的理解。",
    },
    {
      id: "interests",
      test: /(兴趣|爱好|健身|旅行|业余|空闲|平时.*(喜欢|做)|放松)/,
      answer:
        "平时喜欢健身和旅行。\n\n" +
        "健身让我保持稳定的节奏和长期投入的习惯；旅行让我换个视角看问题。这两件事也在提醒我：认准目标，就认真投入、全力以赴。",
    },
    {
      id: "zju",
      test: /(保研|浙江大学|浙大|电子信息|研究生|录取|去向)/,
      answer:
        "目前已保研至浙江大学电子信息专业，本科就读于哈尔滨工程大学自动化专业。\n\n" +
        "接下来希望在电子信息与智能系统的语境里，继续深入 AI Agent、具身智能和控制算法。",
    },
    {
      id: "current",
      test: /(现在|目前|最近|正在|在做|在学|忙什么|项目|agent|智能体|具身|控制算法|学习什么|学什么)/i,
      answer:
        "最近主要在系统学习 AI Agent，同时持续关注具身智能和控制算法。\n\n" +
        "我也会通过完成已有项目来加深理解——不只停留在概念层，而是尽量把每个知识点落到可运行、可复现的结果上。",
    },
    {
      id: "skills",
      test: /(能力|知识|课程|学到|学了什么|学什么|核心|技能|工具|软件|擅长|基础|积累|掌握|会什么|会哪些|本科.*学)/,
      answer:
        "在哈尔滨工程大学自动化专业的本科阶段，我主要积累了三个层面的能力：\n\n" +
        "• 系统与控制思维：理解系统如何建模、分析和调节。\n" +
        "• 工程实现意识：把算法和想法落成可运行的项目。\n" +
        "• 持续学习能力：面对新方向，快速搭框架、补基础、做验证。\n\n" +
        "工具和方法方面，常用 SolidWorks 三维建模、STAR-CCM+ 与 CFD 数值模拟；也做过 Q-learning、MDP、强化学习、多目标优化、遗传算法、蒙特卡洛模拟、贝叶斯更新和层次分析法；具备数学建模、中英文论文写作、数据可视化和专利说明书撰写经验。",
    },
    {
      id: "major",
      test: /(专业|自动化|本科|学历|学校|学院|大几|年级|什么阶段)/,
      answer:
        "我本科就读于哈尔滨工程大学智能科学与工程学院自动化专业，2023.09–2027.06，目前是大四学生。\n\n" +
        "现在已经保研至浙江大学电子信息专业。自动化给了我控制、系统与工程实现方面的基础；接下来会在电子信息与智能系统的语境里，继续深入 AI Agent、具身智能和控制算法。",
    },
    {
      id: "trait",
      test: /(特点|性格|特质|优势|风格|全力以赴|记忆点|怎么形容|不一样)/,
      answer:
        "如果用一个词形容自己，是「全力以赴」。\n\n" +
        "面对新的方向或项目，我倾向于先把目标拆清楚，然后持续投入，直到做出可以验证的结果。这也是我正在学习 AI 与控制算法时对自己的要求。",
    },
    {
      id: "profile",
      test: /(基本信息|基本资料|个人资料|个人信息|个人情况|基本情况|概况|简介|档案|资料|信息|简历|关于他|关于你|他是谁|他的情况|你的情况|了解(他|你|一下))/,
      answer: PROFILE_SUMMARY,
    },
    {
      id: "contact",
      test: /(联系|邮箱|微信|电话|手机|怎么找|简历|resume|contact)/i,
      answer:
        "可以通过手机 17313048569 或邮箱 botao_fan@163.com 联系我。\n\n" +
        "简历文件目前没有挂在网页上；需要完整简历可以发邮件索取，我也可以先在这里回答教育背景、成绩排名、科研项目、论文专利和竞赛经历。",
    },
    {
      id: "intro",
      test: /(你是谁|叫什么|名字|介绍|自我|数字分身|范博韬|本人|主页|背景)/,
      answer:
        "你好，我是范博韬的数字分身。\n\n" +
        PROFILE_SUMMARY +
        "\n\n你可以继续问教育背景、成绩排名、科研项目、论文专利、竞赛经历、技能工具或保研去向。",
    },
  ];

  const FALLBACK =
    "这个问题我暂时没有更具体的公开信息。\n\n" +
    "先给你一个概况：\n\n" +
    PROFILE_SUMMARY +
    "\n\n你也可以具体问教育背景、成绩排名、科研项目、论文专利、竞赛经历、技能工具、保研去向或联系方式。";

  const chatLog = document.getElementById("chatLog");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatPrompts = document.getElementById("chatPrompts");
  const sendButton = chatForm.querySelector(".send-button");
  const resetButton = document.getElementById("resetChat");
  const header = document.getElementById("siteHeader");
  const sideStatusText = document.getElementById("sideStatusText");
  const sideNoteText = document.getElementById("sideNoteText");
  const chatSubtitle = document.getElementById("chatSubtitle");

  // ---------- Fixed avatar ----------

  const AVATAR_SRC = "avatar.webp";

  function paintMessageAvatar(element) {
    if (!element) return;
    element.textContent = "";
    const image = document.createElement("img");
    image.className = "msg-avatar__image";
    image.src = AVATAR_SRC;
    image.alt = "";
    element.append(image);
  }

  function initFixedAvatar() {
    document.querySelectorAll(".msg-avatar").forEach(paintMessageAvatar);
  }

  initFixedAvatar();

  if (!chatLog || !chatForm || !chatInput || !chatPrompts) return;

  const API_BASE = String(window.CHAT_API_BASE || "").replace(/\/+$/, "");
  const STATUS_ENDPOINT = `${API_BASE}/api/status`;
  const CHAT_ENDPOINT = `${API_BASE}/api/chat`;
  const LLM_TIMEOUT_MS = 30_000;
  const MAX_HISTORY_MESSAGES = 8;

  let isReplying = false;
  let messageCount = 0;
  let llmMode = "local";
  let llmModel = "";
  let llmReady = Promise.resolve();
  let conversationHistory = [];
  let conversationGeneration = 0;
  let activeRequestController = null;

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scrollToLatest() {
    requestAnimationFrame(() => {
      chatLog.scrollTo({
        top: chatLog.scrollHeight,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    });
  }

  function createAvatar() {
    const avatar = document.createElement("span");
    avatar.className = "msg-avatar";
    avatar.setAttribute("aria-hidden", "true");
    paintMessageAvatar(avatar);
    return avatar;
  }

  function createMessage(role, text) {
    messageCount += 1;

    const row = document.createElement("div");
    row.className = `message message--${role}`;

    if (role === "bot") {
      row.append(createAvatar());
    }

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;
    row.append(bubble);

    return row;
  }

  function addMessage(role, text) {
    chatLog.append(createMessage(role, text));
    scrollToLatest();
  }

  function showTyping() {
    const row = document.createElement("div");
    row.className = "message message--bot message--typing";
    row.dataset.typing = "true";
    row.setAttribute("aria-label", "数字分身正在输入");

    row.append(createAvatar());

    const bubble = document.createElement("div");
    bubble.className = "bubble typing";
    bubble.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 3; i += 1) bubble.append(document.createElement("i"));

    row.append(bubble);
    chatLog.append(row);
    scrollToLatest();
  }

  function removeTyping() {
    const typing = chatLog.querySelector("[data-typing]");
    if (typing) typing.remove();
  }

  function renderPrompts(questions) {
    const label = document.createElement("span");
    label.className = "prompt-label";
    label.textContent = "快速提问数字分身";

    const fragment = document.createDocumentFragment();
    fragment.append(label);

    [...new Set(questions)].slice(0, 4).forEach((question) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "prompt-chip";
      button.dataset.question = question;
      button.disabled = isReplying;
      button.title = "点击直接发送";
      button.setAttribute("aria-label", `发送问题：${question}`);

      const text = document.createElement("span");
      text.textContent = question;

      const arrow = document.createElement("span");
      arrow.className = "prompt-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";

      button.append(text, arrow);
      button.addEventListener("click", () => safeSubmit(question));
      fragment.append(button);
    });

    chatPrompts.replaceChildren(fragment);
  }

  function findIntent(text) {
    const normalized = text.toLowerCase().trim();

    if (/^(谢谢|感谢|多谢|thanks?|thank you)[啦呀啊!！,.，。\s]*$/i.test(normalized)) {
      return {
        id: "thanks",
        answer: "不客气。如果还想了解我的专业背景、能力积累或未来方向，继续问我就好。",
      };
    }

    if (/^(你好|您好|hi|hello|hey|在吗)[呀啊~～!！,.，。\s]*$/i.test(normalized)) {
      return {
        id: "intro",
        answer: GREETING,
      };
    }

    return KB.find((entry) => entry.test.test(normalized)) || null;
  }

  function setReplying(value) {
    isReplying = value;
    sendButton.disabled = value;
    chatLog.setAttribute("aria-busy", String(value));
    chatPrompts.classList.toggle("is-busy", value);
    chatPrompts.querySelectorAll(".prompt-chip").forEach((button) => {
      button.disabled = value;
    });
  }

  function setChatMode(mode, note) {
    llmMode = mode === "llm" ? "llm" : "local";
    const isLlm = llmMode === "llm";

    if (sideStatusText) {
      sideStatusText.textContent = isLlm
        ? "在线 · DeepSeek"
        : "本地问答 · 基于公开信息";
    }
    if (chatSubtitle) {
      chatSubtitle.textContent = isLlm
        ? "DeepSeek · 实时生成"
        : "本地知识库 · 即时回答";
    }
    if (sideNoteText) {
      sideNoteText.textContent =
        note ||
        (isLlm
          ? "回答由 DeepSeek 生成，仅依据本页公开信息。"
          : "回答由本地知识库生成，仅覆盖本页公开信息。");
    }
  }

  async function detectLlmMode() {
    if (window.location.protocol === "file:") {
      setChatMode(
        "local",
        "当前为本地预览；通过 start-server.bat 启动后可启用 DeepSeek。"
      );
      return "local";
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(STATUS_ENDPOINT, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("status_failed");
      const data = await response.json();

      if (data && data.llm) {
        llmModel = typeof data.model === "string" ? data.model : "deepseek-chat";
        setChatMode("llm");
        return "llm";
      }

      setChatMode(
        "local",
        data?.reason === "missing_api_key"
          ? "未检测到 DeepSeek Key，当前使用本地知识库。"
          : undefined
      );
      return "local";
    } catch {
      setChatMode("local");
      return "local";
    } finally {
      clearTimeout(timer);
    }
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function requestLlmAnswer() {
    const controller = new AbortController();
    activeRequestController = controller;
    const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory.slice(-MAX_HISTORY_MESSAGES),
        }),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "模型服务暂时不可用");
      }
      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("模型返回了空内容");
      }

      return data.reply.trim();
    } finally {
      clearTimeout(timer);
      if (activeRequestController === controller) {
        activeRequestController = null;
      }
    }
  }

  function focusComposer() {
    if (window.matchMedia("(pointer: fine)").matches) {
      chatInput.focus({ preventScroll: true });
    }
  }

  async function respondTo(text) {
    const intent = findIntent(text);
    const localAnswer = intent ? intent.answer : FALLBACK;
    const followUps =
      FOLLOW_UPS[intent ? intent.id : "fallback"] || FOLLOW_UPS.fallback;
    const requestGeneration = conversationGeneration;

    setReplying(true);
    showTyping();

    try {
      if (llmMode === "llm") {
        try {
          const reply = await requestLlmAnswer();
          if (requestGeneration !== conversationGeneration) return;

          removeTyping();
          addMessage("bot", reply);
          conversationHistory.push({ role: "assistant", content: reply });
          renderPrompts(followUps);
          return;
        } catch (error) {
          if (requestGeneration !== conversationGeneration) return;

          console.warn("[chat] DeepSeek request failed:", error.message);
          setChatMode("local", "模型暂时不可用，已切换到本地知识库。");
        }
      }

      const delay = 400 + Math.min(350, localAnswer.length * 0.8);
      await sleep(delay);
      if (requestGeneration !== conversationGeneration) return;

      removeTyping();
      addMessage("bot", localAnswer);
      renderPrompts(followUps);
    } finally {
      if (requestGeneration === conversationGeneration) {
        setReplying(false);
        focusComposer();
      }
    }
  }

  async function submitQuestion(rawText) {
    const text = String(rawText || "").trim();
    if (!text || isReplying) return;

    await llmReady;
    if (isReplying) return;

    addMessage("user", text);
    if (llmMode === "llm") {
      conversationHistory.push({ role: "user", content: text });
    }

    chatInput.value = "";
    resizeComposer();
    await respondTo(text);
  }

  function safeSubmit(rawText) {
    submitQuestion(rawText).catch((error) => {
      console.error("[chat]", error);
      removeTyping();
      setReplying(false);
    });
  }

  function resizeComposer() {
    chatInput.style.height = "auto";
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 112)}px`;
  }

  function startConversation() {
    conversationGeneration += 1;
    if (activeRequestController) {
      activeRequestController.abort();
      activeRequestController = null;
    }

    conversationHistory = [];
    removeTyping();
    setReplying(false);
    messageCount = 0;
    chatLog.replaceChildren();
    addMessage("bot", GREETING);
    renderPrompts(INITIAL_PROMPTS);
  }

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    safeSubmit(chatInput.value);
  });

  chatInput.addEventListener("input", resizeComposer);

  chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      safeSubmit(chatInput.value);
    }
  });

  resetButton.addEventListener("click", () => {
    startConversation();
    resizeComposer();
    focusComposer();
  });

  // Header elevation on scroll
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Reveal sections on scroll
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion()) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px" }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  startConversation();
  resizeComposer();
  llmReady = detectLlmMode();
})();
