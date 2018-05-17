import { IConstraint } from "../model/constraint"
import { IPresenter } from "./presenter"
import { IRenderer } from "../renderer/renderer"

export class ConstraintPresenter implements IPresenter {
    private readonly _constraint : IConstraint
    constructor(constraint : IConstraint) {
        this._constraint = constraint
    }
    present(renderer: IRenderer): void {
        throw new Error("Method not implemented.");
    }
}
