/// <reference path="menuButton.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../canvasUtils.ts" />

class HomeScreen {
    private buttons: MenuButton[];

    constructor() {
       this.buttons = [];

       this.setupButtons();
    }

    private setupButtons(): void {
        // Get canvas 
        let canvas = CanvasUtils.getInstance().getCanvas();

        // Play button
        let playBtnText: string = "Play";
        let playBtnWidth: number = canvas.width * 0.2;
        let playBtnHeight: number = canvas.height * 0.075;
        let playBtnColour: string = "black";
        let playBtnLineWidth: number = 3;
        let playBtnPosition: Point = new Point(
            canvas.width * 0.1,
            canvas.height * 0.1
        );

        this.buttons.push(new MenuButton(
            playBtnPosition, 
            playBtnColour, 
            playBtnLineWidth, 
            playBtnWidth, 
            playBtnHeight, 
            playBtnColour, 
            playBtnText));
    }

    public checkIfButtonWasClicked(): void {
        // Check against this screen's buttons
        for (let button of this.buttons) {
            if (button.wasClicked()) {
                // Send instruction back to system based on which button was pressed
            }
        }
    }

    public homeScreenLoop(): void {
        for (let button of this.buttons) {
            button.draw();
        }
    }
}
