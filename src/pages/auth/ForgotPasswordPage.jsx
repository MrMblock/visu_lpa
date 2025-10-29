import { motion } from "framer-motion";
import { useState } from "react";
import Input from "../../components/auth/Input";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await fetch("/api/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Erreur d'envoi");
			setIsSubmitted(true);
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
					Mot de Passe Oublié
				</h2>
				{!isSubmitted ? (
					<form onSubmit={handleSubmit}>
						<p className='text-bleu-foncé mb-6 text-center'>
							Entrer votre adresse e-mail ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe.
						</p>
						<Input
							icon={Mail}
							type='email'
							placeholder='Adresse e-mail'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						{error && <div className='text-red-500 text-center mt-2'>{error}</div>}
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='button button-primary w-full mt-2'
							type='submit'
							disabled={loading}
						>
							{loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
						</motion.button>
					</form>
				) : (
					<div className='text-center'>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
							className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'
						>
							<Mail className='h-8 w-8 text-light' />
						</motion.div>
						<p className='text-bleu-foncé mb-6'>
							Si un compte existe pour {email}, vous recevrez bientôt un lien de réinitialisation de mot de passe.
						</p>
					</div>
				)}
			</div>
			<div className='px-8 py-4 bg-bleu-clair bg-opacity-10 flex justify-center'>
				<Link to={"/login"} className='text-sm text-primary hover:underline flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-2' /> Retour à la connexion
				</Link>
			</div>
		</motion.div>
	);
};
export default ForgotPasswordPage;