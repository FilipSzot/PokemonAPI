import { Pokemon } from "./pokemon";

export class PokemonResponse {
    public status: number;
    public body: {
        pokemons?: Pokemon [];
    };

    constructor(status: number) {
        this.status = status;
        this.body = {};
    }
    public injectPokemons(pokemons: Pokemon[]){
        this.body.pokemons = pokemons;
    }
}
