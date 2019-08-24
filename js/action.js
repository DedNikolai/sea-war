let isMyShoot = true
let timerId
//onClock event (my shoot)
let listOfCells =  document.body.querySelectorAll('.enemy_board > .row > .cell')

listOfCells.forEach(cell => {
    cell.onclick = e => {
        if (isMyShoot) {
            e.target.innerText = 'x'
            e.target.classList.add('marked')
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    let num = i*10 + j
                    if (enemyCellsList[num].classList.contains('marked'))  {
                        if (enemyCells[i][j].type != TYPE.NONE && enemyCells[i][j].type != TYPE.BLOCKED) {
                            e.target.classList.add('shooted')
                            isMyShoot = true
                        } else {
                            e.target.classList.add('open')
                            isMyShoot = false
                        }
                    }
                }
            }
            e.target.classList.remove('marked')

            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    let number = i*10 + j
                    let classes = ['shooted', 'open', 'killed']
                    if (classes.some(className => enemyCellsList[number].classList.contains(className))) {
                        enemyCells[i][j].isOpen = true
                    }
                }
            }
            for (key in enemyBoard) {
                let list = enemyBoard[`${key}`]
                let counter = 0;
                list.forEach(item => {
                    if (item.isOpen) {
                        if (item.type == TYPE.ONE) {
                            item.killed = true
                            let index = list.indexOf(item)
                            list.splice(index, 1)
                            list.length ? enemyBoard[`${key}`] = list : delete enemyBoard[`${key}`]
                        } else {
                            counter++
                        }
                    }
                })

                if (counter == list.length) {
                    list.forEach(item => item.killed = true)
                    delete enemyBoard[`${key}`]
                }
            }

            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    let number = i*10 + j
                    if (enemyCells[i][j].killed) {
                      enemyCellsList[number].classList.add('killed')
                    }
                }
            }

            isGameOver()

            if (!isMyShoot) {
                timerId = setInterval(enemyShoot, 2000)
            }
        }
    }
})

// enemy shoot function

enemyShoot = () => {
    let cellNumber
    let i, j

    if (possibleCells.length == 0) {
        let temp = [true, false, true, true]
        let rand = Math.round(Math.random()*4)
        if (temp[rand]) {
            while (true) {
                i = Math.round(Math.random()*9)
                j = Math.round(Math.random()*9)
                cellNumber = i*10 + j

                if (blockedCellNumbers.indexOf(cellNumber) == -1) {
                    blockedCellNumbers.push(cellNumber)
                    break
                }
            }
        } else {
            while (true) {
                i = Math.round(Math.random()*9)
                j = Math.round(Math.random()*9)
                cellNumber = i*10 + j

                if (blockedCellNumbers.indexOf(cellNumber) == -1 && myCells[i][j].type != TYPE.NONE && myCells[i][j].type != TYPE.BLOCKED && !myCells[i][j].isOpen && !myCells[i][j].killed) {
                    blockedCellNumbers.push(cellNumber)
                    break
                }
            }
        }
    } else {
        let random = Math.round(Math.random()*(possibleCells.length-1))
        i = possibleCells[random].i
        j = possibleCells[random].j
        cellNumber = i*10 + j
        blockedCellNumbers.push(cellNumber)
        possibleCells.splice(random, 1)
    }



    myCellsList[cellNumber].innerText = 'x'
    if (myCellsList[cellNumber].classList.contains('ship')) {
        isMyShoot = false
        myCellsList[cellNumber].classList.add('shooted')
        shootedCells.push({i: i, j: j})
        addPotencialPoints()
    } else {
        isMyShoot = true
        myCellsList[cellNumber].classList.add('open')
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let number = i*10 + j
            let classes = ['shooted', 'open', 'killed']
            if (classes.some(className => myCellsList[number].classList.contains(className))) {
                myCells[i][j].isOpen = true
            }
        }
    }
    for (key in myBoard) {
        let list = myBoard[`${key}`]
        let counter = 0;
        list.forEach(item => {
            if (item.isOpen) {
                if (item.type == TYPE.ONE) {
                    let index = list.indexOf(item)
                    list.splice(index, 1)
                    list.length ? myBoard[`${key}`] = list : delete myBoard[`${key}`]
                    item.killed = true
                    shootedCells.forEach(cell => {
                        blockAllNeighbors(cell)
                    })
                    possibleCells = []
                    shootedCells = []
                    currentShipDirection = false
                } else {
                    counter++
                }
            }
        })

        if (counter == list.length) {
            list.forEach(item => item.killed = true)
            delete myBoard[`${key}`]
            shootedCells.forEach(cell => {
                blockAllNeighbors(cell)
            })
            possibleCells = []
            shootedCells = []
            currentShipDirection = false

        }
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let number = i*10 + j
            if (myCells[i][j].killed) {
                myCellsList[number].classList.add('killed')
            }
        }
    }

    isGameOver()

    if (isMyShoot) clearInterval(timerId)
}

//variables for enemy shoot

let blockedCellNumbers = []
let possibleCells = []
let currentShipDirection = false
let shootedCells = []

//choose points for enemy shoot

