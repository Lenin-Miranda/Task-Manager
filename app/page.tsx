"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Task } from "@/app/api/tasks/data";
import { LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Load tasks on component mount
  useEffect(() => {
    async function loadTasks() {
      if (status !== "authenticated") return;

      try {
        setLoading(true);
        const fetchedTasks = await api.fetchTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [status]);

  // Add new task
  const addTask = async () => {
    if (title.trim() === "") return;
    try {
      setAddingTask(true);
      const newTask = await api.createTask(title, "Task description", false);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setAddingTask(false);
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion
  const toggleTask = async (id: string, completed: boolean) => {
    try {
      await api.toggleTaskCompletion(id, completed);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed } : task
        )
      );
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with user info and logout */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Task Manager
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your daily tasks efficiently
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-md border">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-medium text-gray-700">
                {session.user?.name}
              </span>
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              variant="outline"
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border">
          {/* Task Input */}
          <div className="flex gap-2 mb-6">
            <input
              value={title}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              disabled={addingTask}
            />
            <Button
              onClick={addTask}
              disabled={addingTask || title.trim() === ""}
              className="px-6 py-7 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            >
              {addingTask ? "Adding..." : "Add Task"}
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-8">
            {loading ? (
              // Loading skeleton
              <>
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="p-4 shadow-xl border border-gray-200 rounded-2xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                      </div>
                      <Skeleton className="w-6 h-6" />
                    </div>
                    <div className="mt-4">
                      <Skeleton className="h-10 w-20" />
                    </div>
                  </Card>
                ))}
              </>
            ) : tasks.length === 0 ? (
              // Empty state
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8 text-gray-400"
              >
                <p className="text-lg">No tasks yet!</p>
                <p className="text-sm">Add a task to get started</p>
              </motion.div>
            ) : (
              // Task cards with AnimatePresence
              <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="p-4 shadow-xl border border-gray-200 rounded-2xl">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h2
                            className={`text-xl font-semibold relative transition-colors duration-500 ease-in-out ${
                              task.completed ? "text-gray-400" : ""
                            }`}
                          >
                            <span className="relative inline-block">
                              {task.title}
                              <span
                                className={`absolute left-0 top-1/2 h-[2px] bg-gray-400 transition-all duration-700 ease-out ${
                                  task.completed ? "w-full" : "w-0"
                                }`}
                              />
                            </span>
                          </h2>
                        </div>
                        <Checkbox
                          className="w-6 h-6 mt-1"
                          checked={task.completed}
                          onCheckedChange={(checked) =>
                            toggleTask(task.id, checked as boolean)
                          }
                        />
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          onClick={() => deleteTask(task.id)}
                          className="bg-red-500 text-white rounded-xl px-4 py-2 shadow-md hover:bg-red-600 transition-colors duration-300 cursor-pointer hover:scale-105 transition-transform"
                        >
                          Delete
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
