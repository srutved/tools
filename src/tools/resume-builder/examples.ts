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
  metaTitle: "Resume Examples for Every Job - Free Templates to Edit & Download",
  metaDescription:
    "Free resume examples for freshers, software engineers, data analysts, product managers, marketers, sales, teachers and nurses. Open any example, edit it and download a PDF.",
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
    metaTitle: "Resume Format for Freshers - Free Example & Template (PDF)",
    metaDescription:
      "A complete resume example for freshers and recent graduates: education and projects first, internships, skills and certifications. Edit it free and download a PDF.",
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
    metaTitle: "Software Engineer Resume Example - Free ATS-Friendly Template",
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
    metaTitle: "Data Analyst Resume Example - Free Template with Skills (PDF)",
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
    metaTitle: "Product Manager Resume Example - Free Template & Tips (PDF)",
    metaDescription:
      "A product manager resume example built around outcomes: launches, metrics and cross-functional leadership. Edit it free in the resume builder and download a PDF.",
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
    metaTitle: "Digital Marketing Resume Example - Free Template (PDF)",
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
    metaTitle: "Sales Executive Resume Example - Free Template (PDF)",
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
    metaTitle: "Teacher Resume Example - Free Template for Teaching Jobs (PDF)",
    metaDescription:
      "A teacher resume example with B.Ed, subjects, classes taught, results and certifications such as CTET. Edit it free in the resume builder and download a PDF.",
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
    metaTitle: "Nurse Resume Example - Free Staff Nurse Resume Template (PDF)",
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
];

export const getResumeExample = (slug: string) => RESUME_EXAMPLES.find((example) => example.slug === slug);
