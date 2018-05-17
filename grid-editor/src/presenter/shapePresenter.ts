import { Property } from "../model/property"
import { Shape } from "../model/shape"
import { PropertyPresenter } from "./propertyPresenter"
import { ConstraintPresenter } from "./constraintPresenter"
import { IPresenter, Presenter } from "./presenter"
import { IRenderer, Rect, IRenderedObject } from "../renderer/renderer"
import { IController } from "../controller";

export abstract class ShapePresenter extends Presenter implements IPresenter  {
    private readonly _shape : Shape
    private readonly _propertyPresenters : Set<PropertyPresenter>
    private readonly _controller : IController
    constructor(shape : Shape, controller : IController) {
        super()
        this._shape = shape
        this._propertyPresenters = new Set<PropertyPresenter>()
        this._controller = controller
    }
    get propertyPresenters() : Set<PropertyPresenter> {
        return this._propertyPresenters
    }
    protected abstract presentShape(renderer: IRenderer): IRenderedObject
    present(renderer: IRenderer, boudingBox : Rect) {
        this.renderedObject = this.presentShape(renderer)
        this.renderedObject.onclick(() => {
            this.remove()
            this._controller.selectShape(this)
            this.present(renderer, boudingBox)
        })
        let boundingBoxes : Rect[] = this.getBoundingBoxes(this._propertyPresenters.size)
        let i = 0
        for (let propertyPresenter of this._propertyPresenters) {
            propertyPresenter.present(renderer, boundingBoxes[i])
            i++
        }
    }
    remove() : void {
        this.removeRenderedObject()
        for (let propertyPresenter of this._propertyPresenters) {
            propertyPresenter.remove()
        }
    }
    abstract getBoundingBoxes(numBoxes : number) : Rect[]
    addProperty(propertyPresenter : PropertyPresenter) {
        this._propertyPresenters.add(propertyPresenter)
        this._shape.properties.add(propertyPresenter.property)
    }
    removeProperty(propertyPresenter : PropertyPresenter) {
        this._propertyPresenters.delete(propertyPresenter)
        this._shape.properties.delete(propertyPresenter.property)
    }
}

export class ShapeCollectionPresenter implements IPresenter {
    public readonly shapePresenters : ShapePresenter[]
    protected readonly constraintPresenters : ConstraintPresenter[]
    protected constructor() {
        this.shapePresenters = new Array<ShapePresenter>()
        this.constraintPresenters = new Array<ConstraintPresenter>()
    }
    present(renderer: IRenderer, boudingBox : Rect): void {
        for (let shapePresenter of this.shapePresenters) {
            shapePresenter.present(renderer, boudingBox)
        }
        for (let constraintPresenter of this.constraintPresenters) {
            constraintPresenter.present(renderer, boudingBox)
        }
    }
    
    remove(): void {
        for (let shapePresenter of this.shapePresenters) {
            shapePresenter.remove()
        }
        for (let constraintPresenter of this.constraintPresenters) {
            constraintPresenter.remove()
        }
    }
}