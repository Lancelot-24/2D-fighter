import { Entity, PlayerEntity, EnemyEntity, Sprite, GetEntities} from './Scripts/Objects.js'
import { InputListeners } from './Scripts/InputManager.js'
import { DetectAttackCollision } from './Scripts/CollisionManager.js'
import * as Utils from './Scripts/Utils.js'
import { timerId } from './Scripts/Utils.js'

export const canvas = document.querySelector('canvas')
export const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

//Entity references
export const player = Utils.CreateEntityObject(PlayerEntity, { x: 0, y: 0 }, { x: 0, y: 0 })
export const enemy = Utils.CreateEntityObject(EnemyEntity, { x: 500, y: 0 }, { x: 0, y: 0 })

//background reference
export const background = Utils.CreateSpriteObject(Sprite, { x: 0, y: 0 }, './Assets/Backgrounds/image without mist.png', 1.6525, 1) 

//shop item reference
export const shop = Utils.CreateSpriteObject(Sprite, { x: 600, y: 185 }, './Assets/Objects/shop_anim.png', 2.5, 6) 


//Called every frame
function Tick() {
    window.requestAnimationFrame(Tick)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    background.tick()
    shop.tick()
    GetEntities().forEach(entity => {
        entity.tick()
    });

    InputListeners()
    DetectAttackCollision(player, enemy)
    DetectAttackCollision(enemy, player)

    if (enemy.health <= 0 || player.health <= 0) {
        Utils.GameResult({ player, enemy, timerId})
    }

}

Tick()
Utils.DecreaseTimer()