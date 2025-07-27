"use client"

import { useState,useEffect } from "react"
import TaskForm from "./task-form"
import TaskList from "./task-list"
import type { Task } from "@/types/task"
import { v4 as uuidv4 } from "uuid"

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]); // ここもtypo
  const [updateTrigger, setUpdateTrigger] = useState(false);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks));
  }, [updateTrigger]);



  const addTask = async (name: string) => {
    // 空白などが入力された場合のチェック
    if (!name.trim()) {
      console.error("タスク名は必須です");
      return;
    }

    const id = uuidv4(); // 一意なIDを生成
    const completed = false; // 最初は未完了

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, completed }),
      });

      setUpdateTrigger(!updateTrigger); // これを追加
    } catch (error) {
      console.error("エラーが発生しました", error);
    }
  };


  const deleteTask = async (id: string) => {
    const response = await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    setUpdateTrigger(!updateTrigger);
  };


  const editTask = async (id: string, name: string) => {
    const completed = false;

    const response = await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, completed }),
    });

    setUpdateTrigger(!updateTrigger);
  };


  return (
    <div className="flex flex-col items-center">
      {/*<h1 className="text-3xl font-bold mb-8">Todoアプリ</h1>*/}
      <TaskForm onAddTask={addTask} />
      <TaskList tasks={tasks} onDeleteTask={deleteTask} onEditTask={editTask} />
    </div>
  )
}
