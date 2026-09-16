import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const mockCases = [
  {
    _id: "case-mock-1",
    img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT0w-8aVJOSflNb1dMOMwzGvQXyXxRt-XuIGapN9SrVQkqhRg78Hm-nXtsDlydHCD6DDR8VpfdApCODLIYiuGyWZpXs9lflX45-ICCZ2T22it5JX0nmYNHz0M4",
    name: "NZXT H510 ATX Mid Tower Case",
    category: "others",
    price: "8,500",
    status: "In Stock",
    rating: "5",
    description: "The H510 features a clean, modern design, iconic cable management bar, and uninterrupted tempered-glass side panel.",
    keyFeature: "ATX Mid Tower, Tempered Glass",
    individualRating: "5",
    reviews: []
  },
  {
    _id: "case-mock-2",
    img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT0w-8aVJOSflNb1dMOMwzGvQXyXxRt-XuIGapN9SrVQkqhRg78Hm-nXtsDlydHCD6DDR8VpfdApCODLIYiuGyWZpXs9lflX45-ICCZ2T22it5JX0nmYNHz0M4",
    name: "Corsair 4000D Airflow",
    category: "others",
    price: "9,200",
    status: "In Stock",
    rating: "4",
    description: "The CORSAIR 4000D AIRFLOW is a distinctive, high-airflow optimized mid-tower ATX case.",
    keyFeature: "High-Airflow Front Panel",
    individualRating: "4",
    reviews: []
  }
];

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),

  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/products",
      transformResponse: (response) => {
        const filteredData = response.data.filter(p => p.category !== 'others');
        return { ...response, data: [...filteredData, ...mockCases] };
      }
    }),
  }),
});

export const { useGetAllProductsQuery } = apiSlice;
