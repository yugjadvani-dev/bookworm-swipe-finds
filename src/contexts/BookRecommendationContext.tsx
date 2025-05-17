
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types/book';
import { books as initialBooks } from '../data/books';
import { useToast } from '@/components/ui/use-toast';

type UserPreference = {
  bookId: string;
  liked: boolean;
};

interface BookRecommendationContextType {
  currentBook: Book | null;
  likedBooks: Book[];
  dislikedBooks: Book[];
  remainingBooks: Book[];
  handleLike: () => void;
  handleDislike: () => void;
  resetRecommendations: () => void;
}

const BookRecommendationContext = createContext<BookRecommendationContextType | undefined>(undefined);

export const useBookRecommendation = () => {
  const context = useContext(BookRecommendationContext);
  if (!context) {
    throw new Error('useBookRecommendation must be used within a BookRecommendationProvider');
  }
  return context;
};

export const BookRecommendationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [currentBookIndex, setCurrentBookIndex] = useState<number>(0);
  const [likedBooks, setLikedBooks] = useState<Book[]>([]);
  const [dislikedBooks, setDislikedBooks] = useState<Book[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('bookPreferences');
    if (savedPreferences) {
      const preferences: UserPreference[] = JSON.parse(savedPreferences);
      setUserPreferences(preferences);
      
      // Filter books based on preferences
      const liked = books.filter(book => 
        preferences.some(pref => pref.bookId === book.id && pref.liked)
      );
      const disliked = books.filter(book => 
        preferences.some(pref => pref.bookId === book.id && !pref.liked)
      );
      
      setLikedBooks(liked);
      setDislikedBooks(disliked);
      
      // Reorder remaining books based on user preferences
      const remainingBooks = books.filter(book => 
        !preferences.some(pref => pref.bookId === book.id)
      );
      
      if (remainingBooks.length > 0 && liked.length > 0) {
        // Simple recommendation: prioritize same genres as liked books
        const likedGenres = liked.flatMap(book => book.genre);
        remainingBooks.sort((a, b) => {
          const aMatchCount = a.genre.filter(g => likedGenres.includes(g)).length;
          const bMatchCount = b.genre.filter(g => likedGenres.includes(g)).length;
          return bMatchCount - aMatchCount;
        });
        
        setBooks([...remainingBooks]);
      }
    }
  }, []);

  const savePreferences = (newPreferences: UserPreference[]) => {
    localStorage.setItem('bookPreferences', JSON.stringify(newPreferences));
    setUserPreferences(newPreferences);
  };

  const handleLike = () => {
    if (currentBookIndex >= books.length) return;
    
    const currentBook = books[currentBookIndex];
    const updatedLikedBooks = [...likedBooks, currentBook];
    setLikedBooks(updatedLikedBooks);
    
    const newPreferences = [
      ...userPreferences, 
      { bookId: currentBook.id, liked: true }
    ];
    
    savePreferences(newPreferences);
    
    // Force UI update by setting index directly
    setCurrentBookIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      return newIndex;
    });
    
    toast({
      title: "Added to your library!",
      description: `You liked "${currentBook.title}"`,
    });
  };

  const handleDislike = () => {
    if (currentBookIndex >= books.length) return;
    
    const currentBook = books[currentBookIndex];
    const updatedDislikedBooks = [...dislikedBooks, currentBook];
    setDislikedBooks(updatedDislikedBooks);
    
    const newPreferences = [
      ...userPreferences, 
      { bookId: currentBook.id, liked: false }
    ];
    
    savePreferences(newPreferences);
    
    // Force UI update by setting index directly
    setCurrentBookIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      return newIndex;
    });
  };

  const resetRecommendations = () => {
    localStorage.removeItem('bookPreferences');
    setBooks(initialBooks);
    setCurrentBookIndex(0);
    setLikedBooks([]);
    setDislikedBooks([]);
    setUserPreferences([]);
    
    toast({
      title: "Recommendations Reset",
      description: "Your preference data has been cleared",
    });
  };

  const value = {
    currentBook: books[currentBookIndex] || null,
    likedBooks,
    dislikedBooks,
    remainingBooks: books.slice(currentBookIndex + 1),
    handleLike,
    handleDislike,
    resetRecommendations,
  };

  return (
    <BookRecommendationContext.Provider value={value}>
      {children}
    </BookRecommendationContext.Provider>
  );
};
