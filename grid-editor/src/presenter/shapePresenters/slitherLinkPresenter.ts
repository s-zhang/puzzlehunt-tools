import { GridPresenter } from "./gridCellPresenter";
import { IController } from "../../controller";
import { SlitherLinkGrid } from "../../model/shapes/slitherLink";
import { Property } from "../../model/property";
import { PropertyPresenterFactory } from "../propertyPresenter";
import { TextPropertyPresenter } from "../propertyPresenters/textPropertyPresenter";
import { LinePropertyPresenter } from "../propertyPresenters/linePropertyPresenter";

export class SlitherLinkPresenter extends GridPresenter {
    constructor(width : number, height : number, controller : IController) {
        super(new SlitherLinkGrid(width, height), controller)
        this.presentCellBorders = false

        for (let i = 0; i <= 4; i++) {
            let property = new Property(i.toString())
            let propertyPresenter = new PropertyPresenterFactory(TextPropertyPresenter,
                property, TextPropertyPresenter.getKeyboardSelectShortcut(property))
            this.propertyPresenterFactories.push(propertyPresenter)
        }

        let property = new Property("line")
        let propertyPresenter = new PropertyPresenterFactory(LinePropertyPresenter,
            property, LinePropertyPresenter.getKeyboardSelectShortcut(property))
        this.propertyPresenterFactories.push(propertyPresenter)

        property = new Property("X")
        propertyPresenter = new PropertyPresenterFactory(TextPropertyPresenter,
            property, TextPropertyPresenter.getKeyboardSelectShortcut(property))
        this.propertyPresenterFactories.push(propertyPresenter)
    }
}