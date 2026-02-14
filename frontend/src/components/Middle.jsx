import React from "react";

const Middle = () => {
  return (
    <div className="w-full md:mt-14 min-h-[38vh] py-12 flex items-center justify-center shrink-0">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center justify-center rounded-md">
          <span
            className="text-[150px] font-extrabold bg-clip-text text-transparent select-none"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, #a3e635 0%, #34d399 45%, #059669 100%)",
              filter:
                "drop-shadow(0 0 6px rgba(52, 211, 153, 0.5)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          >
            W
          </span>
        </div>
        <h2 className="text-4xl font-semibold bg-clip-text text-[#dfe3d8] select-none">
          wavehub.com
        </h2>
      </div>
    </div>
  );
};

export default Middle;

