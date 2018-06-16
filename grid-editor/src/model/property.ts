/**
 * Properties associates with @see Shape s and are what the rules of the puzzle (@see IConstraint)
 * act upon. E.g. numbers 1 through 9 are the properties of the @see Cell s on a Sudoku board.
 */
export class Property {
    private readonly _name : string;
    constructor(name : string) {
        this._name = name
    }
    get name() : string {
        return this._name
    }
}