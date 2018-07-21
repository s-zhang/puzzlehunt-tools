import { GridPresenter } from "./gridCellPresenter";
import { IController } from "../../controller";
import { Grid } from "../../model/shapes/gridCell";
import { Property, PropertyAssociationType, PropertyBuilder } from "../../model/property";
import { PropertyPresenterFactory } from "../propertyPresenter";
import { TextPropertyPresenter } from "../propertyPresenters/textPropertyPresenter";
import { CellBorderLinePropertyPresenter } from "../propertyPresenters/cellBorderLinePropertyPresenter";
import { HorizontalCellLinePropertyPresenter, VerticalCellLinePropertyPresenter, NorthWestBendCellLinePropertyPresenter, NorthEastBendCellLinePropertyPresenter, SouthWestBendCellLinePropertyPresenter, SouthEastBendCellLinePropertyPresenter } from "../propertyPresenters/cellLinePropertyPresenter";

export class CustomGridPresenter extends GridPresenter {
    constructor(width : number, height : number, controller : IController) {
        super(new Grid(width, height), controller)
        
        for (let i = 0; i <= 9; i++) {
            let propertyBuilder = new PropertyBuilder(i.toString())
            propertyBuilder.associationType.value = PropertyAssociationType.Multiple
            let propertyPresenter = new PropertyPresenterFactory(TextPropertyPresenter,
                propertyBuilder, TextPropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
            this.propertyPresenterFactories.push(propertyPresenter)
        }

        for (let letter of ["A", "B", "C", "D", "E", "X", "Y", "Z"]) {
            let propertyBuilder = new PropertyBuilder(letter)
            propertyBuilder.associationType.value = PropertyAssociationType.Multiple
            let propertyPresenter = new PropertyPresenterFactory(TextPropertyPresenter,
                propertyBuilder, TextPropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
            this.propertyPresenterFactories.push(propertyPresenter)
        }

        let propertyBuilder = new PropertyBuilder("border line")
        propertyBuilder.associationType.value = PropertyAssociationType.SemiSingle
        let propertyPresenter = new PropertyPresenterFactory(CellBorderLinePropertyPresenter,
            propertyBuilder, CellBorderLinePropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
        this.propertyPresenterFactories.push(propertyPresenter)

        propertyBuilder = new PropertyBuilder("-")
        propertyBuilder.associationType.value = PropertyAssociationType.SemiSingle
        propertyPresenter = new PropertyPresenterFactory(HorizontalCellLinePropertyPresenter,
            propertyBuilder, HorizontalCellLinePropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
        this.propertyPresenterFactories.push(propertyPresenter)

        propertyBuilder = new PropertyBuilder("|")
        propertyBuilder.associationType.value = PropertyAssociationType.SemiSingle
        propertyPresenter = new PropertyPresenterFactory(VerticalCellLinePropertyPresenter,
            propertyBuilder, VerticalCellLinePropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
        this.propertyPresenterFactories.push(propertyPresenter)

        propertyBuilder = new PropertyBuilder("⌟")
        propertyBuilder.associationType.value = PropertyAssociationType.SemiSingle
        propertyPresenter = new PropertyPresenterFactory(NorthWestBendCellLinePropertyPresenter,
            propertyBuilder, NorthWestBendCellLinePropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
        this.propertyPresenterFactories.push(propertyPresenter)

        propertyBuilder = new PropertyBuilder("⌞")
        propertyBuilder.associationType.value = PropertyAssociationType.SemiSingle
        propertyPresenter = new PropertyPresenterFactory(NorthEastBendCellLinePropertyPresenter,
            propertyBuilder, NorthEastBendCellLinePropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
        this.propertyPresenterFactories.push(propertyPresenter)

        propertyBuilder = new PropertyBuilder("⌝")
        propertyBuilder.associationType.value = PropertyAssociationType.SemiSingle
        propertyPresenter = new PropertyPresenterFactory(SouthWestBendCellLinePropertyPresenter,
            propertyBuilder, SouthWestBendCellLinePropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
        this.propertyPresenterFactories.push(propertyPresenter)

        propertyBuilder = new PropertyBuilder("⌜")
        propertyBuilder.associationType.value = PropertyAssociationType.SemiSingle
        propertyPresenter = new PropertyPresenterFactory(SouthEastBendCellLinePropertyPresenter,
            propertyBuilder, SouthEastBendCellLinePropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
        this.propertyPresenterFactories.push(propertyPresenter)
    }
}