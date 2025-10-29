import React, { useEffect, useState, useRef } from "react";
import {
  FaUtensils,
  FaBolt,
  FaSpa,
  FaCapsules,
  FaUserMd,
  FaTaxi,
  FaFileInvoice,
  FaFileSignature,
  FaTools,
  FaSearch,
  FaMapMarkerAlt,
  FaSpinner,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

/**
 * Composant Home
 * - Utilise BigDataCloud reverse-geocode-client pour obtenir la ville.
 * - Si coords disponibles mais accuracy > ACCURACY_THRESHOLD -> fallback IP.
 * - Si geolocation refusée ou erreur -> fallback IP.
 *
 * Sources : BigDataCloud client-side reverse geocode + guide HackerNoon.
 * https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api
 * https://hackernoon.com/lang/fr/comment-obtenir-l%27emplacement-d%27un-utilisateur-dans-reactjs-un-guide-pratique
 */

const categories = [
  { icon: FaUtensils, label: "Restaurant" },
  { icon: FaBolt, label: "Electricien" },
  { icon: FaSpa, label: "Beauté" },
  { icon: FaCapsules, label: "Pharmacie" },
  { icon: FaUserMd, label: "Kiné" },
  { icon: FaTaxi, label: "Taxi" },
  { icon: FaFileInvoice, label: "Comptable" },
  { icon: FaFileSignature, label: "Notaire" },
  { icon: FaTools, label: "Plombier" },
];

const ACCURACY_THRESHOLD_METERS = 5000; // si accuracy > 5km, on considère la position trop imprécise et on fallback IP

const annonces = [
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400",
    tag: "Actualités",
    date: "29 octobre 2025",
    title: "L'hiver n'épargnera pas votre terrasse : nos conseils pour la garder intacte !",
  },
  {
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400",
    tag: "Terrasse",
    date: "28 octobre 2025",
    title: "Terrasse en bois sur parpaing : comment créer un espace chaleureux dans votre jardin ?",
  },
  {
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400",
    tag: "Déco",
    date: "28 octobre 2025",
    title: "Déco : ces 4 couleurs dont on ne veut plus en 2026 (et les top tendances à venir)",
  },
  {
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400",
    tag: "Actualités",
    date: "27 octobre 2025",
    title: "Pression de chaudière qui baisse ? On vous explique pourquoi !",
  },
  {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400",
    tag: "Plomberie",
    date: "26 octobre 2025",
    title: "Plomberie : comment éviter les fuites d'eau dans votre maison ?",
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400",
    tag: "Électricité",
    date: "25 octobre 2025",
    title: "Sécurité électrique : les bons réflexes à adopter chez soi",
  },
  {
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400",
    tag: "Beauté",
    date: "24 octobre 2025",
    title: "Beauté : les tendances coiffure afrocarib 2025",
  },
  {
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400",
    tag: "Santé",
    date: "23 octobre 2025",
    title: "Santé : comment choisir son kiné pour une rééducation optimale ?",
  },
];

