
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 text-center bg-gradient-to-r from-book-burgundy to-book-red text-white shadow-md mb-4">
      <h1 className="text-3xl font-bold">📚 BookMatch</h1>
      <p className="text-sm opacity-90">Swipe your way to your next favorite book</p>
    </header>
  );
};

export default Header;
