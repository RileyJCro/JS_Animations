document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId = null
  let score = 0

  // Shape definitions (colors should be in the same order as the shapes array)
  
  const colors = [
    'orange',
    'red',
    'purple',
    'yellow', 
    'cornflowerblue',
    'blue',
    'green'
  ]

  const lTet = [
    [width, width+1, width+2, 2],
    [1, width+1, width*2+1, width*2+2],
    [width, width+1, width+2, width*2],
    [0, 1, width+1, width*2+1]
  ]

  const zTet = [
    [0, 1, width+1, width+2],
    [width*2+1, width+1, width+2, 2],
    [width, width+1, width*2+1, width*2+2],
    [width*2+1, width+1, width+2, 2]
  ]

  const tTet = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTet = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]

  const iTet = [
    [width, width+1, width+2, width+3],
    [2, width+2, width*2+2, width*3+2],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1]
  ]

  const revLTet = [
    [0, width, width+1, width+2],
    [width*2+1, width+1, 1, 2],
    [0, 1, 2, width+2],
    [width*2, width*2+1, width+1, 1]
  ]

  const revZTet = [
    [width, width+1, 1, 2],
    [1, width+1, width+2, width*2+2],
    [width*2, width*2+1, width+1, width+2],
    [0, width, width+1, width*2+1]
  ]

  // Put the above shapes in their own array

  const shapes = [lTet, zTet, tTet, oTet, iTet, revLTet, revZTet]
  let currentPosition = 4
  let currentRotation = 0

  // Randomly select a shape and rotation

  let random = Math.floor(Math.random() * shapes.length)
  let current = shapes[random][currentRotation]

  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tet')
      // Assigns the colors to the shapes
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tet')
      // Removes the colors from the deleted shapes
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // Assign keycodes to the movement function

  function moveType(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keydown', moveType)

  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition +index].classList.add('taken'))
      random = nextRandom
      current = shapes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // Move left unless at the edge of the screen or there is another shape blocking it
  function moveLeft() {
    const leftEdge = current.some(index => (currentPosition + index) % width === 0)
    undraw()
    if (!leftEdge) currentPosition -= 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  // Move right unless at the edge of the screen or there is another shape blocking it
  function moveRight() {
    const rightEdge = current.some(index => (currentPosition + index) % width === width-1)
    undraw()
    if (!rightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  // Rotate the current shape (goes to the next rotation in the array)
  function rotate() {
    undraw()
    currentRotation++
    // Cycle back to the start of the array after the last index
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = shapes[random][currentRotation]
    draw()
  }

  // Show the next shape on the mini-grid
  const displaySquares = document.querySelectorAll(".mini-grid div")
  const displayWidth = 4
  let displayIndex = 0

  // Array of shapes without rotations
  const nextShapes = [
    [1, displayWidth+1, displayWidth*2+1, 2], // lTet
    [0, displayWidth, displayWidth+1, displayWidth*2+1], // zTet
    [1, displayWidth, displayWidth+1, displayWidth+2], // tTet
    [0, 1, displayWidth, displayWidth+1], // oTet
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], // iTet
    [0, displayWidth, displayWidth+1, displayWidth+2], // revLTet
    [displayWidth, displayWidth+1, 1, 2] // revZTet
  ]

  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tet')
      square.style.backgroundColor = ''
    })
    nextRandom = Math.floor(Math.random() * nextShapes.length)
    nextShapes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tet')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  // Set up the start and pause button
  startButton.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      displayShape()
    }
  })

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tet')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'Game Over'
      clearInterval(timerId)
    }
  }

})