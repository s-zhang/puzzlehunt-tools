import { GridPresenter } from "./gridCellPresenter";
import { SudokuGrid } from "../../model/shapes/sudoku";
import { IController } from "../../controller";
import { Property } from "../../model/property";
import { PropertyPresenterFactory } from "../propertyPresenter";
import { TextPropertyPresenter } from "../propertyPresenters/textPropertyPresenter";

export class SudokuPresenter extends GridPresenter {
    constructor(controller : IController) {
        super(new SudokuGrid(), controller)
        this.presentIntersections = false

        for (let i = 1; i <= 9; i++) {
            let property = new Property(i.toString())
            let propertyPresenter = new PropertyPresenterFactory(TextPropertyPresenter,
                property, TextPropertyPresenter.getKeyboardSelectShortcut(property))
            this.propertyPresenterFactories.push(propertyPresenter)
        }
    }
}