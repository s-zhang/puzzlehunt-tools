import { Property } from "./property"
import { IConstraint, ConstraintSatifaction } from "./constraint"

/**
 * Shapes represents components of a puzzle board. E.g. the border of a cell in a grid
 */
export abstract class Shape {
    constructor() {
        this._properties = new Set<Property>();
    }

    private _properties : Set<Property>
    get properties() : Set<Property> {
        return this._properties
    }
    get property() : Property | null {
        let singleProperty : Property | null = null
        for (let property of this.properties.values()) {
            if (singleProperty == null) {
                singleProperty = property
            } else {
                throw new Error("More than one property found")
            }
        }
        return singleProperty
    }
}

/**
 * ShapeCollections represent the puzzle board and keeps track of the @see Shape s that
 * consist the board
 */
export interface IShapeCollection<TShape extends Shape> {
    readonly shapes : TShape[]
    readonly constraints : IConstraint[]
    //readonly propertyNames : Set<string>
    areConstraintsSatisfied() : ConstraintSatifaction
}

export class ShapeCollection<TShape extends Shape> implements IShapeCollection<TShape> {
    public constructor(shapes : TShape[]) {
        this.shapes = shapes
        this.constraints = new Array<IConstraint>()
        //this.propertyNames = new Set<string>()
    }
    public readonly shapes : TShape[]
    public readonly constraints : IConstraint[]
    //public readonly propertyNames : Set<string>
    public areConstraintsSatisfied() : ConstraintSatifaction {
        let satisfaction = ConstraintSatifaction.Satisfied
        for (let constraint of this.constraints) {
            satisfaction = Math.max(satisfaction, constraint.check().satisfactionLevel)
        }
        return satisfaction
    }
}