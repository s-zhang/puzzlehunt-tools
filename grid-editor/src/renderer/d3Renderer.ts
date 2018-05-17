import * as d3 from 'd3'
import { IRenderer, Rect, IRenderedObject } from "./renderer"

export class D3Renderer implements IRenderer {
    private readonly _canvas : d3.Selection<d3.BaseType, {}, HTMLElement, any>
    private readonly _xOffset : number = 10
    private readonly _yOffset : number = 10
    constructor() {
        this._canvas = d3.select("#canvas")
            .append("svg")
            .attr("width", "700px")
            .attr("height", "700px")
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
    clear(): void {
        this._canvas.selectAll("*").remove()
    }
}

export class D3RenderedObject implements IRenderedObject {
    private readonly _d3Element : d3.Selection<d3.BaseType, {}, HTMLElement, any>
    constructor(d3Element : d3.Selection<d3.BaseType, {}, HTMLElement, any>) {
        this._d3Element = d3Element
    }
    onclick(handler: () => void): void {
        this._d3Element.on("click", handler)
    }
    remove(): void {
        this._d3Element.remove()
    }
}