import React from "react";
import Middle from "../components/Middle";
import Games from "../components/Games";

const HomePage = () => {
  return (
    <main
      className="min-h-screen flex flex-col relative bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/bg.jpg)` }}
    >
      {/* dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Middle />
        <Games />
      </div>
    </main>
  );
};

export default HomePage;

