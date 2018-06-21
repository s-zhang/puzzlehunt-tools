import { Property } from "../model/property"
import { Shape } from "../model/shape"
import { PropertyPresenter, PropertyPresenterFactory } from "./propertyPresenter"
import { ConstraintPresenter } from "./constraintPresenter"
import { IFixedPresenter, FixedPresenter, IMarkablePresenter } from "./presenter"
import { IRenderer, Rect, IRenderedObject, NotRenderedObject } from "../renderer/renderer"
import { IController } from "../controller";
import { IConstraint } from "../model/constraint";

export abstract class ShapePresenter extends FixedPresenter implements IFixedPresenter, IMarkablePresenter {
    private static MouseDownType : string | null
    private readonly _shape : Shape
    public isSelfPresented : boolean
    private readonly _propertyPresenters : Map<Property, PropertyPresenter>
    private readonly _controller : IController
    private readonly _affectedConstraints : ConstraintPresenter[]
    private _isViolationMarked : boolean
    protected selectObject : IRenderedObject
    constructor(shape : Shape, renderLayer : number[], affectedConstraints : ConstraintPresenter[], controller : IController, isSelfPresented : boolean = true) {
        super(renderLayer)
        this._shape = shape
        this.isSelfPresented = isSelfPresented
        this._propertyPresenters = new Map<Property, PropertyPresenter>()
        this._affectedConstraints = affectedConstraints
        this._controller = controller
        this.selectObject = NotRenderedObject
        this._isViolationMarked = false
    }
    protected abstract presentSelf(renderer: IRenderer): IRenderedObject
    protected abstract presentSelectObject(renderer : IRenderer) : IRenderedObject
    present(renderer: IRenderer) {
        if (this.isSelfPresented) {
            this.renderedObject = this.presentSelf(renderer)
        }
        this.selectObject = this.presentSelectObject(renderer)
        this.selectObject.onclick(() => {
            //this.erase()
            //this._controller.selectShape(this)
            //this.present(renderer)
        })
        this.selectObject.onmousedown(() => {
            ShapePresenter.MouseDownType = this.constructor.name;
            this.erase()
            this._controller.selectShape(this)
            this.present(renderer)
        })
        this.selectObject.onmouseup(() => {
            ShapePresenter.MouseDownType = null;
        })
        this.selectObject.onmouseover(() => {
            if (ShapePresenter.MouseDownType == this.constructor.name)
            {
                this.erase()
                this._controller.selectShape(this)
                this.present(renderer)
            }
        })
        let boundingBoxes : Rect[] = this.getBoundingBoxes(this._propertyPresenters.size)
        let i = 0
        for (let propertyPresenter of this._propertyPresenters.values()) {
            propertyPresenter.present(renderer, boundingBoxes[i])
            i++
        }
        for (let constraintPresenter of this._affectedConstraints) {
            constraintPresenter.present(renderer)
        }
    }
    erase() : void {
        for (let constraintPresenter of this._affectedConstraints) {
            constraintPresenter.erase()
        }
        if (this.selectObject != this.renderedObject) {
            this.selectObject.erase()
            this.selectObject = NotRenderedObject
        }
        if (this.isSelfPresented) {
            this.eraseSelf()
        }
        this._isViolationMarked = false
        for (let propertyPresenter of this._propertyPresenters.values()) {
            propertyPresenter.erase()
        }
    }
    abstract getBoundingBoxes(numBoxes : number) : Rect[]

    markForViolation() : void {
        if (this._isViolationMarked) {
            return
        }
        this.selectObject.color("#ffcc00")
        this._isViolationMarked = true
    }

    unmarkForViolation() : void {
        if (!this._isViolationMarked) {
            return
        }
        this.selectObject.reset()
        this._isViolationMarked = false
    }
    
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

export class ShapeCollectionPresenter implements IFixedPresenter {
    protected readonly shapePresenters : Map<Shape, ShapePresenter>
    protected readonly constraintPresenters : ConstraintPresenter[]
    public readonly propertyPresenterFactories : PropertyPresenterFactory[]
    protected constructor() {
        this.shapePresenters = new Map<Shape, ShapePresenter>()
        this.constraintPresenters = new Array<ConstraintPresenter>()
        this.propertyPresenterFactories = new Array<PropertyPresenterFactory>()
    }
    
    protected setPresentSelf(shapes : Shape[], present : boolean): void {
        for (let shape of shapes) {
            let shapePresenter : ShapePresenter = this.shapePresenters.get(shape)!
            shapePresenter.isSelfPresented = present
        }
    }
    present(renderer: IRenderer): void {
        for (let shapePresenter of this.shapePresenters.values()) {
            shapePresenter.present(renderer)
        }
        for (let constraintPresenter of this.constraintPresenters) {
            constraintPresenter.present(renderer)
        }
    }

    protected addShapePresenter(shape : Shape, shapePresenter : ShapePresenter) : void {
        this.shapePresenters.set(shape, shapePresenter)
    }

    protected addConstraint(constraint : IConstraint) {
        this.constraintPresenters.push(new ConstraintPresenter(constraint, this.shapePresenters))
    }
    
    erase(): void {
        for (let shapePresenter of this.shapePresenters.values()) {
            shapePresenter.erase()
        }
        for (let constraintPresenter of this.constraintPresenters) {
            constraintPresenter.erase()
        }
    }
}