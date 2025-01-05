'use client';

import Link from 'next/link';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const PokemonCard: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="border rounded p-4 flex flex-col items-center hover:shadow-lg transition">
        <img src={pokemon.image} alt={pokemon.name} className="w-24 h-24" />
        <h2 className="mt-2 capitalize font-bold">{pokemon.name}</h2>
        <div className="flex space-x-2 mt-1">
          {pokemon.types.map(type => (
            <span
              key={type}
              className={`px-2 py-1 text-xs rounded bg-${type}-500 text-white`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;
