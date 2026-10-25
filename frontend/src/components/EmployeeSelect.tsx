import { useId, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Employee } from '../performanceReviewList'

interface EmployeeSelectProps {
  id: string
  employees: Employee[]
  value: number | null
  onChange: (employeeId: number | null) => void
  // Label of the "everyone" option; null leaves it out (e.g. on the review form)
  allOptionLabel?: string | null
  invalid?: boolean
  describedBy?: string
}

const employeeLabel = (emp: Employee) => `${emp.employee_id} - ${emp.name}`

// Dropdown with a type-to-search box. null means nothing picked / "All Employees".
function EmployeeSelect({
  id,
  employees,
  value,
  onChange,
  allOptionLabel = 'All Employees',
  invalid,
  describedBy,
}: EmployeeSelectProps) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const selected = employees.find((emp) => emp.id === value)

  const options = useMemo<(Employee | null)[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allOptionLabel === null ? employees : [null, ...employees]
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.employee_id.toLowerCase().includes(q),
    )
  }, [employees, query, allOptionLabel])

  function pick(emp: Employee | null) {
    onChange(emp ? emp.id : null)
    setQuery('')
    setOpen(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && open) {
      e.preventDefault()
      if (options.length > 0) pick(options[active])
    } else if (e.key === 'Escape') {
      setQuery('')
      setOpen(false)
    }
  }

  const closedText = selected ? employeeLabel(selected) : (allOptionLabel ?? '')

  return (
    <div className="combo">
      <input
        id={id}
        className="control"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        placeholder={open ? 'Search by name or ID' : 'Select employee'}
        value={open ? query : closedText}
        onFocus={() => {
          setOpen(true)
          setActive(0)
        }}
        onBlur={() => {
          setQuery('')
          setOpen(false)
        }}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
          setOpen(true)
        }}
        onKeyDown={handleKeyDown}
      />
      {open && (
        <ul id={listId} className="combo-list" role="listbox">
          {options.length === 0 && <li className="combo-empty">No matching employees</li>}
          {options.map((emp, i) => (
            <li
              key={emp ? emp.id : 'all'}
              role="option"
              aria-selected={(emp?.id ?? null) === value}
              className={`combo-option${i === active ? ' is-active' : ''}`}
              // mousedown fires before the input's blur closes the list
              onMouseDown={(e) => {
                e.preventDefault()
                pick(emp)
              }}
              onMouseEnter={() => setActive(i)}
            >
              {emp ? employeeLabel(emp) : allOptionLabel}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default EmployeeSelect
