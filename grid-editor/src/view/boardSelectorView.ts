import * as $ from "jquery"
import { View } from "./view";
import { SudokuPresenter } from "../presenter/shapePresenters/sudokuPresenter";
import { SlitherLinkPresenter } from "../presenter/shapePresenters/slitherLinkPresenter";
import { ShapeCollectionPresenter } from "../presenter/shapePresenter";
import { CustomGridPresenter } from "../presenter/shapePresenters/customGridPresenter";

export class BoardSelectorView extends View {
    render(): void {
        let button = $(`<input type="button" value="Sudoku" />`)
        button.click(() => this._selectPuzzle(new SudokuPresenter(this.controller)))
        button.appendTo($("#selector"))

        button = $(`<input type="button" value="SlitherLink" />`)
        button.click(() => this._selectPuzzle(new SlitherLinkPresenter(
            Number($("#boardWidth").val()), Number($("#boardHeight").val()), this.controller)))
        button.appendTo($("#selector"))

        button = $(`<input type="button" value="Custom" />`)
        button.click(() => this._selectPuzzle(new CustomGridPresenter(
            Number($("#boardWidth").val()), Number($("#boardHeight").val()), this.controller)))
        button.appendTo($("#selector"))

        $("#selector")
            .append("Size: ")
            .append('<input id="boardWidth" type="text" />')
            .append("wide by ")
            .append('<input id="boardHeight" type="text" />')
            .append("high")
    }
    private _selectPuzzle(shapeCollectionPresenter : ShapeCollectionPresenter) {
        this.controller.selectPuzzle(shapeCollectionPresenter)
        $("#selector").remove()
    }
}