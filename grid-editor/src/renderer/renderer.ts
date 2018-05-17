export interface IRenderer {
    renderArea : Rect
    renderCircle(x : number, y : number, radius : number) : IRenderedObject
    renderRectangle(x : number, y : number, width : number, height : number) : IRenderedObject
    //renderLine(x : number, y : number, )
    renderText(text : string, boundingBox : Rect) : IRenderedObject
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

export interface IRenderedObject {
    onclick(handler : () => void) : void
    remove() : void
}

export const NotRenderedObject : IRenderedObject = {
    onclick(handler : () => void) : void {
        ThrowObjectNotRenderedError()
    },
    remove() : void {
        ThrowObjectNotRenderedError()
    }
}

function ThrowObjectNotRenderedError() {
    throw new Error("Object not rendered yet!")
}