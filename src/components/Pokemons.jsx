import React, { useState, useEffect } from 'react';

function Pokemons() {
    const [pokemons, setPokemons] = useState([]);
    const [error, setError] = useState(null);
    const [showPokemons, setShowPokemons] = useState(false);

    const toggleShowPokemons = () => {
        setShowPokemons(!showPokemons);
    };

    const hidePokemon = (name) => {
        setPokemons(pokemons.filter(pokemon => pokemon.name !== name));
    };
    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon');
                const data = await response.json();

                const pokemonPromises = data.results.map(async (pokemon) => {
                    const response = await fetch(pokemon.url);
                    const pokemonData = await response.json();

                    return {
                        name: pokemon.name,
                        image: pokemonData.sprites.front_default,
                        type: pokemonData.types[0].type.name,
                    };
                });

                const pokemonData = await Promise.all(pokemonPromises);
                setPokemons(pokemonData);
            } catch (error) {
                setError(error);
            }
        };

        fetchPokemon();
    }, []);


    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <button onClick={toggleShowPokemons} className='btn btn-success'>
                {showPokemons ? 'Ocultar pokemons' : 'Mostrar pokemons'}
            </button>

            {showPokemons && (
                <ul>
                    {pokemons.map((pokemon) => (
                        <div key={pokemon.name}>
                            <h2>{pokemon.name}</h2>
                            <img src={pokemon.image} alt={pokemon.name} />
                            <p>Tipo: {pokemon.type}</p>
                            <button className='btn btn-danger' onClick={() => hidePokemon(pokemon.name)}>Esconder</button>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Pokemons;
