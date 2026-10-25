import { useState } from 'react'
import { RATINGS } from '../reviewForm'
import type { Rating } from '../reviewForm'

interface StarRatingProps {
  name: string
  label: string
  value: Rating | null
  error?: string
  onChange: (rating: Rating) => void
}

// Five radio buttons drawn as stars, so arrow keys and screen readers work
function StarRating({ name, label, value, error, onChange }: StarRatingProps) {
  const [hover, setHover] = useState<Rating | null>(null)
  const shown = hover ?? value ?? 0
  const errorId = `${name}-error`

  return (
    <fieldset className="rating-row" aria-describedby={error ? errorId : undefined}>
      <legend>
        {label} <span className="required">*</span>
      </legend>
      <div className="stars" onMouseLeave={() => setHover(null)}>
        {RATINGS.map((rating) => (
          <label
            key={rating}
            className={`star${rating <= shown ? ' is-on' : ''}`}
            onMouseEnter={() => setHover(rating)}
          >
            <input
              type="radio"
              className="sr-only"
              name={name}
              value={rating}
              checked={value === rating}
              onChange={() => onChange(rating)}
            />
            <span aria-hidden="true">★</span>
            <span className="sr-only">{rating} of 5</span>
          </label>
        ))}
        <span className="rating-value">{value ? `${value} / 5` : 'Not rated'}</span>
      </div>
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export default StarRating
