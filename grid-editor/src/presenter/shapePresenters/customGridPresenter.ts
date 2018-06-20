import { GridPresenter } from "./gridCellPresenter";
import { IController } from "../../controller";
import { Grid } from "../../model/shapes/gridCell";
import { Property } from "../../model/property";
import { PropertyPresenterFactory } from "../propertyPresenter";
import { TextPropertyPresenter } from "../propertyPresenters/textPropertyPresenter";
import { CellBorderLinePropertyPresenter } from "../propertyPresenters/cellBorderLinePropertyPresenter";
import { HorizontalCellLinePropertyPresenter, VerticalCellLinePropertyPresenter, NorthEastBendCellLinePropertyPresenter, NorthWestBendCellLinePropertyPresenter, SouthEastBendCellLinePropertyPresenter, SouthWestBendCellLinePropertyPresenter } from "../propertyPresenters/cellLinePropertyPresenter";

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

        let property = new Property("border line")
        let propertyPresenter = new PropertyPresenterFactory(CellBorderLinePropertyPresenter,
            property, CellBorderLinePropertyPresenter.getKeyboardSelectShortcut(property))
        this.propertyPresenterFactories.push(propertyPresenter)

        property = new Property("-")
        propertyPresenter = new PropertyPresenterFactory(HorizontalCellLinePropertyPresenter,
            property, HorizontalCellLinePropertyPresenter.getKeyboardSelectShortcut(property))
        this.propertyPresenterFactories.push(propertyPresenter)

        property = new Property("|")
        propertyPresenter = new PropertyPresenterFactory(VerticalCellLinePropertyPresenter,
            property, VerticalCellLinePropertyPresenter.getKeyboardSelectShortcut(property))
        this.propertyPresenterFactories.push(propertyPresenter)

        property = new Property("⌟")
        propertyPresenter = new PropertyPresenterFactory(NorthEastBendCellLinePropertyPresenter,
            property, NorthEastBendCellLinePropertyPresenter.getKeyboardSelectShortcut(property))
        this.propertyPresenterFactories.push(propertyPresenter)

        property = new Property("⌞")
        propertyPresenter = new PropertyPresenterFactory(NorthWestBendCellLinePropertyPresenter,
            property, NorthWestBendCellLinePropertyPresenter.getKeyboardSelectShortcut(property))
        this.propertyPresenterFactories.push(propertyPresenter)

        property = new Property("⌝")
        propertyPresenter = new PropertyPresenterFactory(SouthEastBendCellLinePropertyPresenter,
            property, SouthEastBendCellLinePropertyPresenter.getKeyboardSelectShortcut(property))
        this.propertyPresenterFactories.push(propertyPresenter)

        property = new Property("⌜")
        propertyPresenter = new PropertyPresenterFactory(SouthWestBendCellLinePropertyPresenter,
            property, SouthWestBendCellLinePropertyPresenter.getKeyboardSelectShortcut(property))
        this.propertyPresenterFactories.push(propertyPresenter)
    }
}