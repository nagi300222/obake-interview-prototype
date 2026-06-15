(() => {
  'use strict';

  const TYPE_PROFILES = {
    ISTJ: { label: '責任整理型', wants: ['責任', '整理', '事実'], avoid: '気持ちだけで片づけること', trait: '紙の端を何度もそろえる' },
    ISFJ: { label: '献身承認型', wants: ['共感', '承認', '関係'], avoid: '尽くしたことを軽く扱うこと', trait: '自分の話より、残した人の心配をする' },
    INFJ: { label: '意味救済型', wants: ['意味づけ', '共感', '影響'], avoid: '浅い励まし', trait: '言葉を選んでから、遠くを見る' },
    INTJ: { label: '構造納得型', wants: ['分析', '結論', '整理'], avoid: '根拠のない慰め', trait: '泣く前に、状況を説明しようとする' },
    ISTP: { label: '静観現実型', wants: ['簡潔', '事実', '現実'], avoid: '大げさな同情', trait: '聞かれたことだけ短く答える' },
    ISFP: { label: '感性保護型', wants: ['肯定', '余白', '共感'], avoid: '正論でまとめること', trait: '小さな持ち物を指でなぞる' },
    INFP: { label: '本心発見型', wants: ['共感', '本心', '余白'], avoid: '決めつけと効率論', trait: '言いかけて、何度も飲みこむ' },
    INTP: { label: '矛盾解明型', wants: ['分析', '可能性', '整理'], avoid: '考えるのをやめさせること', trait: '同じ話を別の角度から言い直す' },
    ESTP: { label: '実感突破型', wants: ['勢い', '現実', '挑戦'], avoid: '後悔を長引かせること', trait: '座っていても、すぐ立ち上がりそう' },
    ESFP: { label: '記憶祝福型', wants: ['明るさ', '共感', '関係'], avoid: '暗く締めすぎること', trait: '暗い話の途中でも、ふっと笑う' },
    ENFP: { label: '可能性肯定型', wants: ['希望', '意味づけ', '可能性'], avoid: '現実だけで閉じること', trait: '話が飛ぶが、目はずっと真剣' },
    ENTP: { label: '反骨評価型', wants: ['挑戦', '分析', '雑談'], avoid: '普通に丸め込むこと', trait: '少し皮肉っぽく笑う' },
    ESTJ: { label: '成果評価型', wants: ['評価', '結論', '責任'], avoid: '曖昧な同情', trait: '結論から話そうとする' },
    ESFJ: { label: '関係確認型', wants: ['承認', '関係', '共感'], avoid: '一人だけの問題として扱うこと', trait: '誰かの名前を何度も出す' },
    ENFJ: { label: '影響承認型', wants: ['影響', '共感', '関係'], avoid: '残したものを小さく見ること', trait: '自分より、残された人の表情を気にする' },
    ENTJ: { label: '意志継承型', wants: ['継承', '結論', '評価'], avoid: '弱さだけを見ること', trait: '次に何をするかをまだ考えている' }
  };

  const TYPE_ORDER = Object.keys(TYPE_PROFILES);

  const ASCENSION_STYLES = [
    { key: 'chat', name: '雑談成仏', tags: ['雑談', '明るさ', '関係'], hint: '本題の前に、普通の話で息をしたがっている。', ascend: '最後に普通に笑えたから、もう行けます。', reaction: '……今の、ちょっと楽でした。' },
    { key: 'scold', name: '叱責成仏', tags: ['叱る', '責任', '本心'], hint: '許されるより、ちゃんと怒られたい気配がある。', ascend: '怒ってもらえて、やっと止まれました。', reaction: '……はい。誰かに止めてほしかったんです。' },
    { key: 'vent', name: '愚痴成仏', tags: ['愚痴', '傾聴', '共感'], hint: 'きれいな言葉より、ぐちゃぐちゃの愚痴を出したそう。', ascend: '全部言えました。もう十分です。', reaction: '……まだ汚い言葉が出そうです。でも、少し楽です。' },
    { key: 'listen', name: '受け止め成仏', tags: ['共感', '本心', '傾聴'], hint: '解決策より、まず気持ちを受け取ってほしそう。', ascend: '聞いてもらえただけで、軽くなりました。', reaction: '……そこを聞いてほしかったのかもしれません。' },
    { key: 'reason', name: '納得成仏', tags: ['分析', '整理', '事実'], hint: '感情より、筋道が通ると落ち着きそう。', ascend: 'ようやく話の形が見えました。', reaction: '……そうです。順番にすると、少し見えます。' },
    { key: 'closure', name: '区切り成仏', tags: ['結論', '整理', '責任'], hint: '終わらせていいと言われるのを待っている。', ascend: 'ここで終わってもいいんですね。', reaction: '……区切っていいなら、少し立てます。' },
    { key: 'praise', name: '承認成仏', tags: ['承認', '評価', '関係'], hint: '誰かのためにしたことを、ちゃんと見てほしそう。', ascend: '見てくれて、ありがとうございました。', reaction: '……それを誰かに言ってほしかったです。' },
    { key: 'memory', name: '思い出成仏', tags: ['明るさ', '関係', '肯定'], hint: '最後の話より、楽しかった記憶を一緒に持ちたい。', ascend: '楽しかった方を持っていきます。', reaction: '……あ、その話。懐かしいです。' },
    { key: 'space', name: '余白成仏', tags: ['余白', '可能性', '肯定'], hint: '答えを一つに決められると、かえって苦しくなる。', ascend: '決めきれないままでも、いいんですね。', reaction: '……決めなくていいなら、少し息ができます。' },
    { key: 'inherit', name: '継承成仏', tags: ['継承', '希望', '影響'], hint: 'やり残しを、自分だけで抱えなくていいと言われたがっている。', ascend: '続きは、誰かに渡せます。', reaction: '……全部持っていかなくていいんですね。' }
  ];

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

  const LAST_NAMES = ['霧島','水無瀬','有馬','黒谷','白峰','小鳥遊','宵町','森崎','月岡','羽柴','古賀','榊','日下部','七瀬','東雲','椎名','久遠','朝比奈','御影','鳴海','早乙女','八坂','雨宮','御子柴','鞍馬','橘','深山','遠野'];
  const FIRST_NAMES_BY_GENDER = {
    '女性': ['灯子','園乃','千景','ゆかり','佐保','初音','茉莉','千鳥','六花','澪','志乃','夏帆','小梅','菫','恵那','梢','鈴','文乃','咲良','由布','千代','美琴','花音','沙世','杏奈','真帆','朱里','琴葉','和花','奈緒'],
    '男性': ['玄太','朔也','晴臣','藤吾','宗介','周平','冬馬','新太','遼','栄二','朝彦','鷹雄','悠真','貴一','航平','匠','修司','大和','蓮司','直人','圭吾','一成','亮介','史也','拓海','隼人','和馬','壮太'],
    '不明': ['ミサキ','リツ','八雲','環','伊織','カナメ','ナツメ','湊','薫','凪','コハル','紬','蓮','悠里','真琴','蛍','千尋','空','灯','律','結','奏','遥','晶','透','晴','渚','翠']
  };
  const GENDERS = ['女性','男性','女性','男性','不明'];
  const CAUSES = ['通勤途中の事故','古い病による最期','川辺での転落','職場での過労','大雨の日の迷子','舞台裏の事故','夜道での怪異遭遇','山中での遭難','火事の煙','眠るような急死','海辺での事故','工房での爆発','未確認の神隠し','古い屋敷での転倒','祭りの日の混乱'];
  const OUTFITS = ['黒いスーツ','白いワンピース','古い作業着','学生服','雨合羽','割烹着','ライブTシャツ','喪服','くたびれた制服','旅装束','茶色のコート','花柄の着物'];
  const FACES = ['；_；','・_・','T_T','>_<','¬_¬','；へ；','o_o','-_ -','；△；','・へ・'];
  const COLORS = ['#eaf7ff','#f1ecff','#eafff0','#fff5df','#ffeef6','#e8fbff','#f5f7ff','#edf7e8'];

  const RESPONSE_LINES = [
    { text: 'それは、しんどかったですね。', tags: ['共感'], key: 'empathy1' },
    { text: '今の言い方、少し苦しそうです。', tags: ['共感', '本心'], key: 'empathy2' },
    { text: '無理して笑わなくていいです。', tags: ['共感', '傾聴'], key: 'empathy3' },
    { text: 'その痛さは、ここで聞きます。', tags: ['共感', '傾聴'], key: 'empathy4' },
    { text: '本当は、気づいてほしかったんですね。', tags: ['本心', '共感'], key: 'heart1' },
    { text: '言えなかった方が本音かもしれません。', tags: ['本心', '余白'], key: 'heart2' },
    { text: '怒りより、寂しさが残ってますか。', tags: ['本心', '共感'], key: 'heart3' },
    { text: 'まず、順番に分けましょう。', tags: ['分析', '整理'], key: 'logic1' },
    { text: 'そこは一人だけの責任じゃないです。', tags: ['分析', '整理'], key: 'logic2' },
    { text: '起きたことと、感じたことを分けます。', tags: ['分析', '整理'], key: 'logic3' },
    { text: '今の話、原因は二つありそうです。', tags: ['分析', '事実'], key: 'logic4' },
    { text: '最後まで、ちゃんとやってました。', tags: ['責任', '評価'], key: 'duty1' },
    { text: '逃げずに向き合ってましたよ。', tags: ['責任', '承認'], key: 'duty2' },
    { text: 'その役目、投げ出してません。', tags: ['責任', '評価'], key: 'duty3' },
    { text: 'ここで一区切りにして大丈夫です。', tags: ['結論', '整理'], key: 'close1' },
    { text: 'もう、終わらせてもいい頃です。', tags: ['結論', '整理'], key: 'close2' },
    { text: 'ここから先は置いていきましょう。', tags: ['結論', '余白'], key: 'close3' },
    { text: '好きだったままでいいです。', tags: ['肯定', '余白'], key: 'space1' },
    { text: '答えを一つにしなくていいです。', tags: ['余白', '可能性'], key: 'space2' },
    { text: '迷ったままでも、人は進めます。', tags: ['余白', '可能性'], key: 'space3' },
    { text: '楽しかった話も聞きたいです。', tags: ['明るさ', '雑談'], key: 'chat1' },
    { text: 'その人、変な癖ありました？', tags: ['雑談', '明るさ'], key: 'chat2' },
    { text: '最後じゃなくて、途中の話をしましょう。', tags: ['雑談', '関係'], key: 'chat3' },
    { text: '愚痴でいいです。出しましょう。', tags: ['愚痴', '傾聴'], key: 'vent1' },
    { text: 'きれいに話さなくていいです。', tags: ['愚痴', '傾聴'], key: 'vent2' },
    { text: 'その言い分、まず全部聞きます。', tags: ['愚痴', '共感'], key: 'vent3' },
    { text: '少し怒ります。抱えすぎです。', tags: ['叱る', '責任'], key: 'scold1' },
    { text: 'それは、そこで止まらないとだめです。', tags: ['叱る', '本心'], key: 'scold2' },
    { text: '自分を雑に扱いすぎです。', tags: ['叱る', '承認'], key: 'scold3' },
    { text: '変な意地まで、あなたらしいです。', tags: ['挑戦', '肯定'], key: 'rebel1' },
    { text: '普通じゃなかった所も、残しましょう。', tags: ['挑戦', '意味づけ'], key: 'rebel2' },
    { text: '追いかけた時間は、消えてません。', tags: ['希望', '意味づけ'], key: 'hope1' },
    { text: '叶わなかっただけで、無駄じゃないです。', tags: ['希望', '可能性'], key: 'hope2' },
    { text: 'あなたの言葉で助かった人がいます。', tags: ['影響', '関係'], key: 'impact1' },
    { text: '見えない所で、ちゃんと残ってます。', tags: ['影響', '承認'], key: 'impact2' },
    { text: 'その続きは、誰かに渡せます。', tags: ['継承', '希望'], key: 'inherit1' },
    { text: '全部、自分で持たなくていいです。', tags: ['継承', '余白'], key: 'inherit2' },
    { text: 'あの日だけで全部は決まりません。', tags: ['意味づけ', '可能性'], key: 'meaning1' },
    { text: '終わり方より、途中を見ましょう。', tags: ['意味づけ', '事実'], key: 'meaning2' },
    { text: 'あなたがいたことは、消えません。', tags: ['事実', '承認'], key: 'fact1' },
    { text: 'できたことも、確かにあります。', tags: ['事実', '評価'], key: 'fact2' }
  ];

  const WATCH_LINES = [
    { text: 'その時のこと、もう少し聞かせてください。', tags: ['傾聴'] },
    { text: '誰の顔が浮かびましたか？', tags: ['本心', '関係'] },
    { text: '何が一番残っていますか？', tags: ['本心'] },
    { text: 'そこ、ゆっくり見てもいいですか？', tags: ['傾聴'] },
    { text: '今の言い方、少し気になります。', tags: ['本心', '分析'] },
    { text: '最後に見たものは何でしたか？', tags: ['事実'] },
    { text: 'まだ決めつけずに聞きます。', tags: ['余白', '傾聴'] },
    { text: '今の話、少し戻ってもいいですか？', tags: ['整理'] },
    { text: 'それを聞いた時、どう感じましたか？', tags: ['共感'] },
    { text: '言えなかった方を聞いてもいいですか？', tags: ['本心'] },
    { text: '誰にも言ってないこと、ありますか？', tags: ['本心', '傾聴'] },
    { text: 'その話、少しだけ横道にそれてもいいですか？', tags: ['雑談', '余白'] }
  ];

  const SAFE_LINES = [
    { text: '少し落ち着いて話しましょう。', tags: ['傾聴'] },
    { text: '無理に急がなくて大丈夫です。', tags: ['余白'] },
    { text: 'できる範囲で聞きます。', tags: ['傾聴'] },
    { text: '一つずつ確認しましょう。', tags: ['整理'] },
    { text: 'ここでは責めません。', tags: ['共感'] },
    { text: '話せる所だけで大丈夫です。', tags: ['余白'] },
    { text: 'つらければ、少し止まりましょう。', tags: ['共感'] },
    { text: '今の気持ちを置いてみましょう。', tags: ['整理'] },
    { text: '先に水でも飲む感じでいきましょう。', tags: ['雑談'] },
    { text: '今は、話の入口だけで大丈夫です。', tags: ['傾聴'] }
  ];

  const DISTRUST_LINES = [
    'それはもう、過ぎたことです。',
    'みんな似た後悔はあります。',
    '少し気にしすぎかもしれません。',
    '前を向くしかないですね。',
    'そこは割り切りましょう。',
    '相手にも事情があったはずです。',
    '今さら答えは出ないと思います。',
    '悪く考えすぎかもしれません。',
    'その話、長くなりそうですね。',
    'もう十分がんばったのでは？'
  ];

  const TRAP_LINES = [
    'それは、あなたの問題ですね。',
    '忘れた方が楽ですよ。',
    'もう誰も困っていません。',
    '正直、迷惑だったかもしれません。',
    '結果がすべてです。',
    'あなたが選んだことです。',
    'もう黙って休みましょう。',
    'その未練、少し重すぎます。',
    'それを言われても困ります。',
    '成仏できない理由を探してませんか。'
  ];

  const REACTIONS_BY_TAG = {
    '共感': ['……そう言われると、少し息ができます。', 'そこを聞いてほしかったのかもしれません。'],
    '本心': ['……本当は、そっちだったのかも。', '言わないつもりだったのに、出てきました。'],
    '分析': ['……順番にすると、少し見えます。', 'そうです。そこが引っかかっていました。'],
    '整理': ['……散らばっていたものが、少し並びました。'],
    '責任': ['……逃げたわけじゃない、と言ってほしかったです。'],
    '叱る': ['……はい。誰かに止めてほしかったんです。'],
    '愚痴': ['……じゃあ、少しだけ汚く言ってもいいですか。'],
    '雑談': ['……ふふ。そういう話、久しぶりです。'],
    '関係': ['……あの人の名前、まだ言ってもいいんですね。'],
    '結論': ['……そこまでで、よかったんですね。'],
    '余白': ['……決めなくていいなら、少し楽です。'],
    '継承': ['……全部持っていかなくていいんですね。'],
    '評価': ['……そこを、誰かに見てほしかったです。']
  };

  const FALLBACK_REACTIONS = [
    'でも、まだ引っかかってることがあります。',
    '今ので、別の場面を思い出しました。',
    '本当は、そこじゃないのかもしれません。',
    'もう少しだけ、聞いてもらえますか。',
    'ああ……少し近いです。',
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

  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, Math.round(num)));
  }

  function countTagMatches(tags, goodTags) {
    return tags.reduce((sum, tag) => sum + (goodTags.includes(tag) ? 1 : 0), 0);
  }

  function getAgeBand(age) {
    if (age < 20) return { key: 'teen', label: '十代', memo: '言葉は少し早く、感情が先に出る。', mod: { O: 8, C: -6, E: 2, A: 0, N: 7 } };
    if (age < 30) return { key: 'twenties', label: '二十代', memo: 'これからの話になると、声が揺れる。', mod: { O: 6, C: -1, E: 2, A: 0, N: 5 } };
    if (age < 40) return { key: 'thirties', label: '三十代', memo: '仕事や家庭の責任が、言葉の端に出る。', mod: { O: 1, C: 7, E: 0, A: 1, N: 8 } };
    if (age < 50) return { key: 'forties', label: '四十代', memo: '自分より先に、周りの段取りを気にする。', mod: { O: -1, C: 8, E: -1, A: 4, N: 2 } };
    if (age < 65) return { key: 'fifties', label: '五十〜六十代', memo: '話す前に、何を残すかを考えている。', mod: { O: -2, C: 6, E: -2, A: 7, N: -4 } };
    return { key: 'senior', label: '高齢', memo: '昔の話を急がず、確かめるように話す。', mod: { O: -3, C: 4, E: -3, A: 8, N: -6 } };
  }

  function buildBig5(type, gender, age, seed) {
    const rand = mulberry32(seed ^ 0xBAD5EED);
    const noise = () => Math.round((rand() - 0.5) * 18);
    const ageBand = getAgeBand(age);
    const genderMod = gender === '女性' ? { A: 4, N: 2 } : gender === '男性' ? { A: -2, N: -1 } : { A: 0, N: 0 };
    const big5 = {
      E: type[0] === 'E' ? 68 : 34,
      O: type[1] === 'N' ? 68 : 38,
      A: type[2] === 'F' ? 66 : 40,
      C: type[3] === 'J' ? 67 : 39,
      N: type[2] === 'F' ? 58 : 46
    };
    Object.keys(ageBand.mod).forEach(k => { big5[k] += ageBand.mod[k]; });
    Object.keys(genderMod).forEach(k => { big5[k] += genderMod[k]; });
    Object.keys(big5).forEach(k => { big5[k] = clamp(big5[k] + noise(), 12, 88); });
    return { ...big5, ageBand };
  }

  function big5Tags(big5) {
    const tags = [];
    if (big5.E >= 60) tags.push('雑談', '明るさ', '関係');
    if (big5.E <= 40) tags.push('傾聴', '簡潔', '事実');
    if (big5.O >= 60) tags.push('可能性', '余白', '意味づけ');
    if (big5.O <= 40) tags.push('現実', '事実', '整理');
    if (big5.A >= 60) tags.push('共感', '承認', '関係');
    if (big5.A <= 40) tags.push('分析', '評価', '叱る');
    if (big5.C >= 60) tags.push('責任', '結論', '整理');
    if (big5.C <= 40) tags.push('余白', '雑談', '肯定');
    if (big5.N >= 60) tags.push('共感', '傾聴', '本心', '愚痴');
    if (big5.N <= 40) tags.push('現実', '結論', '事実');
    return [...new Set(tags)];
  }

  function big5Memo(big5) {
    const parts = [];
    parts.push(big5.E >= 58 ? '人に話すと調子が戻る' : '話すまでに少し間がある');
    parts.push(big5.A >= 58 ? '相手の顔色を見やすい' : '納得できないと表情が硬くなる');
    parts.push(big5.C >= 58 ? '責任や順番の話に反応する' : '決めつけられると引きやすい');
    parts.push(big5.N >= 58 ? '細かい言葉に傷つきやすい' : '落ち着いた確認には強い');
    return parts.join('。') + '。';
  }

  function chooseStyle(profile, big5, regret, seed) {
    const tags = [...profile.wants, ...big5Tags(big5), regret.name === '怒り' ? '愚痴' : '', regret.name === '夢' ? '希望' : '', regret.name === '未完成' ? '継承' : ''].filter(Boolean);
    const scored = ASCENSION_STYLES.map(style => ({
      style,
      score: style.tags.reduce((sum, tag) => sum + (tags.includes(tag) ? 2 : 0), 0) + (hashString(style.key + seed) % 4)
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored[0].style;
  }

  function buildOpening(regret, type, big5, seed) {
    const tail = big5.E >= 60
      ? ' すみません、誰かに聞いてほしくて。'
      : big5.N >= 60
        ? ' すみません、変な言い方になったらごめんなさい。'
        : type[0] === 'I'
          ? ' すみません、うまく言えないんですけど。'
          : ' いきなりで申し訳ないんですけど。';
    return regret.prompt + tail;
  }

  function buildReveals(ghost) {
    const lines = [
      ghost.regretClue,
      ghost.big5.E >= 60 ? '人のいる場所では平気そうにしていたらしい。' : '待合室では、呼ばれるまでほとんど動かなかった。',
      ghost.big5.C >= 60 ? '予定や約束の話になると、急に姿勢が正しくなる。' : '「ちゃんとしなきゃ」と言われると、少し目を伏せる。',
      ghost.big5.A >= 60 ? '誰かを責めるより、自分を責める言い方が多い。' : '慰められるより、筋が通るかを気にしている。',
      ghost.big5.N >= 60 ? '短い言葉にも、しばらく反応が残る。' : '強い言葉より、曖昧な言葉に首をかしげる。'
    ];
    return shuffle(lines, ghost.seed + 55).slice(0, 4).map(x => `……${x}`);
  }

  function buildGhosts() {
    const ghosts = [];
    for (let i = 0; i < 150; i++) {
      const type = TYPE_ORDER[i % TYPE_ORDER.length];
      const profile = TYPE_PROFILES[type];
      const regret = REGRETS[(i * 7 + Math.floor(i / 4)) % REGRETS.length];
      const gender = pick(GENDERS, i * 13 + 5);
      const firstNames = FIRST_NAMES_BY_GENDER[gender];
      const firstName = pick(firstNames, i * 5 + Math.floor(i / 2));
      const fullName = `${pick(LAST_NAMES, i * 3)} ${firstName}`;
      const seed = hashString(`${fullName}-${gender}-${type}-${regret.key}-${i}`);
      const age = 16 + (seed % 72);
      const big5 = buildBig5(type, gender, age, seed);
      const style = chooseStyle(profile, big5, regret, seed);
      const cause = pick(CAUSES, seed >> 3);
      const outfit = pick(OUTFITS, seed >> 5);
      const face = pick(FACES, seed >> 7);
      const color = pick(COLORS, seed >> 9);
      const goodTags = [...new Set([...profile.wants, ...style.tags, ...big5Tags(big5)])];
      const ascensionMax = 4 + (seed % 3); // 4〜6
      const distrustMax = 3 + ((seed >> 4) % 3); // 3〜5
      const safeIsRisky = big5.A <= 38 || big5.N >= 66 || ['INTJ', 'ENTJ', 'ESTJ', 'ENTP'].includes(type) || style.key === 'scold';
      const ageBand = getAgeBand(age);
      const memo = `${ageBand.label}。${ageBand.memo}${profile.trait}。`;
      const opening = buildOpening(regret, type, big5, seed);

      const ghost = {
        id: `ghost-${String(i + 1).padStart(3, '0')}`,
        name: fullName,
        gender,
        age,
        type,
        typeLabel: `${type}風 / ${profile.label}`,
        cause,
        regret: regret.name,
        regretKey: regret.key,
        regretClue: regret.clue,
        memo,
        outfit,
        face,
        color,
        seed,
        big5,
        style,
        styleKey: style.key,
        styleName: style.name,
        goodTags,
        safeIsRisky,
        minSteps: seed % 6 === 0 ? 1 : 2 + (seed % 2),
        ascensionMax,
        distrustMax,
        avoid: profile.avoid,
        opening,
        usedChoiceTexts: new Set(),
        recentTags: []
      };
      ghost.reveals = buildReveals(ghost);
      ghost.resumeMemo = `${regret.clue} ${style.hint} ${big5Memo(big5)}`;
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
    els.failures.textContent = String(failures);
  }

  function loadGhost() {
    if (currentIndex >= ghosts.length) {
      endGame('clear', '全員成仏', '150体のおばけ全員を送り出しました。霊界面接官、天職かもしれません。');
      return;
    }
    currentGhost = ghosts[currentIndex];
    currentGhost.usedChoiceTexts = new Set();
    currentGhost.recentTags = [];
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
    els.resumeMemo.textContent = currentGhost.resumeMemo;
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
      : (lastReaction || currentGhost.reveals[Math.min(stage - 1, currentGhost.reveals.length - 1)] || currentGhost.opening);
    const dangerText = distrustHp <= 1 ? ' ……すみません、少し怖くなってきました。' : '';
    els.ghostSpeech.textContent = baseLine + dangerText;
    els.moodChip.textContent = `成仏HP ${ascensionHp}/${currentGhost.ascensionMax} ・ 不信HP ${distrustHp}/${currentGhost.distrustMax}`;
    els.roundChip.textContent = `失敗 ${failures}/3 ・ 面談 ${currentIndex + 1}/150`;
    lastChoiceSet = generateChoices();
    renderChoices(lastChoiceSet);
  }

  function withoutUsed(lines) {
    return lines.filter(line => !currentGhost.usedChoiceTexts.has(line.text || line));
  }

  function tagPenalty(tags) {
    return tags.some(tag => currentGhost.recentTags.includes(tag)) ? 1 : 0;
  }

  function pickResponseLine(candidates, seed) {
    const unused = withoutUsed(candidates);
    const pool = unused.length ? unused : candidates;
    const sorted = shuffle(pool, seed).sort((a, b) => tagPenalty(a.tags || []) - tagPenalty(b.tags || []));
    return sorted[0];
  }

  function generateChoices() {
    const seed = currentGhost.seed + stage * 101 + ascensionHp * 31 + distrustHp * 47;
    const rand = mulberry32(seed);
    const choices = [];

    if (distrustHp <= 1) {
      return finalizeChoices([
        makeDistrust(seed),
        makeDistrust(seed + 5),
        makeTrap(seed + 9),
        makeTrap(seed + 13)
      ], seed + 99);
    }

    const canOneShot = stage >= currentGhost.minSteps && ascensionHp <= Math.max(2, Math.ceil(currentGhost.ascensionMax / 2));
    const luckyOneShot = stage >= currentGhost.minSteps + 2 && rand() < 0.15;
    if (canOneShot || luckyOneShot) {
      choices.push({ role: 'ascend', text: currentGhost.style.ascend, tags: currentGhost.style.tags });
    }

    const matching = RESPONSE_LINES.filter(line => countTagMatches(line.tags, currentGhost.goodTags) > 0);
    const near = RESPONSE_LINES.filter(line => countTagMatches(line.tags, currentGhost.goodTags) === 0);
    const pullSlots = choices.length ? 1 : 2;
    for (let i = 0; i < pullSlots; i++) {
      const line = pickResponseLine(matching, seed + 7 + i * 13);
      if (line && !choices.some(c => c.text === line.text)) {
        const matches = countTagMatches(line.tags, currentGhost.goodTags);
        choices.push({ role: 'pull', text: line.text, tags: line.tags, power: Math.min(2, Math.max(1, matches)) });
      }
    }

    const watch = pickResponseLine(WATCH_LINES, seed + 33);
    if (watch) choices.push({ role: 'watch', text: watch.text, tags: watch.tags });

    if (rand() < 0.45) {
      const safe = pickResponseLine(SAFE_LINES, seed + 41);
      if (safe) choices.push({ role: 'safe', text: safe.text, tags: safe.tags, risky: isSafeRisky(safe) });
    } else {
      const line = pickResponseLine(near, seed + 43);
      if (line) choices.push({ role: 'safe', text: line.text, tags: line.tags, risky: true });
    }

    const shouldAddTrap = (stage > 1 && rand() < 0.2) || (distrustHp <= 2 && rand() < 0.45);
    choices.push(shouldAddTrap ? makeTrap(seed + 71) : makeDistrust(seed + 71));

    return finalizeChoices(choices, seed + 12345);
  }

  function isSafeRisky(safe) {
    if (currentGhost.safeIsRisky) return true;
    const match = countTagMatches(safe.tags || [], currentGhost.goodTags);
    return match === 0 && currentGhost.big5.N >= 58;
  }

  function makeDistrust(seed) {
    const pool = DISTRUST_LINES.filter(text => !currentGhost.usedChoiceTexts.has(text));
    return { role: 'distrust', text: pick(pool.length ? pool : DISTRUST_LINES, seed), damage: 1 };
  }

  function makeTrap(seed) {
    const pool = TRAP_LINES.filter(text => !currentGhost.usedChoiceTexts.has(text));
    return { role: 'trap', text: pick(pool.length ? pool : TRAP_LINES, seed) };
  }

  function finalizeChoices(choices, seed) {
    const fillers = [
      ...WATCH_LINES.map(line => ({ role: 'watch', text: line.text, tags: line.tags })),
      ...SAFE_LINES.map(line => ({ role: 'safe', text: line.text, tags: line.tags, risky: false })),
      ...DISTRUST_LINES.map(text => ({ role: 'distrust', text, damage: 1 })),
      ...TRAP_LINES.map(text => ({ role: 'trap', text }))
    ];
    const final = shuffle(uniqueChoices(choices), seed);
    let guard = 0;
    while (final.length < 4 && guard < fillers.length * 3) {
      const next = pick(fillers, seed + guard * 3);
      if (!currentGhost.usedChoiceTexts.has(next.text) && !final.some(choice => choice.text === next.text)) final.push(next);
      guard += 1;
    }
    while (final.length < 4) {
      const next = pick(fillers, seed + final.length * 17);
      if (!final.some(choice => choice.text === next.text)) final.push(next);
      else break;
    }
    return final.slice(0, 4);
  }

  function uniqueChoices(choices) {
    const seen = new Set();
    return choices.filter(choice => {
      if (!choice || !choice.text || seen.has(choice.text)) return false;
      seen.add(choice.text);
      return true;
    });
  }

  function renderChoices(choices) {
    els.choices.innerHTML = '';
    choices.forEach((choice, index) => {
      currentGhost.usedChoiceTexts.add(choice.text);
      const btn = document.createElement('button');
      btn.className = 'choice-button';
      btn.innerHTML = `<span class="choice-number">${index + 1}</span><span class="choice-text">${escapeHtml(choice.text)}</span>`;
      btn.addEventListener('click', () => choose(choice));
      els.choices.appendChild(btn);
    });
  }

  function rememberTags(tags = []) {
    currentGhost.recentTags = [...tags, ...currentGhost.recentTags].slice(0, 6);
  }

  function choose(choice) {
    if (state !== 'interview' || paused) return;
    answerTime = 30;
    rememberTags(choice.tags || []);

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
      lastReaction = ascensionHp <= 0 ? currentGhost.style.reaction : makeGoodReaction(choice.tags, before - ascensionHp);
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
      const matches = countTagMatches(choice.tags || [], currentGhost.goodTags);
      if (matches > 0 && stage > 1) {
        ascensionHp = Math.max(0, ascensionHp - 1);
        lastReaction = makeGoodReaction(choice.tags, 1);
        showToast('聞き方が合った。成仏HPが少し減った。');
        if (ascensionHp <= 0) {
          ascendGhost(currentGhost.style.ascend);
          return;
        }
      } else {
        lastReaction = currentGhost.reveals[Math.min(stage - 1, currentGhost.reveals.length - 1)] || pick(FALLBACK_REACTIONS, currentGhost.seed + stage);
        if (stage >= currentGhost.minSteps + 3) {
          distrustHp = Math.max(0, distrustHp - 1);
          showToast('様子見が長くなり、不信HPが少し減った。');
        } else {
          showToast('様子を見た。HPは大きく動かない。');
        }
      }
      checkDistrustOrContinue();
      return;
    }

    if (choice.role === 'safe') {
      stage += 1;
      const matches = countTagMatches(choice.tags || [], currentGhost.goodTags);
      if (matches > 0 && !choice.risky) {
        lastReaction = '……はい。少し落ち着きました。';
        showToast('無難に会話をつないだ。');
      } else {
        distrustHp = Math.max(0, distrustHp - 1);
        lastReaction = '……悪い言葉じゃないのに、少し遠い気がします。';
        showToast('無難だが、このおばけには少し遠かった。');
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

  function makeGoodReaction(tags, amount) {
    const tagged = tags.flatMap(tag => REACTIONS_BY_TAG[tag] || []);
    if (currentGhost.style && amount >= 2) return currentGhost.style.reaction;
    return tagged.length ? pick(tagged, currentGhost.seed + stage + amount) : pick(FALLBACK_REACTIONS, currentGhost.seed + stage + amount);
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
      li.innerHTML = `<strong>${item.type}風 / ${profile.label}</strong><small>${item.ascended}体成仏。あなたは「${profile.wants.join('・')}」系の聞き方と相性が良さそうです。</small>`;
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
