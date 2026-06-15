(() => {
  'use strict';

  const TOTAL_GHOSTS = 150;
  const RESUME_LIMIT = 20;
  const ANSWER_LIMIT = 30;
  const MAX_FAILURES = 3;

  const TYPE_PROFILES = {
    ISTJ: { label: '責任整理型', wants: ['責任','整理','事実'], avoid: ['雑談','曖昧'], trait: '手順や約束を大事にする' },
    ISFJ: { label: '献身承認型', wants: ['共感','承認','関係'], avoid: ['効率','軽視'], trait: '人のために動くことが多い' },
    INFJ: { label: '意味救済型', wants: ['意味づけ','共感','本心'], avoid: ['浅い励まし'], trait: '出来事の意味を考えこみやすい' },
    INTJ: { label: '構造納得型', wants: ['分析','結論','事実'], avoid: ['根拠なし'], trait: '筋道が通らないと止まれない' },
    ISTP: { label: '静観現実型', wants: ['簡潔','事実','現実'], avoid: ['大げさ'], trait: '短く、現実的な言葉を好む' },
    ISFP: { label: '感性保護型', wants: ['肯定','余白','記憶'], avoid: ['正論'], trait: '好き嫌いや空気を大事にする' },
    INFP: { label: '本心発見型', wants: ['共感','本心','余白'], avoid: ['決めつけ'], trait: '本当の気持ちを探している' },
    INTP: { label: '矛盾解明型', wants: ['分析','可能性','事実'], avoid: ['思考停止'], trait: '疑問が残ると離れられない' },
    ESTP: { label: '実感突破型', wants: ['勢い','現実','叱責'], avoid: ['長い説教'], trait: '体で覚えた感覚を信じる' },
    ESFP: { label: '記憶祝福型', wants: ['雑談','明るさ','記憶'], avoid: ['湿っぽさ'], trait: '人と笑った時間を覚えている' },
    ENFP: { label: '可能性肯定型', wants: ['希望','意味づけ','余白'], avoid: ['現実だけ'], trait: '先の可能性を捨てきれない' },
    ENTP: { label: '反骨評価型', wants: ['挑戦','分析','叱責'], avoid: ['普通扱い'], trait: '変わった見方を面白がる' },
    ESTJ: { label: '成果評価型', wants: ['評価','結論','責任'], avoid: ['曖昧'], trait: '役目や成果を気にする' },
    ESFJ: { label: '関係確認型', wants: ['承認','関係','共感'], avoid: ['孤独扱い'], trait: '周りとのつながりを気にする' },
    ENFJ: { label: '影響承認型', wants: ['影響','共感','関係'], avoid: ['存在の軽視'], trait: '誰かの役に立てたかを気にする' },
    ENTJ: { label: '意志継承型', wants: ['継承','結論','評価'], avoid: ['弱さだけ見る'], trait: '終わり方にも意味を求める' }
  };
  const TYPE_ORDER = Object.keys(TYPE_PROFILES);

  const METHODS = {
    chat: {
      label: '雑談成仏',
      tags: ['雑談','明るさ','記憶','関係'],
      hint: '本題の前に、何でもない話をしたがっている。',
      resume: ['受付で飴の味を聞いてきた。', '面談室の時計を見て「これかわいい」と言った。', '暗い話をする前に、誰かと普通に喋りたそう。'],
      oneShot: ['その話、もう少しだけ一緒に笑いましょう。', '普通の話も、ちゃんと供養になります。'],
      actions: ['仕事の話から少し離れましょう。','その人、どんな笑い方でした？','好きだったものの話を聞かせて。','最近見た夢みたいなものはありますか？','その時の匂い、覚えていますか？'],
      good: ['……そういう話、久しぶりです。死んでから、誰も雑談してくれなくて。','あ、思い出した。くだらない話ほど、残るんですね。','相談って、泣くことだけじゃないんですね。'],
      questions: ['相談員さんは、どうでもいい話も聞いてくれますか？','こんな雑談で、面談の時間を使っていいんですか？','笑ってた時間まで置いていかなくていいですか？']
    },
    scold: {
      label: '叱責成仏',
      tags: ['叱責','責任','結論','肯定'],
      hint: '慰めよりも、誰かに本気で怒ってほしそう。',
      resume: ['椅子に座る前から背筋を伸ばしている。', '「別に平気です」と何度も言う。', '怒りを飲み込む癖が強そう。'],
      oneShot: ['それは怒っていい。あなたは我慢しすぎです。','そこは許さなくていいです。怒りましょう。'],
      actions: ['それは、怒っていい話です。','我慢しすぎです。そこは怒りましょう。','きれいに許さなくていいです。','あなたが悪いで終わらせません。','その扱いは、ひどいです。'],
      good: ['……怒って、いいんですか。私が？','初めて、怒ってもらえた気がします。','やっぱり、あれは変でしたよね。私だけじゃなかった。'],
      questions: ['じゃあ、私が怒ったら、みにくいですか？','怒ってほしいなんて、変ですか？','許せないままでも、行けますか？']
    },
    rant: {
      label: '愚痴成仏',
      tags: ['愚痴','傾聴','共感','余白'],
      hint: '正解よりも、ただ最後まで聞いてほしそう。',
      resume: ['話し出すと止まらなさそうだが、何度も謝っている。', '紙の端に小さく愚痴を書き足している。', '本題を言う前に「こんなこと言っていいですか」と確認してくる。'],
      oneShot: ['今日は愚痴だけで大丈夫です。最後まで聞きます。','きれいに話さなくていいです。全部出しましょう。'],
      actions: ['今日は愚痴だけで大丈夫です。','きれいに話さなくていいです。','悪口っぽくなっても聞きます。','途中でまとめなくていいです。','それ、まだありますよね？'],
      good: ['……あります。まだ、めちゃくちゃあります。','ああ、言っていいんだ。じゃあ言います。','まとめなくていいって言われると、少し楽です。'],
      questions: ['こんなに言って、嫌になりませんか？','愚痴だけで終わっても、いいんですか？','聞いてもらうだけで、成仏する人っているんですか？']
    },
    empathy: {
      label: '受け止め成仏',
      tags: ['共感','本心','関係'],
      hint: '出来事より、気持ちの名前を探している。',
      resume: ['質問されると一度黙る。', '言いかけて、言葉を飲み込むことが多い。', '自分の気持ちを後回しにしてきた気配がある。'],
      oneShot: ['本当は、わかってほしかったんですね。','その寂しさは、ここに置いていって大丈夫です。'],
      actions: ['本当は、誰に気づいてほしかったですか？','その時、何を言ってほしかったですか？','寂しかった、で合っていますか？','強がらなくていいです。','今の声、少し震えています。'],
      good: ['……そうです。気づいてほしかったんです。','名前をつけてもらうと、こんなに静かになるんですね。','泣きたかったのかもしれません。今さらですけど。'],
      questions: ['私、寂しかったって言ってもいいですか？','気づいてほしかっただけなら、わがままですか？','泣いたら、面談は失敗ですか？']
    },
    analysis: {
      label: '納得成仏',
      tags: ['分析','事実','可能性','整理'],
      hint: '慰めより、何が起きたのかを整理したがっている。',
      resume: ['時系列を何度も確認している。', '感情の話になると「順番に」と言う。', '原因が一つに見えないことを気にしている。'],
      oneShot: ['原因は一つじゃありません。順番に分けましょう。','あなた一人の失敗として片づけなくていい。'],
      actions: ['出来事を順番に分けましょう。','あなたの責任と、そうでない所を分けます。','その前に何がありましたか？','一番変えられなかった条件は何ですか？','感情より先に、事実を置きます。'],
      good: ['……それなら、全部が私のせいではないんですね。','順番に見ると、少し息ができます。','あの時、選べないものもありました。'],
      questions: ['整理したら、私は楽になっていいんですか？','原因が一つじゃないなら、誰を恨めばいいんですか？','納得って、許すことと同じですか？']
    },
    closure: {
      label: '区切り成仏',
      tags: ['結論','整理','責任','現実'],
      hint: '話を広げるより、終わらせ方を探している。',
      resume: ['封筒をきれいに閉じたまま持っている。', '「最後に一つだけ」と何度も言う。', '未練を長引かせることを嫌がっている。'],
      oneShot: ['ここで一区切りにして大丈夫です。','もう、最後の扉を閉めても大丈夫です。'],
      actions: ['ここで終わらせる形を作りましょう。','最後に残す言葉を一つ選びましょう。','もう十分やった、と言っていいです。','持っていくものと置いていくものを分けます。','この面談で閉じましょう。'],
      good: ['閉じる……そうか。逃げるんじゃなくて、閉じるんですね。','最後の言葉を決めるなら、少し前に進めそうです。','終わらせても怒られないんですね。'],
      questions: ['区切ったら、本当に置いていけますか？','途中なのに終わらせても、薄情じゃないですか？','最後の言葉って、誰に向ければいいですか？']
    },
    praise: {
      label: '承認成仏',
      tags: ['承認','評価','責任','影響'],
      hint: '褒められたいと言えず、結果だけを気にしている。',
      resume: ['自分の功績を小さく言い直す。', '「大したことないです」が口癖になっている。', '誰かのためにしたことを隠そうとする。'],
      oneShot: ['あなたがやったことは、ちゃんと見えています。','その頑張りは、大したことです。'],
      actions: ['あなたが続けたことを見ます。','大したことない、では流しません。','その役目は軽くありません。','誰かのために動いていましたよね。','結果だけじゃなく、姿勢も残っています。'],
      good: ['……見えてましたか。私、ちゃんとやってましたか。','大したこと、あったんですね。','誰かにそう言われたかったのかもしれません。'],
      questions: ['褒められたくて頑張ったら、だめですか？','自分で認められない時は、誰に預ければいいですか？','報われなかった努力にも、置き場所はありますか？']
    },
    memory: {
      label: '思い出成仏',
      tags: ['記憶','明るさ','関係','肯定'],
      hint: '最後の場面より、楽しかった場面を思い出したがっている。',
      resume: ['古い写真をずっと見ている。', '暗い話の途中で、少しだけ笑う。', '思い出の品を手放すか迷っている。'],
      oneShot: ['最後の日より、笑っていた日も一緒に持っていきましょう。','楽しかった記憶まで置いていかなくていい。'],
      actions: ['一番笑った日の話をしましょう。','最後の日以外も、覚えていますか？','その写真の前後を聞かせてください。','好きだった音はありますか？','楽しかった方から見てもいいです。'],
      good: ['……ありました。くだらないのに、すごく大事な日が。','最後のことばかり見ていました。','あの笑い声、まだ持っていていいんですね。'],
      questions: ['楽しい記憶を持っていくのは、ずるいですか？','最後が悲しいと、全部悲しいことになりますか？','笑ってた私は、本当に私でしたか？']
    },
    space: {
      label: '余白成仏',
      tags: ['余白','可能性','肯定','本心'],
      hint: '答えを決められると、逆に苦しくなりそう。',
      resume: ['履歴書の未記入欄を消さずに残している。', 'どちらとも言えない話を大事にしている。', '結論を急がれると表情が曇る。'],
      oneShot: ['答えを一つに決めなくて大丈夫です。','わからないまま持っていってもいいんです。'],
      actions: ['今は答えを決めなくていいです。','どちらの気持ちも残しておきましょう。','わからない、も返事です。','言葉にならない分は、そのままでいい。','余白ごと持っていきましょう。'],
      good: ['わからないままでいいなら、少し息ができます。','どっちも本当だったんです。たぶん。','決めなくていいって、こんなに楽なんですね。'],
      questions: ['曖昧なまま成仏しても、怒られませんか？','答えを出さない私は、逃げていますか？','矛盾していても、私の気持ちですか？']
    },
    inherit: {
      label: '継承成仏',
      tags: ['継承','影響','希望','結論'],
      hint: '自分の続きが誰かに渡る形を探している。',
      resume: ['封筒に誰かの名前を書いている。', '「続きを頼む」と言いたそうにしている。', '未完成を失敗ではなく、引き継ぎにしたがっている。'],
      oneShot: ['その続きは、誰かに渡していいんです。','あなたの続きを、世界に預けましょう。'],
      actions: ['続きを渡す相手を考えましょう。','全部完成させなくても、残せます。','あなたの影響は、もう誰かに届いています。','終わりではなく、引き継ぎにしましょう。','託す言葉を一緒に作りましょう。'],
      good: ['引き継ぎ……それなら、未完成でもいいんですね。','誰かに渡す形なら、少し誇れます。','置いていくんじゃなくて、預けるんですね。'],
      questions: ['託された人は、迷惑じゃないですか？','私の続きを、誰かが受け取ってくれますか？','完成してなくても、残したことになりますか？']
    }
  };
  const METHOD_KEYS = Object.keys(METHODS);

  const REGRETS = [
    { key: 'family', name: '家族', base: '家族のことが、ずっと引っかかっています。', clue: '最後の一言をまだ探している。' },
    { key: 'love', name: '恋愛', base: '好きだった人のことを、まだ考えてしまいます。', clue: '言えなかった気持ちを持ったまま。' },
    { key: 'friend', name: '友情', base: '友だちと、変な終わり方をしました。', clue: '仲直りよりも、途中で止まった感じが気になる。' },
    { key: 'work', name: '仕事', base: '最後の仕事のことが、どうにも残っています。', clue: '成果より、自分の姿勢を気にしている。' },
    { key: 'dream', name: '夢', base: '追いかけていたものが、途中で止まりました。', clue: '叶ったかより、追った時間の意味を見たい。' },
    { key: 'guilt', name: '罪悪感', base: '誰かを傷つけた気がして、帰れません。', clue: '罰ではなく、向き合い方を探している。' },
    { key: 'anger', name: '怒り', base: '納得できない終わり方でした。', clue: '理不尽をなかったことにされたくない。' },
    { key: 'lonely', name: '孤独', base: '誰にも気づかれないまま終わった気がします。', clue: 'いたことを誰かに見つけてほしい。' },
    { key: 'promise', name: '約束', base: '守れなかった約束があります。', clue: '約束そのものを大切にしている。' },
    { key: 'self', name: '自分探し', base: '結局、自分が何だったのかわかりません。', clue: '肩書きより、選んだものを見たい。' },
    { key: 'cause', name: '死因への納得', base: 'あの瞬間のことを、何度も考えます。', clue: '原因より、受け止め方を探している。' },
    { key: 'unfinished', name: '未完成', base: '途中のものが多すぎて、ここにいます。', clue: '完成より、続きをどう扱うかが大事。' }
  ];

  const LAST_NAMES = ['霧島','水無瀬','有馬','黒谷','白峰','小鳥遊','宵町','森崎','月岡','羽柴','古賀','榊','日下部','七瀬','東雲','椎名','久遠','朝比奈','御影','鳴海','篠原','折原','深山','柳瀬'];
  const FEMALE_NAMES = ['灯子','ミサキ','園乃','千景','巴','ゆかり','佐保','環','初音','茉莉','千鳥','六花','澪','志乃','夏帆','小梅','蛍','菫','恵那','梢','鈴','文乃','咲良','由布','紬','千代'];
  const MALE_NAMES = ['玄太','朔也','晴臣','藤吾','八雲','宗介','伊織','周平','冬馬','新太','遼','栄二','湊','薫','鷹雄','朝彦','蓮','悠里','真一','啓介','修吾','直人'];
  const NEUTRAL_NAMES = ['リツ','カナメ','真琴','ナツメ','凪','コハル','アオ','ヒナタ','千歳','紫苑','律','遥'];
  const GENDERS = ['女性','男性','女性','男性','不明'];
  const CAUSES = ['通勤途中の事故','古い病による最期','川辺での転落','職場での過労','大雨の日の迷子','舞台裏の事故','夜道での怪異遭遇','山中での遭難','火事の煙','眠るような急死','海辺での事故','工房での爆発','未確認の神隠し','古い屋敷での転倒','祭りの日の混乱'];
  const OUTFITS = ['黒いスーツ','白いワンピース','古い作業着','学生服','雨合羽','割烹着','ライブTシャツ','喪服','くたびれた制服','旅装束','茶色のコート','花柄の着物'];
  const FACES = ['；_；','・_・','T_T','>_<','¬_¬','；へ；','o_o','-_-','；△；','・へ・','´･_･`','；ω；'];
  const COLORS = ['#eaf7ff','#f1ecff','#eafff0','#fff5df','#ffeef6','#e8fbff','#f5f7ff','#edf7e8'];

  const PROBE_CHOICES = [
    { text: 'その時、誰の顔が浮かびましたか？', tags: ['本心','関係'], power: 1 },
    { text: '一番ひっかかる場面はどこですか？', tags: ['分析','事実'], power: 1 },
    { text: '何を守ろうとしていましたか？', tags: ['責任','本心'], power: 1 },
    { text: '言えなかった言葉はありますか？', tags: ['本心','共感'], power: 1 },
    { text: '最後に見たものを覚えていますか？', tags: ['記憶','事実'], power: 1 },
    { text: 'その話、誰に聞いてほしかったですか？', tags: ['関係','共感'], power: 1 },
    { text: '今、一番腹が立つのは何ですか？', tags: ['叱責','本心'], power: 1 },
    { text: 'それを言うと、何が怖いですか？', tags: ['本心','余白'], power: 1 },
    { text: '続きがあるなら、どこからですか？', tags: ['継承','可能性'], power: 1 },
    { text: 'その日以外の話も聞かせてください。', tags: ['記憶','雑談'], power: 1 }
  ];

  const WATCH_CHOICES = [
    { text: '少し黙って聞きます。', tags: ['傾聴','余白'] },
    { text: '急がなくていいです。', tags: ['余白','共感'] },
    { text: 'お茶を置きます。続けられる所からで。', tags: ['傾聴','雑談'] },
    { text: '今は、言葉を探す時間にしましょう。', tags: ['余白'] },
    { text: '無理にまとめなくていいです。', tags: ['傾聴','共感'] }
  ];

  const NEUTRAL_CHOICES = [
    { text: 'まず落ち着いて見ていきましょう。', tags: ['整理'] },
    { text: 'それは簡単には決められませんね。', tags: ['余白'] },
    { text: 'ここでは急いで判断しません。', tags: ['傾聴'] },
    { text: '少しずつ話せば大丈夫です。', tags: ['共感'] },
    { text: '言える範囲で構いません。', tags: ['余白'] }
  ];

  const DISTRUST_CHOICES = [
    { text: '考えすぎかもしれません。', tags: ['軽視'] },
    { text: '誰にでもあることです。', tags: ['軽視'] },
    { text: '前向きに切り替えましょう。', tags: ['浅い励まし'] },
    { text: 'そこまで深刻ですか？', tags: ['軽視'] },
    { text: '今さら気にしても仕方ありません。', tags: ['切り捨て'] },
    { text: '相手も困っていたと思います。', tags: ['決めつけ'] },
    { text: '結果だけ見れば済む話です。', tags: ['効率'] },
    { text: 'それは美談にできます。', tags: ['浅い励まし'] }
  ];

  const TRAP_CHOICES = [
    { text: 'もう終わった話にしましょう。' },
    { text: 'あなたが悪いで片づきます。' },
    { text: '黙って消えた方が楽です。' },
    { text: '誰もそこまで覚えていません。' },
    { text: '成仏できない理由を探していますね。' },
    { text: 'その未練は、周りの迷惑です。' },
    { text: '失敗した事実は変わりません。' },
    { text: '許されたいだけでは？' }
  ];

  const GENERIC_GHOST_RESPONSES = {
    good: ['少し、胸のあたりが軽くなりました。','今の言葉で、奥の方が動いた気がします。','それなら、もう少し話せそうです。','……続きが出てきました。'],
    watch: ['……待ってくれるんですね。じゃあ、少しだけ。','沈黙が怖くないのは、久しぶりです。','言葉にするまで、もう少しだけください。','じゃあ、私から聞いてもいいですか？'],
    neutral: ['はい。間違ってはいないと思います。','そうですね……でも、まだ少し遠いです。','言葉はわかります。気持ちが追いついていません。','もう少し、別の角度から話せますか？'],
    distrust: ['今の言い方、少し遠く感じました。','それだと、私が大げさみたいです。','……すみません、ちょっと怖くなりました。','本当に聞いてくれていますか？']
  };

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
    const rand = mulberry32(seed >>> 0);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function buildBig5(seed, type, age) {
    const rand = mulberry32(seed ^ 0xB165);
    const base = () => 35 + Math.floor(rand() * 31);
    const v = {
      openness: base() + (type.includes('N') ? 18 : -6),
      conscientiousness: base() + (type.includes('J') ? 16 : -4),
      extraversion: base() + (type.includes('E') ? 18 : -12),
      agreeableness: base() + (type.includes('F') ? 12 : -2),
      neuroticism: base() + (['INFP','INFJ','ISFP'].includes(type) ? 8 : 0)
    };
    if (age >= 45) {
      v.conscientiousness += 6;
      v.agreeableness += 4;
      v.neuroticism -= 4;
    }
    if (age <= 22) {
      v.openness += 5;
      v.neuroticism += 5;
    }
    Object.keys(v).forEach(k => v[k] = clamp(v[k], 10, 90));
    return v;
  }

  function ageBand(age) {
    if (age <= 19) return '十代';
    if (age <= 29) return '二十代';
    if (age <= 39) return '三十代';
    if (age <= 49) return '四十代';
    if (age <= 64) return '五十〜六十代';
    return '高齢';
  }

  function makeName(seed, gender) {
    const last = pick(LAST_NAMES, seed >> 4);
    const first = gender === '女性'
      ? pick(FEMALE_NAMES, seed >> 8)
      : gender === '男性'
        ? pick(MALE_NAMES, seed >> 8)
        : pick(NEUTRAL_NAMES, seed >> 8);
    return `${last} ${first}`;
  }

  function chooseMethod(type, regretKey, seed) {
    const p = TYPE_PROFILES[type];
    const score = {};
    METHOD_KEYS.forEach(k => score[k] = 0);
    METHOD_KEYS.forEach(k => {
      const m = METHODS[k];
      p.wants.forEach(t => { if (m.tags.includes(t)) score[k] += 3; });
    });
    if (regretKey === 'anger') score.scold += 4;
    if (regretKey === 'lonely') { score.empathy += 2; score.chat += 2; score.rant += 1; }
    if (regretKey === 'work') { score.analysis += 2; score.praise += 2; score.closure += 1; }
    if (regretKey === 'dream') { score.inherit += 2; score.space += 1; score.memory += 1; }
    if (regretKey === 'guilt') { score.analysis += 2; score.closure += 1; score.scold += 1; }
    if (regretKey === 'family' || regretKey === 'friend' || regretKey === 'love') { score.empathy += 2; score.memory += 1; score.rant += 1; }
    if (regretKey === 'unfinished' || regretKey === 'promise') { score.inherit += 2; score.closure += 2; }
    if (regretKey === 'cause') { score.analysis += 3; score.closure += 1; }
    if (regretKey === 'self') { score.space += 2; score.empathy += 1; }
    const best = Object.entries(score).sort((a,b) => (b[1] - a[1]) || ((seed + a[0].charCodeAt(0)) % 7 - (seed + b[0].charCodeAt(0)) % 7));
    return best[seed % 4 === 0 && best[1] ? 1 : 0][0];
  }

  function openingFor(ghost) {
    const extras = {
      chat: '……変な話ですけど、まず普通の話をしてもいいですか。',
      scold: '別に怒ってません。怒ってない、はずです。',
      rant: 'こんなこと言うの、よくないってわかってるんですけど。',
      empathy: 'うまく言えないんですが、胸の奥がずっと冷たいんです。',
      analysis: 'どこから間違えたのか、順番に考えてしまいます。',
      closure: '最後に一つだけ、決めて帰りたいんです。',
      praise: '大した話ではないんです。たぶん、誰でもやることです。',
      memory: '最後の日より前のことが、急に浮かぶんです。',
      space: '正しい答えを出されると、苦しくなる気がします。',
      inherit: '途中で止まったものを、どうしたらいいかわからなくて。'
    };
    return `${ghost.regretBase} ${extras[ghost.methodKey]}`;
  }

  function buildGhosts() {
    const ghosts = [];
    for (let i = 0; i < TOTAL_GHOSTS; i++) {
      const type = TYPE_ORDER[i % TYPE_ORDER.length];
      const profile = TYPE_PROFILES[type];
      const regret = REGRETS[(i * 7 + Math.floor(i / 5)) % REGRETS.length];
      const seed = hashString(`${type}-${regret.key}-${i}-dialogue-v7`);
      const gender = pick(GENDERS, seed);
      const age = 15 + (seed % 72);
      const name = makeName(seed, gender);
      const methodKey = chooseMethod(type, regret.key, seed);
      const method = METHODS[methodKey];
      const big5 = buildBig5(seed, type, age);
      const ascendMax = 4 + (seed % 3) + (big5.neuroticism > 70 ? 1 : 0);
      const distrustMax = 4 + ((seed >> 3) % 2) + (big5.agreeableness > 68 ? 1 : 0) - (big5.neuroticism > 72 ? 1 : 0);
      const resumeNote = pick(method.resume, seed >> 5);
      const ageNote = ageBand(age) === '十代' ? '言葉より表情が先に動く。'
        : ageBand(age) === '高齢' ? '言葉を選ぶ前に、長く黙る。'
        : age >= 40 ? '責任の話になると視線が止まる。'
        : '話しながら何度か言い直す。';
      const personalityNote = `${resumeNote} ${ageNote}`;
      const memo = `${regret.clue} ${method.hint}`;
      const ghost = {
        id: `ghost-${String(i + 1).padStart(3, '0')}`,
        name,
        gender,
        age,
        type,
        typeLabel: `${type}風 / ${profile.label}`,
        profile,
        methodKey,
        methodLabel: method.label,
        method,
        big5,
        cause: pick(CAUSES, seed >> 7),
        regret: regret.name,
        regretBase: regret.base,
        memo,
        resumeNote: personalityNote,
        outfit: pick(OUTFITS, seed >> 9),
        face: pick(FACES, seed >> 11),
        color: pick(COLORS, seed >> 13),
        seed,
        ascendMax,
        distrustMax: Math.max(3, distrustMax),
        opening: '',
        turnLimit: 7 + (seed % 4)
      };
      ghost.opening = openingFor(ghost);
      ghosts.push(ghost);
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
    dialogueLog: document.getElementById('dialogueLog'),
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
  let resumeTime = RESUME_LIMIT;
  let answerTime = ANSWER_LIMIT;
  let paused = false;
  let tickHandle = null;
  let ascendHp = 0;
  let distrustHp = 0;
  let turn = 0;
  let usedTexts = new Set();
  let lastChoiceSet = [];
  let dialogue = [];
  let ascendedTypes = {};
  let attemptedTypes = {};

  function setScreen(name) {
    els.titleScreen.classList.toggle('active', name === 'title');
    els.resumeScreen.classList.toggle('active', name === 'resume');
    els.gameScreen.classList.toggle('active', name === 'game');
    els.resultScreen.classList.toggle('active', name === 'result');
  }

  function updateHeader() {
    els.score.textContent = String(score);
    if (els.failures) els.failures.textContent = String(failures);
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
    paused = false;
    els.pauseOverlay.classList.add('hidden');
    clearInterval(tickHandle);
    tickHandle = setInterval(tick, 100);
    updateHeader();
    loadGhost();
  }

  function loadGhost() {
    if (currentIndex >= ghosts.length) {
      endGame('clear', '全員成仏', `${TOTAL_GHOSTS}体のおばけ全員を送り出しました。面談室、今日は閉店です。`);
      return;
    }
    currentGhost = ghosts[currentIndex];
    attemptedTypes[currentGhost.type] = (attemptedTypes[currentGhost.type] || 0) + 1;
    ascendHp = currentGhost.ascendMax;
    distrustHp = currentGhost.distrustMax;
    turn = 0;
    usedTexts = new Set();
    dialogue = [];
    resumeTime = RESUME_LIMIT;
    answerTime = ANSWER_LIMIT;
    state = 'resume';
    setScreen('resume');
    renderResume();
    updateHeader();
    updateTimerDisplay();
  }

  function renderResume() {
    els.resumeName.textContent = currentGhost.name;
    els.resumeGender.textContent = currentGhost.gender;
    els.resumeAge.textContent = `${currentGhost.age}歳`;
    els.resumeType.textContent = currentGhost.resumeNote;
    els.resumeCause.textContent = currentGhost.cause;
    els.resumeRegret.textContent = currentGhost.regret;
    els.resumeMemo.textContent = currentGhost.memo;
  }

  function beginInterview() {
    if (state !== 'resume') return;
    state = 'interview';
    answerTime = ANSWER_LIMIT;
    setScreen('game');
    renderGhostLook();
    addLog('ghost', currentGhost.opening, true);
    setGhostSpeech(currentGhost.opening);
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
    els.speakerMeta.textContent = `相談者 / ${currentGhost.regret}`;
  }

  function setGhostSpeech(text) {
    els.ghostSpeech.textContent = text;
  }

  function addLog(who, text, silent = false) {
    dialogue.push({ who, text });
    if (dialogue.length > 8) dialogue.shift();
    if (!silent) renderDialogueLog();
  }

  function renderDialogueLog() {
    els.dialogueLog.innerHTML = '';
    dialogue.slice(-5).forEach(item => {
      const div = document.createElement('div');
      div.className = `dialogue-line ${item.who}`;
      const label = item.who === 'user' ? 'あなた' : currentGhost.name.split(' ')[1] || 'おばけ';
      div.innerHTML = `<span class="who">${escapeHtml(label)}：</span>${escapeHtml(item.text)}`;
      els.dialogueLog.appendChild(div);
    });
    els.dialogueLog.scrollTop = els.dialogueLog.scrollHeight;
  }

  function renderInterview() {
    renderDialogueLog();
    els.moodChip.textContent = `成仏HP ${ascendHp}/${currentGhost.ascendMax} ・ 不信HP ${distrustHp}/${currentGhost.distrustMax}`;
    els.roundChip.textContent = `失敗 ${failures}/${MAX_FAILURES} ・ 面談 ${currentIndex + 1}/${TOTAL_GHOSTS}`;
    lastChoiceSet = generateChoices();
    renderChoices(lastChoiceSet);
  }

  function fresh(pool, seed, count) {
    const shuffled = shuffle(pool, seed);
    const out = [];
    for (const item of shuffled) {
      if (!usedTexts.has(item.text) && !out.some(x => x.text === item.text)) out.push({ ...item });
      if (out.length >= count) break;
    }
    if (out.length < count) {
      for (const item of shuffled) {
        if (!out.some(x => x.text === item.text)) out.push({ ...item });
        if (out.length >= count) break;
      }
    }
    return out;
  }

  function methodChoicePool(methodKey) {
    const m = METHODS[methodKey];
    return m.actions.map((text, i) => ({
      text,
      tags: [...m.tags],
      methodKey,
      baseRole: 'approach',
      power: i < 2 ? 2 : 1
    }));
  }

  function oneShotPool(methodKey) {
    const m = METHODS[methodKey];
    return m.oneShot.map(text => ({ text, tags: [...m.tags], methodKey, baseRole: 'ascend', power: 999 }));
  }

  function generateChoices() {
    const seed = currentGhost.seed + turn * 409 + ascendHp * 47 + distrustHp * 83;
    const rand = mulberry32(seed);
    const choices = [];
    const canOneShot = turn >= 2 && ascendHp <= Math.ceil(currentGhost.ascendMax / 2) && distrustHp > 1;

    if (distrustHp <= 1 && rand() < 0.45) {
      choices.push(...fresh(TRAP_CHOICES.map(x => ({ ...x, baseRole: 'trap' })), seed + 11, 1));
    }
    if (canOneShot && rand() < 0.62) {
      choices.push(...fresh(oneShotPool(currentGhost.methodKey), seed + 13, 1));
    }

    choices.push(...fresh(methodChoicePool(currentGhost.methodKey), seed + 17, 1));

    const nearbyKey = METHOD_KEYS[(METHOD_KEYS.indexOf(currentGhost.methodKey) + 1 + (seed % (METHOD_KEYS.length - 1))) % METHOD_KEYS.length];
    choices.push(...fresh(methodChoicePool(nearbyKey), seed + 19, 1));

    if (rand() < 0.5) {
      choices.push(...fresh(PROBE_CHOICES.map(x => ({ ...x, baseRole: 'probe' })), seed + 23, 1));
    } else {
      choices.push(...fresh(WATCH_CHOICES.map(x => ({ ...x, baseRole: 'watch' })), seed + 29, 1));
    }

    const dangerChance = distrustHp <= 2 ? 0.65 : turn > 3 ? 0.42 : 0.25;
    if (rand() < dangerChance) {
      choices.push(...fresh(DISTRUST_CHOICES.map(x => ({ ...x, baseRole: 'distrust' })), seed + 31, 1));
    } else {
      choices.push(...fresh(NEUTRAL_CHOICES.map(x => ({ ...x, baseRole: 'neutral' })), seed + 37, 1));
    }

    while (choices.length < 4) {
      const source = rand() < 0.4 ? PROBE_CHOICES : rand() < 0.75 ? NEUTRAL_CHOICES : DISTRUST_CHOICES;
      const role = source === PROBE_CHOICES ? 'probe' : source === NEUTRAL_CHOICES ? 'neutral' : 'distrust';
      choices.push(...fresh(source.map(x => ({ ...x, baseRole: role })), seed + 41 + choices.length, 1));
      if (choices.length > 8) break;
    }

    const unique = [];
    choices.forEach(c => {
      if (!unique.some(x => x.text === c.text)) unique.push(c);
    });
    return shuffle(unique.slice(0, 4), seed + 12345);
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

  function tagsMatch(choice) {
    const wanted = new Set([...currentGhost.method.tags, ...currentGhost.profile.wants]);
    let score = 0;
    (choice.tags || []).forEach(t => { if (wanted.has(t)) score++; });
    if (choice.methodKey === currentGhost.methodKey) score += 2;
    return score;
  }

  function choose(choice) {
    if (state !== 'interview' || paused) return;
    usedTexts.add(choice.text);
    addLog('user', choice.text);
    answerTime = ANSWER_LIMIT;

    if (choice.baseRole === 'trap') {
      failInterview('地雷回答', `${currentGhost.name}は、面談室の空気に耐えられなくなりました。`);
      return;
    }

    if (choice.baseRole === 'ascend') {
      ascendGhost('oneShot');
      return;
    }

    const match = tagsMatch(choice);
    let outcome = 'neutral';
    let damage = 0;
    let distrustDamage = 0;

    if (choice.baseRole === 'approach' || choice.baseRole === 'probe') {
      if (match >= 3) {
        outcome = 'good';
        damage = choice.power || 1;
      } else if (match >= 1) {
        outcome = 'good';
        damage = 1;
      } else if (currentGhost.profile.avoid.some(a => (choice.tags || []).includes(a))) {
        outcome = 'distrust';
        distrustDamage = 1;
      } else {
        outcome = 'neutral';
      }
    } else if (choice.baseRole === 'watch') {
      outcome = 'watch';
      if (currentGhost.method.tags.includes('傾聴') || currentGhost.method.tags.includes('余白')) damage = 1;
      if (turn > currentGhost.turnLimit) distrustDamage = 1;
    } else if (choice.baseRole === 'neutral') {
      outcome = 'neutral';
      if (currentGhost.big5.neuroticism > 72 && turn > 2) distrustDamage = 1;
    } else if (choice.baseRole === 'distrust') {
      outcome = 'distrust';
      distrustDamage = currentGhost.big5.neuroticism > 70 ? 2 : 1;
    }

    if (damage > 0) ascendHp = Math.max(0, ascendHp - damage);
    if (distrustDamage > 0) distrustHp = Math.max(0, distrustHp - distrustDamage);
    turn += 1;

    if (ascendHp <= 0) {
      ascendGhost('hp');
      return;
    }
    if (distrustHp <= 0) {
      failInterview('不信限界', `${currentGhost.name}は「もう話せません」と席を立ちました。`);
      return;
    }

    const reply = makeGhostReply(outcome, choice, damage, distrustDamage);
    addLog('ghost', reply);
    setGhostSpeech(reply);
    if (turn >= currentGhost.turnLimit + 2 && ascendHp > 1) {
      distrustHp = Math.max(0, distrustHp - 1);
      showToast('会話が長引き、不信HPが削れた。');
    } else {
      const msg = outcome === 'good' ? `成仏HP -${damage}` : outcome === 'watch' ? '様子を見た。相手が話し始めた。' : outcome === 'distrust' ? `不信HP -${distrustDamage}` : 'まだ様子見。';
      showToast(msg);
    }
    renderInterview();
    updateTimerDisplay();
  }

  function makeGhostReply(outcome, choice, damage, distrustDamage) {
    const seed = currentGhost.seed + turn * 97 + choice.text.length * 13;
    if (outcome === 'good') {
      const pool = damage >= 2 ? currentGhost.method.good : GENERIC_GHOST_RESPONSES.good.concat(currentGhost.method.good);
      if (turn % 3 === 1 && currentGhost.method.questions.length) return pick(currentGhost.method.questions, seed);
      return pick(pool, seed);
    }
    if (outcome === 'watch') {
      const pool = GENERIC_GHOST_RESPONSES.watch.concat(currentGhost.method.questions);
      return pick(pool, seed);
    }
    if (outcome === 'distrust') {
      return pick(GENERIC_GHOST_RESPONSES.distrust, seed);
    }
    if (distrustDamage > 0) return '……それ、少しだけ突き放された感じがします。';
    return pick(GENERIC_GHOST_RESPONSES.neutral, seed);
  }

  function ascendGhost(kind) {
    state = 'transition';
    score += 1;
    ascendedTypes[currentGhost.type] = (ascendedTypes[currentGhost.type] || 0) + 1;
    updateHeader();
    const line = kind === 'oneShot'
      ? '……それです。たぶん、ずっとその言葉を待っていました。'
      : '……ありがとうございます。話しているうちに、やっと軽くなりました。';
    addLog('ghost', line);
    setGhostSpeech(line);
    els.choices.innerHTML = '';
    els.ghostFigure.classList.add('ascend');
    showToast(`${currentGhost.methodLabel}：${currentGhost.name}は成仏した。`);
    setTimeout(() => {
      currentIndex += 1;
      loadGhost();
    }, 1300);
  }

  function failInterview(title, reason) {
    state = 'transition';
    failures += 1;
    updateHeader();
    els.ghostFigure.classList.add('shake');
    const line = title === '時間切れ' ? '……すみません。今日は、もう行きます。' : '……やっぱり、ここでもだめでした。';
    addLog('ghost', line);
    setGhostSpeech(line);
    els.choices.innerHTML = '';
    showToast(`${title}：失敗 ${failures}/${MAX_FAILURES}`);
    if (failures >= MAX_FAILURES) {
      setTimeout(() => endGame('fail', '面談終了', `${reason} 3回の成仏失敗で受付終了です。`), 1100);
      return;
    }
    setTimeout(() => {
      currentIndex += 1;
      loadGhost();
    }, 1300);
  }

  function tick() {
    if (paused || state === 'transition' || state === 'result' || state === 'title') return;
    if (state === 'resume') {
      resumeTime = Math.max(0, resumeTime - 0.1);
      if (resumeTime <= 0) beginInterview();
    } else if (state === 'interview') {
      answerTime = Math.max(0, answerTime - 0.1);
      if (answerTime <= 0) {
        failInterview('時間切れ', `${currentGhost.name}への返答が30秒以内に出せませんでした。`);
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
      li.innerHTML = `<strong>${item.type}風 / ${profile.label}</strong><small>${item.ascended}体成仏。あなたは「${profile.wants.slice(0,2).join('・')}」を拾う面談と相性が良さそうです。</small>`;
      els.compatibilityList.appendChild(li);
    });
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.remove('hidden');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => els.toast.classList.add('hidden'), 1250);
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
  updateHeader();
  updateTimerDisplay();
})();
