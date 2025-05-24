export function getTimeUntil(date) {
  const now = new Date()
  const target = new Date(date)
  const diff = target - now

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) {
    return `${days}d ${hours}h`
  }
  return `${hours}h`
}

export function getMeetingPlatform(description) {
  if (description.includes('Meet')) return 'Google Meet'
  if (description.includes('Zoom')) return 'Zoom'
  return 'Meeting'
}

export function formatMeetingTime(datetime) {
  return new Date(datetime).toLocaleString()
}
