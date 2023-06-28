import { Entity, PlayerEntity, EnemyEntity, getEntities } from './Entities.js'

export function DetectAttackCollision(firstEntity, secondEntity) {

    if (firstEntity.hitbox.position.x + firstEntity.hitbox.width >= secondEntity.position.x
        && firstEntity.hitbox.position.x <= secondEntity.hitbox.position.x + secondEntity.width
        && firstEntity.hitbox.position.y + firstEntity.hitbox.height >= secondEntity.position.y
        && firstEntity.hitbox.position.y <= secondEntity.position.y + secondEntity.height
        && firstEntity.isAttacking && !firstEntity.hitEntity) {

        firstEntity.hitEntity = true
    }
}
