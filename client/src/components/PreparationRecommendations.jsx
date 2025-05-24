import useInterviewStore from '../store/interviewStore'
import { Progress } from '@/components/ui/progress'
import { CategoryCard } from './interview/CategoryCard'

export function PreparationRecommendations() {
  const { recommendations, toggleTask, getCompletionPercentage } =
    useInterviewStore()

  if (!recommendations) {
    return (
      <div className="p-6 text-center text-gray-500">
        No recommendations available. Please generate them first.
      </div>
    )
  }

  const completionPercentage = getCompletionPercentage()

  return (
    <div className="space-y-6">
      {/* Progress Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Overall Progress
          </h2>
          <span className="text-sm font-medium text-gray-600">
            {completionPercentage}%
          </span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {recommendations.categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onToggleTask={toggleTask}
          />
        ))}
      </div>

      {/* Last Updated */}
      {recommendations.lastUpdated && (
        <div className="text-sm text-gray-500 text-center">
          Last updated: {new Date(recommendations.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  )
}
