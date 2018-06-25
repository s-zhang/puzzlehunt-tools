import { IRenderer, Rect } from "./renderer/renderer"
import { PropertyPresenter, PropertyPresenterFactory } from "./presenter/propertyPresenter";
import { ShapePresenter, ShapeCollectionPresenter } from "./presenter/shapePresenter";
import { EditorView } from "./view/editorView";

/**
 * The controller handles user inputs. It decides what happens when e.g. user clicks
 * on a cell
 */
export interface IController {
    addPropertyMode(propertyPresenterFactory : PropertyPresenterFactory) : void
    removePropertyMode() : void
    selectShape(shapePresenter : ShapePresenter) : void
    selectProperty(propertyPresenter : PropertyPresenter) : boolean
    selectPuzzle(presenter : ShapeCollectionPresenter, renderer : IRenderer) : void
    /**
     * Keeps track of the number of times the user has forked. Currently forking serves
     * as a guidance for rendering @see PropertyPresenter s before full checkpointing
     * functionality is implemented.
     */
    forkNumber : number
}

export class Controller implements IController {
    constructor() {
        this.forkNumber = 0
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
    selectPuzzle(presenter : ShapeCollectionPresenter, renderer : IRenderer) : void {
        let editor = new EditorView(presenter, this, renderer)
        editor.render()
    }
    forkNumber : number
}