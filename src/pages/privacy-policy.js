import React from 'react';
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - The Computer Corner</title>
        <meta name="description" content="Privacy Policy for The Computer Corner compliant with the DPDP Act 2023." />
      </Head>
      <div className="bg-[#050505] min-h-screen text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-[#111] p-8 md:p-12 rounded-xl border border-gray-800">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-yellow-500">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <p className="mb-4">
                At The Computer Corner, we take your privacy seriously. This Privacy Policy outlines how we collect, use, protect, and handle your personal data in compliance with the Digital Personal Data Protection (DPDP) Act, 2023 of India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. What Data We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping/billing addresses collected during account creation and checkout.</li>
                <li><strong>Financial Information:</strong> We do not store credit/debit card details on our servers. All payments are securely processed by Razorpay.</li>
                <li><strong>Technical Information:</strong> IP addresses, browser types, and device information for security and optimization purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Purpose of Data Collection</h2>
              <p>Under the DPDP Act, we act as a Data Fiduciary. We collect your data strictly for the following purposes:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>To process and deliver your PC components and custom builds.</li>
                <li>To send you important order updates and shipping notifications.</li>
                <li>To provide customer support and handle warranty claims.</li>
              </ul>
              <p className="mt-2">We will not use your personal data for any purpose other than what you have explicitly consented to.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Data Sharing & Third Parties</h2>
              <p>We do not sell your personal data to advertisers or third parties. We only share necessary data with trusted partners strictly for fulfilling your orders:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong>Delivery Partners:</strong> Name, phone number, and address are shared with logistics providers (e.g., BlueDart, Delhivery, India Post) for shipment delivery.</li>
                <li><strong>Payment Processors:</strong> Necessary transaction details are shared with Razorpay to process your payments securely.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Your Rights (Data Principal Rights)</h2>
              <p>Under the DPDP Act, you possess the following rights regarding your personal data:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong>Right to Access:</strong> You can request a summary of the personal data we hold about you.</li>
                <li><strong>Right to Correction & Erasure:</strong> You can ask us to correct inaccurate data or completely erase your data from our systems.</li>
                <li><strong>Right to Nominate:</strong> You may nominate an individual to exercise your rights in the event of death or incapacity.</li>
                <li><strong>Right to Grievance Redressal:</strong> You have the right to readily available means of grievance redressal (see contact details below).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Data Retention & Security</h2>
              <p>We implement robust security measures including bcrypt password hashing and SSL encryption to protect your data. We retain order history and related personal data for a maximum of 5 years to comply with Indian tax and accounting laws, after which it is securely deleted.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Grievance Officer</h2>
              <p>In accordance with the DPDP Act 2023, the name and contact details of the Grievance Officer / Data Protection Officer are provided below:</p>
              <div className="bg-[#1a1a1a] p-4 rounded mt-4 border border-gray-800">
                <p><strong>Email:</strong> privacy@computercorner.com</p>
                <p><strong>Phone:</strong> 095636 00008</p>
                <p><strong>Address:</strong> 520, Amrik Singh Rd, Bathinda, Punjab 151001</p>
              </div>
              <p className="mt-4 text-sm">We aim to resolve all data-related grievances within the timeframe stipulated by the law.</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
