"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

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
    if (!session) {
      router.replace("/");
    }
  }, [session, router]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false }]);
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
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  };

  const updateTask = () => {
    setTasks(
      tasks.map((task, i) =>
        i === editingIndex ? { ...task, text: editingText } : task
      )
    );
    setEditingIndex(null);
    setEditingText("");
  };

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black"></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 transition-all duration-300 relative">
      <h1 className="text-4xl font-bold text-center mb-6">Complete Your Goals</h1>

      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="flex-grow p-2 border rounded-md"
          />
          <button onClick={addTask} className="p-2 bg-blue-500 text-white rounded-md">Add</button>
        </div>

        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="flex justify-between items-center p-2 border rounded-md">
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-grow p-1 border rounded-md"
                />
              ) : (
                <span
                  className={`cursor-pointer ${task.completed ? "line-through text-gray-500" : ""}`}
                  onClick={() => toggleTask(index)}
                >
                  {task.text}
                </span>
              )}
              <div className="flex gap-2">
                {editingIndex === index ? (
                  <button onClick={updateTask} className="text-green-500">Save</button>
                ) : (
                  <button onClick={() => startEditing(index)} className="text-blue-500">Edit</button>
                )}
                <button onClick={() => deleteTask(index)} className="text-red-500">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => signOut()}
        className="fixed bottom-4 right-4 px-6 py-3 text-white font-semibold rounded-lg shadow-lg 
             transition-all hover:scale-105 active:scale-95 
             bg-red-500 hover:bg-red-600 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        Logout
      </button>


      {/* Dark Mode Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 w-16 h-16 flex items-center justify-center 
                   bg-white/30 dark:bg-gray-900/50 backdrop-blur-md 
                   rounded-full shadow-lg transition-all 
                   hover:scale-110 active:scale-95"
      >
        <img
          src={theme === "light" ? "/l.png" : "/d.png"}
          alt="Theme Toggle Icon"
          className="w-10 h-10 object-contain"
        />
      </button>
    </div>
  );
}