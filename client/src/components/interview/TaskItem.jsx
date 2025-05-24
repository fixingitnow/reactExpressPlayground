import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TaskItem({ task, onToggleTask }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasSubtasks = task.subtasks && task.subtasks.length > 0

  return (
    <div className="space-y-2">
      <div className="flex items-start my-2 gap-3">
        <div className="flex items-center h-5">
          <Checkbox
            id={task.id}
            checked={task.isCompleted}
            onCheckedChange={() => onToggleTask(task.id)}
            className="h-5 w-5 border-2 rounded-sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {hasSubtasks && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
            <label
              htmlFor={task.id}
              className={cn(
                'flex-1 cursor-pointer text-sm leading-tight',
                task.isCompleted && 'text-gray-500 line-through'
              )}
            >
              {task.title}
            </label>
          </div>
        </div>
      </div>

      {hasSubtasks && isExpanded && (
        <div className="ml-6 pl-2 border-l border-gray-200">
          {task.subtasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              onToggleTask={onToggleTask}
            />
          ))}
        </div>
      )}
    </div>
  )
}
