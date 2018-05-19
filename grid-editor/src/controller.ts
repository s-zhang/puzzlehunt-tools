import { IPresenter } from "./presenter/presenter"
import { IRenderer, Rect } from "./renderer/renderer"
import { PropertyPresenter, PropertyPresenterFactory } from "./presenter/propertyPresenter";
import { ShapePresenter } from "./presenter/shapePresenter";

export interface IController {
    addPropertyMode(propertyPresenterFactory : PropertyPresenterFactory) : void
    removePropertyMode() : void
    selectShape(shapePresenter : ShapePresenter) : void
    selectProperty(propertyPresenter : PropertyPresenter) : boolean
}

export class Controller implements IController {
    constructor() {
    }
    private _selectedProperty : PropertyPresenterFactory | null = null
    addPropertyMode(propertyPresenterFactory : PropertyPresenterFactory) : void {
        this._selectedProperty = propertyPresenterFactory
    }
    removePropertyMode() : void {
        this._selectedProperty = null
    }
    selectShape(shapePresenter : ShapePresenter) : void {
        //console.log(shapePresenter)
        //console.log(this._selectedProperty)
        if (this._selectedProperty == null) {
            return
        }
        let propertyPresenter : PropertyPresenter = this._selectedProperty.createFromProperty(shapePresenter, this)
        shapePresenter.addProperty(propertyPresenter.property, propertyPresenter)
    }
    selectProperty(propertyPresenter : PropertyPresenter) : boolean {
        if (this._selectedProperty == null) {
            propertyPresenter.parentShapePresenter.removeProperty(propertyPresenter.property, propertyPresenter)
            return true
        }
        return false
    }
}