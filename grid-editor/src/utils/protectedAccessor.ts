/**
 * Wrapper for a field that can be made readonly
 */
export class ProtectedAcessor<T> {
    private _isFinalized: boolean = false
    private _value?: T
    get value(): T {
        if (!this.hasValue()) {
            throw new Error("Value is not set")
        }
        return this._value!
    }
    set value(value: T) {
        if (this._isFinalized) {
            throw new Error("Value has been set already")
        }
        this._value = value
    }
    get isFinalized(): boolean {
        return this._isFinalized
    }
    finalize(): void {
        if (this._value === undefined) {
            throw new Error("Value is not set")
        }
        this._isFinalized = true
    }
    hasValue(): boolean {
        return this._value !== undefined
    }
}