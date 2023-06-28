import { context, canvas, player, enemy } from '../index.js'
import { keys, lastKey } from './InputManager.js'
//world Constants
const gravity = 0.6
const acceleration = 0.1
const maxVelocity = 5


//Delay timer for enemy jump
var jumpDelayTimer = 0
var readyToJump = false

//List of entities
var entities = []

//Get entities
export function getEntities() {
    return entities
}

//sprite base class
export class Sprite {
    constructor({ position, width, height, imageSrc }) {
        this.position = position
        this.width = width
        this.height = height
        this.image = new Image()
        this.image.src = imageSrc   
        
    }
    //Called every frame, visual representation of the entity
    draw() {
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    //Called on initialization
    start() {
    }

    //Called every frame
    tick() {
        this.draw()
        
    }

}

//Entity base class
export class Entity {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 100,
            height: 50
        }
        this.isAttacking
        this.hitEntity
        this.health = 100
        this.hitDirOffset = 0

        this.start()
    }
    //Called every frame, visual representation of the entity
    draw() {
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)

        if (this.isAttacking) {
            //hitbox
            context.fillStyle = 'blue'
            context.fillRect(
                this.hitbox.position.x,
                this.hitbox.position.y,
                this.hitbox.width,
                this.hitbox.height)
        }
    }

    //Called on initialization
    start() {
        entities.push(this)
    }

    //Called every frame
    tick() {
        this.draw()
        this.hitbox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if ((this.position.y + this.height + this.velocity.y) >= canvas.height)
            this.velocity.y = 0
        else this.velocity.y += gravity
    }

    //Attack logic
    attack(delay) {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, delay);
    }
}

//Player Entity class
export class PlayerEntity extends Entity {
    constructor({ position, velocity }) {
        super({ position, velocity })
        this.readyToAttack = false
        this.attackDelayTimer = 0
    }
    //Called every frame, visual representation of the entity
    draw() {
        super.draw()
    }
    //Called on initialization
    start() {
        super.start()
    }

    //Called every frame
    tick() {
        super.tick()
        this.playerMovement()

        this.hitbox.position.x = this.position.x - this.hitDirOffset

        if (this.readyToAttack) {
            this.attackDelayTimer++
        }

        if (this.readyToAttack && this.attackDelayTimer >= 30) {
            this.attackDelayTimer = 0
            this.readyToAttack = false
            this.hitEntity = false
        }
    }

    //Attack logic
    attack(delay) {
        super.attack(delay)
    }

    //Player Movement logic
    playerMovement() {
        if (!keys.a.pressed && !keys.d.pressed) {
            if (this.velocity.x > 0.5 || this.velocity.x < -0.5)
                this.velocity.x -= acceleration * 4 * Math.sign(this.velocity.x)
            else if ((this.velocity.x < 0.5 || this.velocity.x > -0.5))
                this.velocity.x = 0
        }
        if (keys.a.pressed && lastKey == 'a' && this.velocity.x > -maxVelocity) {
            if (this.velocity.x > 1)
                this.velocity.x -= acceleration * 4 * Math.sign(this.velocity.x)
            this.velocity.x += acceleration * -1
            this.hitDirOffset = 50
        }
        else if (keys.d.pressed && lastKey == 'd' && this.velocity.x < maxVelocity) {
            if (this.velocity.x < -1)
                this.velocity.x -= acceleration * 4 * Math.sign(this.velocity.x)
            this.velocity.x += acceleration
            this.hitDirOffset = 0
        }
    }
}

export class EnemyEntity extends Entity {

    constructor({ position, velocity }) {
        super({ position, velocity })
        this.readyToAttack = false
        this.attackDelayTimer = 0
        this.actionTimer = 0
        this.backwardJumped
    }
    //Called every frame, visual representation of the entity
    draw() {
        super.draw()
        if (this.isAttacking) {
            //hitbox
            context.fillStyle = 'blue'
            context.fillRect(
                this.hitbox.position.x,
                this.hitbox.position.y,
                this.hitbox.width,
                this.hitbox.height)
        }
    }
    //Called on initialization
    start() {
        super.start()
    }

    //Called every frame
    tick() {
        super.tick()
        if (getEntitySide(this, player) == -1)
            this.hitbox.position.x = this.position.x
        else
            this.hitbox.position.x = this.position.x - 50

        this.actionTimer++

        //Delay timer for enemy actions
        if (this.actionTimer >= 30) {
            let random = Math.floor(Math.random() * 2)
            this.actionTimer = 0

            //If player is within range either attack or jump backwards
            if (player.position.x <= this.position.x + 75 && player.position.x >= this.position.x - 75) {
                this.velocity.x = 0
                switch (random) {
                    case 0:
                        this.jumpBackwardsBehaviour()
                        break
                    case 1:
                        if (!this.readyToAttack) {
                            this.readyToAttack = true
                            this.attack(500)
                        }
                        break
                }
            }
            //if player is outside of attack range move towards player and jump when they jump
            else if (player.position.x >= this.position.x + 150
                || player.position.x <= this.position.x - 150) {
                if (this.backwardJumped) {
                    this.velocity.x = 0
                    this.backwardJumped = false
                }
                else
                    this.velocity.x -= acceleration * 5 * Math.sign(this.velocity.x)//this.velocity.x = 0
                switch (random) {
                    case 0:
                        this.movementBehaviour()
                        break
                    case 1:
                        this.delayedJumpBehaviour()
                        break
                }
            }
            else {
                switch (random) {
                    case 0:
                        this.movementBehaviour()
                        break
                    case 1:
                        this.delayedJumpBehaviour()
                        break
                }
            }
        }

        //timer for attack cooldown
        if (this.readyToAttack)
            this.attackDelayTimer++

        //reset attack cooldown  
        if (this.readyToAttack && this.attackDelayTimer >= 90) {
            this.hitEntity = false
            this.attackDelayTimer = 0
            this.readyToAttack = false
        }
    }

    attack(delay) {
        this.velocity.x = 0
        super.attack(delay)
    }

    //Enemy movement behaviour
    movementBehaviour() {
        if (player.position.x <= this.position.x + 75 && player.position.x >= this.position.x - 75) {
            if (player.position.y <= this.position.y + 50 && player.position.y >= this.position.y - 50)
                this.velocity.x = 0
        }
        else
            this.velocity.x -= acceleration * 5 * Math.sign(this.velocity.x)
        //Enemmy will move towards the player
        if (player.position.x > this.position.x)
            this.velocity.x += acceleration * 12
        else if (player.position.x < this.position.x)
            this.velocity.x += acceleration * 12 * -1

    }

    jumpBackwardsBehaviour() {
        //Enemy will jump backwards when in range of the player
        this.velocity.x = 0
        this.velocity.y = -10
        this.velocity.x = 5 * getEntitySide(this, player)
        this.backwardJumped = true


    }

    //Enemy delayed jump behaviour
    delayedJumpBehaviour() {
        //If the enemy hasn't jumped, jump
        if (!readyToJump) {
            this.velocity.y = -14
            readyToJump = true
        }

        //if delay is over, reset the delay timer
        if (readyToJump && jumpDelayTimer >= 15) {
            jumpDelayTimer = 0
            readyToJump = false
        }

        //tick the delay timer
        if (readyToJump)
            jumpDelayTimer++
    }

}

function getEntitySide(firstEntity, secondEntity) {
    if (firstEntity.position.x > secondEntity.position.x)
        return 1
    else if (firstEntity.position.x < secondEntity.position.x)
        return -1
}   