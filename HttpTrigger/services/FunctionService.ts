import { Container, inject, injectable } from "inversify";
import { IFunctionService } from "./IFunctionService";
import { COMMON_TYPES } from "../../ioc/commonTypes";
import { ILogger } from "../../commonServices/iLogger";
import getContainer from "../../ioc/inversify.config";
import { IPokemonService } from "../../Pokemon/IPokemonService";

@injectable()
export class FunctionService implements IFunctionService<any> {
    
    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;
    
    private readonly _container: Container = getContainer();
    private readonly _pokemonService: IPokemonService<any> =
    this._container.get<IPokemonService<any>>(COMMON_TYPES.IPokemonService);

    public async processMessageAsync(msg: any): Promise<any> {
        this._logger.info("Hello world");
        this._logger.verbose(`${JSON.stringify(msg)}`);
        return {msg: "success"};
    }
    public async getPokemons(query: {}): Promise<any> {        
        return this._pokemonService.loadPokemons(query).then( (res) => {
            const response: {status: number, body: { pokemons?: string[] } } = {
                status: 200,
                body: {},
            };
            response.status = res.status;

            if (res.body.hasOwnProperty("pokemons")) { 
                response.body.pokemons = res.body.pokemons.map(
                    (pokemon) => {
                        return pokemon.name;
                });
            }
            return response;
        });

    }
}
