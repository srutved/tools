import { currentMonth, dayOfMonth, todayIso } from "@/lib/date";
import { createId } from "@/lib/utils";
import type { BusinessProfile } from "@/shared/business-profile";
import type { PayItem, SalarySlip } from "./schema";
import { DEFAULT_TEMPLATE_ID } from "./templates/registry";

export const createPayItem = (label = "", amount = 0): PayItem => ({ id: createId(), label, amount });

/** The usual components of an Indian salary; elsewhere, a single basic pay line. */
function defaultItems(currency: string): Pick<SalarySlip, "earnings" | "deductions"> {
  if (currency !== "INR") {
    return { earnings: [createPayItem("Basic pay")], deductions: [createPayItem("Income tax")] };
  }
  return {
    earnings: [
      createPayItem("Basic salary"),
      createPayItem("House rent allowance (HRA)"),
      createPayItem("Special allowance"),
    ],
    deductions: [
      createPayItem("Provident fund (PF)"),
      createPayItem("Professional tax"),
      createPayItem("Income tax (TDS)"),
    ],
  };
}

interface CreateOptions {
  profile?: BusinessProfile | null;
  currency?: string;
  templateId?: string;
}

/** A blank slip for this month, with the company filled in from the saved business profile. */
export function createSalarySlip({
  profile,
  currency = "INR",
  templateId = DEFAULT_TEMPLATE_ID,
}: CreateOptions = {}): SalarySlip {
  const month = currentMonth();
  const days = Number(dayOfMonth(month, 31).slice(8));
  return {
    templateId,
    currency,
    company: {
      name: profile?.business.name ?? "",
      address: profile?.business.address ?? "",
      logo: profile?.logo ?? "",
    },
    employee: {
      name: "",
      employeeId: "",
      designation: "",
      department: "",
      dateOfJoining: "",
      pan: "",
      uan: "",
      bankName: "",
      bankAccount: "",
    },
    month,
    payDate: todayIso(),
    workingDays: days,
    paidDays: days,
    ...defaultItems(currency),
    notes: "",
  };
}

/** New ids for every row, so a copy never shares field-array keys with the original. */
export function withFreshIds(slip: SalarySlip): SalarySlip {
  const fresh = (items: PayItem[]) => items.map((item) => ({ ...item, id: createId() }));
  return { ...slip, earnings: fresh(slip.earnings), deductions: fresh(slip.deductions) };
}
