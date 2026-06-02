export const TRAITS = {
  agency: {
    name: "Control sensitivity",
    short: "You notice quickly when a choice that was yours gets made for you.",
    color: "#ff6046"
  },
  candor: {
    name: "Truth over comfort",
    short: "You would rather have the real thing than the kind version.",
    color: "#f8d66d"
  },
  integrity: {
    name: "Principle reflex",
    short: "When easy and right split, your first instinct is to protect the line.",
    color: "#8de6c1"
  },
  distance: {
    name: "Slow-to-warm signal",
    short: "You keep a little distance until people earn the inside lane.",
    color: "#8ab4ff"
  },
  curiosity: {
    name: "Need-to-know pull",
    short: "You would rather know than wonder, even when the answer costs you.",
    color: "#f29dff"
  },
  optimism: {
    name: "Change believer",
    short: "You leave room for people to become different than they were.",
    color: "#b9ef66"
  }
};

export const QUESTIONS = [
  {
    id: "wallet",
    question: "You find a wallet on the street: $200 cash and an ID inside. You...",
    options: [
      { id: "return_all", text: "Return it, cash and all", seedPct: 61, trait: "integrity" },
      { id: "keep_cash", text: "Return it, keep the cash", seedPct: 14, trait: "agency" },
      { id: "take_cash", text: "Take the cash, ditch the wallet", seedPct: 6, trait: "distance" },
      { id: "leave_it", text: "Leave it where it is", seedPct: 19 }
    ],
    seedN: 5128
  },
  {
    id: "death_date",
    question: "You can learn the exact date of your death. Do you want to know?",
    options: [
      { id: "yes", text: "Yes, tell me", seedPct: 28, trait: "curiosity" },
      { id: "no", text: "No, never", seedPct: 72, trait: "distance" }
    ],
    seedN: 4390
  },
  {
    id: "texts",
    question: "You could read your partner's texts with zero chance of being caught. Do you?",
    options: [
      { id: "yes", text: "Yes", seedPct: 33, trait: "agency" },
      { id: "no", text: "No", seedPct: 67, trait: "integrity" }
    ],
    seedN: 6004
  },
  {
    id: "respect",
    question: "If you had to pick one, would you rather be...",
    options: [
      { id: "respected", text: "Respected", seedPct: 64, trait: "distance" },
      { id: "liked", text: "Liked", seedPct: 36, trait: "optimism" }
    ],
    seedN: 5571
  },
  {
    id: "cancelled_plan",
    question: "A plan you were dreading gets cancelled. Your first feeling is...",
    options: [
      { id: "relief", text: "Pure relief", seedPct: 58, trait: "distance" },
      { id: "guilt", text: "A pang of guilt", seedPct: 21, trait: "candor" },
      { id: "disappointment", text: "Disappointment", seedPct: 12, trait: "optimism" },
      { id: "nothing", text: "Nothing, honestly", seedPct: 9, trait: "agency" }
    ],
    seedN: 4812
  },
  {
    id: "talk_alone",
    question: "Be honest: do you talk to yourself out loud when you're alone?",
    options: [
      { id: "all_time", text: "All the time", seedPct: 41, trait: "candor" },
      { id: "sometimes", text: "Sometimes", seedPct: 38, trait: "curiosity" },
      { id: "never", text: "Never", seedPct: 21, trait: "distance" }
    ],
    seedN: 3902
  },
  {
    id: "power",
    question: "One superpower, no take-backs:",
    options: [
      { id: "read_minds", text: "Read minds", seedPct: 31, trait: "curiosity" },
      { id: "invisible", text: "Be invisible", seedPct: 18, trait: "distance" },
      { id: "fly", text: "Fly", seedPct: 24, trait: "optimism" },
      { id: "stop_time", text: "Stop time", seedPct: 27, trait: "agency" }
    ],
    seedN: 7210
  },
  {
    id: "change",
    question: "Do you believe people can truly change?",
    options: [
      { id: "fundamentally", text: "Yes, fundamentally", seedPct: 47, trait: "optimism" },
      { id: "edges", text: "Only at the edges", seedPct: 44, trait: "candor" },
      { id: "no", text: "No", seedPct: 9, trait: "distance" }
    ],
    seedN: 4655
  },
  {
    id: "reply",
    question: "A text comes in that you can answer right now. You...",
    options: [
      { id: "minutes", text: "Reply within minutes", seedPct: 49, trait: "integrity" },
      { id: "sit", text: "Let it sit on purpose", seedPct: 30, trait: "agency" },
      { id: "forget", text: "Forget for hours", seedPct: 21, trait: "distance" }
    ],
    seedN: 5333
  },
  {
    id: "museum",
    question: "A museum is burning. You can save one: a priceless painting or a stranger's cat.",
    options: [
      { id: "painting", text: "The painting", seedPct: 22, trait: "candor" },
      { id: "cat", text: "The cat", seedPct: 78, trait: "integrity" }
    ],
    seedN: 6120
  },
  {
    id: "credit",
    question: "You did most of the work on a team win. The boss praises someone else. You...",
    options: [
      { id: "correct", text: "Correct the record", seedPct: 43, trait: "agency" },
      { id: "slide", text: "Let it slide, quietly note it", seedPct: 48, trait: "distance" },
      { id: "dont_care", text: "Genuinely don't care", seedPct: 9, trait: "candor" }
    ],
    seedN: 4471
  },
  {
    id: "advice",
    question: "When you ask people for advice, you mostly want them to...",
    options: [
      { id: "truth", text: "Tell you the truth", seedPct: 56, trait: "candor" },
      { id: "right", text: "Tell you you're right", seedPct: 44, trait: "optimism" }
    ],
    seedN: 5890
  },
  {
    id: "apology",
    question: "Someone apologizes perfectly but changes nothing. Does it count?",
    options: [
      { id: "no", text: "No, the repair is the apology", seedPct: 52, trait: "integrity" },
      { id: "somewhat", text: "Somewhat, words still matter", seedPct: 34, trait: "optimism" },
      { id: "yes", text: "Yes, if they meant it", seedPct: 14, trait: "candor" }
    ],
    seedN: 5097
  },
  {
    id: "party_exit",
    question: "At a party, your favorite way to leave is...",
    options: [
      { id: "goodbyes", text: "Proper goodbyes", seedPct: 39, trait: "integrity" },
      { id: "ghost", text: "The clean Irish exit", seedPct: 44, trait: "distance" },
      { id: "last_one", text: "Last one standing", seedPct: 17, trait: "curiosity" }
    ],
    seedN: 6762
  },
  {
    id: "receipt",
    question: "You get overcharged $11. The line is long. You...",
    options: [
      { id: "fix", text: "Go back and fix it", seedPct: 46, trait: "agency" },
      { id: "leave", text: "Leave; not worth the friction", seedPct: 37, trait: "distance" },
      { id: "depends", text: "Depends on my mood", seedPct: 17, trait: "candor" }
    ],
    seedN: 5325
  }
];

export function getQuestion(id) {
  return QUESTIONS.find((question) => question.id === id);
}

export function optionSeedCount(question, option) {
  return Math.max(1, Math.round((question.seedN * option.seedPct) / 100));
}
