import { IController } from "../controller";
import { IRenderer } from "../renderer/renderer";

export abstract class View {
    protected readonly controller : IController
    protected readonly renderer : IRenderer
    constructor(controller : IController,
        renderer : IRenderer) {
        this.controller = controller
        this.renderer = renderer
    }
    abstract render() : void
}