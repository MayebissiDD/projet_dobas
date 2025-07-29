import { useForm } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token || '',
    email: email || '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/reset-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Nouveau mot de passe</h2>

        <input
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Email"
        />

        <input
          type="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Nouveau mot de passe"
        />

        <input
          type="password"
          value={data.password_confirmation}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Confirmez le mot de passe"
        />

        {errors.email && <p className="text-red-500 mb-2">{errors.email}</p>}
        {errors.password && <p className="text-red-500 mb-2">{errors.password}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={processing}
        >
          Réinitialiser
        </button>
      </form>
    </div>
  );
}
