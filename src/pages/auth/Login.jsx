import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../../components/auth/Input";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Erreur de connexion");
			// Stocker le token (localStorage)
			localStorage.setItem("token", data.token);
			window.location.href = "/";
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
					Vous êtes de retour !
				</h2>
				<form onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type='email'
						placeholder='Adresse mail'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						icon={Lock}
						type='password'
						placeholder='Mot de passe'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div className='flex items-center mb-6'>
						<Link to='/forgot-password' className='text-sm text-primary hover:underline'>
							Mot de passe oublié?
						</Link>
					</div>
					{error && <div className='text-red-500 text-center mb-2'>{error}</div>}
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='button button-primary w-full mt-2'
						type='submit'
						disabled={loading}
					>
						{loading ? <Loader className='animate-spin mx-auto' /> : 'Connexion'}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-bleu-clair bg-opacity-10 flex justify-center'>
				<p className='text-sm text-bleu-foncé'>
					Vous n'avez pas de compte?{" "}
					<Link to='/signup' className='text-primary hover:underline'>
						Inscription
					</Link>
				</p>
			</div>
		</motion.div>
	);
};
export default LoginPage;