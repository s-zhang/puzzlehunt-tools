import * as $ from "jquery"
import * as d3 from 'd3'
import { IRenderer, Rect, IRenderedObject, IRenderedEffect } from "./renderer"

export class D3Renderer implements IRenderer {
    private readonly _canvas : d3.Selection<d3.BaseType, {}, HTMLElement, any>
    private readonly _xOffset : number = 10
    private readonly _yOffset : number = 10
    private readonly _renderArea : Rect
    constructor() {
        this._renderArea = new Rect(0, 0, 700, 700)
        this._canvas = d3.select("#canvas")
            .append("svg")
            .attr("id", "svgcanvas")
            .attr("width", `${this._renderArea.width}px`)
            .attr("height", `${this._renderArea.height}px`)
    }
    get renderArea() : Rect {
        return this._renderArea
    }
    renderCircle(x: number, y: number, radius: number, layer : number[], opacity : number): IRenderedObject {
        return new D3RenderedObject(this.getLayer(layer).append("circle")
            .attr("cx", this._xOffset + x)
            .attr("cy", this._yOffset + y)
            .attr("r", radius)
            .attr("pointer-events", "all")
            .style("fill", "black")
            .style("opacity", opacity))
    }
    renderRectangle(x: number, y: number, width: number, height: number, layer : number[], color : string, opacity : number): IRenderedObject {
        return new D3RenderedObject(this.getLayer(layer).append("rect")
            .attr("x", this._xOffset + x)
            .attr("y", this._yOffset + y)
            .attr("width", width)
            .attr("height", height)
            .attr("pointer-events", "all")
            .style("fill", color)
            .style("opacity", opacity)
            .style("stroke", "none"))
    }
    renderLine(fromX: number, fromY: number, toX: number, toY: number, layer : number[], opacity : number): IRenderedObject {
        return new D3RenderedObject(this.getLayer(layer).append("line")
            .attr("x1", this._xOffset + fromX)
            .attr("y1", this._yOffset + fromY)
            .attr("x2", this._xOffset + toX)
            .attr("y2", this._yOffset + toY)
            .style("stroke", "#000")
            .style("stroke-width", "2")
            .style("opacity", opacity))
            
        /*
        using jquery doesn't seem to trigger redraw of svg
        let line = $(`<line x1="${this._xOffset + fromX}" y1="${this._yOffset + fromY}" x2="${this._xOffset + toX}" y2="${this._yOffset + toY}" style="stroke:#000;stroke-width:2" />`)
        line.appendTo($("#svgcanvas"))
        return new JQueryRenderedObject(line)*/
    }
    renderText(text: string, boundingBox : Rect, layer : number[], opacity : number): IRenderedObject {
        //let fontSize = 15
        //let fontSize = 32
        let fontSize = (32 - 15) / (50 - 8) * (boundingBox.minSide - 50) + 32
        return new D3RenderedObject(this.getLayer(layer).append("text")
            .attr("x", this._xOffset + boundingBox.centerX)
            .attr("y", this._yOffset + boundingBox.centerY + Math.floor(fontSize / 2) - 3)
            .attr("font-size", fontSize)
            .attr("text-anchor", "middle")
            .attr("font-family", "Verdana")
            .style("opacity", opacity)
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
    private getLayer(layerNumbers : number[]) : d3.Selection<d3.BaseType, {}, HTMLElement, any> {
        let selection = this._canvas

        for (let layerLevel = 0; layerLevel < layerNumbers.length; layerLevel++) {
            let layerNumber = layerNumbers[layerLevel]
            let newSelection = selection.select(`.layer-level-${layerLevel}#layer-${layerNumber}`)
            if (newSelection.empty()) {
                for (let i = 0; i <= layerNumber; i++) {
                    if (selection.select(`.layer-level-${layerLevel}#layer-${i}`).empty()) {
                        selection.append("g")
                            .attr("id", `layer-${i}`)
                            .attr("class", `layer-level-${layerLevel}`)
                    }
                }
                newSelection = selection.select(`.layer-level-${layerLevel}#layer-${layerNumber}`)
            }
            selection = newSelection
        }
        return selection
    }
}

abstract class RenderedObject<TElement> implements IRenderedObject {
    protected readonly element : TElement
    constructor(element : TElement) {
        this.element = element
    }
    abstract onclick(handler: () => void): void
    abstract erase(): void
    
    private _renderedEffects : IRenderedEffect[] = new Array<IRenderedEffect>()
    reset(): void {
        for (let i = this._renderedEffects.length - 1; i >= 0 ; i--) {
            this._renderedEffects[i].undo()
        }
        this._renderedEffects = []
    }
    color(color : string) : void {
        this._renderedEffects.push(this.colorWithEffect(color))
    }
    protected abstract colorWithEffect(color : string): IRenderedEffect
    makeTransparent() : void {
        this._renderedEffects.push(this.makeTransparentWithEffect())
    }

    abstract makeTransparentWithEffect(): IRenderedEffect
}

class D3RenderedObject extends RenderedObject<d3.Selection<d3.BaseType, {}, HTMLElement, any>> implements IRenderedObject {
    constructor(element : d3.Selection<d3.BaseType, {}, HTMLElement, any>) {
        super(element)
        //console.log((<any> this.element.node()).getBBox())
    }
    onclick(handler: () => void): void {
        this.element.on("click", handler)
    }
    erase(): void {
        this.element.remove()
    }
    colorWithEffect(color : string): IRenderedEffect {
        //let boudingBox = <SVGRect> (<any> this.element.node()).getBBox()
        let element = this.element
        let originalColor = element.style("fill")
        element.style("fill", color)
        return {
            undo() {
                element.style("fill", originalColor)
            }
        }
    }
    makeTransparentWithEffect(): IRenderedEffect {
        let element = this.element
        element.attr("visibility", "hidden")
        return {
            undo() {
                element.attr("visibility", null)
            }
        }
    }
}

class JQueryRenderedObject extends RenderedObject<JQuery<HTMLElement>> implements IRenderedObject {
    constructor(element : JQuery<HTMLElement>) {
        super(element)
    }
    onclick(handler: () => void): void {
        this.element.click(handler)
    }
    erase(): void {
        this.element.remove()
    }
    colorWithEffect(color : string): IRenderedEffect {
        //this.element
        throw new Error("Method not implemented!")
        
    }
    makeTransparentWithEffect() : IRenderedEffect {
        let element = this.element
        element.attr("visibility", "hidden")
        return {
            undo() {
                element.removeAttr("visibility")
            }
        }
    }
}