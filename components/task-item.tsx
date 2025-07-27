"use client"

import { useState } from "react"
import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Check, X } from "lucide-react"
import DeleteConfirmation from "./delete-confirmation"

interface TaskItemProps {
  task: Task
  onDelete: (id: string) => void
  onEdit: (id: string, name: string) => void
}

export default function TaskItem({ task, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(task.name)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const handleEdit = () => {
    onEdit(task.id, editedName)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(task.id)
    setShowDeleteConfirmation(false)
  }

  return (
    <li className="flex items-center p-3 border rounded-md bg-card">
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="flex-1" autoFocus />
          <Button size="icon" variant="ghost" onClick={handleEdit}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span className="flex-1">{task.name}</span>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setShowDeleteConfirmation(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation onConfirm={handleDelete} onCancel={() => setShowDeleteConfirmation(false)} />
      )}
    </li>
  )
}
