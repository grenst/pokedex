'use client';

import Navbar from '../../components/Navbar';
import PokemonCard from '../../components/PokemonCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const FavoritesPage = () => {
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Избранное</h1>
        {favorites.length === 0 ? (
          <p>У вас пока нет избранных покемонов.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favorites.map(pokemon => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;