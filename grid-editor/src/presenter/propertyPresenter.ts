import { Property, PropertyBuilder } from "../model/property"
import { IRenderer, Rect, IRenderedObject } from "../renderer/renderer"
import { Presenter, IMarkablePresenter } from "./presenter";
import { ShapePresenter } from "./shapePresenter";
import { IController } from "../controller";

export abstract class PropertyPresenter extends Presenter implements IMarkablePresenter {
    readonly property : Property
    private readonly _parentShapePresenter : ShapePresenter
    private readonly _controller : IController
    private _isViolationMarked : boolean
    constructor(property : Property, parentShapePresenter : ShapePresenter, controller : IController) {
        super(parentShapePresenter.renderLayer.concat(2), true)
        this.property = property
        this._parentShapePresenter = parentShapePresenter
        this._controller = controller
        this._isViolationMarked = false
    }
    protected abstract presentProperty(renderer: IRenderer, boundingBox: Rect) : IRenderedObject
    present(renderer: IRenderer, boundingBox: Rect): void {
        this.renderedObject = this.presentProperty(renderer, boundingBox)
        this.renderedObject.onclick(() => this._controller.selectProperty(this, this._parentShapePresenter))
    }
    erase() : void {
        this.eraseSelf()
        this._isViolationMarked = false
    }
    markForViolation() : void {
        if (this._isViolationMarked) {
            return
        }
        this.renderedObject.color("red")
        this._isViolationMarked = true
    }

    unmarkForViolation() : void {
        if (!this._isViolationMarked) {
            return
        }
        this.renderedObject.reset()
        this._isViolationMarked = false
    }

    /**
     * The opacity to render the property determined by @see IController#forkNumber.
     */
    protected get forkOpacity() : number {
        return 1 / (2 ** this._controller.forkNumber)
    }
}

export interface IPropertyPresenterConstructor {
    new(property : Property, parentShapePresenter : ShapePresenter, controller : IController) : PropertyPresenter
}

export class PropertyPresenterFactory {
    private readonly _propertyPresenterConstructor : IPropertyPresenterConstructor
    public readonly propertyBuilder: PropertyBuilder
    public readonly keyboardSelectShortcut : string | null
    public constructor(propertyPresenterConstructor : IPropertyPresenterConstructor, propertyBuilder: PropertyBuilder,
        keyboardSelectShortcut : string | null = null) {
        this._propertyPresenterConstructor = propertyPresenterConstructor
        this.propertyBuilder = propertyBuilder
        this.keyboardSelectShortcut = keyboardSelectShortcut
    }
    createFromProperty(parentShapePresenter : ShapePresenter, controller : IController) : PropertyPresenter {
        let property: Property = this.propertyBuilder.create()
        return new this._propertyPresenterConstructor(property, parentShapePresenter, controller)
    }
}