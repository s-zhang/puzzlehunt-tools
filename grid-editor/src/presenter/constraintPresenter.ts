import { IConstraint, ConstraintCheckResult } from "../model/constraint"
import { IPresenter } from "./presenter"
import { IRenderer, Rect, IRenderedEffect, IRenderedObject } from "../renderer/renderer"
import { Shape } from "../model/shape";
import { ShapePresenter } from "./shapePresenter";
import { Property } from "../model/property";
import { PropertyPresenter } from "./propertyPresenter";

export class ConstraintPresenter implements IPresenter {
    private readonly _constraint : IConstraint
    private readonly _shapePresenters : Map<Shape, ShapePresenter>
    private _affectedRenderedObjects : IRenderedObject[]
    constructor(constraint : IConstraint, shapePresenters : Map<Shape, ShapePresenter>) {
        this._constraint = constraint
        this._shapePresenters = shapePresenters
        this._affectedRenderedObjects = new Array<IRenderedObject>()
    }

    private _getShapePresenter(shape : Shape) : ShapePresenter {
        let shapePresenter : ShapePresenter | undefined = this._shapePresenters.get(shape)
        if (shapePresenter == undefined) {
            throw new Error(`ShapePresenter corresponding this shape [${shape}] does not exist!`)
        }
        return shapePresenter
    }

    present(renderer: IRenderer, boudingBox : Rect): void {
        //this.remove()
        let constraintCheckResult : ConstraintCheckResult = this._constraint.check()
        for (let violation of constraintCheckResult.violations) {
            let shape : Shape = violation[0]
            let shapePresenter : ShapePresenter = this._getShapePresenter(shape)
            shapePresenter.renderedObject.color("#ffcc00")
            this._affectedRenderedObjects.push(shapePresenter.renderedObject)

            let property : Property = violation[1]
            let propertyPresenter : PropertyPresenter = shapePresenter.getPropertyPresenter(property)
            propertyPresenter.renderedObject.color("red")
            this._affectedRenderedObjects.push(propertyPresenter.renderedObject)
        }
    }
    erase(): void {
        for (let renderedObject of this._affectedRenderedObjects) {
            renderedObject.reset()
        }
        this._affectedRenderedObjects = []
    }
}
