import { ShapePresenter, ShapeCollectionPresenter } from "../shapePresenter"
import { Property } from "../../model/property"
import { Cell, Grid, CellBorder, GridIntersection } from "../../model/shapes/gridCell"
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
            this.renderLayer.concat(1),
            "none")
        //renderedObject.makeTransparent()
        return renderedObject
    }
    getBoundingBoxes(numBoxes: number): Rect[] {
        // Do this for now
        return this._rect.divide(1, numBoxes)
    }
}

export class CellBorderPresenter extends ShapePresenter {
    private readonly _cellBorder : CellBorder
    private readonly _sideLength : number
    private _boudingBox : Rect
    constructor(cellBorder : CellBorder, sideLength : number, renderLayer : number[],
        affectedConstraints : ConstraintPresenter[], controller : IController) {
        super(cellBorder, renderLayer, affectedConstraints, controller)
        this._cellBorder = cellBorder
        this._sideLength = sideLength
        this._boudingBox = new Rect(
            cellBorder.fromColumn * sideLength - 4,
            cellBorder.fromRow * sideLength - 4,
            (cellBorder.toColumn - cellBorder.fromColumn) * sideLength + 8,
            (cellBorder.toRow - cellBorder.fromRow) * sideLength + 8)
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
        let selectObject = renderer.renderRectangle(
            this._boudingBox.x,
            this._boudingBox.y,
            this._boudingBox.width,
            this._boudingBox.height,
            this.renderLayer.concat(1),
            "none")
        selectObject.makeTransparent()
        return selectObject
    }
    getBoundingBoxes(numBoxes: number): Rect[] {
        let boudingBoxes = new Array<Rect>()
        if (this._boudingBox.height > this._boudingBox.width) {
            return this._boudingBox.divide(numBoxes, 1)
        } else {
            return this._boudingBox.divide(1, numBoxes)
        }
    }
}

export class GridIntersectionPresenter extends ShapePresenter {
    private readonly _intersection : GridIntersection
    private readonly _sideLength : number
    constructor(intersection : GridIntersection, sideLength : number, renderLayer : number[],
        affectedConstraints : ConstraintPresenter[], controller : IController) {
        super(intersection, renderLayer, affectedConstraints, controller)
        this._intersection = intersection
        this._sideLength = sideLength
    }
    protected presentSelf(renderer: IRenderer): IRenderedObject {
        return renderer.renderCircle(
            this._intersection.column * this._sideLength,
            this._intersection.row * this._sideLength,
            3,
            this.renderLayer.concat(0))
    }
    protected presentSelectObject(renderer: IRenderer): IRenderedObject {
        let selectObject = renderer.renderCircle(this._intersection.column * this._sideLength,
            this._intersection.row * this._sideLength,
            7,
            this.renderLayer.concat(1))
        selectObject.makeTransparent()
        return selectObject
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
    public set presentIntersections(present : boolean) {
        this.setPresentSelf(this._grid.intersections, present)
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
        for (let intersection of grid.intersections) {
            this.addShapePresenter(intersection, new GridIntersectionPresenter(intersection, this._sideLength, [2], this.constraintPresenters, controller))
        }
    }
}
