import './index.css'

import gameOverVoice from './asset/sounds/gameOver.wav'
import gameWinVoice from './asset/sounds/gameWin.wav'

import TileSize from './TileMap'

// 瓦片宽度
const tileSize: number = 32
// 移动速度
const velocity: number = 2

const canvas = document.getElementsByClassName('game-canvas')[0] as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

let gameOver: boolean = false
let gameWin: boolean = false
const gameWinSound: HTMLAudioElement = new Audio(gameWinVoice)
const gameOverSound: HTMLAudioElement = new Audio(gameOverVoice)


const tileMap = new TileSize(tileSize)
const pacman = tileMap.getPacman(velocity)
const enemies = tileMap.getEnemy(velocity)

function pause() {
  return !pacman?.madeFirstMove || gameOver || gameWin
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver()
    if (gameOver) {
      gameOverSound.play()
    }
  }
}

function isGameOver() {
  return enemies.some(enemy => !pacman?.powerDotActive && enemy.collideWith(pacman!))
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin()
    if (gameWin) {
      gameWinSound.play()
    }
  }
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = ' You Win!'
    if (gameOver) {
      text = 'Game Over'
    }

    ctx.fillStyle = 'black'
    ctx.fillRect(0, canvas.height / 3.2, canvas.width, 80)

    ctx.font = '75px comic sans'
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, 'magenta')
    gradient.addColorStop(0.5, 'blue')
    gradient.addColorStop(1, 'red')

    ctx.fillStyle = gradient
    ctx.fillText(text, 10, canvas.height / 2)
  }
}

function gameLoop() {
  tileMap.draw(ctx)
  drawGameEnd()
  pacman!.draw(ctx, pause(), enemies)
  enemies.forEach((enemy) => enemy!.draw(ctx, pause(), pacman!))
  checkGameOver()
  checkGameWin()

  // requestAnimationFrame(gameLoop)
}

tileMap.init(canvas)

// gameLoop()

setInterval(gameLoop, 1000 / 75)