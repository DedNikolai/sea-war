// useful constants

const TYPE = {
    FOUR: 'FOURTH',
    THREE: 'THREE',
    TWO: 'TWO',
    ONE: 'ONE',
    NONE: 'NONE',
    BLOCKED: 'BLOCKED'
}

const CELL_TYPE = {
    START: 'START',
    END: 'END',
    MID: 'MID'
}

const DIRECTION = {
    VERTICAL: 'VERTICAL',
    HORIZONTAL: 'HORIZONTAL'
}

// make one cell as object

function Cell (type) {
    this.type = type
    this.isOpen = false
    this.killed = false
}

// cells array initialization adn fil

let myCells  = []

for (let i = 0; i < 10; i++) {
    let temp = []
    for (let j = 0; j < 10; j++) {
        let myCell = new Cell(TYPE.NONE)
        temp.push(myCell)
    }

    myCells.push(temp)
}

let directions = [DIRECTION.VERTICAL, DIRECTION.HORIZONTAL]

let myBoard = {
    four: [],
    three_1: [],
    three_2: [],
    two_1: [],
    two_2: [],
    two_3: [],
    one: [],
}

let myCount = 0

// functiom for fill some ship

function fillMyShip(shipSize, shipType, cellsList, addedClass) {
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


        if (!filled(start_i, start_j, dir, shipSize) && myCells[start_i][start_j].type == TYPE.NONE) {

            let cellNumber = start_i * 10 + start_j
            cellsList[cellNumber].classList.add(addedClass)
            myCells[start_i][start_j].type = shipType
            fillGameBoord(myCount, start_i, start_j)
            myCount++

            if (shipSize == 1) {
                blockNeighbors(start_i, start_j, CELL_TYPE.START, dir)
                blockNeighbors(start_i, start_j, CELL_TYPE.END, dir)
            } else {
                blockNeighbors(start_i, start_j, CELL_TYPE.START, dir)
            }

            for (let i = 1; i < shipSize; i++) {
                let type = (i == shipSize-1) ? CELL_TYPE.END : CELL_TYPE.MID

                if (dir === DIRECTION.HORIZONTAL) {
                    cellNumber = start_i * 10 + start_j + i
                    myCells[start_i][start_j + i].type = shipType
                    blockNeighbors(start_i, start_j+i, type, dir)
                    fillGameBoord(myCount, start_i, start_j+i)

                } else {
                    cellNumber = (start_i + i) * 10 + start_j
                    myCells[start_i + i][start_j].type = shipType
                    blockNeighbors(start_i+i, start_j, type, dir)
                    fillGameBoord(myCount, start_i + i, start_j)
                }
                cellsList[cellNumber].classList.add(addedClass)
                myCount++
            }

            break
        }
    }
}

// function for check if cell is filled

function filled(x, y, dir, count) {
    let i = x+count
    let j = y+count
    if (dir === DIRECTION.VERTICAL) {
        for (x; x < i; x++) {
            if (myCells[x][y].type !== TYPE.NONE) {
                return true
            }
        }
    } else {
        for ( y; y < j; y++) {
            if (myCells[x][y].type !== TYPE.NONE) {
                return true
            }
        }
    }

    return false
}

// function for block neibour cells

function blockNeighbors(x, y, type, dir) {
    if (dir === DIRECTION.HORIZONTAL) {

        if (x !== 0) {
            myCells[x-1][y].type = TYPE.BLOCKED
        }

        if (x !== 9) {
            myCells[x+1][y].type = TYPE.BLOCKED
        }

        if (type === CELL_TYPE.START && y != 0) {
            myCells[x][y-1].type = TYPE.BLOCKED


            if (x != 0 && x != 9) {
                myCells[x-1][y-1].type = TYPE.BLOCKED
                myCells[x+1][y-1].type = TYPE.BLOCKED
            }
            
            if (x == 0) {
                myCells[x+1][y-1].type = TYPE.BLOCKED
            }
            
            if (x == 9) {
                myCells[x-1][y-1].type = TYPE.BLOCKED
            }
        }

        if (type === CELL_TYPE.END && y !== 9) {
            myCells[x][y+1].type = TYPE.BLOCKED

            if (x != 0 && x != 9) {
                myCells[x-1][y+1].type = TYPE.BLOCKED
                myCells[x+1][y+1].type = TYPE.BLOCKED
            }

            if (x == 0) {
                myCells[x+1][y+1].type = TYPE.BLOCKED
            }

            if (x == 9) {
                myCells[x-1][y+1].type = TYPE.BLOCKED
            }
        }
    } else {

        if (y !== 0) {
            myCells[x][y-1].type = TYPE.BLOCKED
        }

        if (y !== 9) {
            myCells[x][y+1].type = TYPE.BLOCKED
        }

        if (type === CELL_TYPE.START && x !== 0) {
            myCells[x-1][y].type = TYPE.BLOCKED

            if (y != 0 && y != 9) {
                myCells[x-1][y-1].type = TYPE.BLOCKED
                myCells[x-1][y+1].type = TYPE.BLOCKED
            }

            if (y == 0) {
                myCells[x-1][y+1].type = TYPE.BLOCKED
            }
            
            if (y == 9) {
                myCells[x-1][y-1].type = TYPE.BLOCKED
            }
        }

        if (type === CELL_TYPE.END && x !== 9) {
            myCells[x+1][y].type = TYPE.BLOCKED
            
            if (y != 0 && y != 9) {
                myCells[x+1][y-1].type = TYPE.BLOCKED
                myCells[x+1][y+1].type = TYPE.BLOCKED
            }

            if (y == 0) {
                myCells[x+1][y+1].type = TYPE.BLOCKED
            }

            if (y == 9) {
                myCells[x+1][y-1].type = TYPE.BLOCKED
            }
        }
    }
}

// function for fill all ships on board

function fillAllShips(cellsList, addedClass) {
    let types = [TYPE.FOUR, TYPE.THREE, TYPE.TWO, TYPE.ONE]
    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < i + 1; j++) {
            fillMyShip(types.length - i, types[i], cellsList, addedClass)
        }
    }
}

// fill myBoard

function fillGameBoord(count, i, j) {
    if (count < 4) myBoard.four.push(myCells[i][j])
    if (count >= 4 && count < 7) myBoard.three_1.push(myCells[i][j])
    if (count >=7 && count < 10) myBoard.three_2.push(myCells[i][j])
    if (count >=10 && count < 12) myBoard.two_1.push(myCells[i][j])
    if (count >= 12 && count < 14) myBoard.two_2.push(myCells[i][j])
    if (count >= 14 && count < 16) myBoard.two_3.push(myCells[i][j])
    if (count >= 16) myBoard.one.push(myCells[i][j])
}

// fill all ships

let myCellsList = document.body.querySelectorAll('.my_board > .row > .cell')
let myShipClass = 'ship'

fillAllShips(myCellsList, myShipClass)


