import type { UseCase, UseCaseCollection } from "@/components/tool/use-case";
import type { HrLetter, Pronoun } from "./schema";

/*
 * HR letter templates: one landing page per kind of letter (/hr-letter-generator/templates/<slug>),
 * each with a complete example that opens in the generator with "Use this example".
 */

export const HR_LETTER_TEMPLATES_COLLECTION: UseCaseCollection = {
  toolSlug: "hr-letter-generator",
  segment: "templates",
  title: "HR Letter Templates",
  noun: "letter",
  metaTitle: "Free HR Letter Templates - Offer to Relieving",
  metaDescription:
    "Free HR letter templates for India: offer, appointment, experience, relieving, internship and increment letters. Fill in online and download a PDF.",
  intro:
    "Ready-made HR letters for Indian employers, from the offer to the relieving letter. Open one in the free HR letter generator, add your company's details and download a signed PDF on your own letterhead.",
};

let counter = 0;
const id = () => `hr-letter-${++counter}`;

const company = (name: string, address: string, email: string, phone: string, website: string) => ({
  name,
  address,
  email,
  phone,
  website,
  logo: "",
});

const employee = (name: string, address: string, employeeId = "", pronoun: Pronoun = "they") => ({
  name,
  address,
  employeeId,
  pronoun,
});

const signatory = (name: string, title: string) => ({ name, title, signature: "" });

/** The monthly salary annexure: basic, HRA, special allowance and the employer's PF. */
const breakdown = (basic: number, hra: number, special: number, pf = 1800) => [
  { id: id(), label: "Basic salary", monthly: basic },
  { id: id(), label: "House rent allowance (HRA)", monthly: hra },
  { id: id(), label: "Special allowance", monthly: special },
  { id: id(), label: "Employer's PF contribution", monthly: pf },
];

const BASE: HrLetter = {
  kind: "offer",
  templateId: "classic-navy",
  letterDate: "2026-10-15",
  reference: "",
  company: company("", "", "", "", ""),
  signatory: signatory("", ""),
  employee: employee("", ""),
  designation: "",
  department: "",
  employmentType: "full-time",
  location: "",
  reportingTo: "",
  workingHours: "",
  joiningDate: "",
  endDate: "",
  resignationDate: "",
  offerValidUntil: "",
  effectiveDate: "",
  currency: "INR",
  pay: 0,
  previousPay: 0,
  newDesignation: "",
  salaryBreakdown: [],
  probationMonths: 6,
  noticeDays: 30,
  remarks: "",
  customTerms: [],
};

const letter = (overrides: Partial<HrLetter>): HrLetter => ({ ...BASE, ...overrides });

