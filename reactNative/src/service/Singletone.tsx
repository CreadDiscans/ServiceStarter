
export class Singletone<T> {
    private static instance:any;

    public static getInstance<T>():T {
        if (!this.instance) {
            this.instance = new this()
        }
        return this.instance
    }
}