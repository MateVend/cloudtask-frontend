import { useState } from 'react'

export default function SearchBar({ onSearch, placeholder = 'Search...' }) {
    const [query, setQuery] = useState('')

    const handleSearch = (value) => {
        setQuery(value)
        onSearch(value)
    }

    const handleClear = () => {
        setQuery('')
        onSearch('')
    }

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={placeholder}
                className="input pl-10 pr-10"
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            )}
        </div>
    )
}