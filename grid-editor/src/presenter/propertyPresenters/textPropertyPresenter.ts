import { PropertyPresenter } from "../propertyPresenter"
import { IRenderer, Rect, IRenderedObject } from "../../renderer/renderer"
import { PropertyBuilder } from "../../model/property"

export class TextPropertyPresenter extends PropertyPresenter {
    presentProperty(renderer: IRenderer, boundingBox: Rect) : IRenderedObject {
        return renderer.renderText(
            this.property.name,
            boundingBox,
            this.renderLayer,
            this.forkOpacity)
    }
    public static getKeyboardSelectShortcut(propertyBuilder : PropertyBuilder) : string | null {
        return propertyBuilder.name.substr(0, 1)
    }
}