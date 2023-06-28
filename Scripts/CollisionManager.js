import { PlayerEntity, EnemyEntity } from './Objects.js'
import { GetEntitySide } from './Utils.js'

export function DetectAttackCollision(firstEntity, secondEntity) {

    if (firstEntity.hitbox.position.x + firstEntity.hitbox.width >= secondEntity.position.x
        && firstEntity.hitbox.position.x <= secondEntity.hitbox.position.x + secondEntity.width
        && firstEntity.hitbox.position.y + firstEntity.hitbox.height >= secondEntity.position.y
        && firstEntity.hitbox.position.y <= secondEntity.position.y + secondEntity.height
        && firstEntity.isAttacking && !firstEntity.hitEntity) {
        
        secondEntity.state = 4
        secondEntity.velocity.x = 5* GetEntitySide(secondEntity, firstEntity)
        secondEntity.velocity.y = -10
        firstEntity.hitEntity = true
        secondEntity.health -= 10
        if(firstEntity instanceof PlayerEntity)
            document.querySelector('#enemyHealth').style.width = secondEntity.health + '%'
        else if(firstEntity instanceof EnemyEntity)
            document.querySelector('#playerHealth').style.width = secondEntity.health  + '%'
        return true
        
    }
    return false
}

