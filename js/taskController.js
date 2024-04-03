import { POMODORO_CONTROLLER } from "./controller.js"
import { LOCAL_STORAGE_component } from "./localStorage.js"

const tasksList = document.querySelector('.todo__list')
const addTaskBtn = document.querySelector('.todo__add')
const titleElem = document.querySelector('.title')
const countPomodoro = document.querySelector('.count_num')

class TaskController{
    activeTaskId = null
    ROOT_element
    btnController
    title
    count
    constructor(root, btnController, title, count){
        this.ROOT_element = root
        this.btnController = btnController
        this.title = title
        this.count = count
    }
    initController(){
        this.btnController.addEventListener('click',()=>{
            const task = prompt('Add new Task').trim()
            if(task){
                this.ROOT_element.prepend(this.addNewTask(task, true))
            }
        })
        const pomodoroTasks = LOCAL_STORAGE_component.getItem('pomodoroTasks')
        if(pomodoroTasks){
            this.render(pomodoroTasks)
        }
    }
    render(taskArray){
       const elems = taskArray.map((item)=>{
            return this.addNewTask(item)
       }).reverse()
       this.ROOT_element.prepend(...elems)
       this.chooseTask(taskArray[taskArray.length-1].id, taskArray[taskArray.length-1].title, taskArray[taskArray.length-1].pomodoroCount)
    }
    addNewTask(task, isNewTask = false){
        const newTask = isNewTask ? this.createTask(task) : task
        const taskItem = document.createElement('li')
        taskItem.dataset.taskId = newTask.id
        taskItem.className = 'todo__item'
        taskItem.innerHTML = `
         <div class="todo__item-wrapper"></div>
         `
        const btnChoose = document.createElement('button')
        btnChoose.className = 'todo__btn'
        btnChoose.textContent = newTask.title
        btnChoose.addEventListener('click', ()=>{
            this.chooseTask(newTask.id, newTask.title)
        })

        const btnEdit = document.createElement('button')
        btnEdit.className = 'todo__edit'
        btnEdit.setAttribute('aria-label', 'Редактировать')
        btnEdit.addEventListener('click',()=>{
            btnChoose.textContent = this.editTask(newTask.id)
        })

        const btnDel = document.createElement('button')
        btnDel.className = 'todo__del'
        btnDel.setAttribute('aria-label', 'Удалить')
        btnDel.addEventListener('click', ()=>{
            this.deleteTask(newTask.id)
            taskItem.remove()
        })

        taskItem.querySelector('.todo__item-wrapper').append(btnChoose, btnEdit,btnDel)
        return taskItem
    }
    createTask(task){
        const taskLocal = LOCAL_STORAGE_component.getItem('pomodoroTasks')
        const newTask = {id:Math.random().toString(16).substring(2,8),
                    title:task,
                    pomodoroCount:0}
        if(taskLocal){
            taskLocal.push(newTask)
            LOCAL_STORAGE_component.setItem('pomodoroTasks', taskLocal)
        }else{
            LOCAL_STORAGE_component.setItem('pomodoroTasks', [newTask])
        }
        return newTask
    }
    chooseTask(id, titleText, countPomodoro){
        this.activeTaskId = id
        this.count.textContent = countPomodoro ? countPomodoro : LOCAL_STORAGE_component.getItem('pomodoroTasks').find((el)=>el.id===this.activeTaskId).pomodoroCount
        this.title.textContent = titleText
        POMODORO_CONTROLLER.stopPomodoro()
    }
    changeCount(){
        const pomodoroList = LOCAL_STORAGE_component.getItem('pomodoroTasks')
        for(let i = 0 ; i < pomodoroList.length; i++){
            if(this.activeTaskId === pomodoroList[i].id){
                pomodoroList[i].pomodoroCount += 1
                LOCAL_STORAGE_component.setItem('pomodoroTasks', pomodoroList)
                break
            }
        }
    }
    editTask(id){
        let newTitle = null
        const taskLocal = LOCAL_STORAGE_component.getItem('pomodoroTasks')
        if(taskLocal){
            for(let i = 0; i< taskLocal.length; i++){
                if(taskLocal[i].id === id){
                    const task = prompt(`Change Task: ${taskLocal[i].title}`)
                    if(task){
                        taskLocal[i].title = task.trim()
                    }
                    newTitle = taskLocal[i].title
                    break
                }
            }    
        LOCAL_STORAGE_component.setItem('pomodoroTasks', taskLocal)
        }
        return newTitle
    }
    deleteTask(id){
        const taskLocal = LOCAL_STORAGE_component.getItem('pomodoroTasks')
        if(taskLocal){
            let i = null
            taskLocal.find((elem, index)=> {
            if(elem.id === id){
                i = index
            }
            })
            taskLocal.splice(i,1)
            LOCAL_STORAGE_component.setItem('pomodoroTasks', taskLocal)
        }
    }
}

const TASK_CONTROLLER = new TaskController(tasksList, addTaskBtn, titleElem, countPomodoro)
export {TASK_CONTROLLER}