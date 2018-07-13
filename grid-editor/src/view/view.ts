import { IController } from "../controller";

/**
 * Views handles rendering of a specifc page of the UI
 */
export abstract class View {
    protected readonly controller : IController
    constructor(controller : IController) {
        this.controller = controller
    }
    abstract render() : void
}