# Guide Responsive Design - Agriteranga

## 📱 Breakpoints Tailwind CSS

```javascript
sm:  640px   // Smartphones en mode paysage
md:  768px   // Tablettes
lg:  1024px  // Ordinateurs portables
xl:  1280px  // Écrans larges
2xl: 1536px  // Très grands écrans
```

## 🎨 Patterns Responsive Courants

### 1. Grilles Adaptatives

```jsx
{/* 1 colonne mobile, 2 sur tablette, 3 sur desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Contenu */}
</div>

{/* 1 colonne mobile, 3 sur tablette+ */}
<div className="grid md:grid-cols-3 gap-6">
  {/* Contenu */}
</div>
```

### 2. Textes Responsifs

```jsx
{/* Taille de police adaptative */}
<h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
  Titre responsive
</h1>

{/* Espacement adaptatif */}
<p className="text-sm md:text-base lg:text-lg">
  Paragraphe responsive
</p>
```

### 3. Espacements Adaptatifs

```jsx
{/* Padding responsive */}
<div className="px-4 md:px-8 lg:px-12">
  {/* Contenu */}
</div>

{/* Margin responsive */}
<div className="my-4 md:my-8 lg:my-12">
  {/* Contenu */}
</div>
```

### 4. Affichage Conditionnel

```jsx
{/* Cacher sur mobile, afficher sur desktop */}
<div className="hidden md:block">
  {/* Visible uniquement sur tablette+ */}
</div>

{/* Afficher sur mobile, cacher sur desktop */}
<div className="block md:hidden">
  {/* Visible uniquement sur mobile */}
</div>
```

### 5. Navigation Responsive

```jsx
{/* Menu horizontal sur desktop, hamburger sur mobile */}
<nav className="flex flex-col md:flex-row gap-4">
  <a href="#">Lien 1</a>
  <a href="#">Lien 2</a>
</nav>
```

### 6. Images Responsives

```jsx
{/* Image adaptée à son conteneur */}
<img 
  src="image.jpg" 
  alt="Description" 
  className="w-full h-auto object-cover"
/>

{/* Hauteur fixe responsive */}
<img 
  src="image.jpg" 
  alt="Description" 
  className="w-full h-48 md:h-64 lg:h-96 object-cover"
/>
```

### 7. Container Responsive

```jsx
{/* Container centré avec padding adaptatif */}
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Contenu */}
</div>
```

### 8. Flexbox Responsive

```jsx
{/* Colonne sur mobile, ligne sur desktop */}
<div className="flex flex-col md:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

{/* Alignement responsive */}
<div className="flex flex-col md:flex-row justify-start md:justify-between">
  {/* Contenu */}
</div>
```

### 9. Largeur Max Responsive

```jsx
{/* Largeur maximale adaptative */}
<div className="max-w-full md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
  {/* Contenu */}
</div>
```

### 10. Cards Responsive

```jsx
{/* Card avec padding et taille adaptative */}
<div className="card p-4 md:p-6 lg:p-8">
  <h3 className="text-lg md:text-xl lg:text-2xl">Titre</h3>
  <p className="text-sm md:text-base mt-2">Description</p>
</div>
```

## 🎯 Bonnes Pratiques

### Mobile-First Approach

✅ **FAIRE** - Commencer par le mobile, ajouter les classes pour les grands écrans
```jsx
<div className="text-base md:text-lg lg:text-xl">
```

❌ **ÉVITER** - Ne pas utiliser de classes sans breakpoint pour desktop
```jsx
<div className="text-xl md:text-sm"> {/* Mauvais */}
```

### Tester sur Différents Écrans

- 📱 **Mobile** : 320px - 640px
- 📱 **Tablette** : 768px - 1024px
- 💻 **Desktop** : 1280px+

### Classes Utilitaires Communes

```jsx
// Navigation responsive
<nav className="hidden md:flex md:gap-6 lg:gap-8" />

// Boutons responsive
<button className="w-full md:w-auto px-4 py-2 md:px-6 md:py-3" />

// Formulaires responsive
<input className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base" />
```

## 📐 Exemple Complet - Page Responsive

```jsx
const ResponsivePage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Logo</h1>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <a href="#">Menu 1</a>
              <a href="#">Menu 2</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6">
            Titre Principal
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Description responsive
          </p>
        </section>

        {/* Grid Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {/* Cards */}
          <div className="card p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-2">Card 1</h3>
            <p className="text-sm md:text-base text-gray-600">Contenu</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 md:mt-16 lg:mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Footer content */}
          </div>
        </div>
      </footer>
    </div>
  )
}
```

## 🔍 Tester le Responsive

### Dans le Navigateur
1. Ouvrir DevTools (F12)
2. Cliquer sur l'icône "Toggle device toolbar" (Ctrl+Shift+M)
3. Tester différentes tailles d'écran

### Tailles à tester
- iPhone SE: 375x667
- iPad: 768x1024
- Desktop: 1920x1080

---

**Tous les composants du projet Agriteranga suivent ces principes responsive !** 🎯
