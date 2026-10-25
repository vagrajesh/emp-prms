import type { PerformanceReview } from '../performanceReviewList'

interface ReviewRowProps {
  review: PerformanceReview
  selected: boolean
  onSelect: (review: PerformanceReview) => void
}

function ReviewRow({ review, selected, onSelect }: ReviewRowProps) {
  return (
    <tr className={selected ? 'is-selected' : undefined}>
      <td>
        <button
          type="button"
          className="link-button id-link"
          aria-label={`View review details for ${review.employee_name}, ${review.period_name}`}
          onClick={() => onSelect(review)}
        >
          {review.employee_code}
        </button>
      </td>
      <td>{review.employee_name}</td>
      <td>{review.period_name}</td>
      <td title="Quality, Delivery, Teamwork">
        {review.quality_rating}, {review.delivery_rating}, {review.teamwork_rating}
      </td>
      <td className="num">{review.average_rating.toFixed(1)}</td>
      <td>
        <span className="badge">{review.status}</span>
      </td>
    </tr>
  )
}

export default ReviewRow
