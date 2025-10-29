import { motion } from "framer-motion";
import Input from "../../components/auth/Input";
import { Loader, Lock, Mail, User, Book } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../components/auth/PasswordStrengthMeter";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [siren, setSiren] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await fetch("/api/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					email,
					password,
					accountType: "Utilisateur",
					siren,
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Erreur d'inscription");
			// Redirige vers /verify-email avec l'email en query param
			navigate(`/verify-email?email=${encodeURIComponent(email)}`);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='w-full max-w-lg sm:max-w-xl bg-blanc bg-opacity-95 rounded-2xl shadow-xl overflow-hidden form-large'
		>
			<div className='p-10 sm:p-12'>
				<h2 className='text-3xl font-bold mb-6 text-center text-bleu-nuit' style={{ fontFamily: "var(--font-display)" }}>
					Créer un compte
				</h2>
				<form onSubmit={handleSignUp}>
					<Input
						icon={User}
						type='text'
						placeholder="Votre nom d'entreprise"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						icon={Mail}
						type='email'
						placeholder='Adresse mail'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						icon={Book}
						type='text'
						placeholder='Votre n° SIREN'
						value={siren}
						onChange={(e) => setSiren(e.target.value)}
					/>
					<Input
						icon={Lock}
						type='password'
						placeholder='Mot de passe'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<PasswordStrengthMeter password={password} />
					{error && <div className='text-red-500 text-center mt-2'>{error}</div>}
					<motion.button
						className='button button-primary mt-5 w-full'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
						disabled={loading}
					>
						{loading ? <Loader className='animate-spin mx-auto' /> : "Inscription"}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-bleu-clair bg-opacity-10 flex justify-center'>
				<p className='text-sm text-bleu-foncé'>
					Vous avez déjà un compte?{" "}
					<Link to={"/login"} className='text-primary hover:underline'>
						Connexion
					</Link>
				</p>
			</div>
		</motion.div>
	);
};
export default SignUpPage;