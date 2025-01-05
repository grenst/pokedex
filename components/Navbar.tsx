import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Navbar = () => {
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between">
      <Link href="/" className="text-white text-xl font-bold">
        Pokedex
      </Link>
      <Link href="/favorites" className="text-white">
        Избранное ({favorites.length})
      </Link>
    </nav>
  );
};

export default Navbar;