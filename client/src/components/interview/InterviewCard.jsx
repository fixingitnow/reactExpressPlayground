import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  Link as LinkIcon,
  Clock,
  ChevronDown,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getMeetingPlatform, getTimeUntil } from '@/utils/meeting'

export function InterviewCard({ meeting }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const timeUntil = getTimeUntil(meeting.datetime)
  const platform = getMeetingPlatform(meeting.description)
  const isUpcoming = new Date(meeting.datetime) > new Date()
  const meetingDate = new Date(meeting.datetime)

  // Get day of week
  const dayOfWeek = meetingDate.toLocaleString('en-US', { weekday: 'short' })

  // Day of week colors
  const getDayColor = (day) => {
    const colors = {
      Mon: 'bg-indigo-100 text-indigo-700', // Indigo for Monday
      Tue: 'bg-emerald-100 text-emerald-700', // Emerald for Tuesday
      Wed: 'bg-amber-100 text-amber-700', // Amber for Wednesday
      Thu: 'bg-rose-100 text-rose-700', // Rose for Thursday
      Fri: 'bg-violet-100 text-violet-700', // Violet for Friday
      Sat: 'bg-cyan-100 text-cyan-700', // Cyan for Saturday
      Sun: 'bg-orange-100 text-orange-700', // Orange for Sunday
    }
    return colors[day] || 'bg-gray-100 text-gray-700'
  }

  // Get the icon color matching the day's text color
  const getDayTextColor = (day) => {
    const colors = {
      Mon: 'text-indigo-700',
      Tue: 'text-emerald-700',
      Wed: 'text-amber-700',
      Thu: 'text-rose-700',
      Fri: 'text-violet-700',
      Sat: 'text-cyan-700',
      Sun: 'text-orange-700',
    }
    return colors[day] || 'text-gray-700'
  }

  return (
    <div
      className={`border rounded-lg transition-all ${
        isUpcoming ? 'bg-white' : 'bg-gray-50'
      } ${isExpanded ? 'shadow-md' : 'hover:shadow-sm'}`}
    >
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold truncate">{meeting.title}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {/* Day of week pill */}
                  <div
                    className={`px-3 py-1 rounded-full ${getDayColor(dayOfWeek)}`}
                  >
                    <span className="text-xs font-medium">{dayOfWeek}</span>
                  </div>
                  {/* Countdown timer matching day color */}
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full ${getDayColor(dayOfWeek)}`}
                  >
                    <Clock
                      className={`h-3 w-3 ${getDayTextColor(dayOfWeek)}`}
                    />
                    <span className="text-xs font-medium whitespace-nowrap">
                      {timeUntil}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-0 h-6 w-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1 min-w-0">
                <CalendarIcon className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {meetingDate.toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {platform && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{platform}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && meeting.description && (
        <div className="px-4 pb-4 border-t">
          <div
            className="text-sm text-gray-600 prose prose-sm max-w-none pt-4"
            dangerouslySetInnerHTML={{ __html: meeting.description }}
          />
        </div>
      )}
    </div>
  )
}
