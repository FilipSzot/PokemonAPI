export interface IFunctionService<T> {
    processMessageAsync(message: T): Promise<any>;
    getPokemons(message: T): Promise<any>;
}
