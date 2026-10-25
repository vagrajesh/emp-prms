import { useEffect, useState } from 'react'
import Header from './components/Header'
import ReviewDetails from './components/ReviewDetails'
import ReviewForm from './components/ReviewForm'
import ReviewListPage from './components/ReviewListPage'
import { getEmployees, getReviewPeriods } from './api'
import type { Employee, PerformanceReview, ReviewPeriod } from './performanceReviewList'
import './App.css'

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [periods, setPeriods] = useState<ReviewPeriod[]>([])
  const [lookupError, setLookupError] = useState<string | null>(null)
  // Bumped after each submit so the list and details cards refetch
  const [refreshKey, setRefreshKey] = useState(0)
  // Row clicked in the list; null hides the Review Details card
  const [selected, setSelected] = useState<PerformanceReview | null>(null)

  // Dropdown data for both cards, loaded once
  useEffect(() => {
    Promise.all([getEmployees(), getReviewPeriods()])
      .then(([employeeData, periodData]) => {
        setEmployees(employeeData)
        setPeriods(periodData)
      })
      .catch((err: Error) => setLookupError(`Could not load employees and periods: ${err.message}`))
  }, [])

  return (
    <>
      <Header />
      <main className="page">
        {lookupError && <p className="alert">{lookupError}</p>}
        <div className={`card-grid${selected ? ' has-details' : ''}`}>
          <section className="card" aria-labelledby="form-title">
            <h1 id="form-title">Submit Performance Review</h1>
            <ReviewForm
              employees={employees}
              periods={periods}
              onSubmitted={() => setRefreshKey((k) => k + 1)}
            />
          </section>
          <section className="card" aria-labelledby="list-title">
            <h1 id="list-title">Performance Reviews</h1>
            <ReviewListPage
              employees={employees}
              periods={periods}
              refreshKey={refreshKey}
              selectedReviewId={selected?.id ?? null}
              onSelect={setSelected}
            />
          </section>
          {selected && (
            <ReviewDetails
              key={`${selected.id}-${refreshKey}`}
              employeeId={selected.employee_id}
              reviewId={selected.id}
              periods={periods}
              onClose={() => setSelected(null)}
            />
          )}
        </div>
      </main>
    </>
  )
}

export default App
