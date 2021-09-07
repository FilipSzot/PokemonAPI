import { Pokemon } from "./pokemon";
import { PokemonResponse } from "./PokemonResponse";

export interface IPokemonResponseService {
    intersectionResponses(array: PokemonResponse[]): PokemonResponse;
    unionResponses(array: PokemonResponse[]): PokemonResponse;
}
