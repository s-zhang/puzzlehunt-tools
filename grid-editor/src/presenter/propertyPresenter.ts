import { Property } from "../model/property"
import { IRenderer, Rect, IRenderedObject } from "../renderer/renderer"
import { FlexiblePresenter, IFlexiblePresenter, IMarkablePresenter } from "./presenter";
import { ShapePresenter } from "./shapePresenter";
import { IController } from "../controller";

export abstract class PropertyPresenter extends FlexiblePresenter implements IFlexiblePresenter, IMarkablePresenter {
    readonly property : Property
    readonly parentShapePresenter : ShapePresenter
    private readonly _controller : IController
    private _isViolationMarked : boolean
    constructor(property : Property, parentShapePresenter : ShapePresenter, controller : IController) {
        super(parentShapePresenter.renderLayer.concat(2))
        this.property = property
        this.parentShapePresenter = parentShapePresenter
        this._controller = controller
        this._isViolationMarked = false
    }
    protected abstract presentProperty(renderer: IRenderer, boundingBox: Rect) : IRenderedObject
    present(renderer: IRenderer, boundingBox: Rect): void {
        this.renderedObject = this.presentProperty(renderer, boundingBox)
        this.renderedObject.onclick(() => {
            if (this._controller.selectProperty(this)) {
                // calling this.erase is required because the propertyPresenter is already removed from
                // parentShapePresenter by now and parentShapePresenter's erase won't be able
                // to erase the propertyPresenter
                this.erase()
                this.parentShapePresenter.erase()
                this.parentShapePresenter.present(renderer)
            }
        })
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
}

export interface IPropertyPresenterConstructor {
    new(property : Property, parentShapePresenter : ShapePresenter, controller : IController) : PropertyPresenter
}

export class PropertyPresenterFactory {
    private readonly _propertyPresenterConstructor : IPropertyPresenterConstructor
    public readonly property : Property
    public readonly keyboardSelectShortcut : string | null
    public constructor(propertyPresenterConstructor : IPropertyPresenterConstructor, property : Property,
        keyboardSelectShortcut : string | null = null) {
        this._propertyPresenterConstructor = propertyPresenterConstructor
        this.property = property
        this.keyboardSelectShortcut = keyboardSelectShortcut
    }
    createFromProperty(parentShapePresenter : ShapePresenter, controller : IController) : PropertyPresenter {
        return new this._propertyPresenterConstructor(this.property, parentShapePresenter, controller)
    }
}