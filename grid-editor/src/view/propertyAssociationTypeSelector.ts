import * as $ from "jquery"
import { allPropertyAssociationTypes, PropertyAssociationType } from "../model/property";
import { View } from "./view";

export class PropertyAssociationTypeSelector extends View {
    
    render(): void {
        for (let propertyAssociationType of allPropertyAssociationTypes) {
            let radioButton = $(`<input type="radio" id="propertyAssociationSelector-${propertyAssociationType}" ` +
                                `name="propertyAssociation" value="${propertyAssociationType}" />`)
            radioButton.click(() => {
                this.controller.setPropertyAssociationType(propertyAssociationType)
            })
            $("#propertyassociation").append(radioButton)
            $("#propertyassociation").append($(`<span>${propertyAssociationType} &nbsp;</span>`))
        }
        this.disable()
    }
    disable(): void {
        for (let propertyAssociationType of allPropertyAssociationTypes) {
            $(`#propertyAssociationSelector-${propertyAssociationType}`)
                .attr("disabled", "true")
        }
    }
    enable(): void {
        for (let propertyAssociationType of allPropertyAssociationTypes) {
            $(`#propertyAssociationSelector-${propertyAssociationType}`)
                .removeAttr("disabled")
        }
    }
    check(propertyAssociationType: PropertyAssociationType): void {
        $(`#propertyAssociationSelector-${propertyAssociationType}`)
            .prop("checked", true)
    }
}