'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import TypeFilter from '../components/TypeFilter';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const HomePage = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 20;

  useEffect(() => {
    fetchTypes();
    fetchPokemon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchTypes = async () => {
    const res = await fetch('https://pokeapi.co/api/v2/type');
    const data = await res.json();
    setTypes(data.results.map((type: any) => type.name));
  };

  const fetchPokemon = async () => {
    setIsLoading(true);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${(page - 1) * limit}`);
    const data = await res.json();
    const detailedPokemon = await Promise.all(
      data.results.map(async (poke: any) => {
        const res = await fetch(poke.url);
        const details = await res.json();
        return {
          id: details.id,
          name: details.name,
          image: details.sprites.front_default,
          types: details.types.map((t: any) => t.type.name),
        };
      })
    );
    setPokemonList(prev => [...prev, ...detailedPokemon]);
    setIsLoading(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !isLoading
    ) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const filteredPokemon = pokemonList.filter(pokemon => {
    const matchesSearch = pokemon.name.includes(search.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.every(type => pokemon.types.includes(type));
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <SearchBar value={search} onChange={setSearch} />
        <TypeFilter types={types} selectedTypes={selectedTypes} onChange={setSelectedTypes} />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredPokemon.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
        {isLoading && <p className="text-center mt-4">Загрузка...</p>}
      </div>
    </div>
  );
};

export default HomePage;
