(() => {
  'use strict';

  const TYPE_PROFILES = {
    ISTJ: { label: '責任整理型', need: '役目を果たした事実を認める', wants: ['責任', '整理'], avoid: '感情だけで流すこと', trait: 'きちんとした手順とけじめを求める' },
    ISFJ: { label: '献身承認型', need: '尽くした時間をあたたかく認める', wants: ['共感', '承認'], avoid: '努力を軽く扱うこと', trait: '誰かのために耐えてきた気持ちを抱えている' },
    INFJ: { label: '意味救済型', need: '痛みに意味があったと見つける', wants: ['意味づけ', '共感'], avoid: '浅い励まし', trait: '人生の伏線や使命を探している' },
    INTJ: { label: '構造納得型', need: '失敗の構造を分析して納得させる', wants: ['分析', '結論'], avoid: '根拠のない慰め', trait: '感情よりも納得できる筋道を求める' },
    ISTP: { label: '静観現実型', need: '余計な装飾なしに現実を受け止める', wants: ['簡潔', '事実'], avoid: '大げさな共感', trait: '静かに、短く、核心だけ知りたい' },
    ISFP: { label: '感性保護型', need: '好きだったものや感性を否定しない', wants: ['肯定', '余白'], avoid: '正論で塗りつぶすこと', trait: '言葉にしづらい美しさや寂しさを抱える' },
    INFP: { label: '本心発見型', need: '本当の気持ちを言い当てる', wants: ['共感', '本心'], avoid: '決めつけと効率論', trait: '未練の奥にある願いを見つけてほしい' },
    INTP: { label: '矛盾解明型', need: '疑問と矛盾に筋の通った答えを出す', wants: ['分析', '可能性'], avoid: '考えるのをやめさせること', trait: '納得できない謎に引っかかっている' },
    ESTP: { label: '実感突破型', need: 'やり切った感と瞬間の強さを肯定する', wants: ['勢い', '現実'], avoid: '後悔を長引かせること', trait: '最後まで動き続けた自分を認めてほしい' },
    ESFP: { label: '記憶祝福型', need: '楽しかった記憶とつながりを祝う', wants: ['明るさ', '共感'], avoid: 'しんみりしすぎること', trait: '誰かと笑った時間を失いたくない' },
    ENFP: { label: '可能性肯定型', need: '夢や可能性が無駄ではないと示す', wants: ['希望', '意味づけ'], avoid: '現実だけで閉じること', trait: '叶わなかった未来にも光を残したい' },
    ENTP: { label: '反骨評価型', need: '挑戦やひねくれた強さを面白がる', wants: ['挑戦', '分析'], avoid: '普通に丸め込むこと', trait: '納得よりも、自分らしい負け方を求める' },
    ESTJ: { label: '成果評価型', need: '判断・責任・成果を正当に評価する', wants: ['評価', '結論'], avoid: '曖昧な同情', trait: '自分の選択が間違いだけではなかったと知りたい' },
    ESFJ: { label: '関係確認型', need: '愛したこと、愛されたことを確認する', wants: ['承認', '関係'], avoid: '孤独に扱うこと', trait: '周りとの絆が本物だったかを気にしている' },
    ENFJ: { label: '影響承認型', need: '誰かを導いた影響を認める', wants: ['影響', '共感'], avoid: '存在価値を小さく見ること', trait: '自分が誰かの光になれたかを知りたい' },
    ENTJ: { label: '意志継承型', need: '目標や意志が次へ続く形で決着する', wants: ['継承', '結論'], avoid: '弱さだけを見ること', trait: '終わり方にも戦略と意味を求める' }
  };

  const TYPE_ORDER = Object.keys(TYPE_PROFILES);

  const REGRETS = [
    { key: 'family', name: '家族', prompt: '家族に何も残せなかった気がするんです。', clue: '大事な人を思うほど、最後の一言にこだわっている。' },
    { key: 'love', name: '恋愛', prompt: '好きだった人に、ちゃんと好きって言えませんでした。', clue: '言えなかった気持ちを、なかったことにされたくない。' },
    { key: 'friend', name: '友情', prompt: 'あいつと仲直りしないまま、ここに来てしまって。', clue: '関係が切れたのではなく、途中で止まったと思っている。' },
    { key: 'work', name: '仕事', prompt: '最後の仕事、投げ出したみたいになったのが悔しくて。', clue: '成果よりも、自分の姿勢を見てほしい。' },
    { key: 'dream', name: '夢', prompt: '夢、あと少しで届きそうだったんです。', clue: '叶ったかどうかより、追いかけた意味を探している。' },
    { key: 'guilt', name: '罪悪感', prompt: '私のせいで誰かを傷つけた気がします。', clue: '罰ではなく、向き合う許し方を探している。' },
    { key: 'anger', name: '怒り', prompt: 'どうして私だけ、こんな終わり方だったんですか。', clue: '怒りの奥に、理不尽を認めてほしい気持ちがある。' },
    { key: 'lonely', name: '孤独', prompt: '最後まで、誰にも気づかれなかったんです。', clue: '存在した証拠を誰かに見つけてほしい。' },
    { key: 'promise', name: '約束', prompt: '守れなかった約束が、ずっと胸に残っています。', clue: '約束の失敗より、その約束を大切にした事実が重要。' },
    { key: 'self', name: '自分探し', prompt: '結局、自分が何者だったのかわかりません。', clue: '肩書きではなく、選んできたものから自分を見つけたい。' },
    { key: 'cause', name: '死因への納得', prompt: 'あの瞬間のことだけ、何度も考えてしまいます。', clue: '原因を責めるより、終わりを受け止める言葉が必要。' },
    { key: 'unfinished', name: '未完成', prompt: '途中で止まったものが多すぎて、帰れません。', clue: '完成ではなく、誰かに続きを託せる形を求めている。' }
  ];

  const FIRST_NAMES = [
    '灯子','玄太','ミサキ','朔也','園乃','千景','巴','晴臣','ゆかり','藤吾','リツ','佐保','八雲','環','初音','宗介','茉莉','伊織','千鳥','六花','澪','周平','カナメ','志乃','夏帆','冬馬','小梅','新太','蛍','真琴','菫','遼','恵那','ナツメ','梢','栄二','鈴','湊','文乃','薫','咲良','鷹雄','由布','凪','コハル','朝彦','紬','蓮','千代','悠里'
  ];
  const LAST_NAMES = ['霧島','水無瀬','有馬','黒谷','白峰','小鳥遊','宵町','森崎','月岡','羽柴','古賀','榊','日下部','七瀬','東雲','椎名','久遠','朝比奈','御影','鳴海'];
  const GENDERS = ['女性','男性','不明','女性','男性'];
  const CAUSES = ['通勤途中の事故','古い病による最期','川辺での転落','職場での過労','大雨の日の迷子','舞台裏の事故','夜道での怪異遭遇','山中での遭難','火事の煙','眠るような急死','海辺での事故','工房での爆発','未確認の神隠し','古い屋敷での転倒','祭りの日の混乱'];
  const OUTFITS = ['黒いスーツ','白いワンピース','古い作業着','学生服','雨合羽','割烹着','ライブTシャツ','喪服','くたびれた制服','旅装束','茶色のコート','花柄の着物'];
  const FACES = ['；_；','・_・','T_T','>_<','¬_¬','；へ；','o_o','-_ -','；△；','・へ・'];
  const COLORS = ['#eaf7ff','#f1ecff','#eafff0','#fff5df','#ffeef6','#e8fbff','#f5f7ff','#edf7e8'];

  const ASCENSION_LINES = {
    '責任': 'あなたは役目から逃げていません。',
    '整理': '背負わなくていい責任もあります。',
    '共感': 'つらさは、ここで受け取りました。',
    '承認': 'その優しさは本物でした。',
    '意味づけ': '終わり方だけが人生ではありません。',
    '分析': 'あなた個人だけの失敗ではありません。',
    '結論': 'ここで一区切りにして大丈夫です。',
    '簡潔': 'あなたはよくやりました。',
    '事実': 'あなたがいた事実は消えません。',
    '肯定': '好きだった気持ちはそのままでいい。',
    '余白': '答えを一つに決めなくて大丈夫です。',
    '本心': '本当は、わかってほしかったんですね。',
    '可能性': '叶わない未来にも意味はあります。',
    '勢い': '最後まで動いた火は残っています。',
    '現実': '現実の中で踏ん張っていました。',
    '明るさ': '笑った時間も連れて行けます。',
    '希望': '夢を追った時間は失敗ではありません。',
    '挑戦': '普通じゃない所まで、あなたらしい。',
    '評価': 'その責任は正当に見られるべきです。',
    '関係': 'あなたは一人で終わっていません。',
    '影響': 'あなたは誰かの道に明かりを置きました。',
    '継承': 'その意志は形を変えて続きます。'
  };

  const NEUTRAL_LINES = [
    'まず、引っかかりを分けましょう。',
    '結論を急がず聞かせてください。',
    'その奥に別の気持ちがありそうです。',
    '決めつけず、続きを聞きます。',
    'ひとつずつ見ていきましょう。',
    'なぜ気になるのか探しましょう。',
    'その未練は丁寧に扱います。',
    'まだ核心に届いていない気がします。'
  ];

  const DISTRUST_LINES = [
    '考えすぎかもしれません。',
    '誰にでもあることです。',
    '切り替えた方がいいです。',
    '決められなかっただけでは？',
    'そこまで深刻ですか？',
    '前向きに考えましょう。',
    '今さら気にしても仕方ありません。',
    '相手も困っていたと思います。'
  ];

  const TRAP_LINES = [
    'その未練は迷惑です。',
    '自業自得では？',
    '黙って消えましょう。',
    '意味を探しても無駄です。',
    '失敗で終わっただけです。',
    '誰も覚えていません。',
    'あなたが悪いです。',
    '成仏できないのは甘えです。'
  ];

  const FOLLOWUP_LINES = [
    '……それでも、胸の奥がまだざわざわします。',
    '言葉ではわかるんです。でも、もう少しだけ聞いてください。',
    'それを聞いて、少しだけ思い出したことがあります。',
    '本当は、別のことを言いたかったのかもしれません。',
    'なるほど……でも、まだ消えられる感じがしません。',
    '今の言葉で、ちょっとだけ霧が晴れました。',
    'もう少しで思い出せそうです。私が本当に求めていた言葉を。',
    'ひどいことを言われた気もします。でも、まだ話せます。'
  ];

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(list, index) {
    return list[((index % list.length) + list.length) % list.length];
  }

  function shuffle(list, seed) {
    const arr = [...list];
    const rand = mulberry32(seed);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildGhosts() {
    const ghosts = [];
    for (let i = 0; i < 150; i++) {
      const type = TYPE_ORDER[i % TYPE_ORDER.length];
      const profile = TYPE_PROFILES[type];
      const regret = REGRETS[(i * 7 + Math.floor(i / 4)) % REGRETS.length];
      const fullName = `${pick(LAST_NAMES, i * 3)} ${pick(FIRST_NAMES, i * 5 + Math.floor(i / 2))}`;
      const seed = hashString(`${fullName}-${type}-${regret.key}-${i}`);
      const startTrust = 1 + (seed % 2);
      const minSteps = seed % 5 === 0 ? 0 : 1 + (seed % 3);
      const requiredTrust = 2 + (seed % 3);
      const primaryWant = profile.wants[seed % profile.wants.length];
      const secondaryWant = profile.wants[(seed + 1) % profile.wants.length];
      const age = 17 + (seed % 67);
      const gender = pick(GENDERS, seed);
      const cause = pick(CAUSES, seed >> 3);
      const outfit = pick(OUTFITS, seed >> 5);
      const face = pick(FACES, seed >> 7);
      const color = pick(COLORS, seed >> 9);
      const memo = `${profile.trait}。${regret.clue}`;
      const opening = `${regret.prompt}${type[0] === 'E' ? ' こういう話、誰かに聞いてほしくて。' : ' でも、うまく言葉にできません。'}`;
      ghosts.push({
        id: `ghost-${String(i + 1).padStart(3, '0')}`,
        name: fullName,
        gender,
        age,
        type,
        typeLabel: `${type}風 / ${profile.label}`,
        cause,
        regret: regret.name,
        regretKey: regret.key,
        memo,
        outfit,
        face,
        color,
        seed,
        startTrust,
        minSteps,
        requiredTrust,
        patience: 5 + (seed % 4),
        primaryWant,
        secondaryWant,
        avoid: profile.avoid,
        opening,
        lines: [opening, ...FOLLOWUP_LINES.slice((seed % 4), (seed % 4) + 3)]
      });
    }
    return ghosts;
  }

  const els = {
    titleScreen: document.getElementById('titleScreen'),
    startBtn: document.getElementById('startBtn'),
    score: document.getElementById('score'),
    timer: document.getElementById('timer'),
    timerLabel: document.getElementById('timerLabel'),
    timerCard: document.getElementById('timerCard'),
    pauseBtn: document.getElementById('pauseBtn'),
    resumeScreen: document.getElementById('resumeScreen'),
    gameScreen: document.getElementById('gameScreen'),
    resultScreen: document.getElementById('resultScreen'),
    resumeName: document.getElementById('resumeName'),
    resumeGender: document.getElementById('resumeGender'),
    resumeAge: document.getElementById('resumeAge'),
    resumeType: document.getElementById('resumeType'),
    resumeCause: document.getElementById('resumeCause'),
    resumeRegret: document.getElementById('resumeRegret'),
    resumeMemo: document.getElementById('resumeMemo'),
    skipResumeBtn: document.getElementById('skipResumeBtn'),
    ghostFigure: document.getElementById('ghostFigure'),
    ghostFace: document.getElementById('ghostFace'),
    ghostAccessory: document.getElementById('ghostAccessory'),
    speakerName: document.getElementById('speakerName'),
    speakerMeta: document.getElementById('speakerMeta'),
    ghostSpeech: document.getElementById('ghostSpeech'),
    choices: document.getElementById('choices'),
    moodChip: document.getElementById('moodChip'),
    roundChip: document.getElementById('roundChip'),
    pauseOverlay: document.getElementById('pauseOverlay'),
    resumeBtn: document.getElementById('resumeBtn'),
    toast: document.getElementById('toast'),
    resultKicker: document.getElementById('resultKicker'),
    resultTitle: document.getElementById('resultTitle'),
    resultReason: document.getElementById('resultReason'),
    finalScore: document.getElementById('finalScore'),
    compatibilityList: document.getElementById('compatibilityList'),
    restartBtn: document.getElementById('restartBtn')
  };

  let ghosts = [];
  let currentGhost = null;
  let currentIndex = 0;
  let state = 'title';
  let score = 0;
  let stage = 0;
  let trust = 0;
  let suspicion = 0;
  let resumeTime = 10;
  let answerTime = 30;
  let paused = false;
  let tickHandle = null;
  let ascendedTypes = {};
  let attemptedTypes = {};
  let lastChoiceSet = [];

  function setScreen(name) {
    els.titleScreen.classList.toggle('active', name === 'title');
    els.resumeScreen.classList.toggle('active', name === 'resume');
    els.gameScreen.classList.toggle('active', name === 'game');
    els.resultScreen.classList.toggle('active', name === 'result');
  }

  function updateTimerDisplay() {
    if (state === 'title') {
      els.timer.textContent = '--';
      els.timerLabel.textContent = '待機';
      els.timerCard.classList.remove('danger');
      return;
    }
    const value = state === 'resume' ? resumeTime : answerTime;
    els.timer.textContent = Math.max(0, value).toFixed(1);
    els.timerLabel.textContent = state === 'resume' ? '履歴書' : '回答';
    els.timerCard.classList.toggle('danger', state === 'interview' && answerTime <= 5);
  }

  function startGame() {
    ghosts = shuffle(buildGhosts(), Date.now() & 0xffffffff);
    currentIndex = 0;
    score = 0;
    ascendedTypes = {};
    attemptedTypes = {};
    els.score.textContent = '0';
    paused = false;
    els.pauseOverlay.classList.add('hidden');
    clearInterval(tickHandle);
    tickHandle = setInterval(tick, 100);
    loadGhost();
  }

  function loadGhost() {
    if (currentIndex >= ghosts.length) {
      endGame('clear', '全員成仏', '150体のおばけ全員を気持ちよく送り出しました。霊界面接官、天職かもしれません。');
      return;
    }
    currentGhost = ghosts[currentIndex];
    attemptedTypes[currentGhost.type] = (attemptedTypes[currentGhost.type] || 0) + 1;
    stage = 0;
    trust = currentGhost.startTrust;
    suspicion = 0;
    resumeTime = 10;
    answerTime = 30;
    state = 'resume';
    setScreen('resume');
    renderResume();
    updateTimerDisplay();
  }

  function renderResume() {
    els.resumeName.textContent = currentGhost.name;
    els.resumeGender.textContent = currentGhost.gender;
    els.resumeAge.textContent = `${currentGhost.age}歳`;
    els.resumeType.textContent = currentGhost.typeLabel;
    els.resumeCause.textContent = currentGhost.cause;
    els.resumeRegret.textContent = currentGhost.regret;
    els.resumeMemo.textContent = currentGhost.memo;
  }

  function beginInterview() {
    if (state !== 'resume') return;
    state = 'interview';
    answerTime = 30;
    setScreen('game');
    renderGhostLook();
    renderInterview();
    updateTimerDisplay();
  }

  function renderGhostLook() {
    els.ghostFigure.classList.remove('ascend', 'shake');
    const body = els.ghostFigure.querySelector('.ghost-body');
    body.style.setProperty('--ghost', currentGhost.color);
    els.ghostFace.textContent = currentGhost.face;
    els.ghostAccessory.textContent = currentGhost.outfit;
    els.speakerName.textContent = currentGhost.name;
    els.speakerMeta.textContent = currentGhost.typeLabel;
  }

  function renderInterview() {
    const line = currentGhost.lines[Math.min(stage, currentGhost.lines.length - 1)] || currentGhost.opening;
    const mistrustText = suspicion >= 2 ? ' ……今の相談員さん、本当にわかってくれますか？' : '';
    els.ghostSpeech.textContent = line + mistrustText;
    els.moodChip.textContent = `未練：${currentGhost.regret} / 信頼 ${trust} / 不信 ${suspicion}`;
    els.roundChip.textContent = `面談 ${currentIndex + 1}/150`;
    lastChoiceSet = generateChoices();
    renderChoices(lastChoiceSet);
  }

  function generateChoices() {
    const seed = currentGhost.seed + stage * 101 + suspicion * 37 + trust * 17;
    const rand = mulberry32(seed);
    const choices = [];
    const ready = stage >= currentGhost.minSteps && trust >= currentGhost.requiredTrust;
    const earlyAscend = currentGhost.minSteps === 0 && stage === 0;
    const canAscend = suspicion < 3 && (ready || earlyAscend);
    const forcedTrapOnly = suspicion >= 3 || trust <= -2;

    if (forcedTrapOnly) {
      return shuffle(TRAP_LINES, seed).slice(0, 4).map(text => ({ role: 'trap', text }));
    }

    if (canAscend) {
      choices.push({ role: 'ascend', text: makeAscensionText(currentGhost) });
    }

    const neutralTarget = canAscend ? 2 : (suspicion >= 2 ? 1 : 3);
    const neutralPool = shuffle(NEUTRAL_LINES, seed + 9);
    for (let i = 0; i < neutralTarget; i++) {
      choices.push({ role: 'neutral', text: neutralPool[i], trustDelta: rand() > 0.52 ? 1 : 0 });
    }

    const hazardByNeutral = stage > 0 && ((stage + (currentGhost.seed % 5)) % 4 === 0);
    const shouldAddTrap = suspicion >= 1 || hazardByNeutral || rand() < 0.16;
    if (shouldAddTrap) {
      choices.push({ role: 'trap', text: pick(TRAP_LINES, Math.floor(rand() * 99) + stage + currentGhost.seed) });
    } else {
      choices.push({ role: 'distrust', text: pick(DISTRUST_LINES, Math.floor(rand() * 99) + stage + currentGhost.seed) });
    }

    while (choices.length < 4) {
      if (suspicion >= 2 || rand() < 0.35) {
        choices.push({ role: 'trap', text: pick(TRAP_LINES, Math.floor(rand() * 99) + choices.length) });
      } else if (rand() < 0.5) {
        choices.push({ role: 'distrust', text: pick(DISTRUST_LINES, Math.floor(rand() * 99) + choices.length) });
      } else {
        choices.push({ role: 'neutral', text: pick(NEUTRAL_LINES, Math.floor(rand() * 99) + choices.length), trustDelta: rand() > 0.42 ? 1 : 0 });
      }
    }

    return shuffle(choices.slice(0, 4), seed + 12345);
  }

  function makeAscensionText(ghost) {
    return ASCENSION_LINES[ghost.primaryWant] || ASCENSION_LINES[ghost.secondaryWant] || ASCENSION_LINES['共感'];
  }

  function renderChoices(choices) {
    els.choices.innerHTML = '';
    choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-button';
      btn.innerHTML = `<span class="choice-number">${index + 1}</span><span class="choice-text">${escapeHtml(choice.text)}</span>`;
      btn.addEventListener('click', () => choose(choice));
      els.choices.appendChild(btn);
    });
  }

  function choose(choice) {
    if (state !== 'interview' || paused) return;
    if (choice.role === 'ascend') {
      ascendGhost();
      return;
    }
    if (choice.role === 'trap') {
      els.ghostFigure.classList.add('shake');
      endGame('fail', '面談失敗', `${currentGhost.name}の未練に触れてはいけない言葉を選びました。「${choice.text}」`);
      return;
    }
    if (choice.role === 'distrust') {
      suspicion += 1;
      trust -= 1;
      stage += 1;
      answerTime = 30;
      showToast('不信が増えた。次から地雷回答が増えます。');
      renderInterview();
      updateTimerDisplay();
      return;
    }
    if (choice.role === 'neutral') {
      stage += 1;
      trust += choice.trustDelta || 0;
      if (stage > currentGhost.patience) suspicion += 1;
      answerTime = 30;
      showToast(choice.trustDelta ? '少し信頼された。まだ続きます。' : '無難に受け止めた。まだ核心ではない。');
      renderInterview();
      updateTimerDisplay();
    }
  }

  function ascendGhost() {
    state = 'transition';
    score += 1;
    ascendedTypes[currentGhost.type] = (ascendedTypes[currentGhost.type] || 0) + 1;
    els.score.textContent = String(score);
    els.ghostSpeech.textContent = '……ありがとうございます。やっと、行けそうです。';
    els.choices.innerHTML = '';
    els.ghostFigure.classList.add('ascend');
    showToast(`${currentGhost.name}は気持ちよさそうに成仏した。`);
    setTimeout(() => {
      currentIndex += 1;
      loadGhost();
    }, 1050);
  }

  function tick() {
    if (paused || state === 'transition' || state === 'result') return;
    if (state === 'resume') {
      resumeTime = Math.max(0, resumeTime - 0.1);
      if (resumeTime <= 0) beginInterview();
    } else if (state === 'interview') {
      answerTime = Math.max(0, answerTime - 0.1);
      if (answerTime <= 0) {
        endGame('timeout', '時間切れ', `${currentGhost.name}への回答が30秒以内に出せませんでした。おばけは未練を抱えたまま面談室を出ていきました。`);
      }
    }
    updateTimerDisplay();
  }

  function endGame(kind, title, reason) {
    state = 'result';
    clearInterval(tickHandle);
    setScreen('result');
    els.resultKicker.textContent = kind === 'clear' ? 'ALL CLEAR' : 'GAME OVER';
    els.resultTitle.textContent = title;
    els.resultReason.textContent = reason;
    els.finalScore.textContent = String(score);
    renderCompatibility();
    updateTimerDisplay();
  }

  function renderCompatibility() {
    els.compatibilityList.innerHTML = '';
    const entries = TYPE_ORDER.map(type => ({
      type,
      ascended: ascendedTypes[type] || 0,
      attempted: attemptedTypes[type] || 0,
      rate: attemptedTypes[type] ? (ascendedTypes[type] || 0) / attemptedTypes[type] : 0
    })).filter(x => x.attempted > 0 || x.ascended > 0);

    entries.sort((a, b) => (b.ascended - a.ascended) || (b.rate - a.rate) || a.type.localeCompare(b.type));
    const top = entries.filter(x => x.ascended > 0).slice(0, 3);

    if (!top.length) {
      const li = document.createElement('li');
      li.innerHTML = 'まだ判定不能<small>1体以上成仏させると、相性のいいタイプが表示されます。</small>';
      els.compatibilityList.appendChild(li);
      return;
    }

    top.forEach(item => {
      const profile = TYPE_PROFILES[item.type];
      const li = document.createElement('li');
      li.innerHTML = `<strong>${item.type}風 / ${profile.label}</strong><small>${item.ascended}体成仏。あなたは「${profile.need}」回答と相性が良さそうです。</small>`;
      els.compatibilityList.appendChild(li);
    });
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.remove('hidden');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => els.toast.classList.add('hidden'), 1150);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  }

  els.startBtn.addEventListener('click', startGame);
  els.skipResumeBtn.addEventListener('click', beginInterview);
  els.pauseBtn.addEventListener('click', () => {
    if (state === 'result' || state === 'title') return;
    paused = true;
    els.pauseOverlay.classList.remove('hidden');
  });
  els.resumeBtn.addEventListener('click', () => {
    paused = false;
    els.pauseOverlay.classList.add('hidden');
  });
  els.restartBtn.addEventListener('click', startGame);

  document.addEventListener('keydown', (event) => {
    const n = Number(event.key);
    if (n >= 1 && n <= 4 && lastChoiceSet[n - 1]) choose(lastChoiceSet[n - 1]);
    if (event.key === ' ') {
      event.preventDefault();
      if (state === 'resume') beginInterview();
    }
  });

  setScreen('title');
  updateTimerDisplay();
})();
