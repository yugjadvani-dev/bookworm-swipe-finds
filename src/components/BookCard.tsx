
import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface BookCardProps {
  book: Book;
  isActive: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, isActive, onSwipeLeft, onSwipeRight }) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [startX, setStartX] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const swipeThreshold = 100;

  // Reset state when active book changes
  useEffect(() => {
    if (isActive) {
      setSwipeDirection(null);
      setStartX(0);
      setOffsetX(0);
    }
  }, [book.id, isActive]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isActive) return;
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isActive || startX === 0) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    if (!isActive || startX === 0) return;

    if (offsetX > swipeThreshold) {
      setSwipeDirection('right');
      setTimeout(() => {
        onSwipeRight();
        // Reset state after swipe action completes
        setSwipeDirection(null);
      }, 300);
    } else if (offsetX < -swipeThreshold) {
      setSwipeDirection('left');
      setTimeout(() => {
        onSwipeLeft();
        // Reset state after swipe action completes
        setSwipeDirection(null);
      }, 300);
    } else {
      // Reset if no swipe threshold met
      setOffsetX(0);
    }

    setStartX(0);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    setStartX(e.clientX);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (startX === 0) return;
    const diff = e.clientX - startX;
    setOffsetX(diff);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    if (offsetX > swipeThreshold) {
      setSwipeDirection('right');
      setTimeout(() => {
        onSwipeRight();
        // Reset state after swipe action completes
        setSwipeDirection(null);
      }, 300);
    } else if (offsetX < -swipeThreshold) {
      setSwipeDirection('left');
      setTimeout(() => {
        onSwipeLeft();
        // Reset state after swipe action completes
        setSwipeDirection(null);
      }, 300);
    } else {
      // Reset if no swipe threshold met
      setOffsetX(0);
    }

    setStartX(0);
  };

  const cardStyle = {
    transform: offsetX ? `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)` : 'translateX(0)',
    opacity: Math.max(1 - Math.abs(offsetX) / 500, 0.5),
    zIndex: isActive ? 10 : 0,
  };

  return (
    <div
      className={cn(
        "absolute w-full max-w-md book-card transition-all duration-300",
        isActive ? "opacity-100" : "opacity-0 pointer-events-none",
        swipeDirection === 'right' ? "animate-swipe-right" : "",
        swipeDirection === 'left' ? "animate-swipe-left" : "",
        !isActive && !swipeDirection ? "animate-appear" : ""
      )}
      style={cardStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <div className="inner bg-white rounded-lg overflow-hidden shadow-xl">
        <div className="relative h-80 overflow-hidden">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-1">
            {book.genre.slice(0, 2).map((genre, index) => (
              <Badge key={index} className="bg-book-burgundy/80 hover:bg-book-burgundy">{genre}</Badge>
            ))}
          </div>
        </div>
        <div className="p-6 bg-book-cream">
          <h2 className="text-2xl font-bold text-book-burgundy line-clamp-2">{book.title}</h2>
          <p className="text-sm text-book-navy font-semibold my-1">by {book.author} • {book.year}</p>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: Math.floor(book.rating) }).map((_, i) => (
              <span key={i} className="text-book-gold">★</span>
            ))}
            {book.rating % 1 >= 0.5 && <span className="text-book-gold">★</span>}
            <span className="text-sm text-gray-500 ml-1">{book.rating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-3">{book.description}</p>
        </div>

        <div className="flex justify-between p-4 bg-gradient-to-b from-book-cream to-white">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSwipeDirection('left');
              setTimeout(() => {
                onSwipeLeft();
                setSwipeDirection(null);
              }, 300);
            }}
            className="rounded-full h-10 w-10 border-2 border-gray-300 bg-white text-book-burgundy hover:bg-gray-100"
          >
            ✕
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSwipeDirection('right');
              setTimeout(() => {
                onSwipeRight();
                setSwipeDirection(null);
              }, 300);
            }}
            className="rounded-full h-10 w-10 border-2 border-gray-300 bg-white text-book-burgundy hover:bg-gray-100"
          >
            ♥
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