export const HR_LETTER_EXAMPLES: UseCase<HrLetter>[] = [
  {
    slug: "offer-letter",
    name: "Offer Letter",
    summary: "Offer a full-time job with the CTC and a salary annexure.",
    metaTitle: "Offer Letter Format (India) - Free Template (PDF)",
    metaDescription:
      "A free offer letter format for India: designation, joining date, annual CTC, salary breakdown, probation, notice period and acceptance. Download a PDF.",
    heading: "Offer Letter Format",
    intro:
      "A clear job offer letter for a full-time hire: the role, the joining date, the annual CTC with a monthly breakdown, and the date by which the candidate should accept. Change the details and download it on your letterhead.",
    highlights: {
      title: "What this offer letter includes",
      items: [
        "Designation, department, location and reporting manager",
        "Joining date and the last date to accept the offer",
        "Annual CTC with a monthly salary breakdown in an annexure",
        "Probation period, notice period and working hours",
        "The documents to bring on the first day",
        "A signature block for the company and an acceptance block for the candidate",
      ],
    },
    guide: [
      {
        heading: "What an offer letter is for",
        paragraphs: [
          "An offer letter tells a candidate that you want to hire them and on what broad terms. It is usually sent after the final interview and before the candidate resigns from their current job, so it needs to be clear enough for them to make that decision.",
          "On its own, an offer letter is not the full employment contract. It becomes an agreement once the candidate accepts it, and the detailed terms are usually set out in the appointment letter they sign on joining.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        paragraphs: [
          "Most confusion after joining comes from salary. State the annual CTC and show how it splits into monthly components, so the candidate can see what is fixed and what is the employer's contribution rather than take-home pay.",
        ],
        bullets: [
          "Leaving out the joining date or the date the offer expires",
          "Quoting a CTC with no breakdown, or a breakdown that doesn't add up to it",
          "Promising a bonus or variable pay without saying how it is decided",
          "Forgetting conditions such as proof of qualifications or a background check",
        ],
      },
    ],
    faqs: [
      {
        question: "Is an offer letter legally binding?",
        answer:
          "An offer letter records the terms you are offering. Once the candidate accepts it, it is generally treated as an agreement between you, but the detailed terms of employment usually sit in the appointment letter and your company's policies. For a dispute, take advice from a lawyer.",
      },
      {
        question: "What is the difference between CTC and take-home salary?",
        answer:
          "CTC (cost to company) is everything the employer spends on the employee in a year, including the employer's PF contribution and any allowances. Take-home pay is what reaches the bank account each month after the employee's PF, professional tax and income tax are deducted, so it is always lower.",
      },
      {
        question: "How long should a candidate have to accept an offer?",
        answer:
          "A week is common. Give a specific date in the letter, so both sides know when the offer lapses if the candidate doesn't respond.",
      },
    ],
    document: letter({
      kind: "offer",
      templateId: "modern-blue",
      reference: "KIS/HR/2026/118",
      company: company(
        "Kestrel Infosystems Pvt Ltd",
        "7th Floor, Tower B, Rajiv Gandhi Infotech Park, Phase 2, Hinjewadi, Pune, Maharashtra 411057",
        "careers@kestrelinfo.in",
        "+91 20 6712 4400",
        "www.kestrelinfo.in",
      ),
      signatory: signatory("Vandana Joshi", "HR Manager"),
      employee: employee(
        "Rohan Kulkarni",
        "B-204, Shree Ganesh Residency, Kothrud, Pune, Maharashtra 411038",
      ),
      designation: "Software Engineer",
      department: "Engineering",
      location: "Hinjewadi office, Pune",
      reportingTo: "Vikram Deshpande, Engineering Manager",
      workingHours: "Monday to Friday, 9:30 am to 6:30 pm",
      joiningDate: "2026-11-16",
      offerValidUntil: "2026-10-22",
      pay: 960000,
      salaryBreakdown: breakdown(40000, 20000, 18200),
      probationMonths: 6,
      noticeDays: 60,
    }),
  },
  {
    slug: "appointment-letter",
    name: "Appointment Letter",
    summary: "The formal terms of employment, signed on joining.",
    metaTitle: "Appointment Letter Format (India) - Free Template",
    metaDescription:
      "A free appointment letter format for India: designation, joining date, salary annexure, probation, notice period, working hours and duties. Download a PDF.",
    heading: "Appointment Letter Format",
    intro:
      "An appointment letter confirms a new employee's appointment and sets out the terms they work under: salary, probation, notice period, working hours and duties. This example is for a staff nurse at a hospital, with a clause on shift duty.",
    highlights: {
      title: "What this appointment letter includes",
      items: [
        "Designation, department, place of work and reporting manager",
        "Date of joining and annual CTC with a salary annexure",
        "Probation period and confirmation",
        "Notice period on either side",
        "Working hours, with a custom clause for rotating shifts",
        "Signature blocks for the employer and the employee",
      ],
    },
    guide: [
      {
        heading: "What an appointment letter is for",
        paragraphs: [
          "Where the offer letter is a proposal, the appointment letter sets out the terms of employment in full. It is usually handed over on or soon after the joining day, and the employee signs a copy to confirm they accept the terms.",
          "It is the document both sides refer back to if questions come up later about probation, notice, hours or pay, so keep a signed copy in the employee's file.",
        ],
      },
      {
        heading: "What to include",
        paragraphs: [
          "Keep the letter specific to the role and refer to your HR policies for things that change from time to time, such as leave and travel rules.",
        ],
        bullets: [
          "The salary structure as an annexure, matching the offer letter",
          "Probation length and how confirmation happens",
          "The notice period, typically 30 to 90 days and the same for both sides",
          "Working hours, shifts or rosters that apply to the role",
          "Confidentiality and adherence to company policies",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between an offer letter and an appointment letter?",
        answer:
          "The offer letter proposes the job and the CTC before the candidate joins. The appointment letter confirms the appointment and sets out the full terms of employment, and is usually signed on joining.",
      },
      {
        question: "Is an appointment letter mandatory?",
        answer:
          "It is standard practice for every employer, and India's labour codes expect employers to give employees a written appointment letter. Check the rules that apply to your establishment, and give one to every employee either way: it protects both sides.",
      },
      {
        question: "Can the terms in an appointment letter be changed later?",
        answer:
          "Yes, by agreement. Salary revisions and promotions are usually recorded in a separate increment or promotion letter rather than a new appointment letter.",
      },
    ],
    document: letter({
      kind: "appointment",
      templateId: "classic-maroon",
      reference: "LGH/HR/APT/2026/057",
      company: company(
        "Lotus Grove Hospital Pvt Ltd",
        "NH Bypass, Palarivattom, Kochi, Kerala 682025",
        "hr@lotusgrovehospital.in",
        "+91 484 291 6000",
        "www.lotusgrovehospital.in",
      ),
      signatory: signatory("Dr. Thomas Varghese", "Medical Superintendent"),
      employee: employee(
        "Anjali Menon",
        "Kizhakkedathu House, Edappally, Kochi, Kerala 682024",
        "LGH-N-0412",
        "she",
      ),
      designation: "Senior Staff Nurse",
      department: "Nursing (Critical Care)",
      location: "Lotus Grove Hospital, Palarivattom, Kochi",
      reportingTo: "Mary Joseph, Nursing Superintendent",
      workingHours: "8-hour shifts, six days a week, as per the duty roster",
      joiningDate: "2026-10-15",
      pay: 480000,
      salaryBreakdown: breakdown(20000, 8000, 10200),
      probationMonths: 6,
      noticeDays: 30,
      customTerms: [
        {
          id: id(),
          title: "Shift duty",
          text: "You will work rotating morning, evening and night shifts as set out in the monthly duty roster. You may be asked to stay beyond your shift in a medical emergency, and any extra hours will be compensated under the hospital's policy.",
        },
      ],
    }),
  },
  {
    slug: "experience-letter",
    name: "Experience Letter",
    summary: "Confirms someone's role and tenure after they leave.",
    metaTitle: "Experience Letter Format - Experience Certificate",
    metaDescription:
      "A free experience letter format for India: employee name, designation, dates of employment and a line on their conduct. Edit online and download a PDF.",
    heading: "Experience Letter Format",
    intro:
      "An experience letter, or experience certificate, confirms that someone worked with you, in what role and for how long. This example is for an audit associate leaving a chartered accountancy firm, with a short line on their work and conduct.",
    highlights: {
      title: "What this experience letter includes",
      items: [
        "The employee's name and employee ID",
        "Their designation and department",
        "The date they joined and their last working day",
        "A short line on their work and conduct",
        "Good wishes for the future",
        "Signature of an authorised person on the company's letterhead",
      ],
    },
    guide: [
      {
        heading: "Why employees need an experience letter",
        paragraphs: [
          "A new employer, a university or a visa office will often ask for proof of past work. The experience letter is that proof: background verification agencies check the dates and designation in it against your records, so they must match exactly.",
          "No central law obliges an employer to issue an experience letter, but it is standard practice in India and most employers give one to anyone who leaves on good terms.",
        ],
      },
      {
        heading: "What to include and what to leave out",
        paragraphs: [
          "Keep it factual. The dates, designation and department are what matter most, and a single positive line on conduct is plenty.",
        ],
        bullets: [
          "Use the designation the person held when they left, or list a promotion in the remarks",
          "Give the joining date and last working day exactly as in your records",
          "Leave out salary, reasons for leaving and any criticism",
          "Have it signed by HR, a partner or a director, on letterhead",
        ],
      },
    ],
    faqs: [
      {
        question: "Is an employer required to give an experience letter?",
        answer:
          "There is no central law that requires it, but it is standard practice and many companies' own policies promise one. If your employer won't issue one, ask HR in writing, and keep your offer letter, payslips and Form 16 as other proof of employment.",
      },
      {
        question: "What is the difference between an experience letter and a relieving letter?",
        answer:
          "A relieving letter confirms that your resignation was accepted and you have been relieved of your duties. An experience letter describes your role and tenure. Many companies issue both, or combine them into one letter.",
      },
      {
        question: "Can an experience letter say something negative?",
        answer:
          "It's best to keep it neutral and factual. If you can't say anything positive about someone's work, leave the remarks blank and the letter will simply confirm their role and dates.",
      },
    ],
    document: letter({
      kind: "experience",
      templateId: "classic-navy",
      reference: "DPC/HR/2026/23",
      company: company(
        "Desai Parikh & Co., Chartered Accountants",
        "502, Shivalik Plaza, Near IIM Road, Ambawadi, Ahmedabad, Gujarat 380015",
        "office@desaiparikh.in",
        "+91 79 2630 4512",
        "www.desaiparikh.in",
      ),
      signatory: signatory("CA Hemant Parikh", "Partner"),
      employee: employee(
        "Karan Joshi",
        "14, Sundarvan Society, Satellite, Ahmedabad, Gujarat 380015",
        "DPC-117",
      ),
      designation: "Audit Associate",
      department: "Audit and Assurance",
      location: "Ahmedabad",
      joiningDate: "2023-07-03",
      endDate: "2026-10-09",
      remarks:
        "During their time with us, Karan worked on statutory and internal audits for clients in manufacturing and retail. We found them sincere, hardworking and reliable, and their conduct throughout was excellent.",
    }),
  },
  {
    slug: "relieving-letter",
    name: "Relieving Letter",
    summary: "Confirms a resignation was accepted and duties handed over.",
    metaTitle: "Relieving Letter Format (India) - Free Template",
    metaDescription:
      "A free relieving letter format for India: resignation date, last working day, handover confirmation and a note on full and final settlement. Get a PDF.",
    heading: "Relieving Letter Format",
    intro:
      "A relieving letter confirms that an employee's resignation was accepted and that they have been relieved of their duties from their last working day. This example is for an operations manager at a logistics company who served a 60-day notice period.",
    highlights: {
      title: "What this relieving letter includes",
      items: [
        "The date of resignation and its acceptance",
        "The date they joined and their last working day",
        "Their designation and department",
        "Confirmation that they have been relieved of their duties",
        "A note on the full and final settlement",
        "Signature of an authorised person",
      ],
    },
    guide: [
      {
        heading: "When to issue a relieving letter",
        paragraphs: [
          "Issue it on or soon after the last working day, once the employee has served their notice period (or it has been waived or bought out) and handed over their work and company assets.",
          "The next employer will usually ask for it before or soon after joining, and background verification agencies check it, so a delay can hold up someone's new job.",
        ],
      },
      {
        heading: "What to check before you sign",
        paragraphs: ["The dates in a relieving letter are what other people rely on, so get them right."],
        bullets: [
          "The resignation date and last working day match your HR records",
          "The notice period served matches the contract, or a shortfall has been settled",
          "Laptops, ID cards and other assets have been returned",
          "The full and final settlement timeline is stated, so there are no surprises",
        ],
      },
    ],
    faqs: [
      {
        question: "Can a company refuse to give a relieving letter?",
        answer:
          "Companies often hold the letter until the notice period is served or bought out and company property is returned, as their contract or policy allows. If you believe it is being withheld unfairly, raise it with HR in writing, and take advice from a lawyer if it isn't resolved.",
      },
      {
        question: "What is the full and final settlement?",
        answer:
          "It is the last payment to a departing employee: salary up to the last working day, encashment of unused leave where the policy allows it, any bonus or reimbursements due, and gratuity if they qualify, less any recoveries such as a notice period shortfall.",
      },
      {
        question: "How long is a notice period?",
        answer:
          "It is whatever the appointment letter or contract says. Thirty to ninety days is typical in India, with longer periods for senior roles.",
      },
    ],
    document: letter({
      kind: "relieving",
      templateId: "minimal-slate",
      letterDate: "2026-10-13",
      reference: "CFL/HR/REL/2026/31",
      company: company(
        "Coromandel Freightlines Pvt Ltd",
        "No. 18, Second Floor, Rajaji Salai, Parrys, Chennai, Tamil Nadu 600001",
        "hr@coromandelfreight.in",
        "+91 44 4590 2200",
        "www.coromandelfreight.in",
      ),
      signatory: signatory("Lakshmi Narayanan", "Head of Human Resources"),
      employee: employee(
        "Arvind Subramanian",
        "Flat 3C, Ganga Apartments, 4th Avenue, Ashok Nagar, Chennai, Tamil Nadu 600083",
        "CFL-0286",
        "he",
      ),
      designation: "Operations Manager",
      department: "Warehousing and Operations",
      location: "Chennai",
      joiningDate: "2022-04-11",
      resignationDate: "2026-08-14",
      endDate: "2026-10-13",
      noticeDays: 60,
      remarks:
        "Your full and final settlement, covering salary up to your last working day and encashment of unused earned leave, will be processed with the October 2026 payroll. We confirm that you have handed over all company property.",
    }),
  },
  {
    slug: "internship-offer-letter",
    name: "Internship Offer Letter",
    summary: "Offer an internship with a monthly stipend and end date.",
    metaTitle: "Internship Offer Letter Format with Stipend - Free",
    metaDescription:
      "A free internship offer letter format for India: role, start and end dates, monthly stipend, working hours and an acceptance block. Download a PDF.",
    heading: "Internship Offer Letter Format",
    intro:
      "An internship offer letter for a student or recent graduate: the role, the dates, the monthly stipend and who they'll work with. This example is a three-month marketing internship at a skincare brand.",
    highlights: {
      title: "What this internship offer letter includes",
      items: [
        "The internship role, team and mentor",
        "Start date and end date",
        "Monthly stipend",
        "Working hours and place of work",
        "The last date to accept the offer",
        "An acceptance block for the intern to sign",
      ],
    },
    guide: [
      {
        heading: "How an internship offer differs from a job offer",
        paragraphs: [
          "An internship is a fixed-term learning role, so the letter has an end date and no probation. Interns are paid a stipend rather than a salary, so there's no CTC, no salary annexure and no PF deduction.",
          "Many interns need the letter for their college as well, to show the internship is approved and has a fixed duration, so make the dates and the name of the organisation clear.",
        ],
      },
      {
        heading: "What to include",
        paragraphs: [
          "Interns are often new to the workplace. A short, clear letter that says what they'll do and who to report to sets them up well.",
        ],
        bullets: [
          "The project or area they'll work on",
          "A named mentor or reporting manager",
          "The stipend and when it is paid",
          "Working days and hours, and whether the role is in the office or remote",
          "That a certificate will be issued on successful completion",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a stipend the same as a salary?",
        answer:
          "No. A stipend is a fixed allowance paid to an intern while they learn on the job. It is not a salary, has no CTC structure and no PF contribution.",
      },
      {
        question: "How long should an internship be?",
        answer:
          "Two to six months is typical. College internships often follow the academic calendar, so check the dates the student's course requires.",
      },
      {
        question: "Can an internship lead to a job offer?",
        answer:
          "Often, yes. If you plan to consider interns for full-time roles, you can mention it, but avoid promising a job in the internship offer letter. Issue a separate offer letter if you hire them.",
      },
    ],
    document: letter({
      kind: "offer",
      templateId: "modern-teal",
      reference: "HHN/INT/2026/09",
      company: company(
        "Haldi House Naturals Pvt Ltd",
        "4th Floor, Lotus Business Centre, Andheri-Kurla Road, Andheri East, Mumbai, Maharashtra 400093",
        "people@haldihouse.in",
        "+91 22 6874 3100",
        "www.haldihouse.in",
      ),
      signatory: signatory("Rhea D'Souza", "People and Culture Manager"),
      employee: employee(
        "Ishaan Bhatt",
        "Room 214, Boys' Hostel, Vile Parle West, Mumbai, Maharashtra 400056",
      ),
      designation: "Marketing Intern",
      department: "Growth Marketing",
      employmentType: "internship",
      location: "Andheri East office, Mumbai",
      reportingTo: "Sana Qureshi, Brand Manager",
      workingHours: "Monday to Friday, 10 am to 6 pm",
      joiningDate: "2026-11-02",
      endDate: "2027-01-29",
      offerValidUntil: "2026-10-22",
      pay: 20000,
      probationMonths: 0,
      noticeDays: 7,
    }),
  },
  {
    slug: "internship-certificate",
    name: "Internship Certificate",
    summary: "Certifies an intern's role, dates and work.",
    metaTitle: "Internship Certificate Format - Completion Letter",
    metaDescription:
      "A free internship certificate format for India: intern's name, role, start and end dates and a line on their work. Edit online and download a PDF.",
    heading: "Internship Certificate Format",
    intro:
      "An internship certificate confirms that a student completed an internship with you, in what role and between which dates. This example is for a UI/UX design intern at a design studio, with a line on the work they did.",
    highlights: {
      title: "What this internship certificate includes",
      items: [
        "The intern's name and internship role",
        "The team or department they worked in",
        "Start date and end date of the internship",
        "A short line on the work they did",
        "Good wishes for their studies and career",
        "Signature of the founder, mentor or HR",
      ],
    },
    guide: [
      {
        heading: "Why interns need a certificate",
        paragraphs: [
          "Colleges often need an internship certificate to award credits, and students use it with their CV when applying for jobs or further study. It is the only formal proof of the internship, so issue it promptly once the internship ends.",
        ],
      },
      {
        heading: "Making the certificate useful",
        paragraphs: [
          "A certificate that only lists dates says little. One or two lines on the actual work, the tools used or a project completed make it far more useful to the intern.",
        ],
        bullets: [
          "Use the exact start and end dates",
          "Name the project or area of work in the remarks",
          "Keep the tone positive and factual",
          "Sign it on letterhead, ideally by the mentor or a founder",
        ],
      },
    ],
    faqs: [
      {
        question: "Is an internship certificate the same as an experience letter?",
        answer:
          "It is the internship version of one. It confirms the role and dates in the same way, but describes the person as an intern and the period as an internship.",
      },
      {
        question: "Should the certificate mention the stipend?",
        answer:
          "It isn't necessary. The certificate is about the role, the dates and the work; the stipend was set out in the internship offer letter.",
      },
      {
        question: "Can I issue a certificate for an unpaid internship?",
        answer: "Yes. The certificate records the internship whether or not a stipend was paid.",
      },
    ],
    document: letter({
      kind: "experience",
      templateId: "minimal-violet",
      reference: "IG/INT/2026/14",
      company: company(
        "Inkwell & Grid Design Studio LLP",
        "C-42, Second Floor, Bhawani Singh Road, C-Scheme, Jaipur, Rajasthan 302001",
        "studio@inkwellgrid.in",
        "+91 141 404 8822",
        "www.inkwellgrid.in",
      ),
      signatory: signatory("Nidhi Rathore", "Founder and Creative Director"),
      employee: employee("Tanvi Agarwal", "88, Shanti Path, Tilak Nagar, Jaipur, Rajasthan 302004"),
      designation: "UI/UX Design Intern",
      department: "Product Design",
      employmentType: "internship",
      location: "Jaipur",
      joiningDate: "2026-07-13",
      endDate: "2026-10-09",
      probationMonths: 0,
      remarks:
        "During the internship, Tanvi worked on wireframes, user flows and a component library for a client's mobile banking app. They showed real curiosity and care for detail, and took feedback well.",
    }),
  },
  {
    slug: "increment-letter",
    name: "Increment Letter",
    summary: "A salary revision with the new CTC and breakdown.",
    metaTitle: "Increment Letter Format - Salary Revision Letter",
    metaDescription:
      "A free increment letter format for India: previous and revised CTC, effective date and a revised salary breakdown. Edit online and download a PDF.",
    heading: "Increment Letter Format",
    intro:
      "An increment letter tells an employee that their salary has been revised, by how much and from when. This example is a salary revision for a teacher at a school, with the old and new CTC and the revised monthly breakdown.",
    highlights: {
      title: "What this increment letter includes",
      items: [
        "The employee's current designation",
        "Previous annual CTC and revised annual CTC",
        "The date the revised salary applies from",
        "A revised monthly salary breakdown",
        "A note that other terms of employment stay the same",
        "Signature of the principal or HR",
      ],
    },
    guide: [
      {
        heading: "When to issue an increment letter",
        paragraphs: [
          "Most Indian employers revise salaries once a year after the appraisal cycle, usually from April. Some also give increments on confirmation after probation, or mid-year to correct pay against the market.",
          "A salary revision doesn't need a new appointment letter. The increment letter records the change, and the rest of the appointment terms carry on as before.",
        ],
      },
      {
        heading: "Getting the numbers right",
        paragraphs: [
          "Employees read an increment letter closely, so make sure every figure agrees with payroll before you send it.",
        ],
        bullets: [
          "Show the previous CTC so the size of the increment is clear, or leave it out if you prefer",
          "Check the revised breakdown adds up to the new CTC",
          "State the effective date, and when any arrears will be paid if it is backdated",
          "Keep the letter confidential and address it to the employee only",
        ],
      },
    ],
    faqs: [
      {
        question: "Does a salary increment need a new appointment letter?",
        answer:
          "No. The increment letter records the new salary, and the other terms in the original appointment letter continue unless the letter says otherwise.",
      },
      {
        question: "When are increments usually given in India?",
        answer:
          "Most companies revise salaries once a year, usually from April at the start of the financial year. Schools and colleges sometimes follow the academic year instead.",
      },
      {
        question: "Should the letter show the percentage increase?",
        answer:
          "It's optional. Showing the previous and revised CTC lets the employee see the change clearly; if you'd rather not show the old figure, set the previous CTC to 0 and only the new salary appears.",
      },
    ],
    document: letter({
      kind: "increment",
      templateId: "classic-navy",
      reference: "NHS/ADM/2026/88",
      company: company(
        "Neelgiri Heights School",
        "Sector 12, Gomti Nagar Extension, Lucknow, Uttar Pradesh 226010",
        "office@neelgiriheights.edu.in",
        "+91 522 404 7710",
        "www.neelgiriheights.edu.in",
      ),
      signatory: signatory("Dr. Sunita Awasthi", "Principal"),
      employee: employee(
        "Neha Srivastava",
        "112, Vikas Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
        "NHS-T-064",
      ),
      designation: "Trained Graduate Teacher (Mathematics)",
      department: "Secondary School",
      location: "Lucknow",
      effectiveDate: "2026-11-01",
      previousPay: 420000,
      pay: 462000,
      salaryBreakdown: breakdown(19250, 7700, 9750),
    }),
  },
  {
    slug: "promotion-letter",
    name: "Promotion Letter",
    summary: "A promotion to a new title, with the revised CTC.",
    metaTitle: "Promotion Letter Format with Salary Increase",
    metaDescription:
      "A free promotion letter format for India: new designation, revised CTC, effective date and a revised salary breakdown. Edit online and download a PDF.",
    heading: "Promotion Letter Format",
    intro:
      "A promotion letter confirms an employee's new title and the salary that goes with it. This example promotes a senior data analyst at a fintech company to lead data analyst, with a revised CTC and breakdown.",
    highlights: {
      title: "What this promotion letter includes",
      items: [
        "Current designation and the new designation",
        "The date the promotion takes effect",
        "Previous annual CTC and revised annual CTC",
        "A revised monthly salary breakdown",
        "A note that other terms of employment stay the same",
        "Signature of the reporting head or HR",
      ],
    },
    guide: [
      {
        heading: "What a promotion letter is for",
        paragraphs: [
          "A promotion letter puts the new role on record. The employee will use it, along with their experience letter, to show career progression to future employers and background verification agencies, so the new title and effective date must be exact.",
          "Like an increment letter, it doesn't replace the appointment letter. The rest of the terms continue unless the letter says otherwise.",
        ],
      },
      {
        heading: "What to include",
        paragraphs: [
          "Most promotions come with a pay rise, but say so explicitly either way, so there's no confusion about the salary that goes with the new title.",
        ],
        bullets: [
          "The new designation exactly as it will appear in HR records",
          "The effective date",
          "The revised CTC and monthly breakdown",
          "Any change in reporting line or responsibilities, as a custom paragraph if needed",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between a promotion letter and an increment letter?",
        answer:
          "An increment letter revises the salary in the same role. A promotion letter changes the designation, usually with a salary revision as well. In this generator, an increment letter becomes a promotion letter when you add a new designation.",
      },
      {
        question: "Does a promotion change the notice period?",
        answer:
          "Only if you say so. Some companies have longer notice periods for senior roles; if the promotion changes it, state the new notice period in the letter.",
      },
      {
        question: "Can a promotion be given without a salary increase?",
        answer:
          "It can, though it's less common. In that case, keep the CTC the same and say so in the letter, so the employee knows what to expect.",
      },
    ],
    document: letter({
      kind: "increment",
      templateId: "modern-blue",
      reference: "NSP/HR/PRM/2026/42",
      company: company(
        "Northstar Paytech Pvt Ltd",
        "11th Floor, Building 9B, DLF Cyber City, Phase 2, Gurugram, Haryana 122002",
        "people@northstarpay.in",
        "+91 124 471 9300",
        "www.northstarpay.in",
      ),
      signatory: signatory("Kavya Menon", "Head of Risk Analytics"),
      employee: employee(
        "Aditya Malhotra",
        "C-1104, Palm Grove Heights, Sector 54, Gurugram, Haryana 122011",
        "NSP-1873",
      ),
      designation: "Senior Data Analyst",
      department: "Risk Analytics",
      location: "Gurugram",
      effectiveDate: "2026-10-01",
      previousPay: 1800000,
      pay: 2160000,
      newDesignation: "Lead Data Analyst",
      salaryBreakdown: breakdown(81000, 40500, 56700),
    }),
  },
];
