import { IRenderer, Rect } from "./renderer/renderer"
import { PropertyPresenter, PropertyPresenterFactory } from "./presenter/propertyPresenter";
import { ShapePresenter, ShapeCollectionPresenter } from "./presenter/shapePresenter";
import { EditorView } from "./view/editorView";
import { StatusBar } from "./view/statusBar";
import { PropertyAssociationType } from "./model/property";
import { PropertyAssociationTypeSelector } from "./view/propertyAssociationTypeSelector";

/**
 * The controller handles user inputs. It decides what happens when e.g. user clicks
 * on a cell
 */
export interface IController {
    addPropertyMode(propertyPresenterFactory : PropertyPresenterFactory) : void
    removePropertyMode() : void
    /**
     * Handles what happens when a Shape is clicked.
     * @param shapePresenter Presenter of the shape selected
     */
    selectShape(shapePresenter: ShapePresenter): void
    /**
     * Handles what happens when a Property is clicked.
     * @param propertyPresenter Presenter of the property selected
     * @param parentShapePresenter Presenter of the shape that the property is on
     */
    selectProperty(propertyPresenter: PropertyPresenter, parentShapePresenter: ShapePresenter): void
    selectPuzzle(presenter : ShapeCollectionPresenter) : void
    /**
     * Keeps track of the number of times the user has forked. Currently forking serves
     * as a guidance for rendering @see PropertyPresenter s before full checkpointing
     * functionality is implemented.
     */
    forkNumber : number
    /**
     * Set in order to keeps track of the property association type selected
     * @param type the PropertyAssociationType set
     */
    setPropertyAssociationType(type: PropertyAssociationType): void
}

export class Controller implements IController {
    private readonly _statusBar: StatusBar
    private readonly _propertyAssociationTypeSelector: PropertyAssociationTypeSelector;
    private readonly _renderer: IRenderer
    constructor(renderer: IRenderer, statusBar: StatusBar) {
        this._renderer = renderer
        this._statusBar = statusBar
        this._propertyAssociationTypeSelector = new PropertyAssociationTypeSelector(this)
        this.forkNumber = 0
    }
    private _selectedProperty : PropertyPresenterFactory | null = null
    addPropertyMode(propertyPresenterFactory : PropertyPresenterFactory) : void {
        this._selectedProperty = propertyPresenterFactory
        if (propertyPresenterFactory.propertyBuilder.associationType.isFinalized) {
            this._propertyAssociationTypeSelector.disable()
        } else {
            this._propertyAssociationTypeSelector.enable()
        }
        if (propertyPresenterFactory.propertyBuilder.associationType.hasValue()) {
            this._propertyAssociationTypeSelector.check(propertyPresenterFactory.propertyBuilder.associationType.value)
        }
    }
    removePropertyMode() : void {
        this._selectedProperty = null
    }
    /**
     * See @see IController#selectShape
     */
    selectShape(shapePresenter : ShapePresenter): void {
        //console.log(shapePresenter)
        //console.log(this._selectedProperty)
        this._statusBar.clear()
        if (this._selectedProperty == null) {
            // If no property is selected, then there's nothing to do.
            return
        }
        try {
            let propertyPresenter : PropertyPresenter = this._selectedProperty.createFromProperty(shapePresenter, this)
            shapePresenter.addProperty(propertyPresenter.property, propertyPresenter)
            shapePresenter.erase()
            shapePresenter.present(this._renderer)
        }
        catch (error) {
            /*
            This can happen if the property already exists or the property
            cannot share the Shape with the properties already associated 
            with the Shape
            */
            this._statusBar.error(error)
        }
    }
    /**
     * @see IController#selectProperty
     */
    selectProperty(propertyPresenter : PropertyPresenter, parentShapePresenter: ShapePresenter): void {
        this._statusBar.clear()
        if (this._selectedProperty != null) { 
            // If some property is selected, then we are in the add property mode. So property clicked on will not be removed.
            return
        }
        // Erasing the parentShapePresenter will also erase all properties of it
        parentShapePresenter.erase()
        parentShapePresenter.removeProperty(propertyPresenter.property, propertyPresenter)
        parentShapePresenter.present(this._renderer)
    }
    selectPuzzle(presenter : ShapeCollectionPresenter) : void {
        let editor = new EditorView(presenter, this, this._renderer)
        this._propertyAssociationTypeSelector.render()
        editor.render()
    }
    forkNumber : number
    setPropertyAssociationType(type: PropertyAssociationType): void {
        if (this._selectedProperty !== null) {
            this._selectedProperty.propertyBuilder.associationType.value = type
        }
    }
}