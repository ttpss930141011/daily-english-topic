"use client";

import React, { useState } from 'react';
import { Topic } from '@/lib/topics';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, Grid as IconGrid, List as IconList, BookOpen, X as IconX, Tag as IconTag } from 'lucide-react';
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

export default function TopicGrid({ topics }: TopicGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({ tags: [] });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">Daily English Topics</h1>
          <p className="text-lg text-gray-600">Explore and learn through interactive slides</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <IconTag className="w-4 h-4" /> Tags
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <Command>
                  <CommandInput placeholder="Filter tags..." />
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
              <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={clearAllFilters}>
                <IconX className="w-4 h-4" /> Clear
              </Button>
            )}
            <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}>
              <IconGrid className="w-5 h-5" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')}>
              <IconList className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Topics Count */}
        <div className="text-center text-sm text-gray-600">
          Showing {filteredTopics.length} of {topics.length} topics
        </div>

        {/* Topics Grid/List */}
        <motion.div
          layout
          className={cn(
            'gap-6',
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr'
              : 'flex flex-col space-y-4'
          )}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {filteredTopics.map(topic => (
              <motion.div
                key={topic.date}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg truncate">{topic.title}</CardTitle>
                    {topic.description && (
                      <CardDescription className="line-clamp-2">{topic.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-1 mb-4">
                        {topic.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className="w-full" asChild>
                        <a href={`/topic/${topic.date}`} className="block">
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

        {filteredTopics.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="mx-auto mb-4 w-8 h-8" />
            No topics found.
          </div>
        )}
      </div>
    </div>
  );
}