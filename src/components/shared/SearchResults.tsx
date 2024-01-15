import { ISearchResult } from "@/types";
import GridPostList from "./GridPostList";
import Loader from "./Loader";

const SearchResults = ({ isSearching, searchedPosts }: ISearchResult) => {
  if (isSearching) return <Loader />;
  if (searchedPosts && searchedPosts?.length > 0)
    return <GridPostList posts={searchedPosts} />;
  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default SearchResults;
