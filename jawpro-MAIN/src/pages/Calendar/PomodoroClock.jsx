import React, { useState, useEffect, useRef } from "react";
import {
  auth,
  getUserTodos,
  saveUserTodos,
} from "../../utils/firebase.utils.js";
import "./pomodoro.css";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};


const eventsData = [
  {
    title: "Qudurat -GAT- Registration (Girls)",
    description: "Registration for the Paper-Based General Aptitude Test (Girls).",
    dateTime: "2025-06-09T00:00:00",
  },
  {
    title: "Qudurat -GAT- Test (Girls)",
    description: "Registration for the Paper-Based General Aptitude Test (Girls).",
    dateTime: "2025-08-19T00:00:00",
  },
  {
    title: "Qudurat -GAT- Registration (Boys)",
    description: "Registration for the Paper-Based General Aptitude Test (Boys).",
    dateTime: "2025-06-02T00:00:00",
  },
  {
    title: "Qudurat -GAT- Test (Boys)",
    description: "Registration for the Paper-Based General Aptitude Test (Boys).",
    dateTime: "2025-08-19T00:00:00",
  },
  {
    title: "STEP Test Registration",
    description: "Registration for the Paper-Based STEP Test.",
    dateTime: "2025-1-19T00:00:00",
  },
];

const EventCounter = ({ eventDateTime }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const target = new Date(eventDateTime);
    const diff = target - now;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDateTime]);

  return (
    <div className="Calendarpage-countdown">
      <p>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
        {timeLeft.seconds}s
      </p>
    </div>
  );
};

const PomodoroClock = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");

  const [timer, setTimer] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(25);
  const audioRef = useRef(null);
  const [timerEnded, setTimerEnded] = useState(false);

  const isOverdue = (task) =>
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  useEffect(() => {
    if (auth.currentUser && tasks.length > 0) {
      saveUserTodos(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    const fetchTodos = async () => {
      const todos = await getUserTodos();
      setTasks(todos);
    };
    fetchTodos();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const todos = await getUserTodos();
        setTasks(todos);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;
          else {
            playSound();
            setTimerEnded(true);
            setTimeout(() => setTimerEnded(false), 3000);
            setIsRunning(false);
            return duration * 60;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, duration]);

  const playSound = () => {
    if (audioRef.current) audioRef.current.play();
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStartPause = () => {
    stopSound();
    setIsRunning((prev) => !prev);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newEntry = {
        id: Date.now(),
        text: newTask,
        dueDate: dueDate || null,
        completed: false,
      };
      const updated = [...tasks, newEntry].sort(
        (a, b) =>
          new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity)
      );
      setTasks(updated);
      setNewTask("");
      setDueDate("");
    }
  };

  const deleteTask = (id) => setTasks(tasks.filter((task) => task.id !== id));

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditingTask = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskText(task.text);
    setEditedDueDate(task.dueDate || "");
  };

  const saveEditedTask = () => {
    setTasks(
      tasks
        .map((task) =>
          task.id === editingTaskId
            ? { ...task, text: editedTaskText, dueDate: editedDueDate }
            : task
        )
        .sort(
          (a, b) =>
            new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity)
        )
    );
    setEditingTaskId(null);
    setEditedTaskText("");
    setEditedDueDate("");
  };

  const moveTask = (index, direction) => {
    const updated = [...tasks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setTasks(updated);
  };

  return (
        <motion.section
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={pageVariants}
        >
    <div className="Calendarpage-pomodoro-container">
      <audio ref={audioRef} src="./sounds/AlarmSpace.mp3" />

      <section className="Calendarpage-pomodoro-container">
        <h2 className="Calendarpage-h2">Upcoming Events</h2>
        <div className="timeline">
          {eventsData.map((event, idx) => (
            <div className="timeline-event" key={idx}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <span className="timeline-date">
                  {new Date(event.dateTime).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <EventCounter eventDateTime={event.dateTime} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="Calendarpage-bottom-section">
        <div className="Calendarpage-todo-section">
          <h2 className="Calendarpage-h2">To-Do List</h2>
          <div className="Calendarpage-todo-input">
            <input
              type="text"
              placeholder="Add a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>
          </div>
          <ul className="Calendarpage-todo-list">
            {tasks.map((task, index) => (
              <li
                key={task.id}
                className={`todo-item ${task.completed ? "completed" : ""} ${
                  isOverdue(task) ? "overdue" : ""
                }`}
              >
                {editingTaskId === task.id ? (
                  <div className="Calendarpage-edit-task">
                    <input
                      type="text"
                      value={editedTaskText}
                      onChange={(e) => setEditedTaskText(e.target.value)}
                    />
                    <input
                      type="datetime-local"
                      value={editedDueDate}
                      onChange={(e) => setEditedDueDate(e.target.value)}
                    />
                    <button onClick={saveEditedTask}>Save</button>
                    <button onClick={() => setEditingTaskId(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="Calendarpage-task-display">
                    <span>{task.text}</span>
                    {task.dueDate && (
                      <small>
                        <br />
                        Due:{" "}
                        {new Date(task.dueDate).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    )}
                    <div className="Calendarpage-task-controls">
                      <button onClick={() => toggleTaskCompletion(task.id)}>
                        {task.completed ? "✔️" : "⭕"}
                      </button>
                      <button
                        onClick={() => moveTask(index, "up")}
                        disabled={index === 0}
                      >
                        ⬆️
                      </button>
                      <button
                        onClick={() => moveTask(index, "down")}
                        disabled={index === tasks.length - 1}
                      >
                        ⬇️
                      </button>
                      <button onClick={() => startEditingTask(task)}>✏️</button>
                      <button onClick={() => deleteTask(task.id)}>🗑️</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="Calendarpage-clock-section">
          <h2 className="Calendarpage-h2">Timer</h2>
          <div className="Calendarpage-timer">
            <svg
              className="Calendarpage-progress-ring"
              width="216"
              height="216"
            >
              <circle
                className={`Calendarpage-progress-ring-circle ${
                  timerEnded ? "ring-flash" : ""
                }`}
                cx="108"
                cy="108"
                r="97.2"
                style={{
                  strokeDasharray: `${2 * Math.PI * 97.2}`,
                  strokeDashoffset: `${
                    (1 - timer / (duration * 60)) * 2 * Math.PI * 97.2
                  }`,
                  transition: "stroke-dashoffset 1s linear",
                }}
              />
            </svg>
            <div className="Calendarpage-time-display">{formatTime(timer)}</div>
          </div>
          <div className="Calendarpage-timer-settings">
            <label>
              Timer Duration (minutes):
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => {
                  const newDuration = Number(e.target.value);
                  setDuration(newDuration);
                  setTimer(newDuration * 60);
                }}
              />
            </label>
          </div>
          <div className="Calendarpage-controls">
            <button onClick={handleStartPause}>
              {isRunning ? "Pause" : "Start"}
            </button>
            <button onClick={stopSound}>Stop Alarm</button>
            <button onClick={() => setTimer(duration * 60)}>Reset</button>
          </div>
        </div>
      </div>
    </div>
    </motion.section>
  );
};

export default PomodoroClock;
