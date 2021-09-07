import { Container, injectable } from "inversify";
import axios from "axios";
import { Pokemon } from "./pokemon";
import _ from "lodash";
import { PokemonResponse } from "./PokemonResponse";
import getContainer from "../ioc/inversify.config";
import { IPokemonResponseService } from "./IPokemonResponseService";
import { COMMON_TYPES } from "../ioc/commonTypes";
import { IPokemonService } from "./IPokemonService";

@injectable()
export class PokemonService implements IPokemonService {
    private readonly _POKEMON_API_URL: string = "https://pokeapi.co/api/v2/";
    
    private readonly _container: Container = getContainer();
    private readonly _pokemonResponseService: IPokemonResponseService =
    this._container.get<IPokemonResponseService>(COMMON_TYPES.IPokemonResponseService);
    
    public async loadPokemons(params: {}): Promise<PokemonResponse> {
        
        try {
            const promises: any[] = [];
            for ( const key in params ) {
                if ( key !== "id" ) {
                    _.forEach(params[key].split(","), (prop) => {
                        promises.push(this.getPokemonsByParams(key, prop));
                    });
                } else if ( key === "id" || key === "name" ) {
                    promises.push(this.getPokemonsByIndexesOrNames(params[key].split(",")));
                }

        }
            return Promise.all(promises).then( (res) => {
                return this._pokemonResponseService.intersectionResponses(res);
            });

        } catch (error) {
            const status: number = (typeof error.response.status !== "undefined") ? error.response.status : 400;
            return new PokemonResponse(status);
        }
    }
    
    public async getPokemonsByParams(param: string, value: string): Promise<PokemonResponse> {
        const url: string = `${this._POKEMON_API_URL}${param}/${value}`;
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
            status = (typeof error.response.status === "undefined") ? 400 : error.response.status;
            response = new PokemonResponse(status);
        }
        return response;
    }

    public async getPokemonsByIndexesOrNames(array: string[]): Promise<PokemonResponse> {
        const promises: any[] = [];
        array.forEach((element) => {
            promises.push(this.getPokemon(element));
        });
        
        return Promise.all(promises).then( (res) => {
            return this._pokemonResponseService.unionResponses(res);
        });
    }

    public async getPokemon(indexOrName: string): Promise<PokemonResponse> {
        const url: string = `${this._POKEMON_API_URL}pokemon/${indexOrName}`;
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
            status = (typeof error.response.status === "undefined") ? 400 : error.response.status;
            response = new PokemonResponse(status);
        }
        return response;
    }

}
