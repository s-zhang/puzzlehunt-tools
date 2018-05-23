import { IRenderer, IRenderedObject, NotRenderedObject, Rect } from "../renderer/renderer"

export interface IFixedPresenter {
    present(renderer : IRenderer) : void
    erase() : void
}

export abstract class Presenter {
    protected renderedObject : IRenderedObject
    public readonly renderLayer : number[]
    protected constructor(renderLayer : number[], isVisible : boolean) {
        this.renderedObject = NotRenderedObject
        this.renderLayer = renderLayer
    }
    protected eraseSelf() : void {
        if (this.renderedObject != NotRenderedObject) {
            this.renderedObject.erase()
            this.renderedObject = NotRenderedObject
        }
    }
    public abstract erase(): void
}

export abstract class FixedPresenter extends Presenter implements IFixedPresenter {
    constructor(renderLayer : number[], isVisible : boolean = true) {
        super(renderLayer, isVisible)
    }
    abstract present(renderer: IRenderer): void
}

export interface IFlexiblePresenter {
    present(renderer : IRenderer, boudingBox : Rect) : void
    erase() : void
}

export abstract class FlexiblePresenter implements IFlexiblePresenter {
    protected renderedObject : IRenderedObject
    public readonly renderLayer : number[]
    constructor(renderLayer : number[]) {
        this.renderedObject = NotRenderedObject
        this.renderLayer = renderLayer
    }
    protected eraseRenderedObject() : void {
        this.renderedObject.erase()
        this.renderedObject = NotRenderedObject
    }

    abstract present(renderer: IRenderer, boudingBox : Rect): void
    abstract erase(): void
}

export interface IMarkablePresenter {
    markForViolation() : void
    unmarkForViolation() : void
}