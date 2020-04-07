class CanvasUtils {
    private static instance: CanvasUtils;
    private canvas: any;
    private canvasContext: any;

    public static getInstance(): CanvasUtils {
        if (!this.instance) {
            CanvasUtils.instance = new CanvasUtils();
        }
        return CanvasUtils.instance;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public getCanvasContext(): CanvasRenderingContext2D {
        return this.canvasContext;
    }

    private constructor() {
        this.setupCanvas();
    }


    private setupCanvas(): void {
        // Get reference to canvas element
        let cvs = <HTMLCanvasElement>document.getElementById("game-canvas");
        if (cvs instanceof HTMLCanvasElement) {
            this.canvas = cvs;
        }
        // Get ref to canvas context
        let ctx = this.canvas.getContext("2d");
        if (ctx instanceof CanvasRenderingContext2D) {
            this.canvasContext = ctx;
        }

        // Resize canvas based on current window dimensions
        let canvasWrapper = document.getElementById("game-container");
        if (this.canvas && canvasWrapper) {
            let wrapperBounds = canvasWrapper.getBoundingClientRect();
            this.canvas.width = wrapperBounds.width;
            this.canvas.height = wrapperBounds.height;
            console.log(`canvas w: ${this.canvas.width}`);
        }
    }    

    public clearCanvas(): void { 
        this.canvasContext.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    public outOfBoundsLeftOrTop(pos: number, moveSpeed: number, radius: number): boolean {
        let step: number = moveSpeed + radius;
        if (pos < step) {
            return true;
        }
        return false;
    }

    public outOfBoundsRight(posX: number, moveSpeed: number, radius: number): boolean {
        let step: number = moveSpeed + radius;
        if (posX > this.canvas.width - step) {
            return true;
        }
        return false;
    }

    public outOfBoundsBottom(posY: number, moveSpeed: number, radius: number): boolean {
        let step: number = moveSpeed + radius;
        if (posY > this.canvas.height - step) {
            return true;
        }
        return false;
    }

    
}