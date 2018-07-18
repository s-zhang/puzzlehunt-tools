import { Property, PropertyAssociationType } from "../model/property"
import { Shape } from "../model/shape"
import { PropertyPresenter, PropertyPresenterFactory } from "./propertyPresenter"
import { ConstraintPresenter } from "./constraintPresenter"
import { Presenter, IMarkablePresenter } from "./presenter"
import { IRenderer, Rect, IRenderedObject, NotRenderedObject } from "../renderer/renderer"
import { IController } from "../controller";
import { IConstraint } from "../model/constraint";

/**
 * Presenter that handles the rendering of @see Shape s
 */
export abstract class ShapePresenter extends Presenter implements IMarkablePresenter {
    private readonly _shape : Shape
    public isSelfPresented : boolean
    private readonly _propertyPresenters : Map<Property, PropertyPresenter>
    private readonly _controller : IController
    private readonly _affectedConstraints : ConstraintPresenter[]
    private _isViolationMarked : boolean
    protected selectObject : IRenderedObject
    constructor(shape : Shape, renderLayer : number[], affectedConstraints : ConstraintPresenter[], controller : IController, isSelfPresented : boolean = true) {
        super(renderLayer, isSelfPresented)
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
    present(renderer: IRenderer): void {
        if (this.isSelfPresented) {
            this.renderedObject = this.presentSelf(renderer)
        }
        this.selectObject = this.presentSelectObject(renderer)
        this.selectObject.onclick(() => this._controller.selectShape(this))
        let singleAssociationProperty: PropertyPresenter | null = this.getSingleAssociationPropertyIfAny()
        
        let numberSubBoundingBoxesNeeded: number
        if (singleAssociationProperty !== null) {
            numberSubBoundingBoxesNeeded = this._propertyPresenters.size - 1
            singleAssociationProperty.present(renderer, this.getBoundingBoxes(1)[0])
        } else {
            numberSubBoundingBoxesNeeded = this._propertyPresenters.size
        }
        
        if (numberSubBoundingBoxesNeeded > 0) {
            let subBoundingBoxes : Rect[] = this.getBoundingBoxes(numberSubBoundingBoxesNeeded)
            let i = 0
            for (let propertyPresenter of this._propertyPresenters.values()) {
                if (propertyPresenter.property.associationType == PropertyAssociationType.Multiple)
                {
                    propertyPresenter.present(renderer, subBoundingBoxes[i])
                    i++
                }
            }
        }

        for (let constraintPresenter of this._affectedConstraints) {
            constraintPresenter.present(renderer)
        }
    }

    /**
     * Finds the property presenter with a Semi-Single or Single association type if exists.
     */
    private getSingleAssociationPropertyIfAny(): PropertyPresenter | null {
        for (let propertyPresenter of this._propertyPresenters.values()) {
            if (propertyPresenter.property.associationType != PropertyAssociationType.Multiple)
            {
                return propertyPresenter
            }
        }
        return null
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
        this._shape.addProperty(propertyPresenter.property)
        this._propertyPresenters.set(property, propertyPresenter)
    }
    removeProperty(property : Property, propertyPresenter : PropertyPresenter) {
        this._propertyPresenters.delete(property)
        this._shape.removeProperty(propertyPresenter.property)
    }
    getPropertyPresenter(property : Property) : PropertyPresenter {
        let propertyPresenter : PropertyPresenter | undefined = this._propertyPresenters.get(property)
        if (propertyPresenter == undefined) {
            throw new Error(`PropertyPresenter corresponding this property [${property}] does not exist!`)
        }
        return propertyPresenter
    }
}

/**
 * Presenter that handles the rendering of @see Shape s that make up a puzzle board.
 */
export class ShapeCollectionPresenter {
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