import { useForm } from '@inertiajs/react';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Connexion à votre compte
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ex: exemple@email.com"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Remember & Forgot Password */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
              className="mr-2"
            />
            Se souvenir de moi
          </label>

          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Mot de passe oublié ?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {processing ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
