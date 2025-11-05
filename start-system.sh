#!/bin/bash

# Script de démarrage pour AgriTeranga - Gestion des erreurs
# Ce script aide à diagnostiquer et démarrer les services nécessaires

echo "🚀 AgriTeranga - Démarrage du Système"
echo "======================================"

# Fonction pour vérifier si un port est utilisé
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "✅ Port $port ($service) - OCCUPÉ"
        return 0
    else
        echo "❌ Port $port ($service) - LIBRE"
        return 1
    fi
}

# Fonction pour vérifier l'environnement
check_env() {
    echo ""
    echo "🔍 Vérification de l'environnement..."
    
    # Vérifier le frontend
    if [ -f "agriteranga/front/.env" ]; then
        echo "📁 Fichier .env frontend trouvé"
        cat agriteranga/front/.env | grep -E "(VITE_API_URL|VITE_)" || echo "   Aucune variable VITE_ trouvée"
    else
        echo "⚠️  Fichier .env frontend manquant - utilisation des valeurs par défaut"
    fi
    
    # Vérifier le backend
    if [ -f "agriteranga/back/.env" ]; then
        echo "📁 Fichier .env backend trouvé"
        cat agriteranga/back/.env | grep -E "(PORT|API|DATABASE|)" || echo "   Configuration basique détectée"
    else
        echo "⚠️  Fichier .env backend manquant - utilisation des valeurs par défaut"
    fi
}

# Fonction pour démarrer le frontend
start_frontend() {
    echo ""
    echo "🎨 Démarrage du frontend..."
    
    if [ -d "agriteranga/front" ]; then
        cd agriteranga/front
        
        # Vérifier si node_modules existe
        if [ ! -d "node_modules" ]; then
            echo "📦 Installation des dépendances frontend..."
            npm install
        fi
        
        echo "🚀 Lancement du serveur de développement frontend..."
        echo "🌐 URL: http://localhost:3000"
        echo "🧪 Test des erreurs: http://localhost:3000/test-errors"
        
        npm run dev
        
    else
        echo "❌ Dossier frontend agriteranga/front introuvable"
        return 1
    fi
}

# Fonction pour démarrer le backend
start_backend() {
    echo ""
    echo "⚙️  Démarrage du backend..."
    
    if [ -d "agriteranga/back" ]; then
        cd agriteranga/back
        
        # Vérifier si node_modules existe
        if [ ! -d "node_modules" ]; then
            echo "📦 Installation des dépendances backend..."
            npm install
        fi
        
        echo "🚀 Lancement du serveur backend..."
        echo "🔌 API: http://localhost:5000"
        echo "📡 Endpoints: /api/auth/register, /api/auth/login"
        
        npm start || npm run dev
        
    else
        echo "❌ Dossier backend agriteranga/back introuvable"
        return 1
    fi
}

# Fonction pour les tests
run_tests() {
    echo ""
    echo "🧪 Tests du système d'erreurs..."
    
    echo "1. Ouvrez http://localhost:3000/test-errors dans votre navigateur"
    echo "2. Testez chaque fonctionnalité avec les boutons"
    echo "3. Vérifiez la console développeur pour les logs"
    echo "4. Testez l'inscription/connexion avec les modals"
    
    echo ""
    echo "Messages d'erreur attendus:"
    echo "• Email invalide → 'Adresse email invalide'"
    echo "• Mot de passe faible → 'Le mot de passe doit contenir au moins 8 caractères'"
    echo "• API 400 → 'Cette adresse email est déjà utilisée ou invalide'"
    echo "• API 401 → 'Email ou mot de passe incorrect'"
}

# Menu principal
echo "Choisissez une action:"
echo "1) Vérifier l'environnement"
echo "2) Démarrer le frontend seulement"
echo "3) Démarrer le backend seulement" 
echo "4) Démarrer frontend + backend"
echo "5) Lancer les tests d'erreurs"
echo "6) Guide de dépannage"
echo "7) Quitter"

read -p "Votre choix (1-7): " choice

case $choice in
    1)
        check_port 3000 "Frontend"
        check_port 5000 "Backend"
        check_env
        ;;
    2)
        check_port 3000 "Frontend"
        if [ $? -eq 1 ]; then
            start_frontend
        else
            echo "⚠️  Le frontend semble déjà tourner sur le port 3000"
        fi
        ;;
    3)
        check_port 5000 "Backend"
        if [ $? -eq 1 ]; then
            start_backend
        else
            echo "⚠️  Le backend semble déjà tourner sur le port 5000"
        fi
        ;;
    4)
        check_port 3000 "Frontend"
        check_port 5000 "Backend"
        
        if [ $? -eq 1 ]; then
            echo "⚠️  Ports détectés comme libres, démarrage des services..."
            
            # Démarrer le backend en arrière-plan
            (start_backend &)
            sleep 3
            
            # Démarrer le frontend
            start_frontend
        else
            echo "⚠️  Des services tournent déjà sur ces ports"
        fi
        ;;
    5)
        run_tests
        ;;
    6)
        echo ""
        echo "📋 Guide de Dépannage Rapide:"
        echo "=============================="
        echo ""
        echo "🔧 Problème 404 /api/auth/register:"
        echo "1. Vérifiez que le backend tourne sur le port 5000"
        echo "2. Vérifiez la variable VITE_API_URL dans le .env frontend"
        echo "3. Vérifiez que la route /api/auth/register existe côté backend"
        echo ""
        echo "🔧 TypeError error2 is not a function:"
        echo "1. Vérifiez que ToastContext.jsx a été corrigé"
        echo "2. Redémarrez le serveur frontend"
        echo ""
        echo "🔧 Messages d'erreur en anglais:"
        echo "1. Vérifiez que tous les messages sont en français"
        echo "2. Redémarrez le serveur frontend"
        echo ""
        echo "📖 Documentation complète: GUIDE_DEPANNAGE_ERREURS.md"
        ;;
    7)
        echo "👋 Au revoir !"
        exit 0
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "💡 Pour plus d'aide, consultez le fichier GUIDE_DEPANNAGE_ERREURS.md"