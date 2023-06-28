import { Entity, PlayerEntity, EnemyEntity, getEntities } from './Scripts/Entities.js'
import { InputListeners } from './Scripts/InputManager.js'
import { DetectAttackCollision } from './Scripts/CollisionManager.js'

export const canvas = document.querySelector('canvas')
export const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

//Entity references
export let player, enemy

//Function to spawn entities based on type
function SpawnEntity(type, position, velocity) {
    let entity = null
    switch (type) {
        case Entity:
            entity = new Entity({
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
            entity = new PlayerEntity({
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
            entity = new EnemyEntity({
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

    return entity
}

//Initialization function
function Init() {
    player = SpawnEntity(PlayerEntity, { x: 0, y: 0 }, { x: 0, y: 0 })
    enemy = SpawnEntity(EnemyEntity, { x: 500, y: 0 }, { x: 0, y: 0 })

    //Object.freeze(player)
    //Object.freeze(enemy)
}

//Called every frame
function Tick() {
    window.requestAnimationFrame(Tick)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    getEntities().forEach(entity => {
        entity.tick()
    });

    InputListeners()
    DetectAttackCollision(player, enemy)
    DetectAttackCollision(enemy, player)

}

Init()
Tick()