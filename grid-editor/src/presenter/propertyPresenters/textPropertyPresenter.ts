import { PropertyPresenter } from "../propertyPresenter"
import { IRenderer, Rect } from "../../renderer/renderer"

export class TextPropertyPresenter extends PropertyPresenter {
    present(renderer: IRenderer, boundingBox: Rect): void {
        renderer.renderText(this.property.name, boundingBox)
    }
}
