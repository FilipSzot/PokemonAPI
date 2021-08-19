import { Pokemon } from "./pokemon";
import { PokemonResponse } from "./PokemonResponse";

export interface IPokemonResponseService<T> {
    intersectionResponses(array: PokemonResponse[]): PokemonResponse;
    unionResponses(array: PokemonResponse[]): PokemonResponse;
}
