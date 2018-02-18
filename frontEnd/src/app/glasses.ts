import { Dimension } from './dimension';

export class Glasses {
    private id: string;
    private name: string | undefined;
    private dimension: Dimension | undefined;
    private imagePath: string | undefined;

    constructor(id: string, name?: string, dimension?: Dimension, imagePath?: string) {
        this.id = id;
        this.name = name;
        this.dimension = dimension;
        this.imagePath = imagePath;
    }

    public getName(): string {
        return this.name;
    }
    public setName(name: string): void {
        this.name = name;
    }
    public getId(): string {
        return this.id;
    }
    public setId(id: string): void {
        this.id = id;
    }
    public getDimension(): Dimension {
        return this.dimension;
    }
    public setDimension(dimension: Dimension): void {
        this.dimension = dimension;
    }
    public getImagePath(): string {
        return this.imagePath;
    }
    public setImagePath(imagePath: string): void {
        this.imagePath = imagePath;
    }
}
