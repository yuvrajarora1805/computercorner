import Head from "next/head";
import Footer from "@/components/UI/Footer";
import Navbar from "@/components/UI/Navbar";
import { store } from "@/redux/store";
import { hydrateCart } from "@/redux/cart/cartSlice";
import { hydrateFavorites } from "@/redux/favorites/favoriteSlice";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";

function StoreHydrator({ children }) {
  useEffect(() => {
    store.dispatch(hydrateCart());
    store.dispatch(hydrateFavorites());
  }, []);

  return children;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');
  const isAdminLoginRoute = router.pathname === '/admin/login';
  
  const isNormalAdminRoute = isAdminRoute && !isAdminLoginRoute;

  return (
    <Provider store={store}>
      <SessionProvider session={pageProps.session}>
        <StoreHydrator>
          <Head>
          <title>The Computer Corner - Best Computer Shop in Bathinda | Custom Gaming PC & Hardware</title>
          <meta name="description" content="The Computer Corner is Bathinda's best computer shop and custom PC build store. Buy high-performance gaming rigs, processors, graphics cards, motherboards, RAM, and genuine PC parts at best prices." />
          <meta name="keywords" content="Best computer shop in Bathinda, custom PC builder Bathinda, gaming PC Bathinda, computer accessories Bathinda, The Computer Corner, graphics cards, Intel AMD processor, PC components Punjab" />
          <meta name="author" content="The Computer Corner" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://thecomputercorner.org" />

          {/* Open Graph / Facebook / WhatsApp */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://thecomputercorner.org/" />
          <meta property="og:title" content="The Computer Corner - Best Computer Shop in Bathinda" />
          <meta property="og:description" content="Best computer shop & custom gaming PC store in Bathinda, Punjab. 100% genuine parts, custom 3D PC builder, warranty, and fast express shipping." />
          <meta property="og:image" content="https://thecomputercorner.org/logo.png" />

          {/* Twitter Meta */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="The Computer Corner - Best Computer Shop in Bathinda" />
          <meta name="twitter:description" content="Best computer shop in Bathinda. Custom gaming PCs, workstations & genuine components with warranty." />
          <meta name="twitter:image" content="https://thecomputercorner.org/logo.png" />

          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/logo.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

          {/* Local Business Schema for Bathinda */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ComputerStore",
                "name": "The Computer Corner",
                "image": "https://thecomputercorner.org/logo.png",
                "url": "https://thecomputercorner.org",
                "telephone": "+9189563600008",
                "priceRange": "₹₹",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "520, Amrik Singh Rd",
                  "addressLocality": "Bathinda",
                  "addressRegion": "Punjab",
                  "postalCode": "151001",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "30.2110",
                  "longitude": "74.9455"
                },
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                  ],
                  "opens": "10:00",
                  "closes": "20:00"
                }
              })
            }}
          />
        </Head>
        {!isAdminRoute && <Navbar />}
        <div>
          {isNormalAdminRoute ? (
            <AdminLayout>
              <Component {...pageProps} />
            </AdminLayout>
          ) : (
            <Component {...pageProps} />
          )}
          <Toaster />
        </div>
        {!isAdminRoute && <Footer />}
        </StoreHydrator>
      </SessionProvider>
    </Provider>
  );
}
