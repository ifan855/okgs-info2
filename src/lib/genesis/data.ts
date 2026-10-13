/* ============================================================
   OKGS GENESIS 2026 — Site content data
   Sources: okgs.info, omarkgschool.com, club subdomains
   ============================================================ */

export const SITE = {
  name: "OKGS GENESIS 2026",
  tagline: "Exploring the Universe of Science",
  taglineBn: "বিজ্ঞানের মহাবিশ্ব আবিষ্কারের উৎসব",
  school: "Omar Kindergarten School & Omar Garden Academy",
  schoolBn: "ওমর কিন্ডারগার্টেন স্কুল এন্ড ওমর গার্টেন একাডেমি",
  pressName: "OKGS Press Bureau",
  pressTag: "The newsroom & press desk of Omar K.G. School",
  mottoBn: "সবার জন্য মানসম্মত শিক্ষা",
  mottoEn: "Quality education for all",
  sinceBn: "২০০৩ সাল থেকে কালাই, জয়পুরহাটে মানসম্মত শিক্ষা — প্লে থেকে দশম শ্রেণি।",
  founded: 2003,
  founder: "Alhaj Abdur Rashid Talukdar",
  principal: "Omar Abdul Aziz Talukdar",
  address: "School College Para, Kalai Sadar, Joypurhat, Bangladesh",
  addressBn: "স্কুল কলেজ পাড়া, কালাই সদর, জয়পুরহাট",
  phone: "01711-857205",
  phone2: "05725-56351-52",
  phoneAdmission: "01329-625700",
  email: "okgs2003@gmail.com",
  hours: "Saturday – Thursday · 8:00 AM – 5:00 PM",
  facebook: "https://www.facebook.com/omarkgschool/",
  youtube: "https://www.youtube.com/c/omarkindergartenschool",
  mainSite: "https://omarkgschool.com/",
  scienceHub: "https://okgs.info/",
  mapQuery: "Omar+Kindergarten+School+Kalai+Joypurhat",
};

export const FAIR = {
  name: "OKGS Genesis 2026",
  tagline: "Exploring the Universe of Science",
  datesLabel: "20 – 21 November 2026",
  startISO: "2026-11-20T09:00:00+06:00",
  hours: "9:00 AM – 5:00 PM",
  venue: "School Field & Science Laboratories",
  location: "Kalai Sadar, Joypurhat",
  regDeadline: "18 November 2026",
  entry: "Free entry for all visitors",
  about: [
    "OKGS Genesis is the flagship science celebration of Omar Kindergarten School & Omar Garden Academy — two days when our entire campus becomes a launchpad. Hand-built working models, robotics projects, chemistry demonstration shows, research posters and live programming takes are exhibited, judged and celebrated under one sky.",
    "Every arena is scored by an independent panel of judges, and the fair closes with the Genesis Award Ceremony where champions lift the Genesis Cup. Visitors are welcome on both days — no ticket, no registration, just curiosity.",
    "Genesis 2026 is organised by the Math & Science Club (ALSSM) with the full crew of five school clubs — from the debate floor to the football field, every crew of the school runs a mission control of its own.",
  ],
  stats: [
    { value: 7, suffix: "", label: "Competition arenas" },
    { value: 2, suffix: "", label: "Days of discovery" },
    { value: 5, suffix: "", label: "School clubs" },
    { value: 1100, suffix: "+", label: "Students in orbit" },
  ],
};

export interface Arena {
  id: string;
  index: string;
  name: string;
  short: string;
  icon: string;
  classes: string;
  team: string;
  venue: string;
  desc: string;
  criteria: string[];
}

