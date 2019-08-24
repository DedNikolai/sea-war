// cells array initialization and fill

let enemyCells  = []

for (let i = 0; i < 10; i++) {
    let flag = []
    for (let j = 0; j < 10; j++) {
        let enemyCell = new Cell(TYPE.NONE)
        flag.push(enemyCell)
    }

    enemyCells.push(flag)
}


let enemyBoard = {
    four: [],
    three_1: [],
    three_2: [],
    two_1: [],
    two_2: [],
    two_3: [],
    one: [],
}

let enemyCount = 0

// functiom for fill some ship

function fillEnemyShip(shipSize, shipType, cellsList, addedClass) {
    while (true) {
        let dir = directions[Math.round(Math.random())]
        let start_i, start_j

        if (dir === DIRECTION.HORIZONTAL) {
            start_i = Math.round(Math.random() * 9)
            start_j = Math.round(Math.random() * (10-shipSize))
        } else {
            start_i = Math.round(Math.random() * (10-shipSize))
            start_j = Math.round(Math.random() * 9)
        }

        if (!enemyFilled(start_i, start_j, dir, shipSize) && enemyCells[start_i][start_j].type == TYPE.NONE) {

            let cellNumber = start_i * 10 + start_j
            cellsList[cellNumber].classList.add(addedClass)
            enemyCells[start_i][start_j].type = shipType
            fillEnemyBoard(enemyCount, start_i, start_j)
            enemyCount++

            if (shipSize == 1) {
                blockEnemyNeighbors(start_i, start_j, CELL_TYPE.START, dir)
                blockEnemyNeighbors(start_i, start_j, CELL_TYPE.END, dir)
            } else {
                blockEnemyNeighbors(start_i, start_j, CELL_TYPE.START, dir)
            }

            for (let i = 1; i < shipSize; i++) {
                let type = (i == shipSize-1) ? CELL_TYPE.END : CELL_TYPE.MID

                if (dir === DIRECTION.HORIZONTAL) {
                    cellNumber = start_i * 10 + start_j + i
                    enemyCells[start_i][start_j + i].type = shipType
                    blockEnemyNeighbors(start_i, start_j+i, type, dir)
                    fillEnemyBoard(enemyCount, start_i, start_j+i)

                } else {
                    cellNumber = (start_i + i) * 10 + start_j
                    enemyCells[start_i + i][start_j].type = shipType
                    blockEnemyNeighbors(start_i+i, start_j, type, dir)
                    fillEnemyBoard(enemyCount, start_i + i, start_j)
                }
                cellsList[cellNumber].classList.add(addedClass)
                enemyCount++
            }

            break
        }
    }
}

// function for check if cell is filled

function enemyFilled(x, y, dir, count) {
    let i = x+count
    let j = y+count
    if (dir === DIRECTION.VERTICAL) {
        for (x; x < i; x++) {
            if (enemyCells[x][y].type !== TYPE.NONE) {
                return true
            }
        }
    } else {
        for ( y; y < j; y++) {
            if (enemyCells[x][y].type !== TYPE.NONE) {
                return true
            }
        }
    }

    return false
}

// function for block neibour cells

function blockEnemyNeighbors(x, y, type, dir) {
    if (dir === DIRECTION.HORIZONTAL) {

        if (x !== 0) {
            enemyCells[x-1][y].type = TYPE.BLOCKED
        }

        if (x !== 9) {
            enemyCells[x+1][y].type = TYPE.BLOCKED
        }

        if (type === CELL_TYPE.START && y != 0) {
            enemyCells[x][y-1].type = TYPE.BLOCKED


            if (x != 0 && x != 9) {
                enemyCells[x-1][y-1].type = TYPE.BLOCKED
                enemyCells[x+1][y-1].type = TYPE.BLOCKED
            }

            if (x == 0) {
                enemyCells[x+1][y-1].type = TYPE.BLOCKED
            }

            if (x == 9) {
                enemyCells[x-1][y-1].type = TYPE.BLOCKED
            }
        }

        if (type === CELL_TYPE.END && y !== 9) {
            enemyCells[x][y+1].type = TYPE.BLOCKED

            if (x != 0 && x != 9) {
                enemyCells[x-1][y+1].type = TYPE.BLOCKED
                enemyCells[x+1][y+1].type = TYPE.BLOCKED
            }

            if (x == 0) {
                enemyCells[x+1][y+1].type = TYPE.BLOCKED
            }

            if (x == 9) {
                enemyCells[x-1][y+1].type = TYPE.BLOCKED
            }
        }
    } else {

        if (y !== 0) {
            enemyCells[x][y-1].type = TYPE.BLOCKED
        }

        if (y !== 9) {
            enemyCells[x][y+1].type = TYPE.BLOCKED
        }

        if (type === CELL_TYPE.START && x !== 0) {
            enemyCells[x-1][y].type = TYPE.BLOCKED

            if (y != 0 && y != 9) {
                enemyCells[x-1][y-1].type = TYPE.BLOCKED
                enemyCells[x-1][y+1].type = TYPE.BLOCKED
            }

            if (y == 0) {
                enemyCells[x-1][y+1].type = TYPE.BLOCKED
            }

            if (y == 9) {
                enemyCells[x-1][y-1].type = TYPE.BLOCKED
            }
        }

        if (type === CELL_TYPE.END && x !== 9) {
            enemyCells[x+1][y].type = TYPE.BLOCKED

            if (y != 0 && y != 9) {
                enemyCells[x+1][y-1].type = TYPE.BLOCKED
                enemyCells[x+1][y+1].type = TYPE.BLOCKED
            }

            if (y == 0) {
                enemyCells[x+1][y+1].type = TYPE.BLOCKED
            }

            if (y == 9) {
                enemyCells[x+1][y-1].type = TYPE.BLOCKED
            }
        }
    }
}

// function for fill all ships on board

function fillAllEnemyShips(cellsList, addedClass) {
    let types = [TYPE.FOUR, TYPE.THREE, TYPE.TWO, TYPE.ONE]
    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < i + 1; j++) {
            fillEnemyShip(types.length - i, types[i], cellsList, addedClass)
        }
    }
}

//fill enemyBoard

function fillEnemyBoard(count, i, j) {
    if (count < 4) enemyBoard.four.push(enemyCells[i][j])
    if (count >= 4 && count < 7) enemyBoard.three_1.push(enemyCells[i][j])
    if (count >=7 && count < 10) enemyBoard.three_2.push(enemyCells[i][j])
    if (count >=10 && count < 12) enemyBoard.two_1.push(enemyCells[i][j])
    if (count >= 12 && count < 14) enemyBoard.two_2.push(enemyCells[i][j])
    if (count >= 14 && count < 16) enemyBoard.two_3.push(enemyCells[i][j])
    if (count >= 16) enemyBoard.one.push(enemyCells[i][j])
}

// fill all ships

let enemyCellsList = document.body.querySelectorAll('.enemy_board > .row > .cell')
let enemyShipClass = 'enemy-ship'

fillAllEnemyShips(enemyCellsList, enemyShipClass)
