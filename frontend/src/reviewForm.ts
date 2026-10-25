// Types for the Review Form screen. Shapes mirror ReviewCreate in backend/model.py.
import type { PerformanceReview } from "./performanceReviewList";

export type Rating = 1 | 2 | 3 | 4 | 5;

export const RATINGS: Rating[] = [1, 2, 3, 4, 5];

// POST /api/reviews  -> request body (only send these 6 fields)
export interface ReviewCreate {
  employee_id: number;
  period_id: number;
  quality_rating: Rating;
  delivery_rating: Rating;
  teamwork_rating: Rating;
  comments: string;
}

// POST /api/reviews  -> 201 response is the saved review
export type ReviewCreateResponse = PerformanceReview;

// Form state while the user fills it in. null = not chosen yet
export interface ReviewFormState {
  employee_id: number | null;
  period_id: number | null;
  quality_rating: Rating | null;
  delivery_rating: Rating | null;
  teamwork_rating: Rating | null;
  comments: string;
}

export const EMPTY_REVIEW_FORM: ReviewFormState = {
  employee_id: null,
  period_id: null,
  quality_rating: null,
  delivery_rating: null,
  teamwork_rating: null,
  comments: "",
};

// One message per field, shown under the input ("Employee is required", ...)
export type ReviewFormErrors = Partial<Record<keyof ReviewFormState, string>>;

export type RatingField = "quality_rating" | "delivery_rating" | "teamwork_rating";

// Drives the three star rows on the form
export const RATING_CRITERIA: { field: RatingField; label: string }[] = [
  { field: "quality_rating", label: "Quality of Work" },
  { field: "delivery_rating", label: "Delivery & Ownership" },
  { field: "teamwork_rating", label: "Teamwork & Collaboration" },
];
