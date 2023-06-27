import {context, canvas, player, enemy} from './index.js'
import {keys, lastKey} from './InputManager.js'
//world Constants
const gravity = 0.6
const acceleration = 0.1
const maxVelocity = 5


//Delay timer for enemy jump
var jumpDelayTimer = 0
var readyToJump = false

//List of entities
 var entities = [] 
export function getEntities(){
    return entities
}
//Entity base class
export class Entity {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.start()
    }
    //Called every frame, visual representation of the entity
    draw() {
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, 50, this.height)
    }
    //Called on initialization
    start() {
        entities.push(this)
    }

    //Called every frame
    tick() {
        this.draw()
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if((this.position.y + this.height + this.velocity.y) >= canvas.height)
            this.velocity.y = 0
        else this.velocity.y += gravity
    }
}

//Player Entity class
export class PlayerEntity {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.start()
    }
    //Called every frame, visual representation of the entity
    draw() {
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, 50, this.height)
    }
    //Called on initialization
    start() {
        entities.push(this)
    }

    //Called every frame
    tick() {
        this.draw()
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if((this.position.y + this.height + this.velocity.y) >= canvas.height)
            this.velocity.y = 0
        else this.velocity.y += gravity

        this.playerMovement()
    }

    //Player Movement logic
    playerMovement() {
        if(!keys.a.pressed && !keys.d.pressed){
            if(this.velocity.x > 0.5 || this.velocity.x < -0.5)
                this.velocity.x -= acceleration*4 * Math.sign(this.velocity.x)
            else if((this.velocity.x < 0.5 || this.velocity.x > -0.5) )
                this.velocity.x = 0
        }

        if(keys.a.pressed && lastKey == 'a' && this.velocity.x > -maxVelocity) {
            if(this.velocity.x > 1)
                this.velocity.x -= acceleration*4 * Math.sign(this.velocity.x)
            this.velocity.x += acceleration * -1
        }
        else if(keys.d.pressed && lastKey == 'd' && this.velocity.x < maxVelocity) {
            if(this.velocity.x < -1)
                this.velocity.x -= acceleration*4 * Math.sign(this.velocity.x)
            this.velocity.x += acceleration
        }
    }
}

export class EnemyEntity extends Entity {

    constructor({ position, velocity }) {
        super({ position, velocity })
        
    }
    //Called every frame, visual representation of the entity
    draw() {
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, 50, this.height)
    }
    //Called on initialization
    start() {
        entities.push(this)
    }

    //Called every frame
    tick() {
        this.draw()
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if((this.position.y + this.height + this.velocity.y) >= canvas.height)
            this.velocity.y = 0
        else this.velocity.y += gravity
        let random = Math.floor(Math.random() * 3)
       
        switch (random){
            case 0:
                this.movementBehaviour()
            break
            case 1:
                this.delayedJumpBehaviour()
                break
            break
        }
        
    }

    //Enemy movement behaviour
    movementBehaviour() {
        //Enemmy will move towards the player
        if(player.position.x <= this.position.x + 75 && player.position.x >= this.position.x - 75){
            if(player.position.y <= this.position.y + 50 && player.position.y >= this.position.y - 50)
                this.velocity.x = 0
            else
                this.velocity.x -= acceleration*5 * Math.sign(this.velocity.x)
        }
        else if(player.position.x > this.position.x)
            this.velocity.x += acceleration/4
        else if(player.position.x < this.position.x)
            this.velocity.x += acceleration/4 * -1
    }
    
    //Enemy delayed jump behaviour
    delayedJumpBehaviour() {
        //If the player jumps, there is a delay and then the enemy will also jump
        if(player.position.y < this.position.y && this.velocity.y == 0)
            readyToJump = true
        
        //If the enemy is ready to jump, and the delay timer is over, jump
        if(readyToJump && jumpDelayTimer >= 15){
            jumpDelayTimer = 0
            readyToJump = false
            this.velocity.y = -14
        } 

        //tick the delay timer
        if(readyToJump)
            jumpDelayTimer++
    }
}