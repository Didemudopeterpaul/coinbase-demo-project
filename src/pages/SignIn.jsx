import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo';

// --- Premium UI Components ---

const Shell = ({ children }) => (
	<div className="min-h-screen bg-[#0A0B0D] flex flex-col items-center justify-center px-4 py-12 selection:bg-[#EA580C]/30">
		<div className="w-full max-w-[440px] space-y-8 animate-in fade-in duration-700">
			<div className="flex justify-center mb-4">
				<Link to="/">
					<Logo height={32} className="brightness-0 invert hover:opacity-80 transition-opacity" />
				</Link>
			</div>
			<div className="bg-[#141519]/80 backdrop-blur-xl border border-[#2C2F36] rounded-[32px] p-8 lg:p-10 shadow-2xl">
				{children}
			</div>
			<p className="text-center text-[0.875rem] text-[#8A919E]">
				New to Coinbase?{' '}
				<Link to="/signup" className="text-[#EA580C] font-semibold hover:text-[#FF7A32] transition-colors">
					Create an account
				</Link>
			</p>
		</div>
	</div>
);

const InputField = ({ label, type, value, onChange, placeholder, error }) => (
	<div className="space-y-2 group">
		<label className="block text-[0.8125rem] font-bold text-[#8A919E] uppercase tracking-wider pl-1">
			{label}
		</label>
		<input
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className={`w-full h-14 px-5 rounded-2xl bg-[#1E2025] border ${error ? 'border-red-500' : 'border-[#2C2F36] group-focus-within:border-[#EA580C]'} text-white placeholder:text-[#5B616E] text-[1rem] outline-none transition-all`}
		/>
		{error && <p className="text-red-500 text-[0.75rem] pl-1">{error}</p>}
	</div>
);

const SignIn = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSignIn = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

		try {
			const response = await fetch(`${apiUrl}/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				// Success! Navigate to dashboard
				navigate('/explore');
			} else {
				setError(data.message || 'The email or password you entered is incorrect.');
			}
		} catch (err) {
			console.error('Login error:', err);
			setError('Could not connect to the server. Please check your connection or wait a few seconds.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Shell>
			<div className="space-y-2 mb-8">
				<h1 className="text-[1.75rem] font-bold text-white text-center leading-tight">
					Sign in to your account
				</h1>
				<p className="text-[#8A919E] text-center text-[0.9375rem]">
					Enter your details to access your portfolio
				</p>
			</div>

			<form onSubmit={handleSignIn} className="space-y-6">
				{error && (
					<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[0.875rem] text-center mb-2">
						{error}
					</div>
				)}

				<InputField
					label="Email Address"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="name@example.com"
				/>

				<div className="space-y-1">
					<InputField
						label="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••"
					/>
					<div className="flex justify-end pr-1">
						<Link to="/forgot-password" size="sm" className="text-[0.8125rem] text-[#8A919E] hover:text-white transition-colors">
							Forgot password?
						</Link>
					</div>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full h-14 rounded-2xl bg-[#EA580C] hover:bg-[#FF7A32] disabled:bg-[#EA580C]/50 disabled:cursor-not-allowed text-white font-bold text-[1rem] transition-all transform active:scale-[0.98] shadow-lg shadow-[#EA580C]/20"
				>
					{isLoading ? (
						<div className="flex items-center justify-center gap-2">
							<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							<span>Signing in...</span>
						</div>
					) : (
						'Sign In'
					)}
				</button>
			</form>
		</Shell>
	);
};

export default SignIn;
