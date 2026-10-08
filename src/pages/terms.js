import React from 'react';
import Head from 'next/head';

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Terms & Conditions - The Computer Corner</title>
        <meta name="description" content="Terms and Conditions for purchasing from The Computer Corner." />
      </Head>
      <div className="bg-[#050505] min-h-screen text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-[#111] p-8 md:p-12 rounded-xl border border-gray-800">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-yellow-500">Terms & Conditions</h1>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <p>
                Welcome to The Computer Corner. By placing an order with us, you agree to be bound by the following Terms and Conditions. Please read them carefully before making a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Pricing & Availability</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Prices of PC components (especially CPUs and GPUs) are highly volatile and subject to change without notice.</li>
                <li>We reserve the right to cancel any orders if an item goes out of stock or is mispriced due to a typographical error. In such cases, a full refund will be initiated.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Shipping & Delivery</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Prebuilt Custom PCs:</strong> Require assembly and rigorous testing. Please allow 5-7 business days for dispatch.</li>
                <li><strong>Individual Components:</strong> Typically dispatched within 1-2 business days.</li>
                <li>We partner with reliable couriers. However, we are not liable for delays caused by unforeseen logistical issues.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Returns, Refunds & Cancellations</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Custom Prebuilt PCs:</strong> Because these systems are custom-assembled to your specifications, orders cannot be cancelled or returned once assembly has commenced, unless the parts are dead on arrival (DOA).</li>
                <li><strong>Components:</strong> Unopened, sealed components can be returned within 7 days of delivery. A restocking fee may apply.</li>
                <li>Refunds for cancelled orders will be processed back to the original payment method (via Razorpay) within 5-7 business days.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Warranty Policy</h2>
              <p>
                Warranties for individual parts (e.g., processors, graphics cards, motherboards) are provided directly by their respective manufacturers (e.g., Intel, AMD, NVIDIA, Gigabyte) and must be claimed at their authorized service centers. 
              </p>
              <p className="mt-2">
                The Computer Corner does not offer independent warranties on individual parts unless explicitly stated. For our pre-assembled "Custom PC Builds", we provide a 1-year limited service warranty covering assembly defects, but parts replacement is still governed by the manufacturer's warranty.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Limitation of Liability</h2>
              <p>
                The Computer Corner shall not be liable for any data loss, business interruption, or direct/indirect damages caused by hardware failure, incompatibility, or improper installation of components purchased from us.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
