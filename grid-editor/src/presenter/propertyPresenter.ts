import { Property } from "../model/property"
import { IRenderer, Rect, IRenderedObject, NO_BOUNDING_BOX } from "../renderer/renderer"
import { Presenter, IPresenter } from "./presenter";
import { ShapePresenter } from "./shapePresenter";
import { IController } from "../controller";

export abstract class PropertyPresenter extends Presenter implements IPresenter {
    readonly property : Property
    readonly parentShapePresenter : ShapePresenter
    private readonly _controller : IController
    constructor(property : Property, parentShapePresenter : ShapePresenter, controller : IController) {
        super()
        this.property = property
        this.parentShapePresenter = parentShapePresenter
        this._controller = controller
    }
    protected abstract presentProperty(renderer: IRenderer, boundingBox: Rect) : IRenderedObject
    present(renderer: IRenderer, boundingBox: Rect): void {
        this.renderedObject = this.presentProperty(renderer, boundingBox)
        this.renderedObject.onclick(() => {
            if (this._controller.selectProperty(this)) {
                this.erase()
                this.parentShapePresenter.present(renderer, NO_BOUNDING_BOX)
            }
        })
    }
    erase() : void {
        this.eraseRenderedObject()
    }
}

export interface IPropertyPresenterConstructor {
    new(property : Property, parentShapePresenter : ShapePresenter, controller : IController) : PropertyPresenter
}

export class PropertyPresenterFactory {
    private readonly _propertyPresenterConstructor : IPropertyPresenterConstructor
    readonly property : Property
    constructor(propertyPresenterConstructor : IPropertyPresenterConstructor, property : Property) {
        this._propertyPresenterConstructor = propertyPresenterConstructor
        this.property = property
    }
    createFromProperty(parentShapePresenter : ShapePresenter, controller : IController) : PropertyPresenter {
        return new this._propertyPresenterConstructor(this.property, parentShapePresenter, controller)
    }
}