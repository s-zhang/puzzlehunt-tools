import { Property } from "../model/property"
import { IRenderer, Rect } from "../renderer/renderer"

export abstract class PropertyPresenter {
    readonly property : Property
    constructor(property : Property) {
        this.property = property
    }
    abstract present(renderer : IRenderer, boundingBox : Rect) : void
}