import { http } from "@/api/httpClient";
import type { SupportTicket, TicketMessage } from "@/types";
import type { CreateTicketInput, TicketMessageInput } from "@/validation";

export const supportService = {
  listMine: () => http.get<SupportTicket[]>("/support/tickets"),
  get: (id: string) =>
    http.get<{ ticket: SupportTicket; messages: TicketMessage[] }>(
      `/support/tickets/${encodeURIComponent(id)}`,
    ),
  create: (input: CreateTicketInput) =>
    http.post<SupportTicket>("/support/tickets", input),
  reply: (id: string, input: TicketMessageInput) =>
    http.post<TicketMessage>(
      `/support/tickets/${encodeURIComponent(id)}/messages`,
      input,
    ),
};
