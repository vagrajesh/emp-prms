import { useState } from 'react'
import type { FormEvent } from 'react'
import EmployeeSelect from './EmployeeSelect'
import { DEFAULT_FILTERS } from '../performanceReviewList'
import type { Employee, ReviewFilters, ReviewPeriod } from '../performanceReviewList'

interface ReviewFilterBarProps {
  periods: ReviewPeriod[]
  employees: Employee[]
  onSearch: (filters: ReviewFilters) => void
}

// Holds the picked values until Search is pressed
function ReviewFilterBar({ periods, employees, onSearch }: ReviewFilterBarProps) {
  const [draft, setDraft] = useState<ReviewFilters>(DEFAULT_FILTERS)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSearch({ ...draft })
  }

  return (
    <form className="filter-bar" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="period-filter">Review Period</label>
        <select
          id="period-filter"
          className="control"
          value={draft.period_id ?? ''}
          onChange={(e) =>
            setDraft({
              ...draft,
              period_id: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        >
          <option value="">All Periods</option>
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {period.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="employee-filter">Employee</label>
        <EmployeeSelect
          id="employee-filter"
          employees={employees}
          value={draft.employee_id}
          onChange={(employeeId) => setDraft({ ...draft, employee_id: employeeId })}
        />
      </div>

      <button type="submit" className="btn-primary">
        Search
      </button>
    </form>
  )
}

export default ReviewFilterBar
