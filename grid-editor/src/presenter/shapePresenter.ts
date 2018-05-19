import { Property } from "../model/property"
import { Shape } from "../model/shape"
import { PropertyPresenter } from "./propertyPresenter"
import { ConstraintPresenter } from "./constraintPresenter"
import { IPresenter, Presenter } from "./presenter"
import { IRenderer, Rect, IRenderedObject, NO_BOUNDING_BOX } from "../renderer/renderer"
import { IController } from "../controller";
import { IConstraint } from "../model/constraint";

export abstract class ShapePresenter extends Presenter implements IPresenter  {
    private readonly _shape : Shape
    private readonly _propertyPresenters : Map<Property, PropertyPresenter>
    private readonly _controller : IController
    private readonly _affectedConstraints : ConstraintPresenter[]
    constructor(shape : Shape, affectedConstraints : ConstraintPresenter[], controller : IController) {
        super()
        this._shape = shape
        this._propertyPresenters = new Map<Property, PropertyPresenter>()
        this._affectedConstraints = affectedConstraints
        this._controller = controller
    }
    protected abstract presentShape(renderer: IRenderer): IRenderedObject
    present(renderer: IRenderer, boudingBox : Rect) {
        this.renderedObject = this.presentShape(renderer)
        this.renderedObject.onclick(() => {
            this.erase()
            this._controller.selectShape(this)
            this.present(renderer, boudingBox)
        })
        let boundingBoxes : Rect[] = this.getBoundingBoxes(this._propertyPresenters.size)
        let i = 0
        for (let propertyPresenter of this._propertyPresenters.values()) {
            propertyPresenter.present(renderer, boundingBoxes[i])
            i++
        }
        for (let constraintPresenter of this._affectedConstraints) {
            constraintPresenter.erase()
        }
        for (let constraintPresenter of this._affectedConstraints) {
            constraintPresenter.present(renderer, NO_BOUNDING_BOX)
        }
    }
    erase() : void {
        this.eraseRenderedObject()
        for (let propertyPresenter of this._propertyPresenters.values()) {
            propertyPresenter.erase()
        }
    }
    abstract getBoundingBoxes(numBoxes : number) : Rect[]
    
    addProperty(property : Property, propertyPresenter : PropertyPresenter) {
        this._propertyPresenters.set(property, propertyPresenter)
        this._shape.properties.add(propertyPresenter.property)
    }
    removeProperty(property : Property, propertyPresenter : PropertyPresenter) {
        this._propertyPresenters.delete(property)
        this._shape.properties.delete(propertyPresenter.property)
    }
    getPropertyPresenter(property : Property) : PropertyPresenter {
        let propertyPresenter : PropertyPresenter | undefined = this._propertyPresenters.get(property)
        if (propertyPresenter == undefined) {
            throw new Error(`PropertyPresenter corresponding this property [${property}] does not exist!`)
        }
        return propertyPresenter
    }
}

export class ShapeCollectionPresenter implements IPresenter {
    private readonly _shapePresenters : Map<Shape, ShapePresenter>
    protected readonly constraintPresenters : ConstraintPresenter[]
    protected constructor() {
        this._shapePresenters = new Map<Shape, ShapePresenter>()
        this.constraintPresenters = new Array<ConstraintPresenter>()
    }
    present(renderer: IRenderer, boudingBox : Rect): void {
        for (let shapePresenter of this._shapePresenters.values()) {
            shapePresenter.present(renderer, boudingBox)
        }
        for (let constraintPresenter of this.constraintPresenters) {
            constraintPresenter.present(renderer, boudingBox)
        }
    }

    protected addShapePresenter(shape : Shape, shapePresenter : ShapePresenter) : void {
        this._shapePresenters.set(shape, shapePresenter)
    }

    protected addConstraint(constraint : IConstraint) {
        this.constraintPresenters.push(new ConstraintPresenter(constraint, this._shapePresenters))
    }
    
    erase(): void {
        for (let shapePresenter of this._shapePresenters.values()) {
            shapePresenter.erase()
        }
        for (let constraintPresenter of this.constraintPresenters) {
            constraintPresenter.erase()
        }
    }
}