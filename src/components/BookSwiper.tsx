
import React from 'react';
import { useBookRecommendation } from '../contexts/BookRecommendationContext';
import BookCard from './BookCard';
import { Button } from '@/components/ui/button';

const BookSwiper: React.FC = () => {
  const { 
    currentBook, 
    remainingBooks, 
    handleLike, 
    handleDislike,
    resetRecommendations,
    likedBooks
  } = useBookRecommendation();

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4">
      <div className="relative h-[520px] w-full">
        {currentBook ? (
          <BookCard 
            book={currentBook}
            isActive={true}
            onSwipeLeft={handleDislike}
            onSwipeRight={handleLike}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-book-burgundy mb-2">All Done!</h3>
            <p className="text-gray-600 mb-4">
              You've gone through all our recommendations.
              {likedBooks.length > 0 
                ? " Check out your Liked Books!" 
                : " Try again to discover books you might enjoy."}
            </p>
            <Button 
              onClick={resetRecommendations}
              className="bg-book-burgundy hover:bg-book-red text-white"
            >
              Start Over
            </Button>
          </div>
        )}

        {/* Preview of next books */}
        {remainingBooks.slice(0, 2).map((book, index) => (
          <div 
            key={book.id} 
            className="absolute top-4 left-0 w-full opacity-0"
            style={{ zIndex: -(index + 1) }}
          >
            <BookCard 
              book={book}
              isActive={false}
              onSwipeLeft={() => {}}
              onSwipeRight={() => {}}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center space-x-6">
        <Button
          onClick={handleDislike}
          variant="outline"
          size="icon"
          className="rounded-full h-14 w-14 border-2 border-gray-300 bg-white text-book-burgundy hover:bg-gray-100"
          disabled={!currentBook}
        >
          ✕
        </Button>
        <Button
          onClick={handleLike}
          size="icon"
          className="rounded-full h-14 w-14 bg-book-burgundy hover:bg-book-red text-white"
          disabled={!currentBook}
        >
          ♥
        </Button>
      </div>
    </div>
  );
};

export default BookSwiper;
