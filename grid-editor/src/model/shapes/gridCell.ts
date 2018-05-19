import { ConstraintSatifaction, ShapesConstraint, ConstraintCheckResult } from "../constraint"
import { Shape, ShapeCollection } from "../shape"

export abstract class GridShape extends Shape {

}

export class Cell extends GridShape {
    constructor(row : number, column : number) {
        super();
        this._row = row
        this._column = column
    }

    private _row : number
    private _column : number
    get row() : number {
        return this._row
    }
    get column() : number {
        return this._column
    }
}

export class CellBorder extends GridShape {

}

export class Grid extends ShapeCollection<GridShape> {
    private readonly _rows : Cell[][]
    private readonly _columns : Cell[][]
    private readonly _cells : Cell[]
    constructor(width : number, height : number) {
        let cells = new Array<Cell>(width * height)
        let rows = new Array<Array<Cell>>(height)
        for (let i = 0; i < height; i++) {
            rows[i] = new Array<Cell>(width)
            for (let j = 0; j < width; j++) {
                rows[i][j] = new Cell(i, j)
                cells[i * width + j] = rows[i][j]
            }
        }
        // TODO: handle cell borders
        super(cells)
        this._cells = cells
        this._rows = rows

        this._columns = new Array<Array<Cell>>(width)
        for (let i = 0; i < width; i++) {
            this._columns[i] = new Array<Cell>(height)
            for (let j = 0; j < height; j++) {
                this._columns[i][j] = rows[j][i]
            }
        }
    }
    get cells(): Cell[] {
        return this._cells
    }
    get rows(): Cell[][] {
        return this._rows
    }
    get columns(): Cell[][] {
        return this._columns
    }
    get cellBorders() : CellBorder[] {
        throw new Error("Method not implemented.");
    }
    addRowConstraint(constraint: (cells: Cell[]) => ConstraintCheckResult): void {
        for (let row of this.rows) {
            this.constraints.push(new ShapesConstraint<Cell>(row, constraint))
        }
    }
    addColumnConstraint(constraint: (cells: Cell[]) => ConstraintCheckResult): void {
        for (let column of this.columns) {
            this.constraints.push(new ShapesConstraint<Cell>(column, constraint))
        }
    }
}
