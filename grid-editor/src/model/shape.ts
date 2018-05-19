import { Property } from "./property"
import { IConstraint, ConstraintSatifaction } from "./constraint"

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

export abstract class ShapeCollection<TShape extends Shape> {
    protected constructor(shapes : TShape[]) {
        this._shapes = shapes
        this._constrains = new Array<IConstraint>()
        this._propertyNames = new Set<string>()
    }
    private readonly _shapes : TShape[]
    get shapes() : TShape[] {
        return this._shapes
    }
    private readonly _constrains : IConstraint[]
    get constraints() : IConstraint[] {
        return this._constrains
    }
    private readonly _propertyNames : Set<string>
    get propertyNames() : Set<string> {
        return this._propertyNames
    }
    areConstraintsSatisfied() : ConstraintSatifaction {
        let satisfaction = ConstraintSatifaction.Satisfied
        for (let constraint of this.constraints) {
            satisfaction = Math.max(satisfaction, constraint.check().satisfactionLevel)
        }
        return satisfaction
    }
}