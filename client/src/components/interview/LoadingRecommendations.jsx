import React from 'react'
import { Loader2 } from 'lucide-react'

export function LoadingRecommendations() {
  return (
    <div className="space-y-4">
      {/* Loading header */}
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
      </div>

      {/* Loading items */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
          </div>
        </div>
      ))}

      {/* Loading code block */}
      <div className="animate-pulse">
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>

      <div className="flex items-center justify-center py-8 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-3 text-sm">Generating recommendations...</span>
      </div>
    </div>
  )
}
