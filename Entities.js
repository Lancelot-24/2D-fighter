import { context, canvas, player, enemy } from './index.js'
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
        this.hitbox.position.x = this.position.x
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

        if (this.readyToAttack) {
            this.attackDelayTimer++
        }

        if (this.readyToAttack && this.attackDelayTimer >= 90) {
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
        }
        else if (keys.d.pressed && lastKey == 'd' && this.velocity.x < maxVelocity) {
            if (this.velocity.x < -1)
                this.velocity.x -= acceleration * 4 * Math.sign(this.velocity.x)
            this.velocity.x += acceleration
        }
    }
}

export class EnemyEntity extends Entity {

    constructor({ position, velocity }) {
        super({ position, velocity })
        this.readyToAttack = false
        this.attackDelayTimer = 0
        this.actionTimer = 0
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
        this.hitbox.position.x = this.position.x - 50
        this.actionTimer++
        if (this.actionTimer >= 30) {
            let random = Math.floor(Math.random() * 2)
            this.actionTimer = 0

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
            else if (player.position.x >= this.position.x + 150
                || player.position.x <= this.position.x - 150) {
                this.velocity.x = 0
                this.movementBehaviour()
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
        this.velocity.x = getEntitySide(this) /2
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
            this.velocity.x += acceleration * 6
        else if (player.position.x < this.position.x)
            this.velocity.x += acceleration * 6 * -1
        
    }

    jumpBackwardsBehaviour() {
        //Enemy will jump backwards when in range of the player
        this.velocity.y = -10
        this.velocity.x = 5 * getEntitySide(this)


    }

    //Enemy delayed jump behaviour
    delayedJumpBehaviour() {
        //If the player jumps, there is a delay and then the enemy will also jump
        if (player.position.y + 10 < this.position.y && this.velocity.y == 0) {
            readyToJump = true
            console.log(player.position.y + "PLAYER")
            console.log(this.position.y + "ENEMY")
        }

        //If the enemy is ready to jump, and the delay timer is over, jump
        if (readyToJump && jumpDelayTimer >= 15) {
            jumpDelayTimer = 0
            readyToJump = false
            this.velocity.y = -14
        }

        //tick the delay timer
        if (readyToJump)
            jumpDelayTimer++
    }

}

function getEntitySide(entity) {
    if (entity.position.x > player.position.x)
        return 1
    else if (entity.position.x < player.position.x)
        return -1
}   