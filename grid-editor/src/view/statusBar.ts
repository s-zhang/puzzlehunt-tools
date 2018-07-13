import * as $ from "jquery"

export class StatusBar {
    error(message: string): void {
        $("#statusbar")
            .html(message)
            .css("color", "red")
    }
    clear(): void {
        $("#statusbar")
            .html("Status: OK")
            .css("color", "black")
    }
}