const { formatDistanceToNow, isToday, isYesterday, differenceInDays, differenceInMonths } = require('date-fns')

const formatDate = dateString => {
  const inputDate = new Date(dateString)
  const now = new Date()

  if (isToday(inputDate)) return formatDistanceToNow(inputDate, { addSuffix: true })

  if (isYesterday(inputDate)) return 'Yesterday'

  const daysDifference = differenceInDays(now, inputDate)
  if (daysDifference < 30) return `${daysDifference} days ago`

  const monthsDifference = differenceInMonths(now, inputDate)
  if (monthsDifference < 12) return `${monthsDifference} months ago`

  const yearsDifference = Math.floor(monthsDifference / 12)
  return `${yearsDifference} years ago`
}

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

module.exports = {
  formatDate,
  formatBytes,
}
