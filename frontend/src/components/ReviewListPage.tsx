import { useEffect, useState } from 'react'
import ReviewFilterBar from './ReviewFilterBar'
import ReviewList from './ReviewList'
import { getReviews } from '../api'
import { DEFAULT_FILTERS } from '../performanceReviewList'
import type {
  Employee,
  PerformanceReview,
  ReviewFilters,
  ReviewPeriod,
} from '../performanceReviewList'

interface ReviewListPageProps {
  employees: Employee[]
  periods: ReviewPeriod[]
  // Changes after a new review is submitted; keeps the current filters
  refreshKey: number
  selectedReviewId: number | null
  onSelect: (review: PerformanceReview) => void
}

function ReviewListPage({
  employees,
  periods,
  refreshKey,
  selectedReviewId,
  onSelect,
}: ReviewListPageProps) {
  const [filters, setFilters] = useState<ReviewFilters>(DEFAULT_FILTERS)
  const [reviews, setReviews] = useState<PerformanceReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  function handleSearch(next: ReviewFilters) {
    setLoading(true)
    setError(null)
    setFilters(next)
  }

  // Reviews, reloaded when Search is pressed or a review is submitted
  useEffect(() => {
    let ignore = false
    getReviews(filters)
      .then((data) => {
        if (ignore) return
        setReviews(data)
        setPage(1)
      })
      .catch((err: Error) => {
        if (!ignore) setError(`Could not load reviews: ${err.message}`)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [filters, refreshKey])

  return (
    <>
      <ReviewFilterBar periods={periods} employees={employees} onSearch={handleSearch} />
      <ReviewList
        reviews={reviews}
        loading={loading}
        error={error}
        page={page}
        onPageChange={setPage}
        selectedReviewId={selectedReviewId}
        onSelect={onSelect}
      />
    </>
  )
}

export default ReviewListPage
