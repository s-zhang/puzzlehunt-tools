import { IPresenter } from "./presenter"
import { IRenderer, Rect } from "../renderer/renderer"
import { PropertyPresenter } from "./propertyPresenter";
import { ShapePresenter } from "./shapePresenter";

export interface IUIController {

}

export class UIController implements IUIController {
    private readonly _refresher : () => void
    private readonly _renderer : IRenderer
    constructor(refresher : () => void, renderer : IRenderer) {
        this._refresher = refresher
        this._renderer = renderer
    }
    private _selectedProperty : PropertyPresenter | null = null
    selectProperty(propertyPresenter : PropertyPresenter) : void {
        this._selectedProperty = propertyPresenter
    }
    selectShape(shapePresenter : ShapePresenter) : void {
        console.log(shapePresenter)
        console.log(this._selectedProperty)
        if (this._selectedProperty != null) {
            shapePresenter.addProperty(this._selectedProperty)
            shapePresenter.renderedObject.remove()
            shapePresenter.present(this._renderer)
            //this._refresher()
        }
    }
}