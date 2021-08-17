import { injectable } from "inversify";
import axios from "axios";
import { Pokemon } from "./pokemon";

@injectable()
export class PokemonService {
    public static async getPokemonsByParams(param: string, value: string): Promise<Pokemon[]> {
        let response: any = [];
        const url: string = `https://pokeapi.co/api/v2/${param}/${value}`;
        const data: any = await axios.get(url);
        if (data.hasOwnProperty("data") && data.data.hasOwnProperty("pokemon")) {
            response = data.data.pokemon;
        }
        const array: Pokemon[] = response.map(
            (obj) => {
            return new Pokemon(obj.pokemon.url, obj.pokemon.name);
        });

        return array;
    }
}
