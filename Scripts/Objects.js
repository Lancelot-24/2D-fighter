import { context, canvas, player, enemy } from '../index.js'
import { keys, lastKey } from './InputManager.js'
import { GetEntitySide } from './Utils.js'
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
export function GetEntities() {
    return entities
}

//sprite base class
export class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1}) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc   
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0

        //aniamtion speed variables and timer
        this.framesElapsed = 0
        this.framesHold = 8

        this.flipSprite

        this.dontAnimate = false
    }
    //Called every frame, visual representation of the entity
    draw() {
        if(!this.flipSprite){
            context.drawImage(
                this.image, 
                this.frameCurrent * ( this.image.width/ this.framesMax), //the current frame
                0,
                this.image.width/ this.framesMax,
                this.image.height,
                this.position.x, 
                this.position.y, 
    
                this.image.width / this.framesMax * this.scale, 
                this.image.height * this.scale)
        }
        else{
            context.save()
            context.scale(-1, 1)
            context.drawImage(
                this.image, 
                this.frameCurrent * ( this.image.width/ this.framesMax), //the current frame
                0,
                this.image.width/ this.framesMax,
                this.image.height,
                -this.position.x - this.image.width / this.framesMax * this.scale, 
                this.position.y, 
    
                this.image.width / this.framesMax * this.scale, 
                this.image.height * this.scale)
            context.restore()
        }
       
        
    }

    //Called on initialization
    start() {
    }

    //Called every frame
    tick() {
        this.draw()

        this.framesElapsed++

        //Go through each sprite frame
        if(this.framesElapsed % this.framesHold == 0 && !this.dontAnimate){
            if(this.frameCurrent < this.framesMax - 1)
                this.frameCurrent++
            else
                this.frameCurrent = 0
        
        }
       
        
    }

}

//Entity base class
export class Entity {
    constructor({ position, velocity, sprites, spriteOffset = { x: 0, y: 0 } }) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 100
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
        
        this.spritesArr = sprites
        this.spriteOffset = {
            x: spriteOffset.x,
            y: spriteOffset.y
        }

        this.state = {
            idle: 0,
            run: 1,
            jump: 2,
            Attack: 3,
            Damaged: 4,
            Dead: 5
        }
        this.isMoving = false
        this.isJumping = false
        this.readyToAttack = false
        this.attackDelayTimer = 0
        this.start()
    }
    //Called every frame, visual representation of the entity
    draw() {
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
        this.spritesArr[this.state].position.x = this.position.x - this.spriteOffset.x
        this.spritesArr[this.state].position.y = this.position.y - this.spriteOffset.y
        this.spritesArr[this.state].tick()

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
        this.state = 0
    }

    //Called every frame
    tick() {
        this.draw()
        this.hitbox.position.y = this.position.y + 5

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if ((this.position.y + this.height + this.velocity.y) >= canvas.height -60){
            this.velocity.y = 0
            if(!this.isMoving && !this.isJumping && !this.readyToAttack)
                this.state = 0
            this.isJumping = false
        }
            
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
    constructor({ position, velocity, sprites, spriteOffset }) {
        super({ position, velocity, sprites, spriteOffset })
        
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
        if(this.health > 0){
            super.tick()
            this.playerMovement()

            this.hitbox.position.x = this.position.x - this.hitDirOffset

            if (this.readyToAttack) {
                this.attackDelayTimer++

                if(this.attackDelayTimer == 18)
                    this.attack(300)
            }

            if (this.readyToAttack && this.attackDelayTimer >= 55) {
                this.attackDelayTimer = 0
                this.readyToAttack = false
                this.hitEntity = false
            }
        }else{
            this.spritesArr[this.state].position.x = this.position.x - this.spriteOffset.x
            this.spritesArr[this.state].position.y = this.position.y - this.spriteOffset.y
            this.spritesArr[this.state].tick()
            if(this.spritesArr[this.state].frameCurrent == this.spritesArr[this.state].framesMax - 1){
                this.spritesArr[this.state].dontAnimate = true
                this.spritesArr[this.state].frameCurrent =  this.spritesArr[this.state].framesMax -1
            }
                
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
                this.isMoving = false
        }
        console.log(this.velocity.y)
        if (keys.a.pressed && lastKey == 'a' && this.velocity.x > -maxVelocity) {
            this.isMoving = true
            if (this.velocity.x > 1)
                this.velocity.x -= acceleration * 4 * Math.sign(this.velocity.x)
            this.velocity.x += acceleration * -1
            this.hitDirOffset = 50
            
        }
        else if (keys.d.pressed && lastKey == 'd' && this.velocity.x < maxVelocity) {
            this.isMoving = true
            if (this.velocity.x < -1)
                this.velocity.x -= acceleration * 4 * Math.sign(this.velocity.x)
            this.velocity.x += acceleration
            this.hitDirOffset = 0
        }

        if(!this.readyToAttack && this.velocity.y == 0 && this.isMoving)
                this.state = 1
            for(let i = 0; i < this.spritesArr.length; i++)
                this.spritesArr[i].flipSprite = lastKey == 'a' ? true : false
    }
}

export class EnemyEntity extends Entity {

    constructor({ position, velocity, sprites, spriteOffset }) {
        super({ position, velocity, sprites, spriteOffset })
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
        if (GetEntitySide(this, player) == -1)
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
        this.velocity.x = 5 * GetEntitySide(this, player)
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

