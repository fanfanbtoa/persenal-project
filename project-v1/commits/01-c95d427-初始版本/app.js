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

  const KB = [
    {
      id: "direction",
      test: /(未来|职业|就业|工作方向|工作规划|想工作|想从事|想做什么|发展规划|规划|方向|目标|长期|深造|读研后)/,
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
      test: /(能力|知识|课程|学到|学了什么|学什么|核心|技能|擅长|基础|积累|掌握|本科.*学)/,
      answer:
        "在哈尔滨工程大学自动化专业的本科阶段，我主要积累了三个层面的能力：\n\n" +
        "• 系统与控制思维：理解系统如何建模、分析和调节。\n" +
        "• 工程实现意识：把算法和想法落成可运行的项目。\n" +
        "• 持续学习能力：面对新方向，快速搭框架、补基础、做验证。\n\n" +
        "最近在系统学习 AI Agent，也在完成已有项目，让理解不只停留在概念层。",
    },
    {
      id: "major",
      test: /(专业|自动化|本科|学历|学校|大几|年级|什么阶段)/,
      answer:
        "我本科就读于哈尔滨工程大学自动化专业，目前是大四学生。\n\n" +
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
      id: "contact",
      test: /(联系|邮箱|微信|电话|简历|resume|contact)/i,
      answer:
        "这一版主页暂未公开联系方式和简历文件。\n\n" +
        "如果你是在招聘场景看到这里，可以先通过范博韬已有的沟通渠道联系他；数字分身也可以继续帮你了解他的背景与方向。",
    },
    {
      id: "intro",
      test: /(你是谁|叫什么|名字|介绍|自我|数字分身|范博韬|本人|主页|背景)/,
      answer:
        "你好，我是范博韬的数字分身。\n\n" +
        "我了解他在哈尔滨工程大学自动化专业的本科背景、能力积累、保研去向，以及他正在学习和未来想深耕的方向。你可以直接提问，也可以点下面的快速提问。",
    },
  ];

  const FALLBACK =
    "这个问题暂时不在我的知识库里。\n\n" +
    "我现在可以回答：本科专业、能力积累、保研去向、当前学习重点、未来方向和兴趣爱好。你可以换个角度问我。";

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

  // ---------- Local avatar upload ----------

  const AVATAR_STORAGE_KEY = "fbt.avatar.v1";
  const MAX_AVATAR_BYTES = 8 * 1024 * 1024;
  const avatarInput = document.getElementById("avatarInput");
  const avatarUploadButton = document.getElementById("avatarUploadButton");
  const avatarHint = document.getElementById("avatarHint");

  let currentAvatar = null;

  function paintMessageAvatar(element, dataUrl) {
    if (!element) return;
    element.textContent = "";
    element.classList.toggle("msg-avatar--photo", Boolean(dataUrl));
    if (!dataUrl) {
      element.textContent = "范";
      return;
    }
    const image = document.createElement("img");
    image.className = "msg-avatar__image";
    image.src = dataUrl;
    image.alt = "";
    element.append(image);
  }

  function initAvatarUploader() {
    if (!avatarInput || !avatarUploadButton || !avatarHint) return;

    const targets = [
      {
        image: document.getElementById("heroAvatarImage"),
        fallback: document.getElementById("heroAvatarFallback"),
      },
      {
        image: document.getElementById("sideAvatarImage"),
        fallback: document.getElementById("sideAvatarFallback"),
      },
    ];

    const setHint = (message) => {
      avatarHint.textContent = message;
    };

    const applyAvatar = (dataUrl) => {
      targets.forEach(({ image, fallback }) => {
        if (!image) return;
        if (dataUrl) {
          image.src = dataUrl;
          image.hidden = false;
          if (fallback) fallback.hidden = true;
        } else {
          image.hidden = true;
          image.removeAttribute("src");
          if (fallback) fallback.hidden = false;
        }
      });

      currentAvatar = dataUrl;
      document.querySelectorAll(".msg-avatar").forEach((avatar) => {
        paintMessageAvatar(avatar, dataUrl);
      });

      avatarUploadButton.setAttribute("aria-label", dataUrl ? "更换头像" : "上传头像");
      avatarUploadButton.title = dataUrl ? "点击更换头像" : "点击上传头像";
    };

    const readStoredAvatar = () => {
      try {
        const value = localStorage.getItem(AVATAR_STORAGE_KEY);
        return value && value.startsWith("data:image/") ? value : null;
      } catch {
        return null;
      }
    };

    const persistAvatar = (dataUrl) => {
      try {
        localStorage.setItem(AVATAR_STORAGE_KEY, dataUrl);
        return true;
      } catch {
        return false;
      }
    };

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("image-decode-failed"));
        image.src = src;
      });

    const processAvatarFile = async (file) => {
      if (!file) return;

      if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
        setHint("请选择 JPG / PNG / WebP 图片");
        return;
      }

      if (file.size > MAX_AVATAR_BYTES) {
        setHint("图片请控制在 8MB 以内");
        return;
      }

      setHint("正在处理图片…");
      const objectUrl = URL.createObjectURL(file);

      try {
        const image = await loadImage(objectUrl);
        const MAX_DIM = 512;
        const scale = Math.min(
          MAX_DIM / image.naturalWidth,
          MAX_DIM / image.naturalHeight
        );
        const outWidth = Math.round(image.naturalWidth * scale);
        const outHeight = Math.round(image.naturalHeight * scale);
        if (!outWidth || !outHeight) throw new Error("empty-image");

        const canvas = document.createElement("canvas");
        canvas.width = outWidth;
        canvas.height = outHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("canvas-unavailable");

        context.drawImage(image, 0, 0, outWidth, outHeight);

        const webp = canvas.toDataURL("image/webp", 0.88);
        const dataUrl = webp.startsWith("data:image/webp")
          ? webp
          : canvas.toDataURL("image/png");

        const persisted = persistAvatar(dataUrl);
        applyAvatar(dataUrl);
        setHint(persisted ? "" : "已应用 · 本机未持久保存");
      } catch {
        setHint("图片读取失败，请换一张试试");
      } finally {
        URL.revokeObjectURL(objectUrl);
        avatarInput.value = "";
      }
    };

    avatarUploadButton.addEventListener("click", () => {
      avatarInput.click();
    });

    avatarInput.addEventListener("change", () => {
      const file = avatarInput.files && avatarInput.files[0];
      processAvatarFile(file);
    });

    const storedAvatar = readStoredAvatar();
    if (storedAvatar) {
      applyAvatar(storedAvatar);
      setHint("");
    }
  }

  initAvatarUploader();

  if (!chatLog || !chatForm || !chatInput || !chatPrompts) return;

  const STATUS_ENDPOINT = "/api/status";
  const CHAT_ENDPOINT = "/api/chat";
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
    paintMessageAvatar(avatar, currentAvatar);
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
