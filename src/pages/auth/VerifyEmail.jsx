import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function getEmailFromQuery() {
	const params = new URLSearchParams(window.location.search);
	return params.get("email") || "";
}

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const [email] = useState(getEmailFromQuery());
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleChange = (index, value) => {
		const val = value.replace(/[^0-9]/g, "");
		const newCode = [...code];
		newCode[index] = val;
		setCode(newCode);
		if (val && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e) => {
		const pasted = e.clipboardData.getData("Text").replace(/[^0-9]/g, "").slice(0, 6);
		if (pasted.length > 0) {
			const arr = pasted.split("");
			setCode(arr.concat(Array(6 - arr.length).fill("")));
			const lastFilled = arr.length - 1;
			inputRefs.current[lastFilled]?.focus();
			e.preventDefault();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const codeStr = code.join("");
			const res = await fetch("/api/verify-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, code: codeStr }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Erreur de vérification");
			setSuccess(true);
			setTimeout(() => { window.location.href = "/login"; }, 2000);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='w-full max-w-lg sm:max-w-xl bg-blanc bg-opacity-95 rounded-2xl shadow-xl overflow-hidden'>
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-blanc bg-opacity-95 rounded-2xl shadow-2xl p-10 sm:p-12 w-full'
			>
				<h2 className='text-3xl font-bold mb-6 text-center text-bleu-nuit' style={{ fontFamily: "var(--font-display)" }}>
					Vérifiez votre email
				</h2>
				<p className='text-center text-bleu-foncé mb-6'>Entrez le code à 6 chiffres envoyé à <span className="font-bold">{email}</span>.</p>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='flex justify-between gap-2'>
						{code.map((digit, index) => (
							<input
								key={index}
								ref={el => inputRefs.current[index] = el}
								type='text'
								maxLength='1'
								value={digit}
								onChange={e => handleChange(index, e.target.value)}
								onKeyDown={e => handleKeyDown(index, e)}
								onPaste={handlePaste}
								className='w-12 h-12 text-center text-2xl font-bold bg-bleu-clair text-dark border-2 border-bleu rounded-lg focus:border-primary focus:outline-none'
								inputMode="numeric"
								autoComplete="one-time-code"
							/>
						))}
					</div>
					{error && <div className='text-red-500 text-center mt-2'>{error}</div>}
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type='submit'
						className='button button-primary w-full mt-2'
						disabled={loading}
					>
						{loading ? 'Vérification...' : 'Vérifiez votre email'}
					</motion.button>
				</form>
				{success && <div className='text-green-600 text-center mt-4'>Email vérifié ! Redirection...</div>}
			</motion.div>
		</div>
	);
};
export default EmailVerificationPage;