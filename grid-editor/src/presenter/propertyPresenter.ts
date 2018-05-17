import { Property } from "../model/property"
import { IRenderer, Rect } from "../renderer/renderer"
import { Presenter, IPresenter } from "./presenter";

export abstract class PropertyPresenter extends Presenter implements IPresenter {
    readonly property : Property
    constructor(property : Property) {
        super()
        this.property = property
    }
    remove() : void {
        this.removeRenderedObject()
    }
}