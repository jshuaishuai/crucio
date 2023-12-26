export const questionsBasic = [
  {
    id: 1,
    text: "你想匹配到什么性别？",
    name: "sex",
    type: "radio",
    options: [
      { optionId: 1, value: "女", score: 0 },
      { optionId: 2, value: "男", score: 1 },
      { optionId: 3, value: "男女皆可", score: 2 },
    ],
  },
  {
    id: 2,
    text: "你对对方的最低学历要求是？",
    name: "education",
    type: "radio",
    options: [
      { optionId: 1, value: "无所谓，你不在意学历", score: 0 },
      { optionId: 2, value: "专科", score: 1 },
      { optionId: 3, value: "本科", score: 2 },
      { optionId: 4, value: "211", score: 3 },
      { optionId: 5, value: "985", score: 4 },
    ],
  },
  // 区分max和min
  {
    id: 3,
    text: "年龄：",
    name: "age",
    type: "range",
    options: [
      { optionId: 1, value: "无所谓，你不在意学历", score: 0 },
      { optionId: 2, value: "专科", score: 0 },
      { optionId: 3, value: "本科", score: 0 },
      { optionId: 4, value: "211", score: 0 },
      { optionId: 5, value: "985", score: 0 },
    ],
  },
];
export const questionsComplex = [
  {
    id: 4,
    text: "你是否注重对方具有好奇心（喜欢问问题、探索未知，追求新奇事物）？",
    name: "curiosity",
    type: "radio",
    options: [
      { optionId: 1, value: "不注重，你不在乎这一点", score: 0 },
      { optionId: 2, value: "略微注重，会增加略微好感", score: 2 },
      { optionId: 3, value: "比较注重，会增加较多好感", score: 4 },
      { optionId: 4, value: "非常注重，这是你恋爱的底线", score: 6 },
    ],
  },
  {
    id: 5,
    text: "你是否注重对方有看书的习惯？",
    name: "readly",
    type: "radio",
    options: [
      { optionId: 1, value: "不注重，你不在乎这一点", score: 0 },
      { optionId: 2, value: "略微注重，会增加略微好感", score: 2 },
      { optionId: 3, value: "比较注重，会增加较多好感", score: 4 },
      { optionId: 4, value: "非常注重，这是你恋爱的底线", score: 6 },
    ],
  },
  {
    id: 6,
    text: "你更希望能和对方交流具体实在、务实的，比如衣食住行，吃喝玩乐的日常内容还是更加抽象的概念理论，比如哲学、心理学、社会学、科学原理等等。",
    name: "abstractness",
    type: "radio",
    options: [
      { optionId: 1, value: "非常倾向于前者，无法接受不这样的", score: -6 },
      { optionId: 2, value: "比较倾向于前者，会增加较多好感", score: -4 },
      { optionId: 3, value: "略微倾向于前者，会增加略微好感", score: -2 },
      { optionId: 4, value: "中立无所谓，你不在乎", score: 0 },
      { optionId: 5, value: "略微倾向于后者，会增加略微好感", score: 2 },
      { optionId: 6, value: "比较倾向于后者。会增加较多好感", score: 4 },
      { optionId: 7, value: "非常倾向于后者，无法接受不这样的", score: 6 },
    ],
  },
  {
    id: 7,
    text: "你是否注重对方追求理智上的兴趣？比如喜欢思考问题、哲学辩论、头脑风暴之类。",
    name: "intellectual",
    type: "radio",
    options: [
      {
        optionId: 1,
        value: "你不喜欢这一点，你更喜欢对方天真、纯真一点",
        score: -4,
      },
      { optionId: 2, value: "不注重，你不在乎这一点", score: 0 },
      { optionId: 3, value: "略微注重，会增加略微好感", score: 2 },
      { optionId: 4, value: "比较注重，会增加较多好感", score: 4 },
      { optionId: 5, value: "非常注重，这是你恋爱的底线 ", score: 6 },
    ],
  },
  {
    id: 8,
    text: "如果对方不大愿意接触和接受新观点，比较保守、不大愿意改变自己的观点你可以接受吗？",
    name: "openl",
    type: "radio",
    options: [
      { optionId: 1, value: "完全不可以，这是你恋爱的底线", score: 6 },
      { optionId: 2, value: "比较不可以，会降低较多好感", score: 4 },
      { optionId: 3, value: "略微不可以，会降低略微好感", score: 2 },
      { optionId: 4, value: "完全可以，你不在乎这一点", score: 0 },
    ],
  },
  {
    id: 9,
    text: "你是否注重对方相比熟悉的事物和环境，更喜欢接触和了解新鲜或者新奇的事物，比如吃不寻常的食物、追求新奇的体验。",
    name: "tryNew",
    type: "radio",
    options: [
      { optionId: 1, value: "不注重，你不在乎这一点", score: 0 },
      { optionId: 2, value: "略微注重，会增加略微好感", score: 2 },
      { optionId: 3, value: "比较注重，会增加较多好感", score: 4 },
      { optionId: 4, value: "非常注重，这是你恋爱的底线", score: 6 },
    ],
  },
  {
    id: 10,
    text: "你是否注重对方追求高于个人或物质利益的目标，比如社会正义和进步、或者个人的道德追求（善良、公正、诚实）之类的。",
    name: "idea",
    type: "radio",
    options: [
      { optionId: 1, value: "不注重，你不在乎这一点", score: 0 },
      { optionId: 2, value: "略微注重，会增加略微好感", score: 2 },
      { optionId: 3, value: "比较注重，会增加较多好感", score: 4 },
      { optionId: 4, value: "非常注重，这是你恋爱的底线", score: 6 },
    ],
  },
  {
    id: 11,
    text: "你能接受和一个因父母反对就放弃心爱的人的人恋爱吗？",
    name: "standard",
    type: "radio",
    options: [
      { optionId: 1, value: "完全不可以接受", score: 6 },
      { optionId: 2, value: "比较不可以，会降低较多好感", score: 4 },
      { optionId: 3, value: "略微不可以，会降低略微好感", score: 2 },
      { optionId: 4, value: "完全可以接受，你不在乎这一点", score: 0 },
    ],
  },
  {
    id: 12,
    text: "你会讨厌那些表达出亲欧美社会、亲西方价值观的态度的人吗？",
    name: "attitudes",
    type: "radio",
    options: [
      { optionId: 1, value: "不讨厌，正好相反你会更喜欢这类人", score: 0 },
      { optionId: 2, value: "中立，不讨厌也不喜欢，你不在乎这一点", score: -2 },
      { optionId: 3, value: "比较讨厌，会降低较多好感", score: -4 },
      { optionId: 4, value: "非常讨厌，你完全无法接受", score: -6 },
    ],
  },
  {
    id: 13,
    text: "你能接受和一个远远看着，不上前阻止他人虐待流浪猫的人恋爱吗？",
    name: "hc",
    type: "radio",
    options: [
      { optionId: 1, value: "完全不可以接受", score: 4 },
      { optionId: 2, value: "可以，只要对方内心是反对虐猫的就行", score: 2 },
      { optionId: 3, value: "完全可以，你不在乎这一点", score: 0 },
    ],
  },
  {
    id: 14,
    text: "你注重对方在风水上的态度和你一样吗？",
    name: "fs",
    type: "radio",
    options: [
      { optionId: 1, value: "不注重，你不在乎这一点", score: 0 },
      { optionId: 2, value: "略微注重，会增加略微好感", score: 2 },
      { optionId: 3, value: "比较注重，会增加较多好感", score: 4 },
      { optionId: 4, value: "非常注重，这是你恋爱的底线", score: 6 },
    ],
  },
  // {
  //   id: 15,
  //   text: "你注重对方在星座上的态度和你一样吗？",
  //   name: "star",
  //   type: "radio",
  //   options: [
  //     { optionId: 1, value: "不注重，你不在乎这一点", score: 0 },
  //     { optionId: 2, value: "略微注重，会增加略微好感", score: 2 },
  //     { optionId: 3, value: "比较注重，会增加较多好感", score: 4 },
  //     { optionId: 4, value: "非常注重，这是你恋爱的底线", score: 6 },
  //   ],
  // },
  // {
  //   id: 16,
  //   text: "你注重对方在中医上的态度和你一样吗？",
  //   name: "chineseMed",
  //   type: "radio",
  //   options: [
  //     { optionId: 1, value: "不注重，你不在乎这一点", score: 0 },
  //     { optionId: 2, value: "略微注重，会增加略微好感", score: 2 },
  //     { optionId: 3, value: "比较注重，会增加较多好感", score: 4 },
  //     { optionId: 4, value: "非常注重，这是你恋爱的底线", score: 6 },
  //   ],
  // },
  {
    id: 17,
    text: "你更倾向于和内向还是外向的人恋爱？",
    name: "characterl",
    type: "radio",
    options: [
      { optionId: 1, value: "非常倾向于内向", score: 6 },
      { optionId: 2, value: "比较倾向于内向", score: 4 },
      { optionId: 3, value: "中立无所谓", score: 0 },
      { optionId: 4, value: "比较倾向于外向", score: -4 },
      { optionId: 5, value: "非常倾向于外向", score: -6 },
    ],
  },
  {
    id: 18,
    text: "你是否注重对方具有条理性，比如做事前喜欢计划好一切，然后根据时间表来执行，也喜欢把生活工作环境保持整洁的环境。",
    name: "organization",
    type: "radio",
    options: [
      { optionId: 1, value: "不注重，你不在乎这一点", score: 0 },
      { optionId: 2, value: "略微注重，会增加略微好感", score: 2 },
      { optionId: 3, value: "比较注重，会增加较多好感", score: 4 },
      { optionId: 4, value: "非常注重，这是你恋爱的底线", score: 6 },
    ],
  },
  {
    id: 19,
    text: "你更倾向于和理性的人还是感性的人恋爱。",
    name: "inductive",
    type: "radio",
    options: [
      { optionId: 1, value: "非常倾向于理性", score: 6 },
      { optionId: 2, value: "比较倾向于理性", score: 4 },
      { optionId: 3, value: "中立无所谓", score: 0 },
      { optionId: 4, value: "比较倾向于感性", score: -4 },
      { optionId: 5, value: "非常倾向于感性", score: -6 },
    ],
  },
  {
    id: 20,
    text: "你注重对方具有冒险精神和非常大胆（愿意承担风险，不害怕挑战和失败）吗？",
    name: "adventure",
    type: "radio",
    options: [
      { optionId: 1, value: "不注重，你不在乎这一点", score: 0 },
      { optionId: 2, value: "略微注重，会增加略微好感", score: 2 },
      { optionId: 3, value: "比较注重，会增加较多好感", score: 4 },
      { optionId: 4, value: "非常注重，这是你恋爱的底线", score: 6 },
    ],
  },
  {
    id: 21,
    text: "你能接受和一个追求平凡、幸福生活，与世无争，对追求事业或者学术上的成就没有兴趣的人恋爱吗？ ",
    name: "achievement",
    type: "radio",
    options: [
      { optionId: 1, value: "完全不可以接受", score: 6 },
      { optionId: 2, value: "比较不可以，会降低较多好感", score: 4 },
      { optionId: 3, value: "略微不可以，会降低略微好感", score: 2 },
      { optionId: 4, value: "完全可以接受，你不在乎这一点", score: 0 },
    ],
  },
  {
    id: 22,
    text: "你注重对方追求美感体验吗？比如会沉醉于建筑服装设计，艺术画作，音乐等等，也喜欢去艺术馆之类的地方吗？",
    name: "aesthetic",
    type: "radio",
    options: [
      { optionId: 1, value: "不注重，你不在乎这一点", score: 0 },
      { optionId: 2, value: "略微注重，会增加略微好感", score: 2 },
      { optionId: 3, value: "比较注重，会增加较多好感", score: 4 },
      { optionId: 4, value: "非常注重，这是你恋爱的底线", score: 6 },
    ],
  },
  {
    id: 23,
    text: "你希望对方是一个寻求刺激的人吗？比如会感兴趣蹦极、过山车、跑酷、极限运动、赛车、看恐怖片等能带来强烈兴奋感的活动。 ",
    name: "excitement",
    type: "radio",
    options: [
      { optionId: 1, value: "非常不希望，你无法接受高度寻求刺激的", score: -6 },
      { optionId: 2, value: "比较不希望，会降低较多好感", score: -4 },
      { optionId: 3, value: "略微不希望，会降低略微好感", score: -2 },
      { optionId: 4, value: "无所谓，你不在乎这一点", score: 0 },
      { optionId: 5, value: "略微希望，会增加略微好感", score: 2 },
      { optionId: 6, value: "比较希望，会增加较多好感", score: 4 },
      { optionId: 7, value: "非常希望，喜欢刺激是你恋爱的底线", score: 6 },
    ],
  },
  {
    id: 24,
    text: "恋爱中，你注重对方是个情感细腻且敏感知性的人吗？  比如喜欢感受自己内心的想法，也很喜欢去感受诗歌散文、艺术作品中包含的细腻情感。日常生活中也很乐意对他人的情绪感同身受。当然也可能会伴随着不够理性、不够客观的缺点。",
    name: "emotion",
    type: "radio",
    options: [
      { optionId: 1, value: "你更喜欢不具备这一特质的", score: -4 },
      { optionId: 2, value: "不注重，你不在乎这一点", score: 0 },
      { optionId: 3, value: "略微注重，会增加略微好感", score: 2 },
      { optionId: 4, value: "比较注重，会增加较多好感", score: 4 },
      { optionId: 5, value: "非常注重，这是你恋爱的底线  ", score: 6 },
    ],
  },
  {
    id: 25,
    text: "你是否希望对方是一个具有反叛性的人？比如在学校的时候就常常表现出对学校规章制度的不满，生活中不愿意遵守传统规则，也不那么愿意听从父母老师的话(如果意见相违背），在工作时也会对严苛的规章制度感到强烈的不满，以及倾向于讨厌和质疑权威。",
    name: "rebel",
    type: "radio",
    options: [
      { optionId: 1, value: "非常不希望，你无法接受高度反叛性的 ", score: -6 },
      { optionId: 2, value: "比较不希望，会降低较多好感", score: -4 },
      { optionId: 3, value: "略微不希望，会降低略微好感", score: -2 },
      { optionId: 4, value: "无所谓，你不在乎这一点", score: 0 },
      { optionId: 5, value: "略微希望，会增加略微好感  ", score: 2 },
      { optionId: 6, value: "比较希望，会增加较多好感  ", score: 4 },
      { optionId: 7, value: "非常希望，具有反叛性是你恋爱的底线  ", score: 6 },
    ],
  },
  {
    id: 26,
    text: "你能接受对方缺乏帮助他人的意愿吗？比如一旦在需要牺牲自己的一部分利益的情况下，就不情愿帮助他人。",
    name: "altruism",
    type: "radio",
    options: [
      { optionId: 1, value: "完全不接受 ", score: 6 },
      { optionId: 2, value: "比较不接受，会降低较多好感", score: 4 },
      { optionId: 3, value: "略微不接受，会降低略微好感 ", score: 2 },
      { optionId: 4, value: "无所谓，你不在乎这一点", score: 0 },
    ],
  },
  {
    id: 27,
    text: "你更倾向于对方是个人主义者还是集体主义者。",
    name: "selfish",
    type: "radio",
    options: [
      {
        optionId: 1,
        value: "完全倾向于个人主义者，且接受不了不这样的",
        score: 6,
      },
      { optionId: 2, value: "比较倾向于个人主义者，会增加较多好感", score: 4 },
      { optionId: 3, value: "略微倾向于个人主义者，会增加略微好感", score: 2 },
      { optionId: 4, value: "中立无所谓，你不在乎", score: 0 },
      { optionId: 5, value: "略微倾向于集体主义者，会增加略微好感", score: -2 },
      { optionId: 6, value: "比较倾向于集体主义者，会增加较多好感", score: -4 },
      {
        optionId: 7,
        value: "完全倾向于集体主义者，且接受不了不这样的",
        score: -6,
      },
    ],
  },
  {
    id: 28,
    text: "你是否倾向于和大男子主义的人恋爱？ 比如：强势霸道，帮你做决定，倾向于把你当成小女孩一样呵护，喜欢比自己能力弱的女生。  ",
    name: "male",
    type: "radio",
    options: [
      {
        optionId: 1,
        value: "非常讨厌大男子主义的男生，你完全无法接受",
        score: -6,
      },
      { optionId: 2, value: "比较讨厌大男子主义的男生", score: -4 },
      { optionId: 3, value: "略微讨厌大男子主义的男生", score: -2 },
      { optionId: 4, value: "中立无所谓", score: 0 },
      { optionId: 5, value: "略微喜欢大男子主义的男生", score: 2 },
      { optionId: 6, value: "比较喜欢大男子主义的男生", score: 4 },
      { optionId: 7, value: "非常喜欢大男子主义的男生", score: 6 },
    ],
  },
];
export const questionsSample = [...questionsBasic, ...questionsComplex];

// export default questionsSample;
