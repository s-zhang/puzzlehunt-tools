import { ConstraintSatifaction, ShapesConstraint, ConstraintCheckResult } from "../constraint"
import { Grid, Cell,  } from "./gridCell"
import { Property } from "../property";

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
        /*for (let i = 1; i <= SIDE_LENGTH; i++) {
            this.propertyNames.add(i.toString())
        }*/
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
    private _sudokuConstraint(cells : Cell[]) : ConstraintCheckResult {
        let numPropertiesSeen = 0
        let allCellsWithSameProperty : Cell[][] = [[], [], [], [], [], [], [], [], []]
        let violations = new Array<[Cell, Property]>()
        for (let cell of cells) {
            if (cell.property != null) {
                let index = Number(cell.property.name) - 1
                let cellsWithSameProperty = allCellsWithSameProperty[index]
                if (cellsWithSameProperty.length >= 1) {
                    violations.push([cell, cell.property])
                    if (cellsWithSameProperty.length == 1) {
                        violations.push([cellsWithSameProperty[0], cell.property])
                    }
                }
                cellsWithSameProperty.push(cell)
            }
        }
        return new ConstraintCheckResult(cells.length == SIDE_LENGTH && violations.length == 0, violations)
    }
}

function divmod(a : number, b : number) : [number, number] {
    let quotient = Math.floor(a / b)
    let remainder = a % b
    return [quotient, remainder]
}
