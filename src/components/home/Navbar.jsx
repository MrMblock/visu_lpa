import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Empêcher le scroll quand le menu est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const menuItems = [
        { to: "#", label: "Accueil" },
        { to: "#", label: "Espace Annonceur" },
        { to: "#", label: "Nos Actualités" },
        { to: "#", label: "Nos Partenaires" },
        { to: "#", label: "AfroCarib Care" },
    ];

    return (
        <nav className="bg-bleu-nuit text-blanc relative z-50">
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center">
                    <div>
                        <img src="logo.png" alt="Logo LPA" className='h-16 w-auto' />
                    </div>

                    {/* Burger menu button */}
                    <button 
                        className="lg:hidden text-blanc p-2 relative z-50 focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="w-8 h-6 flex flex-col justify-between">
                            <span 
                                className={`block h-0.5 w-full bg-blanc transform transition-all duration-300 ${
                                    isOpen ? 'rotate-45 translate-y-2.5' : ''
                                }`}
                            />
                            <span 
                                className={`block h-0.5 w-full bg-blanc transition-all duration-300 ${
                                    isOpen ? 'opacity-0' : 'opacity-100'
                                }`}
                            />
                            <span 
                                className={`block h-0.5 w-full bg-blanc transform transition-all duration-300 ${
                                    isOpen ? '-rotate-45 -translate-y-2.5' : ''
                                }`}
                            />
                        </div>
                    </button>

                    {/* Desktop menu */}
                    <ul className="hidden lg:flex gap-12 text-lg font-medium">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link 
                                    to={item.to} 
                                    className="text-blanc hover:text-jaune transition-all duration-300 relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-jaune transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Overlay sombre */}
                <div 
                    className={`
                        fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden
                        transition-opacity duration-300 z-40
                        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}
                    onClick={() => setIsOpen(false)}
                />

                {/* Mobile menu */}
                <div 
                    className={`
                        fixed top-0 right-0 h-full w-full max-w-sm lg:hidden
                        bg-bleu-nuit shadow-2xl z-40
                        transform transition-transform duration-300 ease-in-out
                        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    `}
                >
                    <div className="flex flex-col h-full pt-24 px-8">
                        <ul className="flex flex-col gap-2">
                            {menuItems.map((item, index) => (
                                <li 
                                    key={index}
                                    className={`
                                        transform transition-all duration-300 delay-${index * 50}
                                        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
                                    `}
                                >
                                    <Link 
                                        to={item.to} 
                                        className="block text-blanc transition-all duration-300 py-4 px-4 rounded-lg text-xl font-medium relative overflow-hidden group"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="relative z-10">{item.label}</span>
                                        <span className="absolute inset-0 bg-jaune/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;