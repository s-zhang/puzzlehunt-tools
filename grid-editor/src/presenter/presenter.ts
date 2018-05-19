import { IRenderer, IRenderedObject, NotRenderedObject, Rect } from "../renderer/renderer"

export interface IPresenter {
    present(renderer : IRenderer, boudingBox : Rect) : void
    erase() : void
}

export abstract class Presenter implements IPresenter {
    public renderedObject : IRenderedObject
    constructor() {
        this.renderedObject = NotRenderedObject
    }
    protected eraseRenderedObject() : void {
        this.renderedObject.erase()
        this.renderedObject = NotRenderedObject
    }

    abstract present(renderer: IRenderer, boudingBox : Rect): void
    abstract erase(): void
    protected represent(renderer: IRenderer, boudingBox : Rect): void {
        this.erase()
        this.present(renderer, boudingBox)
    }
}
