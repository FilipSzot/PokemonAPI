import { injectable } from "inversify";
import axios from "axios";
import { Pokemon } from "./pokemon";
import _ from "lodash";

@injectable()
export class PokemonService {
    public static async loadPokemons(params: any): Promise<Pokemon[]> {
        const promises: any[] = [];
        for ( const key in params ) {
            if ( key !== "id" ) {
                promises.push(this.getPokemonsByParams(key, params[key]));
            } else if ( key === "id" ) {
                const ids: string = params[key];
                ids.split(",").forEach((element) => {
                    promises.push(this.getPokemonById(element));
                });
            }
        }
        return Promise.all(promises).then( (res) => {
            return this.intersectionElements(res);
        });
    }
    
    public static async getPokemonsByParams(param: string, value: string): Promise<Pokemon[]> {
        let response: any[] = [];
        const url: string = `https://pokeapi.co/api/v2/${param}/${value}`;
        try {
            const data: any = await axios.get(url);
            if (data.hasOwnProperty("data") && data.data.hasOwnProperty("pokemon")) {
                response = data.data.pokemon;
            }
            return response.map(
                (obj) => {
                    if ( obj.hasOwnProperty("pokemon")) {
                        return new Pokemon(obj.pokemon.url, obj.pokemon.name);
                    }
            });

        } catch (error) {
            console.log(error.response.data.error);
        }
    }

    public static async getPokemonById(id: string): Promise<Pokemon> {
        let response: Pokemon;
        const url: string = `https://pokeapi.co/api/v2/pokemon/${id}`;
        try {
            const data: any = await axios.get(url);
            if (data.hasOwnProperty("data")) {
                response = data.data;
                if (response.hasOwnProperty("name")) {
                    return new Pokemon(url, response.name);
                } else {
                    return null;
                }
            }
        } catch (error) {
            console.log(error.response.data.error);
        }
    }

    private static intersectionElements(array: any[]): Pokemon[] {
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
