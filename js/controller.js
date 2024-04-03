import { POMODORO } from "./pomooro.js"
import { TASK_CONTROLLER } from "./taskController.js"

const btnStart = document.querySelector('.control__btn_start')
const btnStop = document.querySelector('.control__btn_stop')
const btnNavigation = document.querySelector('.navigation')
const time_min = document.querySelector('.time__minutes')
const time_sec = document.querySelector('.time__seconds')


class Pomodoro_control{
    btnStart
    btnStop
    btnNavigation
    time_min
    time_sec
    constructor(btnStart, btnStop, btnNavigation, time_min, time_sec){
        this.btnStart = btnStart
        this.btnStop = btnStop
        this.btnNavigation = btnNavigation
        this.time_min = time_min
        this.time_sec = time_sec
    }
    initController(){
        this.setTimer()    
        this.btnStart.addEventListener('click',()=>{
            if(POMODORO.isPause){
                btnStart.textContent = 'Пауза'
                this.startPomodoro()
            }else{
                btnStart.textContent = 'Старт'
                this.pausePomodoro()
            }
        })
        this.btnStop.addEventListener('click',()=>{
            this.stopPomodoro()
        })
        this.btnNavigation.addEventListener('click',()=>{
            if(!event.target.dataset.use){
                return
            }
            btnNavigation.querySelector(`[data-use="${POMODORO.ACTIVE_STATE}"]`).classList.remove('navigation__btn_active')
            POMODORO.ACTIVE_STATE = event.target.dataset.use
            btnNavigation.querySelector(`[data-use="${POMODORO.ACTIVE_STATE}"]`).classList.add('navigation__btn_active')
            POMODORO.timerToLeft = POMODORO[POMODORO.ACTIVE_STATE] * 60
            this.setTimer()
        })
    }
    updatePomodoro(){
        clearInterval(POMODORO.timerID)
        btnNavigation.querySelector(`[data-use="${POMODORO.ACTIVE_STATE}"]`).classList.remove('navigation__btn_active')
        if(POMODORO.ACTIVE_STATE === 'WORK_time'){
            POMODORO.HOW_MANY_TIME_WORK += 1
            TASK_CONTROLLER.changeCount()
            
        }
        if(POMODORO.HOW_MANY_TIME_WORK !== 3 && POMODORO.ACTIVE_STATE === 'WORK_time'){
            POMODORO.ACTIVE_STATE = 'BREAK_time'
        }else if(POMODORO.HOW_MANY_TIME_WORK !== 3 && (POMODORO.ACTIVE_STATE === 'BREAK_time' || POMODORO.ACTIVE_STATE === 'RELAX_time')){
            POMODORO.ACTIVE_STATE = 'WORK_time'
        }else{
            POMODORO.ACTIVE_STATE = 'RELAX_time'
            POMODORO.HOW_MANY_TIME_WORK = 0
        }
        btnNavigation.querySelector(`[data-use="${POMODORO.ACTIVE_STATE}"]`).classList.add('navigation__btn_active')
        POMODORO.timerToLeft = POMODORO[POMODORO.ACTIVE_STATE] * 60
        this.setTimer()
        this.startPomodoro()
    }
    startPomodoro(){
        POMODORO.isPause = false
        POMODORO.timerID = setInterval(()=>{
            POMODORO.timerToLeft-=20
            this.setTimer()
            if(POMODORO.timerToLeft === 0){
                this.updatePomodoro()
            }
        },1000)
    }
    pausePomodoro(){
        POMODORO.isPause = true
        clearInterval(POMODORO.timerID)
        this.setTimer()
    }
    stopPomodoro(){
        btnStart.textContent = 'Старт'
        POMODORO.isPause = true
        clearInterval(POMODORO.timerID)
        POMODORO.timerToLeft = POMODORO[POMODORO.ACTIVE_STATE] * 60
        this.setTimer()
    }
    setTimer(){
        this.time_min.textContent = Math.floor(POMODORO.timerToLeft / 60) < 10 ? '0'+ Math.floor(POMODORO.timerToLeft / 60): Math.floor(POMODORO.timerToLeft / 60)
        this.time_sec.textContent = POMODORO.timerToLeft % 60 < 10 ? '0'+ POMODORO.timerToLeft % 60 : POMODORO.timerToLeft % 60
    }

}

const POMODORO_CONTROLLER = new Pomodoro_control(btnStart, btnStop,btnNavigation, time_min, time_sec)
export {POMODORO_CONTROLLER}