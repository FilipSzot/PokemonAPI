import { injectable } from "inversify";
import { Pokemon } from "./pokemon";
import { PokemonResponse } from "./PokemonResponse";
import _ from "lodash";

@injectable()
export class PokemonResponseService {
    public static SUCCESS_STATUS: number = 200;
    public static INTERSECTION: string = "intersection";
    public static UNION: string = "union";
    
    public static intersectionResponses(array: PokemonResponse[]): PokemonResponse {
        return this.opearteOnResponses(array, this.INTERSECTION);
    }
    public static unionResponses(array: PokemonResponse[]): PokemonResponse {
        return this.opearteOnResponses(array, this.UNION);
    }

    private static opearteOnResponses(array: PokemonResponse[], type: string): PokemonResponse {
        let pokemons: Pokemon[] = [];
        let responseStatus: number = this.SUCCESS_STATUS;
        _.forEach(array, (element: PokemonResponse, index: number) => {
            const status: number = element.status;
            const body: {pokemons?: Pokemon[]} = element.body;
            if ( status === this.SUCCESS_STATUS && responseStatus === this.SUCCESS_STATUS) {
                const bodyPokemons: Pokemon[] =  (body.hasOwnProperty("pokemons")) ? body.pokemons : [];
                if (index !== 0 && type === this.INTERSECTION) {
                    pokemons = _.intersectionBy(pokemons, bodyPokemons, "id");
                } else {
                    pokemons = _.union(pokemons, bodyPokemons);
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
}
