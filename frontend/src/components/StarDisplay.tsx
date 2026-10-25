import { RATINGS } from '../reviewForm'

interface StarDisplayProps {
  value: number
}

// Read-only stars, e.g. on the Review Details card
function StarDisplay({ value }: StarDisplayProps) {
  return (
    <span className="star-display" role="img" aria-label={`${value} out of 5`}>
      {RATINGS.map((rating) => (
        <span key={rating} aria-hidden="true" className={rating <= value ? 'is-on' : undefined}>
          ★
        </span>
      ))}
    </span>
  )
}

export default StarDisplay
