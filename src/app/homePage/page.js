// "use client";

// import { useState, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useTheme } from "next-themes";

// export default function Dashboard() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState("");
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editingText, setEditingText] = useState("");

//   useEffect(() => {
//     setMounted(true);
//     if (!session) {
//       router.replace("/");
//     }
//   }, [session, router]);

//   useEffect(() => {
//     const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
//     setTasks(storedTasks);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("tasks", JSON.stringify(tasks));
//   }, [tasks]);

//   const addTask = () => {
//     if (newTask.trim()) {
//       setTasks([...tasks, { text: newTask, completed: false }]);
//       setNewTask("");
//     }
//   };

//   const toggleTask = (index) => {
//     setTasks(
//       tasks.map((task, i) =>
//         i === index ? { ...task, completed: !task.completed } : task
//       )
//     );
//   };

//   const deleteTask = (index) => {
//     setTasks(tasks.filter((_, i) => i !== index));
//   };

//   const startEditing = (index) => {
//     setEditingIndex(index);
//     setEditingText(tasks[index].text);
//   };

//   const updateTask = () => {
//     setTasks(
//       tasks.map((task, i) =>
//         i === editingIndex ? { ...task, text: editingText } : task
//       )
//     );
//     setEditingIndex(null);
//     setEditingText("");
//   };

//   if (!mounted) return <div className="min-h-screen bg-white dark:bg-black"></div>;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-8 transition-all duration-300 relative">
//       <h1 className="text-4xl font-bold text-center mb-6">Complete Your Goals</h1>

//       <div className="w-full max-w-md">
//         <div className="flex gap-2 mb-4">
//           <input
//             type="text"
//             value={newTask}
//             onChange={(e) => setNewTask(e.target.value)}
//             placeholder="Add a new task"
//             className="flex-grow p-2 border rounded-md"
//           />
//           <button onClick={addTask} className="p-2 bg-blue-500 text-white rounded-md">Add</button>
//         </div>

//         <ul className="space-y-2">
//           {tasks.map((task, index) => (
//             <li key={index} className="flex justify-between items-center p-2 border rounded-md">
//               {editingIndex === index ? (
//                 <input
//                   type="text"
//                   value={editingText}
//                   onChange={(e) => setEditingText(e.target.value)}
//                   className="flex-grow p-1 border rounded-md"
//                 />
//               ) : (
//                 <span
//                   className={`cursor-pointer ${task.completed ? "line-through text-gray-500" : ""}`}
//                   onClick={() => toggleTask(index)}
//                 >
//                   {task.text}
//                 </span>
//               )}
//               <div className="flex gap-2">
//                 {editingIndex === index ? (
//                   <button onClick={updateTask} className="text-green-500">Save</button>
//                 ) : (
//                   <button onClick={() => startEditing(index)} className="text-blue-500">Edit</button>
//                 )}
//                 <button onClick={() => deleteTask(index)} className="text-red-500">Delete</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Logout Button */}
//       <button
//         onClick={() => signOut()}
//         className="fixed bottom-4 right-4 px-6 py-3 text-white font-semibold rounded-lg shadow-lg 
//              transition-all hover:scale-105 active:scale-95 
//              bg-red-500 hover:bg-red-600 dark:bg-gray-800 dark:hover:bg-gray-700"
//       >
//         Logout
//       </button>


//       {/* Dark Mode Toggle */}
//       <button
//         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//         className="fixed top-4 right-4 w-16 h-16 flex items-center justify-center 
//                    bg-white/30 dark:bg-gray-900/50 backdrop-blur-md 
//                    rounded-full shadow-lg transition-all 
//                    hover:scale-110 active:scale-95"
//       >
//         <img
//           src={theme === "light" ? "/l.png" : "/d.png"}
//           alt="Theme Toggle Icon"
//           className="w-10 h-10 object-contain"
//         />
//       </button>
//     </div>
//   );
// }

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
    
    <div
      className="relative min-h-screen p-4 md:p-8"
      style={{
        backgroundImage: "url('/site-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: theme === "light" ? "invert(1)" : "none",
      }}
    >


      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8"
        >
          <span
            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
                       bg-clip-text text-transparent dark:from-blue-500 
                       dark:via-purple-500 dark:to-pink-500"
          >
            W3LCOME To Task Manager Web Application
          </span>
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
        className="fixed top-4 right-4 w-14 h-14 flex items-center justify-center bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all backdrop-blur-sm"
      >
        <img
          src={theme === "light" ? "/L.png" : "/D.png"}
          alt="Theme Toggle"
          className="w-8 h-8 object-contain"
        />
      </button>
    </div>
  );
}
