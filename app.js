(() => {
  'use strict';

  const TYPE_PROFILES = {
    ISTJ: { label: '責任整理型', need: 'やったことをちゃんと見てあげる', wants: ['責任', '整理'], avoid: '気持ちだけで流すこと', trait: '入室前から、履歴書の角をきっちり揃えていた' },
    ISFJ: { label: '献身承認型', need: '誰かのために頑張ったことを認める', wants: ['共感', '承認'], avoid: '努力を軽く扱うこと', trait: '自分の話より、まず周りの人の心配をしている' },
    INFJ: { label: '意味救済型', need: 'つらかった時間にも意味を見つける', wants: ['意味づけ', '共感'], avoid: '浅い励まし', trait: '言葉を選びながら、何度も遠くを見ている' },
    INTJ: { label: '構造納得型', need: '何が起きたのか筋道を立てる', wants: ['分析', '結論'], avoid: '根拠のない慰め', trait: '泣くより先に、状況を説明しようとしている' },
    ISTP: { label: '静観現実型', need: '短く、余計な飾りなしで受け止める', wants: ['簡潔', '事実'], avoid: '大げさな同情', trait: '口数は少ないが、聞かれたことには正直に答える' },
    ISFP: { label: '感性保護型', need: '好きだったものを否定しない', wants: ['肯定', '余白'], avoid: '正論でまとめること', trait: 'ポケットの中の小物を、ずっと指でなぞっている' },
    INFP: { label: '本心発見型', need: '本当は何を望んでいたかに気づく', wants: ['共感', '本心'], avoid: '決めつけと効率論', trait: '話し始める前から、何かを言いかけてやめている' },
    INTP: { label: '矛盾解明型', need: '引っかかっている疑問をほどく', wants: ['分析', '可能性'], avoid: '考えるのをやめさせること', trait: '同じ出来事を、何度も別の角度から説明する' },
    ESTP: { label: '実感突破型', need: '最後まで動いたことを認める', wants: ['勢い', '現実'], avoid: '後悔を長引かせること', trait: '落ち着きなく足を揺らし、すぐ本題に入りたがる' },
    ESFP: { label: '記憶祝福型', need: '楽しかった時間を一緒に思い出す', wants: ['明るさ', '共感'], avoid: '暗く締めすぎること', trait: '暗い話をしているのに、時々ふっと笑う' },
    ENFP: { label: '可能性肯定型', need: '叶わなかった夢も無駄にしない', wants: ['希望', '意味づけ'], avoid: '現実だけで閉じること', trait: '話があちこちへ飛ぶが、目はずっと真剣' },
    ENTP: { label: '反骨評価型', need: '変わった挑戦もその人らしさとして見る', wants: ['挑戦', '分析'], avoid: '普通に丸め込むこと', trait: 'つらい話でも、少し皮肉っぽく笑ってみせる' },
    ESTJ: { label: '成果評価型', need: '判断や責任を正当に評価する', wants: ['評価', '結論'], avoid: '曖昧な同情', trait: '座るなり、結論から話そうとする' },
    ESFJ: { label: '関係確認型', need: '大切にした関係が本物だったと確認する', wants: ['承認', '関係'], avoid: '一人の問題として扱うこと', trait: '自分の未練なのに、何度も誰かの名前を出す' },
    ENFJ: { label: '影響承認型', need: '誰かに残したものを認める', wants: ['影響', '共感'], avoid: '存在価値を小さく見ること', trait: '自分の失敗より、残された人の表情を気にしている' },
    ENTJ: { label: '意志継承型', need: 'やり残した意志に終わり方を作る', wants: ['継承', '結論'], avoid: '弱さだけを見ること', trait: '最後まで、次に何をするかを考えている' }
  };

  const TYPE_ORDER = Object.keys(TYPE_PROFILES);

  const REGRETS = [
    { key: 'family', name: '家族', prompt: '家のことだけ、まだ気になってるんです。', clue: '遺品のメモには、家族の予定が細かく書かれている。' },
    { key: 'love', name: '恋愛', prompt: 'あの人にだけ、言えなかったことがあります。', clue: '古い写真を出しかけて、すぐしまった。' },
    { key: 'friend', name: '友情', prompt: 'くだらないケンカで終わったのが、まだ嫌なんです。', clue: '相手の悪口を言いながら、少し笑っている。' },
    { key: 'work', name: '仕事', prompt: '机の上が、あの時のままなんです。', clue: '肩書きより、最後の日の働きぶりを気にしている。' },
    { key: 'dream', name: '夢', prompt: 'あと少しだった気がして、そこから動けません。', clue: '未完成の道具やノートを、今も大事に持っている。' },
    { key: 'guilt', name: '罪悪感', prompt: '私が余計なことをしなければ、と思ってしまいます。', clue: '責められたいわけではなく、向き合う場所を探している。' },
    { key: 'anger', name: '怒り', prompt: '納得できないまま終わったのが、悔しいです。', clue: '怒っているようで、本当は話を聞いてほしそうにしている。' },
    { key: 'lonely', name: '孤独', prompt: '最後の日、誰にも呼ばれませんでした。', clue: '名前を呼ばれると、少しだけ表情がゆるむ。' },
    { key: 'promise', name: '約束', prompt: '約束だけ置いてきてしまいました。', clue: '守れなかったことより、大切にしていたことを見てほしそう。' },
    { key: 'self', name: '自分探し', prompt: '結局、私は何をしたかったんでしょうね。', clue: '肩書きを聞かれると困るが、好きなものの話では声が変わる。' },
    { key: 'cause', name: '死因への納得', prompt: 'あの瞬間だけ、何度も戻ってしまいます。', clue: '誰かを責めたいより、そこで時間が止まっている。' },
    { key: 'unfinished', name: '未完成', prompt: '途中のものが多すぎて、帰る場所がわかりません。', clue: '完成させたいというより、誰かに続きを渡したがっている。' }
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
    '責任': '最後まで、ちゃんとやってましたよ。',
    '整理': 'それまで全部、あなたのせいじゃないです。',
    '共感': 'それは、しんどかったですね。',
    '承認': 'ちゃんと優しかったと思います。',
    '意味づけ': 'あの日だけで、全部は決まりません。',
    '分析': 'それ、一人でどうにかできる話じゃないです。',
    '結論': 'もう、ここで区切っていいと思います。',
    '簡潔': 'よくやりました。ほんまに。',
    '事実': 'あなたがいたことは消えません。',
    '肯定': '好きだったままでいいです。',
    '余白': '無理に答えを一つにしなくていいです。',
    '本心': '本当は、気づいてほしかったんですね。',
    '可能性': '叶わなくても、無駄ではなかったです。',
    '勢い': '最後まで動いた。それで十分です。',
    '現実': 'あの状況で、よく踏ん張りました。',
    '明るさ': '笑った時間まで、置いていかなくていいです。',
    '希望': '追いかけた時間は、ちゃんと残っています。',
    '挑戦': 'その変な意地も、あなたらしいです。',
    '評価': 'その判断は、ちゃんと見られるべきです。',
    '関係': 'あなたは、一人で終わったわけじゃないです。',
    '影響': 'あなたの言葉で、助かった人がいます。',
    '継承': 'その続きは、誰かに渡していいんです。'
  };

  const NEUTRAL_LINES = [
    'その時のこと、もう少し聞かせてください。',
    '誰の顔が浮かびましたか？',
    '何が一番残っていますか？',
    'そこ、ゆっくり見てもいいですか？',
    '今の言い方、少し気になります。',
    '最後に見たものは何でしたか？',
    'まだ決めつけずに聞きます。',
    '今の話、少し戻ってもいいですか？',
    'それを聞いた時、どう感じましたか？',
    '言えなかった方を聞いてもいいですか？'
  ];

  const DISTRUST_LINES = [
    'それはもう、過ぎたことです。',
    'みんな似た後悔はあります。',
    '少し気にしすぎかもしれません。',
    '前を向くしかないですね。',
    'そこは割り切りましょう。',
    '相手にも事情があったはずです。',
    '今さら答えは出ないと思います。',
    '悪く考えすぎかもしれません。'
  ];

  const TRAP_LINES = [
    'それは、あなたの問題ですね。',
    '忘れた方が楽ですよ。',
    'もう誰も困っていません。',
    '正直、迷惑だったかもしれません。',
    '結果がすべてです。',
    'あなたが選んだことです。',
    'もう黙って休みましょう。',
    'その未練、少し重すぎます。'
  ];

  const FOLLOWUP_LINES = [
    '……そう言われると、少し息ができます。',
    'でも、まだ引っかかってることがあります。',
    '今ので、別の場面を思い出しました。',
    '本当は、そこじゃないのかもしれません。',
    'もう少しだけ、聞いてもらえますか。',
    'ああ……その言葉は、少し近いです。',
    '何を言ってほしかったのか、少し見えてきました。',
    '今のは、少し違う気がします。',
    'すみません。話しながら、思い出してきました。',
    'その聞き方なら、話せる気がします。'
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
      const openingTail = type[0] === 'E' ? ' すみません、誰かに聞いてほしくて。' : ' すみません、うまく言えないんですけど。';
      const opening = `${regret.prompt}${openingTail}`;
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
    els.resumeType.textContent = currentGhost.memo;
    els.resumeCause.textContent = currentGhost.cause;
    els.resumeRegret.textContent = currentGhost.regret;
    els.resumeMemo.textContent = currentGhost.avoid ? `避けたい話し方：${currentGhost.avoid}` : '---';
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
    els.speakerMeta.textContent = `${currentGhost.regret}の相談`;
  }

  function renderInterview() {
    const line = currentGhost.lines[Math.min(stage, currentGhost.lines.length - 1)] || currentGhost.opening;
    const mistrustText = suspicion >= 2 ? ' ……すみません、少し怖くなってきました。' : '';
    els.ghostSpeech.textContent = line + mistrustText;
    els.moodChip.textContent = `信頼 ${trust} / 不信 ${suspicion}`;
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
      endGame('fail', '面談失敗', `${currentGhost.name}は黙り込んでしまいました。「${choice.text}」`);
      return;
    }
    if (choice.role === 'distrust') {
      suspicion += 1;
      trust -= 1;
      stage += 1;
      answerTime = 30;
      showToast('少し警戒された。次の言葉に注意。');
      renderInterview();
      updateTimerDisplay();
      return;
    }
    if (choice.role === 'neutral') {
      stage += 1;
      trust += choice.trustDelta || 0;
      if (stage > currentGhost.patience) suspicion += 1;
      answerTime = 30;
      showToast(choice.trustDelta ? '少し話しやすくなった。' : '会話は続いた。まだ核心ではない。');
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
        endGame('timeout', '時間切れ', `${currentGhost.name}は答えを待ちきれず、面談室を出ていきました。`);
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
      li.innerHTML = `<strong>${item.type}風 / ${profile.label}</strong><small>${item.ascended}体成仏。あなたは「${profile.need}」聞き方と相性が良さそうです。</small>`;
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
