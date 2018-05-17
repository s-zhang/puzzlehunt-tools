import { PropertyPresenter } from "../propertyPresenter"
import { IRenderer, Rect } from "../../renderer/renderer"
import { IPresenter } from "../presenter";

export class TextPropertyPresenter extends PropertyPresenter implements IPresenter {
    present(renderer: IRenderer, boundingBox: Rect): void {
        this.renderedObject = renderer.renderText(this.property.name, boundingBox)
    }
}
