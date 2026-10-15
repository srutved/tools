import { roundTo } from "@/lib/utils";

/**
 * Employees' Provident Fund (EPF) projection. Each month, 12% of basic + DA goes in from the
 * employee, and 12% from the employer, of which 8.33% (on at most ₹15,000 of wages, so at most
 * ₹1,250) goes to the Employees' Pension Scheme (EPS) instead of the EPF account.
 *
 * Interest follows the EPFO's method: it's worked out every month at a twelfth of the yearly rate
 * on the balance at the start of that month, and credited to the account once a year. So a month's
 * contribution starts earning from the following month, and interest compounds yearly. Each year
 * of the projection is a 12-month block from today rather than April to March.
 */

/** "full": PF on the full basic + DA. "ceiling": PF on at most the ₹15,000 wage ceiling. */
export type PfWageBasis = "full" | "ceiling";

export const PF_RATE = 12;
export const EPS_RATE = 8.33;
export const PF_WAGE_CEILING = 15000;
/** 8.33% of ₹15,000, rounded to the rupee as the EPFO does. */
export const EPS_MONTHLY_CAP = 1250;
/** EPS contributions stop at 58; after that the employer's whole 12% goes to EPF. */
export const EPS_END_AGE = 58;
/** Declared by the EPFO for FY 2025-26. The rate is set every year. */
export const DEFAULT_EPF_RATE = 8.25;
export const DEFAULT_RETIREMENT_AGE = 58;
/** Projections are capped at this many years, so a mistyped age can't freeze the page. */
const MAX_YEARS = 60;

export interface MonthlyContribution {
  /** The employee's 12%. */
  employee: number;
  /** Voluntary PF on top of the 12%, from the employee. */
  vpf: number;
  /** The employer's 12%, before the EPS split. */
  employerTotal: number;
  /** The part of the employer's share that goes to the pension scheme. */
  eps: number;
  /** The part of the employer's share that goes into the EPF account. */
  employerEpf: number;
}

const positive = (value: number) => (Number.isFinite(value) ? Math.max(value, 0) : 0);
const percent = (value: number) => Math.min(positive(value), 100);

/**
 * One month's contributions on a basic + DA. Each amount is rounded to the rupee, as on a
 * payslip. `inEps` is false from age 58, when EPS contributions stop.
 */
export function monthlyContribution(
  monthlyBasic: number,
  basis: PfWageBasis,
  vpfPercent: number,
  inEps = true,
): MonthlyContribution {
  const basic = positive(monthlyBasic);
  const pfWages = basis === "ceiling" ? Math.min(basic, PF_WAGE_CEILING) : basic;
  const employee = Math.round((pfWages * PF_RATE) / 100);
  const employerTotal = employee;
  const eps = inEps
    ? Math.min(
        Math.round((Math.min(basic, PF_WAGE_CEILING) * EPS_RATE) / 100),
        EPS_MONTHLY_CAP,
        employerTotal,
      )
    : 0;
  return {
    employee,
    vpf: Math.round((basic * percent(vpfPercent)) / 100),
    employerTotal,
    eps,
    employerEpf: employerTotal - eps,
  };
}

export interface PfInput {
  currentAge: number;
  retirementAge: number;
  /** Basic salary plus dearness allowance, a month, today. */
  monthlyBasic: number;
  /** Yearly pay rise, in %. Applied once a year. */
  salaryIncrease: number;
  /** EPF balance today. */
  currentBalance: number;
  /** EPF interest rate, % a year. */
  interestRate: number;
  basis: PfWageBasis;
  /** Voluntary PF, % of basic + DA. */
  vpfPercent: number;
}

export interface PfYear {
  /** 1 for the first 12 months from today. */
  year: number;
  /** Age at the start of the year. */
  age: number;
  /** Basic + DA a month during the year. */
  monthlyBasic: number;
  /** Months in the year (12, or fewer in a final part-year). */
  months: number;
  /** The employee's 12% plus any VPF. */
  employee: number;
  vpf: number;
  employerEpf: number;
  eps: number;
  interest: number;
  /** EPF balance after the year's interest is credited. */
  closingBalance: number;
}

export interface PfResult {
  /** Months until retirement. */
  months: number;
  openingBalance: number;
  /** The EPF balance at retirement. */
  corpus: number;
  /** Everything the employee put in, including VPF. */
  totalEmployee: number;
  totalVpf: number;
  /** The employer's contributions to the EPF account (not EPS). */
  totalEmployerEpf: number;
  /** The employer's contributions to the pension scheme, which don't add to the corpus. */
  totalEps: number;
  totalInterest: number;
  /** This month's contributions. */
  firstMonth: MonthlyContribution;
  years: PfYear[];
}

/** Month by month projection of the EPF balance until retirement. */
export function projectPf(input: PfInput): PfResult {
  const currentAge = positive(input.currentAge);
  const months = Math.min(
    Math.max(Math.round((positive(input.retirementAge) - currentAge) * 12), 0),
    MAX_YEARS * 12,
  );
  const monthlyRate = positive(input.interestRate) / 100 / 12;
  const rise = 1 + positive(input.salaryIncrease) / 100;
  const openingBalance = positive(input.currentBalance);

  let balance = openingBalance;
  let basic = positive(input.monthlyBasic);
  const years: PfYear[] = [];
  let row: PfYear | null = null;
  let accrued = 0;

  for (let month = 0; month < months; month++) {
    if (month % 12 === 0) {
      if (month > 0) basic *= rise;
      accrued = 0;
      row = {
        year: month / 12 + 1,
        age: roundTo(currentAge + month / 12, 2),
        monthlyBasic: roundTo(basic, 2),
        months: 0,
        employee: 0,
        vpf: 0,
        employerEpf: 0,
        eps: 0,
        interest: 0,
        closingBalance: 0,
      };
      years.push(row);
    }
    // Interest on the balance at the start of the month; this month's money earns from next month.
    accrued += balance * monthlyRate;

    const contribution = monthlyContribution(
      basic,
      input.basis,
      input.vpfPercent,
      currentAge + month / 12 < EPS_END_AGE,
    );
    balance += contribution.employee + contribution.vpf + contribution.employerEpf;
    row!.months += 1;
    row!.employee += contribution.employee + contribution.vpf;
    row!.vpf += contribution.vpf;
    row!.employerEpf += contribution.employerEpf;
    row!.eps += contribution.eps;

    // Credited once a year, and at retirement for a final part-year.
    if (month % 12 === 11 || month === months - 1) {
      balance += accrued;
      row!.interest = roundTo(accrued, 2);
      row!.closingBalance = roundTo(balance, 2);
    }
  }

  const sum = (pick: (year: PfYear) => number) => years.reduce((total, year) => total + pick(year), 0);
  const totalEmployee = sum((year) => year.employee);
  const totalEmployerEpf = sum((year) => year.employerEpf);
  return {
    months,
    openingBalance,
    corpus: roundTo(balance, 2),
    totalEmployee,
    totalVpf: sum((year) => year.vpf),
    totalEmployerEpf,
    totalEps: sum((year) => year.eps),
    // Whatever isn't a contribution or the opening balance, so the parts add up to the corpus exactly.
    totalInterest: roundTo(balance - openingBalance - totalEmployee - totalEmployerEpf, 2),
    firstMonth: monthlyContribution(
      input.monthlyBasic,
      input.basis,
      input.vpfPercent,
      currentAge < EPS_END_AGE,
    ),
    years,
  };
}
