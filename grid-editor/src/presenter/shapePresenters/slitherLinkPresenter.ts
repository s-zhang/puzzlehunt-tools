import { GridPresenter } from "./gridCellPresenter";
import { IController } from "../../controller";
import { SlitherLinkGrid } from "../../model/shapes/slitherLink";
import { Property, PropertyBuilder, PropertyAssociationType } from "../../model/property";
import { PropertyPresenterFactory } from "../propertyPresenter";
import { TextPropertyPresenter } from "../propertyPresenters/textPropertyPresenter";
import { CellBorderLinePropertyPresenter } from "../propertyPresenters/cellBorderLinePropertyPresenter";

export class SlitherLinkPresenter extends GridPresenter {
    constructor(width : number, height : number, controller : IController) {
        super(new SlitherLinkGrid(width, height), controller)
        this.presentCellBorders = false

        for (let i = 0; i <= 4; i++) {
            let propertyBuilder = new PropertyBuilder(i.toString())
            propertyBuilder.associationType.value = PropertyAssociationType.Single
            propertyBuilder.associationType.finalize()
            let propertyPresenter = new PropertyPresenterFactory(TextPropertyPresenter,
                propertyBuilder, TextPropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
            this.propertyPresenterFactories.push(propertyPresenter)
        }

        let propertyBuilder = new PropertyBuilder("border line")
        propertyBuilder.associationType.value = PropertyAssociationType.Single
        propertyBuilder.associationType.finalize()
        let propertyPresenter = new PropertyPresenterFactory(CellBorderLinePropertyPresenter,
            propertyBuilder, CellBorderLinePropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
        this.propertyPresenterFactories.push(propertyPresenter)

        propertyBuilder = new PropertyBuilder("X")
        propertyBuilder.associationType.value = PropertyAssociationType.Single
        propertyBuilder.associationType.finalize()
        propertyPresenter = new PropertyPresenterFactory(TextPropertyPresenter,
            propertyBuilder, TextPropertyPresenter.getKeyboardSelectShortcut(propertyBuilder))
        this.propertyPresenterFactories.push(propertyPresenter)
    }
}