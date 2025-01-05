'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useDispatch } from 'react-redux';
import { toggleMenu } from '../store/menuSlice';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  
  const toggle = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('no-scroll', !isOpen);
  };

  useEffect(() => {
    // Закрываем меню при изменении размера окна
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
        document.body.classList.remove('no-scroll');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <>
      <button
        className={`md:hidden focus:outline-none ${isOpen ? 'active' : ''}`}
        onClick={toggle}
        aria-label="Toggle menu"
      >
        <div className={`burger-line ${isOpen ? 'open' : ''}`}></div>
        <div className={`burger-line ${isOpen ? 'open' : ''}`}></div>
        <div className={`burger-line ${isOpen ? 'open' : ''}`}></div>
      </button>
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 text-white flex flex-col items-center space-y-4 py-4 md:hidden">
          <Link href="/" onClick={toggle} className="hover:text-gray-400">Главная</Link>
          <Link href="/favorites" onClick={toggle} className="hover:text-gray-400">
            Избранное ({favorites.length})
          </Link>
        </div>
      )}
    </>
  );
};

export default BurgerMenu;
