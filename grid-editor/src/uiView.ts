import { IRenderer, Rect } from "./renderer/renderer";
import { PropertyPresenter } from "./presenter/propertyPresenter";
import { ShapeCollectionPresenter } from "./presenter/shapePresenter";
import { IController } from "./controller";

export class UIView {
    private readonly _shapeCollectionPresenter : ShapeCollectionPresenter
    private readonly _initialPropertyPresenters : PropertyPresenter[]
    private readonly _controller : IController
    private readonly _renderer : IRenderer
    constructor(shapeCollectionPresenter : ShapeCollectionPresenter,
        initialPropertyPresenters : PropertyPresenter[],
        controller : IController,
        renderer : IRenderer) {
        this._shapeCollectionPresenter = shapeCollectionPresenter
        this._initialPropertyPresenters = initialPropertyPresenters
        this._controller = controller
        this._renderer = renderer
    }
    render(): void {
        this._shapeCollectionPresenter.present(this._renderer, this._renderer.renderArea)

        for (let propertyPresenter of this._initialPropertyPresenters) {
            let button = this._renderer.renderButton(propertyPresenter.property.name, "toolbar")
            button.onclick(() => { this._controller.selectProperty(propertyPresenter) })
        }
    }
}