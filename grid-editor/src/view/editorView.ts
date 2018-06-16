import * as $ from "jquery"
import { IRenderer, Rect } from "../renderer/renderer";
import { ShapeCollectionPresenter } from "../presenter/shapePresenter";
import { IController } from "../controller";
import { View } from "./view";

export class EditorView extends View {
    private readonly _shapeCollectionPresenter : ShapeCollectionPresenter
    constructor(shapeCollectionPresenter : ShapeCollectionPresenter,
        controller : IController,
        renderer : IRenderer) {
        super(controller, renderer)
        this._shapeCollectionPresenter = shapeCollectionPresenter
    }
    render(): void {
        this._shapeCollectionPresenter.present(this.renderer)

        for (let propertyPresenter of this._shapeCollectionPresenter.propertyPresenterFactories) {
            let propertySelectorButton = this.renderer.renderButton(propertyPresenter.property.name, "toolbar")
            propertySelectorButton.onclick(() => this.controller.addPropertyMode(propertyPresenter))
            if (propertyPresenter.keyboardSelectShortcut != null) {
                $(document).keypress(event => {
                    if (event.which == propertyPresenter.keyboardSelectShortcut!.toLowerCase().charCodeAt(0)) {
                        this.controller.addPropertyMode(propertyPresenter)
                    }
                })
            }
        }
        
        let propertyRemoveButton = this.renderer.renderButton("remove", "toolbar")
        propertyRemoveButton.onclick(() => this.controller.removePropertyMode())
        $(document).keypress(event => {
            if (event.which == "r".charCodeAt(0)) {
                this.controller.removePropertyMode()
            }
        })
    }
}