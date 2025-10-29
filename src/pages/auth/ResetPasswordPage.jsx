import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../../components/auth/Input";
import { Lock } from "lucide-react";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const getTokenFromUrl = () => {
		const parts = window.location.pathname.split("/");
		return parts[parts.length - 1];
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (password !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas");
			return;
		}
		setLoading(true);
		try {
			const token = getTokenFromUrl();
			const res = await fetch(`/api/reset-password/${token}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Erreur de réinitialisation");
			setSuccess(true);
			setTimeout(() => { window.location.href = "/login"; }, 2000);
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
					Réinitialiser le mot de passe
				</h2>
				<form onSubmit={handleSubmit}>
					<Input
						icon={Lock}
						type='password'
						placeholder='Nouveau mot de passe'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<Input
						icon={Lock}
						type='password'
						placeholder='Confirmer le nouveau mot de passe'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
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
						{loading ? 'Réinitialisation...' : 'Valider'}
					</motion.button>
				</form>
				{success && <div className='text-green-600 text-center mt-4'>Mot de passe réinitialisé ! Redirection...</div>}
			</div>
		</motion.div>
	);
};
export default ResetPasswordPage;