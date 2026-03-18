import { ScanBlock, ScanSetting, Booking } from './types'
import { parse, isBefore, addMinutes, format } from 'date-fns'

export const checkBlockOverlap = (
  slotStart: string,
  slotEnd: string,
  dateStr: string,
  blocks: ScanBlock[],
) => {
  return blocks.find((b) => {
    const bStart = b.start_time.substring(0, 5)
    const bEnd = b.end_time.substring(0, 5)
    const timeOverlap = bStart < slotEnd && bEnd > slotStart

    if (!timeOverlap) return false

    if (b.recurrence === 'daily') return true
    if (b.recurrence === 'unique' && b.block_date === dateStr) return true

    const targetDate = new Date(dateStr + 'T12:00:00')

    if (b.recurrence === 'weekly') {
      if (b.day_of_week !== null && b.day_of_week !== undefined) {
        if (targetDate.getDay() === b.day_of_week) return true
      } else if (b.block_date) {
        const blockDate = new Date(b.block_date + 'T12:00:00')
        if (targetDate.getDay() === blockDate.getDay()) return true
      }
    }

    if (b.recurrence === 'monthly' && b.block_date) {
      const blockDate = new Date(b.block_date + 'T12:00:00')
      if (targetDate.getDate() === blockDate.getDate()) return true
    }

    return false
  })
}

export const checkBookingOverlap = (
  start: string,
  end: string,
  date: string,
  bookings: Booking[],
  excludeId?: string,
) => {
  const dayBookings = bookings.filter(
    (b) => b.booking_date.substring(0, 10) === date && b.id !== excludeId,
  )
  return dayBookings.some(
    (b) => b.start_time.substring(0, 5) < end && b.end_time.substring(0, 5) > start,
  )
}

export const generateTimeSlots = (setting?: ScanSetting) => {
  const slots = []
  if (!setting || !setting.is_available) return slots

  const startStr = setting.start_time.length === 5 ? setting.start_time + ':00' : setting.start_time
  const endStr = setting.end_time.length === 5 ? setting.end_time + ':00' : setting.end_time

  let current = parse(startStr, 'HH:mm:ss', new Date())
  const end = parse(endStr, 'HH:mm:ss', new Date())

  while (isBefore(current, end)) {
    const next = addMinutes(current, setting.slot_duration_minutes)
    slots.push({
      start: format(current, 'HH:mm'),
      end: format(next, 'HH:mm'),
    })
    current = next
  }
  return slots
}
