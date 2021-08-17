import { inject, injectable } from "inversify";
import { IFunctionService } from "./IFunctionService";
import { COMMON_TYPES } from "../../ioc/commonTypes";
import { ILogger } from "../../commonServices/iLogger";
import axios from "axios";
import { Pokemon } from "../../Pokemon/pokemon";
import { PokemonService } from "../../Pokemon/PokemonService";

@injectable()
export class FunctionService implements IFunctionService<any> {

    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;
    // const container: Container = getContainer();
    // const pokemonService: PokemonService<any> =
    //     container.get<PokemonService<any>>(COMMON_TYPES.PokemonService);

    public async processMessageAsync(msg: any): Promise<any> {
        this._logger.info("Hello world");
        this._logger.verbose(`${JSON.stringify(msg)}`);
        return {msg: "success"};
    }
    public async getPokemons(query: {}): Promise<any> {
        console.log(query);
        let key: string = null;
        let value: string;
        let ids: [] = [];

        for ( const k in query ) {
            if ( k !== "id" && key === null ) {
                key = k;
                value = query[k];
            } else if ( k === "id" ) {
                ids = query[k];
            }
        }

        return PokemonService.getPokemonsByParams(key, value);
    }
}
