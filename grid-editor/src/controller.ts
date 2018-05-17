import { IPresenter } from "./presenter/presenter"
import { IRenderer, Rect } from "./renderer/renderer"
import { PropertyPresenter } from "./presenter/propertyPresenter";
import { ShapePresenter } from "./presenter/shapePresenter";

export interface IController {
    selectProperty(propertyPresenter : PropertyPresenter) : void
    selectShape(shapePresenter : ShapePresenter) : boolean
}

export class Controller implements IController {
    private readonly _refresher : () => void
    //private readonly _renderer : IRenderer
    constructor(refresher : () => void) {
        this._refresher = refresher
        //this._renderer = renderer
    }
    private _selectedProperty : PropertyPresenter | null = null
    selectProperty(propertyPresenter : PropertyPresenter) : void {
        this._selectedProperty = propertyPresenter
    }
    selectShape(shapePresenter : ShapePresenter) : boolean {
        console.log(shapePresenter)
        console.log(this._selectedProperty)
        let represent : boolean = false
        if (this._selectedProperty != null) {
            shapePresenter.addProperty(this._selectedProperty)
            represent = true
        }
        return represent
    }
}