import { SearchResults } from "./search-results"
import { searchContent } from "@/app/api/search/search"
import { MobileSearch } from "@/components/search/mobile-search"
export const runtime = "edge"

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q
  const results = await searchContent(query || "")

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full p-6 px-4">
      <MobileSearch />

      {!query ? (
        <div className="flex flex-col font-[family-name:var(--font-geist-sans)] h-full p-6 px-4">
          <p className="text-gray-500 mt-4">Enter a search term to begin</p>
        </div>
      ) : (
        <SearchResults {...results} query={query} />
      )}
    </div>
  )
}
