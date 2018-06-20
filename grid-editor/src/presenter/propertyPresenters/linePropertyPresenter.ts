import { PropertyPresenter } from "../propertyPresenter";
import { IFlexiblePresenter } from "../presenter";
import { IRenderer, Rect, IRenderedObject } from "../../renderer/renderer";
import { Property } from "../../model/property";
import { ShapePresenter } from "../shapePresenter";
import { IController } from "../../controller";

export class LinePropertyPresenter extends PropertyPresenter implements IFlexiblePresenter {
    protected presentProperty(renderer: IRenderer, boundingBox: Rect): IRenderedObject {
        let renderedObject = renderer.renderRectangle(
            boundingBox.x,
            boundingBox.y,
            boundingBox.width,
            boundingBox.height,
            this.renderLayer,
            "black")
        return renderedObject
    }
    public static getKeyboardSelectShortcut(property : Property) : string {
        return "l"
    }
}