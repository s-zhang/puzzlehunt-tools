import { PropertyPresenter } from "../propertyPresenter";
import { IRenderer, Rect, IRenderedObject } from "../../renderer/renderer";
import { Property } from "../../model/property";

/**
 * Presenter of a horizontal line in a @see Cell
 */
export class HorizontalCellLinePropertyPresenter extends PropertyPresenter {
    protected presentProperty(renderer: IRenderer, boundingBox: Rect): IRenderedObject {
        let renderedObject = renderer.renderRectangle(
            boundingBox.x,
            boundingBox.centerY - 4,
            boundingBox.width,
            8,
            this.renderLayer,
            "black",
            this.forkOpacity)
        return renderedObject
    }
    public static getKeyboardSelectShortcut(property : Property) : string | null {
        return "-";
    }
}

/**
 * Presenter of a vertical line in a @see Cell
 */
export class VerticalCellLinePropertyPresenter extends PropertyPresenter {
    protected presentProperty(renderer: IRenderer, boundingBox: Rect): IRenderedObject {
        let renderedObject = renderer.renderRectangle(
            boundingBox.centerX - 4,
            boundingBox.y,
            8,
            boundingBox.height,
            this.renderLayer,
            "black",
            this.forkOpacity)
        return renderedObject
    }
    public static getKeyboardSelectShortcut(property : Property) : string | null {
        return "|";
    }
}

/**
 * Presenter of a line that goes down and then turns left in a @see Cell
 */
export class NorthWestBendCellLinePropertyPresenter extends PropertyPresenter {
    protected presentProperty(renderer: IRenderer, boundingBox: Rect): IRenderedObject {
        let renderedObject = renderer.renderTurn(
            boundingBox.centerX, boundingBox.top + 4,
            boundingBox.centerX, boundingBox.centerY,
            boundingBox.left + 4, boundingBox.centerY,
            4,
            this.renderLayer,
            this.forkOpacity)
        return renderedObject
    }

    public static getKeyboardSelectShortcut(property : Property) : string | null {
        return null;
    }
}

/**
 * @see NorthWestBendCellLinePropertyPresenter
 */
export class NorthEastBendCellLinePropertyPresenter extends PropertyPresenter {
    protected presentProperty(renderer: IRenderer, boundingBox: Rect): IRenderedObject {
        let renderedObject = renderer.renderTurn(
            boundingBox.centerX, boundingBox.top + 4,
            boundingBox.centerX, boundingBox.centerY,
            boundingBox.right - 4, boundingBox.centerY,
            4,
            this.renderLayer,
            this.forkOpacity)
        return renderedObject
    }

    public static getKeyboardSelectShortcut(property : Property) : string | null {
        return null;
    }
}

/**
 * @see NorthWestBendCellLinePropertyPresenter
 */
export class SouthWestBendCellLinePropertyPresenter extends PropertyPresenter {
    protected presentProperty(renderer: IRenderer, boundingBox: Rect): IRenderedObject {
        let renderedObject = renderer.renderTurn(
            boundingBox.centerX, boundingBox.bottom - 4,
            boundingBox.centerX, boundingBox.centerY,
            boundingBox.left + 4, boundingBox.centerY,
            4,
            this.renderLayer,
            this.forkOpacity)
        return renderedObject
    }

    public static getKeyboardSelectShortcut(property : Property) : string | null {
        return null;
    }
}

/**
 * @see NorthWestBendCellLinePropertyPresenter
 */
export class SouthEastBendCellLinePropertyPresenter extends PropertyPresenter {
    protected presentProperty(renderer: IRenderer, boundingBox: Rect): IRenderedObject {
        let renderedObject = renderer.renderTurn(
            boundingBox.centerX, boundingBox.bottom - 4,
            boundingBox.centerX, boundingBox.centerY,
            boundingBox.right - 4, boundingBox.centerY,
            4,
            this.renderLayer,
            this.forkOpacity)
        return renderedObject
    }

    public static getKeyboardSelectShortcut(property : Property) : string | null {
        return null;
    }
}

