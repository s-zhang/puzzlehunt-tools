/**
 * Renderer is a low level class (compared to @see Presenter and @see View) that handles rendering shapes and text 
 * on certain locations on a canvas
 */
export interface IRenderer {
    renderArea : Rect
    renderCircle(x : number, y : number, radius : number, layer : number[], opacity : number) : IRenderedObject
    renderRectangle(x : number, y : number, width : number, height : number, layer : number[], color : string, opacity : number) : IRenderedObject
    renderLine(fromX : number, fromY : number, toX : number, toY : number, layer : number[], opacity : number) : IRenderedObject
    renderText(text : string, boundingBox : Rect, layer : number[], opacity : number) : IRenderedObject
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
    divide(rows : number, columns : number) : Rect[] {
        let subRects = new Array<Rect>()
        let subRectWidth = this.width / columns
        let subRectHeight = this.height / rows
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                subRects.push(new Rect(
                    this.x + subRectWidth * j,
                    this.y + subRectHeight * i,
                    subRectWidth,
                    subRectHeight))
            }
        }
        return subRects
    }
    get minSide() : number {
        return this.width < this.height ? this.width : this.height
    }
}

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