import { 
  moveDirection,
  moveAngle
} from '../typings/type'

import TileMap from '../TileMap'
import Enemy from '../Enemy'

import wakaVoice from '../asset/sounds/waka.wav'
import powerDotVoice from '../asset/sounds/power_dot.wav'
import eatGhostVoice from '../asset/sounds/eat_ghost.wav'

import close from '../asset/images/pac0.png'
import half from '../asset/images/pac1.png'
import open from '../asset/images/pac2.png'

export default class Pacman {
  x: number
  y: number
  tileSize: number
  velocity: number
  tileMap: TileMap

  currentMovingDirection: null | moveDirection
  requestedMovingDirection: null | moveDirection
  
  pacmanAnimationDefaultTimer = 20
  pacmanAnimationTimer: number | null

  pacmanRotation = moveAngle.right
  wakaSound: HTMLAudioElement

  powerDotSound: HTMLAudioElement
  powerDotActive: boolean
  powerDotAboutToExpire: boolean
  timers: any[] = []

  eatGhostSound: HTMLAudioElement

  madeFirstMove: boolean

  pacmanImage: HTMLImageElement[]

  pacmanImageIndex: number

  constructor(x: number, y: number, tileSize: number, velocity: number, tileMap: TileMap) {
    this.x = x
    this.y = y
    this.tileSize = tileSize
    this.velocity = velocity
    this.tileMap = tileMap

    this.currentMovingDirection = null
    this.requestedMovingDirection = null

    this.pacmanAnimationTimer = null

    this.wakaSound = new Audio(wakaVoice)

    this.powerDotSound = new Audio(powerDotVoice)
    this.powerDotActive = false
    this.powerDotAboutToExpire = false

    this.eatGhostSound = new Audio(eatGhostVoice)

    this.madeFirstMove = false

    this.pacmanImage = []
    this.pacmanImageIndex = 0

    this.loadPacmanImage()
  }

  loadPacmanImage() {
    const closeImage = new Image()
    closeImage.src = close

    const halfImage = new Image()
    halfImage.src = half

    const openImage = new Image()
    openImage.src = open

    this.pacmanImage = [
      closeImage,
      halfImage,
      openImage,
      halfImage
    ]

    this.pacmanImageIndex = 0
    this.eventBind()
  }

  draw(ctx: CanvasRenderingContext2D, isPause: boolean, enemies: Enemy[]) {

    if (!isPause) {
      this.animation()
      this.move()
    }

    this.eatDot()
    this.eatPowerDot()
    this.eatGhost(enemies)

    const size = this.tileSize / 2

    ctx.save()
    ctx.translate(this.x + size, this.y + size)
    ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180)
    ctx.drawImage(
      this.pacmanImage[this.pacmanImageIndex],
      -size,
      -size,
      this.tileSize,
      this.tileSize
    )

    ctx.restore()
  }

  animation() {
    if (this.pacmanAnimationTimer === null) {
      return
    }
    this.pacmanAnimationTimer--

    if (this.pacmanAnimationTimer === 0) {
      this.pacmanAnimationTimer = this.pacmanAnimationDefaultTimer
      this.pacmanImageIndex++
      if (this.pacmanImageIndex === this.pacmanImage.length) {
        this.pacmanImageIndex = 0
      }
    }
  }

  eventBind() {
    document.addEventListener('keydown', (e) => this.keydown(e), false)
  }

  keydown(e: KeyboardEvent) {
    if (e.code === 'ArrowUp') {
      if (this.currentMovingDirection === moveDirection.down) {
        this.currentMovingDirection = moveDirection.up
      }
      this.requestedMovingDirection = moveDirection.up
    }
    if (e.code === 'ArrowDown') {
      if (this.currentMovingDirection === moveDirection.up) {
        this.currentMovingDirection = moveDirection.down
      }
      this.requestedMovingDirection = moveDirection.down
    }
    if (e.code === 'ArrowLeft') {
      if (this.currentMovingDirection === moveDirection.right) {
        this.currentMovingDirection = moveDirection.left
      }
      this.requestedMovingDirection = moveDirection.left
    }
    if (e.code === 'ArrowRight') {
      if (this.currentMovingDirection === moveDirection.left) {
        this.currentMovingDirection = moveDirection.right
      }
      this.requestedMovingDirection = moveDirection.right
    }

    this.madeFirstMove = true
  }

  move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (!this.tileMap.didCollideWithEnvironment(
          this.x,
          this.y,
          this.requestedMovingDirection!
        )) {
          this.currentMovingDirection = this.requestedMovingDirection
        }
      }
    }
    
    if (
      this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.requestedMovingDirection!
      )
    ) {
      this.pacmanAnimationTimer = null
      this.pacmanImageIndex = 1
      return
    } else if (
      this.currentMovingDirection !== null &&
      this.pacmanAnimationTimer === null
    ) {
      this.pacmanAnimationTimer = this.pacmanAnimationDefaultTimer
    }

    switch(this.currentMovingDirection) {
      case moveDirection.up:
        this.y -= this.velocity
        this.pacmanRotation = moveAngle.up
        break
      case moveDirection.down:
        this.y += this.velocity
        this.pacmanRotation = moveAngle.down
        break
      case moveDirection.left:
        this.x -= this.velocity
        this.pacmanRotation = moveAngle.left
        break
      case moveDirection.right:
        this.x += this.velocity
        this.pacmanRotation = moveAngle.right
        break
    }
  }

  eatDot() {
    if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) {
      this.wakaSound.play()
    }
  }

  eatPowerDot() {
    if (this.tileMap.eatPowerDot(this.x, this.y)) {
      this.powerDotSound.play()
      this.powerDotActive = true
      this.powerDotAboutToExpire = false
      this.timers.forEach((timer) => clearTimeout(timer))
      this.timers = []

      let powerDotTimer = setTimeout(() => {
        this.powerDotActive = false
        this.powerDotAboutToExpire = false
      }, 1000 * 6)

      this.timers.push(powerDotTimer)

      let powerDotAboutToExpireTimer = setTimeout(() => {
        this.powerDotAboutToExpire = true
      }, 1000 * 3)

      this.timers.push(powerDotAboutToExpireTimer)
    }
  }

  eatGhost(enemies: Enemy[]) {
    if (this.powerDotActive) {
      const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this))
      collideEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1)
        this.eatGhostSound.play()
      })
    }
  }
}