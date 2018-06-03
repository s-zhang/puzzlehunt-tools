import { ConstraintSatifaction, ShapesConstraint, ConstraintCheckResult, IConstraint } from "../constraint"
import { Shape, IShapeCollection, ShapeCollection } from "../shape"

export abstract class GridShape extends Shape {

}

export class Cell extends GridShape {
    public readonly row : number
    public readonly column : number
    private readonly _grid : Grid

    constructor(row : number, column : number, grid : Grid) {
        super()
        this.row = row
        this.column = column
        this._grid = grid
    }

    private _adjacentCellBorders : CellBorder[] | null = null
    get adjacentCellBorders() : CellBorder[] {
        if (this._adjacentCellBorders == null) {
            this._adjacentCellBorders = [
                this._grid.horizontalCellBorders[this.row][this.column],
                this._grid.horizontalCellBorders[this.row + 1][this.column],
                this._grid.verticalCellBorders[this.row][this.column],
                this._grid.verticalCellBorders[this.row][this.column + 1]
            ]
        }
        return this._adjacentCellBorders
    }
}

export abstract class CellBorder extends GridShape {
    protected readonly _grid : Grid
    public readonly fromRow : number
    public readonly toRow : number
    public readonly fromColumn : number
    public readonly toColumn : number
    constructor(fromRow : number, toRow : number, fromColumn : number, toColumn : number, grid : Grid) {
        super()
        this.fromRow = fromRow
        this.toRow = toRow
        this.fromColumn = fromColumn
        this.toColumn = toColumn
        this._grid = grid
    }

    private _adjacentCells : Cell[] | null = null
    get adjacentCells() : Cell[] {
        if (this._adjacentCells == null) {
            this._adjacentCells = this.computeAdjacentCells()
        }
        return this._adjacentCells
    }
    protected abstract computeAdjacentCells() : Cell[]
}

export class HorizontalCellBorder extends CellBorder {
    public readonly row : number
    constructor(row : number, fromColumn : number, toColumn : number, grid : Grid) {
        super(row, row, fromColumn, toColumn, grid)
        this.row = row
    }
    protected computeAdjacentCells(): Cell[] {
        let adjacentCells = new Array<Cell>()
        if (this.row - 1 >= 0) {
            adjacentCells.push(this._grid.rows[this.row - 1][this.fromColumn])
        }
        if (this.row < this._grid.rows.length) {
            adjacentCells.push(this._grid.rows[this.row][this.fromColumn])
        }
        return adjacentCells
    }
}

export class VerticalCellBorder extends CellBorder {
    public readonly column : number
    constructor(fromRow : number, toRow : number, column : number, grid : Grid) {
        super(fromRow, toRow, column, column, grid)
        this.column = column
    }
    protected computeAdjacentCells(): Cell[] {
        let adjacentCells = new Array<Cell>()
        if (this.column - 1 >= 0) {
            adjacentCells.push(this._grid.rows[this.fromRow][this.column - 1])
        }
        if (this.column < this._grid.columns.length) {
            adjacentCells.push(this._grid.rows[this.fromRow][this.column])
        }
        return adjacentCells
    }
}

export class GridIntersection extends GridShape {
    public readonly row : number
    public readonly column : number
    constructor(row : number, column : number) {
        super()
        this.row = row
        this.column = column
    }
}

export class Grid implements IShapeCollection<GridShape> {
    public readonly rows : Cell[][]
    public readonly columns : Cell[][]
    public readonly cells : Cell[]
    public readonly horizontalCellBorders : HorizontalCellBorder[][]
    public readonly verticalCellBorders : VerticalCellBorder[][]
    public readonly cellBorders : CellBorder[]
    public readonly intersections : GridIntersection[]
    public readonly _shapeCollection : IShapeCollection<GridShape>
    constructor(width : number, height : number) {
        this.cells = new Array<Cell>(width * height)
        this.rows = new Array<Array<Cell>>(height)
        for (let i = 0; i < height; i++) {
            this.rows[i] = new Array<Cell>(width)
            for (let j = 0; j < width; j++) {
                this.rows[i][j] = new Cell(i, j, this)
                this.cells[i * width + j] = this.rows[i][j]
            }
        }
        this.columns = new Array<Array<Cell>>(width)
        for (let i = 0; i < width; i++) {
            this.columns[i] = new Array<Cell>(height)
            for (let j = 0; j < height; j++) {
                this.columns[i][j] = this.rows[j][i]
            }
        }
        
        this.cellBorders = new Array<CellBorder>()
        this.horizontalCellBorders = new Array<Array<HorizontalCellBorder>>(height + 1)
        for (let i = 0; i < height + 1; i++) {
            this.horizontalCellBorders[i] = new Array<HorizontalCellBorder>(width)
            for (let j = 0; j < width; j++) {
                let cellBorder = new HorizontalCellBorder(i, j, j + 1, this)
                this.horizontalCellBorders[i][j] = cellBorder
                this.cellBorders.push(cellBorder)
            }
        }
        this.verticalCellBorders = new Array<Array<VerticalCellBorder>>(height)
        for (let i = 0; i < height; i++) {
            this.verticalCellBorders[i] = new Array<VerticalCellBorder>(width + 1)
            for (let j = 0; j < width + 1; j++) {
                let cellBorder = new VerticalCellBorder(i, i + 1, j, this)
                this.verticalCellBorders[i][j] = cellBorder
                this.cellBorders.push(cellBorder)
            }
        }

        this.intersections = new Array<GridIntersection>()
        for (let i = 0; i < height + 1; i++) {
            for (let j = 0; j < width + 1; j++) {
                this.intersections.push(new GridIntersection(i, j))
            }
        }

        let gridShapes = new Array<GridShape>()
        gridShapes = gridShapes.concat(this.cells)
        gridShapes = gridShapes.concat(this.cellBorders)
        gridShapes = gridShapes.concat(this.intersections)
        this._shapeCollection = new ShapeCollection<GridShape>(gridShapes)
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
    addCellConstraint(constraint: (cell: Cell) => ConstraintCheckResult): void {
        for (let cell of this.cells) {
            this.constraints.push(new ShapesConstraint<Cell>([cell],
                (cells : Cell[]) => constraint(cells[0])))
        }
    }
    addCellBorderConstraint(constraint: (cellBoarder : CellBorder) => ConstraintCheckResult): void {
        for (let cellBoarder of this.cellBorders) {
            this.constraints.push(new ShapesConstraint<CellBorder>([cellBoarder],
                (cellBorders : CellBorder[]) => constraint(cellBorders[0])))
        }
    }

    public get shapes() : GridShape[] {
        return this._shapeCollection.shapes
    }
    public get constraints() : IConstraint[] {
        return this._shapeCollection.constraints
    }
    /*public get propertyNames() : Set<string> {
        return this._shapeCollection.propertyNames
    }*/
    public areConstraintsSatisfied() : ConstraintSatifaction {
        return this._shapeCollection.areConstraintsSatisfied()
    }
}
