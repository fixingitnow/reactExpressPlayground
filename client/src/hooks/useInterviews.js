import { useEffect } from 'react'
import useInterviewStore from '@/store/interviewStore'
import { recommendationFormat } from '@/utils/recommendationFormat'

export function useInterviews() {
  const {
    meetings,
    numMeetings,
    setMeetings,
    setRecommendations,
    clearRecommendations,
    setLoading,
    shouldRefreshRecommendations,
    recommendations,
    isAuthenticated,
    setAuth,
  } = useInterviewStore()

  // Format GPT response into structured sections with checkboxes
  const formatRecommendations = (text) => {
    if (!text) return ''

    // Split into sections
    const sections = text.split(/^##\s+/m).filter(Boolean)

    return sections
      .map((section) => {
        const [title, ...content] = section.split('\n').filter(Boolean)

        // Format the content, adding checkboxes only if they don't exist
        const formattedContent = content
          .map((line) => {
            const trimmed = line.trim()
            // If it already has a checkbox, leave it as is
            if (trimmed.startsWith('- [ ]') || trimmed.startsWith('  - [ ]')) {
              return line
            }
            // If it's a bullet point without checkbox, add one
            if (trimmed.startsWith('- ')) {
              const taskText = trimmed.substring(2)
              return `- [ ] ${taskText}`
            }
            // If it's an indented bullet point without checkbox, add one
            if (trimmed.startsWith('  - ')) {
              const taskText = trimmed.substring(4)
              return `  - [ ] ${taskText}`
            }
            return line
          })
          .join('\n')

        // Reconstruct the section with proper formatting
        return `## ${title}\n\n${formattedContent}`
      })
      .join('\n\n')
  }

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/status', {
        credentials: 'include',
      })
      const data = await response.json()
      setAuth(data.isAuthenticated, data.email)
      return data.isAuthenticated
    } catch (error) {
      console.error('Error checking auth status:', error)
      setAuth(false, null)
      return false
    }
  }

  const handleAuthError = async () => {
    // Clear auth state before redirecting
    setAuth(false, null)

    try {
      const response = await fetch('http://localhost:3000/api/auth/google')
      const data = await response.json()
      // Only redirect if we're not already on the auth page
      if (!window.location.href.includes('oauth2/v2/auth')) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error getting auth URL:', error)
    }
  }

  const fetchUpcomingMeetings = async (count) => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/calendar/upcoming',
        {
          credentials: 'include',
        }
      )

      if (response.status === 401) {
        await handleAuthError()
        return []
      }

      if (!response.ok) {
        throw new Error('Failed to fetch meetings')
      }

      const data = await response.json()
      return data.slice(0, count)
    } catch (error) {
      console.error('Error fetching meetings:', error)
      return []
    }
  }

  const getRecommendations = async (meetings) => {
    try {
      console.log('Starting recommendation request...')
      const response = await fetch(
        'http://localhost:3000/api/recommendations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            meetings,
            format: recommendationFormat.format,
            requirements: recommendationFormat.requirements,
          }),
        }
      )

      if (response.status === 401) {
        const isAuthed = await checkAuthStatus()
        if (!isAuthed) {
          await handleAuthError()
          return null
        }
      }

      if (!response.ok) {
        throw new Error('Failed to get recommendations')
      }

      console.log('Received response from server')
      const data = await response.json()
      console.log('Successfully parsed recommendations')
      return data // No need to format since we're getting structured JSON now
    } catch (error) {
      console.error('Error getting recommendations:', error)
      throw error
    }
  }

  // Force refresh - used when refresh button is clicked
  const refreshAll = async (forceRefresh = true) => {
    try {
      setLoading(true)
      const isAuthed = await checkAuthStatus()
      if (!isAuthed) {
        await handleAuthError()
        return
      }

      const upcomingMeetings = await fetchUpcomingMeetings(numMeetings)
      if (upcomingMeetings.length > 0) {
        setMeetings(upcomingMeetings)
        if (
          forceRefresh ||
          !recommendations ||
          shouldRefreshRecommendations()
        ) {
          console.log('Fetching new recommendations...')
          const newRecommendations = await getRecommendations(upcomingMeetings)
          if (newRecommendations) {
            clearRecommendations()
            setRecommendations(newRecommendations)
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error)
      if (!recommendations) {
        setRecommendations(
          'Error getting AI recommendations. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // Initial load - don't force refresh
  useEffect(() => {
    const loadInitialData = async () => {
      // If we're on the auth page, don't try to load data
      if (window.location.href.includes('oauth2/v2/auth')) {
        return
      }

      const isAuthed = await checkAuthStatus()
      if (!isAuthed) {
        await handleAuthError()
        return
      }

      if (!recommendations || shouldRefreshRecommendations()) {
        await refreshAll(false)
      } else {
        const upcomingMeetings = await fetchUpcomingMeetings(numMeetings)
        if (upcomingMeetings.length > 0) {
          setMeetings(upcomingMeetings)
        }
      }
    }
    loadInitialData()
  }, [numMeetings])

  return {
    meetings,
    isAuthenticated,
    // Always force refresh when called explicitly via button
    refreshAll: () => refreshAll(true),
  }
}
