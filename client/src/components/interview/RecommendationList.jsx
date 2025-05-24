import React from 'react'
import { CategoryCard } from './CategoryCard'

export function RecommendationList({ recommendations }) {
  if (!recommendations || !recommendations.categories) {
    return (
      <div className="p-6 text-center text-gray-500">
        No recommendations available
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {recommendations.categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}
