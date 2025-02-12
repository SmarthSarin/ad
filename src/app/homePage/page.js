
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    setMounted(true);
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false, timestamp: Date.now() }]);
      setNewTask("");
    }
  };

  const toggleTask = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const updateTask = (index) => {
    if (editingText.trim()) {
      setTasks(
        tasks.map((task, i) =>
          i === index ? { ...task, text: editingText } : task
        )
      );
      setEditingIndex(null);
      setEditingText("");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
        >
          Task Manager
        </motion.h1>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
          onSubmit={addTask}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-grow p-3 rounded-lg border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Add
            </button>
          </div>
        </motion.form>

        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mb-3"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg p-4 flex items-center justify-between group transition-all">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => updateTask(index)}
                    onKeyPress={(e) => e.key === 'Enter' && updateTask(index)}
                    className="flex-grow p-2 rounded-md border dark:bg-gray-700"
                    autoFocus
                  />
                ) : (
                  <div
                    className={`flex-grow cursor-pointer ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                    onClick={() => toggleTask(index)}
                  >
                    {task.text}
                  </div>
                )}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingIndex(index);
                      setEditingText(task.text);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(index)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={() => session ? signOut() : router.push('/')}
        className="fixed bottom-4 right-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
      >
        {session ? 'Logout' : 'Back to Login'}
      </button>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
      >
        <img
          src={theme === "light" ? "/L.png" : "/D.png"}
          alt="Theme Toggle"
          className="w-6 h-6"
        />
      </button>
    </div>
  );
}
