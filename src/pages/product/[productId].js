import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { addToCart, removeFromCart, updateQuantity } from "@/redux/cart/cartSlice";
import { toggleFavorite } from "@/redux/favorites/favoriteSlice";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-hot-toast";
import React, { useState } from "react";
import Head from "next/head";
import Card from "@/components/UI/Card";
import {
  RiShieldCheckLine,
  RiTruckLine,
  RiCpuLine,
  RiSparklingLine,
  RiHeartLine,
  RiHeartFill,
  RiShoppingCartLine,
  RiFlashlightFill,
  RiToolsLine,
  RiCheckDoubleLine,
  RiArrowRightLine,
  RiInformationLine,
  RiFileList3Line,
  RiExchangeLine,
} from "react-icons/ri";

const ProductDetailPage = ({ product, relatedProducts = [] }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    _id,
    img,
    name,
    category,
    status,
    price,
    keyFeature,
    description,
  } = product?.data || {};

  // Redux state
  const { items: cartItems } = useAppSelector((state) => state.product);
  const cartItem = cartItems?.find((item) => item._id === _id);
  const cartQuantity = cartItem ? cartItem.cartQuantity : 0;

  const { items: favoriteItems } = useAppSelector((state) => state.favorites || { items: [] });
  const isFavorite = favoriteItems?.some((item) => item._id === _id);

  // Parsing gallery images safely
  let images = [];
  try {
    if (img) {
      const parsed = JSON.parse(img);
      images = Array.isArray(parsed) ? parsed : [img];
    }
  } catch (e) {
    if (img) images = [img];
  }
  images = images.filter(Boolean);

  const [mainImage, setMainImage] = useState(images.length > 0 ? images[0] : null);
  const [activeTab, setActiveTab] = useState("specs"); // 'specs' | 'overview' | 'compatibility'

  // Image Zoom / Hover interaction state
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: "50% 50%", transform: "scale(1)" });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.85)",
    });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({ transformOrigin: "50% 50%", transform: "scale(1)" });
  };

  const handleUpdateQuantity = (e, newQuantity) => {
    e.preventDefault();
    if (newQuantity === 0) {
      dispatch(removeFromCart(_id));
      toast.success(`${name} removed from cart`);
    } else {
      dispatch(updateQuantity({ id: _id, quantity: newQuantity }));
    }
  };

  const handleToggleFavorite = () => {
    if (!product?.data) return;
    dispatch(toggleFavorite(product.data));
    toast.success(isFavorite ? `${name} removed from wishlist` : `${name} added to wishlist!`);
  };

  // Helper to parse key features into key-value or bullet items
  const parseKeyFeatures = (rawFeatures) => {
    if (!rawFeatures) return [];
    return rawFeatures
      .split(/[,|\n]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const parts = item.split(":");
        if (parts.length >= 2) {
          return { key: parts[0].trim(), value: parts.slice(1).join(":").trim() };
        }
        return { key: null, value: item };
      });
  };

  const parsedFeatures = parseKeyFeatures(keyFeature);

  return (
    <>
      <Head>
        <title>{name ? `${name} | The Computer Corner` : "Product Details | The Computer Corner"}</title>
        <meta name="description" content={description ? description.slice(0, 160) : `Buy ${name} at the best price with authentic warranty.`} />
      </Head>

      <div className="min-h-screen bg-[#0A0A0A] text-gray-200 pb-20 selection:bg-[#FDC800] selection:text-black">
        {/* Breadcrumb Bar */}
        <div className="border-b border-neutral-900 bg-[#0d0d0d]/80 backdrop-blur sticky top-0 z-30">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between text-xs md:text-sm text-gray-400">
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
              <Link href="/" className="hover:text-[#FDC800] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-500 uppercase tracking-wider">{category || "Hardware"}</span>
              <span>/</span>
              <span className="text-white font-medium truncate max-w-[200px] md:max-w-md">{name}</span>
            </div>

            <button
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${
                isFavorite
                  ? "border-[#FDC800] bg-[#FDC800]/10 text-[#FDC800]"
                  : "border-neutral-800 bg-neutral-900/60 text-gray-300 hover:border-neutral-700 hover:text-white"
              }`}
            >
              {isFavorite ? <RiHeartFill className="text-sm text-[#FDC800]" /> : <RiHeartLine className="text-sm" />}
              <span>{isFavorite ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="container mx-auto px-4 pt-8 md:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* ── LEFT COLUMN: Gallery (5 cols on lg) ──────────────── */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative bg-[#121212] rounded-2xl border-2 border-neutral-800/80 p-6 md:p-8 flex items-center justify-center min-h-[380px] md:min-h-[460px] overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                {/* Category Badge & Live Zoom indicator */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider font-bold bg-[#FDC800] text-black rounded shadow-[2px_2px_0px_#000]">
                    {category}
                  </span>
                  {status === "In Stock" && (
                    <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider font-bold bg-green-500/20 text-green-400 border border-green-500/30 rounded">
                      In Stock
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur text-gray-300 text-[11px] px-2.5 py-1 rounded border border-neutral-700 pointer-events-none">
                  Hover to Zoom
                </div>

                {/* Main Interactive Image */}
                <div
                  className="w-full h-full flex items-center justify-center cursor-crosshair overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    className="max-h-[380px] w-full object-contain transition-transform duration-150 ease-out select-none"
                    style={isZoomed ? zoomStyle : { transform: "scale(1)" }}
                    src={mainImage || "/img/cpu.png"}
                    alt={name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/cpu.png";
                      e.target.classList.add("opacity-50", "grayscale", "mix-blend-screen");
                    }}
                  />
                </div>
              </div>

              {/* Thumbnail Selector */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-800">
                  {images.map((imgUrl, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(imgUrl)}
                      className={`w-20 h-20 md:w-24 md:h-24 bg-[#141414] border-2 rounded-xl overflow-hidden shrink-0 transition-all p-2 flex items-center justify-center ${
                        mainImage === imgUrl
                          ? "border-[#FDC800] shadow-[0_0_12px_rgba(253,200,0,0.35)] scale-105"
                          : "border-neutral-800 hover:border-neutral-600 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt={`${name} thumbnail ${i + 1}`} className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs text-neutral-500 text-center font-mono italic">
                *Product renders & packaging for reference purpose. Actual model/revision may slightly vary.
              </p>
            </div>

            {/* ── RIGHT COLUMN: Product Actions & Summary (6 cols on lg) ──────────────── */}
            <div className="lg:col-span-6 flex flex-col justify-start">
              
              {/* Brand Tagline & Title */}
              <div className="mb-4">
                <span className="text-[#FDC800] text-xs font-mono font-bold tracking-widest uppercase mb-1 block">
                  Official Hardware Spec
                </span>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                  {name}
                </h1>
              </div>

              {/* Price Block with Inclusive Badges */}
              <div className="bg-[#141414] border border-neutral-800 rounded-xl p-5 mb-6 shadow-sm">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-xs text-neutral-400 uppercase font-mono tracking-wider">Price:</span>
                  <span className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    ₹ {price}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-2">
                  <span className="flex items-center gap-1 text-green-400 font-medium">
                    <RiCheckDoubleLine className="text-sm" /> Inclusive of all GST & taxes
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-neutral-300">Free Express Delivery available</span>
                </div>
              </div>

              {/* Quick Spec Highlights (Chips) */}
              {parsedFeatures.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-3 flex items-center gap-1.5">
                    <RiSparklingLine className="text-[#FDC800]" /> Hardware Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {parsedFeatures.slice(0, 4).map((feat, idx) => (
                      <div
                        key={idx}
                        className="bg-[#111111] border border-neutral-800/90 rounded-lg p-2.5 text-xs flex flex-col justify-center"
                      >
                        {feat.key ? (
                          <>
                            <span className="text-neutral-400 text-[10px] uppercase font-mono tracking-wider">{feat.key}</span>
                            <span className="text-white font-semibold truncate">{feat.value}</span>
                          </>
                        ) : (
                          <span className="text-neutral-200 font-medium">{feat.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions & Quantity Selector */}
              <div className="space-y-4 mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Quantity / Add to Cart */}
                  {cartQuantity > 0 ? (
                    <div className="h-12 w-full sm:w-48 flex items-center justify-between bg-[#171717] border-2 border-[#FDC800] rounded-xl overflow-hidden shadow-[2px_2px_0px_#000]">
                      <button
                        onClick={(e) => handleUpdateQuantity(e, cartQuantity - 1)}
                        className="w-12 h-full flex items-center justify-center font-black text-lg text-[#FDC800] hover:bg-[#FDC800] hover:text-black transition-colors"
                        title="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-white text-base">{cartQuantity}</span>
                      <button
                        onClick={(e) => handleUpdateQuantity(e, cartQuantity + 1)}
                        className="w-12 h-full flex items-center justify-center font-black text-lg text-[#FDC800] hover:bg-[#FDC800] hover:text-black transition-colors"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        dispatch(addToCart(product.data));
                        toast.success(`${name} added to cart!`);
                      }}
                      className="h-12 flex-1 flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white border-2 border-neutral-700 hover:border-neutral-500 font-bold px-6 rounded-xl transition-all shadow-[3px_3px_0px_#000] uppercase text-xs tracking-wider"
                    >
                      <RiShoppingCartLine className="text-base text-[#FDC800]" /> Add to Cart
                    </button>
                  )}

                  {/* Buy Now CTA */}
                  <button
                    onClick={() => {
                      if (cartQuantity === 0) {
                        dispatch(addToCart(product.data));
                      }
                      router.push("/checkout");
                    }}
                    className="h-12 flex-1 flex items-center justify-center gap-2 bg-[#FDC800] hover:bg-[#FFE500] text-black font-extrabold px-6 rounded-xl transition-all border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] uppercase text-xs tracking-wider active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <RiFlashlightFill className="text-base" /> Buy Now
                  </button>
                </div>

                {/* PC Builder Interactive Shortcut */}
                <Link
                  href="/pcbuilder"
                  className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-[#171717] to-[#121212] border border-neutral-800 hover:border-[#FDC800]/50 rounded-xl transition-colors group text-xs text-neutral-300"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#FDC800]/10 border border-[#FDC800]/30 flex items-center justify-center text-[#FDC800]">
                      <RiToolsLine />
                    </div>
                    <span>Building a custom rig? Add directly inside the <strong>3D PC Builder</strong></span>
                  </div>
                  <RiArrowRightLine className="text-neutral-500 group-hover:text-[#FDC800] transition-colors text-base" />
                </Link>
              </div>

              {/* Trust Badges Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-neutral-900">
                <div className="bg-[#0f0f0f] border border-neutral-800/80 rounded-lg p-3 text-center">
                  <RiShieldCheckLine className="text-[#FDC800] text-xl mx-auto mb-1.5" />
                  <p className="text-[11px] font-bold text-white">Genuine Brand</p>
                  <p className="text-[10px] text-neutral-400">100% Original</p>
                </div>
                <div className="bg-[#0f0f0f] border border-neutral-800/80 rounded-lg p-3 text-center">
                  <RiTruckLine className="text-[#FDC800] text-xl mx-auto mb-1.5" />
                  <p className="text-[11px] font-bold text-white">Fast Dispatch</p>
                  <p className="text-[10px] text-neutral-400">24-48 hr Dispatch</p>
                </div>
                <div className="bg-[#0f0f0f] border border-neutral-800/80 rounded-lg p-3 text-center">
                  <RiCpuLine className="text-[#FDC800] text-xl mx-auto mb-1.5" />
                  <p className="text-[11px] font-bold text-white">Warranty</p>
                  <p className="text-[10px] text-neutral-400">Mfg. Warranty</p>
                </div>
              </div>

            </div>
          </div>

          {/* ── TABBED SPECIFICATIONS & OVERVIEW SECTION ──────────────── */}
          <div className="mt-16 md:mt-20">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b-2 border-neutral-800 pb-px">
              <button
                onClick={() => setActiveTab("specs")}
                className={`flex items-center gap-2 px-5 py-3 font-mono font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "specs"
                    ? "border-[#FDC800] text-[#FDC800] bg-[#141414]"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <RiFileList3Line /> Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-5 py-3 font-mono font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "overview"
                    ? "border-[#FDC800] text-[#FDC800] bg-[#141414]"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <RiInformationLine /> Description & Details
              </button>
              <button
                onClick={() => setActiveTab("compatibility")}
                className={`flex items-center gap-2 px-5 py-3 font-mono font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "compatibility"
                    ? "border-[#FDC800] text-[#FDC800] bg-[#141414]"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <RiExchangeLine /> Compatibility Notes
              </button>
            </div>

            {/* Tab Panes */}
            <div className="bg-[#121212] border-2 border-t-0 border-neutral-800 rounded-b-2xl p-6 md:p-8">
              {activeTab === "specs" && (
                <div>
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FDC800]"></span> Key Specifications
                  </h3>
                  {parsedFeatures.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-neutral-800">
                      <table className="w-full text-left text-xs md:text-sm">
                        <tbody>
                          <tr className="border-b border-neutral-800 bg-[#171717]">
                            <td className="py-3 px-4 font-mono text-neutral-400 font-semibold w-1/3">Category</td>
                            <td className="py-3 px-4 text-white font-medium capitalize">{category}</td>
                          </tr>
                          <tr className="border-b border-neutral-800 bg-[#141414]">
                            <td className="py-3 px-4 font-mono text-neutral-400 font-semibold w-1/3">Stock Status</td>
                            <td className="py-3 px-4 text-green-400 font-medium">{status || "Available"}</td>
                          </tr>
                          {parsedFeatures.map((feat, idx) => (
                            <tr
                              key={idx}
                              className={`border-b border-neutral-800/70 last:border-0 ${
                                idx % 2 === 0 ? "bg-[#171717]" : "bg-[#141414]"
                              }`}
                            >
                              <td className="py-3 px-4 font-mono text-neutral-400 font-medium w-1/3">
                                {feat.key || `Feature ${idx + 1}`}
                              </td>
                              <td className="py-3 px-4 text-white font-medium">{feat.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-neutral-400 text-sm">Specification details are being updated by our hardware team.</p>
                  )}
                </div>
              )}

              {activeTab === "overview" && (
                <div className="max-w-4xl">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FDC800]"></span> Product Overview
                  </h3>
                  <div className="text-neutral-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap space-y-4">
                    {description || "No extended overview provided for this product yet."}
                  </div>
                </div>
              )}

              {activeTab === "compatibility" && (
                <div className="max-w-3xl space-y-4">
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FDC800]"></span> System & Power Compatibility
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Need help verifying whether this component fits your motherboard socket, cabinet dimensions, or power supply capacity?
                  </p>
                  <div className="p-4 bg-[#171717] border border-neutral-800 rounded-xl space-y-2 text-xs text-neutral-300">
                    <p>• <strong>Custom Builder Validation:</strong> Open our interactive <strong>PC Builder</strong> to automatically check wattage, socket, and dimensions against your build.</p>
                    <p>• <strong>Direct Hardware Support:</strong> Contact our technicians at The Computer Corner, Bathinda for free component verification before shipping.</p>
                  </div>
                  <Link
                    href="/pcbuilder"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FDC800] text-black font-bold text-xs uppercase tracking-wider rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]"
                  >
                    Open 3D PC Builder <RiArrowRightLine />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── RELATED HARDWARE / FREQUENTLY BOUGHT TOGETHER ───────── */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 md:mt-24">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[#FDC800] text-xs font-mono font-bold tracking-widest uppercase block mb-1">
                    Complete Your Build
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    Related Hardware & Components
                  </h2>
                </div>
                <Link
                  href="/"
                  className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-[#FDC800] transition-colors flex items-center gap-1"
                >
                  View All <RiArrowRightLine />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {relatedProducts.map((relProduct) => (
                  <Card key={relProduct._id} product={relProduct} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;

export async function getServerSideProps(context) {
  try {
    const { params } = context;
    const pool = (await import("@/utils/db")).default;
    const [rows] = await pool.query("SELECT * FROM products WHERE _id = ?", [params.productId]);

    if (rows.length === 0) {
      return { notFound: true };
    }

    const data = JSON.parse(JSON.stringify(rows[0]));

    // Fetch up to 4 related products in the same category (or other hardware) excluding current product
    let relatedProducts = [];
    try {
      const [relRows] = await pool.query(
        "SELECT * FROM products WHERE category = ? AND _id != ? LIMIT 4",
        [data.category, params.productId]
      );
      if (relRows.length === 0) {
        const [fallbackRows] = await pool.query(
          "SELECT * FROM products WHERE _id != ? LIMIT 4",
          [params.productId]
        );
        relatedProducts = JSON.parse(JSON.stringify(fallbackRows));
      } else {
        relatedProducts = JSON.parse(JSON.stringify(relRows));
      }
    } catch (e) {
      console.error("Failed to load related products:", e);
    }

    return {
      props: {
        product: { data },
        relatedProducts,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { notFound: true };
  }
}
