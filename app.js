(() => {
  'use strict';

  const TYPE_PROFILES = {
    ISTJ: { label: '責任整理型', wants: ['responsibility', 'closure'], badAxes: ['emotionOnly', 'ambiguity'], trait: '手順とけじめを重く見る' },
    ISFJ: { label: '献身承認型', wants: ['care', 'relationship'], badAxes: ['minimize', 'selfishness'], trait: '誰かのためにしたことを隠しがち' },
    INFJ: { label: '意味救済型', wants: ['meaning', 'empathy'], badAxes: ['flatPractical', 'lightCheer'], trait: '出来事の奥に意味を探す' },
    INTJ: { label: '構造納得型', wants: ['analysis', 'closure'], badAxes: ['groundlessComfort', 'emotionOnly'], trait: '納得できる筋道を求める' },
    ISTP: { label: '静観現実型', wants: ['practical', 'concise'], badAxes: ['dramatic', 'crowd'], trait: '短く、現実的な言葉を信じる' },
    ISFP: { label: '感性保護型', wants: ['acceptance', 'freedom'], badAxes: ['correctness', 'efficiency'], trait: '好きだったものを守りたい' },
    INFP: { label: '本心発見型', wants: ['empathy', 'truth'], badAxes: ['efficiency', 'forcedClosure'], trait: '表の相談と本音がずれやすい' },
    INTP: { label: '矛盾解明型', wants: ['analysis', 'possibility'], badAxes: ['stopThinking', 'lightCheer'], trait: '疑問がほどけないと進めない' },
    ESTP: { label: '実感突破型', wants: ['practical', 'challenge'], badAxes: ['regretLoop', 'pity'], trait: '動いた瞬間の手応えを覚えている' },
    ESFP: { label: '記憶祝福型', wants: ['memory', 'relationship'], badAxes: ['coldAnalysis', 'isolation'], trait: '楽しかった場面を手放したくない' },
    ENFP: { label: '可能性肯定型', wants: ['possibility', 'meaning'], badAxes: ['closedReality', 'settle'], trait: '叶わなかった未来も持っていたい' },
    ENTP: { label: '反骨評価型', wants: ['challenge', 'analysis'], badAxes: ['normalization', 'obedience'], trait: '普通で終わることを嫌がる' },
    ESTJ: { label: '成果評価型', wants: ['evaluation', 'responsibility'], badAxes: ['vagueSympathy', 'ambiguity'], trait: '判断と成果を正当に見てほしい' },
    ESFJ: { label: '関係確認型', wants: ['relationship', 'care'], badAxes: ['isolation', 'coldAnalysis'], trait: '周囲とのつながりを気にする' },
    ENFJ: { label: '影響承認型', wants: ['impact', 'relationship'], badAxes: ['smallExistence', 'selfOnly'], trait: '誰かの力になれたかを気にする' },
    ENTJ: { label: '意志継承型', wants: ['legacy', 'closure'], badAxes: ['weaknessOnly', 'pity'], trait: '終わり方にも意志を通したい' }
  };

  const TYPE_ORDER = Object.keys(TYPE_PROFILES);

  const STYLE_TEXTS = {
    responsibility: ['役目は消えていません', '逃げなかった事実があります', '背負った分は残っています'],
    closure: ['ここで区切れます', '終わりに名前を付けます', '置いていって大丈夫'],
    care: ['守ろうとしたんですね', 'その優しさは残ります', '尽くした時間は本物です'],
    relationship: ['つながりは残っています', '一人で終わっていません', '誰かの中にいます'],
    meaning: ['終わりだけで決まりません', 'その道は無駄じゃない', '痛みに意味を探しましょう'],
    empathy: ['悔しさは本物です', '寂しかったんですね', '言えなかったんですね'],
    analysis: ['原因を分けて見ます', '構造で見直しましょう', '個人だけの失敗ではない'],
    practical: ['現実の中で踏ん張った', 'あの場でできる限りでした', '事実から受け止めます'],
    concise: ['もう十分です', 'よくやりました', 'それでいいです'],
    acceptance: ['好きなままでいい', '否定しなくていい', 'その感性は残せます'],
    freedom: ['答えは一つじゃない', '決めなくてもいい', '余白ごと行けます'],
    truth: ['核心は別にあります', '言葉の奥を見ます', '本当は何を守った？'],
    possibility: ['続きはまだあります', '別の形で芽が出ます', '叶わない夢も残ります'],
    challenge: ['その無茶、らしいです', '挑んだことが答えです', '負け方まであなたです'],
    memory: ['笑った日も連れて行けます', '楽しかった日は残ります', '明るい記憶で送ります'],
    evaluation: ['判断は見られています', '成果はゼロじゃない', '責任は評価されるべき'],
    impact: ['誰かの道を照らしました', '影響は残っています', 'あなたは光でした'],
    legacy: ['意志は次へ渡せます', '続きは託せます', '終わりを設計しましょう']
  };

  const STYLE_CLUES = {
    responsibility: ['責められたいわけじゃない。ただ、投げたと思われたくないんです。', '誰も見ていなくても、やるべきことはやったつもりでした。'],
    closure: ['終わった、と言える形が欲しいだけなのかもしれません。', '途中のまま置かれている感じが、どうにも苦手で。'],
    care: ['誰かのためにしたことを、恩着せがましいとは思われたくなくて。', 'してあげたかったことばかり、あとから浮かぶんです。'],
    relationship: ['名前を呼ばれた記憶が、まだ少し温かいんです。', '切れたんじゃなくて、途中で止まっただけだと思いたい。'],
    meaning: ['あの日までの全部が、ただ途切れただけだと思いたくない。', '意味があったと言われたいのか、意味を探したいのかもわかりません。'],
    empathy: ['平気な顔をしていたけど、本当はかなりきつかった。', '誰かに、まず「それは痛い」と言ってほしかった気がします。'],
    analysis: ['何が原因だったのか、感情より先にそこへ戻ってしまう。', '慰めより、どこで歯車がずれたのかを知りたい。'],
    practical: ['きれいな言葉より、あの場の現実を見てほしい。', '実際には選べることが少なかったんです。'],
    concise: ['長い慰めより、短く言ってくれた方が信じられる。', '大げさにされると、逆に遠く感じます。'],
    acceptance: ['好きだったものを、子どもっぽいと言われたのが刺さって。', '正しいかより、好きだったことを残したいんです。'],
    freedom: ['結論を出されると、また閉じ込められる気がする。', '決められないままでも、間違いじゃないと思いたい。'],
    truth: ['たぶん、口に出してる悩みと本当の悩みが違う。', '自分でも、何を言ってほしいのかわかってないんです。'],
    possibility: ['なくなった未来のことを、まだ捨てきれません。', '叶わなかったものにも、別の続きがあってほしい。'],
    challenge: ['馬鹿だったと言われたらそれまでなんですけど、退きたくなかった。', '無謀でも、あそこで行った自分は嫌いじゃない。'],
    memory: ['泣いたことより、笑った日の方を覚えていたい。', '最後の顔より、楽しかった時の顔を残したいんです。'],
    evaluation: ['結果だけじゃなくて、判断した理由も見てほしい。', '失敗の数字だけで、自分を終わらせたくない。'],
    impact: ['自分がいたことで、誰かが少しでも変わったなら。', 'あの人の背中を押せていたのか、それだけ気になります。'],
    legacy: ['自分の手で終われないなら、せめて渡し方を決めたい。', '続きがあるなら、誰に何を託すべきだったんでしょう。']
  };

  const REGRETS = [
    {
      key: 'family', name: '家族',
      scenes: ['食卓の椅子が一つだけ斜めで、それがずっと気になっています。', '最後の日、玄関の鍵を二回確認したことだけ覚えています。', '冷蔵庫に貼ったメモを、誰かが読んだのか気になります。'],
      items: ['角の折れた家族写真', '半分だけ残った買い物メモ', '使い込まれた合鍵'],
      witness: ['近所の人いわく、毎朝同じ時間に窓を開けていた。', '家族の予定を誰よりも覚えていたらしい。']
    },
    {
      key: 'love', name: '恋愛',
      scenes: ['送らなかった文面が、まだ指先に残っている気がします。', '駅の改札前で、言うつもりの言葉を飲み込みました。', '借りた傘だけ返せないままです。'],
      items: ['未送信のメッセージ画面', '色あせた映画の半券', '小さな折りたたみ傘'],
      witness: ['友人は「肝心な話だけ笑ってごまかす人」と話している。', '最後まで相手の悪口だけは言わなかった。']
    },
    {
      key: 'friend', name: '友情',
      scenes: ['くだらない口げんかの最後の一言だけ、妙に大きく響きます。', 'あいつの席に置いた缶コーヒー、冷めたままだったんです。', '既読のつかない短い文が、まだ宙に浮いています。'],
      items: ['片方だけのキーホルダー', '開封していない缶コーヒー', '古い集合写真'],
      witness: ['けんかの後も、相手の好きな物だけは覚えていた。', '昔話になると急に早口になった。']
    },
    {
      key: 'work', name: '仕事',
      scenes: ['机の引き出しを閉めた音が、今でも戻ってきます。', '朝礼の前に、靴ひもがほどけていました。', '最後のチェック欄だけ、空白のままなんです。'],
      items: ['赤ペンだらけの進行表', '折れた社員証', '未提出の報告書'],
      witness: ['同僚は「口は少ないが最後まで残る人」と話している。', '後輩のミスを自分のメモ帳に書き写していた。']
    },
    {
      key: 'dream', name: '夢',
      scenes: ['舞台袖の床の冷たさだけ、はっきり覚えています。', '練習場の鏡に、最後の自分がまだ立っている気がします。', 'ノートの次のページが白いままです。'],
      items: ['削れたピック', '書きかけのネーム', '汗染みのある台本'],
      witness: ['周囲は「諦めが悪いところが良かった」と言っている。', '失敗した日ほど、次の予定を入れていた。']
    },
    {
      key: 'guilt', name: '罪悪感',
      scenes: ['あの時の「大丈夫」が、本当に大丈夫だったのか考え続けています。', 'ドアを閉める前に、振り返らなかったことが残っています。', '誰かの泣き声だけ、場所を変えても聞こえます。'],
      items: ['渡せなかったお守り', '折り目の多い謝罪文', '古い通話履歴'],
      witness: ['謝る時ほど言葉が固くなる人だった。', '自分のミスでなくても、まず頭を下げていた。']
    },
    {
      key: 'anger', name: '怒り',
      scenes: ['あの曲が流れるたび、なぜか胸の奥が熱くなります。', '誰かの笑い声に、まだ置いていかれた気がします。', '割れた窓の形だけ、妙にきれいでした。'],
      items: ['ひびの入った腕時計', '握りつぶしたチケット', '破れた封筒'],
      witness: ['怒る前に一度だけ黙る癖があった。', '本当に腹が立つ時ほど、丁寧語になっていた。']
    },
    {
      key: 'lonely', name: '孤独',
      scenes: ['自販機の灯りだけが、最後までこちらを見ていました。', '部屋の電気を消した音が、妙に大きかったんです。', '通知の来ない画面を、ずっと持っていました。'],
      items: ['未読ゼロの携帯電話', '一人分のレシート', '空の写真立て'],
      witness: ['人の集まりでは端の席を選ぶことが多かった。', '誘われると驚いた顔をしてから笑った。']
    },
    {
      key: 'promise', name: '約束',
      scenes: ['待ち合わせの時計だけ、ずっと進まないんです。', '「また今度」の声が、まだ耳の横にあります。', '丸をつけた日付だけ、カレンダーから浮いて見えます。'],
      items: ['丸印のついたカレンダー', '二枚ある入場券', '小さな約束のメモ'],
      witness: ['約束の時間には少し早く着く人だった。', '冗談の約束ほど真面目に覚えていた。']
    },
    {
      key: 'self', name: '自分探し',
      scenes: ['名刺の肩書きだけが、知らない人のものみたいです。', '鏡を見るたび、誰の顔だったのか迷います。', '好きだったもののリストが、途中から空欄です。'],
      items: ['何度も書き直したプロフィール', '名前だけの名刺', '空欄の多い手帳'],
      witness: ['相手によって雰囲気がよく変わった。', '一人の時だけ、変な鼻歌を歌っていた。']
    },
    {
      key: 'cause', name: '死因への納得',
      scenes: ['あの瞬間の音だけが、何回も最初から再生されます。', '一秒前の景色と一秒後の景色が、つながりません。', '自分が最後に何を選んだのか、そこだけ曖昧です。'],
      items: ['止まった腕時計', '濡れたハンカチ', '割れた眼鏡'],
      witness: ['急な予定変更を嫌う人だった。', '理由がわからないことを、そのままにできなかった。']
    },
    {
      key: 'unfinished', name: '未完成',
      scenes: ['途中で止まったページの余白が、こちらを見ています。', '最後の一行だけ、誰かの字で続いている気がします。', '工具箱のふたを閉めるタイミングを逃しました。'],
      items: ['未完成の模型', '途中までの楽譜', 'ふたの開いた工具箱'],
      witness: ['完成より、過程の話をしている時の方が楽しそうだった。', '人に任せるのは苦手だが、教えるのは上手かった。']
    }
  ];

  const FIRST_NAMES = ['灯子','玄太','ミサキ','朔也','園乃','千景','巴','晴臣','ゆかり','藤吾','リツ','佐保','八雲','環','初音','宗介','茉莉','伊織','千鳥','六花','澪','周平','カナメ','志乃','夏帆','冬馬','小梅','新太','蛍','真琴','菫','遼','恵那','ナツメ','梢','栄二','鈴','湊','文乃','薫','咲良','鷹雄','由布','凪','コハル','朝彦','紬','蓮','千代','悠里'];
  const LAST_NAMES = ['霧島','水無瀬','有馬','黒谷','白峰','小鳥遊','宵町','森崎','月岡','羽柴','古賀','榊','日下部','七瀬','東雲','椎名','久遠','朝比奈','御影','鳴海'];
  const GENDERS = ['女性','男性','不明','女性','男性'];
  const CAUSES = ['通勤途中の事故','古い病による最期','川辺での転落','職場での過労','大雨の日の迷子','舞台裏の事故','夜道での怪異遭遇','山中での遭難','火事の煙','眠るような急死','海辺での事故','工房での爆発','未確認の神隠し','古い屋敷での転倒','祭りの日の混乱'];
  const OUTFITS = ['黒いスーツ','白いワンピース','古い作業着','学生服','雨合羽','割烹着','ライブTシャツ','喪服','くたびれた制服','旅装束','茶色のコート','花柄の着物'];
  const FACES = ['；_；','・_・','T_T','>_<','¬_¬','；へ；','o_o','-_ -','；△；','・へ・'];
  const COLORS = ['#eaf7ff','#f1ecff','#eafff0','#fff5df','#ffeef6','#e8fbff','#f5f7ff','#edf7e8'];

  const TYPE_RESUME_CUES = {
    ISTJ: ['履歴書の行間がすべて同じ幅。', '椅子を机と平行に直して待っていた。'],
    ISFJ: ['余白に誰かの体調メモがある。', '面談前、隣の椅子のほこりを払っていた。'],
    INFJ: ['「なぜここに来たのか」と欄外に書いている。', '入室前、天井の染みを長く見ていた。'],
    INTJ: ['死因欄の横に小さな矢印と仮説がある。', '質問を予想してメモを三つ用意している。'],
    ISTP: ['必要事項だけが短く書かれている。', '名札の曲がりを一度だけ直してやめた。'],
    ISFP: ['遺品欄に小さな花の絵がある。', '照明が少し眩しそうで、窓側を選んだ。'],
    INFP: ['未練欄を書いては消した跡が濃い。', '履歴書の最後に「本当は」とだけある。'],
    INTP: ['記入欄の外に疑問符が多い。', '面談室の時計のズレに気づいていた。'],
    ESTP: ['欄外に「まあ何とか」と走り書き。', '入室時、ノックより先に顔を出した。'],
    ESFP: ['名前欄の横に小さな笑顔マーク。', '待合室で誰かに話しかけていた。'],
    ENFP: ['履歴書の裏にも案が書いてある。', '待機中、窓の外を見て少し笑った。'],
    ENTP: ['注意事項に小さくツッコミを書いている。', '質問票の形式に文句を言いながら楽しそう。'],
    ESTJ: ['未完了欄に自分で赤線を引いている。', '入室前、順番表の間違いを指摘した。'],
    ESFJ: ['関係者欄だけ文字が丁寧。', '受付にも軽く頭を下げていた。'],
    ENFJ: ['「誰かの役に」と何度も書きかけている。', '後ろの幽霊に席を譲っていた。'],
    ENTJ: ['目標欄だけ筆圧が強い。', '面談時間を確認してから座った。']
  };

  const NEUTRAL_LINES = [
    'その場面を一つだけ教えて',
    '誰の顔が浮かびますか',
    '一番残った音は何ですか',
    '最初の記憶に戻りましょう',
    '言えなかった言葉は？',
    'まだ隠している痛みは？',
    'それは誰に向いた未練ですか',
    '本当に怖いのは何ですか',
    'その続きを聞かせてください',
    '今の言葉、少し置きます'
  ];

  const MISMATCH_LINES = [
    'まず落ち着きましょう',
    '前向きに見ましょう',
    '深く考えすぎかも',
    '形だけでも許しましょう',
    '誰にでもあります',
    '忘れる準備をしましょう',
    '良い面だけ見ましょう',
    '答えを急ぎましょう'
  ];

  const BAD_AXIS_LINES = {
    emotionOnly: ['理屈より気持ちです', '理由はなくても大丈夫'],
    ambiguity: ['曖昧なままでいいです', '決めなくても終われます'],
    minimize: ['それくらい普通です', '気にしすぎです'],
    selfishness: ['自分だけ考えましょう', '相手はもう関係ありません'],
    flatPractical: ['ただの出来事です', '現実はそういうものです'],
    lightCheer: ['笑えば軽くなります', '明るく行きましょう'],
    groundlessComfort: ['全部うまくいきます', 'きっと正しかったです'],
    dramatic: ['これは運命の悲劇です', 'あなたの痛みは特別です'],
    crowd: ['みんなに話しましょう', '周囲を巻き込みましょう'],
    correctness: ['正しさで決めましょう', '間違いは直すべきです'],
    efficiency: ['早く終わらせましょう', '効率よく忘れましょう'],
    forcedClosure: ['今日で答えを決めましょう', '白黒つけましょう'],
    stopThinking: ['考えるのをやめましょう', '疑問は捨てましょう'],
    regretLoop: ['もっと後悔しましょう', '反省だけ続けましょう'],
    pity: ['かわいそうでしたね', '弱かっただけです'],
    coldAnalysis: ['感情は不要です', '数字で見ましょう'],
    isolation: ['一人で終わりましょう', '誰も関係ありません'],
    closedReality: ['もう可能性はありません', '現実だけが答えです'],
    settle: ['普通に収まりましょう', '夢は置いていきましょう'],
    normalization: ['普通が一番です', '目立たない方がいい'],
    obedience: ['従えばよかったですね', '逆らわなければ済んだ'],
    vagueSympathy: ['なんとなく大丈夫です', '気持ちはわかります'],
    smallExistence: ['影響は小さかったです', '誰も変わっていません'],
    selfOnly: ['自分のためだけでいい', '人のことは忘れましょう'],
    weaknessOnly: ['弱さを認めましょう', '負けを受け入れましょう']
  };

  const SURFACE_MOODS = ['静か', '硬い', '早口', '遠慮がち', '皮肉っぽい', 'ぼんやり', '強がり', '落ち着きすぎ'];

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
    resumeCause: document.getElementById('resumeCause'),
    resumeRegret: document.getElementById('resumeRegret'),
    resumeItem: document.getElementById('resumeItem'),
    resumeWitness: document.getElementById('resumeWitness'),
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
    const rand = mulberry32(seed || 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function sampleText(pool, seed) {
    return pick(pool, seed);
  }

  function makeStyleChoice(style, seed, role) {
    return { role, style, text: sampleText(STYLE_TEXTS[style] || STYLE_TEXTS.empathy, seed) };
  }

  function buildGhosts() {
    const ghosts = [];
    for (let i = 0; i < 150; i++) {
      const type = TYPE_ORDER[i % TYPE_ORDER.length];
      const profile = TYPE_PROFILES[type];
      const regret = REGRETS[(i * 7 + Math.floor(i / 4)) % REGRETS.length];
      const fullName = `${pick(LAST_NAMES, i * 3)} ${pick(FIRST_NAMES, i * 5 + Math.floor(i / 2))}`;
      const seed = hashString(`${fullName}-${type}-${regret.key}-${i}`);
      const primaryWant = profile.wants[seed % profile.wants.length];
      const secondaryWant = profile.wants[(seed + 1) % profile.wants.length];
      const opening = sampleText(regret.scenes, seed >> 4);
      const cue = sampleText(TYPE_RESUME_CUES[type], seed >> 6);
      const witness = sampleText(regret.witness, seed >> 8);
      const item = sampleText(regret.items, seed >> 10);
      const age = 17 + (seed % 67);
      const lines = [
        opening,
        sampleText(STYLE_CLUES[primaryWant], seed >> 12),
        sampleText(STYLE_CLUES[secondaryWant], seed >> 14),
        sampleText(STYLE_CLUES[primaryWant], (seed >> 16) + 1)
      ];
      ghosts.push({
        id: `ghost-${String(i + 1).padStart(3, '0')}`,
        name: fullName,
        gender: pick(GENDERS, seed),
        age,
        type,
        typeLabel: `${type}風 / ${profile.label}`,
        cause: pick(CAUSES, seed >> 3),
        regret: regret.name,
        item,
        witness,
        memo: cue,
        outfit: pick(OUTFITS, seed >> 5),
        face: pick(FACES, seed >> 7),
        color: pick(COLORS, seed >> 9),
        mood: pick(SURFACE_MOODS, seed >> 11),
        seed,
        startTrust: 0,
        minSteps: seed % 6 === 0 ? 0 : 1 + (seed % 2),
        requiredTrust: 1 + (seed % 2),
        patience: 4 + (seed % 3),
        primaryWant,
        secondaryWant,
        badAxes: profile.badAxes,
        trait: profile.trait,
        lines
      });
    }
    return ghosts;
  }

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
    els.timerCard.classList.toggle('danger', state === 'interview' && answerTime <= 6);
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
    els.resumeCause.textContent = currentGhost.cause;
    els.resumeRegret.textContent = currentGhost.regret;
    els.resumeItem.textContent = currentGhost.item;
    els.resumeWitness.textContent = currentGhost.witness;
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
    els.speakerMeta.textContent = `気配：${currentGhost.mood}`;
  }

  function atmosphereLabel() {
    if (suspicion >= 3 || trust <= -2) return '決裂寸前';
    if (suspicion >= 2) return '警戒';
    if (trust >= 2) return '近い';
    if (stage >= 2) return '揺れている';
    return 'まだ読めない';
  }

  function renderInterview() {
    const line = currentGhost.lines[Math.min(stage, currentGhost.lines.length - 1)] || currentGhost.lines[0];
    const mistrustText = suspicion >= 2 ? ' ……その言い方、少し怖いです。' : '';
    els.ghostSpeech.textContent = line + mistrustText;
    els.moodChip.textContent = `未練：${currentGhost.regret} / 空気：${atmosphereLabel()}`;
    els.roundChip.textContent = `面談 ${currentIndex + 1}/150`;
    lastChoiceSet = generateChoices();
    renderChoices(lastChoiceSet);
  }

  function allStyles() {
    return Object.keys(STYLE_TEXTS);
  }

  function buildTrapChoice(seed) {
    const axes = currentGhost.badAxes || [];
    const axis = pick(axes, seed);
    const pool = BAD_AXIS_LINES[axis] || MISMATCH_LINES;
    return { role: 'trap', text: sampleText(pool, seed >> 2) };
  }

  function buildMismatchChoice(seed) {
    const wanted = new Set([currentGhost.primaryWant, currentGhost.secondaryWant]);
    const avoid = new Set(currentGhost.badAxes || []);
    const pool = allStyles().filter(s => !wanted.has(s));
    const style = pick(pool, seed >> 3);
    const text = sampleText(STYLE_TEXTS[style], seed >> 5);
    const hard = avoid.has('coldAnalysis') && style === 'analysis';
    return { role: hard ? 'trap' : 'distrust', style, text };
  }

  function buildNeutralChoice(seed) {
    return { role: 'neutral', text: sampleText(NEUTRAL_LINES, seed), trustDelta: (seed % 3 === 0 ? 1 : 0) };
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
      return uniqueChoices([0, 1, 2, 3].map(n => buildTrapChoice(seed + n * 97)), seed + 700);
    }

    if (canAscend) {
      const style = rand() > 0.45 ? currentGhost.primaryWant : currentGhost.secondaryWant;
      choices.push(makeStyleChoice(style, seed + 3, 'ascend'));
    }

    const neutralCount = canAscend ? 1 : (stage === 0 ? 2 : 1);
    for (let i = 0; i < neutralCount; i++) choices.push(buildNeutralChoice(seed + i * 19));

    const addTrap = suspicion >= 1 || (stage > 0 && ((stage + (currentGhost.seed % 4)) % 3 === 0)) || rand() < 0.18;
    choices.push(addTrap ? buildTrapChoice(seed + 211) : buildMismatchChoice(seed + 211));

    while (choices.length < 4) {
      const roll = rand();
      if (suspicion >= 2 || roll < 0.23) choices.push(buildTrapChoice(seed + choices.length * 53));
      else if (roll < 0.62) choices.push(buildMismatchChoice(seed + choices.length * 53));
      else choices.push(buildNeutralChoice(seed + choices.length * 53));
    }

    return uniqueChoices(shuffle(choices.slice(0, 4), seed + 12345), seed + 900);
  }

  function uniqueChoices(choices, seed) {
    const out = [];
    const used = new Set();
    const fillers = shuffle([...NEUTRAL_LINES, ...MISMATCH_LINES], seed);
    choices.forEach(choice => {
      let text = choice.text;
      if (used.has(text)) text = fillers.find(x => !used.has(x)) || `${text}。`;
      used.add(text);
      out.push({ ...choice, text });
    });
    while (out.length < 4) {
      const text = fillers.find(x => !used.has(x)) || '少し待ちましょう';
      used.add(text);
      out.push({ role: 'neutral', text, trustDelta: 0 });
    }
    return out.slice(0, 4);
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
      ascendGhost(choice);
      return;
    }
    if (choice.role === 'trap') {
      els.ghostFigure.classList.add('shake');
      endGame('fail', '面談失敗', `${currentGhost.name}には、その言葉が地雷でした。「${choice.text}」`);
      return;
    }
    if (choice.role === 'distrust') {
      suspicion += 1;
      trust -= 1;
      stage += 1;
      answerTime = 30;
      showToast('少しズレた。不信が増えます。');
      renderInterview();
      updateTimerDisplay();
      return;
    }
    if (choice.role === 'neutral') {
      stage += 1;
      trust += choice.trustDelta || 0;
      if (stage > currentGhost.patience) suspicion += 1;
      answerTime = 30;
      showToast(choice.trustDelta ? '少しだけ話してくれた。' : '話は続いた。まだ核心ではない。');
      renderInterview();
      updateTimerDisplay();
    }
  }

  function ascendGhost(choice) {
    state = 'transition';
    score += 1;
    ascendedTypes[currentGhost.type] = (ascendedTypes[currentGhost.type] || 0) + 1;
    els.score.textContent = String(score);
    els.ghostSpeech.textContent = `……それです。${choice.text}。やっと、置いていけます。`;
    els.choices.innerHTML = '';
    els.ghostFigure.classList.add('ascend');
    showToast(`${currentGhost.name}は気持ちよさそうに成仏した。`);
    setTimeout(() => {
      currentIndex += 1;
      loadGhost();
    }, 1050);
  }

  function tick() {
    if (paused || state === 'transition' || state === 'result' || state === 'title') return;
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
      const styles = profile.wants.map(s => sampleText(STYLE_TEXTS[s], item.ascended)).join(' / ');
      const li = document.createElement('li');
      li.innerHTML = `<strong>${item.type}風 / ${profile.label}</strong><small>${item.ascended}体成仏。相性のよい返答傾向：${styles}</small>`;
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
      if (state === 'title') startGame();
      else if (state === 'resume') beginInterview();
    }
  });

  setScreen('title');
  updateTimerDisplay();
})();
