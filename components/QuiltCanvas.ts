export class QuiltCanvas {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;

  readonly numberOfCols: number;
  readonly numberOfRows: number;
  readonly sourceWidth: number;
  readonly sourceHeight: number;
  readonly frameWidth: number;
  readonly frameHeight: number;

  constructor(
    numberOfCols: number,
    numberOfRows: number,
    sourceWidth: number,
    sourceHeight: number,
    frameWidth: number,
    frameHeight: number
  ) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;

    this.numberOfCols = numberOfCols;
    this.numberOfRows = numberOfRows;
    this.sourceWidth = sourceWidth;
    this.sourceHeight = sourceHeight;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    this.canvas.width = numberOfCols * frameWidth;
    this.canvas.height = numberOfRows * frameHeight;
  }

  drawFrameAt(i: number, source: CanvasImageSource) {
    const { col, row } = this.indexToColRow(i);
    const { x, y } = this.colRowToXY(col, row);
    this.ctx.drawImage(source, 0, 0, this.sourceWidth, this.sourceHeight, x, y, this.frameWidth, this.frameHeight);

    // const text = i.toString();
    // const tx = x + 20;
    // const ty = y + 100;
    // this.ctx.font = '80px Arial';
    // this.ctx.strokeStyle = 'black';
    // this.ctx.fillStyle = 'white';
    // this.ctx.lineWidth = 10;
    // this.ctx.strokeText(text, tx, ty);
    // this.ctx.fillText(text, tx, ty);
  }

  private indexToColRow(i: number) {
    return {
      col: i % this.numberOfCols,
      row: this.numberOfRows - 1 - Math.floor(i / this.numberOfCols),
    };
  }

  private colRowToXY(col: number, row: number) {
    return {
      x: col * this.frameWidth,
      y: row * this.frameHeight,
    };
  }
}