export const ARENAS: Arena[] = [
  {
    id: "model",
    index: "01",
    name: "Cosmic Model Exhibition",
    short: "Model Display",
    icon: "orbit",
    classes: "Classes 3 – 10 · Junior / Middle / Senior groups",
    team: "Team of 1 – 3",
    venue: "School Field · East Wing",
    desc: "The heart of Genesis. Working models of the solar system, water purification plants, hydraulic bridges, green energy grids — anything that turns a textbook page into something you can touch and power on.",
    criteria: ["Originality of concept", "Working principle & accuracy", "Presentation & viva", "Reuse of materials"],
  },
  {
    id: "robotics",
    index: "02",
    name: "Robotics & AI Challenge",
    short: "Robotics",
    icon: "bot",
    classes: "Classes 6 – 10",
    team: "Team of 2 – 4",
    venue: "Science Laboratory Arena",
    desc: "Line-follower sprints, obstacle-run courses and free-form innovation demos. Bots are judged on autonomy, design and nerve — qualifiers on Day 1, the grand final on the main stage of Day 2.",
    criteria: ["Autonomy & sensors", "Course performance", "Engineering & build quality", "Innovation factor"],
  },
  {
    id: "olympiad",
    index: "03",
    name: "Genesis Science Olympiad",
    short: "Science Quiz",
    icon: "brain",
    classes: "Classes 3 – 10 · three age groups",
    team: "Individual",
    venue: "Main Stage",
    desc: "A written qualifier across physics, chemistry, biology, astronomy and math reasoning — then the top scorers face the buzzer finals under stage lights in front of the whole school.",
    criteria: ["Written qualifier score", "Speed on the buzzer", "Depth across disciplines", "Composure under lights"],
  },
  {
    id: "pitch",
    index: "04",
    name: "Big Idea Pitch",
    short: "Big Idea",
    icon: "lightbulb",
    classes: "Classes 6 – 10",
    team: "Team of 1 – 3",
    venue: "Main Stage",
    desc: "Three minutes on stage to pitch a science or technology idea that solves a real problem of Kalai — farms, flood, energy, education. A panel of teachers and guest entrepreneurs fires back with questions.",
    criteria: ["Problem relevance", "Scientific feasibility", "Clarity of the pitch", "Answering the jury"],
  },
  {
    id: "debate",
    index: "05",
    name: "Genesis Debate Floor",
    short: "Debate",
    icon: "mic",
    classes: "Classes 8 – 10",
    team: "Team of 2 (for / against)",
    venue: "Auditorium",
    desc: "Hosted by ART Debating Society. Bangla and English motions announced in advance — semifinal on Day 1, the grand final motion fought out on Day 2 before the award ceremony.",
    criteria: ["Argument & evidence", "Refutation", "Diction & presence", "Team coordination"],
  },
  {
    id: "poster",
    index: "06",
    name: "Starlight Poster & Art",
    short: "Poster",
    icon: "palette",
    classes: "Classes 3 – 10",
    team: "Individual",
    venue: "Library Gallery",
    desc: "A visual arena — hand-drawn science posters, charts and illustrative art on this year's theme: 'Exploring the Universe of Science'. Displayed along the library gallery for the full fair.",
    criteria: ["Theme alignment", "Scientific content", "Visual craft", "Colour & composition"],
  },
  {
    id: "code",
    index: "07",
    name: "Code & Create Lab",
    short: "Programming",
    icon: "code",
    classes: "Classes 5 – 10",
    team: "Team of 1 – 2",
    venue: "Computer Laboratory",
    desc: "Run by the Association of Little Programmers & Computer Geeks. Scratch games, mini websites, Python pocket-tools — live demos at the machines, judged on imagination and working code.",
    criteria: ["Working demo", "Code originality", "UI & imagination", "Live explanation"],
  },
];

export interface DayEvent {
  time: string;
  title: string;
  detail: string;
  venue: string;
  tag: string;
}

