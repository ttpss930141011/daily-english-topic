"use client";

import React, { useState, useEffect } from 'react';
import { Topic } from '@/lib/topics';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, Grid as IconGrid, List as IconList, BookOpen, X as IconX, Tag as IconTag, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';

interface TopicGridProps {
  topics: Topic[];
}

interface FilterState {
  tags: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300
    }
  }
};

export default function TopicGrid({ topics }: TopicGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({ tags: [] });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  useEffect(() => {
    // Component loaded
  }, []);

  const allTags = Array.from(new Set(topics.flatMap(t => t.tags)));

  const filteredTopics = topics.filter(topic => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (topic.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      filters.tags.length === 0 || filters.tags.some(tag => topic.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const clearAllFilters = () => setFilters({ tags: [] });

  return (
    <div className="min-h-screen relative">
      {/* Simplified Header */}
      <motion.div 
        className="relative pt-20 pb-12 px-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Explore interactive English learning experiences crafted from real Reddit discussions
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Search and Filters */}
        <motion.div
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search topics, discussions, or keywords..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-emerald-400 transition-all duration-300"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all duration-300"
                    >
                      <IconTag className="w-4 h-4 mr-2" /> 
                      Tags {filters.tags.length > 0 && `(${filters.tags.length})`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 bg-gray-900/95 backdrop-blur-lg border-gray-700">
                    <Command>
                      <CommandInput placeholder="Filter tags..." className="text-white" />
                      <CommandList>
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandGroup>
                          {allTags.map(tag => (
                            <CommandItem
                              key={tag}
                              onSelect={() => {
                                const newTags = filters.tags.includes(tag)
                                  ? filters.tags.filter(t => t !== tag)
                                  : [...filters.tags, tag];
                                setFilters({ tags: newTags });
                              }}
                              className="text-gray-200 hover:bg-gray-800"
                            >
                              <Checkbox checked={filters.tags.includes(tag)} className="mr-2" />
                              {tag}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                {filters.tags.length > 0 && (
                  <Button 
                    variant="ghost" 
                    onClick={clearAllFilters}
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    <IconX className="w-4 h-4 mr-1" /> Clear
                  </Button>
                )}
                
                <div className="flex bg-white/5 rounded-lg p-1">
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-gray-300 hover:text-white hover:bg-white/20'}
                  >
                    <IconGrid className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-gray-300 hover:text-white hover:bg-white/20'}
                  >
                    <IconList className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Topics Count */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <p className="text-gray-400">
            Showing <span className="text-emerald-400 font-semibold">{filteredTopics.length}</span> of <span className="text-blue-400 font-semibold">{topics.length}</span> topics
          </p>
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          className={cn(
            'gap-6',
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr'
              : 'flex flex-col space-y-6'
          )}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.date}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group"
              >
                <Card className="h-full flex flex-col bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Card Number */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold z-10">
                    {index + 1}
                  </div>
                  
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-xl text-white group-hover:text-emerald-200 transition-colors duration-300 pr-10">
                      {topic.title}
                    </CardTitle>
                    {topic.description && (
                      <CardDescription className="text-gray-300 line-clamp-2">
                        {topic.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col relative z-10">
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {topic.tags.slice(0, 3).map(tag => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs bg-white/5 border-white/20 text-gray-200 hover:bg-white/10 transition-colors duration-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {topic.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-gray-400">
                            +{topic.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105" 
                        asChild
                      >
                        <a href={`/topic/${topic.date}`} className="flex items-center justify-center">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Start Learning
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredTopics.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 max-w-md mx-auto border border-white/10">
              <BookOpen className="mx-auto mb-6 w-16 h-16 text-gray-400" />
              <h3 className="text-2xl font-bold text-white mb-3">No topics found</h3>
              <p className="text-gray-300 mb-6">Try adjusting your search or filters to discover more content.</p>
              <Button 
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Clear All Filters
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}