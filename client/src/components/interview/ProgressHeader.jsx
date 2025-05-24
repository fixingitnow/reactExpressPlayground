import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2 } from 'lucide-react'
import useInterviewStore from '@/store/interviewStore'

export function ProgressHeader() {
  const { getCompletionPercentage } = useInterviewStore()
  const progress = getCompletionPercentage()

  return (
    <div className="sticky top-0 z-10 py-4 bg-gray-50">
      <Card className="bg-white shadow-sm">
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2
                className={`h-6 w-6 ${progress === 100 ? 'text-green-500' : 'text-gray-400'}`}
              />
              <div>
                <h3 className="text-lg font-semibold">Preparation Progress</h3>
                <p className="text-sm text-gray-500">
                  Track your interview preparation
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-700">
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2.5 bg-gray-100" />
        </CardContent>
      </Card>
    </div>
  )
}
