class MenuButton extends RectangleEntity {
    public text: string = "";

    constructor(p: Point, col: string, lw: number, w: number, h: number, stroke: string, text: string) {
        super(p, col, lw, w, h, stroke);
        this.text = text;
    }

    draw() {
        super.draw();

        let canvasContext = CanvasUtils.getInstance().getCanvasContext();
        canvasContext.font = "20px Arial";
        canvasContext.fillText(this.text, this.position.x + this.width * 0.4, this.position.y + this.height * 0.6);
    }

    public wasClicked(): boolean {
        // Get mouse position
        let mousePos: Point = CanvasUtils.getInstance().getMousePos();
        let mouseClickArea: number = CanvasUtils.getInstance().getMouseClickArea();
        if (Utils.isCircleInsideRectArea(this.position, this.width, this.height, mousePos, mouseClickArea)) {
            console.log(`hit button: ${this.text}`);
            return true;
        }
        
        return false;
    }
}