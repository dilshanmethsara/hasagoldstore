import { http } from "@/api/httpClient";
import type { Review } from "@/types";
import type { CreateReviewInput } from "@/validation";

export const reviewService = {
  listApproved: () => http.get<Review[]>("/reviews?status=approved"),
  create: (input: CreateReviewInput) => http.post<Review>("/reviews", input),
};
