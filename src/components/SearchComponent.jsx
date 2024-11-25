'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query is empty",
        description: "Please enter a search term",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.get('/hybrid_search', {
        params: { query: searchQuery, limit: 10 },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      setSearchResults(response.data.results)
    } catch (error) {
      console.error('Search error:', error)
      let errorMessage = "An error occurred while searching. Please try again."
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage
      } else if (error.request) {
        errorMessage = "No response received from server. Please try again later."
      }
      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <div className="p-4 space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Refine your search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          {searchResults.length > 0 ? (
            <ul className="space-y-2">
              {searchResults.map((result) => (
                <li key={result.id} className="p-2 hover:bg-gray-100 rounded">
                  <span className="font-medium">{result.title}</span>
                  <span className="ml-2 text-sm text-gray-500">{result.type}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              {isLoading ? 'Searching...' : 'No results found'}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SearchComponent


