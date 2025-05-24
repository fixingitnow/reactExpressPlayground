import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TaskList } from './TaskList'

export function CategoryCard({ category, onToggleTask }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{category.title}</CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <TaskList tasks={category.tasks} onToggleTask={onToggleTask} />
      </CardContent>
    </Card>
  )
}
