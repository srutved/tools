"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Field, FieldRow, FormSection } from "@/components/tool/form";
import { NumberField, SelectField, TextAreaField, TextField } from "@/components/tool/form-fields";
import { ImageField } from "@/components/tool/image-field";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { formatMoney, getCurrencyOptions, POPULAR_CURRENCIES } from "@/lib/currency";
import { toFiniteNumber } from "@/lib/utils";
import { createLineItem } from "../defaults";
import { kindLabels } from "../lib/document-kind";
import { GST_RATES, INDIAN_STATES, stateCodeFromGstin } from "../lib/gst";
import type { Invoice } from "../schema";

function StateOptions() {
  return (
    <>
      <option value="">Select state</option>
      {INDIAN_STATES.map((state) => (
        <option key={state.code} value={state.code}>
          {state.code} - {state.name}
        </option>
      ))}
    </>
  );
}

function useInvoiceValue<K extends keyof Invoice>(name: K): Invoice[K] {
  return useWatch<Invoice, K>({ name });
}

/** Wording for the document being edited (invoice or quotation). */
function useLabels() {
  return kindLabels(useInvoiceValue("kind"));
}

/* ---------------------------------------------------------------- Your business */

function PartyFields({ party }: { party: "from" | "to" }) {
  const { setValue, getValues } = useFormContext<Invoice>();
  const taxMode = useInvoiceValue("taxMode");
  const isGst = taxMode === "gst" || taxMode === "gst-export";
  const showState = taxMode === "gst" || (taxMode === "gst-export" && party === "from");
  const isClient = party === "to";

  return (
    <>
      <TextField<Invoice>
        name={`${party}.name`}
        label={isClient ? "Client name" : "Business name"}
        placeholder={isClient ? "e.g. Northwind Traders Pvt Ltd" : "e.g. Aarav Design Studio"}
        autoComplete={isClient ? "off" : "organization"}
      />
      <TextAreaField<Invoice>
        name={`${party}.address`}
        label="Address"
        rows={2}
        placeholder={"e.g. 12 MG Road, Indiranagar\nBengaluru, Karnataka 560038"}
      />
      <FieldRow>
        <TextField<Invoice>
          name={`${party}.taxId`}
          label={isGst && !(isClient && taxMode === "gst-export") ? "GSTIN" : "Tax ID (optional)"}
          hint={isGst && !isClient ? "Your state is filled in from your GSTIN." : "VAT, GST, EIN, ABN..."}
          placeholder={isGst ? "e.g. 29ABCDE1234F1Z5" : "e.g. GB123456789"}
          rules={{
            onChange: (event) => {
              // A GSTIN starts with the state code, so fill the state in automatically.
              const code = isGst ? stateCodeFromGstin(String(event.target.value)) : null;
              if (code && getValues(`${party}.stateCode`) !== code) setValue(`${party}.stateCode`, code);
            },
          }}
        />
        {showState && (
          <SelectField<Invoice> name={`${party}.stateCode`} label="State">
            <StateOptions />
          </SelectField>
        )}
      </FieldRow>
      <FieldRow>
        <TextField<Invoice>
          name={`${party}.email`}
          label="Email"
          type="email"
          placeholder={isClient ? "e.g. accounts@client.com" : "e.g. hello@yourbusiness.com"}
          autoComplete={isClient ? "off" : "email"}
        />
        <TextField<Invoice>
          name={`${party}.phone`}
          label="Phone"
          type="tel"
          placeholder="e.g. +91 98765 43210"
          autoComplete={isClient ? "off" : "tel"}
        />
      </FieldRow>
    </>
  );
}

export function BusinessSection() {
  return (
    <FormSection
      title="Your business"
      description="Saved on this device and reused for your next invoice or quotation."
    >
      <ImageField<Invoice>
        name="logo"
        label="Logo (optional)"
        hint="PNG, JPG, SVG or WebP. Stays on your device."
      />
      <PartyFields party="from" />
    </FormSection>
  );
}

