import { Container } from "inversify";
import { COMMON_TYPES } from "../ioc/commonTypes";
import getContainer from "../ioc/inversify.config";
import { IPokemonService } from "../Pokemon/IPokemonService";
import { PokemonResponse } from "../Pokemon/PokemonResponse";
import { assert } from "chai";

const container: Container = getContainer();
const pokemonService: IPokemonService =
container.get<IPokemonService>(COMMON_TYPES.IPokemonService);

describe("loadPokemons", () => {
    it("has response 200", async () => {
        await pokemonService.loadPokemons({id: "1,2,3"}).then((res) => {
            assert.equal(res.status, 200);
        });
    });
    it("has response the same type as PokemonResponse", async () => {
        await pokemonService.loadPokemons("19329084209840239480923").then((res) => {
            assert.typeOf(res, typeof new PokemonResponse(200));
        });
    });
});
describe("getPokemon", () => {
    it("has response 200", async () => {
        await pokemonService.getPokemon("1").then((res) => {
            assert.equal(res.status, 200);
        });
    });
    it("has response the same type as PokemonResponse", async () => {
        await pokemonService.getPokemon("19329084209840239480923").then((res) => {
            assert.typeOf(res, typeof new PokemonResponse(200));
        });
    });
});
describe("getPokemonsByIndexesOrNames", () => {
    it("has response 200", async () => {
        await pokemonService.getPokemonsByIndexesOrNames(["1"]).then((res) => {
            assert.equal(res.status, 200);
        });
    });
    it("has response the same type as PokemonResponse", async () => {
        await pokemonService.getPokemonsByIndexesOrNames(["5"]).then((res) => {
            assert.typeOf(res, typeof new PokemonResponse(200));
        });
    });
});
describe("getPokemonsByParams", () => {
    it("has response 200", async () => {
        await pokemonService.getPokemonsByParams("type", "grass").then((res) => {
            assert.equal(res.status, 200);
        });
    });
    it("has response the same type as PokemonResponse", async () => {
        await pokemonService.getPokemonsByParams("type", "grass").then((res) => {
            assert.typeOf(res, typeof new PokemonResponse(200));
        });
    });
});
