import yellowDotIcon from '../asset/images/yellowDot.png'
import pinkDotIcon from '../asset/images/pinkDot.png'
import wallIcon from '../asset/images/wall.png'

import { 
  map
} from '../typings/type'

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
        let title = this.map[row][column]
        if (title === map.wall) {
          this.drawWall(ctx, column, row, this.tileSize)
        } else if (title === map.dots) {
          this.drawDot(ctx, column, row, this.tileSize)
        } else if (title === map.powerDot) {
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
}