export function ClientSection() {
  const labels = useLabels();
  return (
    <FormSection title={labels.clientHeading}>
      <PartyFields party="to" />
    </FormSection>
  );
}

/* ---------------------------------------------------------------- Document details */

export function DetailsSection() {
  const labels = useLabels();
  const taxMode = useInvoiceValue("taxMode");
  const currencies = useMemo(() => getCurrencyOptions(), []);
  const popular = currencies.filter((option) => POPULAR_CURRENCIES.includes(option.code));

  return (
    <FormSection title={labels.detailsSection}>
      <FieldRow className="sm:grid-cols-3">
        <TextField<Invoice> name="number" label={labels.numberField} placeholder={labels.numberPlaceholder} />
        <TextField<Invoice> name="issueDate" label={labels.dateField} type="date" />
        <TextField<Invoice> name="dueDate" label={labels.dueField} type="date" />
      </FieldRow>
      <FieldRow>
        <SelectField<Invoice>
          name="currency"
          label="Currency"
          hint={`${currencies.length} currencies supported`}
        >
          <optgroup label="Popular">
            {popular.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code} - {option.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="All currencies">
            {currencies.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code} - {option.name}
              </option>
            ))}
          </optgroup>
        </SelectField>
        <SelectField<Invoice> name="taxMode" label="Tax">
          <option value="none">No tax</option>
          <option value="custom">VAT / Sales tax (custom rate)</option>
          <option value="gst">India GST (CGST + SGST / IGST)</option>
          <option value="gst-export">India export under LUT (0% GST)</option>
        </SelectField>
      </FieldRow>
      {taxMode === "custom" && (
        <TextField<Invoice>
          name="taxLabel"
          label="Tax name"
          placeholder="e.g. VAT"
          hint="Shown on the invoice, e.g. VAT, Sales Tax, HST."
        />
      )}
      {taxMode === "gst" && (
        <SelectField<Invoice>
          name="placeOfSupply"
          label="Place of supply"
          hint="Defaults to the client's state."
        >
          <StateOptions />
        </SelectField>
      )}
      {taxMode === "gst-export" && (
        <TextField<Invoice>
          name="lutNumber"
          label="LUT ARN (optional)"
          placeholder="e.g. AD290324000123X"
          hint="Your Letter of Undertaking reference number."
        />
      )}
    </FormSection>
  );
}

/* ---------------------------------------------------------------- Line items */

