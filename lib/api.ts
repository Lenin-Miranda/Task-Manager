const BASE_URL = "/api/tasks";
import { Task } from "@/app/api/tasks/data";

async function fetchTasks() {
  const response = await fetch(BASE_URL, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return data as Task[];
}

async function createTask(
  title: string,
  description: string,
  completed: boolean
) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description, completed }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return data as Task;
}

async function deleteTask(id: string) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}

async function updateTask(id: string, updates: Partial<Task>) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update task");
  }

  return data as Task;
}

async function toggleTaskCompletion(id: string, completed: boolean) {
  return await updateTask(id, { completed });
}

export const api = {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
  toggleTaskCompletion,
};
