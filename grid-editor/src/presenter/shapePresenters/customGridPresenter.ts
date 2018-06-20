import { GridPresenter } from "./gridCellPresenter";
import { IController } from "../../controller";
import { Grid } from "../../model/shapes/gridCell";
import { Property } from "../../model/property";
import { PropertyPresenterFactory } from "../propertyPresenter";
import { TextPropertyPresenter } from "../propertyPresenters/textPropertyPresenter";
import { LinePropertyPresenter } from "../propertyPresenters/linePropertyPresenter";

export class CustomGridPresenter extends GridPresenter {
    constructor(width : number, height : number, controller : IController) {
        super(new Grid(width, height), controller)
        
        for (let i = 0; i <= 9; i++) {
            let property = new Property(i.toString())
            let propertyPresenter = new PropertyPresenterFactory(TextPropertyPresenter,
                property, TextPropertyPresenter.getKeyboardSelectShortcut(property))
            this.propertyPresenterFactories.push(propertyPresenter)
        }

        for (let letter of ["A", "B", "C", "D", "E", "X", "Y", "Z"]) {
            let property = new Property(letter)
            let propertyPresenter = new PropertyPresenterFactory(TextPropertyPresenter,
                property, TextPropertyPresenter.getKeyboardSelectShortcut(property))
            this.propertyPresenterFactories.push(propertyPresenter)
        }

        let property = new Property("line")
        let propertyPresenter = new PropertyPresenterFactory(LinePropertyPresenter,
            property, LinePropertyPresenter.getKeyboardSelectShortcut(property))
        this.propertyPresenterFactories.push(propertyPresenter)
    }
}