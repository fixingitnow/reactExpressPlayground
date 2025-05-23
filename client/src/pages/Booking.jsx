// add booking page using select, calendar, button, input, etc.

import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'

export default function Booking() {
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  })
  const [roomType, setRoomType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [bookingStatus, setBookingStatus] = useState('')

  const roomTypes = [
    { id: 'standard', name: 'Standard Room' },
    { id: 'deluxe', name: 'Deluxe Room' },
    { id: 'suite', name: 'Suite' },
    { id: 'executive', name: 'Executive Suite' },
  ]

  const handleBooking = async () => {
    setIsLoading(true)
    setBookingStatus('Checking room availability...')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setBookingStatus('Processing payment...')

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setBookingStatus('Confirming your reservation...')

    await new Promise((resolve) => setTimeout(resolve, 800))

    console.log('Booking details:', {
      checkInDate: dateRange.from,
      checkOutDate: dateRange.to,
      roomType,
    })

    setBookingStatus('Booking confirmed!')
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setBookingStatus('')
    // Reset form after successful booking
    setDateRange({ from: undefined, to: undefined })
    setRoomType('')
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Book Your Stay</h1>

      <div className="grid gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Your Dates
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !dateRange.from && 'text-muted-foreground'
                  }`}
                  disabled={isLoading}
                >
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} -{' '}
                        {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Room Type</label>
          <Select
            value={roomType}
            onValueChange={setRoomType}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a room type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={handleBooking}
            disabled={
              !dateRange.from || !dateRange.to || !roomType || isLoading
            }
          >
            {isLoading ? 'Processing...' : 'Book Now'}
          </Button>

          {bookingStatus && (
            <div className="text-center text-sm text-slate-600 animate-pulse">
              {bookingStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
