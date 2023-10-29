import './index.css'

import TileSize from './TileMap'
import Pacman from './Pacman'

// 瓦片宽度
const tileSize: number = 32
// 移动速度
const velocity: number = 2

const canvas = document.getElementsByClassName('game-canvas')[0] as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

let gameOver: boolean = false
let gameWin: boolean = false

const tileMap = new TileSize(tileSize)
const pacman = tileMap.getPacman(velocity)

function gameLoop() {
  tileMap.init(canvas)
  tileMap.draw(ctx)
  pacman!.draw(ctx)
  requestAnimationFrame(gameLoop)
}

gameLoop()
