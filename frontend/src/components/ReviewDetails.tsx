import { useEffect, useRef, useState } from 'react'
import StarDisplay from './StarDisplay'
import { getEmployeeReviews } from '../api'
import { RATING_CRITERIA } from '../reviewForm'
import type { PerformanceReview, ReviewPeriod } from '../performanceReviewList'

interface ReviewDetailsProps {
  employeeId: number
  reviewId: number // the row that was clicked; shown first
  periods: ReviewPeriod[]
  onClose: () => void
}

const monthOf = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short' })

// "H1 2026 (Jan - Jun)" when the period's dates are known
function periodLabel(review: PerformanceReview, periods: ReviewPeriod[]) {
  const period = periods.find((p) => p.id === review.period_id)
  if (!period) return review.period_name
  return `${review.period_name} (${monthOf(period.start_date)} - ${monthOf(period.end_date)})`
}

// App remounts this (via key) for each clicked row, so state starts fresh
function ReviewDetails({ employeeId, reviewId, periods, onClose }: ReviewDetailsProps) {
  const [reviews, setReviews] = useState<PerformanceReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState(reviewId)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Move focus here so keyboard and small-screen users land on the card
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  useEffect(() => {
    let ignore = false
    getEmployeeReviews(employeeId)
      .then((data) => {
        if (!ignore) setReviews(data)
      })
      .catch((err: Error) => {
        if (!ignore) setError(`Could not load review details: ${err.message}`)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [employeeId])

  const review = reviews.find((r) => r.id === selectedId) ?? reviews[0]

  let body
  if (loading) {
    body = <p className="table-message">Loading review…</p>
  } else if (error) {
    body = <p className="table-message is-error">{error}</p>
  } else if (!review) {
    body = <p className="table-message">No reviews found for this employee.</p>
  } else {
    body = (
      <>
        {reviews.length > 1 && (
          <div className="field details-switch">
            <label htmlFor="details-period">This employee's reviews</label>
            <select
              id="details-period"
              className="control"
              value={review.id}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {reviews.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.period_name}
                </option>
              ))}
            </select>
          </div>
        )}

        <dl className="summary">
          <div className="summary-box">
            <dt>Employee</dt>
            <dd>
              {review.employee_code} - {review.employee_name}
            </dd>
          </div>
          <div className="summary-box">
            <dt>Review Period</dt>
            <dd>{periodLabel(review, periods)}</dd>
          </div>
          <div className="summary-box is-overall">
            <dt>Overall Rating</dt>
            <dd>
              <span className="overall-value">{review.average_rating.toFixed(1)}</span> / 5
            </dd>
          </div>
        </dl>

        <h3>Performance Criteria</h3>
        <table className="criteria-table">
          <thead>
            <tr>
              <th>Criteria</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {RATING_CRITERIA.map(({ field, label }) => (
              <tr key={field}>
                <td>{label}</td>
                <td>
                  <StarDisplay value={review[field]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Manager Comments</h3>
        <p className="comments-box">{review.comments}</p>

        <p className="submitted-on">
          Submitted{' '}
          {new Date(review.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </>
    )
  }

  return (
    <section className="card details-card" aria-labelledby="details-title">
      <div className="card-head">
        <h1 id="details-title" ref={headingRef} tabIndex={-1}>
          Review Details
        </h1>
        <button type="button" className="btn-secondary btn-small" onClick={onClose}>
          Back to List
        </button>
      </div>
      {body}
    </section>
  )
}

export default ReviewDetails
