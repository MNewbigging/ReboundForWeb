/// <reference path="../gameState.ts" />
/// <reference path="homeScreen.ts" />

enum CurrentScreen {
    HOME,
    GAME
}

class ScreenSystem {
    // Hold reference to the game
    private gameState: GameState;

    // Determines which screen we're currently on
    private curScreen: CurrentScreen;

    // Hold references to all screens
    private homeScreen: HomeScreen;

    

    constructor() {
        // Start on home screen
        this.curScreen = CurrentScreen.HOME;

        // Setup all screens
        this.homeScreen = new HomeScreen();

        // Setup the game
        this.gameState = new GameState();

        // Setup menu controls
        this.setupMenuControls();
    }

    private setupMenuControls(): void {
        document.addEventListener("click", this.onClick);
    }

    private onClick = (event: MouseEvent): void => {
        // Determine if click hit any buttons on this screen
        switch(this.curScreen) {
            case CurrentScreen.HOME:
                this.homeScreen.checkIfButtonWasClicked();
                break;
            case CurrentScreen.GAME:
                break;
        }
    }

    public systemLoop = (): void => {
        switch(this.curScreen) {
            case CurrentScreen.HOME:
                this.homeScreen.homeScreenLoop();
                break;
            case CurrentScreen.GAME:
                this.gameState.gameLoop();
                break;
        }

        requestAnimationFrame(this.systemLoop);
    }

    


}