import * as $ from "jquery"
import { SudokuGrid } from "./model/shapes/sudoku"
import { D3Renderer } from "./renderer/d3Renderer"
import { GridPresenter } from "./presenter/shapePresenters/gridCellPresenter"
import { Property } from "./model/property";
import { TextPropertyPresenter } from "./presenter/propertyPresenters/textPropertyPresenter";
import { UIController } from "./presenter/uiController";

// Set jquery '$' variable as a global
(window as any).$ = $

$(() => {
    let sudoku = new SudokuGrid()
    let renderer = new D3Renderer()
    let presenter = new GridPresenter(sudoku)
    //presenter.shapePresenters[15].addProperty(new TextPropertyPresenter(new Property("5")))
    presenter.present(renderer)

    let ui = new UIController(() => {
        renderer.clear()
        presenter.present(renderer)
    }, renderer)

    for (let i = 1; i <= 9; i++) {
        let button = $(`<input type="button" value="${i}" />`)
        let property = new Property(i.toString())
        let propertyPresenter = new TextPropertyPresenter(property)
        button.click(() => { ui.selectProperty(propertyPresenter) })
        button.appendTo($("#toolbar"))
    }
    for (let shapePresenter of presenter.shapePresenters) {
        shapePresenter.renderedObject.onclick(() => { ui.selectShape(shapePresenter) })
    }
})