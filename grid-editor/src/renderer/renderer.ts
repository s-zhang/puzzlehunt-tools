export interface IRenderer {
    renderArea : Rect
    renderCircle(x : number, y : number, radius : number) : IRenderedObject
    renderRectangle(x : number, y : number, width : number, height : number, layer : number[]) : IRenderedObject
    renderLine(fromX : number, fromY : number, toX : number, toY : number, layer : number[]) : IRenderedObject
    renderText(text : string, boundingBox : Rect, layer : number[]) : IRenderedObject
    renderButton(text : string, divId : string) : IRenderedObject
    clear() : void
}

export class Rect {
    readonly x : number
    readonly y : number
    readonly width : number
    readonly height : number
    constructor(x : number, y : number, width : number, height : number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
    get centerX(): number {
        return this.x + Math.floor(this.width / 2)
    }
    get centerY(): number {
        return this.y + Math.floor(this.height / 2)
    }
}

export const NO_BOUNDING_BOX = new Rect(-1, -1, -1, -1)

export interface IRenderedObject {
    onclick(handler : () => void) : void
    erase() : void
    color(color : string) : void
    reset() : void
    makeTransparent() : void
}

export interface IRenderedEffect {
    undo() : void
}

export const NotRenderedObject : IRenderedObject = {
    onclick(handler : () => void) : void {
        ThrowObjectNotRenderedError()
    },
    erase() : void {
        ThrowObjectNotRenderedError()
    },
    color(color : string) : void {
        ThrowObjectNotRenderedError()
    },
    reset() : void {
        ThrowObjectNotRenderedError()
    },
    makeTransparent() : void {
        ThrowObjectNotRenderedError()
    }
}

function ThrowObjectNotRenderedError() : any {
    throw new Error("Object not rendered yet!")
}