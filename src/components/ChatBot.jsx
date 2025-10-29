import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';

const categories = [
  {
    title: "Comment créer mon compte annonceur ?",
    id: "account",
    response: "Pour créer votre compte annonceur sur Les Pages Afrocarib :\n\n1. Cliquez sur 'Créer mon compte' en haut de la page\n2. Choisissez l'option 'Compte Annonceur'\n3. Remplissez vos informations d'entreprise\n4. Validez votre compte avec un document officiel\n\nNotre équipe validera votre profil sous 24-48h."
  },
  {
    title: "Comment mettre en avant mon entreprise ?",
    id: "promotion",
    response: "Les Pages Afrocarib offre plusieurs options pour promouvoir votre entreprise :\n\n• Complétez votre profil à 100%\n• Ajoutez des photos de qualité\n• Publiez des actualités régulièrement\n• Répondez aux avis clients\n• Optez pour nos options de mise en avant premium"
  },
  {
    title: "Comment trouver un professionnel ?",
    id: "search",
    response: "Pour trouver le professionnel qu'il vous faut :\n\n1. Utilisez la barre de recherche en haut de la page\n2. Filtrez par catégorie et localisation\n3. Consultez les avis et notes\n4. Vérifiez les certifications et labels\n\nVous pouvez aussi naviguer par catégories sur notre page d'accueil."
  },
  {
    title: "Comment laisser un avis ?",
    id: "review",
    response: "Pour laisser un avis sur Les Pages Afrocarib :\n\n1. Connectez-vous à votre compte\n2. Trouvez l'entreprise concernée\n3. Cliquez sur 'Laisser un avis'\n4. Notez votre expérience et rédigez votre commentaire\n\nVos avis aident toute la communauté !"
  }
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Bonjour 👋 Je suis le ChatBot Pages AfroCarib. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCategoryClick = (category) => {
    setMessages(prev => [...prev, 
      {
        type: 'user',
        content: category.title,
        timestamp: new Date()
      }
    ]);
    
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: category.response,
        timestamp: new Date()
      }]);
    }, 2500); // Délai plus naturel
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, {
      type: 'user',
      content: inputText,
      timestamp: new Date()
    }]);
    setInputText('');
    
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "Je comprends votre demande. Pour vous aider au mieux, je vous invite à sélectionner l'une des catégories ci-dessus qui correspond le mieux à votre besoin.",
        timestamp: new Date()
      }]);
    }, 2000);
  };

  return (
    <>
      {/* Bouton flottant pour ouvrir le chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-bleu-nuit text-white p-4 rounded-full shadow-lg hover:bg-bleu-nuit/90 transition-colors z-50"
        >
          <FaRobot size={24} />
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className={`fixed ${isMobile ? 'inset-0' : 'bottom-4 right-4 w-[500px] h-[800px]'} bg-white flex flex-col z-50 ${isMobile ? '' : 'rounded-2xl shadow-xl'}`}>
          {/* Header */}
          <div className={`bg-bleu-nuit text-white p-4 flex justify-between items-center ${isMobile ? '' : 'rounded-t-2xl'}`}>
            <div className="flex items-center gap-3">
              <FaRobot size={24} />
              <div>
                <h3 className="font-bold text-lg">ChatBot Pages AfroCarib</h3>
                <p className="text-sm text-white/80">ChatBot Pages AfroCarib</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl whitespace-pre-wrap ${
                  msg.type === 'user' 
                    ? 'bg-bleu-nuit text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl rounded-bl-none max-w-[85%]">
                  <div className="flex gap-2">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Catégories */}
          <div className={`p-4 border-t ${isMobile ? 'bg-white' : ''}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="p-4 text-sm text-left text-bleu-nuit bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {category.title}
                </button>
              ))}
            </div>
            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:border-bleu-nuit"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-bleu-nuit text-white p-3 rounded-xl hover:bg-bleu-nuit/90 transition-colors"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
