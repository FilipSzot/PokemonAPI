import { injectable } from "inversify";
import { Pokemon } from "./pokemon";
import { PokemonResponse } from "./PokemonResponse";
import _ from "lodash";

@injectable()
export class PokemonResponseService {
    public static SUCCESS_STATUS: number = 200;
    
    public static intersectionResponses(array: PokemonResponse[]): PokemonResponse {
        let pokemons: Pokemon[] = [];
        let responseStatus: number = this.SUCCESS_STATUS;
        _.forEach(array, (element: PokemonResponse) => {
            const status: number = element.status;
            const body: {pokemons?: Pokemon[]} = element.body;
            if ( status === this.SUCCESS_STATUS && responseStatus === this.SUCCESS_STATUS) {
                const bodyPokemons: Pokemon[] =  (body.hasOwnProperty("pokemons")) ? body.pokemons : [];
                if (body.pokemons.length < 1) {
                    pokemons = _.union(pokemons, bodyPokemons);
                } else {
                    pokemons = _.intersectionBy(pokemons, bodyPokemons);
                }              
            } else {
                responseStatus = status;
            }
        });
        const response: PokemonResponse = new PokemonResponse(responseStatus);
        if ( pokemons.length > 0 && responseStatus === this.SUCCESS_STATUS) {
            response.injectPokemons(pokemons);   
        }
        return response;
    }
    public static unionResponses(array: PokemonResponse[]): PokemonResponse {
        let pokemons: Pokemon[] = [];
        let responseStatus: number = this.SUCCESS_STATUS;
        _.forEach(array, (element: PokemonResponse) => {
            const status: number = element.status;
            const body: {pokemons?: Pokemon[]} = element.body;
            if ( status === this.SUCCESS_STATUS && responseStatus === this.SUCCESS_STATUS) {
                const bodyPokemons: Pokemon[] =  (body.hasOwnProperty("pokemons")) ? body.pokemons : [];
                pokemons = _.union(pokemons, bodyPokemons);               
            } else {
                responseStatus = status;
            }
        });
        const response: PokemonResponse = new PokemonResponse(responseStatus);
        if ( pokemons.length > 0 && responseStatus === this.SUCCESS_STATUS) {
            response.injectPokemons(pokemons);   
        }
        return response;
    }
}
