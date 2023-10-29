import { 
  moveDirection,
} from '../typings/type'

import TileMap from '../TileMap'

import ghostIcon from '../asset/images/ghost.png'
import scaredGhostIcon from '../asset/images/scaredGhost.png'
import scaredGhost2Icon from '../asset/images/scaredGhost2.png'

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default class Enemy {
  x: number
  y: number
  tileSize: number
  velocity: number
  tileMap: TileMap
  movingDirection =  Math.floor(
    Math.random() * Object.keys(moveDirection).length
  )
  directionTimerDefault = random(10, 25)

  directionTimer = this.directionTimerDefault

  scaredAboutToExpireTimerDefault = 10
  scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault

  normalGhost: HTMLImageElement
  scaredGhost: HTMLImageElement
  scaredGhost2: HTMLImageElement
  image: HTMLImageElement

  constructor(x: number, y: number, tileSize: number, velocity: number, tileMap: TileMap) {
    this.x = x
    this.y = y
    this.tileSize = tileSize
    this.velocity = velocity
    this.tileMap = tileMap

    this.normalGhost = new Image()
    this.scaredGhost = new Image()
    this.scaredGhost2 = new Image()
    this.image = new Image()

    this.loadImage()
  }

  loadImage() {

    this.normalGhost.src = ghostIcon
    this.scaredGhost.src = scaredGhostIcon
    this.scaredGhost2 = scaredGhost2Icon

    this.image = this.normalGhost
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.move()
    this.changeDirection()
    this.setImage(ctx)
  }

  setImage(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.tileSize,
      this.tileSize
    )
  }

  move() {
    if (
      !this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.movingDirection
      )
    ) {
      switch (this.movingDirection) {
        case moveDirection.up:
          this.y -= this.velocity;
          break;
        case moveDirection.down:
          this.y += this.velocity;
          break;
        case moveDirection.left:
          this.x -= this.velocity;
          break;
        case moveDirection.right:
          this.x += this.velocity;
          break;
      }
    }
  }

  changeDirection() {
    this.directionTimer--
    let newMoveDirection = null

    if (this.directionTimer === 0) {
      this.directionTimer = this.directionTimerDefault
      newMoveDirection =  Math.floor(
        Math.random() * Object.keys(moveDirection).length
      )
    }

    if (newMoveDirection !== null && this.movingDirection !== newMoveDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            newMoveDirection
          )
        ) {
          this.movingDirection = newMoveDirection
        }
      }
    }
  }
}