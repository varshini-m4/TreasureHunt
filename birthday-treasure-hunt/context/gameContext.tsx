import React,{
createContext,
useContext,
useState
} from "react";

import {tasks as initialTasks} from "../data/tasks";

const GameContext=createContext<any>(null);

export const GameProvider=({children}:any)=>{

const [taskList,setTaskList]=useState(initialTasks);

const completeTask=(id:number)=>{

setTaskList((prev:any)=>

prev.map((task:any)=>

task.id===id

?{...task,completed:true}

:task

)

);

};

return(

<GameContext.Provider
value={{
taskList,
completeTask
}}
>

{children}

</GameContext.Provider>

);

};

export const useGame=()=>useContext(GameContext);