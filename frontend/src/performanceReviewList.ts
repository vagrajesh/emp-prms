// Types for the Review List screen. Shapes mirror backend/model.py.

// GET /api/employees  -> fills the "Employee" dropdown (searchable)
export interface Employee {
  id: number;
  employee_id: string; // e.g. "EMP101"
  name: string;
  department: string | null;
  email: string | null;
  status: string | null;
}

// GET /api/review-periods  -> fills the "Review Period" dropdown
export interface ReviewPeriod {
  id: number;
  name: string; // e.g. "H1 2026"
  start_date: string; // ISO date "YYYY-MM-DD"
  end_date: string;
  status: string | null; // "Open" | "Closed"
}

// GET /api/reviews  -> one row of the Review List table
export interface PerformanceReview {
  id: number;
  employee_id: number; // FK to employees.id
  employee_code: string; // "EMP101" -> "Employee ID" column
  employee_name: string;
  period_id: number;
  period_name: string;
  quality_rating: number; // 1-5
  delivery_rating: number; // 1-5
  teamwork_rating: number; // 1-5
  average_rating: number;
  comments: string;
  status: "Completed";
  created_at: string; // ISO datetime
}

// Filter state for the screen. null = "All" (the default)
export interface ReviewFilters {
  period_id: number | null; // null -> "All Periods"
  employee_id: number | null; // null -> "All Employees"
}

export const DEFAULT_FILTERS: ReviewFilters = {
  period_id: null,
  employee_id: null,
};

// Error body the API returns on 400/404/409
export interface ApiError {
  code: string;
  message: string;
}
