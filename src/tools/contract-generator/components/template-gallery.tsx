"use client";

import { useMemo } from "react";
import { ScaledPage } from "@/components/document/scaled-page";
import { TemplateGallery } from "@/components/tool/template-gallery";
import { WebPage } from "@/lib/document/web";
import { SAMPLE_CONTRACT } from "../examples";
import { prepareContract } from "../lib/clauses";
import type { Contract } from "../schema";
import { ContractDocument } from "../templates/contract-document";
import { CONTRACT_TEMPLATES, type ContractTemplate } from "../templates/registry";

/** A live, scaled-down render of a contract in a given design (its first page area). */
export function ContractThumbnail({ contract, templateId }: { contract: Contract; templateId: string }) {
  const prepared = useMemo(() => prepareContract(contract), [contract]);
  return (
    <ScaledPage firstPageOnly className="rounded-md border border-border bg-white shadow-xs">
      <ContractDocument templateId={templateId} contract={prepared} Page={WebPage} />
    </ScaledPage>
  );
}

const GALLERY_TEMPLATES = CONTRACT_TEMPLATES.map((template) => ({
  ...template,
  accent: template.theme.accent,
}));

interface ContractTemplateGalleryProps {
  contract?: Contract;
  selectedId?: string;
  onSelect?: (template: ContractTemplate) => void;
}

export function ContractTemplateGallery({ contract, ...props }: ContractTemplateGalleryProps) {
  const preview = contract?.other.name.trim() ? contract : SAMPLE_CONTRACT;
  return (
    <TemplateGallery
      templates={GALLERY_TEMPLATES}
      renderThumbnail={(template) => <ContractThumbnail contract={preview} templateId={template.id} />}
      {...props}
    />
  );
}