export const SCHEDULE: Record<"day1" | "day2", { label: string; date: string; events: DayEvent[] }> = {
  day1: {
    label: "Day 1 · Ignition",
    date: "Friday, 20 November 2026",
    events: [
      { time: "09:00", title: "Check-in & Booth Setup", detail: "Teams check in, collect crew badges, set up exhibits.", venue: "School Field", tag: "All crews" },
      { time: "10:00", title: "Grand Inauguration — The Big Bang", detail: "Lighting of the Genesis flame, national anthem, welcome by the principal.", venue: "Main Stage", tag: "Ceremony" },
      { time: "10:40", title: "Model Exhibition Opens", detail: "Judging round 1 begins — visitors walk the east wing galaxies.", venue: "East Wing", tag: "Exhibition" },
      { time: "12:00", title: "Robotics Qualifiers", detail: "Line-follower and obstacle-run qualifier laps.", venue: "Science Lab Arena", tag: "Competition" },
      { time: "13:30", title: "Olympiad Written Round", detail: "60-minute written qualifier for all age groups.", venue: "Exam Hall", tag: "Competition" },
      { time: "15:00", title: "Chemistry Demonstration Show", detail: "ALSSM's live chem-magic show — colour changes, elephants' toothpaste and more.", venue: "Science Lab", tag: "Show" },
      { time: "16:00", title: "Poster Gallery & Judging", detail: "Starlight posters displayed and scored in the library gallery.", venue: "Library Gallery", tag: "Exhibition" },
      { time: "16:45", title: "Day 1 Results Bulletin", detail: "Qualifier results posted; finalists announced for Day 2.", venue: "Notice Board", tag: "Announcement" },
    ],
  },
  day2: {
    label: "Day 2 · Supernova",
    date: "Saturday, 21 November 2026",
    events: [
      { time: "09:00", title: "Olympiad Buzzer Finals", detail: "Top qualifiers face the buzzer under stage lights.", venue: "Main Stage", tag: "Final" },
      { time: "10:30", title: "Robotics Grand Final", detail: "The fastest bots of the qualifiers run the final course.", venue: "Science Lab Arena", tag: "Final" },
      { time: "12:00", title: "Big Idea Pitch — Live", detail: "Finalists pitch to the jury panel, three minutes each.", venue: "Main Stage", tag: "Final" },
      { time: "14:00", title: "Genesis Debate Grand Final", detail: "The grand motion — Bangla & English winning teams clash.", venue: "Auditorium", tag: "Final" },
      { time: "15:30", title: "Code & Create Live Demos", detail: "Programmers demo working games, sites and tools.", venue: "Computer Lab", tag: "Final" },
      { time: "16:30", title: "Genesis Award Ceremony", detail: "Champions crowned, Genesis Cup handed over, certificates for all.", venue: "Main Stage", tag: "Ceremony" },
      { time: "17:00", title: "Closing — Crew Photo & Star Drop", detail: "The whole fair gathers for the closing photo and the star-drop finale.", venue: "School Field", tag: "Ceremony" },
    ],
  },
};

export interface ClubEvent {
  date: string;
  title: string;
  venue: string;
  type: string;
}

export interface Club {
  slug: string;
  code: string;
  shortName: string;
  name: string;
  full: string;
  taglineBn: string;
  taglineEn: string;
  mottoBn: string;
  mottoEn: string;
  color: string;
  colorSoft: string;
  icon: string;
  image: string;
  logo: string;
  email: string;
  meetingBn: string;
  meetingEn: string;
  time: string;
  venue: string;
  committee: string;
  about: string[];
  activities: string[];
  events: ClubEvent[];
  achievements: { year: string; title: string; detail: string }[];
  leadership: { role: string; name: string }[];
  site: string;
  fairRole: string;
}

