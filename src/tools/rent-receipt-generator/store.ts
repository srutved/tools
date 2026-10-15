import { createDocumentStore } from "@/lib/saved-documents";
import { rentReceiptSchema } from "./schema";

/** The user's saved rent receipt sets, kept in this browser only. */
export const rentReceiptStore = createDocumentStore({
  key: "rent-receipt-generator/receipts",
  schema: rentReceiptSchema,
});
