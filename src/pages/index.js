import Banner from "@/components/UI/Banner";
import Card from "@/components/UI/Card";
import { useAppDispatch } from "@/redux/hooks";
import { avarageRating } from "@/redux/product/productSlice";
import Link from "next/link";
import { RiCpuLine, RiDashboardLine, RiDatabase2Line, RiGamepadLine, RiHardDrive2Line, RiServerLine } from "react-icons/ri";

const categories = [
  { id: 'processor', name: 'Processor', icon: <RiCpuLine className="text-4xl mb-3" /> },
  { id: 'motherboard', name: 'Motherboard', icon: <RiDashboardLine className="text-4xl mb-3" /> },
  { id: 'monitor', name: 'Graphics Card', icon: <RiGamepadLine className="text-4xl mb-3" /> },
  { id: 'ram', name: 'Memory', icon: <RiDatabase2Line className="text-4xl mb-3" /> },
  { id: 'storage', name: 'Storage', icon: <RiHardDrive2Line className="text-4xl mb-3" /> },
  { id: 'supply', name: 'Power Supply', icon: <RiServerLine className="text-4xl mb-3" /> },
  { id: 'others', name: 'Case & Cooler', icon: <RiDashboardLine className="text-4xl mb-3" /> }
];

const HomePage = ({ allProducts }) => {
  const dispatch = useAppDispatch();
  dispatch(avarageRating(allProducts?.data));

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans">
      <Banner />

      {/* Shop By Category Section */}
      <div className="container mx-auto px-6 lg:px-8 py-20 border-b border-gray-900">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              <span className="text-gray-500 font-light">Shop by</span> Category
            </h2>
            <div className="w-20 h-1 bg-yellow-500 rounded-full"></div>
          </div>
          <Link href="/pcbuilder" className="text-yellow-500 hover:text-yellow-400 font-medium text-sm transition-colors mt-4 md:mt-0 flex items-center gap-1">
            Build Your Own PC &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.id}`}
              className="bg-[#111111] hover:bg-[#1a1a1a] border border-gray-800 hover:border-yellow-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/10 group"
            >
              <div className="text-gray-500 group-hover:text-yellow-500 transition-colors">
                {cat.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              <span className="text-gray-500 font-light">Featured</span> Products
            </h2>
            <div className="w-20 h-1 bg-yellow-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allProducts?.data?.slice(0, 8).map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Link href="/category/processor" className="btn bg-transparent border border-gray-700 text-gray-300 hover:bg-white/5 hover:border-gray-500 rounded-full px-8 h-12 font-semibold">
            View All Products
          </Link>
        </div>
      </div>

    </div>
  );
};

export default HomePage;

export const getStaticProps = async () => {
  try {
    const pool = (await import('@/utils/db')).default;
    const [rows] = await pool.query('SELECT * FROM products');
    
    // Convert dates or non-serializable objects if any, though our schema uses strings
    const data = JSON.parse(JSON.stringify(rows));
    
    return {
      props: {
        allProducts: { data },
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching products for static generation:', error);
    return {
      props: {
        allProducts: { data: [] },
      },
      revalidate: 10,
    };
  }
};