export const CLUBS: Club[] = [
  {
    slug: "alssm",
    code: "ALSSM",
    shortName: "Math & Science Club",
    name: "Math & Science Club",
    full: "Association of Little Scientists and Math Maniacs",
    taglineBn: "গণিত ও বিজ্ঞানের ভয় দূরে, অনুসন্ধানের আনন্দ কাছে",
    taglineEn: "Far from the fear of math & science, close to the joy of discovery.",
    mottoBn: "কৌতূহল থেকে আবিষ্কার",
    mottoEn: "From curiosity to discovery",
    color: "#1b9d5e",
    colorSoft: "rgba(27,157,94,0.14)",
    icon: "flask",
    image: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/cover-alssm.jpg",
    logo: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/logo-alssm.png",
    email: "science.club@okgs.info",
    meetingBn: "প্রতি বৃহস্পতিবার",
    meetingEn: "Every Thursday",
    time: "4:00 – 5:00 PM",
    venue: "Science Laboratory",
    committee: "Adviser + 4 office bearers",
    about: [
      "ALSSM is the school's largest crew — the engine room of OKGS's scientific spirit. Its brief, in the club's own words: remove the fear of math and science, prepare students for quizzes and olympiads, and organise the annual science fair.",
      "The club grew out of a wish to take math and science beyond the textbook. Its weekly quizzes, hands-on experiments and the yearly science fair now draw students from across the whole of Kalai upazila — not only OKGS classrooms.",
      "The club's creed hangs in the laboratory: not memorised lessons — the habit of asking, testing and discovering with your own hands.",
    ],
    activities: [
      "Remove the fear of math & science",
      "Build skill and appetite for math & science",
      "Bring out the fun side of math & science",
      "Introduce the science that lives beyond textbooks",
      "Run regular quiz contests & the annual science fair",
      "Host invited schools in inter-school contests",
      "Send members to olympiads every year",
    ],
    events: [
      { date: "05 Nov 2026", title: "Weekly Science Adda", venue: "Science Laboratory · 4 PM", type: "Meetup" },
      { date: "20 Nov 2026", title: "OKGS Science Fair 2026", venue: "School Field & Labs · 9 AM", type: "Flagship" },
    ],
    achievements: [
      { year: "2026", title: "Chief organiser of OKGS Genesis 2026", detail: "The club leads the school's flagship fair — 20–21 November, seven arenas, two days." },
      { year: "2026", title: "Weekly Science Adda in full swing", detail: "Thursday experiments, puzzles and olympiad circles — open to every class." },
    ],
    leadership: [
      { role: "Advisor", name: "Md. Rahmatullah Pike · Assistant Head Teacher (Physics)" },
      { role: "President", name: "Elected from the executive council" },
      { role: "General Secretary", name: "Coordinates the fair desk" },
      { role: "Treasurer", name: "Keeps the fair fund & accounts" },
    ],
    site: "https://alssm.okgs.info/",
    fairRole: "Chief organiser · Genesis Science Olympiad · Chem demo show",
  },
  {
    slug: "aypg",
    code: "AYPG",
    shortName: "Language Club",
    name: "Language Club",
    full: "Association of Young Philologists and Grammarians",
    taglineBn: "শুদ্ধ বাংলা আর সাবলীল ইংরেজির চর্চা",
    taglineEn: "The craft of correct Bangla and fluent English.",
    mottoBn: "কথায় ভাব, লেখায় চিন্তা",
    mottoEn: "Thought in speech, reflection in writing",
    color: "#972c91",
    colorSoft: "rgba(151,44,145,0.14)",
    icon: "book",
    image: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/cover-aypg.jpg",
    logo: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/logo-aypg.png",
    email: "language.club@okgs.info",
    meetingBn: "প্রতি রবিবার",
    meetingEn: "Every Sunday",
    time: "9:00 – 10:00 AM",
    venue: "School Library",
    committee: "Adviser + 2 office bearers",
    about: [
      "AYPG works to spread the joy of correct pronunciation, spelling and the reading of literature. Its annual calendar anchors the school's linguistic life: Bangla and English debate festivals, recitation events and the February language-month programme.",
      "The club's purpose is confidence — the courage to speak, and the habit of writing one's own thoughts down. Every Sunday morning the school library becomes its workshop.",
    ],
    activities: [
      "Practise correct, standard Bangla",
      "Read native & world literature, Bangla and English",
      "Build fluency in speaking across languages",
      "Drill pronunciation, spelling & grammar",
      "Run the language reading programme",
      "Hold recitation & extempore speech events",
      "Stage the annual Bangla & English debates",
      "Special programmes in the language month",
      "Prepare members for the Bangla Olympiad",
    ],
    events: [
      { date: "12 Nov 2026", title: "Monthly Poetry Assembly", venue: "School Library · 9 AM", type: "Assembly" },
      { date: "21 Nov 2026", title: "Genesis Debate — English motion", venue: "Auditorium", type: "Fair event" },
    ],
    achievements: [
      { year: "2026", title: "Monthly Poetry Assembly running", detail: "কবিতার আসর — own verses and beloved recitations, every month in the library." },
      { year: "2026", title: "Reading programme across the library", detail: "The club steers the reading challenge through the school's 2,000-book library." },
    ],
    leadership: [
      { role: "Advisor", name: "Mosa. Fatema Akter · Assistant Teacher" },
      { role: "President", name: "Elected from the executive council" },
      { role: "General Secretary", name: "Elected from the executive council" },
    ],
    site: "https://aypg.okgs.info/",
    fairRole: "Genesis Debate Floor co-host · Poster captions & anthology",
  },
  {
    slug: "alpcg",
    code: "ALPCG",
    shortName: "Programmers Club",
    name: "Association of Little Programmers & Computer Geeks",
    full: "Association of Little Programmers and Computer Geeks",
    taglineBn: "প্রোগ্রামিং, ওয়েব আর তথ্যপ্রযুক্তির হাতেখড়ি",
    taglineEn: "First steps into programming, the web and information technology.",
    mottoBn: "We are always on top!",
    mottoEn: "We are always on top!",
    color: "#577cb7",
    colorSoft: "rgba(87,124,183,0.16)",
    icon: "code",
    image: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/cover-alpcg.jpg",
    logo: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/logo-alpcg.png",
    email: "computer.club@okgs.info",
    meetingBn: "প্রতি বুধবার",
    meetingEn: "Every Wednesday",
    time: "3:00 – 4:00 PM",
    venue: "Computer Laboratory",
    committee: "Adviser + 2 office bearers",
    about: [
      "ALPCG gives students their first lines of code, their first web page and their first taste of ICT contests — the club of future programmers. Its regular sessions run in the school's own computer laboratory.",
      "Through web development contests and hands-on ICT workshops the club introduces students to technology as builders, not just users. Its creed: make every student a creator of technology, not merely a consumer.",
    ],
    activities: [
      "Build ICT skill through hands-on computing",
      "Give a correct working idea of information & technology",
      "First steps into programming",
      "Regular computer quizzes & programming contests",
      "Learn to find any information through search",
      "Host invited schools in ICT contests",
      "Olympiad participation & training for members",
    ],
    events: [
      { date: "14 Nov 2026", title: "First Website Workshop", venue: "Computer Lab · 3 PM", type: "Workshop" },
      { date: "25 Sep 2026", title: "Web Development Contest 2026", venue: "Computer Lab", type: "Contest" },
    ],
    achievements: [
      { year: "2026", title: "All five club websites launched", detail: "Every OKGS club now runs its own info site — built and maintained by students." },
      { year: "2026", title: "Web Development Contest 2026", detail: "Twelve working student sites demoed on 25 September — a record field." },
    ],
    leadership: [
      { role: "Advisor", name: "Md. Meherul Islam · Assistant Teacher (ICT)" },
      { role: "President", name: "Elected from the executive council" },
      { role: "General Secretary", name: "Elected from the executive council" },
    ],
    site: "https://alpcg.okgs.info/",
    fairRole: "Code & Create Lab host · Genesis 2026 web crew",
  },
  {
    slug: "aygsm",
    code: "AYGSM",
    shortName: "Sporting Club",
    name: "Sporting Club",
    full: "Association of Young Gymnastics and Sports Maniacs",
    taglineBn: "খেলাধুলার মাধ্যমে শৃঙ্খলা ও দলগত মানসিকতা",
    taglineEn: "Discipline and team spirit, forged through sport.",
    mottoBn: "সুস্থ শরীর, প্রফুল্ল মন",
    mottoEn: "Healthy body, cheerful mind",
    color: "#0d7fab",
    colorSoft: "rgba(13,127,171,0.15)",
    icon: "trophy",
    image: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/campus-1.jpg",
    logo: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/logo-aygsm.png",
    email: "sports.club@okgs.info",
    meetingBn: "প্রতি শুক্রবার",
    meetingEn: "Every Friday",
    time: "4:00 – 6:00 PM",
    venue: "School Field",
    committee: "Adviser + 2 office bearers",
    about: [
      "AYGSM pulls students away from mobile-phone and gaming addiction and onto the field — encouraging sport, running regular tournaments and preparing squads for district and national meets.",
      "Year after year the club's football, kabaddi and gymnastics crews have carried the school's colours — the field, in the club's creed, is a classroom just like the lecture hall.",
    ],
    activities: [
      "Free students from screens — bring them to the field",
      "Live by the creed: healthy body, cheerful mind",
      "Push talented athletes to go further",
      "Run regular tournaments across the year",
      "Host invited schools in inter-school meets",
      "Arrange local, regional & national participation",
    ],
    events: [
      { date: "19 Nov 2026", title: "Inter-class Football Final", venue: "School Field · 4 PM", type: "Tournament" },
      { date: "20 Nov 2026", title: "Genesis venue crew — Day 1", venue: "School Field", type: "Fair duty" },
    ],
    achievements: [
      { year: "2026", title: "Inter-class football league underway", detail: "A three-week class-versus-class league closing in the 19 November final." },
      { year: "2026", title: "Logistics crew of Genesis 2026", detail: "The club runs venues, crowd flow and the award parade for the fair." },
    ],
    leadership: [
      { role: "Advisor", name: "Md. Abul Kalam Azad · Physical Education Teacher" },
      { role: "President", name: "Elected from the executive council" },
      { role: "General Secretary", name: "Elected from the executive council" },
    ],
    site: "https://aygsm.okgs.info/",
    fairRole: "Logistics constellation · Venue & award parade crew",
  },
  {
    slug: "artds",
    code: "ARTDS",
    shortName: "Debating Society",
    name: "ART Debating Society",
    full: "ART Debating Society",
    taglineBn: "বিতর্ক, উপস্থিত বক্তৃতা ও নেতৃত্বচর্চা",
    taglineEn: "Debate, extempore speech and the practice of leadership.",
    mottoBn: "যুক্তিই শক্তি",
    mottoEn: "Argument is strength",
    color: "#24ade3",
    colorSoft: "rgba(36,173,227,0.14)",
    icon: "mic",
    image: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/crest.jpg",
    logo: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/logo-artds.png",
    email: "debate.club@okgs.info",
    meetingBn: "প্রতি সোমবার",
    meetingEn: "Every Monday",
    time: "4:00 PM",
    venue: "School Auditorium",
    committee: "Adviser + 2 office bearers",
    about: [
      "ARTDS is the debating floor of OKGS — argument, presentation and courtesy in practice, through inter-class and inter-school debate contests and Model United Nations style events.",
      "The society's stage is where argument and confidence are built. Inter-class debates, extempore rounds and debate workshops run on its weekly Monday schedule in the auditorium.",
    ],
    activities: [
      "Argument-driven debate & inter-class contests",
      "Extempore speech & panel discussion training",
      "Inter-school debate hosting & participation",
      "Speech, parliamentary debate & MUN workshops",
      "Practise civil disagreement & leadership",
    ],
    events: [
      { date: "18 Nov 2026", title: "Inter-class Debate Competition", venue: "Auditorium · 4 PM", type: "Tournament" },
      { date: "21 Nov 2026", title: "Genesis Debate Grand Final", venue: "Auditorium", type: "Fair event" },
    ],
    achievements: [
      { year: "2026", title: "Parliamentary debate calendar set", detail: "Inter-class rounds through the year, winners advancing to the Genesis floor." },
      { year: "2026", title: "Genesis Debate Floor host", detail: "The society runs the fair's debate arena and anchors the award ceremony." },
    ],
    leadership: [
      { role: "Advisor", name: "Mosa. Rozina Akter · Assistant Teacher" },
      { role: "President", name: "Elected from the executive council" },
      { role: "General Secretary", name: "Elected from the executive council" },
    ],
    site: "https://artds.okgs.info/",
    fairRole: "Genesis Debate Floor host · Award ceremony anchors",
  },
];

