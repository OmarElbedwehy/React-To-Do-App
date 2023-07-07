import { FC, useEffect, useRef, useState } from 'react'
import desktopWrappedImgDark from './assets/bg-desktop-dark.jpg'
import mobilewrappedImgDark from './assets/bg-mobile-dark.jpg'
import desktopWrappedImgLight from './assets/bg-desktop-light.jpg'
import mobileWrappedImgLight from './assets/bg-mobile-light.jpg'
import sunIco from './assets/icon-sun.svg'
import moonIco from './assets/icon-moon.svg'

import './App.css'
import Task from "./components/task"
import TaskModule from "./moduleType"

const App: FC = () => {
  const [darkTheme, setDarkTheme] = useState<boolean>(false)
  const [taskTitle, setTaskTitle] = useState<string>("")
  const taskTitleInput = useRef<HTMLInputElement>(null)
  const [tasks, setTasks] = useState<TaskModule[]>(JSON.parse(localStorage.getItem("tasks") || "[]"))
  const [data, setData] = useState<TaskModule[]>(tasks);
  const [completed, setCompleted] = useState<TaskModule[]>([]);
  const [active, setActive] = useState<TaskModule[]>([]);
  const [state, setState] = useState<string>("all")
  const [editMode, setEditMode] = useState(false)
  const [editEleId, setEditEleId] = useState<any>(null)
  const allEle = useRef<HTMLLIElement>(null)
  const activeEle = useRef<HTMLLIElement>(null)
  const completedEle = useRef<HTMLLIElement>(null)

  darkTheme ? document.body.classList.add("dark-mode") : document.body.classList.remove("dark-mode");

  useEffect(()=>{
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks, darkTheme])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode) {
      setTasks(
        tasks.map((task) => {
          return task.id === editEleId ? { ...task, taskTitle: taskTitle } : task
        })
      )
      setTaskTitle("")
      setEditMode(false)
      return;
    }
    const task: TaskModule = {
      id: Date.now(),
      taskTitle: taskTitle,
      completed: false
    }

    if (taskTitle !== '') {
      setTasks(prevTasks => [
        ...prevTasks,
        task
      ])
      setTaskTitle("")
    }
  }

  const handleComplete = (id?: number) => {
    setTasks(
      tasks.map((task) => {
        return task.id === id ? { ...task, completed: !task.completed } : task
      })
    )
  }

  const clearCompleted = () => {
    const notCompleted: TaskModule[] = []
    tasks.map(task => {
      if (!task.completed) {
        notCompleted.push(task)
      }
    })
    setTasks(notCompleted)
    setCompleted([])
  }

  const handleDelete = (id?: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleEdit = (id?: number) => {
    setEditMode(true)
    taskTitleInput.current?.focus()
    setEditEleId(id)
    setTasks(
      tasks.map((task) => {
        return task.id === id ? { ...task, taskTitle: "" } : task
      })
    )
  }
  useEffect(() => {
    setCompleted(tasks.filter((task) => task.completed === true))
    setActive(tasks.filter((task) => task.completed === false))
  }, [tasks])

  useEffect(() => {
    if (state === "all") {
      allEle.current?.classList.add("active")
      setData(tasks)
    } else {
      allEle.current?.classList.remove("active")
    }
    if (state === "active") {
      activeEle.current?.classList.add("active")
      setData(active)
    } else {
      activeEle.current?.classList.remove("active")
    }
    if (state === "completed") {
      completedEle.current?.classList.add("active")
      setData(completed)
    } else {
      completedEle.current?.classList.remove("active")
    }
  }, [[], state, tasks])

  const dragItem = useRef<any>(null)
  const dragOverItem = useRef<any>(null)

  const dragStart = (index: number) => {
    dragItem.current = index;
  }

  const dragEnter = (index: number) => {
    dragOverItem.current = index;
  }

  const handleDrag = () => {
    const tasksItems: TaskModule[] = [...tasks]

    const dragedItem = tasksItems.splice(dragItem.current, 1)[0]

    const dragedOverItem = tasksItems.splice(dragOverItem.current, 1)[0]

    tasksItems.splice(dragOverItem.current, 0, dragedItem)

    tasksItems.splice(dragItem.current, 0, dragedOverItem)

    setTasks(tasksItems)
  }
  return (
    <>
      <div className='wrapped-img'>
        <img className='desktop-img' src={darkTheme ? desktopWrappedImgDark : desktopWrappedImgLight} alt="" />
        <img className='mobile-img' src={darkTheme ? mobilewrappedImgDark : mobileWrappedImgLight} alt="" />
      </div>
      <main>
        <div className='container'>
          <header>
            <h1>ToDo</h1>
            <button className="theme_toogle" onClick={() => setDarkTheme(!darkTheme)}>
              <img src={darkTheme ? sunIco : moonIco} alt="" />
            </button>
          </header>
          <form onSubmit={addTask}>
            <div className='input'>
              <span className='circle'></span>
              <input
                type="text"
                placeholder={editMode ? "Edit Task" : "Create a new Todo..."}
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                ref={taskTitleInput}
              />
            </div>
          </form>
          <div className='to-do-list'>
            <ul className='list'>
              {
                data.map((task, index) => {
                  return (
                    <Task
                      key={index}
                      index={index}
                      {...task}
                      handleComplete={handleComplete}
                      handleDelete={handleDelete}
                      dragStart={dragStart}
                      dragEnter={dragEnter}
                      handleDrag={handleDrag}
                      handleEdit={handleEdit}
                    />)
                })
              }
            </ul>
            <div className="options">
              <p>{completed.length > 0 ? tasks.length > completed.length ? tasks.length - completed.length : completed.length - tasks.length : tasks.length} Items Left</p>
              <div className='desktop-states'>
                <ul>
                  <li onClick={() => setState("all")} ref={allEle}>All</li>
                  <li onClick={() => setState("active")} ref={activeEle}>Active</li>
                  <li onClick={() => setState("completed")} ref={completedEle}>Completed</li>
                </ul>
              </div>
              <button className='clear' onClick={clearCompleted}>Clear Completed</button>
            </div>
          </div>
          <div className='mobile-states'>
            <ul>
              <li onClick={() => setState("all")} ref={allEle}>All</li>
              <li onClick={() => setState("active")} ref={activeEle}>Active</li>
              <li onClick={() => setState("completed")} ref={completedEle}>Completed</li>
            </ul>
          </div>
          <p className='drag-text'>Drag and drop to reorder list</p>
        </div>
      </main>
      <footer><p>Developed By <a href='https://github.com/OmarElbedwehy'>Omar Elbedwehy</a></p></footer>
    </>
  )
}

export default App
