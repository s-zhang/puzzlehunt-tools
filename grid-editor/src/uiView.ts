import { IRenderer, Rect } from "./renderer/renderer";
import { PropertyPresenter, PropertyPresenterFactory } from "./presenter/propertyPresenter";
import { ShapeCollectionPresenter } from "./presenter/shapePresenter";
import { IController } from "./controller";

export class UIView {
    private readonly _shapeCollectionPresenter : ShapeCollectionPresenter
    private readonly _initialPropertyPresenters : PropertyPresenterFactory[]
    private readonly _controller : IController
    private readonly _renderer : IRenderer
    constructor(shapeCollectionPresenter : ShapeCollectionPresenter,
        initialPropertyPresenters : PropertyPresenterFactory[],
        controller : IController,
        renderer : IRenderer) {
        this._shapeCollectionPresenter = shapeCollectionPresenter
        this._initialPropertyPresenters = initialPropertyPresenters
        this._controller = controller
        this._renderer = renderer
    }
    render(): void {
        this._shapeCollectionPresenter.present(this._renderer)

        for (let propertyPresenter of this._initialPropertyPresenters) {
            let propertySelectorButton = this._renderer.renderButton(propertyPresenter.property.name, "toolbar")
            propertySelectorButton.onclick(() => this._controller.addPropertyMode(propertyPresenter))
        }
        
        let propertyRemoveButton = this._renderer.renderButton("remove", "toolbar")
        propertyRemoveButton.onclick(() => this._controller.removePropertyMode())
    }
}