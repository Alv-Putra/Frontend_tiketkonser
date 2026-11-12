'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchInput({
  placeholder = 'Cari festival, artis, atau venue...',
  className = '',
  size = 'md',
  showSuggestions = true,
  suggestions = [],
  onSearch,
  onSuggestionSelect,
}) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const router = useRouter();

  // Mock suggestions based on query
  const mockSuggestions = query.length >= 2 ? [
    { type: 'festival', text: `Java Jazz Festival ${new Date().getFullYear()}`, href: '/festivals/java-jazz' },
    { type: 'festival', text: `Coldplay: Music of the Spheres`, href: '/festivals/coldplay' },
    { type: 'artist', text: 'Dewa 19', href: '/festivals?artist=dewa-19' },
    { type: 'venue', text: 'JIExpo Kemayoran, Jakarta', href: '/festivals?venue=jiexpo' },
    { type: 'city', text: 'Jakarta', href: '/festivals?city=jakarta' },
  ].filter(s => s.text.toLowerCase().includes(query.toLowerCase())) : [];

  const displaySuggestions = suggestions.length > 0 ? suggestions : mockSuggestions;
  const showDropDown = showSuggestions && isFocused && displaySuggestions.length > 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDropDown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < displaySuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && displaySuggestions[selectedIndex]) {
          handleSelect(displaySuggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSubmit();
        }
        break;
      case 'Escape':
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSubmit = () => {
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/festivals?search=${encodeURIComponent(query)}`);
    }
    setIsFocused(false);
  };

  const handleSelect = (suggestion) => {
    setQuery('');
    setIsFocused(false);
    setSelectedIndex(-1);

    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else if (suggestion.href) {
      router.push(suggestion.href);
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const sizes = {
    sm: 'py-2 text-sm',
    md: 'py-3 text-sm',
    lg: 'py-4 text-base',
  };

  const icons = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'festival': return Clock;
      case 'artist': return TrendingUp;
      case 'venue': return MapPin;
      case 'city': return MapPin;
      default: return Search;
    }
  };

  return (
    <div className={`relative ${className}`} ref={suggestionsRef}>
      <div className={`relative flex items-center bg-surface border rounded-full transition-all duration-200 ${
        isFocused ? 'border-primary-accent ring-2 ring-primary-accent/20' : 'border-border'
      } ${sizes[size]}`}>
        <Search
          size={icons[size]}
          className={`absolute left-4 text-text-muted ${isFocused ? 'text-primary-accent' : ''}`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent pl-12 pr-10 text-text-primary placeholder:text-text-muted focus:outline-none"
          role="combobox"
          aria-expanded={showDropDown}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X size={icons[size] - 2} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropDown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            id="search-suggestions"
            role="listbox"
            className="absolute top-full left-0 right-0 mt-2 bg-secondary-bg border border-border rounded-[18px] shadow-xl overflow-hidden z-50"
          >
            <div className="py-2">
              {displaySuggestions.map((suggestion, index) => {
                const Icon = getSuggestionIcon(suggestion.type);
                return (
                  <button
                    key={`${suggestion.type}-${suggestion.text}`}
                    onClick={() => handleSelect(suggestion)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                      index === selectedIndex ? 'bg-surface' : 'hover:bg-surface/50'
                    }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <Icon size={16} className="text-text-muted shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">
                        {suggestion.text}
                      </p>
                      <p className="text-xs text-text-muted capitalize">
                        {suggestion.type}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-border px-4 py-2">
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary-accent hover:underline"
              >
                <Search size={14} />
                Cari &quot;{query}&quot;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
