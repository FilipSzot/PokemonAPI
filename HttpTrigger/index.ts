import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import getContainer from "../ioc/inversify.config";
import { COMMON_TYPES } from "../ioc/commonTypes";
import { Logger } from "../commonServices/logger";
import { ILogger } from "../commonServices/iLogger";
import { IFunctionService } from "./services/IFunctionService";
import { Container } from "inversify";


const POKEMON_API_URL = "https://pokeapi.co/api/v2/";
const httpTrigger: AzureFunction = async (ctx: Context, req: HttpRequest): Promise<any> => {
    const container: Container = getContainer();
    const logger: Logger = container.get<ILogger>(COMMON_TYPES.ILogger) as Logger;
    logger.init(ctx, "1");

    const functionService: IFunctionService<any> =
        container.get<IFunctionService<any>>(COMMON_TYPES.IFunctionService);
    // const response: any = await functionService.processMessageAsync(req.body);
    const response: any = await functionService.getPokemons(req.query);
    ctx.res = {
        body: response,
        status: 200,
        headers: { "Content-Type": "application/json" },
    };
    return ctx.res;
};

export default httpTrigger;
