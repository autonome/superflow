import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Landing() {
  return (
    <div className="gradient-bg-welcome w-full h-screen">
      <div className="flex justify-center pt-20 items-center">
        <img
          src="assets/superflow3.png"
          className="text-center w-1/3 md:w-2/12"
        />
      </div>
      <h1 className="md:text-8xl text-5xl mt-4 text-center heading  text-white">
        SUPERFLOW
      </h1>
      <h1 className="md:text-xl text-xs mt-4 text-center desc  text-white">
        Stack Overflow tag manager and analytics dashboard
      </h1>
      <div className="flex justify-center">
        <a
          href="/dashboard"
          className="bg-gradient-to-r from-orange-700 via-orange-500 to-yellow-500 rounded-lg p-3 mt-10 heading text-[#181B23]"
        >
          Launch
        </a>
        <a
          href="https://cipher-infoline.gitbook.io/superflow/"
          className="ml-5 bg-gray-300 rounded-lg p-3 mt-10 heading text-[#181B23]"
        >
          Documentation
        </a>
      </div>
    </div>
  );
}
