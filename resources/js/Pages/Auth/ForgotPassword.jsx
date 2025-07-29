import { useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🔐 Mot de passe oublié
        </h2>

        {status && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
            {status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-300'
              }`}
              placeholder="exemple@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            Envoyer le lien de réinitialisation
          </button>
        </form>
      </div>
    </div>
  );
}
