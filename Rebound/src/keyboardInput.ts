class KeyboardInput {
    // Dictionary that maps key code number to function
    public keyCallback: { [keycode: number]: () => void; } = {};
    // Dictionary that tracks which keys are pressed/released
    public keyDown: { [keycode: number] : boolean; } = {};

    constructor() {
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }

    public addKeycodeCallback = (keycode: number, f: () => void): void => {
        this.keyCallback[keycode] = f;
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
                var callback: () => void = this.keyCallback[key];
                if (callback != null) {
                    // Perform that function
                    callback();
                }
            }
        }
    }
}