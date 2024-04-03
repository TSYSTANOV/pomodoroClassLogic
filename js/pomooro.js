class Pomodoro{
    WORK_time = 1
    BREAK_time = 2
    RELAX_time = 3
    HOW_MANY_TIME_WORK = 0
    isPause = true
    ACTIVE_STATE = 'WORK_time'
    timerToLeft = this[this.ACTIVE_STATE] * 60
    timerID = null
    get isPause(){
        return this.isPause
    }
    set isPause(param){
        this.isPause = param
    }
    set HOW_MANY_TIME_WORK(number){
        this.HOW_MANY_TIME_WORK = number
    }
    get HOW_MANY_TIME_WORK(){
        return this.HOW_MANY_TIME_WORK
    }
}

const POMODORO = new Pomodoro()
export {POMODORO}