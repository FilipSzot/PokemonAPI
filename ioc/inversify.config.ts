import "reflect-metadata";
import {Container} from "inversify";
import {COMMON_TYPES} from "./commonTypes";

import {Logger} from "../commonServices/logger";
import {ILogger} from "../commonServices/iLogger";
import { IFunctionService } from "../HttpTrigger/services/IFunctionService";
import { FunctionService } from "../HttpTrigger/services/FunctionService";
import { IPokemonService } from "../Pokemon/IPokemonService";
import { PokemonService } from "../Pokemon/PokemonService";
import { PokemonResponseService } from "../Pokemon/PokemonResponseService";
import { IPokemonResponseService } from "../Pokemon/IPokemonResponseService";

const getContainer: (() => Container) = (): Container => {
    const container: Container = new Container();
    
    container
        .bind<ILogger>(COMMON_TYPES.ILogger)
        .to(Logger)
        .inSingletonScope();
    
    container
        .bind<IFunctionService<any>>(COMMON_TYPES.IFunctionService)
        .to(FunctionService);
    
    container
        .bind<IPokemonService>(COMMON_TYPES.IPokemonService)
        .to(PokemonService);
   
    container
        .bind<IPokemonResponseService>(COMMON_TYPES.IPokemonResponseService)
        .to(PokemonResponseService);

    return container;
};

export default getContainer;
