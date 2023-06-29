import { PlayerEntity, EnemyEntity } from './Objects.js'
import { GetEntitySide } from './Utils.js'

export function DetectAttackCollision(firstEntity, secondEntity) {

    if (firstEntity.hitbox.position.x + firstEntity.hitbox.width >= secondEntity.position.x
        && firstEntity.hitbox.position.x <= secondEntity.position.x + secondEntity.width
        && firstEntity.hitbox.position.y + firstEntity.hitbox.height >= secondEntity.position.y
        && firstEntity.hitbox.position.y <= secondEntity.position.y + secondEntity.height
        && firstEntity.isAttacking && !firstEntity.hitEntity) {
        //set the second entity state to being hit and trigger knock back
        secondEntity.state = 4
        secondEntity.velocity.x = 4 * GetEntitySide(secondEntity, firstEntity)
        secondEntity.velocity.y = -10
        firstEntity.hitEntity = true
        secondEntity.gotHit = true

        //decrease the second entity health
        secondEntity.health -= 10
        if (firstEntity instanceof PlayerEntity)
            gsap.to('#enemyHealth', {width: secondEntity.health + '%'})
        else if (firstEntity instanceof EnemyEntity)
            gsap.to('#playerHealth', {width: secondEntity.health + '%'})
        return true

    }
    return false
}

export function SeparateEntities(firstEntity, secondEntity) {
    // Calculate the bounding boxes of the entities
    const firstBox = {
        left: firstEntity.position.x,
        right: firstEntity.position.x + firstEntity.width,
        top: firstEntity.position.y,
        bottom: firstEntity.position.y + firstEntity.height
    };

    const secondBox = {
        left: secondEntity.position.x,
        right: secondEntity.position.x + secondEntity.width,
        top: secondEntity.position.y,
        bottom: secondEntity.position.y + secondEntity.height
    };

    // Calculate the overlap of the bounding boxes
    const overlapX = Math.max(0, Math.min(firstBox.right, secondBox.right) - Math.max(firstBox.left, secondBox.left));
    const overlapY = Math.max(0, Math.min(firstBox.bottom, secondBox.bottom) - Math.max(firstBox.top, secondBox.top));

    // Check if there is an overlap
    if (overlapX > 0 && overlapY > 0) {
        // Determine the direction of separation
        const separationX = overlapX / 2;
        const separationY = overlapY / 2;

        // Adjust the positions of the entities to separate them
        if (overlapY < overlapX) {
            // Separate in the vertical axis
            if (firstBox.bottom <= secondBox.top) {
                // If the first entity is above the second entity, adjust only the second entity's position
                secondEntity.position.y -= separationY;
            } else if (secondBox.bottom <= firstBox.top) {
                // If the second entity is above the first entity, adjust only the first entity's position
                firstEntity.position.y += separationY;
            } else {
                // If the entities are overlapping vertically, adjust both positions
                firstEntity.position.y -= separationY / 2;
                secondEntity.position.y += separationY / 2;
            }
        } else {
            // Separate in the horizontal axis
            if (firstBox.right <= secondBox.left) {
                // If the first entity is to the left of the second entity, adjust only the second entity's position
                secondEntity.position.x -= separationX;
            } else if (secondBox.right <= firstBox.left) {
                // If the second entity is to the left of the first entity, adjust only the first entity's position
                firstEntity.position.x += separationX;
            } else {
                // If the entities are overlapping horizontally, adjust both positions
                firstEntity.position.x -= separationX / 2;
                secondEntity.position.x += separationX / 2;
            }
        }
    }
}