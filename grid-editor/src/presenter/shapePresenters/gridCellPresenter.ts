import { ShapePresenter, ShapeCollectionPresenter } from "../shapePresenter"
import { Property } from "../../model/property"
import { Cell, Grid, CellBorder } from "../../model/shapes/gridCell"
import { TextPropertyPresenter } from "../propertyPresenters/textPropertyPresenter"
import { IRenderer, Rect, IRenderedObject, NotRenderedObject } from "../../renderer/renderer"
import { IController } from "../../controller";
import { ConstraintPresenter } from "../constraintPresenter";
import { Shape } from "../../model/shape";

export class SqaureCellPresenter extends ShapePresenter {
    private readonly _cell : Cell
    private readonly _sideLength : number
    private readonly _rect : Rect
    constructor(cell : Cell, sideLength : number, renderLayer : number[],
        affectedConstraints : ConstraintPresenter[], controller : IController, isSelfPresented : boolean = false) {
        super(cell, renderLayer, affectedConstraints, controller, isSelfPresented)
        this._cell = cell
        this._sideLength = sideLength
        this._rect = new Rect(
            cell.column * sideLength,
            cell.row * sideLength,
            sideLength,
            sideLength)
    }
    protected presentSelf(renderer: IRenderer): IRenderedObject {
        return NotRenderedObject
    }
    protected presentSelectObject(renderer: IRenderer): IRenderedObject {
        let renderedObject = renderer.renderRectangle(
            this._cell.column * this._sideLength,
            this._cell.row * this._sideLength,
            this._sideLength,
            this._sideLength,
            this.renderLayer.concat(1))
        //renderedObject.makeTransparent()
        return renderedObject
    }
    getBoundingBoxes(numBoxes: number): Rect[] {
        if (numBoxes == 0) {
            return new Array<Rect>()
        } else if (numBoxes == 1) {
            return [this._rect]
        }
        throw new Error("Cannot handle multiple properties in one cell yet.")
    }
}

type CellBorderOrientation = "horizontal" | "vertical"

export class CellBorderPresenter extends ShapePresenter {
    private readonly _cellBorder : CellBorder
    private readonly _sideLength : number
    constructor(cellBorder : CellBorder, sideLength : number, renderLayer : number[],
        affectedConstraints : ConstraintPresenter[], controller : IController) {
        super(cellBorder, renderLayer, affectedConstraints, controller)
        this._cellBorder = cellBorder
        this._sideLength = sideLength
    }
    protected presentSelf(renderer: IRenderer): IRenderedObject {
        return renderer.renderLine(
            this._cellBorder.fromColumn * this._sideLength,
            this._cellBorder.fromRow * this._sideLength,
            this._cellBorder.toColumn * this._sideLength,
            this._cellBorder.toRow * this._sideLength,
            this.renderLayer.concat(0))
    }
    protected presentSelectObject(renderer: IRenderer): IRenderedObject {
        let mouseEventObject = renderer.renderRectangle(
            this._cellBorder.fromColumn * this._sideLength - 3,
            this._cellBorder.fromRow * this._sideLength - 3,
            (this._cellBorder.toColumn - this._cellBorder.fromColumn) * this._sideLength + 6,
            (this._cellBorder.toRow - this._cellBorder.fromRow) * this._sideLength + 6,
            this.renderLayer.concat(1))
        mouseEventObject.makeTransparent()
        return mouseEventObject
        //return NotRenderedObject
    }
    getBoundingBoxes(numBoxes: number): Rect[] {
        if (numBoxes != 0) {
            throw new Error("Method not implemented.")
        }
        return new Array<Rect>()
    }
}

export class GridPresenter extends ShapeCollectionPresenter {
    private readonly _grid : Grid
    private readonly _sideLength : number = 50
    public set presentCells(present : boolean) {
        this.setPresentSelf(this._grid.cells, present)
    }
    public set presentCellBorders(present : boolean) {
        this.setPresentSelf(this._grid.cellBorders, present)
    }
    constructor(grid : Grid, controller : IController) {
        super()
        this._grid = grid
        for (let constraint of grid.constraints) {
            this.addConstraint(constraint)
        }
        for (let cell of grid.cells) {
            this.addShapePresenter(cell, new SqaureCellPresenter(cell, this._sideLength, [0], this.constraintPresenters, controller))
        }
        for (let cellBorder of grid.cellBorders) {
            this.addShapePresenter(cellBorder, new CellBorderPresenter(cellBorder, this._sideLength, [1], this.constraintPresenters, controller))
        }
    }
}
