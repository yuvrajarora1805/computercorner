import Card from "@/components/UI/Card";
import { useGetAllProductsQuery } from "@/redux/api/apiSlice";
import { useRouter } from "next/router";

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const { data, isLoading } = useGetAllProductsQuery();
  
  const searchResults = data?.data?.filter(
    (product) => product?.name?.toLowerCase().includes((q || "").toString().toLowerCase())
      || product?.category?.toLowerCase().includes((q || "").toString().toLowerCase())
  ) || [];

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans py-10">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold border-b border-gray-800 my-4 pb-4">
          Search Results for <span className="text-yellow-500">"{q}"</span>
        </h2>
        
        {isLoading ? (
          <p className="text-gray-400 mt-10">Searching...</p>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-10">
            {searchResults.map((product) => (
              <Card key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
