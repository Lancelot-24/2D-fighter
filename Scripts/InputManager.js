import { player } from '../index.js'

//Player input keys
export const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    }
}
export let lastKey


//input listeners
export function InputListeners() {
    window.addEventListener('keydown', (event) => {
        if(player.health > 0){
            switch (event.key) {
                case 'a':
                    keys.a.pressed = true
                    lastKey = 'a'
                    break
                case 'd':
                    keys.d.pressed = true
                    lastKey = 'd'
                    break
                case 'w':
                    keys.w.pressed = true
                    if (player.velocity.y == 0) {
                        player.state = 2
                        player.velocity.y = -16
                        player.isJumping = true
                    }
                    break
                case 'l':
                    if (!player.readyToAttack) {
                        player.state = 3
                        player.readyToAttack = true
                       
                    }
                    break
            }
        }

    })
    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'a':
                keys.a.pressed = false
                break
            case 'd':
                keys.d.pressed = false
                break
            case 'w':
                keys.w.pressed = false
                break
        }

    })
}