import type { UseCase, UseCaseCollection } from "@/components/tool/use-case";
import {
  SECTION_IDS,
  type Basics,
  type Certification,
  type Education,
  type Experience,
  type Language,
  type Project,
  type Resume,
  type SectionId,
  type SkillGroup,
} from "./schema";

/*
 * Resume examples: one landing page per job (/resume-builder/examples/<slug>), each with a complete
 * example resume that opens in the builder with "Use this example".
 */

export const RESUME_EXAMPLES_COLLECTION: UseCaseCollection = {
  toolSlug: "resume-builder",
  segment: "examples",
  title: "Resume Examples",
  noun: "resume",
  metaTitle: "Resume Examples for Every Job - Free to Edit",
  metaDescription:
    "Free resume examples for freshers, interns, software engineers, data analysts, accountants, teachers, nurses and more. Edit any example and download a PDF.",
  intro:
    "Real, complete resume examples written for specific jobs. Open one in the free resume builder, replace the details with yours and download a polished PDF - no sign-up, no watermark.",
};

let counter = 0;
const id = () => `example-${++counter}`;

const job = (
  role: string,
  company: string,
  location: string,
  startDate: string,
  endDate: string,
  bullets: string[],
): Experience => ({
  id: id(),
  role,
  company,
  location,
  startDate,
  endDate,
  current: endDate === "",
  description: bullets.join("\n"),
});

const school = (
  degree: string,
  name: string,
  location: string,
  startDate: string,
  endDate: string,
  score = "",
  details: string[] = [],
): Education => ({
  id: id(),
  degree,
  school: name,
  location,
  startDate,
  endDate,
  score,
  description: details.join("\n"),
});

const skills = (name: string, list: string): SkillGroup => ({ id: id(), name, skills: list });
const project = (name: string, subtitle: string, link: string, date: string, bullets: string[]): Project => ({
  id: id(),
  name,
  subtitle,
  link,
  date,
  description: bullets.join("\n"),
});
const cert = (name: string, issuer: string, date: string): Certification => ({
  id: id(),
  name,
  issuer,
  date,
});
const lang = (name: string, level: string): Language => ({ id: id(), name, level });

