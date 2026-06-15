(() => {
  'use strict';

  const TYPE_PROFILES = {
    ISTJ: { label: '責任整理型', need: 'やったことをちゃんと見てあげる', wants: ['責任', '整理', '事実'], avoid: '気持ちだけで流すこと', trait: '履歴書の角をきっちり揃えている' },
    ISFJ: { label: '献身承認型', need: '誰かのために頑張ったことを認める', wants: ['共感', '承認', '関係'], avoid: '努力を軽く扱うこと', trait: '自分より先に、残された人を心配している' },
    INFJ: { label: '意味救済型', need: 'つらかった時間にも意味を見つける', wants: ['意味づけ', '共感', '影響'], avoid: '浅い励まし', trait: '言葉を選びながら、何度も遠くを見る' },
    INTJ: { label: '構造納得型', need: '何が起きたのか筋道を立てる', wants: ['分析', '結論', '整理'], avoid: '根拠のない慰め', trait: '泣くより先に、状況を説明しようとする' },
    ISTP: { label: '静観現実型', need: '短く、余計な飾りなしで受け止める', wants: ['簡潔', '事実', '現実'], avoid: '大げさな同情', trait: '口数は少ないが、聞かれたことには正直' },
    ISFP: { label: '感性保護型', need: '好きだったものを否定しない', wants: ['肯定', '余白', '共感'], avoid: '正論でまとめること', trait: 'ポケットの小物を、ずっと指でなぞっている' },
    INFP: { label: '本心発見型', need: '本当は何を望んでいたかに気づく', wants: ['共感', '本心', '余白'], avoid: '決めつけと効率論', trait: '何かを言いかけて、何度もやめる' },
    INTP: { label: '矛盾解明型', need: '引っかかっている疑問をほどく', wants: ['分析', '可能性', '整理'], avoid: '考えるのをやめさせること', trait: '同じ話を、別の角度から言い直す' },
    ESTP: { label: '実感突破型', need: '最後まで動いたことを認める', wants: ['勢い', '現実', '挑戦'], avoid: '後悔を長引かせること', trait: '落ち着きなく足を揺らし、本題に入りたがる' },
    ESFP: { label: '記憶祝福型', need: '楽しかった時間を一緒に思い出す', wants: ['明るさ', '共感', '関係'], avoid: '暗く締めすぎること', trait: '暗い話の途中でも、ふっと笑う' },
    ENFP: { label: '可能性肯定型', need: '叶わなかった夢も無駄にしない', wants: ['希望', '意味づけ', '可能性'], avoid: '現実だけで閉じること', trait: '話が飛ぶが、目はずっと真剣' },
    ENTP: { label: '反骨評価型', need: '変わった挑戦もその人らしさとして見る', wants: ['挑戦', '分析', '雑談'], avoid: '普通に丸め込むこと', trait: 'つらい話でも、少し皮肉っぽく笑う' },
    ESTJ: { label: '成果評価型', need: '判断や責任を正当に評価する', wants: ['評価', '結論', '責任'], avoid: '曖昧な同情', trait: '座るなり、結論から話そうとする' },
    ESFJ: { label: '関係確認型', need: '大切にした関係が本物だったと確認する', wants: ['承認', '関係', '共感'], avoid: '一人の問題として扱うこと', trait: '自分の未練なのに、何度も誰かの名前を出す' },
    ENFJ: { label: '影響承認型', need: '誰かに残したものを認める', wants: ['影響', '共感', '関係'], avoid: '存在価値を小さく見ること', trait: '自分の失敗より、残された人の表情を気にする' },
    ENTJ: { label: '意志継承型', need: 'やり残した意志に終わり方を作る', wants: ['継承', '結論', '評価'], avoid: '弱さだけを見ること', trait: '最後まで、次に何をするかを考えている' }
  };

  const TYPE_ORDER = Object.keys(TYPE_PROFILES);

  const ASCENSION_STYLES = [
    {
      key: 'chat',
      name: '雑談成仏',
      tags: ['雑談', '明るさ', '関係'],
      hint: '深刻な話の合間に、どうでもいい話を少し欲しがっている。',
      first: 'ほんとは、最後に普通の話がしたかっただけかもしれません。',
      ascend: '最後に笑えてよかったです。',
      reaction: '……あ、今の話。少し楽でした。'
    },
    {
      key: 'scold',
      name: '叱責成仏',
      tags: ['叱る', '責任', '本心'],
      hint: '許されたいというより、ちゃんと怒られたがっている。',
      first: 'それ、抱えすぎです。少し怒ってもいいですか。',
      ascend: 'もう十分です。ちゃんと怒りました。',
      reaction: '……怒ってくれる人、もういないと思ってました。'
    },
    {
      key: 'vent',
      name: '愚痴成仏',
      tags: ['愚痴', '傾聴', '共感'],
      hint: 'きれいな結論より、ただ愚痴を聞いてほしそう。',
      first: '愚痴でいいです。きれいに話さなくていいですよ。',
      ascend: 'その愚痴、ここに置いていってください。',
      reaction: '……こんなこと、言ってよかったんですね。'
    },
    {
      key: 'empathy',
      name: '受け止め成仏',
      tags: ['共感', '本心', '肯定'],
      hint: '正解より先に、気持ちを受け止めてほしそう。',
      first: 'それは、しんどかったですね。',
      ascend: 'その痛さ、ここに置いていっていいです。',
      reaction: '……やっと、そこを見てもらえた気がします。'
    },
    {
      key: 'logic',
      name: '納得成仏',
      tags: ['分析', '整理', '事実'],
      hint: '慰めより、何が起きたのかを一緒に整理したがっている。',
      first: 'まず、起きたことを分けて見ましょう。',
      ascend: 'これ以上、一人の責任にしなくていいです。',
      reaction: '……そう整理すると、少し息ができます。'
    },
    {
      key: 'closure',
      name: '区切り成仏',
      tags: ['結論', '整理', '継承'],
      hint: '長く話すより、最後の置き場所を探している。',
      first: 'ここで一区切りにしても大丈夫です。',
      ascend: 'もう、ここで終わらせて大丈夫です。',
      reaction: '……終わってもいいんですね。'
    },
    {
      key: 'praise',
      name: '承認成仏',
      tags: ['承認', '評価', '責任'],
      hint: '誰かに「ちゃんと見ていた」と言われるのを待っている。',
      first: 'ちゃんと見てました。よくやってましたよ。',
      ascend: 'あなたは、ちゃんと頑張っていました。',
      reaction: '……それを聞きたかったのかもしれません。'
    },
    {
      key: 'memory',
      name: '思い出成仏',
      tags: ['明るさ', '事実', '関係'],
      hint: '後悔だけでなく、楽しかった記憶も持っていきたそう。',
      first: '楽しかったことも、少し話しませんか。',
      ascend: '笑った時間まで、置いていかなくていいです。',
      reaction: '……そういえば、楽しい日もありました。'
    },
    {
      key: 'free',
      name: '余白成仏',
      tags: ['余白', '肯定', '可能性'],
      hint: '白黒つけず、曖昧なまま受け入れられたがっている。',
      first: '答えを一つに決めなくてもいいです。',
      ascend: '迷ったままでも、行っていいんです。',
      reaction: '……決めなくていいなら、少し楽です。'
    },
    {
      key: 'inherit',
      name: '継承成仏',
      tags: ['継承', '希望', '影響'],
      hint: 'やり残しを、自分だけで抱えなくていいと言われたがっている。',
      first: 'その続きは、誰かに渡していいんです。',
      ascend: '続きは、ちゃんと誰かに届きます。',
      reaction: '……全部持っていかなくていいんですね。'
    }
  ];

  const STYLE_BY_KEY = Object.fromEntries(ASCENSION_STYLES.map(style => [style.key, style]));

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

  const FIRST_NAMES = ['灯子','玄太','ミサキ','朔也','園乃','千景','巴','晴臣','ゆかり','藤吾','リツ','佐保','八雲','環','初音','宗介','茉莉','伊織','千鳥','六花','澪','周平','カナメ','志乃','夏帆','冬馬','小梅','新太','蛍','真琴','菫','遼','恵那','ナツメ','梢','栄二','鈴','湊','文乃','薫','咲良','鷹雄','由布','凪','コハル','朝彦','紬','蓮','千代','悠里'];
  const LAST_NAMES = ['霧島','水無瀬','有馬','黒谷','白峰','小鳥遊','宵町','森崎','月岡','羽柴','古賀','榊','日下部','七瀬','東雲','椎名','久遠','朝比奈','御影','鳴海'];
  const GENDERS = ['女性','男性','不明','女性','男性'];
  const CAUSES = ['通勤途中の事故','古い病による最期','川辺での転落','職場での過労','大雨の日の迷子','舞台裏の事故','夜道での怪異遭遇','山中での遭難','火事の煙','眠るような急死','海辺での事故','工房での爆発','未確認の神隠し','古い屋敷での転倒','祭りの日の混乱'];
  const OUTFITS = ['黒いスーツ','白いワンピース','古い作業着','学生服','雨合羽','割烹着','ライブTシャツ','喪服','くたびれた制服','旅装束','茶色のコート','花柄の着物'];
  const FACES = ['；_；','・_・','T_T','>_<','¬_¬','；へ；','o_o','-_ -','；△；','・へ・'];
  const COLORS = ['#eaf7ff','#f1ecff','#eafff0','#fff5df','#ffeef6','#e8fbff','#f5f7ff','#edf7e8'];

  const RESPONSE_LINES = [
    { text: 'それは、しんどかったですね。', tags: ['共感'], tone: 'pull' },
    { text: '本当は、気づいてほしかったんですね。', tags: ['本心', '共感'], tone: 'pull' },
    { text: 'ちゃんと見てました。よくやってましたよ。', tags: ['承認', '評価'], tone: 'pull' },
    { text: '誰かのために動いてましたよね。', tags: ['承認', '関係'], tone: 'pull' },
    { text: 'まず、順番に分けて見ましょう。', tags: ['分析', '整理'], tone: 'pull' },
    { text: 'それ、一人で背負う話じゃないです。', tags: ['分析', '整理'], tone: 'pull' },
    { text: '最後まで、ちゃんとやってましたよ。', tags: ['責任', '評価'], tone: 'pull' },
    { text: 'あの状況で、よく踏ん張りました。', tags: ['現実', '責任'], tone: 'pull' },
    { text: 'ここで一区切りにしても大丈夫です。', tags: ['結論', '整理'], tone: 'pull' },
    { text: 'その続きは、誰かに渡していいんです。', tags: ['継承', '希望'], tone: 'pull' },
    { text: '好きだったままでいいです。', tags: ['肯定', '余白'], tone: 'pull' },
    { text: '無理に答えを一つにしなくていいです。', tags: ['余白', '可能性'], tone: 'pull' },
    { text: '楽しかったことも、少し話しませんか。', tags: ['明るさ', '雑談'], tone: 'pull' },
    { text: 'ちょっとだけ雑談しましょうか。', tags: ['雑談', '明るさ'], tone: 'pull' },
    { text: '愚痴でいいです。全部出しましょう。', tags: ['愚痴', '傾聴'], tone: 'pull' },
    { text: 'きれいに話さなくていいですよ。', tags: ['愚痴', '傾聴'], tone: 'pull' },
    { text: '少し怒ります。抱えすぎです。', tags: ['叱る', '責任'], tone: 'pull' },
    { text: 'それは逃げずに見ましょう。', tags: ['叱る', '本心'], tone: 'pull' },
    { text: '変な意地まで、あなたらしいです。', tags: ['挑戦', '肯定'], tone: 'pull' },
    { text: '追いかけた時間は、残っています。', tags: ['希望', '意味づけ'], tone: 'pull' },
    { text: 'あなたの言葉で助かった人がいます。', tags: ['影響', '関係'], tone: 'pull' },
    { text: 'あの日だけで全部は決まりません。', tags: ['意味づけ', '可能性'], tone: 'pull' }
  ];

  const WATCH_LINES = [
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

  const SAFE_LINES = [
    '少し落ち着いて話しましょう。',
    '無理に急がなくて大丈夫です。',
    'できる範囲で聞きます。',
    '一つずつ確認しましょう。',
    'ここでは責めません。',
    '今は話せる所だけで大丈夫です。',
    'つらければ、少し止まりましょう。',
    '今の気持ちを置いてみましょう。'
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

  function countTagMatches(tags, goodTags) {
    return tags.reduce((sum, tag) => sum + (goodTags.includes(tag) ? 1 : 0), 0);
  }

  function buildGhosts() {
    const ghosts = [];
    for (let i = 0; i < 150; i++) {
      const type = TYPE_ORDER[i % TYPE_ORDER.length];
      const profile = TYPE_PROFILES[type];
      const regret = REGRETS[(i * 7 + Math.floor(i / 4)) % REGRETS.length];
      const fullName = `${pick(LAST_NAMES, i * 3)} ${pick(FIRST_NAMES, i * 5 + Math.floor(i / 2))}`;
      const seed = hashString(`${fullName}-${type}-${regret.key}-${i}`);
      const style = pick(ASCENSION_STYLES, seed + i * 11);
      const age = 17 + (seed % 67);
      const gender = pick(GENDERS, seed);
      const cause = pick(CAUSES, seed >> 3);
      const outfit = pick(OUTFITS, seed >> 5);
      const face = pick(FACES, seed >> 7);
      const color = pick(COLORS, seed >> 9);
      const openingTail = type[0] === 'E' ? ' すみません、誰かに聞いてほしくて。' : ' すみません、うまく言えないんですけど。';
      const opening = `${regret.prompt}${openingTail}`;
      const goodTags = [...new Set([...profile.wants, ...style.tags])];
      const ascensionMax = 3 + (seed % 3); // 3〜5
      const distrustMax = 3 + ((seed >> 4) % 3); // 3〜5
      const safeIsRisky = ['INTJ', 'ENTJ', 'ESTJ', 'ENTP', 'INFP'].includes(type) || style.key === 'scold';
      const memo = `${profile.trait}。${regret.clue} ${style.hint}`;

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
        style,
        styleKey: style.key,
        styleName: style.name,
        goodTags,
        safeIsRisky,
        minSteps: seed % 5 === 0 ? 0 : 1 + (seed % 2),
        ascensionMax,
        distrustMax,
        avoid: profile.avoid,
        opening,
        lines: [opening, ...FOLLOWUP_LINES.slice((seed % 4), (seed % 4) + 4)]
      });
    }
    return ghosts;
  }

  const els = {
    titleScreen: document.getElementById('titleScreen'),
    startBtn: document.getElementById('startBtn'),
    score: document.getElementById('score'),
    failures: document.getElementById('failures'),
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
  let failures = 0;
  let stage = 0;
  let ascensionHp = 0;
  let distrustHp = 0;
  let resumeTime = 10;
  let answerTime = 30;
  let paused = false;
  let tickHandle = null;
  let ascendedTypes = {};
  let attemptedTypes = {};
  let ascendedStyles = {};
  let lastChoiceSet = [];
  let lastReaction = '';

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
    failures = 0;
    ascendedTypes = {};
    attemptedTypes = {};
    ascendedStyles = {};
    updateHeader();
    paused = false;
    els.pauseOverlay.classList.add('hidden');
    clearInterval(tickHandle);
    tickHandle = setInterval(tick, 100);
    loadGhost();
  }

  function updateHeader() {
    els.score.textContent = String(score);
    if (els.failures) els.failures.textContent = String(failures);
  }

  function loadGhost() {
    if (currentIndex >= ghosts.length) {
      endGame('clear', '全員成仏', '150体のおばけ全員を送り出しました。霊界面接官、天職かもしれません。');
      return;
    }
    currentGhost = ghosts[currentIndex];
    attemptedTypes[currentGhost.type] = (attemptedTypes[currentGhost.type] || 0) + 1;
    stage = 0;
    ascensionHp = currentGhost.ascensionMax;
    distrustHp = currentGhost.distrustMax;
    lastReaction = '';
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
    els.resumeMemo.textContent = `避けたい話し方：${currentGhost.avoid}。成仏の仕方は面談中に推理。`;
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
    const baseLine = stage === 0
      ? currentGhost.opening
      : (lastReaction || currentGhost.lines[Math.min(stage, currentGhost.lines.length - 1)] || currentGhost.opening);
    const dangerText = distrustHp <= 1 ? ' ……すみません、少し怖くなってきました。' : '';
    els.ghostSpeech.textContent = baseLine + dangerText;
    els.moodChip.textContent = `成仏HP ${ascensionHp}/${currentGhost.ascensionMax} ・ 不信HP ${distrustHp}/${currentGhost.distrustMax}`;
    els.roundChip.textContent = `失敗 ${failures}/3 ・ 面談 ${currentIndex + 1}/150`;
    lastChoiceSet = generateChoices();
    renderChoices(lastChoiceSet);
  }

  function generateChoices() {
    const seed = currentGhost.seed + stage * 101 + ascensionHp * 31 + distrustHp * 47;
    const rand = mulberry32(seed);
    const choices = [];

    if (distrustHp <= 1) {
      const dangerMix = [
        { role: 'distrust', text: pick(DISTRUST_LINES, seed), damage: 1 },
        { role: 'distrust', text: pick(DISTRUST_LINES, seed + 5), damage: 1 },
        { role: 'trap', text: pick(TRAP_LINES, seed + 9) },
        { role: 'trap', text: pick(TRAP_LINES, seed + 13) }
      ];
      return finalizeChoices(dangerMix, seed + 99);
    }

    const canOneShot = stage >= currentGhost.minSteps && ascensionHp <= Math.max(2, Math.ceil(currentGhost.ascensionMax / 2));
    const luckyOneShot = stage >= currentGhost.minSteps + 1 && rand() < 0.2;
    if (canOneShot || luckyOneShot) {
      choices.push({ role: 'ascend', text: currentGhost.style.ascend });
    }

    const matching = shuffle(RESPONSE_LINES.filter(line => countTagMatches(line.tags, currentGhost.goodTags) > 0), seed + 1);
    const near = shuffle(RESPONSE_LINES.filter(line => countTagMatches(line.tags, currentGhost.goodTags) === 0), seed + 2);

    const pullCount = choices.length ? 1 : 2;
    for (let i = 0; i < pullCount && matching[i]; i++) {
      const line = matching[i];
      const matches = countTagMatches(line.tags, currentGhost.goodTags);
      choices.push({ role: 'pull', text: line.text, tags: line.tags, power: Math.min(2, Math.max(1, matches)) });
    }

    choices.push({ role: 'watch', text: pick(WATCH_LINES, seed + 3) });

    if (rand() < 0.42) {
      choices.push({ role: 'safe', text: pick(SAFE_LINES, seed + 4), risky: currentGhost.safeIsRisky });
    } else if (near[0]) {
      choices.push({ role: 'safe', text: near[0].text, risky: true });
    }

    const shouldAddTrap = (stage > 1 && rand() < 0.22) || (distrustHp <= 2 && rand() < 0.5);
    if (shouldAddTrap) {
      choices.push({ role: 'trap', text: pick(TRAP_LINES, seed + 8) });
    } else {
      choices.push({ role: 'distrust', text: pick(DISTRUST_LINES, seed + 8), damage: 1 });
    }

    while (choices.length < 4) {
      if (rand() < 0.33) choices.push({ role: 'watch', text: pick(WATCH_LINES, seed + choices.length * 7) });
      else if (rand() < 0.66) choices.push({ role: 'safe', text: pick(SAFE_LINES, seed + choices.length * 11), risky: rand() < 0.45 || currentGhost.safeIsRisky });
      else choices.push({ role: 'distrust', text: pick(DISTRUST_LINES, seed + choices.length * 13), damage: 1 });
    }

    return finalizeChoices(choices, seed + 12345);
  }

  function finalizeChoices(choices, seed) {
    const fillers = [
      ...WATCH_LINES.map(text => ({ role: 'watch', text })),
      ...SAFE_LINES.map(text => ({ role: 'safe', text, risky: false })),
      ...DISTRUST_LINES.map(text => ({ role: 'distrust', text, damage: 1 })),
      ...TRAP_LINES.map(text => ({ role: 'trap', text }))
    ];
    const final = shuffle(uniqueChoices(choices), seed);
    let guard = 0;
    while (final.length < 4 && guard < fillers.length * 2) {
      const next = pick(fillers, seed + guard * 3);
      if (!final.some(choice => choice.text === next.text)) final.push(next);
      guard += 1;
    }
    return final.slice(0, 4);
  }

  function uniqueChoices(choices) {
    const seen = new Set();
    return choices.filter(choice => {
      if (seen.has(choice.text)) return false;
      seen.add(choice.text);
      return true;
    });
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
    answerTime = 30;

    if (choice.role === 'ascend') {
      ascendGhost(choice.text);
      return;
    }

    if (choice.role === 'trap') {
      els.ghostFigure.classList.add('shake');
      failGhost('地雷回答', `${currentGhost.name}は黙り込んでしまいました。「${choice.text}」`);
      return;
    }

    if (choice.role === 'pull') {
      const before = ascensionHp;
      ascensionHp = Math.max(0, ascensionHp - (choice.power || 1));
      stage += 1;
      lastReaction = ascensionHp <= 0 ? currentGhost.style.reaction : makeGoodReaction(before - ascensionHp);
      if (ascensionHp <= 0) {
        ascendGhost(currentGhost.style.ascend);
        return;
      }
      showToast(`成仏HPが${before - ascensionHp}減った。近づいている。`);
      renderInterview();
      updateTimerDisplay();
      return;
    }

    if (choice.role === 'watch') {
      stage += 1;
      lastReaction = pick(FOLLOWUP_LINES, currentGhost.seed + stage + ascensionHp);
      if (stage >= currentGhost.minSteps + 3) {
        distrustHp = Math.max(0, distrustHp - 1);
        showToast('様子見が長くなり、不信HPが少し減った。');
      } else {
        showToast('様子を見た。HPは動かない。');
      }
      checkDistrustOrContinue();
      return;
    }

    if (choice.role === 'safe') {
      stage += 1;
      if (choice.risky) {
        distrustHp = Math.max(0, distrustHp - 1);
        lastReaction = '……悪い言葉じゃないのに、少し遠い気がします。';
        showToast('無難だが、このおばけには少し遠かった。');
      } else {
        lastReaction = '……はい。少し落ち着きました。';
        showToast('無難に会話をつないだ。');
      }
      checkDistrustOrContinue();
      return;
    }

    if (choice.role === 'distrust') {
      stage += 1;
      distrustHp = Math.max(0, distrustHp - (choice.damage || 1));
      lastReaction = '……それは、少し違う気がします。';
      showToast('不信HPが減った。次の言葉に注意。');
      checkDistrustOrContinue();
    }
  }

  function makeGoodReaction(amount) {
    if (currentGhost.style && amount >= 2) return currentGhost.style.reaction;
    return pick(FOLLOWUP_LINES, currentGhost.seed + stage + amount);
  }

  function checkDistrustOrContinue() {
    if (distrustHp <= 0) {
      failGhost('不信限界', `${currentGhost.name}は席を立ちました。もう話を続けられません。`);
      return;
    }
    renderInterview();
    updateTimerDisplay();
  }

  function ascendGhost(line) {
    state = 'transition';
    score += 1;
    ascendedTypes[currentGhost.type] = (ascendedTypes[currentGhost.type] || 0) + 1;
    ascendedStyles[currentGhost.styleName] = (ascendedStyles[currentGhost.styleName] || 0) + 1;
    updateHeader();
    els.ghostSpeech.textContent = `……ありがとうございます。${line}`;
    els.choices.innerHTML = '';
    els.ghostFigure.classList.add('ascend');
    showToast(`${currentGhost.name}は${currentGhost.styleName}で成仏した。`);
    setTimeout(() => {
      currentIndex += 1;
      loadGhost();
    }, 1200);
  }

  function failGhost(title, reason) {
    state = 'transition';
    failures += 1;
    updateHeader();
    els.choices.innerHTML = '';
    els.ghostSpeech.textContent = reason;
    showToast(`成仏失敗 ${failures}/3`);
    if (failures >= 3) {
      setTimeout(() => endGame('fail', '面談終了', `3回成仏に失敗しました。最後の失敗：${title}`), 1050);
      return;
    }
    setTimeout(() => {
      currentIndex += 1;
      loadGhost();
    }, 1250);
  }

  function tick() {
    if (paused || state === 'transition' || state === 'result') return;
    if (state === 'resume') {
      resumeTime = Math.max(0, resumeTime - 0.1);
      if (resumeTime <= 0) beginInterview();
    } else if (state === 'interview') {
      answerTime = Math.max(0, answerTime - 0.1);
      if (answerTime <= 0) {
        failGhost('時間切れ', `${currentGhost.name}は答えを待ちきれず、面談室を出ていきました。`);
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

    const styleTop = Object.entries(ascendedStyles).sort((a, b) => b[1] - a[1]).slice(0, 1)[0];
    if (styleTop) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>得意な成仏：${styleTop[0]}</strong><small>${styleTop[1]}体。この送り方と相性がよさそうです。</small>`;
      els.compatibilityList.appendChild(li);
    }
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
