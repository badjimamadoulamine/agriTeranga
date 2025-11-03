import { Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import hero1 from "../assets/2.jpg";
import hero2 from "../assets/4.jpg";
import hero4 from "../assets/3.jpg";

export default function QuiSommeNous() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* 🟢 Colonne gauche - Texte */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-gray-900">
              Qui sommes-nous ?
            </h2>

            <div className="space-y-5">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Agriteranga est une plateforme dédiée à la valorisation des produits agricoles locaux. 
                Nous mettons en relation directe les producteurs, les consommateurs et les livreurs, 
                pour encourager une agriculture durable, transparente et équitable.
              </p>

              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 mb-3 sm:mb-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Grâce à notre réseau, les producteurs peuvent vendre facilement leurs récoltes, 
                    les consommateurs ont accès à des produits frais et sains, et les livreurs 
                    participent à la chaîne de distribution locale. Ensemble, nous bâtissons un 
                    écosystème agricole responsable qui soutient les communautés rurales et favorise 
                    le développement local.
                  </p>
                </div>
              </div>

              {/* 🔹 Bouton remplacé par Link */}
              <div className="pt-4 flex justify-center lg:justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-full hover:bg-yellow-500 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Contactez-nous
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 🟢 Colonne droite - Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-10 lg:mt-0">
            {/* Grande image */}
            <div className="col-span-1 row-span-2 h-56 sm:h-72 lg:h-[31rem] rounded-2xl overflow-hidden shadow-lg">
              <img
                src={hero1}
                alt="Femme avec panier de légumes"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image circulaire */}
            <div className="col-span-1 flex items-center justify-center order-2 sm:order-none">
              <div className="w-32 h-32 sm:w-44 sm:h-44 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-lg border-4 border-green-200">
                <img
                  src={hero2}
                  alt="Icône circulaire"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="col-span-1 h-48 sm:h-64 lg:h-62 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={hero4}
                alt="Femme dans un jardin"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