interface ExampleResume {
  templateId: string;
  basics: Omit<Basics, "photo" | "links" | "details"> & { links?: [string, string][] };
  summary: string;
  experience?: Experience[];
  education?: Education[];
  skills?: SkillGroup[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  order?: SectionId[];
}

function resume({ basics, order, ...rest }: ExampleResume): Resume {
  const { links = [], ...person } = basics;
  return {
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    ...rest,
    basics: {
      ...person,
      photo: "",
      links: links.map(([label, url]) => ({ id: id(), label, url })),
      details: [],
    },
    customSections: [],
    sectionOrder: order ?? [...SECTION_IDS],
    sectionTitles: {},
    hiddenSections: [],
  };
}

export const RESUME_EXAMPLES: UseCase<Resume>[] = [
  {
    slug: "fresher",
    name: "Fresher",
    summary: "For graduates with little or no work experience.",
    metaTitle: "Resume Format for Freshers - Free Example (PDF)",
    metaDescription:
      "A resume example for freshers and recent graduates: education and projects first, internships, skills and certifications. Edit it free and download a PDF.",
    heading: "Resume Format for Freshers",
    intro:
      "No work experience yet? This fresher resume leads with your education, projects and internships - the things recruiters actually look at for entry-level roles.",
    highlights: {
      title: "What a fresher resume should include",
      items: [
        "A two-line summary of the role you want and what you bring",
        "Education first, with your degree, college and CGPA or percentage",
        "Academic and personal projects with what you built and the result",
        "Internships, part-time work, freelancing or volunteering",
        "Technical and soft skills grouped so they're easy to scan",
        "Certifications and online courses relevant to the job",
      ],
    },
    guide: [
      {
        heading: "How to write a resume with no experience",
        paragraphs: [
          "Recruiters hiring freshers know you don't have years of experience. What they want is evidence that you can learn quickly and do the work. Projects, internships and coursework are that evidence - so put them near the top, using Section order in the builder.",
          "Describe projects like jobs: what you built, which tools you used and what happened. 'Built a library management app in React used by 200 students in my college' is far stronger than 'Made a library project'.",
        ],
      },
      {
        heading: "Keep it to one page",
        paragraphs: [
          "A fresher resume should fit on a single page. Cut school-level details (10th and 12th marks) unless the employer asks for them, drop hobbies that don't relate to the job, and keep each bullet to one line where you can.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should a fresher's resume include 10th and 12th marks?",
        answer:
          "Only if the job posting or company asks for them - many Indian campus recruiters and government jobs do. Otherwise your degree and CGPA are enough, and the space is better used for projects.",
      },
      {
        question: "What if I have no internship?",
        answer:
          "Use projects, hackathons, freelance work, college clubs or volunteering instead. Anything where you built, organised or delivered something counts as experience.",
      },
      {
        question: "Which template is best for freshers?",
        answer:
          "A single-column, ATS-friendly template such as Classic or Modern. Many companies screen fresher applications with software, which reads single-column layouts most reliably.",
      },
    ],
    document: resume({
      templateId: "modern-teal",
      basics: {
        name: "Ananya Iyer",
        headline: "Computer Science Graduate",
        email: "ananya.iyer@email.com",
        phone: "+91 98450 12345",
        location: "Chennai, India",
        links: [
          ["LinkedIn", "linkedin.com/in/ananyaiyer"],
          ["GitHub", "github.com/ananyaiyer"],
        ],
      },
      summary:
        "Computer science graduate with hands-on experience building web apps in React and Node.js through internships and projects. Quick learner looking for a junior developer role.",
      education: [
        school("B.E. Computer Science", "Anna University - CEG", "Chennai", "2022", "2026", "CGPA 8.9/10", [
          "Coursework: Data Structures, DBMS, Operating Systems, Computer Networks",
        ]),
      ],
      projects: [
        project("CampusCart", "React, Node.js, MongoDB", "github.com/ananyaiyer/campuscart", "2025", [
          "Built a marketplace for students to buy and sell used books, used by 300+ students",
          "Added search and chat, cutting average time to sell a book from 9 days to 3",
        ]),
        project("Attendance Tracker", "Python, OpenCV", "", "2024", [
          "Face-recognition attendance system for classrooms with 95% accuracy",
        ]),
      ],
      experience: [
        job("Software Development Intern", "Zoho", "Chennai", "May 2025", "Jul 2025", [
          "Fixed 20+ bugs in a customer support dashboard used by 5,000 agents",
          "Wrote unit tests that raised module coverage from 40% to 75%",
        ]),
      ],
      skills: [
        skills("Programming", "JavaScript, TypeScript, Python, Java, SQL"),
        skills("Web", "React, Node.js, Express, HTML, CSS"),
        skills("Tools", "Git, MongoDB, Postman, VS Code"),
      ],
      certifications: [cert("Meta Front-End Developer", "Coursera", "2025")],
      order: ["summary", "education", "projects", "experience", "skills", "certifications", "languages"],
    }),
  },
  {
    slug: "software-engineer",
    name: "Software Engineer",
    summary: "Backend, frontend and full-stack developers.",
    metaTitle: "Software Engineer Resume Example - ATS-Friendly",
    metaDescription:
      "A software engineer resume example with impact-driven bullets, a tech stack that ATS software reads, and projects. Edit it free and download a PDF.",
    heading: "Software Engineer Resume Example",
    intro:
      "A clean, ATS-friendly software engineer resume that shows impact, not just technologies - the format hiring managers at product companies and startups look for.",
    highlights: {
      title: "What makes this resume work",
      items: [
        "Each bullet shows a result: speed, scale, revenue or reliability",
        "The tech stack is grouped so recruiters and ATS find keywords fast",
        "Recent experience gets the most detail; older roles stay short",
        "Links to GitHub and LinkedIn for proof of work",
        "Fits on one page for under 8 years of experience",
      ],
    },
    guide: [
      {
        heading: "Write bullets that show impact",
        paragraphs: [
          "'Worked on the payments service' says what you touched, not what you achieved. Use the pattern action + what + result: 'Rebuilt the payments service in Go, cutting p95 latency from 800 ms to 120 ms'. Numbers make bullets believable and memorable.",
          "If you don't have exact figures, estimate honestly: users served, requests per second, hours saved per week, bugs reduced or deploy frequency.",
        ],
      },
      {
        heading: "Make it easy for applicant tracking systems",
        paragraphs: [
          "Most tech companies screen resumes with an ATS. Use a single-column template, standard section names and spell out technologies the way the job description does - for example both 'Amazon Web Services' and 'AWS'.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I list every technology I've used?",
        answer:
          "No. List the ones you'd be comfortable being interviewed on, led by those in the job description. A focused list of 10-15 is more convincing than 40.",
      },
      {
        question: "Do I need a projects section as an experienced engineer?",
        answer:
          "It's optional. Include open-source work or side projects if they show skills your day job doesn't, or if they're impressive in their own right.",
      },
    ],
    document: resume({
      templateId: "classic-charcoal",
      basics: {
        name: "Rohan Mehta",
        headline: "Senior Software Engineer",
        email: "rohan.mehta@email.com",
        phone: "+91 99000 11223",
        location: "Bengaluru, India",
        links: [
          ["GitHub", "github.com/rohanmehta"],
          ["LinkedIn", "linkedin.com/in/rohanmehta"],
        ],
      },
      summary:
        "Backend engineer with 6 years of experience designing reliable, high-traffic systems in Go and Java. I care about simple architecture, fast feedback loops and mentoring.",
      experience: [
        job("Senior Software Engineer", "Razorpay", "Bengaluru", "Jan 2023", "", [
          "Rebuilt the settlements service in Go, cutting p95 latency from 800 ms to 120 ms",
          "Designed an event-driven reconciliation pipeline processing 40M transactions a day",
          "Led a team of 4 engineers and introduced design reviews that halved production incidents",
        ]),
        job("Software Engineer", "Freshworks", "Chennai", "Jul 2020", "Dec 2022", [
          "Built REST and GraphQL APIs in Java used by 30,000 business customers",
          "Moved CI from Jenkins to GitHub Actions, cutting build time from 25 to 8 minutes",
          "Shipped a rate limiter that stopped abusive traffic without affecting real users",
        ]),
      ],
      education: [
        school("B.Tech Computer Science", "IIIT Hyderabad", "Hyderabad", "2016", "2020", "CGPA 8.4/10"),
      ],
      skills: [
        skills("Languages", "Go, Java, Python, SQL, TypeScript"),
        skills("Systems", "PostgreSQL, Kafka, Redis, gRPC, Docker, Kubernetes"),
        skills("Cloud", "AWS (EC2, RDS, SQS, Lambda), Terraform, Grafana"),
      ],
      projects: [
        project("go-ratelimit", "Open-source Go library", "github.com/rohanmehta/go-ratelimit", "2024", [
          "Distributed rate limiter with 1,800 GitHub stars and 40 contributors",
        ]),
      ],
    }),
  },
  {
    slug: "data-analyst",
    name: "Data Analyst",
    summary: "SQL, Excel, Power BI and Python analysts.",
    metaTitle: "Data Analyst Resume Example - Free Template (PDF)",
    metaDescription:
      "A data analyst resume example showing SQL, Python, Power BI and Excel skills with business impact. Edit it in the free resume builder and download a PDF.",
    heading: "Data Analyst Resume Example",
    intro:
      "A data analyst resume that connects your SQL and dashboards to business decisions - because companies hire analysts for insight, not just queries.",
    highlights: {
      title: "Skills to include for data analyst roles",
      items: [
        "SQL - the most requested skill in analyst job postings",
        "Excel or Google Sheets: pivot tables, lookups, modelling",
        "A BI tool: Power BI, Tableau or Looker",
        "Python or R for cleaning and analysis (pandas, NumPy)",
        "Statistics and A/B testing basics",
        "Communicating findings to non-technical teams",
      ],
    },
    guide: [
      {
        heading: "Show the decision your analysis changed",
        paragraphs: [
          "The strongest analyst bullets end with a business outcome: 'Built a churn dashboard in Power BI that helped the retention team cut monthly churn from 6% to 4.5%'. Mention the tool, but lead with the problem you solved.",
        ],
      },
      {
        heading: "Breaking into data analytics",
        paragraphs: [
          "If you're switching careers, add a Projects section with two or three analyses on public datasets - with a link to your notebook or dashboard. Certifications such as the Google Data Analytics or Microsoft PL-300 help your resume pass keyword filters.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should a data analyst resume include a portfolio link?",
        answer:
          "Yes, if you have one. A link to a Tableau Public, GitHub or Kaggle profile lets hiring managers see your work immediately.",
      },
      {
        question: "How do I describe dashboards on my resume?",
        answer:
          "Say who used it, what it tracked and what changed because of it - for example how often leaders used it or a decision it informed.",
      },
    ],
    document: resume({
      templateId: "executive-slate",
      basics: {
        name: "Priya Nair",
        headline: "Data Analyst",
        email: "priya.nair@email.com",
        phone: "+91 98200 44556",
        location: "Mumbai, India",
        links: [["LinkedIn", "linkedin.com/in/priyanair"]],
      },
      summary:
        "Data analyst with 3 years of experience turning messy data into dashboards and recommendations that sales and product teams act on. Strong in SQL, Python and Power BI.",
      experience: [
        job("Data Analyst", "Nykaa", "Mumbai", "Aug 2023", "", [
          "Built a churn dashboard in Power BI that helped cut monthly churn from 6% to 4.5%",
          "Analysed 2M orders to redesign delivery slots, raising on-time delivery by 12%",
          "Automated weekly sales reporting with Python, saving the team 6 hours a week",
        ]),
        job("Junior Analyst", "Mu Sigma", "Bengaluru", "Jul 2022", "Jul 2023", [
          "Cleaned and modelled retail data for 3 US clients using SQL and Excel",
          "Ran A/B test analyses for pricing experiments across 400 stores",
        ]),
      ],
      education: [
        school("B.Sc. Statistics", "St. Xavier's College", "Mumbai", "2019", "2022", "First class"),
      ],
      skills: [
        skills("Analysis", "SQL, Python (pandas, NumPy), Excel, statistics, A/B testing"),
        skills("Visualisation", "Power BI, Tableau, Looker Studio"),
        skills("Data", "BigQuery, PostgreSQL, dbt"),
      ],
      certifications: [
        cert("Microsoft Certified: Power BI Data Analyst (PL-300)", "Microsoft", "2024"),
        cert("Google Data Analytics Certificate", "Google", "2022"),
      ],
    }),
  },
  {
    slug: "product-manager",
    name: "Product Manager",
    summary: "PMs and associate product managers.",
    metaTitle: "Product Manager Resume Example - Free Template",
    metaDescription:
      "A product manager resume example built around outcomes: launches, metrics and cross-functional leadership. Edit it free and download a PDF.",
    heading: "Product Manager Resume Example",
    intro:
      "Product managers are judged on outcomes. This resume shows what was launched, which metric moved and how the team was led - in a polished executive layout.",
    highlights: {
      title: "What hiring managers look for",
      items: [
        "Launches you owned, with the metric each one moved",
        "How you found the problem: research, data, customer calls",
        "Working with engineering, design and business teams",
        "Prioritisation and saying no",
        "The domain you know: fintech, SaaS, consumer, B2B",
      ],
    },
    guide: [
      {
        heading: "Lead every bullet with an outcome",
        paragraphs: [
          "'Managed the onboarding roadmap' describes a job. 'Redesigned onboarding, raising week-one activation from 32% to 47%' describes a product manager. Pick the metric your company cared about - activation, retention, revenue, NPS - and show how you moved it.",
        ],
      },
      {
        heading: "Moving into product management",
        paragraphs: [
          "Engineers, designers, analysts and consultants often move into product. Highlight moments where you made product decisions already: defining requirements, running user interviews, analysing usage data or prioritising a backlog.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should a PM resume list tools like Jira and Figma?",
        answer:
          "Briefly, in the skills section. Tools matter far less than outcomes, so keep the space for what you shipped and its impact.",
      },
      {
        question: "How long should a product manager's resume be?",
        answer: "One page for up to about 8 years of experience; two pages for senior and group PM roles.",
      },
    ],
    document: resume({
      templateId: "executive-forest",
      basics: {
        name: "Karan Malhotra",
        headline: "Product Manager - Fintech",
        email: "karan.malhotra@email.com",
        phone: "+91 98111 77889",
        location: "Gurugram, India",
        links: [["LinkedIn", "linkedin.com/in/karanmalhotra"]],
      },
      summary:
        "Product manager with 5 years in fintech, leading cross-functional teams from discovery to launch. Known for clear prioritisation and turning customer insight into measurable growth.",
      experience: [
        job("Product Manager", "PhonePe", "Bengaluru", "Apr 2023", "", [
          "Redesigned merchant onboarding, raising week-one activation from 32% to 47%",
          "Launched instant settlements for 2M small merchants, adding ₹40 crore in monthly volume",
          "Run discovery with 30+ merchant interviews a quarter to shape the roadmap",
        ]),
        job("Associate Product Manager", "Paytm", "Noida", "Jun 2021", "Mar 2023", [
          "Owned the bill payments funnel; cut drop-off at checkout by 18%",
          "Worked with 8 engineers and 2 designers in two-week cycles",
        ]),
      ],
      education: [
        school("MBA", "IIM Lucknow", "Lucknow", "2019", "2021"),
        school("B.Tech Electronics", "NIT Kurukshetra", "Kurukshetra", "2014", "2018"),
      ],
      skills: [
        skills("Product", "Discovery, roadmapping, PRDs, A/B testing, pricing"),
        skills("Data", "SQL, Mixpanel, Amplitude, Excel"),
        skills("Tools", "Jira, Figma, Notion"),
      ],
    }),
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    summary: "SEO, performance and social media marketers.",
    metaTitle: "Digital Marketing Resume Example - Free Template",
    metaDescription:
      "A digital marketing resume example with campaign results, SEO and paid ads skills and tools. Edit it free in the resume builder and download a PDF.",
    heading: "Digital Marketing Resume Example",
    intro:
      "Marketing is measurable - and so is a great marketing resume. This example shows traffic, leads and return on ad spend, not just the channels you've worked on.",
    highlights: {
      title: "Metrics worth putting on your resume",
      items: [
        "Organic traffic and keyword ranking growth",
        "Leads, sign-ups or sales generated",
        "Return on ad spend (ROAS) and cost per acquisition (CPA)",
        "Email open and click-through rates",
        "Followers and engagement, tied to business results",
      ],
    },
    guide: [
      {
        heading: "Turn campaigns into results",
        paragraphs: [
          "Instead of listing channels, describe campaigns and their numbers: 'Ran Google and Meta ads with a ₹5 lakh monthly budget at 4.2x ROAS'. If you can't share exact revenue, use percentages and growth rates.",
        ],
      },
      {
        heading: "Show your marketing stack",
        paragraphs: [
          "Recruiters filter for tools. Group them clearly - analytics (Google Analytics 4, Search Console), ads (Google Ads, Meta Ads Manager), SEO (Ahrefs, Semrush) and automation (HubSpot, Mailchimp) - and include the certifications Google and HubSpot offer free.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I include a portfolio on a marketing resume?",
        answer:
          "Yes - link to case studies, campaigns or content you've written. For social media roles, link to accounts you've grown.",
      },
      {
        question: "Can I use a creative resume template for marketing?",
        answer:
          "A touch of colour works well for marketing roles. Keep it readable: a Modern or Split template looks distinctive while staying easy to scan.",
      },
    ],
    document: resume({
      templateId: "split-orange",
      basics: {
        name: "Neha Kapoor",
        headline: "Digital Marketing Manager",
        email: "neha.kapoor@email.com",
        phone: "+91 98765 99887",
        location: "Pune, India",
        links: [
          ["LinkedIn", "linkedin.com/in/nehakapoor"],
          ["Portfolio", "nehakapoor.in"],
        ],
      },
      summary:
        "Digital marketer with 5 years of experience growing D2C and SaaS brands through SEO, paid ads and email. I plan with data and report in revenue.",
      experience: [
        job("Digital Marketing Manager", "Mamaearth", "Gurugram", "Feb 2023", "", [
          "Managed a ₹50 lakh monthly ad budget across Google and Meta at 4.2x ROAS",
          "Grew organic traffic from 200k to 650k monthly visits in 14 months",
          "Built email flows that now drive 18% of online revenue",
        ]),
        job("SEO Specialist", "Wingify", "Delhi", "Jun 2020", "Jan 2023", [
          "Ranked 40 product pages on page one for high-intent keywords",
          "Doubled blog sign-ups with content upgrades and better calls to action",
        ]),
      ],
      education: [school("BBA Marketing", "Symbiosis", "Pune", "2017", "2020")],
      skills: [
        skills("Channels", "SEO, Google Ads, Meta Ads, email, content"),
        skills("Tools", "GA4, Search Console, Ahrefs, HubSpot, Mailchimp, Canva"),
      ],
      certifications: [
        cert("Google Ads Search Certification", "Google", "2025"),
        cert("Inbound Marketing", "HubSpot Academy", "2024"),
      ],
      languages: [lang("English", "Fluent"), lang("Hindi", "Native")],
    }),
  },
  {
    slug: "sales",
    name: "Sales Executive",
    summary: "Sales, business development and account managers.",
    metaTitle: "Sales Executive Resume Example - Free Template",
    metaDescription:
      "A sales executive resume example with targets, quota attainment and deal sizes. Edit it free in the resume builder and download a PDF.",
    heading: "Sales Executive Resume Example",
    intro:
      "Sales hiring comes down to one question: will you hit your number? This resume answers it with quota attainment, revenue and deal sizes on every line.",
    highlights: {
      title: "Numbers every sales resume needs",
      items: [
        "Quota or target attainment, e.g. 128% of annual target",
        "Revenue closed and average deal size",
        "Pipeline generated and conversion rates",
        "New accounts won and retention or renewal rates",
        "Rankings and awards: top performer, President's Club",
      ],
    },
    guide: [
      {
        heading: "Lead with your numbers",
        paragraphs: [
          "Put your best result in the summary and your target attainment in each role. Hiring managers compare candidates quickly, and 'achieved 128% of a ₹2 crore target' stands out instantly.",
        ],
      },
      {
        heading: "Show how you sell",
        paragraphs: [
          "Mention the kind of sales you do - inside or field, SMB or enterprise, transactional or consultative - and your sales cycle length. It helps the reader see you fit their team.",
        ],
      },
    ],
    faqs: [
      {
        question: "What if I missed my target one year?",
        answer:
          "Lead with results you're proud of, such as your best quarter, biggest deal or year-over-year growth. Don't misstate numbers; they're easy to check in interviews.",
      },
      {
        question: "Should a sales resume include a CRM?",
        answer: "Yes. Salesforce, HubSpot and Zoho CRM are common keywords in sales job postings.",
      },
    ],
    document: resume({
      templateId: "modern-indigo",
      basics: {
        name: "Arjun Reddy",
        headline: "Enterprise Sales Executive",
        email: "arjun.reddy@email.com",
        phone: "+91 90000 55667",
        location: "Hyderabad, India",
        links: [["LinkedIn", "linkedin.com/in/arjunreddy"]],
      },
      summary:
        "B2B sales executive with 6 years of selling SaaS to mid-market and enterprise companies. Consistently above target, with ₹9 crore closed in the last two years.",
      experience: [
        job("Enterprise Account Executive", "Darwinbox", "Hyderabad", "Mar 2022", "", [
          "Achieved 128% of a ₹4 crore annual target in 2024 and 112% in 2023",
          "Closed the company's largest deal in the region: ₹1.2 crore with a 9-month cycle",
          "Built a pipeline of ₹15 crore through outbound and partner referrals",
        ]),
        job("Sales Executive", "IndiaMART", "Hyderabad", "Jun 2019", "Feb 2022", [
          "Won 140 new SMB accounts in two years; top performer in 5 of 8 quarters",
        ]),
      ],
      education: [school("MBA Marketing", "ICFAI Business School", "Hyderabad", "2017", "2019")],
      skills: [
        skills("Sales", "Solution selling, MEDDIC, negotiation, account planning, forecasting"),
        skills("Tools", "Salesforce, HubSpot, LinkedIn Sales Navigator"),
      ],
      languages: [lang("English", "Fluent"), lang("Telugu", "Native"), lang("Hindi", "Fluent")],
    }),
  },
  {
    slug: "teacher",
    name: "Teacher",
    summary: "School teachers and educators.",
    metaTitle: "Teacher Resume Example - Free Template (PDF)",
    metaDescription:
      "A teacher resume example with B.Ed, subjects, classes taught, results and certifications such as CTET. Edit it free and download a PDF.",
    heading: "Teacher Resume Example",
    intro:
      "A teacher resume that shows schools what they need to see: your qualifications, the classes and subjects you teach, and how your students improved.",
    highlights: {
      title: "What schools look for",
      items: [
        "Teaching qualification (B.Ed, D.El.Ed) and eligibility (CTET, TET)",
        "Subjects and grades you've taught, and the board (CBSE, ICSE, IB, state)",
        "Student results and improvements",
        "Classroom methods: activity-based learning, smart classes, inclusion",
        "Extra responsibilities: class teacher, clubs, events, exam duties",
      ],
    },
    guide: [
      {
        heading: "Show the difference you make",
        paragraphs: [
          "Schools want evidence that students learn with you. Mention board results, pass rates, improvement in class averages or competitions your students won - for example 'Raised the class Science average from 64% to 78% in one year'.",
        ],
      },
      {
        heading: "Include eligibility up front",
        paragraphs: [
          "Many schools filter applications by qualification. Put your B.Ed and CTET or TET status in the summary or headline so they're seen immediately.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should a teacher resume include a photo?",
        answer:
          "Many schools in India expect one. Choose a template with a photo, such as Modern or Sidebar, and use a clear, professional picture.",
      },
      {
        question: "How do I write a resume for my first teaching job?",
        answer:
          "Lead with your education and teaching practice (internship) during your B.Ed, then add tutoring, coaching or volunteering with children.",
      },
    ],
    document: resume({
      templateId: "sidebar-emerald",
      basics: {
        name: "Meera Joshi",
        headline: "Science Teacher (TGT) - CBSE",
        email: "meera.joshi@email.com",
        phone: "+91 94220 33445",
        location: "Jaipur, India",
      },
      summary:
        "CTET-qualified science teacher with 7 years of experience teaching Classes 6-10 in CBSE schools. I use experiments and activity-based learning to make science stick.",
      experience: [
        job("Science Teacher (TGT)", "Delhi Public School", "Jaipur", "Apr 2021", "", [
          "Teach Physics and Chemistry to 5 sections of Classes 8-10",
          "Raised the Class 10 board average in Science from 71% to 84% in two years",
          "Class teacher for 40 students and coordinator of the school science club",
        ]),
        job("Science Teacher", "St. Anselm's School", "Jaipur", "Jun 2018", "Mar 2021", [
          "Introduced weekly lab activities; students' practical scores rose by 15%",
        ]),
      ],
      education: [
        school("B.Ed", "University of Rajasthan", "Jaipur", "2016", "2018", "First division"),
        school("M.Sc. Chemistry", "University of Rajasthan", "Jaipur", "2014", "2016"),
      ],
      skills: [
        skills("Teaching", "Lesson planning, activity-based learning, assessment, classroom management"),
        skills("Digital", "Google Classroom, smart boards, MS Office"),
      ],
      certifications: [cert("CTET Paper II (Science)", "CBSE", "2018")],
      languages: [lang("English", "Fluent"), lang("Hindi", "Native")],
    }),
  },
  {
    slug: "nurse",
    name: "Nurse",
    summary: "Staff nurses and nursing graduates.",
    metaTitle: "Staff Nurse Resume Example - Free Template (PDF)",
    metaDescription:
      "A staff nurse resume example with registration, clinical experience, specialties and certifications such as BLS and ACLS. Edit it free and download a PDF.",
    heading: "Nurse Resume Example",
    intro:
      "A clear, credible staff nurse resume: registration and certifications up front, then the wards, patient loads and specialties hospitals hire for.",
    highlights: {
      title: "What hospitals check first",
      items: [
        "Nursing registration number and council",
        "Life-support certifications: BLS, ACLS, PALS",
        "Departments and specialties: ICU, emergency, OT, paediatrics",
        "Patient ratio and bed strength you've handled",
        "Procedures and equipment you're trained on",
      ],
    },
    guide: [
      {
        heading: "Describe your clinical experience",
        paragraphs: [
          "Name the hospital, department and bed strength, then what you did: patient care, medication, monitoring, emergencies and teamwork. Specific procedures and equipment help hospitals match you to the right unit.",
        ],
      },
      {
        heading: "Applying abroad",
        paragraphs: [
          "For roles in the UK, Gulf, Australia or US, add your licensing exam status (NCLEX, OSCE, Prometric, DHA or HAAD) and English test scores (IELTS or OET) near the top - recruiters filter by them.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should a nurse include the registration number on a resume?",
        answer:
          "Yes. Add your nursing council registration in the certifications section or as an additional personal detail - hospitals verify it.",
      },
      {
        question: "How long should a nurse resume be?",
        answer:
          "One page for up to 5-6 years of experience, two pages if you have several specialties or senior roles.",
      },
    ],
    document: resume({
      templateId: "classic-navy",
      basics: {
        name: "Sneha Thomas",
        headline: "Staff Nurse - Critical Care",
        email: "sneha.thomas@email.com",
        phone: "+91 97440 22113",
        location: "Kochi, India",
      },
      summary:
        "Registered nurse with 5 years of critical care experience in a 40-bed ICU. Calm under pressure, skilled in ventilator care and committed to patient safety.",
      experience: [
        job("Staff Nurse - Medical ICU", "Aster Medcity", "Kochi", "Mar 2022", "", [
          "Care for 2-3 critically ill patients per shift in a 40-bed ICU",
          "Manage ventilated patients, central lines and infusion pumps",
          "Trained 12 new nurses on ICU protocols and documentation",
        ]),
        job("Staff Nurse - Emergency", "Lakeshore Hospital", "Kochi", "Jul 2020", "Feb 2022", [
          "Triaged and stabilised up to 60 patients a day in the emergency department",
        ]),
      ],
      education: [
        school("B.Sc. Nursing", "Government College of Nursing", "Kottayam", "2016", "2020", "82%"),
      ],
      skills: [
        skills("Clinical", "Ventilator care, ABG analysis, wound care, IV cannulation, ECG"),
        skills("Systems", "Electronic medical records, infection control, patient education"),
      ],
      certifications: [
        cert("Registered Nurse (RN, RM)", "Kerala Nurses and Midwives Council", "2020"),
        cert("ACLS Provider", "American Heart Association", "2024"),
        cert("BLS Provider", "American Heart Association", "2024"),
      ],
      languages: [lang("English", "Fluent"), lang("Malayalam", "Native"), lang("Hindi", "Intermediate")],
    }),
  },
  {
    slug: "hr-manager",
    name: "HR Manager",
    summary: "HR managers, HR business partners and people operations.",
    metaTitle: "HR Manager Resume Example - Free Template (PDF)",
    metaDescription:
      "An HR manager resume example with hiring, retention and HR operations results, compliance and HRMS skills. Edit it free and download a PDF.",
    heading: "HR Manager Resume Example",
    intro:
      "HR is a business function, and the best HR resumes prove it. This example shows attrition, time to hire and employee satisfaction moving in the right direction.",
    highlights: {
      title: "What an HR manager resume should show",
      items: [
        "The employee strength you support and the size of your own team",
        "Hiring results: time to hire, offer acceptance, cost per hire",
        "Retention and engagement improvements, with numbers",
        "Policy and labour law compliance: POSH, PF, ESI, gratuity",
        "HRMS and recruitment tools you've rolled out or used",
        "An HR specialisation (MBA or PGDM) and certifications such as SHRM-CP",
      ],
    },
    guide: [
      {
        heading: "Measure your HR work like a business function",
        paragraphs: [
          "HR resumes often list responsibilities - recruitment, payroll, employee engagement - without showing what changed. Leaders hire HR managers who move the numbers the business cares about: attrition, time to hire, offer acceptance and employee satisfaction.",
          "Pick two or three metrics per role and show the before and after. 'Cut voluntary attrition from 21% to 14% in 18 months' tells the reader what you achieved and how big it was, and gives an interviewer something concrete to ask about.",
        ],
      },
      {
        heading: "Show the scope of your role",
        paragraphs: [
          "HR jobs vary hugely in scale, so state it up front: how many employees you supported, across how many locations, and how large your own team was. An HRBP for 900 people and an HR head for 5,000 are hired for different jobs.",
          "Mention the compliance areas you've owned, such as POSH committees, PF and ESI, gratuity or Shops and Establishments registrations. For plant and manufacturing HR roles, add the Factories Act and industrial relations experience - recruiters search for those terms.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should an HR resume list soft skills?",
        answer:
          "Show them through results rather than listing them. 'Handled 120+ employee relations cases with no external escalations' proves judgement and communication far better than the words themselves.",
      },
      {
        question: "Is an HR certification worth adding?",
        answer:
          "Yes. An MBA or PGDM in HR is the usual requirement for HR manager roles in India, and certifications such as SHRM-CP or an HR analytics course help you stand out, especially when moving to a larger company.",
      },
    ],
    document: resume({
      templateId: "modern-rose",
      basics: {
        name: "Kavya Deshpande",
        headline: "HR Manager - Talent & People Operations",
        email: "kavya.deshpande@email.com",
        phone: "+91 98220 61478",
        location: "Pune, India",
        links: [["LinkedIn", "linkedin.com/in/kavyadeshpande"]],
      },
      summary:
        "HR manager with 8 years of experience across hiring, employee relations and HR operations in IT services. I build fair, data-driven people processes that help teams grow without losing their culture.",
      experience: [
        job("HR Manager", "Vantage Tech Services", "Pune", "Jun 2022", "", [
          "Lead a 6-member HR team supporting 2,400 employees across two delivery centres",
          "Cut voluntary attrition from 21% to 14% in 18 months with stay interviews and a new career framework",
          "Reduced average time to hire from 48 to 29 days by restructuring interviews and the referral programme",
          "Rolled out an HRMS for payroll, leave and appraisals, replacing 30+ manual spreadsheets",
        ]),
        job("HR Business Partner", "Northstar Infotech", "Pune", "Jul 2018", "May 2022", [
          "Partnered with 4 business unit heads covering 900 employees on workforce planning and appraisals",
          "Handled 120+ employee relations cases with full documentation and no external escalations",
          "Designed a 30-60-90 day onboarding plan that lifted new-joiner satisfaction from 3.6 to 4.4 out of 5",
        ]),
      ],
      education: [
        school(
          "MBA - Human Resource Management",
          "Symbiosis Institute of Business Management",
          "Pune",
          "2016",
          "2018",
        ),
      ],
      skills: [
        skills(
          "People",
          "Talent acquisition, employee relations, performance management, compensation, HR policy",
        ),
        skills("Compliance", "Labour laws, POSH, PF and ESI, gratuity, Shops and Establishments Act"),
        skills("Tools", "Darwinbox, SAP SuccessFactors, Naukri RMS, LinkedIn Recruiter, Excel"),
      ],
      certifications: [cert("SHRM Certified Professional (SHRM-CP)", "SHRM", "2023")],
      languages: [lang("English", "Fluent"), lang("Marathi", "Native"), lang("Hindi", "Fluent")],
    }),
  },
  {
    slug: "accountant",
    name: "Accountant",
    summary: "Accountants, accounts executives and CA Inter candidates.",
    metaTitle: "Accountant Resume Example (Tally & GST) - Free",
    metaDescription:
      "An accountant resume example with GST and TDS compliance, month-end closing, Tally and SAP skills. Edit it free in the resume builder and download a PDF.",
    heading: "Accountant Resume Example",
    intro:
      "An accountant resume that proves what finance managers care about most - accuracy and deadlines - with the software and compliance experience they search for.",
    highlights: {
      title: "What employers look for in an accountant",
      items: [
        "Accounting software: Tally Prime, SAP, Zoho Books or QuickBooks",
        "GST, TDS and income tax filing experience",
        "Month-end and year-end closing, and how quickly you close",
        "Reconciliations and audit support",
        "Qualifications: B.Com, M.Com, CA Inter, CMA or ACCA",
        "Advanced Excel: lookups, pivot tables and MIS reports",
      ],
    },
    guide: [
      {
        heading: "Make routine accounting work sound like results",
        paragraphs: [
          "Most accountants do similar tasks, so the way you describe them sets you apart. Rather than 'Responsible for GST filing', write 'Filed monthly GSTR-1 and GSTR-3B for 3 years with no late fees or notices'. Accuracy and timeliness are what finance managers worry about, so prove them.",
          "Look for numbers in your work: the size of the books you manage, how many days your monthly close takes, money recovered through reconciliations, or the number of clients you handle.",
        ],
      },
      {
        heading: "List your qualifications and software clearly",
        paragraphs: [
          "Finance recruiters filter by qualification and software, so make both easy to find. Add CA Inter, CMA Inter or ACCA papers cleared in the certifications section with the year, and name each accounting package rather than writing 'accounting software'.",
          "If you're preparing for your CA or CMA finals, say so in your summary - for example 'CA Final candidate (May 2027)'. Many firms value candidates who are still progressing in their qualification.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I mention CA Inter if I haven't finished CA?",
        answer:
          "Yes. Clearing CA Intermediate shows strong technical knowledge and is valued for accountant and senior accountant roles. Mention the groups cleared and the year.",
      },
      {
        question: "What's the best resume format for an accountant?",
        answer:
          "A traditional, single-column layout such as Classic. Finance employers prefer a clean, conservative look, and it reads reliably in applicant tracking systems.",
      },
    ],
    document: resume({
      templateId: "classic-burgundy",
      basics: {
        name: "Vikram Agarwal",
        headline: "Senior Accountant - GST & Financial Reporting",
        email: "vikram.agarwal@email.com",
        phone: "+91 98310 47265",
        location: "Kolkata, India",
        links: [["LinkedIn", "linkedin.com/in/vikramagarwal"]],
      },
      summary:
        "Accountant with 6 years of experience in general ledger, GST and TDS compliance and month-end closing for manufacturing and trading companies. Accurate, deadline-driven and fluent in Tally Prime, SAP FICO and Excel.",
      experience: [
        job("Senior Accountant", "Shree Balaji Polymers Pvt. Ltd.", "Kolkata", "Apr 2022", "", [
          "Manage the books of a ₹180 crore manufacturer, closing monthly accounts in 5 working days instead of 9",
          "File monthly GSTR-1 and GSTR-3B and quarterly TDS returns with no late fees or notices in 3 years",
          "Reconcile input tax credit with GSTR-2B every month, recovering ₹22 lakh of unclaimed credit",
          "Coordinate statutory and internal audits, closing all audit points within agreed timelines",
        ]),
        job("Accounts Executive", "R. K. Bansal & Associates", "Kolkata", "Jul 2020", "Mar 2022", [
          "Handled bookkeeping, GST and income tax filings for 35 SME clients of a chartered accountancy firm",
          "Prepared bank reconciliations and ledger scrutiny for the statutory audits of 12 companies",
          "Automated client MIS reports in Excel, saving about 10 hours a month",
        ]),
      ],
      education: [school("B.Com (Honours)", "St. Xavier's College", "Kolkata", "2017", "2020", "72%")],
      skills: [
        skills(
          "Accounting",
          "General ledger, payables and receivables, bank reconciliation, month-end close, fixed assets",
        ),
        skills("Tax & compliance", "GST returns, TDS, income tax, Companies Act, audit support"),
        skills("Tools", "Tally Prime, SAP FICO, Zoho Books, Advanced Excel (XLOOKUP, pivot tables)"),
      ],
      certifications: [cert("CA Intermediate (both groups)", "ICAI", "2021")],
      languages: [lang("English", "Fluent"), lang("Bengali", "Native"), lang("Hindi", "Fluent")],
    }),
  },
  {
    slug: "civil-engineer",
    name: "Civil Engineer",
    summary: "Site, project and planning engineers.",
    metaTitle: "Civil Engineer Resume Example - Free Template",
    metaDescription:
      "A civil engineer resume example with project scale, site execution, BOQ and billing, safety and software skills. Edit it free and download a PDF.",
    heading: "Civil Engineer Resume Example",
    intro:
      "A civil engineer resume built around what you've built: the type and size of each project, your role on site, and the time, cost and safety results you delivered.",
    highlights: {
      title: "What to include on a civil engineer resume",
      items: [
        "Project types and size: towers, roads, bridges, in sq ft or km",
        "Your role on site: execution, planning, QA/QC or billing",
        "Time and cost results, such as slab cycle time or savings",
        "Safety record and certifications like NEBOSH",
        "Software: AutoCAD, STAAD.Pro, Primavera P6, MS Project",
        "The workers, subcontractors or engineers you managed",
      ],
    },
    guide: [
      {
        heading: "Describe projects by scale and outcome",
        paragraphs: [
          "Hiring managers in construction want to know what you've built and how big it was. Name the project type and size - '18-storey residential tower, 3.2 lakh sq ft' or '1.2 km internal road' - before describing your work.",
          "Then show how you made a difference to time, cost, quality or safety. Faster slab cycles, savings found in contractor bills, low concrete rejection and safe man-hours are all results that matter on site.",
        ],
      },
      {
        heading: "Site, planning or design: make your track clear",
        paragraphs: [
          "Civil engineering jobs split into execution, planning and billing, QA/QC and design. Use your headline and summary to say which track you're in, and order your skills so the most relevant ones come first.",
          "If you're moving from site work into planning or design, highlight the software you use and any project where you prepared schedules, BOQs or drawings. A course in Primavera P6 or STAAD.Pro helps your resume pass keyword filters.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should a civil engineer list every project?",
        answer:
          "List the main projects within each job, with their type and scale. If you've worked on many small ones, group them - for example 'Executed 8 G+4 residential buildings across Surat'.",
      },
      {
        question: "Do I need a portfolio as a civil engineer?",
        answer:
          "Not usually for site roles. For design roles, a few sample drawings or a short project list showing your contribution can help, shared as a link or on request.",
      },
    ],
    document: resume({
      templateId: "executive-copper",
      basics: {
        name: "Rahul Solanki",
        headline: "Civil Engineer - Project Execution",
        email: "rahul.solanki@email.com",
        phone: "+91 98250 73914",
        location: "Ahmedabad, India",
        links: [["LinkedIn", "linkedin.com/in/rahulsolanki"]],
      },
      summary:
        "Civil engineer with 6 years of site and project execution experience on high-rise residential and commercial buildings. Skilled in planning, quantity surveying and quality control, with a record of finishing on time and within budget.",
      experience: [
        job("Project Engineer", "Sanskar Buildcon Pvt. Ltd.", "Ahmedabad", "Feb 2022", "", [
          "Run execution of two 18-storey residential towers (3.2 lakh sq ft) with 4 engineers and 250 workers",
          "Cut the RCC frame cycle from 12 to 9 days per floor with aluminium formwork and better crane planning",
          "Prepare BOQs and certify contractor bills worth ₹65 crore, saving ₹1.8 crore in overbilling",
          "Maintained a zero lost-time-injury record across 9 lakh safe man-hours",
        ]),
        job("Site Engineer", "Gajera Constructions", "Surat", "Jul 2019", "Jan 2022", [
          "Supervised structural and finishing work on a 6-storey commercial complex and a 1.2 km internal road",
          "Ran cube, slump and material tests, keeping concrete rejection below 1%",
          "Tracked daily progress in MS Project and reported variances to the project manager",
        ]),
      ],
      education: [
        school(
          "B.E. Civil Engineering",
          "L.D. College of Engineering",
          "Ahmedabad",
          "2015",
          "2019",
          "CGPA 8.1/10",
        ),
      ],
      skills: [
        skills(
          "Execution",
          "Site supervision, RCC and formwork, quality control, safety, contractor management",
        ),
        skills("Planning", "BOQ, rate analysis, quantity surveying, billing, scheduling"),
        skills("Software", "AutoCAD, MS Project, Primavera P6, STAAD.Pro, Excel"),
      ],
      certifications: [cert("NEBOSH International General Certificate", "NEBOSH", "2023")],
      languages: [lang("English", "Fluent"), lang("Gujarati", "Native"), lang("Hindi", "Fluent")],
    }),
  },
  {
    slug: "graphic-designer",
    name: "Graphic Designer",
    summary: "Brand, social media and print designers.",
    metaTitle: "Graphic Designer Resume Example - Free Template",
    metaDescription:
      "A graphic designer resume example with a portfolio link, design results and tools like Illustrator, Photoshop and Figma. Edit it free and download a PDF.",
    heading: "Graphic Designer Resume Example",
    intro:
      "A graphic designer resume with just enough personality: a portfolio link up top, the kinds of work you do, and results that show your designs work.",
    highlights: {
      title: "What a graphic designer resume needs",
      items: [
        "A portfolio link in the header: Behance, Dribbble or your own site",
        "The work you do: branding, social, packaging, print or UI",
        "Results from your designs, such as reach, clicks or sales",
        "Software you're fluent in: Illustrator, Photoshop, InDesign, Figma",
        "Brands, clients or industries you've designed for",
        "A layout that shows taste but stays easy to read",
      ],
    },
    guide: [
      {
        heading: "Your resume is the trailer, your portfolio is the film",
        paragraphs: [
          "For design roles, the portfolio does most of the persuading, and the resume's job is to get it opened. Put the link in your header, check it works well on a phone, and lead the portfolio with your three strongest, most relevant projects.",
          "Tailor both to the job. A packaging role wants print and production work; a social media role wants campaigns and motion. Reorder your projects rather than building a new portfolio each time.",
        ],
      },
      {
        heading: "Show what your designs achieved",
        paragraphs: [
          "Design is judged on taste but hired for results. Where you can, connect your work to an outcome: reach and engagement for social creatives, click-through for ads and emails, or sales after a packaging refresh.",
          "If you don't have numbers, describe the scope and constraints instead: 'Designed a complete identity for a new café chain - logo, menus, signage and packaging - in 3 weeks'.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should a graphic designer use a creative resume template?",
        answer:
          "A little personality helps, but readability comes first. A clean sidebar or split layout with one accent colour shows design sense without getting in the way, and still works with applicant tracking systems.",
      },
      {
        question: "How many portfolio pieces should I link to?",
        answer:
          "Quality beats quantity: 6-10 strong projects is plenty. Add a short note to each about the brief, your role and the result.",
      },
    ],
    document: resume({
      templateId: "sidebar-plum",
      basics: {
        name: "Ishita Banerjee",
        headline: "Graphic Designer - Brand & Social",
        email: "ishita.banerjee@email.com",
        phone: "+91 99860 24517",
        location: "Bengaluru, India",
        links: [
          ["Behance", "behance.net/ishitabanerjee"],
          ["LinkedIn", "linkedin.com/in/ishitabanerjee"],
        ],
      },
      summary:
        "Graphic designer with 5 years of experience creating brand identities, social campaigns and packaging for consumer brands. I pair strong visual craft with a clear sense of what makes people click, buy and remember.",
      experience: [
        job("Graphic Designer", "Pinwheel Creative Agency", "Bengaluru", "Mar 2023", "", [
          "Designed brand identities for 14 D2C clients, from logo and colour system to packaging",
          "Produce 60+ social creatives a month; a reel series for a skincare client reached 2.1M views",
          "Redesigned packaging for a snack brand, helping lift retail sell-through by 23%",
          "Built a Figma template library that cut campaign asset turnaround from 3 days to 1",
        ]),
        job("Junior Graphic Designer", "Dot & Line Media", "Kolkata", "Jun 2021", "Feb 2023", [
          "Created print and digital ads, brochures and hoardings for real estate and retail clients",
          "Designed 40+ email banners with A/B-tested layouts that raised click-through by 18%",
        ]),
      ],
      education: [
        school(
          "B.Des Communication Design",
          "Srishti Manipal Institute of Art, Design and Technology",
          "Bengaluru",
          "2017",
          "2021",
        ),
      ],
      skills: [
        skills("Design", "Brand identity, typography, layout, packaging, social creatives, motion graphics"),
        skills("Tools", "Illustrator, Photoshop, InDesign, After Effects, Figma, Canva"),
      ],
      projects: [
        project("Rangoli Display", "Personal type project", "behance.net/ishitabanerjee", "2024", [
          "Devanagari-inspired Latin display typeface downloaded 5,000+ times",
        ]),
      ],
      languages: [lang("English", "Fluent"), lang("Bengali", "Native"), lang("Hindi", "Fluent")],
    }),
  },
  {
    slug: "customer-support",
    name: "Customer Support",
    summary: "Support executives, specialists and team leads.",
    metaTitle: "Customer Support Resume Example - Free Template",
    metaDescription:
      "A customer support resume example with CSAT, response times, ticket volumes and tools like Zendesk and Freshdesk. Edit it free and download a PDF.",
    heading: "Customer Support Resume Example",
    intro:
      "A customer support resume that proves you're great with customers, using the numbers support teams live by: CSAT, response time, resolution and volume.",
    highlights: {
      title: "Metrics for a customer support resume",
      items: [
        "CSAT or NPS scores you've achieved",
        "Tickets, chats or calls handled per day",
        "First response time and average handling time",
        "First contact resolution and escalation rates",
        "Help articles, macros or processes you created",
        "Support tools, and the languages you support customers in",
      ],
    },
    guide: [
      {
        heading: "Prove you're good with customers, with numbers",
        paragraphs: [
          "Every support resume says 'excellent communication skills'. Yours should show it with the metrics your team was measured on: CSAT, first response time, handling time, resolution rate and volume. Even one or two of these make your experience concrete.",
          "Add context so the numbers mean something. '45-60 tickets a day at 96% CSAT' tells a hiring manager both how much you handle and how well you handle it.",
        ],
      },
      {
        heading: "Show you make support better, not just busier",
        paragraphs: [
          "Strong support people reduce future tickets. Mention help articles you wrote, macros you built, bugs you reported to product teams and new agents you trained - these are the experiences that lead to team lead and support operations roles.",
          "If you're applying to a software company, show product knowledge too: integrations you troubleshoot, technical issues you can diagnose, and tools such as Jira that you use to work with engineers.",
        ],
      },
    ],
    faqs: [
      {
        question: "What skills should a customer support resume include?",
        answer:
          "Combine soft skills with tools: empathy and de-escalation, clear writing, ticketing systems such as Zendesk or Freshdesk, CRM tools, and the languages you can support customers in.",
      },
      {
        question: "Can I get a customer support job with no experience?",
        answer:
          "Yes. Highlight anything customer-facing - retail, hospitality, tutoring or a college helpdesk - plus your languages, typing speed and comfort with software. Many companies train new agents on their product.",
      },
    ],
    document: resume({
      templateId: "split-blue",
      basics: {
        name: "Fatima Shaikh",
        headline: "Customer Support Specialist - SaaS",
        email: "fatima.shaikh@email.com",
        phone: "+91 90300 58126",
        location: "Hyderabad, India",
        links: [["LinkedIn", "linkedin.com/in/fatimashaikh"]],
      },
      summary:
        "Customer support specialist with 5 years of experience helping customers over chat, email and phone for software and e-commerce companies. Known for calm, clear answers, high CSAT and turning repeat questions into help articles.",
      experience: [
        job("Senior Customer Support Specialist", "Clearbooks Software", "Hyderabad", "Jan 2024", "", [
          "Resolve 45-60 chat and email tickets a day for small-business customers at 96% CSAT",
          "Cut first response time from 4 hours to 35 minutes with macros and triage rules in Zendesk",
          "Wrote 70 help-centre articles that reduced repeat 'how do I' tickets by 22%",
          "Train and mentor new support agents through their first 60 days",
        ]),
        job("Customer Support Executive", "Bazaarly E-commerce", "Hyderabad", "Jul 2021", "Dec 2023", [
          "Handled 80+ calls and chats a day on orders, refunds and deliveries in English, Hindi and Telugu",
          "Kept average handling time under 5 minutes while holding a 92% quality score",
          "Top CSAT performer in 6 of 10 quarters; moved to the escalations desk in year two",
        ]),
      ],
      education: [school("B.Com", "Osmania University", "Hyderabad", "2018", "2021")],
      skills: [
        skills(
          "Support",
          "Chat, email and phone support, ticket triage, escalations, de-escalation, knowledge base writing",
        ),
        skills("Tools", "Zendesk, Freshdesk, Intercom, Salesforce Service Cloud, Jira, Google Workspace"),
      ],
      languages: [
        lang("English", "Fluent"),
        lang("Hindi", "Fluent"),
        lang("Urdu", "Native"),
        lang("Telugu", "Conversational"),
      ],
    }),
  },
  {
    slug: "business-analyst",
    name: "Business Analyst",
    summary: "Business, systems and functional analysts.",
    metaTitle: "Business Analyst Resume Example - Free Template",
    metaDescription:
      "A business analyst resume example with requirements, process improvement, SQL and domain knowledge. Edit it free in the resume builder and download a PDF.",
    heading: "Business Analyst Resume Example",
    intro:
      "A business analyst resume that connects requirements and process maps to business results, with the domain knowledge and tools hiring managers search for.",
    highlights: {
      title: "What a business analyst resume should show",
      items: [
        "The domains you know: banking, insurance, retail or healthcare",
        "The documents you write: BRDs, FRDs, user stories, process flows",
        "Process improvements and their measured results",
        "Data skills: SQL, Excel and a BI tool",
        "Agile experience with tools like Jira and Confluence",
        "Certifications such as ECBA, CCBA or a Scrum product owner course",
      ],
    },
    guide: [
      {
        heading: "Show the business result, not just the documents",
        paragraphs: [
          "Writing BRDs and user stories is the job; employers want to know what happened because of them. Tie your work to outcomes such as fewer defects, faster processes, lower costs or a successful launch.",
          "For example, 'Mapped the loan disbursal process and proposed automation that cut turnaround from 5 days to 2' shows analysis, recommendation and impact in a single line.",
        ],
      },
      {
        heading: "Domain knowledge is your edge",
        paragraphs: [
          "Business analysts are often hired for what they know about an industry. Put your domain in your headline - banking, insurance, supply chain or healthcare - and use its vocabulary in your bullets, such as UPI, KYC, claims or inventory.",
          "If you're moving into a BA role from development, testing or operations, highlight the requirement work you've already done: clarifying user stories, writing test cases from requirements or running UAT with users.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do business analysts need SQL on their resume?",
        answer:
          "It's increasingly expected. Even basic SQL for validating data and answering stakeholder questions makes you more effective, and it appears in many BA job descriptions.",
      },
      {
        question: "Is a certification like ECBA or CCBA necessary?",
        answer:
          "Not necessary, but helpful - especially for career changers, and when applying to large IT services firms and banks, which often filter for them.",
      },
    ],
    document: resume({
      templateId: "sidebar-midnight",
      basics: {
        name: "Nikhil Verma",
        headline: "Business Analyst - Banking & Payments",
        email: "nikhil.verma@email.com",
        phone: "+91 98110 36724",
        location: "Gurugram, India",
        links: [["LinkedIn", "linkedin.com/in/nikhilverma"]],
      },
      summary:
        "Business analyst with 7 years of experience turning business needs into clear requirements for banking and payments products. I bridge stakeholders and engineering teams, and back recommendations with data.",
      experience: [
        job("Business Analyst", "Finvia Technologies", "Gurugram", "Mar 2022", "", [
          "Own requirements for a UPI and card payments platform used by 12 partner banks",
          "Wrote 150+ user stories with acceptance criteria, cutting requirement-related defects by 35%",
          "Mapped the loan disbursal process and proposed automation that cut turnaround from 5 days to 2",
          "Built Power BI dashboards tracking transaction success rates for leadership reviews",
        ]),
        job("Associate Business Analyst", "Tata Consultancy Services", "Noida", "Jul 2019", "Feb 2022", [
          "Supported requirements and UAT for a core banking upgrade for a UK retail bank",
          "Ran 40+ stakeholder workshops and turned the outcomes into BRDs and process flows",
          "Wrote SQL queries to validate the migration of 3M customer records",
        ]),
      ],
      education: [
        school(
          "B.Tech Information Technology",
          "Jaypee Institute of Information Technology",
          "Noida",
          "2015",
          "2019",
          "CGPA 8.0/10",
        ),
      ],
      skills: [
        skills("Analysis", "Requirements gathering, BRD and FRD, user stories, BPMN, gap analysis, UAT"),
        skills("Data", "SQL, Excel, Power BI"),
        skills("Tools", "Jira, Confluence, Visio, Lucidchart, Figma"),
      ],
      certifications: [
        cert("Entry Certificate in Business Analysis (ECBA)", "IIBA", "2021"),
        cert("Professional Scrum Product Owner I", "Scrum.org", "2023"),
      ],
      languages: [lang("English", "Fluent"), lang("Hindi", "Native")],
    }),
  },
  {
    slug: "mechanical-engineer",
    name: "Mechanical Engineer",
    summary: "Production, quality and design engineers.",
    metaTitle: "Mechanical Engineer Resume Example - Free Template",
    metaDescription:
      "A mechanical engineer resume example with production and quality results, lean tools and CAD software. Edit it free and download a PDF.",
    heading: "Mechanical Engineer Resume Example",
    intro:
      "A mechanical engineer resume written in the language of the shop floor - OEE, rejection rates, cycle times and savings - plus the CAD and quality tools you use.",
    highlights: {
      title: "What to put on a mechanical engineer resume",
      items: [
        "Your area: design, production, quality, maintenance or projects",
        "Industry and products: automotive, HVAC, heavy machinery",
        "Measured improvements in OEE, rejection, cycle time or cost",
        "Quality tools: 8D, PFMEA, PPAP, SPC",
        "CAD and CAE software such as SolidWorks, CATIA or ANSYS",
        "Certifications like a Six Sigma Green Belt",
      ],
    },
    guide: [
      {
        heading: "Use the numbers your plant tracks",
        paragraphs: [
          "Manufacturing runs on metrics, and hiring managers read resumes the same way. OEE, rejection rate, cycle time, downtime, scrap and cost savings are the language of production and quality roles - use them in your bullets.",
          "'Raised OEE from 68% to 81% through SMED and preventive maintenance' shows the problem, your method and the result. It's far stronger than 'Responsible for production line efficiency'.",
        ],
      },
      {
        heading: "Match your resume to design or shop-floor roles",
        paragraphs: [
          "Design roles look for CAD and CAE skills, drawings and products you've designed; production and quality roles look for shop-floor results and quality systems. Put the most relevant skills first and adjust your headline for each application.",
          "Freshers and graduate engineer trainees should lead with final-year projects, plant internships and competitions such as SAE BAJA or SUPRA, which show practical engineering beyond coursework.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should a mechanical engineer list software skills?",
        answer:
          "Yes. CAD tools like SolidWorks, CATIA and AutoCAD, analysis tools like ANSYS and ERP systems like SAP are common keywords, so list the ones you use regularly.",
      },
      {
        question: "What if my work is confidential?",
        answer:
          "Describe it in general terms - the type of part, the process and the percentage improvement - without naming customers' confidential products or sharing drawings.",
      },
    ],
    document: resume({
      templateId: "split-mono",
      basics: {
        name: "Karthik Subramanian",
        headline: "Mechanical Engineer - Production & Quality",
        email: "karthik.subramanian@email.com",
        phone: "+91 94440 81236",
        location: "Chennai, India",
        links: [["LinkedIn", "linkedin.com/in/karthiksubramanian"]],
      },
      summary:
        "Mechanical engineer with 6 years of experience in automotive component manufacturing, focused on production efficiency, quality and lean improvements. Hands-on with CNC machining, process planning and root cause analysis.",
      experience: [
        job("Production Engineer", "Kaveri Auto Components Pvt. Ltd.", "Chennai", "Jun 2022", "", [
          "Run a 14-machine CNC line producing 9,000 gearbox parts a day for 3 automotive customers",
          "Raised OEE from 68% to 81% with SMED changeovers and preventive maintenance schedules",
          "Cut internal rejection from 2.4% to 0.9% using 8D and why-why analysis on recurring defects",
          "Led a kaizen team whose fixture redesign saves ₹38 lakh a year in cycle time and scrap",
        ]),
        job("Graduate Engineer Trainee", "Deccan Forgings Ltd.", "Hosur", "Jul 2020", "May 2022", [
          "Prepared process sheets, control plans and PFMEAs for 20 new forged parts",
          "Supported PPAP submissions to automotive customers with no rejections",
          "Designed jigs and fixtures in SolidWorks, reducing setup time by 30%",
        ]),
      ],
      education: [
        school(
          "B.E. Mechanical Engineering",
          "PSG College of Technology",
          "Coimbatore",
          "2016",
          "2020",
          "CGPA 8.3/10",
        ),
      ],
      skills: [
        skills("Manufacturing", "CNC machining, process planning, lean manufacturing, kaizen, 5S, TPM"),
        skills("Quality", "8D, PFMEA, PPAP, SPC, root cause analysis, IATF 16949"),
        skills("Software", "SolidWorks, AutoCAD, CATIA, Minitab, SAP PP"),
      ],
      certifications: [cert("Certified Six Sigma Green Belt (CSSGB)", "ASQ", "2023")],
      languages: [lang("English", "Fluent"), lang("Tamil", "Native"), lang("Hindi", "Intermediate")],
    }),
  },
  {
    slug: "operations-manager",
    name: "Operations Manager",
    summary: "Operations, logistics and supply chain managers.",
    metaTitle: "Operations Manager Resume Example - Free Template",
    metaDescription:
      "An operations manager resume example with scale, service levels, cost savings and launches. Edit it free in the resume builder and download a PDF.",
    heading: "Operations Manager Resume Example",
    intro:
      "An operations manager resume that shows scale at a glance - sites, volumes and teams - followed by the service, cost and growth results you delivered.",
    highlights: {
      title: "What an operations manager resume should show",
      items: [
        "Scale: the sites, volumes, headcount and budget you manage",
        "Service metrics such as on-time delivery, SLAs and accuracy",
        "Cost savings in rupees or percentages",
        "Launches, turnarounds and process improvements you led",
        "Systems: ERP, WMS, Excel and dashboards",
        "Certifications like CSCP, PMP or Six Sigma",
      ],
    },
    guide: [
      {
        heading: "Lead with scale, then results",
        paragraphs: [
          "Operations roles are defined by size, so give it up front: how many sites, how many people, what volume and what budget. A reader should know within seconds whether you've run operations at the scale they need.",
          "Then show the results that mattered to the business - service levels, productivity, cost and safety. Put money in rupees where you can; 'saved ₹6.2 crore a year' is easier to grasp than a percentage alone.",
        ],
      },
      {
        heading: "Show you can build, not just run",
        paragraphs: [
          "Senior operations hiring often looks for people who can launch and scale: new cities, new warehouses, new services. Include at least one launch or turnaround, with how quickly it went live and how it performed.",
          "Mention the systems you introduced or improved too, such as a WMS rollout, a new shift planning model or a KPI dashboard the leadership team now uses every week.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should an operations manager's resume be two pages?",
        answer:
          "With more than 10 years of experience, two pages is fine. Keep the most detail for your last two roles and summarise earlier jobs in a line or two.",
      },
      {
        question: "What keywords should an operations resume include?",
        answer:
          "Use the terms from the job posting - supply chain, logistics, SLA, P&L, process improvement, vendor management, lean or Six Sigma - wherever they truthfully describe your work.",
      },
    ],
    document: resume({
      templateId: "executive-slate",
      basics: {
        name: "Sameer Khanna",
        headline: "Operations Manager - Logistics & Supply Chain",
        email: "sameer.khanna@email.com",
        phone: "+91 98100 52937",
        location: "New Delhi, India",
        links: [["LinkedIn", "linkedin.com/in/sameerkhanna"]],
      },
      summary:
        "Operations manager with 10 years of experience running warehouse and last-mile delivery operations for e-commerce and retail. I build teams and processes that deliver faster, cheaper and more reliably as volumes grow.",
      experience: [
        job("Operations Manager", "Swiftlane Logistics", "Delhi NCR", "May 2021", "", [
          "Run 3 fulfilment centres and 22 delivery hubs handling 85,000 shipments a day with 1,100 staff",
          "Raised on-time delivery from 88% to 96% by redesigning hub routes and shift planning",
          "Cut cost per shipment by 14% (₹6.2 crore a year) through route optimisation and vendor renegotiation",
          "Launched same-day delivery in 4 cities within 5 months; it now carries 18% of volume",
        ]),
        job("Assistant Operations Manager", "FreshCart Retail", "Gurugram", "Jun 2016", "Apr 2021", [
          "Managed a 60,000 sq ft grocery warehouse and a team of 180, from inbound to dispatch",
          "Improved inventory accuracy from 94% to 99.2% with cycle counts and barcode scanning in the WMS",
          "Reduced order picking time by 30% by re-slotting fast-moving SKUs",
        ]),
      ],
      education: [
        school("PGDM Operations", "Management Development Institute", "Gurugram", "2014", "2016"),
        school("B.Tech Mechanical Engineering", "Delhi Technological University", "Delhi", "2010", "2014"),
      ],
      skills: [
        skills(
          "Operations",
          "Warehousing, last-mile delivery, capacity planning, SOPs, vendor management, P&L",
        ),
        skills("Improvement", "Lean, Six Sigma, root cause analysis, KPI dashboards"),
        skills("Tools", "SAP, WMS, Excel, Power BI, SQL"),
      ],
      certifications: [cert("Certified Supply Chain Professional (CSCP)", "ASCM", "2023")],
    }),
  },
  {
    slug: "content-writer",
    name: "Content Writer",
    summary: "SEO, B2B and marketing content writers.",
    metaTitle: "Content Writer Resume Example - Free Template",
    metaDescription:
      "A content writer resume example with a portfolio, SEO skills and results like traffic, rankings and sign-ups. Edit it free and download a PDF.",
    heading: "Content Writer Resume Example",
    intro:
      "A content writer resume that treats writing as a growth channel: published samples, the content you specialise in, and the traffic and sign-ups it earned.",
    highlights: {
      title: "What a content writer resume needs",
      items: [
        "A portfolio link with your best published samples",
        "The content you write: blogs, landing pages, email, scripts",
        "Industries you know, such as SaaS, fintech or health",
        "Results: traffic, rankings, sign-ups or open rates",
        "SEO skills and tools like Ahrefs, Semrush and Search Console",
        "Editing, content planning or managing freelancers",
      ],
    },
    guide: [
      {
        heading: "Writing samples come first",
        paragraphs: [
          "Editors hire writers on their samples. Add a portfolio link in your header with 5-8 of your best published pieces, grouped by type or industry, and choose the samples closest to the job you're applying for.",
          "If your work was published without a byline, you can still use it - list the URLs and note your role, or save the articles as PDFs in a shared folder.",
        ],
      },
      {
        heading: "Show content as a growth channel",
        paragraphs: [
          "Companies increasingly hire writers to grow traffic and leads, so show what your writing produced: rankings, organic traffic, sign-ups, open rates or views. One measured result per role is enough to set you apart.",
          "Your resume is also a writing sample. Keep sentences tight, cut filler words and proofread twice - a typo on a content writer's resume is hard to forgive.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I become a content writer with no experience?",
        answer:
          "Start a blog or newsletter on a topic you know, write 3-5 sample articles for brands you'd like to work with, and take on small freelance projects. Those samples become your experience.",
      },
      {
        question: "Should a content writer list SEO skills?",
        answer:
          "Yes. Most content roles now expect keyword research and on-page SEO, and tools like Ahrefs, Semrush and Google Search Console are common keywords in job postings.",
      },
    ],
    document: resume({
      templateId: "modern-indigo",
      basics: {
        name: "Aditi Saxena",
        headline: "Content Writer - SEO & B2B SaaS",
        email: "aditi.saxena@email.com",
        phone: "+91 99710 48362",
        location: "Noida, India",
        links: [
          ["Portfolio", "aditisaxena.in"],
          ["LinkedIn", "linkedin.com/in/aditisaxena"],
        ],
      },
      summary:
        "Content writer with 5 years of experience writing SEO articles, landing pages and email for B2B SaaS and fintech brands. I research deeply, write clearly and measure every piece by traffic and sign-ups.",
      experience: [
        job("Senior Content Writer", "Kloudsuite Software", "Noida", "Apr 2023", "", [
          "Write 8-10 long-form SEO articles a month; 35 of them rank on Google's first page",
          "Grew organic blog traffic from 40,000 to 1.5 lakh monthly visits in 18 months",
          "Rewrote 12 product landing pages, lifting demo sign-ups by 27%",
          "Run the editorial calendar and edit the work of 6 freelance writers",
        ]),
        job("Content Writer", "Paisabridge Fintech", "Delhi", "Aug 2021", "Mar 2023", [
          "Wrote 150+ explainers on personal finance, tax and investing for a 3 lakh-subscriber newsletter",
          "Lifted newsletter open rates from 24% to 38% with sharper subject lines and segmentation",
          "Scripted 30 YouTube explainers averaging 50,000 views each",
        ]),
      ],
      education: [school("BA (Hons) English", "Lady Shri Ram College for Women", "Delhi", "2018", "2021")],
      skills: [
        skills(
          "Writing",
          "SEO articles, long-form guides, landing pages, email, case studies, scripts, editing",
        ),
        skills("SEO & tools", "Keyword research, on-page SEO, Ahrefs, Semrush, Search Console, WordPress"),
      ],
      certifications: [cert("Content Marketing Certification", "HubSpot Academy", "2024")],
      languages: [lang("English", "Fluent"), lang("Hindi", "Native")],
    }),
  },
  {
    slug: "internship",
    name: "Internship",
    summary: "Students applying for their first internship.",
    metaTitle: "Internship Resume Example for Students - Free PDF",
    metaDescription:
      "An internship resume example for students: education, projects, college societies and certifications first. Edit it free and download a PDF.",
    heading: "Resume for Internship",
    intro:
      "Applying for your first internship? This student resume leads with your course, projects and college roles - the experience you do have, presented the way recruiters want to see it.",
    highlights: {
      title: "What to put on an internship resume",
      items: [
        "Your course, college, year and expected graduation",
        "CGPA or percentage, if it's strong",
        "College projects, case competitions and coursework",
        "Society, club and fest roles that show initiative",
        "Freelance work, virtual internships or part-time jobs",
        "Free certifications related to the internship",
      ],
    },
    guide: [
      {
        heading: "What recruiters look for in intern applications",
        paragraphs: [
          "Nobody expects an intern to have work experience. Recruiters look for signs that you take initiative, learn quickly and can be trusted with real tasks - and those show up in projects, society roles, competitions and small freelance jobs.",
          "Write each one like a job: what you did, how, and what came of it. 'Led a team of 6 that raised ₹3.2 lakh from 11 sponsors' says more about your potential than any list of soft skills.",
        ],
      },
      {
        heading: "Tailor it for each internship",
        paragraphs: [
          "Read the internship description and move the most relevant project or role to the top of each section. A marketing internship should see your campaigns first; a finance internship should see your case competitions and Excel work.",
          "Keep it to one page, put your expected graduation year beside your degree so recruiters know when you're available, and mention the internship dates or duration you're looking for in your summary.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I put college society work on an internship resume?",
        answer:
          "Absolutely. Running events, raising sponsorship or managing a society's social media is real experience. Describe it with numbers - money raised, people reached or events organised.",
      },
      {
        question: "Should first and second-year students apply for internships?",
        answer:
          "Yes. Many startups, NGOs and virtual internship programmes take first and second-year students. Smaller internships early on make it easier to land bigger ones later.",
      },
      {
        question: "Do I need a cover letter for an internship?",
        answer:
          "It helps, especially on platforms that ask why you should be hired. Keep it short and specific to the company, and mention when you're available.",
      },
    ],
    document: resume({
      templateId: "classic-navy",
      basics: {
        name: "Aryan Singh",
        headline: "BBA Student - Marketing",
        email: "aryan.singh@email.com",
        phone: "+91 97400 25831",
        location: "Bengaluru, India",
        links: [["LinkedIn", "linkedin.com/in/aryansingh"]],
      },
      summary:
        "Second-year BBA student with hands-on experience running social media and events for college societies and a local business. Looking for a 2-month summer internship in marketing or business development.",
      education: [
        school("BBA (Marketing)", "Christ University", "Bengaluru", "2024", "2027", "CGPA 8.6/10", [
          "Coursework: Marketing Management, Consumer Behaviour, Business Statistics, Digital Marketing",
        ]),
      ],
      projects: [
        project("Instagram growth for a local café", "Freelance project", "", "2025", [
          "Planned and posted 3 months of content, growing followers from 1,200 to 6,800",
          "Ran a ₹15,000 Meta ads campaign that brought in 400+ coupon redemptions",
        ]),
        project("Quick commerce market study", "Course project", "", "2025", [
          "Surveyed 250 students on grocery app habits and presented pricing recommendations",
        ]),
      ],
      experience: [
        job("Marketing Intern (Virtual)", "Brewbox Beverages", "Remote", "Jun 2025", "Jul 2025", [
          "Researched 15 competitor brands and summarised their pricing and positioning for the founders",
          "Wrote 20 social posts and 4 email newsletters; the best email reached a 41% open rate",
        ]),
        job("Sponsorship Coordinator", "College Management Fest", "Bengaluru", "Aug 2024", "Feb 2025", [
          "Led a team of 6 that raised ₹3.2 lakh from 11 sponsors, 40% more than the previous year",
        ]),
      ],
      skills: [
        skills("Marketing", "Social media, content creation, market research, Meta Ads basics, copywriting"),
        skills("Tools", "Excel, Google Sheets, Canva, Google Analytics, PowerPoint"),
      ],
      certifications: [
        cert("Fundamentals of Digital Marketing", "Google Digital Garage", "2024"),
        cert("Social Media Marketing", "HubSpot Academy", "2025"),
      ],
      languages: [lang("English", "Fluent"), lang("Hindi", "Native")],
      order: ["summary", "education", "projects", "experience", "skills", "certifications", "languages"],
    }),
  },
];

export const getResumeExample = (slug: string) => RESUME_EXAMPLES.find((example) => example.slug === slug);
