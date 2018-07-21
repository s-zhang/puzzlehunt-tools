import { GridPresenter } from "./gridCellPresenter";
import { SudokuGrid } from "../../model/shapes/sudoku";
import { IController } from "../../controller";
import { Property, PropertyBuilder, PropertyAssociationType } from "../../model/property";
import { PropertyPresenterFactory } from "../propertyPresenter";
import { TextPropertyPresenter } from "../propertyPresenters/textPropertyPresenter";

export class SudokuPresenter extends GridPresenter {
    constructor(controller : IController) {
        super(new SudokuGrid(), controller)
        this.presentIntersections = false

        for (let i = 1; i <= 9; i++) {
            let propertyBuilder = new PropertyBuilder(i.toString())
            propertyBuilder.associationType.value = PropertyAssociationType.Single
            propertyBuilder.associationType.finalize()
            let propertyPresenter = new PropertyPresenterFactory(TextPropertyPresenter,
                propertyBuilder, TextPropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
            this.propertyPresenterFactories.push(propertyPresenter)
        }
    }
}