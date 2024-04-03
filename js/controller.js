import { AUDIO_CONTROLLER } from "./audio.js"
import { POMODORO } from "./pomooro.js"
import { TASK_CONTROLLER } from "./taskController.js"

const btnStart = document.querySelector('.control__btn_start')
const btnStop = document.querySelector('.control__btn_stop')
const btnNavigation = document.querySelector('.navigation')
const time_min = document.querySelector('.time__minutes')
const time_sec = document.querySelector('.time__seconds')
const titleMain = document.querySelector('title')


class Pomodoro_control{
    btnStart
    btnStop
    btnNavigation
    time_min
    time_sec
    titleMainPage
    constructor(btnStart, btnStop, btnNavigation, time_min, time_sec, titleMain){
        this.btnStart = btnStart
        this.btnStop = btnStop
        this.btnNavigation = btnNavigation
        this.time_min = time_min
        this.time_sec = time_sec
        this.titleMainPage = titleMain
    }
    initController(){
        this.setTimer()    
        this.btnStart.addEventListener('click',()=>{
            if(TASK_CONTROLLER.activeTaskId === null){
                return
            }
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
            this.stopPomodoro()
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
        AUDIO_CONTROLLER.initAudio(POMODORO.ACTIVE_STATE)
        POMODORO.isPause = false
        POMODORO.timerID = setInterval(()=>{
            POMODORO.timerToLeft-=1
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
        AUDIO_CONTROLLER.stopAudio()
    }
    stopPomodoro(){
        btnStart.textContent = 'Старт'
        POMODORO.isPause = true
        clearInterval(POMODORO.timerID)
        POMODORO.timerToLeft = POMODORO[POMODORO.ACTIVE_STATE] * 60
        this.setTimer()
        AUDIO_CONTROLLER.stopAudio()
    }
    setTimer(){
        this.time_min.textContent = Math.floor(POMODORO.timerToLeft / 60) < 10 ? '0'+ Math.floor(POMODORO.timerToLeft / 60): Math.floor(POMODORO.timerToLeft / 60)
        this.time_sec.textContent = POMODORO.timerToLeft % 60 < 10 ? '0'+ POMODORO.timerToLeft % 60 : POMODORO.timerToLeft % 60
        this.titleMainPage.textContent = `${this.time_min.textContent}:${this.time_sec.textContent}`
    }

}

const POMODORO_CONTROLLER = new Pomodoro_control(btnStart, btnStop,btnNavigation, time_min, time_sec, titleMain)
export {POMODORO_CONTROLLER}