addPotencialPoints = () => {
    if (shootedCells.length == 1) {
        let i = shootedCells[0].i
        let j = shootedCells[0].j
        if (i != 0 && !myCells[i-1][j].isOpen) {
            let number = (i-1)*10 + j
            if (blockedCellNumbers.indexOf(number) == -1) {
                possibleCells.push({i: i-1, j: j})
            }
        }

        if (j != 0 && !myCells[i][j-1].isOpen) {
            let number = i*10 + j-1
            if (blockedCellNumbers.indexOf(number) == -1) {
                possibleCells.push({i: i, j: j-1})
            }
        }

        if (i != 9 && !myCells[i + 1][j].isOpen) {
            let number = (i+1)*10 + j
            if (blockedCellNumbers.indexOf(number) == -1) {
                possibleCells.push({i: i+1, j: j})
            }
        }

        if (j != 9 && !myCells[i][j + 1].isOpen) {
            let number = i*10 + (j+1)
            if (blockedCellNumbers.indexOf(number) == -1) {
                possibleCells.push({i: i, j: j+1})
            }
        }
    } else {
        currentShipDirection = shootedCells[0].i - shootedCells[1].i == 0 ? DIRECTION.HORIZONTAL : DIRECTION.VERTICAL

        if (currentShipDirection == DIRECTION.HORIZONTAL) {
            possibleCells = []
            shootedCells.forEach(cell => {
                let i = cell.i
                let j = cell.j
                if (j != 0 && !myCells[i][j-1].isOpen) {
                    let number = i*10 + j-1
                    if (blockedCellNumbers.indexOf(number) == -1) {
                        possibleCells.push({i: i, j: j-1})
                    }
                }

                if (j != 9 && !myCells[i][j + 1].isOpen) {
                    let number = i*10 + (j+1)
                    if (blockedCellNumbers.indexOf(number) == -1) {
                        possibleCells.push({i: i, j: j+1})
                    }
                }
            })
        }

        if (currentShipDirection == DIRECTION.VERTICAL) {
            possibleCells = []
            shootedCells.forEach(cell => {
                let i = cell.i
                let j = cell.j
                if (i != 0 && !myCells[i-1][j].isOpen) {
                    let number = (i-1)*10 + j
                    if (blockedCellNumbers.indexOf(number) == -1) {
                        possibleCells.push({i: i-1, j: j})
                    }
                }

                if (i != 9 && !myCells[i + 1][j].isOpen) {
                    let number = (i+1)*10 + j
                    if (blockedCellNumbers.indexOf(number) == -1) {
                        possibleCells.push({i: i+1, j: j})
                    }
                }
            })
        }
    }
}

// block neighbors of killed ships

blockAllNeighbors = (cell) => {
    let i = cell.i
    let j = cell.j

    if (i != 0) {
        let number = (i-1)*10 + j
        if (blockedCellNumbers.indexOf(number) == -1) {
            blockedCellNumbers.push(number)
        }
    }

    if (j != 0) {
        let number = i*10 + j-1
        if (blockedCellNumbers.indexOf(number) == -1) {
            blockedCellNumbers.push(number)
        }
    }

    if (i != 9) {
        let number = (i+1)*10 + j
        if (blockedCellNumbers.indexOf(number) == -1) {
            blockedCellNumbers.push(number)
        }
    }

    if (j != 9) {
        let number = i*10 + (j+1)
        if (blockedCellNumbers.indexOf(number) == -1) {
            blockedCellNumbers.push(number)
        }
    }

    if (i != 0 && j != 0) {
        let number = (i-1)*10 + j-1
        if (blockedCellNumbers.indexOf(number) == -1) {
            blockedCellNumbers.push(number)
        }
    }

    if (i != 0 && j != 9) {
        let number = (i-1)*10 + j+1
        if (blockedCellNumbers.indexOf(number) == -1) {
            blockedCellNumbers.push(number)
        }
    }

    if (i != 9 && j != 0) {
        let number = (i+1)*10 + j-1
        if (blockedCellNumbers.indexOf(number) == -1) {
            blockedCellNumbers.push(number)
        }
    }

    if (i != 9 && j != 9) {
        let number = (i+1)*10 + j+1
        if (blockedCellNumbers.indexOf(number) == -1) {
            blockedCellNumbers.push(number)
        }
    }
}

// is game over

isGameOver = () => {
    let enemyCount = 0
    let myCount = 0

    for (key in myBoard) {
        myCount++
    }

    for (key in enemyBoard) {
        enemyCount++
    }

    if (!myCount) {
        document.body.querySelector('.game-over').classList.add('game-over__true')
        document.body.querySelector('.game-over_img').classList.add('lose_img')
        document.body.querySelector('.game-over-txt').innerHTML = 'Sorry, you loser!!!'
        clearInterval(timerId)
    }

    if (!enemyCount) {
        document.body.querySelector('.game-over').classList.add('game-over__true')
        document.body.querySelector('.game-over_img').classList.add('win_img')
        document.body.querySelector('.game-over-txt').innerHTML = 'Congretulate, you won!!!'
        clearInterval(timerId)
    }
}

// restart game
document.body.querySelector('.restart_btn').onclick = () => {
    location.reload()
}