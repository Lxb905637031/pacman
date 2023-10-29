enum map {
  dots = 0,
  wall = 1,
  pacman = 4,
  emptySpace = 5,
  enemy = 6,
  powerDot = 7
}

enum moveDirection {
  up,
  down,
  left,
  right
}

enum moveAngle {
  right = 0,
  down = 1,
  left = 2,
  up = 3
}

export {
  map,
  moveDirection,
  moveAngle
}