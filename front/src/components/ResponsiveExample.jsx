/**
 * Composant exemple montrant tous les patterns responsive
 * Ce composant sert de référence pour créer des interfaces adaptatives
 */

const ResponsiveExample = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Container responsive */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        
        {/* Titre responsive */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 md:mb-8 lg:mb-12">
          Exemples Responsive
        </h1>

        {/* Grille responsive : 1 col (mobile), 2 cols (tablette), 3 cols (desktop) */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Grille Adaptive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="card p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Card {item}</h3>
                <p className="text-sm md:text-base text-gray-600">Contenu responsive</p>
              </div>
            ))}
          </div>
        </section>

        {/* Flexbox responsive : colonne sur mobile, ligne sur desktop */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Flexbox Adaptatif</h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1 card p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-2">Colonne 1</h3>
              <p className="text-sm md:text-base text-gray-600">Vertical sur mobile, horizontal sur desktop</p>
            </div>
            <div className="flex-1 card p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-2">Colonne 2</h3>
              <p className="text-sm md:text-base text-gray-600">Adapté à toutes les tailles</p>
            </div>
          </div>
        </section>

        {/* Boutons responsive */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Boutons Responsifs</h2>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button className="btn-primary w-full sm:w-auto px-4 md:px-6 py-2 md:py-3">
              Bouton pleine largeur mobile
            </button>
            <button className="btn-secondary w-full sm:w-auto px-4 md:px-6 py-2 md:py-3">
              Largeur auto desktop
            </button>
          </div>
        </section>

        {/* Images responsives */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Images Adaptatives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-48 md:h-64 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white">
                Image 1
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-48 md:h-64 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                Image 2
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg overflow-hidden sm:col-span-2 lg:col-span-1">
              <div className="w-full h-48 md:h-64 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white">
                Image 3
              </div>
            </div>
          </div>
        </section>

        {/* Affichage conditionnel */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Affichage Conditionnel</h2>
          <div className="space-y-4">
            <div className="card p-4 md:p-6">
              <p className="block md:hidden text-primary-600 font-semibold">
                ✅ Visible uniquement sur MOBILE
              </p>
              <p className="hidden md:block text-blue-600 font-semibold">
                ✅ Visible uniquement sur TABLETTE et DESKTOP
              </p>
            </div>
            <div className="card p-4 md:p-6">
              <p className="hidden lg:block text-purple-600 font-semibold">
                ✅ Visible uniquement sur DESKTOP (lg+)
              </p>
              <p className="lg:hidden text-orange-600 font-semibold">
                ✅ Visible sur MOBILE et TABLETTE
              </p>
            </div>
          </div>
        </section>

        {/* Formulaire responsive */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Formulaire Adaptatif</h2>
          <div className="card p-4 md:p-6 lg:p-8 max-w-2xl">
            <form className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-base font-medium mb-1 md:mb-2">
                    Prénom
                  </label>
                  <input 
                    type="text" 
                    className="input-field text-sm md:text-base" 
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium mb-1 md:mb-2">
                    Nom
                  </label>
                  <input 
                    type="text" 
                    className="input-field text-sm md:text-base" 
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm md:text-base font-medium mb-1 md:mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  className="input-field text-sm md:text-base" 
                  placeholder="votre@email.com"
                />
              </div>
              <button type="submit" className="btn-primary w-full md:w-auto px-6 md:px-8 py-2 md:py-3">
                Soumettre
              </button>
            </form>
          </div>
        </section>

        {/* Tableau responsive */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Tableau Adaptatif</h2>
          <div className="card overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                    Nom
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Téléphone
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3].map((item) => (
                  <tr key={item}>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm">
                      Utilisateur {item}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm">
                      user{item}@email.com
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm">
                      +221 XX XXX XX XX
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Actif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ResponsiveExample
