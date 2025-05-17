
import React, { useState, useEffect } from 'react';
import { BookRecommendationProvider } from '../contexts/BookRecommendationContext';
import BookSwiper from '../components/BookSwiper';
import Library from '../components/Library';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState('discover');

  return (
    <div className="min-h-screen bg-book-paper overflow-x-hidden">
      <BookRecommendationProvider>
        <Header />
        <div className="container mx-auto px-4 pb-20">
          <Tabs 
            defaultValue="discover" 
            className="w-full max-w-md mx-auto"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="discover" 
                className="data-[state=active]:bg-book-burgundy data-[state=active]:text-white"
              >
                Discover
              </TabsTrigger>
              <TabsTrigger 
                value="library" 
                className="data-[state=active]:bg-book-burgundy data-[state=active]:text-white"
              >
                Library
              </TabsTrigger>
            </TabsList>
            <TabsContent value="discover">
              <BookSwiper />
            </TabsContent>
            <TabsContent value="library">
              <Library />
            </TabsContent>
          </Tabs>
        </div>
      </BookRecommendationProvider>
    </div>
  );
};

export default Index;
