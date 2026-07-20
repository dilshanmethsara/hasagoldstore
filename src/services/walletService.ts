import { http } from "@/api/httpClient";
import type { WalletSummary } from "@/types";
import type { WalletTopUpInput } from "@/validation";

export const walletService = {
  summary: () => http.get<WalletSummary>("/wallet"),
  topUp: (input: WalletTopUpInput) =>
    http.post<WalletSummary>("/wallet/top-up", input),
};
