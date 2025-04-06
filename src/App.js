import React, { useEffect, useRef, useState } from 'react';
import { Gantt } from './bryntum-gantt-trial/build/gantt.module.js';
import './bryntum-gantt-trial/build/gantt.stockholm.css';

let idCounter = 4; // Unique counter for task IDs, assuming initial tasks use IDs 1-3

const App = () => {
    const ganttRef = useRef(null);
    const [tasks, setTasks] = useState([
        {
            id: 1,
            name: 'Order 1',
            startDate: '2023-11-01',
            duration: 10,
            children: [
                { id: 2, name: 'Origin', startDate: '2023-11-01', duration: 5, color: 'orange' },
                { id: 3, name: 'Destination', startDate: '2023-11-06', duration: 5, color: 'blue' }
            ]
        }
    ]);

    useEffect(() => {
        const gantt = new Gantt({
            appendTo: ganttRef.current,
            columns: [
                { type: 'name', text: 'Task', field: 'name', width: 200 },
                { type: 'startdate', text: 'Start Date', field: 'startDate' },
                { type: 'duration', text: 'Duration', field: 'duration', unit: 'day' }
            ],
            tasks: tasks,
        });

        return () => gantt.destroy();
    }, [tasks]);

    const addTask = () => {
        const newTask = {
            id: idCounter++, // Ensure unique ID for the main task
            name: `Order ${idCounter}`,
            startDate: '2023-11-10',
            duration: 5,
            children: [
                { id: idCounter++, name: 'Origin', startDate: '2023-11-10', duration: 3, color: 'green' },
                { id: idCounter++, name: 'Destination', startDate: '2023-11-13', duration: 2, color: 'red' }
            ]
        };

        setTasks([...tasks, newTask]);
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
    };

    window.addEventListener('error', event => {
        if (event.message === 'ResizeObserver loop completed with undelivered notifications.') {
            event.stopImmediatePropagation();
        }
    });

    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    useEffect(() => {
        const resizeObserver = new ResizeObserver(
            debounce(() => {
                // Optional: Add specific resize logic here if needed
            }, 100)
        );

        if (ganttRef.current) {
            resizeObserver.observe(ganttRef.current);
        }

        return () => {
            try {
                resizeObserver.disconnect();
            } catch (error) {
                console.warn("ResizeObserver was not cleanly disconnected:", error);
            }
        };
    }, []);

    return (
        <div>
            <h1>Order Gantt Chart</h1>
            <div ref={ganttRef} style={{ height: '600px' }}></div>
            <div>
                <button onClick={addTask}>Add Task</button>
                <button onClick={() => deleteTask(1)}>Delete Order 1</button>
            </div>
        </div>
    );
};

export default App;
