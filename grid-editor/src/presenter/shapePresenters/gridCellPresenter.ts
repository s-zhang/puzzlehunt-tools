import { ShapePresenter, ShapeCollectionPresenter } from "../shapePresenter"
import { Property } from "../../model/property"
import { Cell, Grid } from "../../model/shapes/gridCell"
import { TextPropertyPresenter } from "../propertyPresenters/textPropertyPresenter"
import { IRenderer, Rect, IRenderedObject } from "../../renderer/renderer"

export class SqaureCellPresenter extends ShapePresenter {
    private readonly _cell : Cell
    private readonly _sideLength : number
    private readonly _rect : Rect
    constructor(cell : Cell, sideLength : number) {
        super(cell)
        this._cell = cell
        this._sideLength = sideLength
        this._rect = new Rect(
            cell.column * sideLength,
            cell.row * sideLength,
            sideLength,
            sideLength)
    }
    protected presentShape(renderer: IRenderer): IRenderedObject {
        return renderer.renderRectangle(
            this._cell.column * this._sideLength,
            this._cell.row * this._sideLength,
            this._sideLength,
            this._sideLength)
    }
    getBoundingBoxes(numBoxes: number): Rect[] {
        if (numBoxes == 0) {
            return new Array<Rect>()
        } else if (numBoxes == 1) {
            return [this._rect]
        }
        throw new Error("Method not implemented.");
    }
}


export class GridPresenter extends ShapeCollectionPresenter {
    private readonly _grid : Grid
    private readonly _sideLength : number = 50
    constructor(grid : Grid) {
        super()
        this._grid = grid
        for (let cell of grid.cells) {
            this.shapePresenters.push(new SqaureCellPresenter(cell, this._sideLength))
        }
    }
}
