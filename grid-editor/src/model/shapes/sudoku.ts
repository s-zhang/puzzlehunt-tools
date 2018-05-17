import { ConstraintSatifaction, ShapesConstraint } from "../constraint"
import { Grid, Cell,  } from "./gridCell"

const SIDE_LENGTH = 9
const BLOCK_LENGTH = 3

export class SudokuGrid extends Grid {
    constructor() {
        super(SIDE_LENGTH, SIDE_LENGTH)
        this._blocks = new Array<Array<Cell>>(SIDE_LENGTH)
        for (let i = 0; i < SIDE_LENGTH; i++) {
            this._blocks[i] = new Array<Cell>(SIDE_LENGTH)
            for (let j = 0; j < SIDE_LENGTH; j++) {
                let [blockI, blockJ] = divmod(i, BLOCK_LENGTH)
                let [cellI, cellJ] = divmod(j, BLOCK_LENGTH)
                let row = blockI * BLOCK_LENGTH + cellI
                let column = blockJ * BLOCK_LENGTH + cellJ
                this._blocks[i][j] = this.rows[row][column]
            }
        }
        for (let i = 1; i <= SIDE_LENGTH; i++) {
            this.propertyNames.add(i.toString())
        }
        this.addRowConstraint(this._sudokuConstraint)
        this.addColumnConstraint(this._sudokuConstraint)
        for (let block of this.blocks) {
            this.constraints.push(new ShapesConstraint<Cell>(block, this._sudokuConstraint))
        }
    }
    private _blocks : Cell[][]
    get blocks(): Cell[][] {
        return this._blocks
    }
    private _sudokuConstraint(cells : Cell[]) : ConstraintSatifaction {
        let numPropertyNamesSeen = 0
        let propertyNamesSeen = [false, false, false, false, false, false, false, false, false]
        for (let cell of cells) {
            if (cell.property != null) {
                let index = Number(cell.property.name) - 1
                if (propertyNamesSeen[index]) {
                    return ConstraintSatifaction.Unsatisfiable
                } else {
                    propertyNamesSeen[index] = true
                    numPropertyNamesSeen++
                }
            }
        }
        return numPropertyNamesSeen == SIDE_LENGTH ? ConstraintSatifaction.Satisfied : ConstraintSatifaction.NotSatisfied
    }
}

function divmod(a : number, b : number) : [number, number] {
    let quotient = Math.floor(a / b)
    let remainder = a % b
    return [quotient, remainder]
}
