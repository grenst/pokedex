'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import BurgerMenu from './BurgerMenu';

const Navbar = () => {
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  
  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="flex items-center space-x-2">
          <img src="../public/flaticon-color-negative.svg" alt="Pokedex Logo" className="w-8 h-8" />
          <span className="text-xl font-bold">Pokedex</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="hover:text-gray-400">Главная</Link>
          <Link href="/favorites" className="hover:text-gray-400">
            Избранное ({favorites.length})
          </Link>
        </nav>
        <BurgerMenu />
      </div>
    </header>
  );
};

export default Navbar;