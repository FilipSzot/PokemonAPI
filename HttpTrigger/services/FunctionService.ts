import { inject, injectable } from "inversify";
import { IFunctionService } from "./IFunctionService";
import { COMMON_TYPES } from "../../ioc/commonTypes";
import { ILogger } from "../../commonServices/iLogger";
import { PokemonService } from "../../Pokemon/PokemonService";

@injectable()
export class FunctionService implements IFunctionService<any> {

    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    public async processMessageAsync(msg: any): Promise<any> {
        this._logger.info("Hello world");
        this._logger.verbose(`${JSON.stringify(msg)}`);
        return {msg: "success"};
    }
    public async getPokemons(query: {}): Promise<any> {        
        return PokemonService.loadPokemons(query).then( (res) => {
            return res;
        });

    }
}
