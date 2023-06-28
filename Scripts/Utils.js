import { player, enemy } from '../index.js'
import { Entity, PlayerEntity, EnemyEntity, Sprite} from './Objects.js'

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



export function GameResult({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#resultText').style.display = 'flex'

    if (player.health === enemy.health)
        document.querySelector('#resultText').innerHTML = 'Tie'
    else if (player.health > enemy.health)
        document.querySelector('#resultText').innerHTML = 'Win'
    else
        document.querySelector('#resultText').innerHTML = 'Lose'

}

//Function to spawn entities based on type
export function CreateEntityObject(type, position, velocity) {
    let object = null
    switch (type) {
        case Entity:
            object = new Entity({
                position: {
                    x: position.x,
                    y: position.y
                },
                velocity: {
                    x: velocity.x,
                    y: velocity.y
                }
            })
            break
        case PlayerEntity:
            object = new PlayerEntity({
                position: {
                    x: position.x,
                    y: position.y
                },
                velocity: {
                    x: velocity.x,
                    y: velocity.y
                }
            })
            break
        case EnemyEntity:
            object = new EnemyEntity({
                position: {
                    x: position.x,
                    y: position.y
                },
                velocity: {
                    x: velocity.x,
                    y: velocity.y
                }
            })
            break
       
    }

    return object
}

export function CreateSpriteObject(type, position, width, height, imageSrc) {
    let object = null
    switch (type) {
    case Sprite:
        object = new Sprite({
            position: {
                x: position.x,
                y: position.y
            },
            width: width,
            height: height,
            imageSrc: imageSrc
        })
        break
    }
    return object

}

 export function GetEntitySide(firstEntity, secondEntity) {
    if (firstEntity.position.x > secondEntity.position.x)
        return 1
    else if (firstEntity.position.x < secondEntity.position.x)
        return -1
}   