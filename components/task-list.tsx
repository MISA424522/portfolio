import type { Task } from "@/types/task"
import TaskItem from "./task-item"

interface TaskListProps {
  tasks: Task[]
  onDeleteTask: (id: string) => void
  onEditTask: (id: string, name: string) => void
}

export default function TaskList({ tasks, onDeleteTask, onEditTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-muted-foreground">タスクがありません。</p>
  }

  return (
    <ul className="w-full max-w-md space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDeleteTask} onEdit={onEditTask} />
      ))}
    </ul>
  )
}
