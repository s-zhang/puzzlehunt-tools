import { Shape } from "./shape"
import { Property } from "./property";

/**
 * Constraints act on @see Property s define the rules of the puzzle
 */
export interface IConstraint {
    check() : ConstraintCheckResult
}

export class ConstraintCheckResult {
    public readonly isSatisfied : boolean
    public readonly violations : [Shape, Property][]
    constructor(isSatisfied : boolean, violations : [Shape, Property][]) {
        this.isSatisfied = isSatisfied
        this.violations = violations
    }
    get satisfactionLevel() : ConstraintSatifaction{
        if (this.isSatisfied) {
            return ConstraintSatifaction.Satisfied
        } else if (this.violations.length == 0) {
            return ConstraintSatifaction.NotSatisfied
        } else {
            return ConstraintSatifaction.Unsatisfiable
        }
    }
}

export enum ConstraintSatifaction {
    Satisfied = 0,
    NotSatisfied = 1,
    Unsatisfiable = 2
}

export class ShapesConstraint<TShape extends Shape> implements IConstraint {
    private _shapes : TShape[]
    private _constraint : (shapes: TShape[]) => ConstraintCheckResult
    constructor(shapes : TShape[], constraint : (shapes: TShape[]) => ConstraintCheckResult) {
        this._shapes = shapes
        this._constraint = constraint
    }
    check(): ConstraintCheckResult {
        return this._constraint(this._shapes)
    }
}