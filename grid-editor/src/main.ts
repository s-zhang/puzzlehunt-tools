import * as $ from "jquery"
import { SudokuGrid } from "./model/shapes/sudoku"
import { D3Renderer } from "./renderer/d3Renderer"
import { GridPresenter } from "./presenter/shapePresenters/gridCellPresenter"
import { Property } from "./model/property";
import { TextPropertyPresenter } from "./presenter/propertyPresenters/textPropertyPresenter";
import { Controller } from "./controller";
import { PropertyPresenter, PropertyPresenterFactory } from "./presenter/propertyPresenter";
import { EditorView } from "./view/editorView";
import { CellBorderLinePropertyPresenter } from "./presenter/propertyPresenters/cellBorderLinePropertyPresenter";
import { SlitherLinkGrid } from "./model/shapes/slitherLink";
import { BoardSelectorView } from "./view/boardSelectorView";

$(() => {
    
    let controller = new Controller()
    let renderer = new D3Renderer()
    let selector = new BoardSelectorView(controller, renderer)
    selector.render()
    /*let sudoku = new SudokuGrid()
    let slitherLink = new SlitherLinkGrid()
    let renderer = new D3Renderer()
    let controller = new Controller()
    //let presenter = new GridPresenter(sudoku, controller)
    let presenter = new GridPresenter(slitherLink, controller)
    presenter.presentCellBorders = false
    
    
    for (let i = 1; i <= 9; i++) {
        let property = new Property(i.toString())
        let propertyPresenter = new PropertyPresenterFactory(TextPropertyPresenter, property)
        presenter.propertyPresenterFactories.push(propertyPresenter)
    }
    let property = new Property("line")
    let propertyPresenter = new PropertyPresenterFactory(LinePropertyPresenter, property)
    presenter.propertyPresenterFactories.push(propertyPresenter)
    
    let ui = new EditorView(presenter, controller, renderer)
    ui.render()*/
})