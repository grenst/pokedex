'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../../../store/favoritesSlice';
import { RootState } from '../../../store/store';

interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: string[];
  image: string;
  types: string[];
  stats: { name: string; value: number }[];
}

const PokemonPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isFavorite = pokemon ? favorites.some(p => p.id === pokemon.id) : false;

  useEffect(() => {
    fetchPokemon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchPokemon = async () => {
    setIsLoading(true);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
    const data = await res.json();
    const detailedPokemon: PokemonDetails = {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map((ab: any) => ab.ability.name),
      image: data.sprites.other['official-artwork'].front_default,
      types: data.types.map((t: any) => t.type.name),
      stats: data.stats.map((s: any) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
    };
    setPokemon(detailedPokemon);
    setIsLoading(false);
  };

  const handleFavorite = () => {
    if (pokemon) {
      if (isFavorite) {
        dispatch(removeFavorite(pokemon.id));
      } else {
        dispatch(
          addFavorite({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.image,
            types: pokemon.types,
          })
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4">
          <p>Покемон не найден.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <button onClick={() => router.back()} className="mb-4 text-blue-500">
          &larr; Назад
        </button>
        <div className="flex flex-col md:flex-row items-center">
          <img src={pokemon.image} alt={pokemon.name} className="w-48 h-48" />
          <div className="md:ml-6">
            <h1 className="text-2xl capitalize font-bold">{pokemon.name}</h1>
            <p>Вес: {pokemon.weight}</p>
            <p>Рост: {pokemon.height}</p>
            <p>Способности: {pokemon.abilities.join(', ')}</p>
            <div className="flex space-x-2 mt-2">
              {pokemon.types.map(type => (
                <span
                  key={type}
                  className={`px-2 py-1 text-xs rounded bg-${type}-500 text-white`}
                >
                  {type}
                </span>
              ))}
            </div>
            <button
              onClick={handleFavorite}
              className={`mt-4 px-4 py-2 rounded ${
                isFavorite ? 'bg-red-500' : 'bg-green-500'
              } text-white`}
            >
              {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            </button>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Базовые характеристики:</h2>
          <ul className="list-disc list-inside">
            {pokemon.stats.map(stat => (
              <li key={stat.name}>
                {stat.name}: {stat.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PokemonPage;