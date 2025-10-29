const Input = ({ icon: Icon, ...props }) => {
    return (
        <div className='relative mb-6'>
            {/* Affiche l'icône seulement si elle existe */}
            {Icon && (
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <Icon className='size-5 text-bleu-foncé' />
                </div>
            )}
			<input
				{...props}
				style={{ paddingLeft: Icon ? '2.5rem' : undefined }}
				className='w-full pr-3 py-2 bg-blanc bg-opacity-50 rounded-lg border border-bleu-nuit focus:border-bleu-nuit focus:ring-2 focus:ring-bleu text-bleu-nuit placeholder-bleu-nuit transition duration-200'
			/>
        </div>
    );
};
export default Input;