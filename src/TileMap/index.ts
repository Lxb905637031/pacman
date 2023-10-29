import yellowDotIcon from '../asset/images/yellowDot.png'
import pinkDotIcon from '../asset/images/pinkDot.png'
import wallIcon from '../asset/images/wall.png'

import { 
  map, 
  moveDirection
} from '../typings/type'

import Pacman from '../Pacman'
import Enemy from '../Enemy'

export default class TileSize {
  tileSize: number
  yellowDot: HTMLImageElement
  pinkDot: HTMLImageElement
  wall: HTMLImageElement
  powerDot: HTMLImageElement
  powerDotAnimationDefaultTime: number = 30
  powerDotAnimationTimer: number

  map: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 7, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 6, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 7, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]

  constructor(tileSize: number) {
    this.tileSize = tileSize

    this.yellowDot = new Image()
    this.yellowDot.src = yellowDotIcon

    this.pinkDot = new Image()
    this.pinkDot.src = pinkDotIcon

    this.wall = new Image()
    this.wall.src = wallIcon

    this.powerDot = this.pinkDot
    this.powerDotAnimationTimer = this.powerDotAnimationDefaultTime
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column]
        if (tile === map.wall) {
          this.drawWall(ctx, column, row, this.tileSize)
        } else if (tile === map.dots) {
          this.drawDot(ctx, column, row, this.tileSize)
        } else if (tile === map.powerDot) {
          this.drawPowerDot(ctx, column, row, this.tileSize)
        }else {
          this.drawBlank(ctx, column, row, this.tileSize)
        }
      }
    }
  }

  init(canvas: HTMLCanvasElement) {
    canvas.width = this.map[0].length * this.tileSize
    canvas.height = this.map.length * this.tileSize
  }

  drawWall(ctx: CanvasRenderingContext2D, column: number, row: number, size: number) {
    ctx.drawImage(
      this.wall,
      column * size,
      row * size,
      size,
      size
    )
  }

  drawDot(ctx: CanvasRenderingContext2D, column: number, row: number, size: number) {
    ctx.drawImage(
      this.yellowDot,
      column * size,
      row * size,
      size,
      size
    )
  }

  drawPowerDot(ctx: CanvasRenderingContext2D, column: number, row: number, size: number) {
    this.powerDotAnimationTimer--
    if (this.powerDotAnimationTimer === 0) {
      this.powerDotAnimationTimer = this.powerDotAnimationDefaultTime
      this.powerDot = this.powerDot === this.pinkDot ? this.yellowDot : this.pinkDot
    }
    ctx.drawImage(
      this.powerDot,
      column * size,
      row * size,
      size,
      size
    )
  }

  drawBlank(ctx: CanvasRenderingContext2D, column: number, row: number, size: number) {
    ctx.fillStyle = 'black'
    ctx.fillRect(column * size, row * size, size, size)
  }

  getPacman(velocity: number) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column]
        if (tile === map.pacman) {
          return new Pacman(
            column * this.tileSize, 
            row * this.tileSize, 
            this.tileSize, 
            velocity, 
            this
          )
        }
      }
    }
  }

  getEnemy(velocity: number) {
    const enemies = []
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column]
        if (tile === map.enemy) {
          enemies.push(
            new Enemy(
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              velocity,
              this
            )
          )
        }
      }
    }

    return enemies
  }

  // 碰撞检测
  didCollideWithEnvironment(x: number, y: number, direction: moveDirection) {
    if (direction === null) return

    if (
      Number.isInteger(x / this.tileSize) &&
      Number.isInteger(y / this.tileSize)
    ) {
      let row = 0
      let column = 0
      let nextRow = 0
      let nextColumn = 0

      switch(direction) {
        case moveDirection.up:
          nextRow = y - this.tileSize
          row = nextRow / this.tileSize
          column = x / this.tileSize
          break
        case moveDirection.down:
          nextRow = y + this.tileSize
          row = nextRow / this.tileSize
          column = x / this.tileSize
          break
        case moveDirection.left:
          nextColumn = x - this.tileSize
          column = nextColumn / this.tileSize
          row = y / this.tileSize
          break
        case moveDirection.right:
          nextColumn = x + this.tileSize
          column = nextColumn / this.tileSize
          row = y / this.tileSize
          break
      }
      const tile = this.map[row][column]

      if (tile === 1) {
        return true
      }
      return false
    }
  }

  eatDot(x: number, y: number) {
    const row = y / this.tileSize
    const column = x / this.tileSize
    if (Number.isInteger(row) && Number.isInteger(column)) {
      if (this.map[row][column] === map.dots) {
        this.map[row][column] = map.emptySpace
        return true
      }
    }

    return false
  }

  eatPowerDot(x: number, y: number) {
    const row = y / this.tileSize
    const column = x / this.tileSize
    if (Number.isInteger(row) && Number.isInteger(column)) {
      if (this.map[row][column] === map.powerDot) {
        this.map[row][column] = map.emptySpace
        return true
      }
    }

    return false
  }
}