import { Entity, PlayerEntity, EnemyEntity, Sprite, getEntities } from './Scripts/Objects.js'
import { InputListeners } from './Scripts/InputManager.js'
import { DetectAttackCollision } from './Scripts/CollisionManager.js'
import { DecreaseTimer, timerId } from './Scripts/timer.js'

export const canvas = document.querySelector('canvas')
export const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

//Entity references
export const player = CreateEntityObject(PlayerEntity, { x: 0, y: 0 }, { x: 0, y: 0 })
export const enemy = CreateEntityObject(EnemyEntity, { x: 500, y: 0 }, { x: 0, y: 0 })

export const background = CreateSpriteObject(Sprite, { x: 0, y: 0 }, 1024, 576, './Assets/Backgrounds/image.png') 

//Function to spawn entities based on type
function CreateEntityObject(type, position, velocity) {
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

function CreateSpriteObject(type, position, width, height, imageSrc) {
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

//Called every frame
function Tick() {
    window.requestAnimationFrame(Tick)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    background.tick()
    getEntities().forEach(entity => {
        entity.tick()
    });

    InputListeners()
    DetectAttackCollision(player, enemy)
    DetectAttackCollision(enemy, player)

    if (enemy.health <= 0 || player.health <= 0) {
        GameResult({ player, enemy, timerId })
    }

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


Tick()
DecreaseTimer()