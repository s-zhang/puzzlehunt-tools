import { Property } from "../model/property"
import { Shape } from "../model/shape"
import { PropertyPresenter } from "./propertyPresenter"
import { ConstraintPresenter } from "./constraintPresenter"
import { IPresenter } from "./presenter"
import { IRenderer, Rect, IRenderedObject } from "../renderer/renderer"

export abstract class ShapePresenter implements IPresenter {
    private readonly _shape : Shape
    private readonly _propertyPresenters : Set<PropertyPresenter>
    public renderedObject !: IRenderedObject
    constructor(shape : Shape) {
        this._shape = shape
        this._propertyPresenters = new Set<PropertyPresenter>()
    }
    get propertyPresenters() : Set<PropertyPresenter> {
        return this._propertyPresenters
    }
    protected abstract presentShape(renderer: IRenderer): IRenderedObject
    present(renderer: IRenderer) {
        this.renderedObject = this.presentShape(renderer)
        let boundingBoxes : Rect[] = this.getBoundingBoxes(this._propertyPresenters.size)
        let i = 0
        for (let propertyPresenter of this._propertyPresenters) {
            propertyPresenter.present(renderer, boundingBoxes[i])
            i++
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
    present(renderer: IRenderer): void {
        for (let shapePresenter of this.shapePresenters) {
            shapePresenter.present(renderer)
        }
        for (let constraintPresenter of this.constraintPresenters) {
            constraintPresenter.present(renderer)
        }
    }
}