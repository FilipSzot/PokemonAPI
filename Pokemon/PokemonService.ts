import { injectable } from "inversify";
import axios from "axios";
import { Pokemon } from "./pokemon";
import _ from "lodash";
import { PokemonResponse } from "./PokemonResponse";
import { PokemonResponseService } from "./PokemonResponseService";

@injectable()
export class PokemonService {
    private static POKEMON_API_URL: string = "https://pokeapi.co/api/v2/";
    public static async loadPokemons(params: any): Promise<any> {
        const promises: any[] = [];
        for ( const key in params ) {
            const properties: string[] = params[key].split(",");
            if ( key !== "id" ) {
                _.forEach(properties, (prop) => {
                    promises.push(this.getPokemonsByParams(key, prop));
                });
            } else if ( key === "id" || key === "name" ) {
                promises.push(this.getPokemonsByIndexesOrNames(properties));
            }
        }
        return Promise.all(promises).then( (res) => {
            return PokemonResponseService.intersectionResponses(res);
        });
    }
    
    public static async getPokemonsByParams(param: string, value: string): Promise<PokemonResponse> {
        const url: string = `${this.POKEMON_API_URL}${param}/${value}`;
        let status: number;
        let response: PokemonResponse;
        let pokemons: Pokemon[] = [];
        try {
            const data: any = await axios.get(url);
            status = data.status;
            response = new PokemonResponse(status);
            if (data.hasOwnProperty("data") && data.data.hasOwnProperty("pokemon")) {
                pokemons = data.data.pokemon.map(
                    (obj) => {
                        if ( obj.hasOwnProperty("pokemon")) {
                            return new Pokemon(obj.pokemon.url, obj.pokemon.name);
                        }
                });
            }
            if (pokemons.length > 0) {
                response.injectPokemons(pokemons);
            }
        } catch (error) {
            status = error.response.status;
            response = new PokemonResponse(status);
        }
        return response;
    }

    public static async getPokemonsByIndexesOrNames(array: string[]): Promise<PokemonResponse> {
        const promises: any[] = [];
        array.forEach((element) => {
            promises.push(this.getPokemon(element));
        });
        
        return Promise.all(promises).then( (res) => {
            return PokemonResponseService.unionResponses(res);
        });
    }

    public static async getPokemon(indexOrName: string): Promise<PokemonResponse> {
        const url: string = `${this.POKEMON_API_URL}pokemon/${indexOrName}`;
        let status: number;
        let response: PokemonResponse;
        try {
            const data: any = await axios.get(url);
            status = data.status;
            response = new PokemonResponse(status);
            if (data.hasOwnProperty("data") && data.data.hasOwnProperty("name")) {
                const pokemon: {name: string} = data.data;
                response.injectPokemons([new Pokemon(url, pokemon.name)]);
            }
        } catch (error) {
            status = error.response.status;
            response = new PokemonResponse(status);
        }
        return response;
    }

    public static intersectionElements(array: any[]): Pokemon[] {
        let result: Pokemon[] = [];
        const elementsById: Pokemon[] = [];
        array.forEach( (element) => {
            if (element !== null) {
                if (!Array.isArray(element)) {
                    elementsById.push(element);
                } else {
                    if (result.length < 1) {
                        result = _.union(result, element);
                    } else {
                        result = _.intersectionBy(result, element, "id");
                    }
                }
            }
        });
        if (elementsById.length > 0) {
            result = _.intersectionBy(result, elementsById, "id");
        }
        return result;
    }
}
