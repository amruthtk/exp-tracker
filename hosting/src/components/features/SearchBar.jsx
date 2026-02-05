import React from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SearchBar = ({ onSelectUser }) => {
  const { searchQuery, setSearchQuery, searchResults } = useApp();

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search username to add..."
        className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-base font-medium focus:ring-2 focus:ring-primary/50 outline-none"
      />
      
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-10">
          {searchResults.map(result => (
            <button
              key={result.id}
              onClick={() => {
                onSelectUser(result);
                setSearchQuery('');
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
            >
              <img src={result.avatar} alt={result.name} className="w-10 h-10 rounded-full" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">{result.name}</p>
                <p className="text-sm text-gray-500">@{result.username}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;