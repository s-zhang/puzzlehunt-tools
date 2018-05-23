import { IConstraint, ConstraintCheckResult } from "../model/constraint"
import { IFixedPresenter, IMarkablePresenter } from "./presenter"
import { IRenderer, Rect, IRenderedEffect, IRenderedObject } from "../renderer/renderer"
import { Shape } from "../model/shape";
import { ShapePresenter } from "./shapePresenter";
import { Property } from "../model/property";
import { PropertyPresenter } from "./propertyPresenter";

export class ConstraintPresenter implements IFixedPresenter {
    private readonly _constraint : IConstraint
    private readonly _shapePresenters : Map<Shape, ShapePresenter>
    private _affectedPresenters : IMarkablePresenter[]
    constructor(constraint : IConstraint, shapePresenters : Map<Shape, ShapePresenter>) {
        this._constraint = constraint
        this._shapePresenters = shapePresenters
        this._affectedPresenters = new Array<IMarkablePresenter>()
    }

    private _getShapePresenter(shape : Shape) : ShapePresenter {
        let shapePresenter : ShapePresenter | undefined = this._shapePresenters.get(shape)
        if (shapePresenter == undefined) {
            throw new Error(`ShapePresenter corresponding this shape [${shape}] does not exist!`)
        }
        return shapePresenter
    }

    present(renderer: IRenderer): void {
        let constraintCheckResult : ConstraintCheckResult = this._constraint.check()
        for (let violation of constraintCheckResult.violations) {
            let shape : Shape = violation[0]
            let shapePresenter : ShapePresenter = this._getShapePresenter(shape)
            shapePresenter.markForViolation()
            //shapePresenter.selectObject.color("#ffcc00")
            this._affectedPresenters.push(shapePresenter)

            let property : Property = violation[1]
            let propertyPresenter : PropertyPresenter = shapePresenter.getPropertyPresenter(property)
            propertyPresenter.markForViolation()
            //propertyPresenter.renderedObject.color("red")
            this._affectedPresenters.push(propertyPresenter)
        }
    }
    erase(): void {
        for (let presenter of this._affectedPresenters) {
            presenter.unmarkForViolation()
        }
        this._affectedPresenters = []
    }
}
