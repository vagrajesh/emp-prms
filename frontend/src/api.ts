import type {
  ApiError,
  Employee,
  PerformanceReview,
  ReviewFilters,
  ReviewPeriod,
} from './performanceReviewList'
import type { ReviewCreate, ReviewCreateResponse } from './reviewForm'

const API_BASE = 'http://localhost:8000/api'

// Our errors come back as { code, message }; FastAPI's own 422s as { detail: [...] }
async function errorMessage(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as
    | (Partial<ApiError> & { detail?: unknown })
    | null
  if (body?.message) return body.message
  const detail = body?.detail
  if (Array.isArray(detail)) {
    return detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join('; ')
  }
  return `Request failed (${res.status})`
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(await errorMessage(res))
  return res.json() as Promise<T>
}

export const getEmployees = () => getJson<Employee[]>('/employees')

export const getReviewPeriods = () => getJson<ReviewPeriod[]>('/review-periods')

// null filters are left out of the query string, so the default returns everything
export function getReviews(filters: ReviewFilters) {
  const params = new URLSearchParams()
  if (filters.period_id !== null) params.set('period_id', String(filters.period_id))
  if (filters.employee_id !== null) params.set('employee_id', String(filters.employee_id))
  const query = params.toString()
  return getJson<PerformanceReview[]>(`/reviews${query ? `?${query}` : ''}`)
}

// All reviews for one employee (employees.id); 404 if the employee doesn't exist
export const getEmployeeReviews = (employeeId: number) =>
  getJson<PerformanceReview[]>(`/reviews/${employeeId}`)

export async function createReview(payload: ReviewCreate): Promise<ReviewCreateResponse> {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await errorMessage(res))
  return res.json() as Promise<ReviewCreateResponse>
}
