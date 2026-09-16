import Card from "@/components/UI/Card";
import { useAppSelector } from "@/redux/hooks";

const FavoritesPage = () => {
  const { items } = useAppSelector((state) => state.favorites);

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold border-b border-gray-800 my-4 pb-4">
          Your Favorites
        </h2>
        
        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-10">
            {items.map((product) => (
              <Card key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl text-gray-400 mb-4">No favorites yet!</h3>
            <p className="text-gray-500 text-lg">Click the heart icon on any product to save it for later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
