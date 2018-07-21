import { ProtectedAcessor } from "../utils/protectedAccessor";

/**
 * Properties associates with {@link Shape}s and are what the rules of the puzzle ({@link IConstraint}s)
 * act upon. E.g. numbers 1 through 9 are the properties of the @see Cell s on a Sudoku board.
 */
export class Property {
    public readonly name: string
    public readonly associationType: PropertyAssociationType
    constructor(name : string, associationType: PropertyAssociationType = PropertyAssociationType.Multiple) {
        this.name = name
        this.associationType = associationType
    }
}

/**
 * Different modes a Property associate with a Shape
 */
export enum PropertyAssociationType {
    /**
     * Multiple Properties of this type can be associated with the same Shape
     */
    Multiple = "Multiple",
    /**
     * At most one Property of this type and multiple Properties of the Multiple type
     * can be associated with the same Shape.
     */
    SemiSingle = "SemiSingle",
    /**
     * At most one Property of this type can be associated with the same Shape
     */
    Single = "Single"
}

export const allPropertyAssociationTypes: PropertyAssociationType[] =
    [PropertyAssociationType.Multiple, PropertyAssociationType.SemiSingle, PropertyAssociationType.Single]

/**
 * Builder (factory) for {@link Property}s. This is needed in order to keep track of 
 * {@link PropertyAssociationType} of the property before they are created.
 */
export class PropertyBuilder {
    public readonly name: string
    constructor(name : string) {
        this.name = name
    }
    public readonly associationType: ProtectedAcessor<PropertyAssociationType>
        = new ProtectedAcessor<PropertyAssociationType>()
    public create(): Property {
        return new Property(this.name, this.associationType.value)
    }
}