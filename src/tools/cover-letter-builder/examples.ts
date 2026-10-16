import type { UseCase, UseCaseCollection } from "@/components/tool/use-case";
import type { Basics } from "@/tools/resume-builder/schema";
import type { CoverLetter } from "./schema";

/*
 * Cover letter examples: one landing page per situation (/cover-letter-builder/examples/<slug>),
 * each with a complete letter that opens in the builder with "Use this example".
 */

export const COVER_LETTER_EXAMPLES_COLLECTION: UseCaseCollection = {
  toolSlug: "cover-letter-builder",
  segment: "examples",
  title: "Cover Letter Examples",
  noun: "cover letter",
  metaTitle: "Cover Letter Examples for Every Job - Free to Edit",
  metaDescription:
    "Free cover letter examples for freshers, internships, career changers, software engineers, sales and teachers. Edit any example and download a PDF.",
  intro:
    "Complete cover letter examples written for real situations. Open one in the free cover letter builder, make it yours and download a matching PDF - no sign-up, no watermark.",
};

let counter = 0;
const id = () => `letter-example-${++counter}`;

interface ExampleLetter {
  templateId: string;
  basics: Omit<Basics, "photo" | "links" | "details"> & { links?: [string, string][] };
  recipient: CoverLetter["recipient"];
  subject: string;
  greeting: string;
  paragraphs: string[];
  closing: string;
}

function letter({ basics, paragraphs, ...rest }: ExampleLetter): CoverLetter {
  const { links = [], ...person } = basics;
  return {
    ...rest,
    basics: {
      ...person,
      photo: "",
      links: links.map(([label, url]) => ({ id: id(), label, url })),
      details: [],
    },
    // Replaced with today's date when the example is opened in the builder.
    date: "2026-10-15",
    body: paragraphs.join("\n\n"),
  };
}

