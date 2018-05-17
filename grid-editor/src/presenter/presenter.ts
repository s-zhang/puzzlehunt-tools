import { IRenderer } from "../renderer/renderer"

export interface IPresenter {
    present(renderer : IRenderer) : void
}
