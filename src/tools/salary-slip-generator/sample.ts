import type { SalarySlip } from "./schema";

/** Realistic example data for thumbnails, tests and "Load example". */
export const SAMPLE_SALARY_SLIP: SalarySlip = {
  templateId: "classic-blue",
  currency: "INR",
  company: {
    name: "Bluefin Technologies Pvt Ltd",
    address: "4th Floor, Prestige Tech Park, Outer Ring Road, Bengaluru, Karnataka 560103",
    logo: "",
  },
  employee: {
    name: "Priya Nair",
    employeeId: "BT-0142",
    designation: "Software Engineer",
    department: "Engineering",
    dateOfJoining: "2024-07-01",
    pan: "ABCPN1234K",
    uan: "100987654321",
    bankName: "HDFC Bank",
    bankAccount: "XXXXXXXX4321",
  },
  month: "2026-09",
  payDate: "2026-09-30",
  workingDays: 30,
  paidDays: 30,
  earnings: [
    { id: "e1", label: "Basic salary", amount: 40000 },
    { id: "e2", label: "House rent allowance (HRA)", amount: 20000 },
    { id: "e3", label: "Special allowance", amount: 16800 },
    { id: "e4", label: "Leave travel allowance (LTA)", amount: 3200 },
  ],
  deductions: [
    { id: "d1", label: "Provident fund (PF)", amount: 4800 },
    { id: "d2", label: "Professional tax", amount: 200 },
    { id: "d3", label: "Income tax (TDS)", amount: 3500 },
  ],
  notes: "",
};
