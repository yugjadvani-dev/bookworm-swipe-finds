
import React from 'react';
import { useBookRecommendation } from '../contexts/BookRecommendationContext';
import { Book } from '../types/book';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const LibraryBookCard: React.FC<{ book: Book }> = ({ book }) => {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-md">
      <div className="w-20 h-28 flex-shrink-0 overflow-hidden rounded">
        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="font-bold text-book-burgundy line-clamp-2">{book.title}</h3>
        <p className="text-xs text-gray-600">by {book.author}</p>
        <div className="flex items-center gap-0.5 my-1">
          {Array.from({ length: Math.floor(book.rating) }).map((_, i) => (
            <span key={i} className="text-book-gold text-xs">★</span>
          ))}
          <span className="text-xs text-gray-500 ml-1">{book.rating.toFixed(1)}</span>
        </div>
        <div className="flex gap-1 mt-auto">
          {book.genre.slice(0, 2).map((genre, index) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-0 h-5 bg-book-cream text-book-burgundy">
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

const Library: React.FC = () => {
  const { likedBooks } = useBookRecommendation();

  return (
    <div className="mt-8 w-full max-w-md mx-auto px-4">
      <h2 className="text-2xl font-bold text-book-burgundy mb-4">Your Library</h2>
      <Separator className="mb-4" />
      
      {likedBooks.length > 0 ? (
        <div className="space-y-4">
          {likedBooks.map(book => (
            <LibraryBookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg">
          <p className="text-gray-500">Your library is empty. Start swiping to add books!</p>
        </div>
      )}
    </div>
  );
};

export default Library;
