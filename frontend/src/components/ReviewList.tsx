import ReviewRow from './ReviewRow'
import type { PerformanceReview } from '../performanceReviewList'

export const PAGE_SIZE = 5

interface ReviewListProps {
  reviews: PerformanceReview[]
  loading: boolean
  error: string | null
  page: number
  onPageChange: (page: number) => void
  selectedReviewId: number | null
  onSelect: (review: PerformanceReview) => void
}

function ReviewList({
  reviews,
  loading,
  error,
  page,
  onPageChange,
  selectedReviewId,
  onSelect,
}: ReviewListProps) {
  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const pageRows = reviews.slice(start, start + PAGE_SIZE)

  let body
  if (loading) {
    body = <td colSpan={6} className="table-message">Loading reviews…</td>
  } else if (error) {
    body = <td colSpan={6} className="table-message is-error">{error}</td>
  } else if (reviews.length === 0) {
    body = <td colSpan={6} className="table-message">No reviews found for these filters.</td>
  }

  return (
    <>
      <div className="table-wrap">
        <table className="review-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Period</th>
              <th>Ratings</th>
              <th className="num">Average</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {body ? (
              <tr>{body}</tr>
            ) : (
              pageRows.map((review) => (
                <ReviewRow
                  key={review.id}
                  review={review}
                  selected={review.id === selectedReviewId}
                  onSelect={onSelect}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && reviews.length > 0 && (
        <div className="pager">
          <span>
            Showing {start + 1} to {start + pageRows.length} of {reviews.length} reviews
          </span>
          <div className="pager-buttons">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={n === page ? 'is-current' : undefined}
                aria-current={n === page ? 'page' : undefined}
                onClick={() => onPageChange(n)}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              aria-label="Next page"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ReviewList
