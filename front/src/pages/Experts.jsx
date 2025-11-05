import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import aiService from '../services/aiService'
import Header from '../components/Header';
import Footer from '../components/Footer';

const Experts = ({ onOpenRegister, onOpenLogin }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Bonjour ! Je suis votre assistant expert AgriTeranga. Posez-moi vos questions sur l'agriculture, les produits, les formations ou nos services. Je peux vous donner des conseils personnalisés et vous aider avec vos projets agricoles ! 🌱",
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isAI: false
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [usedAI, setUsedAI] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    // Utiliser une approche plus robuste pour le scroll
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      })
    })
  }

  useEffect(() => {
    // Délai plus long pour s'assurer que le DOM est mis à jour
    const timeoutId = setTimeout(() => {
      scrollToBottom()
    }, 100)
    
    return () => clearTimeout(timeoutId)
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Scroll immédiat vers le nouveau message utilisateur
    setTimeout(() => {
      scrollToBottom()
    }, 50)

    try {
      // Utiliser le service IA
      const response = await aiService.generateResponse(inputMessage)
      const isAIResponse = aiService.isComplexQuestion(inputMessage)
      
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: response,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isAI: isAIResponse
      }

      setMessages(prev => [...prev, botResponse])
      
      if (isAIResponse) {
        setUsedAI(true)
      }
      
    } catch (error) {
      console.error('Erreur:', error)
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: "Je rencontre actuellement des difficultés techniques. Pour une réponse immédiate, contactez-nous directement au 77 343 24 85 ou par email à agriteranga@gmail.com. Nos experts seront ravis de vous répondre !",
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isAI: false
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const suggestedQuestions = [
    "Quels légumes sont faciles à cultiver à domicile ?",
    "Quelle est la meilleure période pour planter des tomates ?",
    "Comment protéger mes plantes des insectes naturellement ?",
    "Avec un budget de 50 000 FCFA, comment me lancer ?",
    "Quels engrais naturels recommandez-vous ?",
    "Comment faire un compost maison ?"
  ]

  const quickTips = [
    {
      title: "Conseil du jour 🌞",
      content: "Arrosez vos plantes tôt le matin pour éviter l'évaporation et les brûlures de feuilles."
    },
    {
      title: "Astuce bio 🪱",
      content: "Les vers de terre sont vos alliés ! Ils aèrent le sol et enrichissent la terre naturellement."
    },
    {
      title: "Économie d'eau 💧",
      content: "Collectez l'eau de pluie dans des bidons pour arroser pendant la saison sèche."
    }
  ]

  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % quickTips.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header global */}
        <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />
      {/* Section Hero */}
      <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-10 overflow-hidden">
        {/* Image d'arrière-plan avec animation */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: 'url("/src/assets/ia1.jpg")',
            animation: 'slowZoom 20s ease-in-out infinite alternate'
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-green-800/50 to-green-900/70" />
        
        {/* Éléments décoratifs animés */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-yellow-400/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-green-300/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
         
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-green-100 to-yellow-200 bg-clip-text text-transparent animate-gradient">
              Assistant Expert 
            </span>
          </h1>
          
          <p className="text-xl md:text-xl text-green-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Conseils personnalisés d'intelligence artificielle + expertise humaine
          </p>

          {/* Conseil rotatif amélioré */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto mb-8 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">💡</span>
              </div>
              <h3 className="font-semibold text-lg">{quickTips[currentTip].title}</h3>
            </div>
            <p className="text-green-100 leading-relaxed">{quickTips[currentTip].content}</p>
          </div>
        </div>
      </div>

      {/* Styles CSS personnalisés - Version optimisée */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slowZoom {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
          }
          
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
        `
      }} />

      {/* Section Chatbot */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* En-tête du chat */}
            <div className="bg-green-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Assistant Agri IA</h3>
                    <p className="text-green-100 text-sm">
                      {usedAI ? "IA + Expertise activées • Réponses intelligentes" : "En ligne • Répond en quelques secondes"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-200">
                    Service gratuit avec IA
                  </div>
                </div>
              </div>
            </div>

            {/* Zone des messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg relative ${
                      message.type === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    {/* Indicateur IA pour les réponses de l'IA */}
                    {message.type === 'bot' && message.isAI && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                    )}
                    
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className={`text-xs ${
                        message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                      {message.type === 'bot' && message.isAI && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          IA
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">IA en réflexion...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Questions suggérées */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-600 mb-3">
                💡 Questions populaires (l'IA vous conseillera) :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-left text-xs bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Formulaire de saisie */}
            <form onSubmit={handleSendMessage} className="p-6 border-t bg-white">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Posez votre question agricole (l'IA analysera et répondra)..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {isTyping ? 'IA...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>

          {/* Section d'information améliorée */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">IA Agricoles</h3>
              <p className="text-gray-600">Intelligence artificielle spécialisée dans l'agriculture ouest-africaine</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Adapté au Sénégal</h3>
              <p className="text-gray-600">Conseils adaptés au climat, sols et techniques locales</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Économique</h3>
              <p className="text-gray-600">Solutions bon marché adaptées aux budgets locaux</p>
            </div>
          </div>
        </div>
      </div>
        {/* ✅ Footer global */}
      <Footer />
    </div>
  )
}

export default Experts