export const FACILITIES = [
  { icon: "bus", title: "Bus Service", detail: "School-owned buses covering Kalai and surrounding routes for safe daily transit." },
  { icon: "shield", title: "Student Safety", detail: "Round-the-clock CCTV supervision and a dedicated anti-harassment prevention cell." },
  { icon: "home", title: "Residential Hostels", detail: "Separate, calm residential buildings for boys and girls with supervised study." },
  { icon: "monitor", title: "Computer Lab", detail: "A modern computer laboratory — computer education is compulsory for every student." },
  { icon: "library", title: "Rich Library", detail: "2,000+ quality titles, reading rooms, and the assembly hall of five club circles." },
  { icon: "utensils", title: "Canteen", detail: "Hygienic on-campus canteen serving snacks and meals through the school day." },
];

export const PEOPLE = [
  { name: "Omar Abdul Aziz Talukdar", role: "Principal", bn: "অধ্যক্ষ" },
  { name: "Md. Rahmatullah PiKE", role: "Assistant Head Teacher", bn: "সহকারী প্রধান শিক্ষক" },
  { name: "Md. Meherul Islam", role: "Assistant Teacher", bn: "সহকারী শিক্ষক" },
  { name: "Mosa. Fatema Akter", role: "Assistant Teacher", bn: "সহকারী শিক্ষিকা" },
];

