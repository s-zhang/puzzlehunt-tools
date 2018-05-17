import * as $ from "jquery"
import { SudokuGrid } from "./model/shapes/sudoku"
import { D3Renderer } from "./renderer/d3Renderer"
import { GridPresenter } from "./presenter/shapePresenters/gridCellPresenter"
import { Property } from "./model/property";
import { TextPropertyPresenter } from "./presenter/propertyPresenters/textPropertyPresenter";
import { Controller } from "./controller";
import { PropertyPresenter } from "./presenter/propertyPresenter";
import { UIView } from "./uiView";

$(() => {
    let sudoku = new SudokuGrid()
    let renderer = new D3Renderer()
    let controller = new Controller(() => {})
    let presenter = new GridPresenter(sudoku, controller)
    
    let initialPropertyPresenters = new Array<PropertyPresenter>()
    for (let i = 1; i <= 9; i++) {
        let property = new Property(i.toString())
        let propertyPresenter = new TextPropertyPresenter(property)
        initialPropertyPresenters.push(propertyPresenter)
    }
    let ui = new UIView(presenter, initialPropertyPresenters, controller, renderer)
    ui.render()
})