// USCIS civics question bank — starter set of 20 questions.
//
// IMPORTANT: Translations below were AI-generated as a starting point for the
// prototype. They should be professionally reviewed and corrected by native
// speakers before this app is shown to real applicants. Accuracy matters —
// these answers will be used to evaluate whether a user passed a
// citizenship-test simulation.
//
// Source for English questions/answers: USCIS 2008 civics test (100 questions).
// For the 65/20 exemption set, filter to the subset marked `senior65: true`.

import type { LangCode } from "./languages";

export type CategoryKey =
  | "principles_of_american_democracy"
  | "system_of_government"
  | "rights_and_responsibilities"
  | "american_history_colonial"
  | "american_history_1800s"
  | "recent_history"
  | "geography"
  | "symbols"
  | "holidays";

export interface Translation {
  question: string;
  answers: string[];
}

export interface CivicsQuestion {
  id: number;
  category: CategoryKey;
  /** True for the senior 65/20 exemption short list (20-question bank). */
  senior65: boolean;
  /** English question (canonical). */
  question: string;
  /** Accepted English answers (any one is correct). */
  answers: string[];
  /** Per-language translations. Falls back to English if missing. */
  translations: Partial<Record<LangCode, Translation>>;
}

export const QUESTIONS: CivicsQuestion[] = [
  {
    id: 1,
    category: "principles_of_american_democracy",
    senior65: true,
    question: "What is the supreme law of the land?",
    answers: ["the Constitution"],
    translations: {
      es: {
        question: "¿Cuál es la ley suprema del país?",
        answers: ["la Constitución"],
      },
      ko: {
        question: "이 나라의 최고 법은 무엇입니까?",
        answers: ["헌법"],
      },
      vi: {
        question: "Luật cao nhất của quốc gia là gì?",
        answers: ["Hiến pháp"],
      },
      tl: {
        question: "Ano ang pinakamataas na batas ng bansa?",
        answers: ["ang Konstitusyon"],
      },
      ru: {
        question: "Какой высший закон страны?",
        answers: ["Конституция"],
      },
      ml: {
        question: "രാജ്യത്തിന്റെ പരമോന്നത നിയമം എന്താണ്?",
        answers: ["ഭരണഘടന"],
      },
      hi: {
        question: "देश का सर्वोच्च कानून क्या है?",
        answers: ["संविधान"],
      },
    },
  },
  {
    id: 2,
    category: "principles_of_american_democracy",
    senior65: false,
    question: "What does the Constitution do?",
    answers: [
      "sets up the government",
      "defines the government",
      "protects basic rights of Americans",
    ],
    translations: {
      es: {
        question: "¿Qué hace la Constitución?",
        answers: [
          "establece el gobierno",
          "define el gobierno",
          "protege los derechos básicos de los estadounidenses",
        ],
      },
      ko: {
        question: "헌법은 무엇을 합니까?",
        answers: [
          "정부를 수립합니다",
          "정부를 정의합니다",
          "미국인의 기본 권리를 보호합니다",
        ],
      },
      vi: {
        question: "Hiến pháp làm gì?",
        answers: [
          "thiết lập chính phủ",
          "định nghĩa chính phủ",
          "bảo vệ các quyền cơ bản của người Mỹ",
        ],
      },
      tl: {
        question: "Ano ang ginagawa ng Konstitusyon?",
        answers: [
          "nagtatatag ng pamahalaan",
          "tumutukoy sa pamahalaan",
          "pinoprotektahan ang mga karapatang pangunahin ng mga Amerikano",
        ],
      },
      ru: {
        question: "Что делает Конституция?",
        answers: [
          "устанавливает правительство",
          "определяет правительство",
          "защищает основные права американцев",
        ],
      },
      ml: {
        question: "ഭരണഘടന എന്താണ് ചെയ്യുന്നത്?",
        answers: [
          "സർക്കാർ സ്ഥാപിക്കുന്നു",
          "സർക്കാരിനെ നിർവചിക്കുന്നു",
          "അമേരിക്കക്കാരുടെ അടിസ്ഥാന അവകാശങ്ങൾ സംരക്ഷിക്കുന്നു",
        ],
      },
      hi: {
        question: "संविधान क्या करता है?",
        answers: [
          "सरकार की स्थापना करता है",
          "सरकार को परिभाषित करता है",
          "अमेरिकियों के मौलिक अधिकारों की रक्षा करता है",
        ],
      },
    },
  },
  {
    id: 3,
    category: "principles_of_american_democracy",
    senior65: false,
    question:
      "The idea of self-government is in the first three words of the Constitution. What are these words?",
    answers: ["We the People"],
    translations: {
      es: {
        question:
          "La idea de autogobierno está en las primeras tres palabras de la Constitución. ¿Cuáles son estas palabras?",
        answers: ["Nosotros el Pueblo"],
      },
      ko: {
        question:
          "자치의 개념은 헌법의 첫 세 단어에 있습니다. 이 단어들은 무엇입니까?",
        answers: ["We the People (우리 국민)"],
      },
      vi: {
        question:
          "Ý tưởng tự quản nằm trong ba từ đầu tiên của Hiến pháp. Đó là những từ nào?",
        answers: ["We the People (Chúng tôi nhân dân)"],
      },
      tl: {
        question:
          "Ang ideya ng sariling pamamahala ay nasa unang tatlong salita ng Konstitusyon. Ano ang mga salitang ito?",
        answers: ["We the People (Kaming mga Mamamayan)"],
      },
      ru: {
        question: "Идея самоуправления отражена в первых трёх словах Конституции. Какие это слова?",
        answers: ["We the People (Мы, народ)"],
      },
      ml: {
        question: "സ്വയംഭരണത്തിന്റെ ആശയം ഭരണഘടനയുടെ ആദ്യത്തെ മൂന്ന് വാക്കുകളിലുണ്ട്. ഈ വാക്കുകൾ ഏതാണ്?",
        answers: ["We the People (ഞങ്ങൾ ജനങ്ങൾ)"],
      },
      hi: {
        question: "स्वशासन का विचार संविधान के पहले तीन शब्दों में है। ये शब्द कौन से हैं?",
        answers: ["We the People (हम लोग)"],
      },
    },
  },
  {
    id: 4,
    category: "system_of_government",
    senior65: false,
    question: "What is the economic system in the United States?",
    answers: ["capitalist economy", "market economy"],
    translations: {
      es: {
        question: "¿Cuál es el sistema económico de los Estados Unidos?",
        answers: ["economía capitalista", "economía de mercado"],
      },
      ko: {
        question: "미국의 경제 체제는 무엇입니까?",
        answers: ["자본주의 경제", "시장 경제"],
      },
      vi: {
        question: "Hệ thống kinh tế ở Hoa Kỳ là gì?",
        answers: ["nền kinh tế tư bản", "nền kinh tế thị trường"],
      },
      tl: {
        question: "Ano ang sistemang pang-ekonomiya sa Estados Unidos?",
        answers: ["ekonomiyang kapitalista", "ekonomiya ng merkado"],
      },
      ru: {
        question: "Какая экономическая система в Соединённых Штатах?",
        answers: [
          "капиталистическая экономика",
          "рыночная экономика",
        ],
      },
      ml: {
        question: "അമേരിക്കൻ ഐക്യനാടുകളിലെ സാമ്പത്തിക വ്യവസ്ഥ ഏതാണ്?",
        answers: [
          "മുതലാളിത്ത സമ്പദ്‌വ്യവസ്ഥ",
          "വിപണി സമ്പദ്‌വ്യവസ്ഥ",
        ],
      },
      hi: {
        question: "संयुक्त राज्य अमेरिका में आर्थिक प्रणाली क्या है?",
        answers: [
          "पूंजीवादी अर्थव्यवस्था",
          "बाज़ार अर्थव्यवस्था",
        ],
      },
    },
  },
  {
    id: 5,
    category: "principles_of_american_democracy",
    senior65: false,
    question: 'What is the "rule of law"?',
    answers: [
      "Everyone must follow the law",
      "Leaders must obey the law",
      "Government must obey the law",
      "No one is above the law",
    ],
    translations: {
      es: {
        question: '¿Qué es el "estado de derecho"?',
        answers: [
          "Todos deben obedecer la ley",
          "Los líderes deben obedecer la ley",
          "El gobierno debe obedecer la ley",
          "Nadie está por encima de la ley",
        ],
      },
      ko: {
        question: '"법치주의"란 무엇입니까?',
        answers: [
          "모든 사람은 법을 따라야 합니다",
          "지도자도 법을 지켜야 합니다",
          "정부도 법을 지켜야 합니다",
          "누구도 법 위에 있을 수 없습니다",
        ],
      },
      vi: {
        question: '"Pháp quyền" là gì?',
        answers: [
          "Mọi người phải tuân theo pháp luật",
          "Các nhà lãnh đạo phải tuân theo pháp luật",
          "Chính phủ phải tuân theo pháp luật",
          "Không ai đứng trên pháp luật",
        ],
      },
      tl: {
        question: 'Ano ang "panuntunan ng batas"?',
        answers: [
          "Lahat ay dapat sumunod sa batas",
          "Ang mga pinuno ay dapat sumunod sa batas",
          "Ang pamahalaan ay dapat sumunod sa batas",
          "Walang sinuman ang higit sa batas",
        ],
      },
      ru: {
        question: "Что такое \"верховенство закона\"?",
        answers: [
          "Каждый должен соблюдать закон",
          "Руководители должны соблюдать закон",
          "Правительство должно соблюдать закон",
          "Никто не выше закона",
        ],
      },
      ml: {
        question: "\"നിയമവാഴ്ച\" എന്നാൽ എന്താണ്?",
        answers: [
          "എല്ലാവരും നിയമം പാലിക്കണം",
          "നേതാക്കൾ നിയമം അനുസരിക്കണം",
          "സർക്കാർ നിയമം അനുസരിക്കണം",
          "ആരും നിയമത്തിന് മുകളിലല്ല",
        ],
      },
      hi: {
        question: "\"कानून का शासन\" क्या है?",
        answers: [
          "सभी को कानून का पालन करना चाहिए",
          "नेताओं को कानून का पालन करना चाहिए",
          "सरकार को कानून का पालन करना चाहिए",
          "कोई भी कानून से ऊपर नहीं है",
        ],
      },
    },
  },
  {
    id: 6,
    category: "system_of_government",
    senior65: true,
    question: "Name one branch or part of the government.",
    answers: [
      "Congress",
      "legislative",
      "President",
      "executive",
      "the courts",
      "judicial",
    ],
    translations: {
      es: {
        question: "Mencione una rama o parte del gobierno.",
        answers: [
          "Congreso",
          "legislativa",
          "Presidente",
          "ejecutiva",
          "los tribunales",
          "judicial",
        ],
      },
      ko: {
        question: "정부의 한 부서 또는 부문의 이름을 말하시오.",
        answers: [
          "의회",
          "입법부",
          "대통령",
          "행정부",
          "법원",
          "사법부",
        ],
      },
      vi: {
        question: "Nêu tên một nhánh hoặc một phần của chính phủ.",
        answers: [
          "Quốc hội",
          "lập pháp",
          "Tổng thống",
          "hành pháp",
          "tòa án",
          "tư pháp",
        ],
      },
      tl: {
        question: "Pangalanan ang isang sangay o bahagi ng pamahalaan.",
        answers: [
          "Kongreso",
          "lehislatibo",
          "Pangulo",
          "ehekutibo",
          "mga hukuman",
          "hudisyal",
        ],
      },
      ru: {
        question: "Назовите одну ветвь или часть правительства.",
        answers: [
          "Конгресс",
          "законодательная",
          "Президент",
          "исполнительная",
          "суды",
          "судебная",
        ],
      },
      ml: {
        question: "സർക്കാരിന്റെ ഒരു ശാഖ അല്ലെങ്കിൽ ഭാഗത്തിന്റെ പേര് പറയുക.",
        answers: [
          "കോൺഗ്രസ്",
          "നിയമനിർമ്മാണം",
          "പ്രസിഡന്റ്",
          "എക്സിക്യൂട്ടീവ്",
          "കോടതികൾ",
          "ജുഡീഷ്യൽ",
        ],
      },
      hi: {
        question: "सरकार की एक शाखा या भाग का नाम बताइए।",
        answers: [
          "कांग्रेस",
          "विधायी",
          "राष्ट्रपति",
          "कार्यकारी",
          "न्यायालय",
          "न्यायिक",
        ],
      },
    },
  },
  {
    id: 7,
    category: "system_of_government",
    senior65: false,
    question: "Who is in charge of the executive branch?",
    answers: ["the President"],
    translations: {
      es: {
        question: "¿Quién está a cargo de la rama ejecutiva?",
        answers: ["el Presidente"],
      },
      ko: {
        question: "행정부를 책임지는 사람은 누구입니까?",
        answers: ["대통령"],
      },
      vi: {
        question: "Ai phụ trách nhánh hành pháp?",
        answers: ["Tổng thống"],
      },
      tl: {
        question: "Sino ang nangangasiwa sa sangay na ehekutibo?",
        answers: ["ang Pangulo"],
      },
      ru: {
        question: "Кто возглавляет исполнительную ветвь власти?",
        answers: ["Президент"],
      },
      ml: {
        question: "എക്സിക്യൂട്ടീവ് ശാഖയുടെ ചുമതലയിലുള്ളത് ആരാണ്?",
        answers: ["പ്രസിഡന്റ്"],
      },
      hi: {
        question: "कार्यकारी शाखा का प्रभारी कौन है?",
        answers: ["राष्ट्रपति"],
      },
    },
  },
  {
    id: 8,
    category: "system_of_government",
    senior65: false,
    question: "Who makes federal laws?",
    answers: [
      "Congress",
      "Senate and House (of Representatives)",
      "(U.S. or national) legislature",
    ],
    translations: {
      es: {
        question: "¿Quién hace las leyes federales?",
        answers: [
          "el Congreso",
          "el Senado y la Cámara (de Representantes)",
          "la legislatura (de EE.UU. o nacional)",
        ],
      },
      ko: {
        question: "누가 연방법을 만듭니까?",
        answers: ["의회", "상원과 하원", "(미국 또는 국가) 입법부"],
      },
      vi: {
        question: "Ai làm ra luật liên bang?",
        answers: [
          "Quốc hội",
          "Thượng viện và Hạ viện",
          "cơ quan lập pháp (Hoa Kỳ hoặc quốc gia)",
        ],
      },
      tl: {
        question: "Sino ang gumagawa ng mga pederal na batas?",
        answers: [
          "Kongreso",
          "Senado at Kapulungan (ng mga Kinatawan)",
          "lehislatura (ng U.S. o pambansa)",
        ],
      },
      ru: {
        question: "Кто принимает федеральные законы?",
        answers: [
          "Конгресс",
          "Сенат и Палата представителей",
          "законодательное собрание (США или национальное)",
        ],
      },
      ml: {
        question: "ഫെഡറൽ നിയമങ്ങൾ ആരാണ് ഉണ്ടാക്കുന്നത്?",
        answers: [
          "കോൺഗ്രസ്",
          "സെനറ്റും ജനപ്രതിനിധി സഭയും",
          "(യു.എസ്. അല്ലെങ്കിൽ ദേശീയ) നിയമനിർമ്മാണ സഭ",
        ],
      },
      hi: {
        question: "संघीय कानून कौन बनाता है?",
        answers: [
          "कांग्रेस",
          "सीनेट और प्रतिनिधि सभा",
          "(अमेरिकी या राष्ट्रीय) विधायिका",
        ],
      },
    },
  },
  {
    id: 9,
    category: "system_of_government",
    senior65: true,
    question: "What are the two parts of the U.S. Congress?",
    answers: ["the Senate and House (of Representatives)"],
    translations: {
      es: {
        question: "¿Cuáles son las dos partes del Congreso de los EE. UU.?",
        answers: ["el Senado y la Cámara (de Representantes)"],
      },
      ko: {
        question: "미국 의회의 두 부분은 무엇입니까?",
        answers: ["상원과 하원"],
      },
      vi: {
        question: "Hai phần của Quốc hội Hoa Kỳ là gì?",
        answers: ["Thượng viện và Hạ viện"],
      },
      tl: {
        question: "Ano ang dalawang bahagi ng Kongreso ng U.S.?",
        answers: ["ang Senado at Kapulungan (ng mga Kinatawan)"],
      },
      ru: {
        question: "Каковы две части Конгресса США?",
        answers: ["Сенат и Палата представителей"],
      },
      ml: {
        question: "യു.എസ്. കോൺഗ്രസിന്റെ രണ്ട് ഭാഗങ്ങൾ ഏതാണ്?",
        answers: ["സെനറ്റും ജനപ്രതിനിധി സഭയും"],
      },
      hi: {
        question: "अमेरिकी कांग्रेस के दो भाग कौन से हैं?",
        answers: ["सीनेट और प्रतिनिधि सभा"],
      },
    },
  },
  {
    id: 10,
    category: "system_of_government",
    senior65: false,
    question: "How many U.S. Senators are there?",
    answers: ["one hundred (100)"],
    translations: {
      es: {
        question: "¿Cuántos senadores de los EE. UU. hay?",
        answers: ["cien (100)"],
      },
      ko: {
        question: "미국 상원 의원은 몇 명입니까?",
        answers: ["100명"],
      },
      vi: {
        question: "Có bao nhiêu Thượng nghị sĩ Hoa Kỳ?",
        answers: ["một trăm (100)"],
      },
      tl: {
        question: "Ilan ang mga senador ng U.S.?",
        answers: ["isang daan (100)"],
      },
      ru: {
        question: "Сколько сенаторов в США?",
        answers: ["сто (100)"],
      },
      ml: {
        question: "എത്ര യു.എസ്. സെനറ്റർമാർ ഉണ്ട്?",
        answers: ["നൂറ് (100)"],
      },
      hi: {
        question: "अमेरिका में कितने सीनेटर हैं?",
        answers: ["एक सौ (100)"],
      },
    },
  },
  {
    id: 11,
    category: "system_of_government",
    senior65: true,
    question: "We elect a U.S. Senator for how many years?",
    answers: ["six (6)"],
    translations: {
      es: {
        question: "¿Por cuántos años elegimos a un senador de los EE. UU.?",
        answers: ["seis (6)"],
      },
      ko: {
        question: "미국 상원 의원은 몇 년 임기로 선출됩니까?",
        answers: ["6년"],
      },
      vi: {
        question: "Chúng ta bầu một Thượng nghị sĩ Hoa Kỳ trong bao nhiêu năm?",
        answers: ["sáu (6)"],
      },
      tl: {
        question: "Sa loob ng ilang taon natin hinahalal ang isang Senador ng U.S.?",
        answers: ["anim (6)"],
      },
      ru: {
        question: "На сколько лет мы избираем сенатора США?",
        answers: ["шесть (6)"],
      },
      ml: {
        question: "നമ്മൾ ഒരു യു.എസ്. സെനറ്ററെ എത്ര വർഷത്തേക്ക് തിരഞ്ഞെടുക്കുന്നു?",
        answers: ["ആറ് (6)"],
      },
      hi: {
        question: "हम एक अमेरिकी सीनेटर को कितने वर्षों के लिए चुनते हैं?",
        answers: ["छह (6)"],
      },
    },
  },
  {
    id: 12,
    category: "system_of_government",
    senior65: false,
    question: "The House of Representatives has how many voting members?",
    answers: ["four hundred thirty-five (435)"],
    translations: {
      es: {
        question:
          "¿Cuántos miembros con derecho a voto tiene la Cámara de Representantes?",
        answers: ["cuatrocientos treinta y cinco (435)"],
      },
      ko: {
        question: "하원에는 투표권이 있는 의원이 몇 명 있습니까?",
        answers: ["435명"],
      },
      vi: {
        question: "Hạ viện có bao nhiêu thành viên có quyền bỏ phiếu?",
        answers: ["bốn trăm ba mươi lăm (435)"],
      },
      tl: {
        question:
          "Ilan ang mga miyembrong may karapatang bumoto sa Kapulungan ng mga Kinatawan?",
        answers: ["apat na raan tatlumpu't lima (435)"],
      },
      ru: {
        question: "Сколько голосующих членов в Палате представителей?",
        answers: ["четыреста тридцать пять (435)"],
      },
      ml: {
        question: "ജനപ്രതിനിധി സഭയിൽ വോട്ടവകാശമുള്ള എത്ര അംഗങ്ങളുണ്ട്?",
        answers: ["നാനൂറ്റി മുപ്പത്തിയഞ്ച് (435)"],
      },
      hi: {
        question: "प्रतिनिधि सभा में कितने मतदान सदस्य हैं?",
        answers: ["चार सौ पैंतीस (435)"],
      },
    },
  },
  {
    id: 13,
    category: "system_of_government",
    senior65: false,
    question: "We elect a U.S. Representative for how many years?",
    answers: ["two (2)"],
    translations: {
      es: {
        question:
          "¿Por cuántos años elegimos a un representante de los EE. UU.?",
        answers: ["dos (2)"],
      },
      ko: {
        question: "미국 하원 의원은 몇 년 임기로 선출됩니까?",
        answers: ["2년"],
      },
      vi: {
        question:
          "Chúng ta bầu một Dân biểu Hoa Kỳ trong bao nhiêu năm?",
        answers: ["hai (2)"],
      },
      tl: {
        question:
          "Sa loob ng ilang taon natin hinahalal ang isang Kinatawan ng U.S.?",
        answers: ["dalawa (2)"],
      },
      ru: {
        question: "На сколько лет мы избираем члена Палаты представителей США?",
        answers: ["два (2)"],
      },
      ml: {
        question: "നമ്മൾ ഒരു യു.എസ്. പ്രതിനിധിയെ എത്ര വർഷത്തേക്ക് തിരഞ്ഞെടുക്കുന്നു?",
        answers: ["രണ്ട് (2)"],
      },
      hi: {
        question: "हम एक अमेरिकी प्रतिनिधि को कितने वर्षों के लिए चुनते हैं?",
        answers: ["दो (2)"],
      },
    },
  },
  {
    id: 14,
    category: "system_of_government",
    senior65: true,
    question: "Who is the Commander in Chief of the military?",
    answers: ["the President"],
    translations: {
      es: {
        question: "¿Quién es el Comandante en Jefe de las Fuerzas Armadas?",
        answers: ["el Presidente"],
      },
      ko: {
        question: "군 통수권자는 누구입니까?",
        answers: ["대통령"],
      },
      vi: {
        question: "Ai là Tổng tư lệnh quân đội?",
        answers: ["Tổng thống"],
      },
      tl: {
        question: "Sino ang Punong Kumander ng militar?",
        answers: ["ang Pangulo"],
      },
      ru: {
        question: "Кто является Главнокомандующим вооружёнными силами?",
        answers: ["Президент"],
      },
      ml: {
        question: "സൈന്യത്തിന്റെ പരമോന്നത സേനാധിപൻ ആരാണ്?",
        answers: ["പ്രസിഡന്റ്"],
      },
      hi: {
        question: "सेना का प्रधान सेनापति कौन है?",
        answers: ["राष्ट्रपति"],
      },
    },
  },
  {
    id: 15,
    category: "geography",
    senior65: true,
    question: "What is the capital of the United States?",
    answers: ["Washington, D.C."],
    translations: {
      es: {
        question: "¿Cuál es la capital de los Estados Unidos?",
        answers: ["Washington, D.C."],
      },
      ko: {
        question: "미국의 수도는 어디입니까?",
        answers: ["워싱턴 D.C."],
      },
      vi: {
        question: "Thủ đô của Hoa Kỳ là gì?",
        answers: ["Washington, D.C."],
      },
      tl: {
        question: "Ano ang kabisera ng Estados Unidos?",
        answers: ["Washington, D.C."],
      },
      ru: {
        question: "Какая столица Соединённых Штатов?",
        answers: ["Вашингтон, округ Колумбия"],
      },
      ml: {
        question: "അമേരിക്കൻ ഐക്യനാടുകളുടെ തലസ്ഥാനം എന്താണ്?",
        answers: ["വാഷിംഗ്ടൺ, ഡി.സി."],
      },
      hi: {
        question: "संयुक्त राज्य अमेरिका की राजधानी क्या है?",
        answers: ["वाशिंगटन, डी.सी."],
      },
    },
  },
  {
    id: 16,
    category: "geography",
    senior65: false,
    question: "Where is the Statue of Liberty?",
    answers: [
      "New York (Harbor)",
      "Liberty Island",
      "on the Hudson (River)",
      "New Jersey",
    ],
    translations: {
      es: {
        question: "¿Dónde está la Estatua de la Libertad?",
        answers: [
          "Nueva York (Puerto)",
          "Isla de la Libertad",
          "en el (Río) Hudson",
          "Nueva Jersey",
        ],
      },
      ko: {
        question: "자유의 여신상은 어디에 있습니까?",
        answers: [
          "뉴욕 (항구)",
          "리버티 섬",
          "허드슨 (강) 위",
          "뉴저지",
        ],
      },
      vi: {
        question: "Tượng Nữ thần Tự do ở đâu?",
        answers: [
          "(Cảng) New York",
          "Đảo Liberty",
          "trên (Sông) Hudson",
          "New Jersey",
        ],
      },
      tl: {
        question: "Saan matatagpuan ang Estatwa ng Kalayaan?",
        answers: [
          "New York (Daungan)",
          "Liberty Island",
          "sa (Ilog) Hudson",
          "New Jersey",
        ],
      },
      ru: {
        question: "Где находится Статуя Свободы?",
        answers: [
          "Нью-Йорк (гавань)",
          "остров Либерти",
          "на реке Гудзон",
          "Нью-Джерси",
        ],
      },
      ml: {
        question: "സ്റ്റാച്യു ഓഫ് ലിബർട്ടി എവിടെയാണ്?",
        answers: [
          "ന്യൂയോർക്ക് (തുറമുഖം)",
          "ലിബർട്ടി ദ്വീപ്",
          "ഹഡ്സൺ (നദി) യിൽ",
          "ന്യൂജേഴ്സി",
        ],
      },
      hi: {
        question: "स्टैच्यू ऑफ लिबर्टी कहाँ है?",
        answers: [
          "न्यूयॉर्क (बंदरगाह)",
          "लिबर्टी द्वीप",
          "हडसन (नदी) पर",
          "न्यू जर्सी",
        ],
      },
    },
  },
  {
    id: 17,
    category: "symbols",
    senior65: false,
    question: "Why does the flag have 13 stripes?",
    answers: [
      "because there were 13 original colonies",
      "because the stripes represent the original colonies",
    ],
    translations: {
      es: {
        question: "¿Por qué la bandera tiene 13 franjas?",
        answers: [
          "porque había 13 colonias originales",
          "porque las franjas representan las colonias originales",
        ],
      },
      ko: {
        question: "왜 국기에는 13개의 줄무늬가 있습니까?",
        answers: [
          "13개의 원래 식민지가 있었기 때문에",
          "줄무늬는 원래 식민지를 나타내기 때문에",
        ],
      },
      vi: {
        question: "Tại sao lá cờ có 13 sọc?",
        answers: [
          "vì có 13 thuộc địa ban đầu",
          "vì các sọc đại diện cho các thuộc địa ban đầu",
        ],
      },
      tl: {
        question: "Bakit may 13 guhit ang bandila?",
        answers: [
          "dahil mayroong 13 orihinal na kolonya",
          "dahil ang mga guhit ay kumakatawan sa orihinal na mga kolonya",
        ],
      },
      ru: {
        question: "Почему на флаге 13 полос?",
        answers: [
          "потому что было 13 первоначальных колоний",
          "потому что полосы представляют первоначальные колонии",
        ],
      },
      ml: {
        question: "പതാകയിൽ 13 വരകൾ ഉള്ളത് എന്തുകൊണ്ടാണ്?",
        answers: [
          "13 യഥാർത്ഥ കോളനികൾ ഉണ്ടായിരുന്നതുകൊണ്ട്",
          "വരകൾ യഥാർത്ഥ കോളനികളെ പ്രതിനിധീകരിക്കുന്നതുകൊണ്ട്",
        ],
      },
      hi: {
        question: "ध्वज में 13 धारियाँ क्यों हैं?",
        answers: [
          "क्योंकि 13 मूल उपनिवेश थे",
          "क्योंकि धारियाँ मूल उपनिवेशों का प्रतिनिधित्व करती हैं",
        ],
      },
    },
  },
  {
    id: 18,
    category: "symbols",
    senior65: true,
    question: "Why does the flag have 50 stars?",
    answers: [
      "because there is one star for each state",
      "because each star represents a state",
      "because there are 50 states",
    ],
    translations: {
      es: {
        question: "¿Por qué la bandera tiene 50 estrellas?",
        answers: [
          "porque hay una estrella por cada estado",
          "porque cada estrella representa un estado",
          "porque hay 50 estados",
        ],
      },
      ko: {
        question: "왜 국기에는 50개의 별이 있습니까?",
        answers: [
          "각 주마다 하나의 별이 있기 때문에",
          "각 별은 한 주를 나타내기 때문에",
          "50개의 주가 있기 때문에",
        ],
      },
      vi: {
        question: "Tại sao lá cờ có 50 ngôi sao?",
        answers: [
          "vì mỗi tiểu bang có một ngôi sao",
          "vì mỗi ngôi sao đại diện cho một tiểu bang",
          "vì có 50 tiểu bang",
        ],
      },
      tl: {
        question: "Bakit may 50 bituin ang bandila?",
        answers: [
          "dahil may isang bituin para sa bawat estado",
          "dahil ang bawat bituin ay kumakatawan sa isang estado",
          "dahil may 50 estado",
        ],
      },
      ru: {
        question: "Почему на флаге 50 звёзд?",
        answers: [
          "потому что одна звезда на каждый штат",
          "потому что каждая звезда представляет штат",
          "потому что есть 50 штатов",
        ],
      },
      ml: {
        question: "പതാകയിൽ 50 നക്ഷത്രങ്ങൾ ഉള്ളത് എന്തുകൊണ്ടാണ്?",
        answers: [
          "ഓരോ സംസ്ഥാനത്തിനും ഒരു നക്ഷത്രമുണ്ട്",
          "ഓരോ നക്ഷത്രവും ഒരു സംസ്ഥാനത്തെ പ്രതിനിധീകരിക്കുന്നു",
          "50 സംസ്ഥാനങ്ങൾ ഉള്ളതുകൊണ്ട്",
        ],
      },
      hi: {
        question: "ध्वज में 50 तारे क्यों हैं?",
        answers: [
          "क्योंकि प्रत्येक राज्य के लिए एक तारा है",
          "क्योंकि प्रत्येक तारा एक राज्य का प्रतिनिधित्व करता है",
          "क्योंकि 50 राज्य हैं",
        ],
      },
    },
  },
  {
    id: 19,
    category: "holidays",
    senior65: true,
    question: "When do we celebrate Independence Day?",
    answers: ["July 4"],
    translations: {
      es: {
        question: "¿Cuándo celebramos el Día de la Independencia?",
        answers: ["el 4 de julio"],
      },
      ko: {
        question: "독립기념일은 언제입니까?",
        answers: ["7월 4일"],
      },
      vi: {
        question: "Chúng ta kỷ niệm Ngày Độc lập khi nào?",
        answers: ["ngày 4 tháng 7"],
      },
      tl: {
        question: "Kailan natin ipinagdiriwang ang Araw ng Kalayaan?",
        answers: ["ika-4 ng Hulyo"],
      },
      ru: {
        question: "Когда мы отмечаем День независимости?",
        answers: ["4 июля"],
      },
      ml: {
        question: "നമ്മൾ സ്വാതന്ത്ര്യ ദിനം എപ്പോഴാണ് ആഘോഷിക്കുന്നത്?",
        answers: ["ജൂലൈ 4"],
      },
      hi: {
        question: "हम स्वतंत्रता दिवस कब मनाते हैं?",
        answers: ["4 जुलाई"],
      },
    },
  },
  {
    id: 20,
    category: "geography",
    senior65: false,
    question: "Name one U.S. territory.",
    answers: [
      "Puerto Rico",
      "U.S. Virgin Islands",
      "American Samoa",
      "Northern Mariana Islands",
      "Guam",
    ],
    translations: {
      es: {
        question: "Mencione un territorio de los EE. UU.",
        answers: [
          "Puerto Rico",
          "Islas Vírgenes de los EE. UU.",
          "Samoa Americana",
          "Islas Marianas del Norte",
          "Guam",
        ],
      },
      ko: {
        question: "미국 영토 한 곳을 말하시오.",
        answers: [
          "푸에르토리코",
          "미국령 버진 아일랜드",
          "아메리칸 사모아",
          "북마리아나 제도",
          "괌",
        ],
      },
      vi: {
        question: "Nêu tên một lãnh thổ của Hoa Kỳ.",
        answers: [
          "Puerto Rico",
          "Quần đảo Virgin thuộc Hoa Kỳ",
          "Samoa thuộc Mỹ",
          "Quần đảo Bắc Mariana",
          "Guam",
        ],
      },
      tl: {
        question: "Pangalanan ang isang teritoryo ng U.S.",
        answers: [
          "Puerto Rico",
          "U.S. Virgin Islands",
          "American Samoa",
          "Northern Mariana Islands",
          "Guam",
        ],
      },
      ru: {
        question: "Назовите одну территорию США.",
        answers: [
          "Пуэрто-Рико",
          "Виргинские острова США",
          "Американское Самоа",
          "Северные Марианские острова",
          "Гуам",
        ],
      },
      ml: {
        question: "ഒരു യു.എസ്. പ്രദേശത്തിന്റെ പേര് പറയുക.",
        answers: [
          "പ്യൂർട്ടോ റിക്കോ",
          "യു.എസ്. വിർജിൻ ദ്വീപുകൾ",
          "അമേരിക്കൻ സമോവ",
          "വടക്കൻ മരിയാന ദ്വീപുകൾ",
          "ഗ്വാം",
        ],
      },
      hi: {
        question: "अमेरिका के एक क्षेत्र का नाम बताइए।",
        answers: [
          "प्यूर्टो रिको",
          "अमेरिकी वर्जिन द्वीप समूह",
          "अमेरिकी समोआ",
          "उत्तरी मारियाना द्वीप समूह",
          "गुआम",
        ],
      },
    },
  },
];

export function pickRandomQuestions(
  count: number,
  senior65Only = false,
): CivicsQuestion[] {
  const pool = senior65Only ? QUESTIONS.filter((q) => q.senior65) : QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getTranslation(
  question: CivicsQuestion,
  lang: LangCode,
): Translation {
  return (
    question.translations[lang] ?? {
      question: question.question,
      answers: question.answers,
    }
  );
}