export const STATS = [
  { value: 2003, suffix: "", label: "Founded", sub: "1 January, by Alhaj Abdur Rashid Talukdar" },
  { value: 1100, suffix: "+", label: "Students", sub: "Play group through Class 10" },
  { value: 80, suffix: "", label: "Teachers & Staff", sub: "Experienced and devoted faculty" },
  { value: 100, suffix: "%", label: "Pass Rate", sub: "Public examination results" },
];

export const TIMELINE = [
  { date: "18 NOV 2026", title: "Entries close", detail: "Entry lists for all seven arenas are finalised today — forms were collected at the school office." },
  { date: "20 NOV 2026", title: "Day 1 · Ignition", detail: "Inauguration, model exhibition, robotics qualifiers, olympiad written round, poster gallery." },
  { date: "21 NOV 2026", title: "Day 2 · Supernova", detail: "Buzzer finals, robotics final, Big Idea Pitch, debate final, Genesis Award Ceremony." },
];

export const FAQS = [
  {
    q: "Who can participate in OKGS Genesis 2026?",
    a: "Every enrolled OKGS student from Class 3 to Class 10 can enter one or more arenas. Some arenas group participants into Junior (3–5), Middle (6–8) and Senior (9–10) divisions so everyone competes fairly.",
  },
  {
    q: "How much does registration cost?",
    a: "Nothing. Participation is completely free — for participants and for visitors. Entry forms were collected at the school office until 18 November 2026.",
  },
  {
    q: "Can visitors attend without a project?",
    a: "Absolutely. The exhibition galleries, stage shows and demonstration arenas are open to parents, guardians and neighbours on both days from 9 AM to 5 PM. No ticket needed.",
  },
  {
    q: "What can win the Genesis Cup?",
    a: "The Genesis Cup is awarded to the single best project of the fair, chosen by the judges across all arenas. Each arena also crowns a champion and a runner-up with crests and certificates.",
  },
  {
    q: "Do we need to bring our own materials?",
    a: "Models and robots are team-built before the fair. The school provides power strips, tables, the robotics course, computers for the Code & Create lab and standard quiz equipment.",
  },
];