function LineItemRow({
  index,
  onRemove,
  canRemove,
}: {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const { register, formState } = useFormContext<Invoice>();
  const taxMode = useInvoiceValue("taxMode");
  const currency = useInvoiceValue("currency");
  const item = useWatch<Invoice, `items.${number}`>({ name: `items.${index}` });
  const errors = formState.errors.items?.[index];
  const amount = toFiniteNumber(item?.quantity) * toFiniteNumber(item?.unitPrice);
  const isGst = taxMode === "gst" || taxMode === "gst-export";
  const id = (field: string) => `field-items-${index}-${field}`;

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start gap-3">
        <span className="mt-2 text-sm font-semibold text-muted">{index + 1}.</span>
        <div className="grid flex-1 gap-3">
          <Field label="Description" htmlFor={id("description")} error={errors?.description?.message}>
            <Input
              id={id("description")}
              placeholder="e.g. Website design"
              aria-invalid={errors?.description ? true : undefined}
              {...register(`items.${index}.description`)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Qty" htmlFor={id("quantity")} error={errors?.quantity?.message}>
              <Input
                id={id("quantity")}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="1"
                {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              />
            </Field>
            <Field label="Price" htmlFor={id("unitPrice")} error={errors?.unitPrice?.message}>
              <Input
                id={id("unitPrice")}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="0.00"
                {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
              />
            </Field>
            {taxMode === "gst" && (
              <Field label="GST" htmlFor={id("taxRate")}>
                <Select id={id("taxRate")} {...register(`items.${index}.taxRate`, { valueAsNumber: true })}>
                  {GST_RATES.map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}%
                    </option>
                  ))}
                </Select>
              </Field>
            )}
            {taxMode === "custom" && (
              <Field label="Tax %" htmlFor={id("taxRate")}>
                <Input
                  id={id("taxRate")}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step="any"
                  placeholder="e.g. 20"
                  {...register(`items.${index}.taxRate`, { valueAsNumber: true })}
                />
              </Field>
            )}
            <Field label={isGst ? "HSN/SAC" : "Code"} htmlFor={id("code")}>
              <Input
                id={id("code")}
                placeholder={isGst ? "e.g. 998314" : "Optional"}
                {...register(`items.${index}.code`)}
              />
            </Field>
          </div>
          <p className="text-right text-sm text-muted">
            Amount: <span className="font-bold text-foreground">{formatMoney(amount, currency)}</span>
          </p>
        </div>
        {canRemove && (
          <Button variant="ghost" size="icon" onClick={onRemove} aria-label={`Remove item ${index + 1}`}>
            <Trash2 className="text-muted" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function ItemsSection() {
  const { control, formState } = useFormContext<Invoice>();
  const taxMode = useInvoiceValue("taxMode");
  // keyName avoids clashing with each item's own `id` field.
  const { fields, append, remove } = useFieldArray({ control, name: "items", keyName: "key" });
  const itemsError = formState.errors.items?.root?.message ?? formState.errors.items?.message;

  return (
    <FormSection
      title="Items"
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={() => append(createLineItem(taxMode === "gst" ? 18 : 0))}
        >
          <Plus /> Add item
        </Button>
      }
    >
      {fields.map((field, index) => (
        <LineItemRow
          key={field.key}
          index={index}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
        />
      ))}
      {itemsError && <p className="text-sm font-medium text-danger">{itemsError}</p>}
      <NumberField<Invoice>
        name="discount"
        label="Discount (flat amount)"
        placeholder="0.00"
        hint="Applied before tax."
        className="sm:w-1/2"
      />
    </FormSection>
  );
}

/* ---------------------------------------------------------------- Payment */

export function PaymentSection() {
  const currency = useInvoiceValue("currency");
  const isInr = currency === "INR";
  return (
    <FormSection
      title="Payment details"
      description="Optional. Shown on the invoice so clients know how to pay."
    >
      {isInr && (
        <TextField<Invoice>
          name="payment.upiId"
          label="UPI ID"
          placeholder="e.g. yourname@okhdfcbank"
          hint="Adds a scan-to-pay UPI QR code with the exact amount."
        />
      )}
      <TextField<Invoice>
        name="payment.paymentLink"
        label="Payment link"
        type="url"
        placeholder="e.g. https://paypal.me/yourname"
        hint="PayPal, Stripe, Wise or any payment page."
      />
      <FieldRow>
        <TextField<Invoice> name="payment.bankName" label="Bank name" placeholder="e.g. HDFC Bank" />
        <TextField<Invoice>
          name="payment.accountName"
          label="Account holder"
          placeholder="e.g. Aarav Design Studio"
        />
      </FieldRow>
      <FieldRow>
        <TextField<Invoice>
          name="payment.accountNumber"
          label="Account number / IBAN"
          placeholder={isInr ? "e.g. 50200012345678" : "e.g. GB29 NWBK 6016 1331 9268 19"}
        />
        <TextField<Invoice>
          name="payment.bankCode"
          label={isInr ? "IFSC" : "SWIFT / BIC / Routing"}
          placeholder={isInr ? "e.g. HDFC0001234" : "e.g. NWBKGB2L"}
        />
      </FieldRow>
    </FormSection>
  );
}

/* ---------------------------------------------------------------- Notes */

export function NotesSection() {
  return (
    <FormSection title="Notes & terms">
      <TextAreaField<Invoice>
        name="notes"
        label="Notes"
        rows={2}
        placeholder="e.g. Thank you for your business!"
      />
      <TextAreaField<Invoice>
        name="terms"
        label="Terms & conditions"
        rows={2}
        placeholder="e.g. Payment due within 14 days. Late payments incur 2% monthly interest."
      />
    </FormSection>
  );
}
