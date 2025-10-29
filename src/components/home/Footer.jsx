import React, { useEffect, useState } from "react";
import { FaChevronRight, FaEnvelopeOpenText, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return (
        <footer className="w-full py-3 sm:py-4 px-3 sm:px-4 md:px-8 bg-bleu-nuit text-blanc border-t border-bleu">
            <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:gap-4">
                {/* Haut du footer */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="text-center md:text-left w-full md:w-auto">
                        <h4 className="text-lg sm:text-xl font-display font-bold mb-1 text-jaune">
                            Rejoignez LPA
                        </h4>
                        <p className="text-xs sm:text-sm text-blanc/80 max-w-xl">
                            Découvrez les meilleurs professionnels afro-caribéens près de chez vous.
                        </p>
                    </div>
                    <Link to="/signup" className="px-4 py-2 bg-jaune text-bleu-nuit font-semibold rounded-full shadow hover:bg-orange transition text-sm w-full md:w-auto text-center">
                        Devenir Membre
                    </Link>
                </div>

                {/* Liens et infos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center md:text-left">
                    {/* À propos */}
                    <div className="order-2 md:order-1">
                        <h6 className="text-sm sm:text-base font-bold mb-2 text-jaune">À propos</h6>
                        <ul className="space-y-1">
                            <li>
                                <Link to="/actualites" className="flex items-center gap-2 text-blanc hover:text-jaune transition justify-center md:justify-start">
                                    <FaChevronRight className="text-jaune text-sm" /> <span className="text-sm sm:text-base">Actualités</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/partenaires" className="flex items-center gap-2 text-blanc hover:text-jaune transition justify-center md:justify-start">
                                    <FaChevronRight className="text-jaune text-sm" /> <span className="text-sm sm:text-base">Partenaires</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/afrocaribcare" className="flex items-center gap-2 text-blanc hover:text-jaune transition justify-center md:justify-start">
                                    <FaChevronRight className="text-jaune text-sm" /> <span className="text-sm sm:text-base">AfroCarib Care</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="order-3 md:order-2">
                        <h6 className="text-sm sm:text-base font-bold mb-2 text-jaune">Contact</h6>
                        <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                            <FaEnvelopeOpenText className="text-jaune text-sm" />
                            <span className="text-sm sm:text-base">contact@lpa.com</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <FaPhoneAlt className="text-jaune text-sm" />
                            <span className="text-sm sm:text-base">+33 6 14 95 61 80</span>
                        </div>
                    </div>

                    {/* Newsletter - hidden on mobile */}
                    {!isMobile && (
                        <div className="order-1 md:order-3">
                            <h6 className="text-sm sm:text-base font-bold mb-2 text-jaune">Newsletter</h6>
                            <p className="text-xs mb-2 text-blanc/80 px-4 md:px-0">
                                Inscrivez-vous pour recevoir nos actualités.
                            </p>
                            <form className="flex gap-1 sm:gap-2 max-w-xs mx-auto md:mx-0">
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-l-full bg-blanc text-bleu-nuit border-none outline-none flex-1 text-sm"
                                />
                                <button type="submit" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-jaune text-bleu-nuit font-semibold rounded-r-full hover:bg-orange transition text-sm whitespace-nowrap">
                                    S'abonner
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Bas du footer */}
                <div className="text-center text-blanc/60 text-xs mt-3 pt-3 border-t border-blanc/10">
                    &copy; {new Date().getFullYear()} LPA. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
};

export default Footer;