import { Property, PropertyAssociationType } from "./property"
import { IConstraint, ConstraintSatifaction } from "./constraint"

/**
 * Shapes represents components of a puzzle board. E.g. the border of a cell in a grid
 */
export abstract class Shape {
    constructor() {
        this._properties = new Set<Property>();
        this._strictestPropertyAssociationType = PropertyAssociationType.Multiple
    }

    private _properties : Set<Property>
    private _strictestPropertyAssociationType: PropertyAssociationType
    get properties() : Set<Property> {
        return this._properties
    }
    /**
     * Tries to add the property to the shape. The property might be not added
     * because of the property association type prohibits.
     * @param property 
     */
    addProperty(property: Property): void {
        if (this.properties.has(property))
        {
            throw new Error(`Selected shape already has property "${property.name}"`)
        }
        switch (property.associationType) {
            case PropertyAssociationType.Multiple:
                if (this._strictestPropertyAssociationType == PropertyAssociationType.Single) {
                    throw new Error(`Cannot add property "${property.name}" since 
Shape already has a single association property`)
                }
                break
            case PropertyAssociationType.SemiSingle:
                if (this._strictestPropertyAssociationType != PropertyAssociationType.Multiple) {
                    throw new Error(`Property "${property.name}" of association type 
"${property.associationType}" cannot share a Shape with other single or semi-single association properties!`)
                }
                break
            case PropertyAssociationType.Single:
                if (this.properties.size != 0) {
                    throw new Error(`Property "${property.name}" of association type 
"${property.associationType}" cannot share a Shape with other properties!`)
                }
                break
        }
        this._strictestPropertyAssociationType = property.associationType
        this.properties.add(property)
    }
    /**
     * Removes the property from the shape
     */
    removeProperty(property: Property): void {
        if (property.associationType >= PropertyAssociationType.SemiSingle) {
            this._strictestPropertyAssociationType = PropertyAssociationType.Multiple
        }
        this._properties.delete(property)
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