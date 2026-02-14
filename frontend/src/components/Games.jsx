import React from "react";
import games from "../data/data";

const Games = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 pt-2 pb-14 flex-1">
      <div className="flex flex-wrap gap-6 justify-center">
        {games.map((game) => (
          <div
            key={game.id}
            className="group block w-[250px] rounded-xl overflow-hidden shadow-xl transition-all duration-300"
          >
            <div className="relative w-full bg-white/15 border border-white/20 h-[300px] shrink-0">
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <p className="p-3 z-12 text-center md:text-5 text-4 font-semibold uppercase text-[#dfe3d8]">
              {game.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Games;

