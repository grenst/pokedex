'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { RootState } from '../store/store';
import Image from 'next/image';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

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

const PokemonCard: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  
  const isFavorite = favorites.some(p => p.id === pokemon.id);
  
  const fetchDetails = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      const detailedPokemon: PokemonDetails = {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map((ab: any) => ab.ability.name),
        image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
        types: data.types.map((t: any) => t.type.name.toLowerCase()),
        stats: data.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
      };
      setDetails(detailedPokemon);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Ошибка при загрузке деталей покемона:', error);
      alert('Не удалось загрузить детали покемона. Попробуйте позже.');
    }
  };
  
  const handleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(pokemon.id));
    } else {
      dispatch(addFavorite(pokemon));
    }
  };
  
  const handleFavoriteModal = () => {
    if (details) {
      if (isFavorite) {
        dispatch(removeFavorite(details.id));
      } else {
        dispatch(addFavorite({
          id: details.id,
          name: details.name,
          image: details.image,
          types: details.types,
        }));
      }
    }
  };
  
  return (
    <>
      <div
        className="border rounded p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
        onClick={fetchDetails}
      >
        <Image src={pokemon.image} alt={pokemon.name} width={96} height={96} className="w-24 h-24" />
        <h2 className="mt-2 capitalize font-bold">{pokemon.name}</h2>
        <div className="flex space-x-2 mt-1">
          {pokemon.types.map(type => (
            <span
              key={type}
              className={`px-2 py-1 text-xs rounded bg-${type}-500 text-white capitalize`}
            >
              {type}
            </span>
          ))}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); handleFavorite(); }}
          className={`mt-2 px-3 py-1 rounded text-white transition-all  duration-300`}
        >
          {isFavorite ? (
                  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                      <path d="M19.3 5.71002C18.841 5.24601 18.2943 4.87797 17.6917 4.62731C17.0891 4.37666 16.4426 4.2484 15.79 4.25002C15.1373 4.2484 14.4909 4.37666 13.8883 4.62731C13.2857 4.87797 12.739 5.24601 12.28 5.71002L12 6.00002L11.72 5.72001C10.7917 4.79182 9.53273 4.27037 8.22 4.27037C6.90726 4.27037 5.64829 4.79182 4.72 5.72001C3.80386 6.65466 3.29071 7.91125 3.29071 9.22002C3.29071 10.5288 3.80386 11.7854 4.72 12.72L11.49 19.51C11.6306 19.6505 11.8212 19.7294 12.02 19.7294C12.2187 19.7294 12.4094 19.6505 12.55 19.51L19.32 12.72C20.2365 11.7823 20.7479 10.5221 20.7442 9.21092C20.7405 7.89973 20.2218 6.64248 19.3 5.71002Z" fill="#ffffff" />
                    </g>
                  </svg>
                ) : (
                  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                      <path d="M19.3 5.71002C18.841 5.24601 18.2943 4.87797 17.6917 4.62731C17.0891 4.37666 16.4426 4.2484 15.79 4.25002C15.1373 4.2484 14.4909 4.37666 13.8883 4.62731C13.2857 4.87797 12.739 5.24601 12.28 5.71002L12 6.00002L11.72 5.72001C10.7917 4.79182 9.53273 4.27037 8.22 4.27037C6.90726 4.27037 5.64829 4.79182 4.72 5.72001C3.80386 6.65466 3.29071 7.91125 3.29071 9.22002C3.29071 10.5288 3.80386 11.7854 4.72 12.72L11.49 19.51C11.6306 19.6505 11.8212 19.7294 12.02 19.7294C12.2187 19.7294 12.4094 19.6505 12.55 19.51L19.32 12.72C20.2365 11.7823 20.7479 10.5221 20.7442 9.21092C20.7405 7.89973 20.2218 6.64248 19.3 5.71002Z" fill="#6161610" />
                    </g>
                  </svg>
                )}
        </button>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {details ? (
          <div className="flex flex-col md:flex-row items-center">
            <Image src={details.image} alt={details.name} width={192} height={192} className="w-48 h-48" />
            <div className="md:ml-6">
              <h1 className="text-2xl capitalize font-bold">{details.name}</h1>
              <p>Вес: {details.weight}</p>
              <p>Рост: {details.height}</p>
              <p>Способности: {details.abilities.join(', ')}</p>
              <div className="flex space-x-2 mt-2">
                {details.types.map(type => (
                  <span
                    key={type}
                    className={`px-2 py-1 text-xs rounded bg-${type}-500 text-white capitalize`}
                  >
                    {type}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Базовые характеристики:</h2>
                <ul className="list-disc list-inside">
                  {details.stats.map(stat => (
                    <li key={stat.name}>
                      {stat.name}: {stat.value}
                    </li>
                  ))}
                </ul>
              </div>              
              <button
                onClick={handleFavorite}
                className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
              >
                {isFavorite ? (
                  <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                      <path d="M19.3 5.71002C18.841 5.24601 18.2943 4.87797 17.6917 4.62731C17.0891 4.37666 16.4426 4.2484 15.79 4.25002C15.1373 4.2484 14.4909 4.37666 13.8883 4.62731C13.2857 4.87797 12.739 5.24601 12.28 5.71002L12 6.00002L11.72 5.72001C10.7917 4.79182 9.53273 4.27037 8.22 4.27037C6.90726 4.27037 5.64829 4.79182 4.72 5.72001C3.80386 6.65466 3.29071 7.91125 3.29071 9.22002C3.29071 10.5288 3.80386 11.7854 4.72 12.72L11.49 19.51C11.6306 19.6505 11.8212 19.7294 12.02 19.7294C12.2187 19.7294 12.4094 19.6505 12.55 19.51L19.32 12.72C20.2365 11.7823 20.7479 10.5221 20.7442 9.21092C20.7405 7.89973 20.2218 6.64248 19.3 5.71002Z" fill="#ffffff" />
                    </g>
                  </svg>
                ) : (
                  <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                      <path d="M19.3 5.71002C18.841 5.24601 18.2943 4.87797 17.6917 4.62731C17.0891 4.37666 16.4426 4.2484 15.79 4.25002C15.1373 4.2484 14.4909 4.37666 13.8883 4.62731C13.2857 4.87797 12.739 5.24601 12.28 5.71002L12 6.00002L11.72 5.72001C10.7917 4.79182 9.53273 4.27037 8.22 4.27037C6.90726 4.27037 5.64829 4.79182 4.72 5.72001C3.80386 6.65466 3.29071 7.91125 3.29071 9.22002C3.29071 10.5288 3.80386 11.7854 4.72 12.72L11.49 19.51C11.6306 19.6505 11.8212 19.7294 12.02 19.7294C12.2187 19.7294 12.4094 19.6505 12.55 19.51L19.32 12.72C20.2365 11.7823 20.7479 10.5221 20.7442 9.21092C20.7405 7.89973 20.2218 6.64248 19.3 5.71002Z" fill="#6161610" />
                    </g>
                  </svg>
                )}
              </button>
            </div>
          </div>
        ) : (
          <p>Загрузка...</p>
        )}
      </Modal>
    </>
  );
};

export default PokemonCard;