import { PropertyPresenter } from "../propertyPresenter"
import { IRenderer, Rect, IRenderedObject } from "../../renderer/renderer"
import { IFlexiblePresenter } from "../presenter";
import { Property } from "../../model/property";

export class TextPropertyPresenter extends PropertyPresenter implements IFlexiblePresenter {
    presentProperty(renderer: IRenderer, boundingBox: Rect) : IRenderedObject {
        return renderer.renderText(this.property.name, boundingBox, this.renderLayer)
    }
}