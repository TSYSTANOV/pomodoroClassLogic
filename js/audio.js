import { POMODORO } from "./pomooro.js"

class AudioPlayer{
    audio = null
    isAudioPlay = false
    initAudio(param){
        switch (param){
            case 'BREAK_time':
                this.audio = new Audio('../audio/august.mp3')
                this.audio.play()
                this.isAudioPlay = true
            break
            case 'RELAX_time':
                this.audio = new Audio('../audio/dudu.mp3')
                this.audio.play()
                this.isAudioPlay = true
            break
            case 'WORK_time':
                if(this.audio)
                {   this.isAudioPlay = false
                    this.audio.pause()
                }
            break
        }
    }
    stopAudio(){
        this.isAudioPlay = false
        if(this.audio){
            this.audio.pause()
        }
    }
}

const AUDIO_CONTROLLER = new AudioPlayer()
export {AUDIO_CONTROLLER}