export const RULES = [
  { n: "01", title: "Free & final lists", detail: "Participation is free. Entry lists close on 18 November 2026; late entries are accepted only if an arena still has slots." },
  { n: "02", title: "Your own work", detail: "Projects must be student-built. Judges may ask viva questions; borrowed or bought projects are disqualified." },
  { n: "03", title: "Safety first", detail: "Chemistry demos and robotics need a safety check on setup day. No open flames without a lab supervisor." },
  { n: "04", title: "Teams & classes", detail: "Respect the class groupings and team-size limits of your arena. One participant may captain at most two arenas." },
  { n: "05", title: "Judges' word is final", detail: "Scoring uses the published criteria of each arena. The judges' panel resolves any dispute." },
  { n: "06", title: "Discipline & dress", detail: "School uniform or crew badge is required on both days. Fair discipline rules follow the school code." },
];

export interface NavLink {
  href: string;
  label: string;
  /** fair → science-fair edition only · normal → paper edition only */
  scope?: "fair" | "normal";
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/press", label: "Journal" },
  { href: "/genesis", label: "Genesis 2026", scope: "fair" },
  { href: "/clubs", label: "Clubs" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
];

/** nav for the current edition */
export function navLinksFor(mode: "fair" | "normal"): NavLink[] {
  return NAV_LINKS.filter((l) => !l.scope || l.scope === mode);
}

export const PRESS_CATEGORIES = [
  "All",
  "Press Release",
  "News",
  "Notice",
  "Feature",
  "Club",
  "Sports",
] as const;

export const MARQUEE_ITEMS = [
  "Model Exhibition",
  "Robotics",
  "Science Olympiad",
  "Big Idea Pitch",
  "Debate Floor",
  "Poster & Art",
  "Code & Create",
  "Chem Demo Show",
];
