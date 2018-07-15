import { PropertyPresenter } from "../propertyPresenter";
import { IRenderer, Rect, IRenderedObject } from "../../renderer/renderer";
import { Property } from "../../model/property";

/**
 * Presenter of lines on a @see CellBorder
 */
export class CellBorderLinePropertyPresenter extends PropertyPresenter {
    protected presentProperty(renderer: IRenderer, boundingBox: Rect): IRenderedObject {
        let renderedObject = renderer.renderRectangle(
            boundingBox.x,
            boundingBox.y,
            boundingBox.width,
            boundingBox.height,
            this.renderLayer,
            "black",
            this.forkOpacity)
        return renderedObject
    }
    public static getKeyboardSelectShortcut(property : Property) : string | null {
        return "l"
    }
}