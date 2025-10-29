import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br w-full from-bleu-nuit via-bleu to-bleu-clair flex items-center justify-center px-4">
            <div className="text-center">
                {/* Nombre 404 animé */}
                <div className="relative mb-8">
                    <h1 
                        className="text-[200px] md:text-[280px] font-bold text-blanc/10 select-none leading-none"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Search className="w-20 h-20 md:w-28 md:h-28 text-blanc animate-pulse" />
                    </div>
                </div>

                {/* Message principal */}
                <div className="bg-blanc/95 rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl mx-auto backdrop-blur-sm">
                    <h2 
                        className="text-3xl md:text-4xl font-bold text-bleu-nuit mb-4"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        Page introuvable
                    </h2>
                    <p className="text-lg text-bleu-nuit/70 mb-8">
                        Oups ! La page que vous recherchez semble avoir disparu dans les méandres du web.
                    </p>

                    {/* Boutons d'action */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-6 py-3 bg-bleu-clair text-blanc rounded-lg hover:bg-bleu transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour
                        </button>

                        <Link
                            to="/accueil"
                            className="flex items-center gap-2 px-6 py-3 bg-bleu text-blanc rounded-lg hover:bg-bleu-nuit transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
                        >
                            <Home className="w-5 h-5" />
                            Accueil
                        </Link>
                    </div>

                    {/* Liens rapides */}
                    <div className="mt-10 pt-8 border-t border-bleu-clair/30">
                        <p className="text-sm text-bleu-nuit/60 mb-4">Liens rapides :</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link 
                                to="/espace-client" 
                                className="text-bleu hover:text-bleu-nuit transition-colors underline"
                            >
                                Espace Client
                            </Link>
                            <Link 
                                to="/espace-annonceur" 
                                className="text-bleu hover:text-bleu-nuit transition-colors underline"
                            >
                                Espace Annonceur
                            </Link>
                            <Link 
                                to="/actualites" 
                                className="text-bleu hover:text-bleu-nuit transition-colors underline"
                            >
                                Actualités
                            </Link>
                            <Link 
                                to="/partenaires" 
                                className="text-bleu hover:text-bleu-nuit transition-colors underline"
                            >
                                Partenaires
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Message d'erreur technique (optionnel) */}
                <p className="text-blanc/60 text-sm mt-8">
                    Code d'erreur : 404 - Ressource non trouvée
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;