import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useInterviewStore from '@/store/interviewStore'
import { InterviewCard } from '@/components/interview/InterviewCard'
import { PreparationRecommendations } from '@/components/PreparationRecommendations'
import { ProgressHeader } from '@/components/interview/ProgressHeader'
import { useInterviews } from '@/hooks/useInterviews'
import { LoadingRecommendations } from '@/components/interview/LoadingRecommendations'

export default function InterviewPrep() {
  const navigate = useNavigate()
  const {
    isAuthenticated,
    userEmail,
    meetings,
    recommendations,
    isLoading,
    numMeetings,
    setNumMeetings,
    reset,
    initializeRecommendations,
  } = useInterviewStore()

  const { refreshAll } = useInterviews()

  useEffect(() => {
    if (!recommendations && !isLoading) {
      initializeRecommendations()
    }
  }, [recommendations, isLoading, initializeRecommendations])

  const handleGoogleAuth = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/google', {
        credentials: 'include',
      })
      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      console.error('Error initiating Google auth:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        credentials: 'include',
      })
      reset()
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleRefresh = async () => {
    if (meetings.length === 0) return

    try {
      await refreshAll()
    } catch (error) {
      console.error('Error refreshing recommendations:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Interview Preparation Planner</CardTitle>
            <CardDescription>
              Connect your Google Calendar to see your upcoming interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGoogleAuth} className="w-full">
              Connect Google Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Interview Preparation Planner
            </h1>
            <p className="text-sm text-gray-600">Signed in as {userEmail}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Show meetings:</span>
              <Select value={numMeetings} onValueChange={setNumMeetings}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Count" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 7, 10].map((num) => (
                    <SelectItem key={num} value={num}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {meetings.length > 0 && <ProgressHeader />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>
                  Your next {numMeetings} scheduled interviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meetings.length > 0 ? (
                    meetings.map((meeting) => (
                      <InterviewCard key={meeting.id} meeting={meeting} />
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No upcoming interviews found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Preparation Recommendations</CardTitle>
                  <CardDescription>
                    AI-generated preparation tips
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                  />
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LoadingRecommendations />
                ) : recommendations ? (
                  <PreparationRecommendations />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No recommendations available. Click refresh to generate.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
