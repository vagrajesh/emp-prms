import { useState } from 'react'
import type { FormEvent } from 'react'
import EmployeeSelect from './EmployeeSelect'
import StarRating from './StarRating'
import { createReview } from '../api'
import { EMPTY_REVIEW_FORM, RATING_CRITERIA } from '../reviewForm'
import type {
  ReviewCreate,
  ReviewCreateResponse,
  ReviewFormErrors,
  ReviewFormState,
} from '../reviewForm'
import type { Employee, ReviewPeriod } from '../performanceReviewList'

interface ReviewFormProps {
  employees: Employee[]
  periods: ReviewPeriod[]
  onSubmitted: (review: ReviewCreateResponse) => void
}

function validate(form: ReviewFormState): ReviewFormErrors {
  const errors: ReviewFormErrors = {}
  if (form.employee_id === null) errors.employee_id = 'Select an employee.'
  if (form.period_id === null) errors.period_id = 'Select a review period.'
  for (const { field, label } of RATING_CRITERIA) {
    if (form[field] === null) errors[field] = `Rate ${label}.`
  }
  if (!form.comments.trim()) errors.comments = 'Comments are required.'
  return errors
}

// Returns the POST body, or null while anything is still missing
function toPayload(form: ReviewFormState): ReviewCreate | null {
  const { employee_id, period_id, quality_rating, delivery_rating, teamwork_rating } = form
  const comments = form.comments.trim()
  if (
    employee_id === null ||
    period_id === null ||
    quality_rating === null ||
    delivery_rating === null ||
    teamwork_rating === null ||
    !comments
  ) {
    return null
  }
  return { employee_id, period_id, quality_rating, delivery_rating, teamwork_rating, comments }
}

function ReviewForm({ employees, periods, onSubmitted }: ReviewFormProps) {
  const [form, setForm] = useState<ReviewFormState>(EMPTY_REVIEW_FORM)
  const [errors, setErrors] = useState<ReviewFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [saved, setSaved] = useState<ReviewCreateResponse | null>(null)

  function update<K extends keyof ReviewFormState>(field: K, value: ReviewFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setSubmitError(null)
    setSaved(null)
  }

  function handleReset() {
    setForm(EMPTY_REVIEW_FORM)
    setErrors({})
    setSubmitError(null)
    setSaved(null)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    const payload = toPayload(form)
    if (!payload) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      const review = await createReview(payload)
      setSaved(review)
      setForm(EMPTY_REVIEW_FORM)
      onSubmitted(review)
    } catch (err) {
      setSubmitError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      {saved && (
        <div className="notice is-success" role="status">
          Review submitted for {saved.employee_name} ({saved.period_name}). Average rating{' '}
          {saved.average_rating.toFixed(1)} / 5.
        </div>
      )}
      {submitError && (
        <div className="notice is-error" role="alert">
          {submitError}
        </div>
      )}

      <div className="form-row">
        <div className="field">
          <label htmlFor="form-employee">
            Employee <span className="required">*</span>
          </label>
          <EmployeeSelect
            id="form-employee"
            employees={employees}
            value={form.employee_id}
            onChange={(employeeId) => update('employee_id', employeeId)}
            allOptionLabel={null}
            invalid={Boolean(errors.employee_id)}
            describedBy={errors.employee_id ? 'form-employee-error' : undefined}
          />
          {errors.employee_id && (
            <p id="form-employee-error" className="field-error">
              {errors.employee_id}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="form-period">
            Review Period <span className="required">*</span>
          </label>
          <select
            id="form-period"
            className="control"
            value={form.period_id ?? ''}
            aria-invalid={Boolean(errors.period_id)}
            aria-describedby={errors.period_id ? 'form-period-error' : undefined}
            onChange={(e) =>
              update('period_id', e.target.value === '' ? null : Number(e.target.value))
            }
          >
            <option value="">Select review period</option>
            {periods.map((period) => (
              // Only Open periods accept new reviews (backend rule)
              <option key={period.id} value={period.id} disabled={period.status !== 'Open'}>
                {period.name}
                {period.status !== 'Open' ? ' (Closed)' : ''}
              </option>
            ))}
          </select>
          {errors.period_id && (
            <p id="form-period-error" className="field-error">
              {errors.period_id}
            </p>
          )}
        </div>
      </div>

      <h2>Performance Ratings (1 - 5)</h2>
      <div className="ratings">
        {RATING_CRITERIA.map(({ field, label }) => (
          <StarRating
            key={field}
            name={field}
            label={label}
            value={form[field]}
            error={errors[field]}
            onChange={(rating) => update(field, rating)}
          />
        ))}
      </div>

      <div className="field field-wide">
        <label htmlFor="form-comments">
          Overall Comments <span className="required">*</span>
        </label>
        <textarea
          id="form-comments"
          className="control textarea"
          rows={5}
          placeholder="Enter your feedback, strengths, areas of improvement..."
          value={form.comments}
          aria-invalid={Boolean(errors.comments)}
          aria-describedby={errors.comments ? 'form-comments-error' : undefined}
          onChange={(e) => update('comments', e.target.value)}
        />
        {errors.comments && (
          <p id="form-comments-error" className="field-error">
            {errors.comments}
          </p>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={handleReset} disabled={submitting}>
          Reset
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Review'}
        </button>
      </div>
    </form>
  )
}

export default ReviewForm
