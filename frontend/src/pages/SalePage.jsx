import React from "react";

const SalePage = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="w-full max-w-6xl mx-auto px-6 py-14 flex-1">
        <h1 className="text-3xl md:text-4xl font-bold text-[#dfe3d8] mb-6">
          Sales
        </h1>
        <p className="text-gray-300/90 max-w-2xl">
          Current sales and special offers. Check here for the best deals.
        </p>
      </div>
    </main>
  );
};

export default SalePage;

