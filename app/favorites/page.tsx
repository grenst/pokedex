'use client';

import { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import PokemonCard from '../../components/PokemonCard';
import TypeFilter from '../../components/TypeFilter';
import ScrollToTop from '../../components/ScrollToTop';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const FavoritesPage = () => {
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filterTypes = ['all', 'normal', 'poison', 'rock', 'fire', 'water', 'electric'];

  const handleSelectType = (type: string) => {
    setSelectedType(type);
  };

  const filteredFavorites = useMemo(() => {
    return favorites.filter(pokemon => {
      if (selectedType === 'all') return true;
      return pokemon.types.includes(selectedType.toLowerCase());
    });
  }, [favorites, selectedType]);

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Избранное</h1>
        <TypeFilter selectedType={selectedType} onSelectType={handleSelectType} />
        {filteredFavorites.length === 0 ? (
          <p className="text-center mt-4">У вас пока нет избранных покемонов с выбранным типом.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFavorites.map(pokemon => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default FavoritesPage;