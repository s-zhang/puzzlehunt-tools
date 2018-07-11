import { IRenderer, IRenderedObject, NotRenderedObject, Rect } from "../renderer/renderer"

/**
 * Utility class shared among presenters
 */
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

/**
 * Presenters that supports being marked as violating certain @see IConstraint s
 */
export interface IMarkablePresenter {
    markForViolation() : void
    unmarkForViolation() : void
}