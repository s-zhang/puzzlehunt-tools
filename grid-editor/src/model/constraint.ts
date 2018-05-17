import { Shape } from "./shape"

export interface IConstraint {
    isSatisfied() : ConstraintSatifaction
}

export enum ConstraintSatifaction {
    Satisfied = 0,
    NotSatisfied = 1,
    Unsatisfiable = 2
}

export class ShapesConstraint<TShape extends Shape> implements IConstraint {
    private _shapes : TShape[]
    private _constraint : (shapes: TShape[]) => ConstraintSatifaction
    constructor(shapes : TShape[], constraint : (shapes: TShape[]) => ConstraintSatifaction) {
        this._shapes = shapes
        this._constraint = constraint
    }
    isSatisfied() {
        return this._constraint(this._shapes)
    }
}