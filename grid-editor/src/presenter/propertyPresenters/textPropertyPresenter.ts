import { PropertyPresenter } from "../propertyPresenter"
import { IRenderer, Rect, IRenderedObject } from "../../renderer/renderer"
import { IPresenter } from "../presenter";
import { Property } from "../../model/property";

export class TextPropertyPresenter extends PropertyPresenter implements IPresenter {
    presentProperty(renderer: IRenderer, boundingBox: Rect) : IRenderedObject {
        return renderer.renderText(this.property.name, boundingBox)
    }
}