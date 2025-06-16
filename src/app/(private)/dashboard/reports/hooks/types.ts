import { Quote, QuotePdf } from "@/@types/quotes";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type SortField = "patient" | "dentist" | "date" | "value" | "status";
export type SortOrder = "asc" | "desc";
export interface useReportProps {
  dentistFilter: string;
  setDentistFilter: (value: string) => void;
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (value: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (value: Date | undefined) => void;
  selectedQuote: QuotePdf | null;
  setSelectedQuote: (value: QuotePdf | null) => void;
  viewDialogOpen: boolean;
  setViewDialogOpen: (value: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (value: boolean) => void;
  quoteToDelete: string | null;
  setQuoteToDelete: (value: string | null) => void;
  quoteToUpdate: string | null;
  setQuoteToUpdate: (value: string | null) => void;
  exporting: boolean;
  setExporting: (value: boolean) => void;

  handleEditQuote: (id: string, router: AppRouterInstance) => void;
  handleDeleteQuote: (id: string) => void;
  confirmDeleteQuote: () => Promise<void>;
  handleViewQuote: (id: string) => void;
  handleStatusChange: (
    id: string,
    status: "final" | "paid" | "follow"
  ) => Promise<void>;

  sortField: SortField;
  setSortField: (value: SortField) => void;
  getFilteredQuotes: () => Quote[];

  generateProposalPDF: (quote: QuotePdf | undefined) => Promise<void>;
  getBase64FromUrl: (url: string) => Promise<string>;

  sortOrder: SortOrder;
  setSortOrder: (value: SortOrder) => void;
  getSortedQuotes: () => Quote[];
}
