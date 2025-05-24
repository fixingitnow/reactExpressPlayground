import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialRecommendations = {
  categories: [
    {
      id: 'technical-prep',
      title: 'Technical Preparation',
      description:
        'This section focuses on strengthening your technical skills relevant to software engineering roles.',
      tasks: [
        {
          id: 'core-ds-algo',
          title: 'Review core data structures and algorithms',
          isCompleted: false,
          subtasks: [
            {
              id: 'basic-ds',
              title:
                'Arrays, linked lists, stacks, queues, and hash maps: Implement basic operations and analyze their time and space complexities.',
              isCompleted: false,
            },
            {
              id: 'trees-graphs',
              title:
                "Trees (binary trees, BSTs, tries) and graphs (BFS, DFS, Dijkstra's algorithm): Understand their properties and common use cases.",
              isCompleted: false,
            },
            {
              id: 'sorting',
              title:
                'Sorting algorithms (merge sort, quicksort, heap sort, etc.): Implement and analyze their performance.',
              isCompleted: false,
            },
          ],
        },
        {
          id: 'practice',
          title: 'Practice coding problems',
          isCompleted: false,
          subtasks: [
            {
              id: 'platforms',
              title:
                'Practice coding problems on platforms like LeetCode, HackerRank, and Codewars',
              isCompleted: false,
            },
            {
              id: 'focus-problems',
              title:
                'Focus on problems related to data structures and algorithms mentioned above',
              isCompleted: false,
            },
          ],
        },
      ],
    },
  ],
}

const useInterviewStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userEmail: null,
      meetings: [],
      recommendations: null,
      isLoading: false,
      numMeetings: 5,
      lastFetchTime: null,

      setAuth: (isAuth, email) =>
        set({ isAuthenticated: isAuth, userEmail: email }),

      setMeetings: (meetings) => set({ meetings }),

      initializeRecommendations: () => {
        set({
          recommendations: initialRecommendations,
          lastFetchTime: Date.now(),
        })
      },

      setRecommendations: (recommendations) => {
        // Ensure recommendations follow the expected structure
        if (recommendations && !recommendations.categories) {
          console.warn('Received unstructured recommendations')
          return
        }

        set({
          recommendations,
          lastFetchTime: Date.now(),
        })
      },

      setLoading: (isLoading) => set({ isLoading }),
      setNumMeetings: (numMeetings) => set({ numMeetings }),

      // Toggle task completion
      toggleTask: (taskId) => {
        const state = get()
        if (!state.recommendations) return

        const updateTaskStatus = (tasks) => {
          return tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, isCompleted: !task.isCompleted }
            }
            if (task.subtasks) {
              return {
                ...task,
                subtasks: updateTaskStatus(task.subtasks),
              }
            }
            return task
          })
        }

        const updatedCategories = state.recommendations.categories.map(
          (category) => ({
            ...category,
            tasks: updateTaskStatus(category.tasks),
          })
        )

        set({
          recommendations: {
            ...state.recommendations,
            categories: updatedCategories,
          },
        })
      },

      // Get completion percentage
      getCompletionPercentage: () => {
        const state = get()
        if (!state.recommendations || !state.recommendations.categories)
          return 0

        let totalTasks = 0
        let completedTasks = 0

        const countTasks = (tasks) => {
          if (!Array.isArray(tasks)) return

          tasks.forEach((task) => {
            if (!task) return

            totalTasks++
            if (task.isCompleted) completedTasks++
            if (task.subtasks && Array.isArray(task.subtasks)) {
              countTasks(task.subtasks)
            }
          })
        }

        state.recommendations.categories.forEach((category) => {
          if (category && Array.isArray(category.tasks)) {
            countTasks(category.tasks)
          }
        })

        return totalTasks === 0
          ? 0
          : Math.round((completedTasks / totalTasks) * 100)
      },

      // Check if we need to refresh recommendations
      shouldRefreshRecommendations: () => {
        const state = get()
        if (!state.lastFetchTime) return true
        if (!state.recommendations) return true

        // Refresh if it's been more than 1 hour
        const oneHour = 60 * 60 * 1000
        return Date.now() - state.lastFetchTime > oneHour
      },

      clearRecommendations: () =>
        set({
          recommendations: null,
          lastFetchTime: null,
        }),

      reset: () =>
        set({
          isAuthenticated: false,
          userEmail: null,
          meetings: [],
          recommendations: null,
          isLoading: false,
          lastFetchTime: null,
        }),
    }),
    {
      name: 'interview-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userEmail: state.userEmail,
        meetings: state.meetings,
        recommendations: state.recommendations,
        numMeetings: state.numMeetings,
        lastFetchTime: state.lastFetchTime,
      }),
    }
  )
)

export default useInterviewStore
