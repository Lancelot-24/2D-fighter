import { GameResult, player, enemy } from '../index.js'


let timer = 60
export let timerId
export function DecreaseTimer(){
    if(timer > 0){
        timerId = setTimeout(DecreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    else 
        GameResult({player, enemy, timerId})
        
        
}

