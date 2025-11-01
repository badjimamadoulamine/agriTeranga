import React from "react";
import heroImage from "../assets/fond.png";

const Hero = () => {
  return (
    <section className="relative w-full h-[30vh] sm:h-[50vh] md:h-screen flex items-center justify-center md:justify-start">
      {/* Image de fond */}
      <img
        src={heroImage}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Contenu centré verticalement */}
      <div className="relative z-10 pl-4 pr-50 sm:px-6 lg:px-16 text-white max-w-3xl flex flex-col justify-center h-full space-y-4 text-left">
        {/* H2 caché sur mobile */}
        <h2 className="hidden sm:block md:text-xl font-bold">
          Donner du pouvoir aux agriculteurs locaux, un clic à la fois
        </h2>

        {/* H1 responsive */}
        <h1 className="text-2xl sm:text-3xl md:text-7xl font-extrabold leading-tight">
          Cultiver pour un avenir sain
        </h1>

        {/* Paragraphe responsive */}
        <p className="text-xs sm:text-sm md:text-xl">
          La première plateforme numérique du Sénégal qui connecte directement les producteurs agricoles aux acheteurs pour des transactions transparentes et équitables
        </p>
      </div>
    </section>
  );
};

export default Hero;
