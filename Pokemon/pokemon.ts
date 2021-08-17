export class Pokemon {
    public id: number;
    public url: string;
    public name: string;

    constructor(url: string, name: string) {
        this.url = url;
        this.name = name;
        this.id = this.getIdFromUrl(url);
    }

    private getIdFromUrl(url: string): number {
        const id: any[] = url.match(/\b\d+\b/g);
        return (id.length > 0) ? Number(id[0]) : null;
    }
}
