export function formatNextReview(dateInput: string | Date | null): string {
  if (!dateInput) return "Not scheduled"

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  const now = Date.now()
  const diffMs = date.getTime() - now

  if (diffMs <= 0) {
    return "Due"
  }

  const oneHour = 3600 * 1000
  const twoHours = 2 * oneHour
  const sixHours = 6 * oneHour
  const eighteenHours = 18 * oneHour
  const thirtySixHours = 36 * oneHour
  const oneDay = 24 * oneHour
  const threeDays = 3 * oneDay
  const sevenDays = 7 * oneDay
  const thirtyDays = 30 * oneDay

  if (diffMs < twoHours) {
    return "1h"
  } else if (diffMs < sixHours) {
    return "3h"
  } else if (diffMs < eighteenHours) {
    return "12h"
  } else if (diffMs < thirtySixHours) {
    return "1d"
  } else if (diffMs < threeDays) {
    return "3d"
  } else if (diffMs < sevenDays) {
    return "1w"
  } else if (diffMs < thirtyDays) {
    return "1m"
  } else {
    return date.toLocaleDateString()
  }
}
