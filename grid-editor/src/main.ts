import * as $ from "jquery"
import { D3Renderer } from "./renderer/d3Renderer"
import { Controller } from "./controller";
import { BoardSelectorView } from "./view/boardSelectorView";
import { StatusBar } from "./view/statusBar";
import { PropertyAssociationTypeSelector } from "./view/propertyAssociationTypeSelector";

$(() => {
    let statusBar = new StatusBar()
    let renderer = new D3Renderer()
    let controller = new Controller(renderer, statusBar)
    let selector = new BoardSelectorView(controller)
    selector.render()
})