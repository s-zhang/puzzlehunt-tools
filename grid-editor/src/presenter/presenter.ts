import { IRenderer, IRenderedObject, NotRenderedObject, Rect } from "../renderer/renderer"

export interface IPresenter {
    present(renderer : IRenderer, boudingBox : Rect) : void
    remove() : void
}

export abstract class Presenter implements IPresenter {
    protected renderedObject : IRenderedObject
    constructor() {
        this.renderedObject = NotRenderedObject
    }
    protected removeRenderedObject() : void {
        this.renderedObject.remove()
        this.renderedObject = NotRenderedObject
    }

    abstract present(renderer: IRenderer, boudingBox : Rect): void
    abstract remove(): void
    protected represent(renderer: IRenderer, boudingBox : Rect): void {
        this.remove()
        this.present(renderer, boudingBox)
    }
}