export const COVER_LETTER_EXAMPLES: UseCase<CoverLetter>[] = [
  {
    slug: "fresher",
    name: "Fresher",
    summary: "For graduates applying for their first job.",
    metaTitle: "Cover Letter for Freshers - Free Example (PDF)",
    metaDescription:
      "A complete cover letter example for freshers and recent graduates, built around one strong project and an internship. Edit it free and download a PDF.",
    heading: "Cover Letter for Freshers",
    intro:
      "Your first cover letter doesn't need work experience. This example shows how a fresher can turn a final-year project and a short internship into a convincing case for the job.",
    highlights: {
      title: "What a fresher cover letter should do",
      items: [
        "Name the role and where you found it in the first line",
        "Mention your degree, college and score briefly",
        "Tell one project or internship story with a result",
        "Show why you want this company, not just any job",
        "Stay under 350 words, on one page",
      ],
    },
    guide: [
      {
        heading: "Replace experience with evidence",
        paragraphs: [
          "As a fresher you can't point to years in a job, so point to things you've done: a final-year project, an internship, a hackathon or a college event you ran. Pick one and tell it properly - the problem, what you did and what happened.",
          "One specific story beats a paragraph of adjectives. 'Built an air-quality monitor installed at ten spots on campus' is far more convincing than 'hardworking, passionate and a quick learner'.",
        ],
      },
      {
        heading: "A simple structure for a fresher cover letter",
        paragraphs: [
          "Keep it to four short paragraphs. Recruiters reading hundreds of fresher applications appreciate a letter they can take in within a minute.",
        ],
        bullets: [
          "Paragraph 1: the role, where you saw it, and your degree",
          "Paragraph 2: your strongest project or internship, with a result",
          "Paragraph 3: the skills you bring and why this company",
          "Paragraph 4: thanks, and your availability for an interview",
        ],
      },
    ],
    faqs: [
      {
        question: "Do freshers need a cover letter?",
        answer:
          "Not always, but it helps when the application has a cover letter field or you're emailing a recruiter directly. It's your chance to explain why you want the job, which a resume can't do.",
      },
      {
        question: "How long should a fresher's cover letter be?",
        answer: "250-350 words - about four short paragraphs that fit comfortably on one page.",
      },
    ],
    document: letter({
      templateId: "modern-teal",
      basics: {
        name: "Pooja Menon",
        headline: "B.Tech Graduate - Electronics & Communication",
        email: "pooja.menon@email.com",
        phone: "+91 94470 31852",
        location: "Kochi, India",
        links: [["LinkedIn", "linkedin.com/in/poojamenon"]],
      },
      recipient: {
        name: "Hiring Manager",
        title: "Talent Acquisition Team",
        company: "Trident Networks Pvt. Ltd.",
        address: "Infopark Phase 2, Kakkanad\nKochi, Kerala 682042",
      },
      subject: "Application for Graduate Engineer Trainee (2026 Batch)",
      greeting: "Dear Hiring Manager,",
      paragraphs: [
        "I'm writing to apply for the Graduate Engineer Trainee role at Trident Networks, which I found on your careers page. I graduated this year with a B.Tech in Electronics and Communication from Model Engineering College, Kochi, with a CGPA of 8.7, and I'm keen to start my career building the networking products your team is known for.",
        "In my final year I led a team of four to build a low-cost air-quality monitor using an ESP32 and a cloud dashboard. We installed ten units around our campus, and the data helped the college move two outdoor classes away from a busy road. During a two-month internship at a telecom services firm, I also configured routers and switches for 15 small-business clients and wrote a troubleshooting checklist the support team still uses.",
        "I bring a solid grounding in networking and embedded systems, working knowledge of Python and C, and the habit of learning whatever a problem needs. Your training programme, with rotations across hardware and software teams, is exactly the start I'm looking for, and I'm happy to relocate or work in shifts if the role requires it.",
        "I've attached my resume and would be glad to discuss how I can contribute. Thank you for considering my application.",
      ],
      closing: "Sincerely,",
    }),
  },
  {
    slug: "internship",
    name: "Internship",
    summary: "For students applying for internships.",
    metaTitle: "Cover Letter for Internship - Free Example (PDF)",
    metaDescription:
      "An internship cover letter example for students: course, availability, projects and why the company. Edit it free and download a PDF.",
    heading: "Cover Letter for Internship",
    intro:
      "A short, specific internship cover letter that tells the recruiter who you are, when you're available and why you'd be useful from your first week.",
    highlights: {
      title: "What to include in an internship cover letter",
      items: [
        "Your course, year and college",
        "The exact dates or duration you're available",
        "One or two projects, competitions or courses that fit the role",
        "What you want to learn, and how you'll help",
        "A short, polite close",
      ],
    },
    guide: [
      {
        heading: "Show enthusiasm with specifics",
        paragraphs: [
          "Every intern applicant says they're eager to learn. Prove it with what you've already done on your own: a club project, a competition, an online course or a model you built. These show initiative far better than any adjective.",
          "Then connect it to the company. Mention something real about their work - a sector they focus on, a product or a recent launch - and say what you hope to learn there.",
        ],
      },
      {
        heading: "Make the practical details easy",
        paragraphs: [
          "Recruiters planning an internship batch need to know when you're available. State your dates or duration in the first paragraph, along with whether you can work on-site, hybrid or remotely.",
          "Keep the whole letter under 300 words. When you apply through an internship portal, the same letter can be cut down into the 'why should we hire you' answer.",
        ],
      },
    ],
    faqs: [
      {
        question: "What do I write in an internship cover letter with no experience?",
        answer:
          "Write about your coursework, projects, competitions, college societies and online courses. Pick the ones closest to the internship and explain what you did and what you learnt.",
      },
      {
        question: "Should I address the letter to a specific person?",
        answer:
          "Yes, if you can find the hiring manager's or recruiter's name on LinkedIn or the company website. Otherwise 'Dear Hiring Manager' is perfectly acceptable.",
      },
    ],
    document: letter({
      templateId: "classic-navy",
      basics: {
        name: "Sakshi Jain",
        headline: "B.Com (Honours) Student",
        email: "sakshi.jain@email.com",
        phone: "+91 98190 64725",
        location: "Mumbai, India",
        links: [["LinkedIn", "linkedin.com/in/sakshijain"]],
      },
      recipient: {
        name: "Mr. Rohit Desai",
        title: "Associate Director, Corporate Finance",
        company: "Arcadia Capital Advisors",
        address: "Level 6, Bandra Kurla Complex\nMumbai, Maharashtra 400051",
      },
      subject: "Application for Summer Finance Internship (May - July 2027)",
      greeting: "Dear Mr. Desai,",
      paragraphs: [
        "I'm a second-year B.Com (Honours) student at Narsee Monjee College of Commerce and Economics, and I'm writing to apply for the summer finance internship at Arcadia Capital Advisors. I'm available full time for eight weeks from May to July 2027.",
        "Finance is the part of my course I enjoy most, and I've gone beyond the syllabus to practise it. Through our college finance club I built a discounted cash flow model for a listed FMCG company, and our team placed second among 40 teams in an inter-college equity research competition. I've also completed the Bloomberg Market Concepts course and I'm comfortable with Excel tools such as XLOOKUP, pivot tables and scenario analysis.",
        "Arcadia's work with mid-sized Indian companies raising growth capital is what drew me to apply. I'd like to learn how deals are evaluated in practice, and I can help with research, data gathering and building comparables from the first week. I'm organised, careful with numbers and happy to take on whatever the team needs.",
        "My resume is attached, and I'd welcome the chance to speak with you. Thank you for your time.",
      ],
      closing: "Yours sincerely,",
    }),
  },
  {
    slug: "career-change",
    name: "Career Change",
    summary: "For moving into a new field or role.",
    metaTitle: "Career Change Cover Letter Example - Free Template",
    metaDescription:
      "A career change cover letter example that explains the switch, shows new skills and turns past experience into a strength. Edit it free and download a PDF.",
    heading: "Career Change Cover Letter Example",
    intro:
      "Changing careers? This cover letter explains the move in a few lines, shows the work already done to prepare, and turns previous experience into an advantage.",
    highlights: {
      title: "What a career change cover letter must do",
      items: [
        "Say clearly what you're moving from and to",
        "Explain why you're changing, briefly and positively",
        "Show the steps you've already taken: courses, projects, certifications",
        "Turn your past experience into an advantage in the new role",
        "Acknowledge the experience gap honestly, then move on",
      ],
    },
    guide: [
      {
        heading: "Tell the story of your switch",
        paragraphs: [
          "A career changer's resume can look confusing on its own. The cover letter is where you explain it: what you did before, what drew you to the new field and what you've done to get ready. Keep it short and forward-looking - the reader cares more about where you're going than why you left.",
          "The strongest stories show the change starting in your old job: automating a report, training colleagues or solving a problem with the skills you now want to use full time.",
        ],
      },
      {
        heading: "Make your background a strength",
        paragraphs: [
          "Don't apologise for your previous career. Find the overlap with the new role - domain knowledge, managing people, dealing with customers, working under pressure - and explain why it makes you better at the new job, not just good enough.",
          "Acknowledge the gap once if it's obvious, then balance it with evidence: certifications, portfolio projects, freelance work or volunteering in the new field.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I explain why I'm changing careers?",
        answer:
          "Yes, in a sentence or two, and keep it positive. Focus on what attracts you to the new field rather than what you disliked about the old one.",
      },
      {
        question: "Do I need a certification to change careers?",
        answer:
          "It isn't essential, but a recognised course plus one or two portfolio projects reassures employers that you've tested your interest and built real skills.",
      },
      {
        question: "What resume should go with a career change cover letter?",
        answer:
          "One that puts a strong summary, skills and projects above your older experience. You can reorder sections in the free resume builder and match its design to this letter.",
      },
    ],
    document: letter({
      templateId: "executive-forest",
      basics: {
        name: "Anjali Bhatt",
        headline: "Data Analyst - Former Banking Operations Lead",
        email: "anjali.bhatt@email.com",
        phone: "+91 98230 47581",
        location: "Pune, India",
        links: [
          ["LinkedIn", "linkedin.com/in/anjalibhatt"],
          ["Portfolio", "github.com/anjalibhatt"],
        ],
      },
      recipient: {
        name: "Ms. Kavita Sharma",
        title: "Analytics Manager",
        company: "Brightline Insurance Technologies",
        address: "4th Floor, Tower B, Magarpatta City\nPune, Maharashtra 411013",
      },
      subject: "Application for Data Analyst",
      greeting: "Dear Ms. Sharma,",
      paragraphs: [
        "I'm applying for the Data Analyst role at Brightline. After six years in banking operations, most recently leading a team of 12 at a loan processing centre, I've moved into analytics full time - and an insurer that uses data to settle claims faster and more fairly is exactly where I want to use both sides of my experience.",
        "My move into data started on the job. Our team was losing hours to manual tracking, so I taught myself SQL and Power BI and built a turnaround dashboard covering 1,800 loan files a month. It showed where applications were stalling, and the changes we made cut average processing time from six days to four. That project led me to complete the Google Data Analytics Certificate and build a portfolio of three analyses, including one on motor insurance claims using a public dataset.",
        "I know I'm newer to analytics than some candidates. Alongside the technical skills, I offer six years of understanding how financial operations really work - the processes, the regulations and the people. I can talk to claims teams in their language, spot when the data doesn't match what's happening on the ground, and turn findings into changes that teams actually adopt.",
        "I'd be glad to walk you through my portfolio and discuss how I could help your team. Thank you for considering my application.",
      ],
      closing: "Kind regards,",
    }),
  },
  {
    slug: "software-engineer",
    name: "Software Engineer",
    summary: "Backend, frontend and full-stack developers.",
    metaTitle: "Software Engineer Cover Letter Example - Free PDF",
    metaDescription:
      "A software engineer cover letter example with one in-depth project story, real numbers and a link to the company's product. Edit free and download a PDF.",
    heading: "Software Engineer Cover Letter Example",
    intro:
      "A focused software engineer cover letter that skips the buzzwords and tells one technical story with real numbers - the kind engineering managers actually read.",
    highlights: {
      title: "What engineering managers look for",
      items: [
        "Your stack and the scale you work at, in the first paragraph",
        "One project with a measurable result: latency, uptime or cost",
        "A link between your experience and their product",
        "How you work with others: reviews, mentoring, on-call",
        "Brevity - engineers skim",
      ],
    },
    guide: [
      {
        heading: "Pick one project and go deep",
        paragraphs: [
          "Your resume already lists your experience, so don't repeat it. Use the cover letter to tell the story of one project that matches the job: the problem, the decision you made, and the result in numbers - latency, throughput, uptime, cost or developer time saved.",
          "Specific technical choices show judgement. 'Moved to an event-driven design with Kafka, cutting p99 latency from 900 ms to 180 ms' tells an engineering manager far more than 'experienced in distributed systems'.",
        ],
      },
      {
        heading: "Show you've read the job description",
        paragraphs: [
          "Engineering job posts usually describe the team's current problems. Mirror them in your letter - if they mention scaling, reliability or breaking up a monolith, show where you've done that before.",
          "Keep it to three or four short paragraphs. Hiring managers for engineering roles often read cover letters last, so a focused 250-word letter is more likely to be read than a long one.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do software engineers need a cover letter?",
        answer:
          "Many tech companies make it optional, but a short, specific letter helps when you're changing domains, applying to a startup or writing directly to a hiring manager.",
      },
      {
        question: "Should I link to GitHub in my cover letter?",
        answer:
          "Put your GitHub and LinkedIn in the letter's header. Mention a specific repository in the body only if it's directly relevant to the role.",
      },
    ],
    document: letter({
      templateId: "classic-charcoal",
      basics: {
        name: "Vivek Krishnan",
        headline: "Backend Engineer",
        email: "vivek.krishnan@email.com",
        phone: "+91 99450 27368",
        location: "Bengaluru, India",
        links: [
          ["GitHub", "github.com/vivekkrishnan"],
          ["LinkedIn", "linkedin.com/in/vivekkrishnan"],
        ],
      },
      recipient: {
        name: "Ms. Neha Gupta",
        title: "Engineering Manager, Payments",
        company: "Paysetu Technologies",
        address: "3rd Floor, Outer Ring Road, Bellandur\nBengaluru, Karnataka 560103",
      },
      subject: "Application for Senior Backend Engineer - Payments",
      greeting: "Dear Ms. Gupta,",
      paragraphs: [
        "I'm writing to apply for the Senior Backend Engineer role on the payments team at Paysetu. I've spent five years building high-volume backend systems in Java and Go, and the problems in your job description - reliability at peak load, reconciliation and clean APIs for merchants - are the ones I've enjoyed most.",
        "At my current company I own the order and payments service, which handles 1.2 million transactions on a normal day and four times that during sales. Last year I led its move from a single shared database to an event-driven design with Kafka, which cut p99 latency from 900 ms to 180 ms and took us through our biggest sale with no payment downtime. I also built an automated reconciliation job that replaced a manual daily process and flags mismatches within minutes instead of the next morning.",
        "Beyond the code, I care about how teams work. I introduced lightweight design reviews and on-call runbooks that halved our repeat incidents, and I mentor two junior engineers. I'd like to bring that mix of hands-on engineering and steady team habits to Paysetu as you scale UPI and card payments for small merchants.",
        "I'd welcome the chance to talk about the role. Thank you for your time and consideration.",
      ],
      closing: "Best regards,",
    }),
  },
  {
    slug: "sales",
    name: "Sales",
    summary: "Account executives and business development.",
    metaTitle: "Sales Cover Letter Example - Free Template (PDF)",
    metaDescription:
      "A sales cover letter example with target attainment, a deal story and territory knowledge. Edit it free in the cover letter builder and download a PDF.",
    heading: "Sales Cover Letter Example",
    intro:
      "A sales cover letter should read like a good pitch. This example opens with the numbers, tells one deal story and closes by asking for the meeting.",
    highlights: {
      title: "What a sales cover letter needs",
      items: [
        "Your best number in the opening paragraph",
        "Target attainment, with the size of the target",
        "One deal story: its size, cycle and who you sold to",
        "How you build your own pipeline",
        "Why you fit their market or territory",
        "A confident close that asks for the conversation",
      ],
    },
    guide: [
      {
        heading: "Sell yourself like you sell the product",
        paragraphs: [
          "A sales cover letter is a pitch, and the hiring manager is the buyer. Open with your strongest proof - target attainment, revenue closed or a big win - and keep the focus on what you'll deliver for them.",
          "Give your target alongside your attainment. '132% of a ₹1.8 crore target' paints a clear picture of both your results and the size of business you're used to.",
        ],
      },
      {
        heading: "Show you know their market",
        paragraphs: [
          "Sales leaders want reps who ramp up quickly. Mention the industries, customer sizes and territories you've sold into, and the relationships or market knowledge you'd bring with you.",
          "End like a good sales email: confident, specific and with a clear next step. Asking for a conversation about the role works better than a generic 'I look forward to hearing from you'.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I repeat my sales numbers in the cover letter?",
        answer:
          "Yes, your best one or two. The letter may be read before your resume, and leading with your strongest result makes sure it isn't missed.",
      },
      {
        question: "How do I write a sales cover letter with no sales experience?",
        answer:
          "Use results from any role that involved persuading people or hitting targets: retail, fundraising, college sponsorships or upselling in customer service. Show you're comfortable with targets and rejection.",
      },
    ],
    document: letter({
      templateId: "modern-indigo",
      basics: {
        name: "Harpreet Kaur",
        headline: "Business Development Manager - B2B Software",
        email: "harpreet.kaur@email.com",
        phone: "+91 98140 59236",
        location: "Chandigarh, India",
        links: [["LinkedIn", "linkedin.com/in/harpreetkaur"]],
      },
      recipient: {
        name: "Mr. Amit Joshi",
        title: "Regional Sales Head - North",
        company: "Workwise HR Software",
        address: "Plot 14, Sector 18\nGurugram, Haryana 122015",
      },
      subject: "Application for Senior Account Executive - North India",
      greeting: "Dear Mr. Joshi,",
      paragraphs: [
        "I'm applying for the Senior Account Executive role covering North India at Workwise. In four years selling B2B software to mid-sized companies across Punjab, Haryana and Delhi NCR, I've closed ₹6.5 crore in new business and finished above target every year - and HR software for growing companies is a market I already know well.",
        "I currently sell payroll and attendance software to manufacturers and retail chains with 200 to 2,000 employees. In 2025 I achieved 132% of my ₹1.8 crore target, and I closed our largest deal in the region: a ₹42 lakh contract with a 30-store retail chain after a seven-month cycle involving HR, finance and IT. I generate most of my own pipeline through LinkedIn outreach, industry association events and referrals from happy customers.",
        "Workwise's growth among mid-market companies in the north is what excites me about this role. I already have relationships with HR heads in Ludhiana, Mohali and Gurugram, and I understand the payroll compliance questions that come up in almost every sales conversation here. I'd expect to build a qualified pipeline quickly and contribute to the team's number within my first quarter.",
        "I'd welcome a conversation about your plans for the region and how I can help you reach them. Thank you for your consideration.",
      ],
      closing: "Warm regards,",
    }),
  },
  {
    slug: "teacher",
    name: "Teacher",
    summary: "School teachers applying to new schools.",
    metaTitle: "Teacher Cover Letter Example - Free Template (PDF)",
    metaDescription:
      "A teacher cover letter example with qualifications, classes taught, student results and co-curricular roles. Edit it free and download a PDF.",
    heading: "Teacher Cover Letter Example",
    intro:
      "A teacher's cover letter that gives principals what they look for: the post, your qualifications, your classroom results and what you'll add to school life.",
    highlights: {
      title: "What schools look for in a cover letter",
      items: [
        "The post you're applying for (PRT, TGT or PGT) and the subject",
        "Qualifications: your degree, B.Ed, and CTET or TET where required",
        "Classes, boards and years of experience",
        "Student results and improvements",
        "Co-curricular activities you'll lead",
        "An offer to give a demo lesson",
      ],
    },
    guide: [
      {
        heading: "Lead with the post and your qualifications",
        paragraphs: [
          "Schools receive many applications for each vacancy and often sort them by eligibility first. Name the exact post and subject in your subject line and first sentence, and state your qualifications - degree, B.Ed, and CTET or TET where relevant - straight away.",
          "Mention the boards you've taught (CBSE, ICSE, IB, Cambridge or a state board) and the classes, so the principal can see at a glance that you fit.",
        ],
      },
      {
        heading: "Show what happens in your classroom",
        paragraphs: [
          "Principals want to know how students do with you. Share a result - board averages, pass rates or competition wins - and one or two methods you use, such as writing workshops, activity-based learning or smart-class tools.",
          "Close by offering a demo lesson. It's a common step in school hiring, and offering it up front shows confidence in your teaching.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I address the cover letter to the principal?",
        answer:
          "Yes. Use the principal's name if you know it; otherwise 'Dear Principal' is appropriate. For larger school groups, the job advertisement may name an HR contact instead.",
      },
      {
        question: "Should a teacher's cover letter mention co-curricular activities?",
        answer:
          "Yes. Schools value teachers who can lead clubs, events, sports or competitions, so mention the activities you'd be glad to take on.",
      },
    ],
    document: letter({
      templateId: "sidebar-emerald",
      basics: {
        name: "Lakshmi Narayanan",
        headline: "English Teacher (PGT) - CBSE",
        email: "lakshmi.narayanan@email.com",
        phone: "+91 94440 72519",
        location: "Chennai, India",
      },
      recipient: {
        name: "The Principal",
        title: "",
        company: "Greenfield International School",
        address: "Velachery Main Road\nChennai, Tamil Nadu 600042",
      },
      subject: "Application for the Post of PGT English",
      greeting: "Dear Principal,",
      paragraphs: [
        "I'm writing to apply for the post of PGT English at Greenfield International School, as advertised on your website. I hold an M.A. in English and a B.Ed from the University of Madras, and I've taught English to Classes 9-12 in CBSE schools for eight years.",
        "At my current school I teach English Core to four sections of Classes 11 and 12. Over the last three years our Class 12 board average in English has risen from 74% to 86%, helped by weekly writing workshops and personal feedback on every practice paper. I also started a reading club that now has 60 members and edits the school's annual magazine, and I coordinate the inter-house debate competition.",
        "Greenfield's focus on spoken English and creative expression matches the way I like to teach. I'd welcome the chance to contribute to your literary activities, mentor students preparing for debates and Model UN, and support colleagues with digital tools I use every day, such as Google Classroom and online quizzes.",
        "I've enclosed my resume and certificates, and I'd be happy to give a demo lesson at your convenience. Thank you for considering my application.",
      ],
      closing: "Yours sincerely,",
    }),
  },
];
