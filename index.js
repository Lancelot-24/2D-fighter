import { Entity, PlayerEntity, EnemyEntity, Sprite, GetEntities} from './Scripts/Objects.js'
import { InputListeners } from './Scripts/InputManager.js'
import { DetectAttackCollision } from './Scripts/CollisionManager.js'
import * as Utils from './Scripts/Utils.js'

export const canvas = document.querySelector('canvas')
export const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

//Entity references
export const player = Utils.CreateEntityObject(PlayerEntity, { x: 0, y: 0 }, { x: 0, y: 0 })
export const enemy = Utils.CreateEntityObject(EnemyEntity, { x: 500, y: 0 }, { x: 0, y: 0 })

export const background = Utils.CreateSpriteObject(Sprite, { x: 0, y: 0 }, 1024, 576, './Assets/Backgrounds/image.png') 



//Called every frame
function Tick() {
    window.requestAnimationFrame(Tick)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    background.tick()
    GetEntities().forEach(entity => {
        entity.tick()
    });

    InputListeners()
    DetectAttackCollision(player, enemy)
    DetectAttackCollision(enemy, player)

    if (enemy.health <= 0 || player.health <= 0) {
        Utils.GameResult({ player, enemy, timerId })
    }

}

Tick()
Utils.DecreaseTimer()