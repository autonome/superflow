import React from "react";

const Footer = () => (
  <div className="w-full mt-40 flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="flex justify-center items-center flex-col mt-5">
      <p className="text-white text-sm text-center desc">
        Made with love at{" "}
        <a className="text-primary" href="https://nft.ethglobal.co/">
          NFT Hacks 2021
        </a>
        .
      </p>
    </div>

    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />
  </div>
);

export default Footer;
