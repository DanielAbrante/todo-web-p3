import { createContext, useCallback, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import TaskService from "../services/task.service";

export const TasksContext = createContext({});

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const axiosInstance = useAxios();

  const getTasks = useCallback(async () => {
    try {
      const taskService = new TaskService(axiosInstance);
      const taskList = await taskService.getAll();
      setTasks(taskList);
    } catch (error) {}
  }, [axiosInstance]);

  const addTask = useCallback(
    async (task) => {
      const tasksCopy = [...tasks];
      try {
        const taskService = new TaskService(axiosInstance);
        const newTask = await taskService.add(task);
        tasksCopy.push(newTask);
        setTasks(tasksCopy);
      } catch (error) {
        alert("não foi possivel adicionar a tarefa");
      }
    },
    [axiosInstance, tasks]
  );

  const updateTask = useCallback(
    async (task) => {
      const tasksCopy = [...tasks];
      const index = tasksCopy.findIndex((t) => t._id === task._id);
      if (index === -1) {
        return;
      }
      try {
        const taskService = new TaskService(axiosInstance);
        await taskService.update(task);
        Object.assign(tasksCopy[index], task);
        setTasks(tasksCopy);
      } catch (error) {
        alert("não foi possivel atualizar a tarefa");
      }
    },
    [axiosInstance, tasks]
  );

  const removeTask = useCallback(
    async (id) => {
      const tasksCopy = [...tasks];
      const index = tasksCopy.findIndex((t) => t._id === id);
      if (index === -1) {
        return;
      }
      try {
        const taskService = new TaskService(axiosInstance);
        await taskService.delete(id);
        tasksCopy.splice(index, 1);
        setTasks(tasksCopy);
      } catch (error) {
        alert("não foi possivel remover a tarefa");
      }
    },
    [axiosInstance, tasks]
  );

  return (
    <TasksContext.Provider
      value={{
        tasks,
        getTasks,
        addTask,
        updateTask,
        removeTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
