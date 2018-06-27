import { Grid, Cell, CellBorder } from "./gridCell";
import { ConstraintCheckResult } from "../constraint";
import { Property } from "../property";

const SIDE_LENGTH = 9

export class SlitherLinkGrid extends Grid {
    constructor(width : number, height : number) {
        super(width, height)
        this.addCellConstraint(this._borderConstraint)
    }
    private _borderConstraint(cell : Cell) : ConstraintCheckResult {
        let bordersWithLine = new Array<[CellBorder, Property]>()
        for (let cellBorder of cell.adjacentCellBorders) {
            if (cellBorder.property != null && cellBorder.property.name == "border line") {
                bordersWithLine.push([cellBorder, cellBorder.property])
            }
        }

        if (cell.property != null) {
            let numLinedBorders = Number(cell.property.name)
            if (numLinedBorders < bordersWithLine.length) {
                return new ConstraintCheckResult(false, bordersWithLine)
            } else if (numLinedBorders > bordersWithLine.length) {
                return new ConstraintCheckResult(false, [])
            }
        }
        return new ConstraintCheckResult(true, [])
    }
}