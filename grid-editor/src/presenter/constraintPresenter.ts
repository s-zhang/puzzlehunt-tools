import { IConstraint } from "../model/constraint"
import { IPresenter } from "./presenter"
import { IRenderer, Rect } from "../renderer/renderer"

export class ConstraintPresenter implements IPresenter {
    private readonly _constraint : IConstraint
    constructor(constraint : IConstraint) {
        this._constraint = constraint
    }
    present(renderer: IRenderer, boudingBox : Rect): void {
        throw new Error("Method not implemented.")
    }
    remove(): void {
        throw new Error("Method not implemented.")
    }
}
