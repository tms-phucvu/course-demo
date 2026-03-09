"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/core/lib/utils";
import { getSearchIndex } from "../config/search-index";

interface DocsSearchProps {
  className?: string;
}

export function DocsSearch({ className }: DocsSearchProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchIndex = useMemo(() => getSearchIndex(), []);

  const fuse = useMemo(
    () =>
      new Fuse(searchIndex, {
        keys: ["title", "section"],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [searchIndex]
  );

  const results = useMemo(() => {
    if (!query || query.length < 2) {
      return [];
    }
    return fuse.search(query).map((result) => result.item);
  }, [query, fuse]);

  // Keyboard navigation
  useEffect(() => {
    if (!searchOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
        setSelectedIndex(0);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        const selectedItem = results[selectedIndex];
        window.location.href = selectedItem.href;
        setSearchOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, results, selectedIndex]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <div className={cn("relative", className)}>
      {searchOpen ? (
        <div className='relative w-64'>
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              ref={inputRef}
              type='search'
              placeholder='Search documentation...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={(e) => {
                // Don't close if clicking on results
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setTimeout(() => setSearchOpen(false), 200);
                }
              }}
              className='h-9 w-full pr-9 pl-9'
            />
            <Button
              variant='ghost'
              size='icon'
              className='absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2'
              onClick={() => {
                setSearchOpen(false);
                setQuery("");
              }}
              aria-label='Close search'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>

          {/* Search Results */}
          {query.length >= 2 && (
            <div
              ref={resultsRef}
              className='bg-popover absolute z-50 mt-1 max-h-96 w-full overflow-y-auto rounded-md border shadow-lg'
              onMouseDown={(e) => e.preventDefault()}
            >
              {results.length > 0 ? (
                <div className='p-1'>
                  {results.map((item, index) => (
                    <Link
                      key={`${item.href}-${index}`}
                      href={item.href}
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className={cn(
                        "block rounded-sm px-3 py-2 text-sm transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        selectedIndex === index &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className='font-medium'>{item.title}</div>
                      <div className='text-muted-foreground text-xs'>
                        {item.section}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className='text-muted-foreground p-4 text-center text-sm'>
                  No results found for &quot;{query}&quot;
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setSearchOpen(true)}
          aria-label='Search'
        >
          <Search className='h-5 w-5' />
        </Button>
      )}
    </div>
  );
}
