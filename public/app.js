(function () {
  "use strict";

  const TEST_SIZE = 15;
  const RECORD_MAX_MS = 6500;
  const NEXT_DELAY_MS = 2000;
  const TARGET_SAMPLE_RATE = 16000;
  const LAST_TEST_WORDS_KEY = "speech-test-last-words-v1";

  const PHRASE_TONES = {
    "安排": "an1_pai2", "安全": "an1_quan2", "比较": "bi3_jiao4", "必须": "bi4_xu1", "表示": "biao3_shi4",
    "不但": "bu2_dan4", "参加": "can1_jia1", "车站": "che1_zhan4", "宠物": "chong3_wu4", "出来": "chu1_lai2",
    "错误": "cuo4_wu4", "大家": "da4_jia1", "大学": "da4_xue2", "代表": "dai4_biao3", "但是": "dan4_shi4",
    "当然": "dang1_ran2", "道理": "dao4_li3", "得到": "de2_dao4", "电影": "dian4_ying3", "调控": "tiao2_kong4",
    "冬天": "dong1_tian1", "动物": "dong4_wu4", "多少": "duo1_shao3", "而且": "er2_qie3", "发生": "fa1_sheng1",
    "反对": "fan3_dui4", "扶贫": "fu2_pin2", "辐射": "fu2_she4", "负责": "fu4_ze2", "复杂": "fu4_za2",
    "干部": "gan4_bu4", "刚才": "gang1_cai2", "各种": "ge4_zhong3", "工作": "gong1_zuo4", "国家": "guo2_jia1",
    "合适": "he2_shi4", "环保": "huan2_bao3", "活动": "huo2_dong4", "火车": "huo3_che1", "或者": "huo4_zhe3",
    "基本": "ji1_ben3", "简单": "jian3_dan1", "健身": "jian4_shen1", "紧张": "jin3_zhang1", "经过": "jing1_guo4",
    "精神": "jing1_shen2", "决定": "jue2_ding4", "科研": "ke1_yan2", "可能": "ke3_neng2", "可是": "ke3_shi4",
    "可以": "ke3_yi3", "空气": "kong1_qi4", "老师": "lao3_shi1", "历史": "li4_shi3", "利用": "li4_yong4",
    "领导": "ling3_dao3", "马上": "ma3_shang4", "没有": "mei2_you3", "门口": "men2_kou3", "民族": "min2_zu2",
    "那样": "na4_yang4", "难道": "nan2_dao4", "农民": "nong2_min2", "努力": "nu3_li4", "批评": "pi1_ping2",
    "品牌": "pin3_pai2", "汽车": "qi4_che1", "去年": "qu4_nian2", "全部": "quan2_bu4", "热情": "re4_qing2",
    "任何": "ren4_he2", "上网": "shang4_wang3", "社会": "she4_hui4", "社区": "she4_qu1", "身体": "shen1_ti3",
    "生产": "sheng1_chan3", "生活": "sheng1_huo2", "时代": "shi2_dai4", "时间": "shi2_jian1", "实现": "shi2_xian4",
    "水平": "shui3_ping2", "睡觉": "shui4_jiao4", "思想": "si1_xiang3", "虽然": "sui1_ran2", "所有": "suo3_you3",
    "太阳": "tai4_yang2", "特别": "te4_bie2", "提高": "ti2_gao1", "同志": "tong2_zhi4", "突然": "tu1_ran2",
    "伟大": "wei3_da4", "希望": "xi1_wang4", "现代": "xian4_dai4", "小时": "xiao3_shi2", "星期": "xing1_qi1",
    "许多": "xu3_duo1", "颜色": "yan2_se4", "要求": "yao1_qiu2", "也许": "ye3_xu3", "一定": "yi2_ding4",
    "一起": "yi4_qi3", "已经": "yi3_jing1", "以后": "yi3_hou4", "艺术": "yi4_shu4", "意义": "yi4_yi4",
    "尤其": "you2_qi2", "有名": "you3_ming2", "这些": "zhe4_xie1", "这样": "zhe4_yang4", "整齐": "zheng3_qi2",
    "正在": "zheng4_zai4", "中午": "zhong1_wu3", "中学": "zhong1_xue2", "主要": "zhu3_yao4", "自己": "zi4_ji3",
    "祖国": "zu3_guo2", "最后": "zui4_hou4", "最近": "zui4_jin4", "昨天": "zuo2_tian1"
  };

  const ICONS = {
    play: "▶",
    mic: '<svg viewBox="0 0 64 64" role="img" aria-label="麦克风"><path d="M32 38c6.1 0 11-4.9 11-11V16c0-6.1-4.9-11-11-11S21 9.9 21 16v11c0 6.1 4.9 11 11 11Z" fill="none" stroke="currentColor" stroke-width="5"/><path d="M14 27c0 10 8 18 18 18s18-8 18-18M32 45v12M22 57h20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
    correct: "✓",
    wrong: "×",
    alert: "!"
  };

  const elements = {
    screenTitle: document.getElementById("screenTitle"),
    progressText: document.getElementById("progressText"),
    progressBar: document.getElementById("progressBar"),
    statusOrb: document.getElementById("statusOrb"),
    statusIcon: document.getElementById("statusIcon"),
    phaseText: document.getElementById("phaseText"),
    hintText: document.getElementById("hintText"),
    answerCard: document.getElementById("answerCard"),
    answerText: document.getElementById("answerText"),
    resultFlash: document.getElementById("resultFlash"),
    resumeAudioButton: document.getElementById("resumeAudioButton"),
    recordButton: document.getElementById("recordButton"),
    noticeModal: document.getElementById("noticeModal"),
    startButton: document.getElementById("startButton"),
    restartButton: document.getElementById("restartButton"),
    testPanel: document.getElementById("testPanel"),
    resultPanel: document.getElementById("resultPanel"),
    correctCount: document.getElementById("correctCount"),
    wrongCount: document.getElementById("wrongCount"),
    accuracyText: document.getElementById("accuracyText"),
    resultList: document.getElementById("resultList")
  };

  const words = Array.isArray(window.SPEECH_TEST_WORDS) ? window.SPEECH_TEST_WORDS : [];
  const charToneMap = buildCharToneMap(PHRASE_TONES);

  let testItems = [];
  let answers = [];
  let currentIndex = 0;
  let countdownTimer = null;
  let recordTimer = null;
  let currentAudio = null;
  let recorder = null;

  elements.startButton.addEventListener("click", () => {
    elements.noticeModal.classList.add("is-hidden");
    startTest();
  });

  elements.resumeAudioButton.addEventListener("click", () => {
    elements.resumeAudioButton.classList.add("is-hidden");
    playCurrentWord();
  });

  elements.recordButton.addEventListener("click", () => {
    elements.recordButton.classList.add("is-hidden");
    beginXfyunRecognition();
  });

  elements.restartButton.addEventListener("click", () => startTest());

  function startTest() {
    stopRecording();
    stopAudio();
    clearTimeout(countdownTimer);
    answers = [];
    currentIndex = 0;
    testItems = selectTestItems(words, TEST_SIZE);
    localStorage.setItem(LAST_TEST_WORDS_KEY, JSON.stringify(testItems.map((item) => item.word)));
    elements.testPanel.classList.remove("is-hidden");
    elements.resultPanel.classList.add("is-hidden");
    setProgress();

    if (testItems.length < TEST_SIZE) {
      showFatal("词库数量不足", "请检查双音节女声音频目录是否完整。当前无法开始测试。");
      return;
    }

    playCurrentWord();
  }

  function selectTestItems(source, size) {
    const previousWords = readLastWords();
    const freshUnique = uniqueByWord(shuffle(source).filter((item) => !previousWords.has(item.word)));
    if (freshUnique.length >= size) return freshUnique.slice(0, size);
    return uniqueByWord(shuffle(source)).slice(0, size);
  }

  function readLastWords() {
    try { return new Set(JSON.parse(localStorage.getItem(LAST_TEST_WORDS_KEY) || "[]")); }
    catch { return new Set(); }
  }

  function uniqueByWord(items) {
    const seen = new Set();
    return items.filter((item) => {
      if (seen.has(item.word)) return false;
      seen.add(item.word);
      return true;
    });
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function getAudioElement() {
    if (!currentAudio) {
      currentAudio = document.createElement("audio");
      currentAudio.preload = "auto";
      currentAudio.setAttribute("playsinline", "");
      currentAudio.style.display = "none";
      document.body.appendChild(currentAudio);
    }
    return currentAudio;
  }

  function playCurrentWord() {
    const item = testItems[currentIndex];
    setProgress();
    setPhase("playing");
    hideFlash();
    hideAnswer();
    hideActionButtons();
    stopAudio();

    const audio = getAudioElement();
    audio.onended = showManualRecordStart;
    audio.onerror = () => finalizeCurrent("音频播放失败");
    audio.src = item.audio;
    audio.load();
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => showPlaybackBlocked());
    }
  }

  function showPlaybackBlocked() {
    elements.screenTitle.textContent = "需要点击播放";
    elements.phaseText.textContent = "请点击继续播放";
    elements.hintText.textContent = "苹果浏览器限制了自动播放声音，请点一下继续。";
    elements.resumeAudioButton.classList.remove("is-hidden");
  }

  function showManualRecordStart() {
    setPhase("recording-ready");
    elements.recordButton.classList.remove("is-hidden");
  }

  async function beginXfyunRecognition() {
    let signed;
    try {
      const response = await fetch("/api/xfyun-token", { cache: "no-store" });
      signed = await response.json();
      if (!response.ok || !signed.url || !signed.appId) throw new Error(signed.error || "讯飞签名接口不可用");
    } catch (error) {
      showFatal("讯飞接口未配置", "请在 Cloudflare Pages 环境变量中配置讯飞 APPID、APIKey、APISecret。");
      return;
    }

    try {
      setPhase("recording");
      recorder = await createPcmRecorder(signed);
      recorder.start();
      clearTimeout(recordTimer);
      recordTimer = window.setTimeout(() => stopRecording(), RECORD_MAX_MS);
    } catch (error) {
      showFatal("无法录音", "请允许浏览器使用麦克风，然后重新测试。");
    }
  }

  async function createPcmRecorder({ url, appId }) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContextClass();
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    const socket = new WebSocket(url);
    let status = 0;
    let transcript = "";
    let stopped = false;
    let opened = false;

    socket.onopen = () => { opened = true; };
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.code && message.code !== 0) {
          transcript = transcript || `识别失败：${message.message || message.code}`;
          return;
        }
        const words = message.data?.result?.ws || [];
        const text = words.map((item) => item.cw?.[0]?.w || "").join("");
        if (text) transcript += text;
      } catch {
        // Ignore malformed service frames.
      }
    };
    socket.onerror = () => { transcript = transcript || "识别连接失败"; };
    socket.onclose = () => finalizeCurrent(transcript);

    processor.onaudioprocess = (event) => {
      if (!opened || stopped || socket.readyState !== WebSocket.OPEN) return;
      const pcm = downsampleTo16k(event.inputBuffer.getChannelData(0), audioContext.sampleRate);
      if (!pcm.byteLength) return;
      socket.send(JSON.stringify({
        common: status === 0 ? { app_id: appId } : undefined,
        business: status === 0 ? { language: "zh_cn", domain: "iat", accent: "mandarin", vad_eos: 5000 } : undefined,
        data: { status, format: "audio/L16;rate=16000", encoding: "raw", audio: arrayBufferToBase64(pcm.buffer) }
      }));
      status = 1;
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    return {
      start() {},
      stop() {
        if (stopped) return;
        stopped = true;
        clearTimeout(recordTimer);
        source.disconnect();
        processor.disconnect();
        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ data: { status: 2, format: "audio/L16;rate=16000", encoding: "raw", audio: "" } }));
        }
      }
    };
  }

  function downsampleTo16k(input, inputSampleRate) {
    if (inputSampleRate === TARGET_SAMPLE_RATE) return floatTo16BitPcm(input);
    const ratio = inputSampleRate / TARGET_SAMPLE_RATE;
    const length = Math.floor(input.length / ratio);
    const output = new Float32Array(length);
    for (let i = 0; i < length; i += 1) {
      const start = Math.floor(i * ratio);
      const end = Math.floor((i + 1) * ratio);
      let sum = 0;
      let count = 0;
      for (let j = start; j < end && j < input.length; j += 1) { sum += input[j]; count += 1; }
      output[i] = count ? sum / count : 0;
    }
    return floatTo16BitPcm(output);
  }

  function floatTo16BitPcm(input) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i += 1) {
      const sample = Math.max(-1, Math.min(1, input[i]));
      output[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }
    return output;
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }

  function stopRecording() {
    if (recorder) {
      recorder.stop();
      recorder = null;
    }
  }

  function finalizeCurrent(rawHeard) {
    clearTimeout(recordTimer);
    const item = testItems[currentIndex];
    const heard = cleanChinese(rawHeard) || "未识别到声音";
    const matched = isPronunciationMatch(item.word, heard);

    answers.push({ item, heard, correct: matched, order: currentIndex + 1 });
    showJudgement(matched, item);
    startCountdown(currentIndex >= testItems.length - 1);
  }

  function showJudgement(correct, item) {
    elements.statusOrb.className = `status-orb ${correct ? "correct" : "wrong"}`;
    elements.phaseText.textContent = correct ? "正确" : "错误";
    elements.screenTitle.textContent = "判断完成";
    setStatusIcon(correct ? ICONS.correct : ICONS.wrong);
    showAnswer(item.word);
    showFlash(correct);
  }

  function startCountdown(isFinalQuestion) {
    let remaining = NEXT_DELAY_MS / 1000;
    const updateText = () => {
      elements.hintText.textContent = isFinalQuestion ? `${remaining} 秒后显示测试结果。` : `${remaining} 秒后进入下一题。`;
    };
    const tick = () => {
      remaining -= 1;
      if (remaining > 0) {
        updateText();
        countdownTimer = window.setTimeout(tick, 1000);
        return;
      }
      currentIndex += 1;
      if (currentIndex >= testItems.length) showResults();
      else playCurrentWord();
    };
    clearTimeout(countdownTimer);
    updateText();
    countdownTimer = window.setTimeout(tick, 1000);
  }

  function isPronunciationMatch(expected, actual) {
    const cleanExpected = cleanChinese(expected);
    const cleanActual = cleanChinese(actual);
    if (cleanActual.length !== cleanExpected.length) return false;
    if (cleanActual === cleanExpected) return true;
    const expectedTone = getToneKey(cleanExpected);
    const actualTone = getToneKey(cleanActual);
    return Boolean(expectedTone && actualTone && expectedTone === actualTone);
  }

  function getToneKey(text) {
    const extra = window.SPEECH_TEST_EXTRA_TONES || {};
    if (extra[text]) return extra[text];
    if (PHRASE_TONES[text]) return PHRASE_TONES[text];
    const parts = Array.from(text).map((char) => charToneMap[char]);
    return parts.every(Boolean) ? parts.join("_") : "";
  }

  function buildCharToneMap(phraseMap) {
    const result = {};
    Object.entries(phraseMap).forEach(([word, toneKey]) => {
      const chars = Array.from(word);
      const tones = toneKey.split("_");
      chars.forEach((char, index) => { if (!result[char]) result[char] = tones[index]; });
    });
    return result;
  }

  function cleanChinese(text) {
    return String(text || "").replace(/[，。！？、,.!?\s]/g, "").match(/[\u4e00-\u9fff]/g)?.join("") || "";
  }

  function setProgress() {
    const done = Math.min(currentIndex, TEST_SIZE);
    const current = Math.min(currentIndex + 1, TEST_SIZE);
    elements.progressText.textContent = `${current} / ${TEST_SIZE}`;
    elements.progressBar.style.width = `${(done / TEST_SIZE) * 100}%`;
  }

  function setPhase(phase) {
    elements.statusOrb.className = `status-orb ${phase}`;
    const phaseData = {
      playing: ["正在播放", "请认真听，词语不会显示在屏幕上。", ICONS.play, "第 " + (currentIndex + 1) + " 题"],
      "recording-ready": ["准备录音", "请点击开始录音，然后大声朗读。", ICONS.mic, "准备录音"],
      recording: ["请朗读", "正在识别，请大声读出刚才听到的词语。", ICONS.mic, "正在录音"]
    }[phase];
    elements.phaseText.textContent = phaseData[0];
    elements.hintText.textContent = phaseData[1];
    setStatusIcon(phaseData[2]);
    elements.screenTitle.textContent = phaseData[3];
  }

  function setStatusIcon(icon) {
    if (String(icon).startsWith("<svg")) elements.statusIcon.innerHTML = icon;
    else elements.statusIcon.textContent = icon;
  }

  function showAnswer(word) {
    elements.answerText.textContent = word;
    elements.answerCard.classList.remove("is-hidden");
  }

  function hideAnswer() {
    elements.answerText.textContent = "";
    elements.answerCard.classList.add("is-hidden");
  }

  function showFlash(correct) {
    elements.resultFlash.textContent = correct ? "正确" : "错误";
    elements.resultFlash.className = `result-flash ${correct ? "good" : "bad"}`;
  }

  function hideFlash() { elements.resultFlash.className = "result-flash is-hidden"; }
  function hideActionButtons() {
    elements.resumeAudioButton.classList.add("is-hidden");
    elements.recordButton.classList.add("is-hidden");
  }

  function showResults() {
    stopRecording();
    stopAudio();
    clearTimeout(countdownTimer);
    hideActionButtons();
    const correct = answers.filter((answer) => answer.correct).length;
    const wrong = answers.length - correct;
    const accuracy = answers.length ? Math.round((correct / answers.length) * 100) : 0;
    elements.screenTitle.textContent = "测试结果";
    elements.progressText.textContent = `${answers.length} / ${TEST_SIZE}`;
    elements.progressBar.style.width = "100%";
    elements.correctCount.textContent = String(correct);
    elements.wrongCount.textContent = String(wrong);
    elements.accuracyText.textContent = `${accuracy}%`;
    elements.resultList.innerHTML = "";
    answers.slice().sort((a, b) => a.correct !== b.correct ? (a.correct ? 1 : -1) : a.order - b.order).forEach((answer) => {
      const li = document.createElement("li");
      li.className = answer.correct ? "correct-row" : "wrong-row";
      li.innerHTML = `<span class="seq">第${answer.order}题</span><span class="answer">${answer.item.word}</span><span class="heard">${answer.heard || "未识别"}</span>`;
      elements.resultList.appendChild(li);
    });
    elements.testPanel.classList.add("is-hidden");
    elements.resultPanel.classList.remove("is-hidden");
  }

  function showFatal(title, message) {
    stopRecording();
    stopAudio();
    clearTimeout(countdownTimer);
    hideFlash();
    hideAnswer();
    hideActionButtons();
    elements.screenTitle.textContent = title;
    elements.phaseText.textContent = title;
    elements.hintText.textContent = message;
    elements.statusOrb.className = "status-orb wrong";
    setStatusIcon(ICONS.alert);
    elements.restartButton.textContent = "重新测试";
    elements.resultPanel.classList.add("is-hidden");
    elements.testPanel.classList.remove("is-hidden");
  }

  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  }

  if (!words.length) showFatal("没有找到词库", "请确认 words-data.js 已正确加载。");
})();