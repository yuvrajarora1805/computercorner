import Card from "@/components/UI/Card";
import { useGetAllProductsQuery } from "@/redux/api/apiSlice";
import { useRouter } from "next/router";

const CpuProssesorPage = () => {
  const router = useRouter();
  const { data } = useGetAllProductsQuery();
  // console.log(data.data);
  const spacificPageData = data?.data?.filter(
    (products) => products?.category === router.query.categoryId
  );
  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans py-10">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold border-b border-gray-800 uppercase my-4 pb-4">
          {router.query.categoryId}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-10">
          {spacificPageData?.map((spacific) => (
            <Card key={spacific._id} product={spacific} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CpuProssesorPage;
