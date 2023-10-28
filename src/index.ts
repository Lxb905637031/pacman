import './index.css'

import TileSize from './TileMap'

// 瓦片宽度
const tileSize: number = 32
// 移动速度
const velocity: number = 2

const canvas = document.getElementsByClassName('game-canvas')[0] as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

let gameOver: boolean = false
let gameWin: boolean = false

const tileMap = new TileSize(tileSize)

function gameLoop() {
  tileMap.init(canvas)
  tileMap.draw(ctx)

  requestAnimationFrame(gameLoop)
}

gameLoop()


