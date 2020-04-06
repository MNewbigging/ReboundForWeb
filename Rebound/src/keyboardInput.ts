type KeyboardInputCallback = (opParam?: any) => any;

class KeyboardInput {
    // Map key code number to callback function
    public keyCallback: { [keycode: number]: KeyboardInputCallback } = {};
    // Map that tracks which keys are currently pressed
    public keyDown: { [keycode: number] : boolean; } = {};

    constructor() {
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }

    public addKeycodeCallback (keycode: number, action: KeyboardInputCallback): void {
        this.keyCallback[keycode] = action;
        this.keyDown[keycode] = false; // need this?
    }

    public keyboardDown = (event: KeyboardEvent): void => {
        event.preventDefault();
        this.keyDown[event.keyCode] = true;
    }

    public keyboardUp = (event: KeyboardEvent): void => {
        this.keyDown[event.keyCode] = false;
    }

    public inputLoop = (): void => {
        // Loop through all values in dictionary
        for (var key in this.keyDown) {
            var is_down: boolean = this.keyDown[key];
            // If pressed
            if (is_down) {
                // Grab function for that key press
                var callback: KeyboardInputCallback = this.keyCallback[key];
                if (callback != null) {
                    // Perform that function
                    callback();
                }
            }
        }
    }
}