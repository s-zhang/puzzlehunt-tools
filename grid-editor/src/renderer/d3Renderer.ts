import * as $ from "jquery"
import * as d3 from 'd3'
import { IRenderer, Rect, IRenderedObject } from "./renderer"

export class D3Renderer implements IRenderer {
    private readonly _canvas : d3.Selection<d3.BaseType, {}, HTMLElement, any>
    private readonly _xOffset : number = 10
    private readonly _yOffset : number = 10
    private readonly _renderArea : Rect
    constructor() {
        this._renderArea = new Rect(0, 0, 700, 700)
        this._canvas = d3.select("#canvas")
            .append("svg")
            .attr("width", `${this._renderArea.width}px`)
            .attr("height", `${this._renderArea.height}px`)
    }
    get renderArea() : Rect {
        return this._renderArea
    }
    renderCircle(x: number, y: number, radius: number): D3RenderedObject {
        throw new Error("Method not implemented.");
    }
    renderRectangle(x: number, y: number, width: number, height: number): D3RenderedObject {
        return new D3RenderedObject(this._canvas.append("rect")
            .attr("x", this._xOffset + x)
            .attr("y", this._yOffset + y)
            .attr("width", width)
            .attr("height", height)
            .style("fill", "#fff")
            .style("stroke", "#222"))
    }
    //renderLine(x : number, y : number, )
    renderText(text: string, boundingBox : Rect): D3RenderedObject {
        let fontSize = 32
        return new D3RenderedObject(this._canvas.append("text")
            .attr("x", this._xOffset + boundingBox.centerX)
            .attr("y", this._yOffset + boundingBox.centerY + Math.floor(fontSize / 2) - 3)
            .attr("font-size", fontSize)
            .attr("text-anchor", "middle")
            .attr("font-family", "Verdana")
            .text(text))
    }
    renderButton(text : string, divId : string) : IRenderedObject {
        let button = $(`<input type="button" value="${text}" />`)
        button.appendTo($(`#${divId}`))
        return new JQueryRenderedObject(button)
    }
    clear(): void {
        this._canvas.selectAll("*").remove()
    }
}

abstract class RenderedObject<TElement> implements IRenderedObject {
    protected readonly element : TElement
    constructor(element : TElement) {
        this.element = element
    }
    abstract onclick(handler: () => void): void
    abstract remove(): void
}

class D3RenderedObject extends RenderedObject<d3.Selection<d3.BaseType, {}, HTMLElement, any>> implements IRenderedObject {
    constructor(element : d3.Selection<d3.BaseType, {}, HTMLElement, any>) {
        super(element)
    }
    onclick(handler: () => void): void {
        this.element.on("click", handler)
    }
    remove(): void {
        this.element.remove()
    }
}

class JQueryRenderedObject extends RenderedObject<JQuery<HTMLElement>> implements IRenderedObject {
    constructor(element : JQuery<HTMLElement>) {
        super(element)
    }
    onclick(handler: () => void): void {
        this.element.click(handler)
    }
    remove(): void {
        throw new Error("Method not implemented.")
    }
}