const Home = () => {
  const [address, setAddress] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // appelle BigDataCloud : si latitude/longitude fournis -> reverse geocode,
  // sinon (sans coords) l'endpoint renverra un fallback basé sur l'IP.
  const fetchCityFromBigDataCloud = async (latitude, longitude) => {
    try {
      const base = "https://api.bigdatacloud.net/data/reverse-geocode-client";
      const params = new URLSearchParams({
        localityLanguage: "fr",
      });
      if (typeof latitude === "number" && typeof longitude === "number") {
        params.set("latitude", latitude);
        params.set("longitude", longitude);
      }
      const url = `${base}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("BigDataCloud response not ok");
      const data = await res.json();
      // data contient city, locality, principalSubdivision, countryName, etc.
      const city = data.city || data.locality || data.principalSubdivision || "";
      const region = data.principalSubdivision || "";
      const country = data.countryName || "";
      const addressStr = city
        ? `${city}${region ? ", " + region : ""}${country ? ", " + country : ""}`
        : data.locality || data.principalSubdivision || data.countryName || "";
      return addressStr || "";
    } catch (err) {
      console.error("fetchCityFromBigDataCloud error:", err);
      return "";
    }
  };

  const handleAroundMe = async () => {
    if (!("geolocation" in navigator)) {
      // Pas de geolocation : fallback IP via BigDataCloud (appel sans coords)
      setIsLoading(true);
      const ipAddressCity = await fetchCityFromBigDataCloud();
      setAddress(ipAddressCity);
      setShowDropdown(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        console.log("GEO success -> lat:", latitude, "lon:", longitude, "accuracy(m):", accuracy);

        // Si accuracy trop grande, on préfère fallback sur IP (BigDataCloud sans coords)
        if (typeof accuracy === "number" && accuracy > ACCURACY_THRESHOLD_METERS) {
          console.warn(`Accuracy ${accuracy}m > ${ACCURACY_THRESHOLD_METERS}m -> fallback IP`);
          const ipCity = await fetchCityFromBigDataCloud();
          setAddress(ipCity);
          setShowDropdown(false);
          setIsLoading(false);
          return;
        }

        // Sinon on fait reverse-geocode avec coords
        const cityFromCoords = await fetchCityFromBigDataCloud(latitude, longitude);

        // Si réponse vide on tente fallback IP (sécurité)
        if (!cityFromCoords) {
          console.warn("BigDataCloud with coords returned empty -> fallback IP");
          const ipCity = await fetchCityFromBigDataCloud();
          setAddress(ipCity);
        } else {
          setAddress(cityFromCoords);
        }

        setShowDropdown(false);
        setIsLoading(false);
      },
      async (error) => {
        // Erreur ou refus : fallback IP via BigDataCloud
        console.error("geolocation error:", error);
        const ipCity = await fetchCityFromBigDataCloud();
        setAddress(ipCity);
        setShowDropdown(false);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Fermer le menu si clic à l’extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center pt-8">
      <form className="flex w-full max-w-4xl mx-auto mb-10 relative" ref={dropdownRef}>
        <div className="flex flex-1 bg-white rounded-l-full border border-gray-300">
          <div className="flex items-center px-4 text-bleu-nuit">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="De quoi avez-vous besoin ?"
            className="flex-1 py-3 px-2 outline-none bg-transparent text-gray-700"
          />
        </div>

        <div className="flex flex-1 bg-white border border-gray-300 border-l-0 rounded-r-full relative">
          <div className="flex items-center px-4 text-bleu-nuit">
            <FaMapMarkerAlt />
          </div>
          <input
            type="text"
            placeholder="Adresse, quartier, ville, département"
            className="flex-1 py-3 px-2 outline-none bg-transparent text-gray-700"
            value={address}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* Menu déroulant */}bleu
          {showDropdown && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-xl shadow-md z-50">
              <li
                onClick={!isLoading ? handleAroundMe : undefined}
                className={`px-4 py-2 flex items-center gap-2 cursor-pointer text-sm text-gray-700 ${
                  isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin text-gray-500" />
                    Recherche en cours...
                  </>
                ) : (
                  "Autour de moi"
                )}
              </li>
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="ml-[-3rem] mt-[0.2rem] rounded-full bg-bleu-nuit w-12 h-12 flex items-center justify-center shadow-lg border border-gray-200 z-10"
        >
          <FaSearch className="text-jaune text-xl" />
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-10 mt-2">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="flex flex-col items-center min-w-[80px] cursor-pointer group"
          >
            <cat.icon className="text-bleu-nuit text-3xl mb-2 transition-colors group-hover:text-jaune" />
            <span className="text-bleu-nuit text-sm transition-colors group-hover:text-jaune">
              {cat.label}
            </span>
          </div>
        ))}
      </div>

      <div className="promo-cards w-full max-w-7xl mt-16 px-4 flex flex-row gap-10 overflow-x-auto items-stretch snap-x snap-mandatory scrollbar-hide">
        <div
          className="promo-card relative flex justify-end flex-col gap-4 min-w-[600px] h-[450px] rounded-2xl overflow-hidden shadow-lg bg-cover bg-center p-6 snap-start"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1528901166007-3784c7dd3653?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="relative z-10">
            <h1 className="text-white text-2xl font-bold mb-2">L'Entreprise à la une</h1>
            <p className="text-white/90 text-sm mb-4">
              Découvrez une entreprise afrocaribéenne qui brille!
            </p>
            <button
              className="bg-jaune text-black font-semibold px-6 py-3 rounded-md shadow-md transform transition-all duration-300 hover:bg-bleu-nuit hover:text-jaune hover:shadow-lg"
            >
              Découvrir
            </button>
          </div>
        </div>

        <div
          className="promo-card relative flex flex-col justify-center items-center min-w-[600px] h-[450px] rounded-2xl overflow-hidden shadow-lg bg-cover bg-center p-6 snap-start"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=900&fit=crop')",
          }}
        >
          {/* Overlay sombre */}
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center">
            <h1 className="text-white text-3xl font-extrabold mb-2">
              PROFESSIONNELS,<br />RAPPROCHEZ-VOUS DE VOS CLIENTS !
            </h1>
            <p className="text-white text-base mb-6 max-w-xl">
              Gérez gratuitement toutes vos informations, vos avis, vos publications et bien plus encore directement depuis notre plateforme 
            </p>
            <div className="flex flex-col gap-3 mb-6 w-full max-w-xs">
              <button className="bg-bleu-nuit text-blanc font-semibold py-3 rounded-lg shadow hover:bg-bleu-nuit/80 transition">
                Créer mon compte
              </button>
              <button className="bg-jaune/90 text-black py-3 rounded-lg shadow hover:bg-jaune/80 transition border border-gray-600">
                Je me connecte
              </button>
            </div>
            <div className="flex justify-center gap-6 mb-4 text-white text-xl">
              <span><FaFileInvoice /></span>
              <span><FaTools /></span>  
              <span><FaUserMd /></span>
              <span><FaTaxi /></span>
              <span><FaUtensils /></span>
            </div>
            <div className="text-white/80 text-xs mt-2">
              Les Pages Afrocarib, un outil fait par <span className="font-bold">nous</span>, pour <span className="font-bold">vous</span>, avec <span className="font-bold">vous</span>
            </div>
          </div>
        </div>
      </div>


      <div className="dernieres-annonces w-full max-w-7xl mt-16 px-4">
        <h2 className="text-2xl font-bold mb-6 text-bleu-nuit">Dernières annonces</h2>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="swiper-annonces"
        >
          {annonces.map((annonce, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white rounded-lg border-2 border-gray flex flex-col h-[370px] transition-transform hover:-translate-y-1 hover:shadow-yellow-400/40">
                <div className="relative h-[140px] w-full">
                  <img
                    src={annonce.image}
                    alt={annonce.title}
                    className="object-cover w-full h-full"
                  />
                  <span className="absolute top-2 left-2 bg-jaune text-xs font-semibold px-3 py-1 rounded text-bleu-nuit shadow">
                    {annonce.tag}
                  </span>
                  <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition">
                    <FaSearch className="text-bleu-nuit" />
                  </button>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <div className="flex items-center gap-2 text-orange-600 text-sm mb-2">
                    <FaTools />
                    <span>{annonce.date}</span>
                  </div>
                  <h3 className="font-bold text-lg text-bleu-nuit mb-2 line-clamp-3">{annonce.title}</h3>
                  {/* Ajoutez un bouton ou autre contenu si besoin */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <style>
          {`
            .swiper-annonces .swiper-button-next,
            .swiper-annonces .swiper-button-prev {
              color: #1a237e !important; /* bleu nuit */
            }
          `}
        </style>
      </div>

      {/* Nouvelle section : Votre santé */}
      <div className="w-full max-w-7xl mx-auto mt-12">
        <h2 className="text-2xl font-extrabold text-bleu-nuit mb-6">Votre santé</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600" alt="Se soigner au quotidien" className="w-full h-32 object-cover" />
            <div className="p-4 font-bold text-lg">Se soigner au quotidien</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600" alt="Spécialités médicales" className="w-full h-32 object-cover" />
            <div className="p-4 font-bold text-lg">Spécialités médicales</div>
          </div>
        </div>
      </div>

      {/* Nouvelle section : Votre logement */}
      <div className="w-full max-w-7xl mx-auto mt-12">
        <h2 className="text-2xl font-extrabold text-bleu-nuit mb-6">Votre logement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600" alt="Les travaux de la maison" className="w-full h-32 object-cover" />
            <div className="p-4 font-bold text-lg">Les travaux de la maison</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600" alt="Equiper la maison" className="w-full h-32 object-cover" />
            <div className="p-4 font-bold text-lg">Equiper la maison</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600" alt="Jardins et extérieurs" className="w-full h-32 object-cover" />
            <div className="p-4 font-bold text-lg">Jardins et extérieurs</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1528901166007-3784c7dd3653?w=600" alt="L’immobilier" className="w-full h-32 object-cover" />
            <div className="p-4 font-bold text-lg">L’immobilier</div>
          </div>
        </div>
      </div>

      {/* Nouvelle section : Vos commerces de proximité */}
      <div className="w-full max-w-7xl mx-auto mt-12 mb-12">
        <h2 className="text-2xl font-extrabold text-bleu-nuit mb-6">Vos commerces de proximité</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600" alt="Les bons restos" className="w-full h-32 object-cover" />
            <div className="p-4 font-bold text-lg">Les bons restos</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600" alt="Sorties" className="w-full h-32 object-cover" />
            <div className="p-4 font-bold text-lg">Sorties</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600" alt="Shopping" className="w-full h-32 object-cover" />
            <div className="p-4 font-bold text-lg">Shopping</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600" alt="Cuisiner de bons repas" className="w-full h-32 object-cover" />
            <div className="p-4 font-bold text-lg">Cuisiner de bons repas</div>
          </div>
        </div>
      </div>
           
      <div className="lpa-promo w-full max-w-7xl mt-20 px-4">
        <h1 className="text-3xl font-extrabold text-center mb-10 text-bleu-nuit">
          Avec les Pages AfroCarib, rencontrez le pro qu'il vous faut !
        </h1>
        <div className="lpa-promo-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="lpa-promo-card bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
            <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f50d.svg" alt="loupe" className="w-20 h-20 mb-4" />
            <h2 className="font-bold text-lg mb-2 text-bleu-nuit">La référence des pros en France</h2>
            <p className="text-gray-600 text-sm">95% des professionnels inscrits, partout en France</p>
          </div>
          <div className="lpa-promo-card bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
            <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4e3.svg" alt="megaphone" className="w-20 h-20 mb-4" />
            <h2 className="font-bold text-lg mb-2 text-bleu-nuit">Les informations enrichies par les professionnels...</h2>
            <p className="text-gray-600 text-sm">Horaires, prestations, actus, coordonnées, itinéraire...<br />100 000 mises à jour quotidiennes</p>
          </div>
          <div className="lpa-promo-card bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
            <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b50.svg" alt="star" className="w-20 h-20 mb-4" />
            <h2 className="font-bold text-lg mb-2 text-bleu-nuit">Des recommandations pour décider</h2>
            <p className="text-gray-600 text-sm">18 M d’avis et notes des utilisateurs, photos, labels qualité, badges et certifications...</p>
          </div>
          <div className="lpa-promo-card bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
            <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4bb.svg" alt="ordinateur" className="w-20 h-20 mb-4" />
            <h2 className="font-bold text-lg mb-2 text-bleu-nuit">Des services en ligne pour vous faciliter la vie</h2>
            <p className="text-gray-600 text-sm">Demande de devis, prise de rendez-vous, réservation, messagerie...</p>
          </div>
        </div>
      </div>

      
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center mt-16 mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-bleu-nuit mb-6">
          Les Pages Afrocarib, fait par <span className="font-extrabold">nous</span>, pour  <span className="font-extrabold">vous</span>, mais surtout avec <span className="font-extrabold">vous</span>.
        </h2>
        <button
          className="bg-bleu-nuit text-blanc font-semibold px-6 py-2 rounded-full border border-yellow-400 shadow hover:bg-jaune hover:text-black transition ease-in-out duration-300"
        >
          Consulter notre actualité
        </button>
      </div>

    </div>

  );
};

export default Home;
