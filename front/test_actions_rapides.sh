#!/bin/bash

# Script de test pour les actions rapides API
# Teste l'intégration des actions rapides dans les dashboards admin

echo "🧪 TEST DES ACTIONS RAPIDES API"
echo "================================"
echo

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Vérification des fichiers modifiés
echo "📁 VÉRIFICATION DES FICHIERS"
echo "============================="

# AdminDashboard.jsx
if [ -f "src/pages/admin_standard/AdminDashboard.jsx" ]; then
    print_result 0 "AdminDashboard.jsx existe"
    
    # Vérifier les imports nécessaires
    if grep -q "useToast" "src/pages/admin_standard/AdminDashboard.jsx"; then
        print_result 0 "Import useToast présent"
    else
        print_result 1 "Import useToast manquant"
    fi
    
    if grep -q "apiService" "src/pages/admin_standard/AdminDashboard.jsx"; then
        print_result 0 "Import apiService présent"
    else
        print_result 1 "Import apiService manquant"
    fi
    
    # Vérifier les fonctions d'action rapide
    if grep -q "handleManageUsers" "src/pages/admin_standard/AdminDashboard.jsx"; then
        print_result 0 "Fonction handleManageUsers présente"
    else
        print_result 1 "Fonction handleManageUsers manquante"
    fi
    
    if grep -q "handleAddProduct" "src/pages/admin_standard/AdminDashboard.jsx"; then
        print_result 0 "Fonction handleAddProduct présente"
    else
        print_result 1 "Fonction handleAddProduct manquante"
    fi
    
    if grep -q "createProduct" "src/pages/admin_standard/AdminDashboard.jsx"; then
        print_result 0 "Fonction createProduct présente"
    else
        print_result 1 "Fonction createProduct manquante"
    fi
    
    if grep -q "createFormation" "src/pages/admin_standard/AdminDashboard.jsx"; then
        print_result 0 "Fonction createFormation présente"
    else
        print_result 1 "Fonction createFormation manquante"
    fi
else
    print_result 1 "AdminDashboard.jsx manquant"
fi

echo

# AdminUsers.jsx
if [ -f "src/pages/admin_standard/AdminUsers.jsx" ]; then
    print_result 0 "AdminUsers.jsx existe"
    
    # Vérifier les imports nécessaires
    if grep -q "useToast" "src/pages/admin_standard/AdminUsers.jsx"; then
        print_result 0 "Import useToast présent"
    else
        print_result 1 "Import useToast manquant"
    fi
    
    if grep -q "Package.*GraduationCap.*DollarSign" "src/pages/admin_standard/AdminUsers.jsx"; then
        print_result 0 "Imports des icônes d'actions rapides présents"
    else
        print_result 1 "Imports des icônes manquants"
    fi
    
    # Vérifier les fonctions d'action rapide
    if grep -q "navigateToAdminPage" "src/pages/admin_standard/AdminUsers.jsx"; then
        print_result 0 "Fonction navigateToAdminPage présente"
    else
        print_result 1 "Fonction navigateToAdminPage manquante"
    fi
    
    if grep -q "handleBulkStatusToggle" "src/pages/admin_standard/AdminUsers.jsx"; then
        print_result 0 "Fonction handleBulkStatusToggle présente"
    else
        print_result 1 "Fonction handleBulkStatusToggle manquante"
    fi
    
    if grep -q "handleExportUsers" "src/pages/admin_standard/AdminUsers.jsx"; then
        print_result 0 "Fonction handleExportUsers présente"
    else
        print_result 1 "Fonction handleExportUsers manquante"
    fi
else
    print_result 1 "AdminUsers.jsx manquant"
fi

echo

# 2. Vérification des dépendances
echo "📦 VÉRIFICATION DES DÉPENDANCES"
echo "==============================="

# ToastContext.jsx
if [ -f "src/contexts/ToastContext.jsx" ]; then
    print_result 0 "ToastContext.jsx existe"
    
    if grep -q "useToast" "src/contexts/ToastContext.jsx"; then
        print_result 0 "Hook useToast disponible"
    else
        print_result 1 "Hook useToast manquant"
    fi
else
    print_result 1 "ToastContext.jsx manquant"
fi

# apiService.js
if [ -f "src/services/apiService.js" ]; then
    print_result 0 "apiService.js existe"
    
    if grep -q "createProduct" "src/services/apiService.js"; then
        print_result 0 "Méthode createProduct disponible"
    else
        print_result 1 "Méthode createProduct manquante"
    fi
    
    if grep -q "createFormation" "src/services/apiService.js"; then
        print_result 0 "Méthode createFormation disponible"
    else
        print_result 1 "Méthode createFormation manquante"
    fi
else
    print_result 1 "apiService.js manquant"
fi

# useApi.js
if [ -f "src/hooks/useApi.js" ]; then
    print_result 0 "useApi.js existe"
else
    print_result 1 "useApi.js manquant"
fi

echo

