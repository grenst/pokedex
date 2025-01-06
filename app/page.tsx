'use client';

import { useEffect, useState, useCallback } from 'react';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import TypeFilter from '../components/TypeFilter';
import ScrollToTop from '../components/ScrollToTop';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const HomePage = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const limit = 20;

  useEffect(() => {
    fetchPokemon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchPokemon = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${(page - 1) * limit}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setTotalCount(data.count);
      const detailedPokemon = await Promise.all(
        data.results.map(async (poke: any) => {
          const res = await fetch(poke.url);
          const details = await res.json();
          return {
            id: details.id,
            name: details.name,
            image: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
            types: details.types.map((t: any) => t.type.name.toLowerCase()),
          };
        })
      );
      // Удаляем возможные дубликаты
      setPokemonList(prev => {
        const newPokemon = detailedPokemon.filter(poke => !prev.some(existing => existing.id === poke.id));
        return [...prev, ...newPokemon];
      });
    } catch (error) {
      console.error('Ошибка при загрузке покемонов:', error);
    }
    setIsLoading(false);
  }, [page]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !isLoading &&
      pokemonList.length < totalCount
    ) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, pokemonList.length, totalCount]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    // Не сбрасываем pokemonList и page, фильтрация выполняется на клиенте
  };

  const filteredPokemon = pokemonList.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      selectedType === 'all' ||
      pokemon.types.includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

  // Новая логика: загрузка дополнительных покемонов, если отфильтрованных меньше 20
  useEffect(() => {
    const loadMoreIfNeeded = async () => {
      if (selectedType !== 'all' && filteredPokemon.length < 20 && pokemonList.length < totalCount && !isLoading) {
        setPage(prev => prev + 1);
      }
    };

    loadMoreIfNeeded();
  }, [selectedType, filteredPokemon.length, pokemonList.length, totalCount, isLoading]);

  return (
    <div>
      <div className="container  mx-auto p-4">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex items-center justify-center">
          <TypeFilter selectedType={selectedType} onSelectType={handleSelectType} />
        </div>
        {filteredPokemon.length === 0 && !isLoading ? (
          <p className="text-center mt-4">Нет покемонов, соответствующих выбранным фильтрам.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredPokemon.map(pokemon => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
        {isLoading && <p className="text-center mt-4">Загрузка...</p>}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default HomePage;