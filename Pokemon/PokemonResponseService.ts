import { injectable } from "inversify";
import { Pokemon } from "./pokemon";
import { PokemonResponse } from "./PokemonResponse";
import _ from "lodash";
import { IPokemonResponseService } from "./IPokemonResponseService";

@injectable()
export class PokemonResponseService implements IPokemonResponseService {
    private readonly _SUCCESS_STATUS: number = 200;
    private readonly _INTERSECTION: string = "intersection";
    private readonly _UNION: string = "union";
    
    public intersectionResponses(array: PokemonResponse[]): PokemonResponse {
        return this.opearteOnResponses(array, this._INTERSECTION);
    }
    public unionResponses(array: PokemonResponse[]): PokemonResponse {
        return this.opearteOnResponses(array, this._UNION);
    }

    private opearteOnResponses(array: PokemonResponse[], type: string): PokemonResponse {
        let pokemons: Pokemon[] = [];
        let responseStatus: number = this._SUCCESS_STATUS;
        _.forEach(array, (element: PokemonResponse, index: number) => {
            const status: number = element.status;
            const body: {pokemons?: Pokemon[]} = element.body;
            if ( status === this._SUCCESS_STATUS && responseStatus === this._SUCCESS_STATUS) {
                const bodyPokemons: Pokemon[] =  (body.hasOwnProperty("pokemons")) ? body.pokemons : [];
                if (index !== 0 && type === this._INTERSECTION) {
                    pokemons = _.intersectionBy(pokemons, bodyPokemons, "id");
                } else {
                    pokemons = _.union(pokemons, bodyPokemons);
                }             
            } else {
                responseStatus = status;
            }
        });
        const response: PokemonResponse = new PokemonResponse(responseStatus);
        if ( pokemons.length > 0 && responseStatus === this._SUCCESS_STATUS) {
            response.injectPokemons(pokemons);   
        }
        return response;
    }
}