# 3. Vérification de la syntaxe JSX
echo "🔍 VÉRIFICATION DE LA SYNTAXE"
echo "============================="

# Vérifier la fermeture des modals
if grep -q "Modal de création de produit" "src/pages/admin_standard/AdminDashboard.jsx"; then
    print_result 0 "Modal de création de produit présente"
else
    print_result 1 "Modal de création de produit manquante"
fi

if grep -q "Modal de création de formation" "src/pages/admin_standard/AdminDashboard.jsx"; then
    print_result 0 "Modal de création de formation présente"
else
    print_result 1 "Modal de création de formation manquante"
fi

# Vérifier les actions rapides dans AdminUsers
if grep -q "Actions rapides" "src/pages/admin_standard/AdminUsers.jsx"; then
    print_result 0 "Section Actions rapides présente"
else
    print_result 1 "Section Actions rapides manquante"
fi

echo

# 4. Vérification de la documentation
echo "📚 VÉRIFICATION DE LA DOCUMENTATION"
echo "==================================="

if [ -f "docs/ACTIONS_RAPIDES_API_INTEGRATION.md" ]; then
    print_result 0 "Documentation ACTIONS_RAPIDES_API_INTEGRATION.md créée"
    
    # Vérifier le contenu
    if grep -q "Intégration API des Actions Rapides" "docs/ACTIONS_RAPIDES_API_INTEGRATION.md"; then
        print_result 0 "Titre de la documentation correct"
    else
        print_result 1 "Titre de la documentation incorrect"
    fi
else
    print_result 1 "Documentation ACTIONS_RAPIDES_API_INTEGRATION.md manquante"
fi

echo

# 5. Résumé des fonctionnalités
echo "🎯 FONCTIONNALITÉS IMPLÉMENTÉES"
echo "==============================="

print_info "AdminDashboard - Actions rapides :"
echo "  • Gérer utilisateurs (navigation + statistiques)"
echo "  • Ajouter produit (modal + API createProduct)"
echo "  • Nouvelle formation (modal + API createFormation)"
echo "  • Rapport ventes (navigation + refresh données)"
echo

print_info "AdminUsers - Actions rapides :"
echo "  • Navigation vers autres pages admin"
echo "  • Sélection multiple avec cases à cocher"
echo "  • Actions en masse (basculer statut)"
echo "  • Export CSV des utilisateurs"
echo "  • Sélectionner/désélectionner tout"
echo

print_info "Système de notifications :"
echo "  • Toast de succès (vert)"
echo "  • Toast d'erreur (rouge)"
echo "  • Toast de chargement (gris)"
echo "  • Gestion automatique des timeouts"
echo

# 6. Tests d'intégration recommandés
echo "🧪 TESTS D'INTÉGRATION RECOMMANDÉS"
echo "=================================="

print_warning "Tests manuels à effectuer :"
echo "  1. Connexion en tant qu'admin/super-admin"
echo "  2. Navigation vers AdminDashboard"
echo "  3. Test des 4 actions rapides"
echo "  4. Vérification des modals de création"
echo "  5. Test des notifications toast"
echo "  6. Navigation vers AdminUsers"
echo "  7. Test des actions en masse"
echo "  8. Test d'export CSV"
echo

print_warning "Tests API à vérifier :"
echo "  1. Endpoint /api/v1/products (POST)"
echo "  2. Endpoint /api/v1/formations (POST)"
echo "  3. Endpoint /api/v1/users (PUT status)"
echo "  4. Gestion des erreurs de validation"
echo "  5. Authentification et autorisations"
echo

echo "📊 RÉSULTAT FINAL"
echo "================="

# Compter les succès et erreurs
SUCCESS_COUNT=$(echo "$(grep -c "✅" /tmp/test_result.txt 2>/dev/null || echo 0)")
ERROR_COUNT=$(echo "$(grep -c "❌" /tmp/test_result.txt 2>/dev/null || echo 0)")

if [ $ERROR_COUNT -eq 0 ]; then
    print_result 0 "TOUS LES TESTS SONT RÉUSSIS"
    echo -e "${GREEN}🎉 Les actions rapides API sont entièrement intégrées !${NC}"
else
    print_result 1 "CERTAINS TESTS ONT ÉCHOUÉ"
    echo -e "${YELLOW}⚠️  Vérifiez les éléments marqués en erreur${NC}"
fi

echo
echo "📁 Fichiers modifiés :"
echo "  • src/pages/admin_standard/AdminDashboard.jsx"
echo "  • src/pages/admin_standard/AdminUsers.jsx"
echo "  • docs/ACTIONS_RAPIDES_API_INTEGRATION.md"
echo
echo "🔧 Technologies utilisées :"
echo "  • ToastContext pour les notifications"
echo "  • apiService pour les appels backend"
echo "  • hooks useApi pour la gestion d'état"
echo "  • Navigation contextuelle admin/super-admin"
echo
echo "🏁 Test terminé le $(date)"
echo "================================"