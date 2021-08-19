import { Pokemon } from "./pokemon";
import { PokemonResponse } from "./PokemonResponse";

export interface IPokemonService<T> {
    loadPokemons(params: any): Promise<PokemonResponse>;
    getPokemonsByParams(param: string, value: string): Promise<PokemonResponse>;
    getPokemonsByIndexesOrNames(array: string[]): Promise<PokemonResponse>;
    getPokemon(indexOrName: string): Promise<PokemonResponse>;
    intersectionElements(array: any[]): Pokemon[];
}
