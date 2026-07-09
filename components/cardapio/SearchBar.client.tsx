"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Buscar no cardápio..."
        className="w-full rounded-full bg-card border border-border/50 pl-11 pr-10 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
      />
      {query && (
        <button
          onClick={() => handleChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
