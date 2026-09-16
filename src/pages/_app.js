import Footer from "@/components/UI/Footer";
import Navbar from "@/components/UI/Navbar";
import { store } from "@/redux/store";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import AdminLayout from "@/components/Layouts/AdminLayout";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');
  const isAdminLoginRoute = router.pathname === '/admin/login';
  
  const isNormalAdminRoute = isAdminRoute && !isAdminLoginRoute;

  return (
    <Provider store={store}>
      <SessionProvider session={pageProps.session}>
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
      </SessionProvider>
    </Provider>
  );
}
