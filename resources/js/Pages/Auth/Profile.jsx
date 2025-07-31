import { useForm } from '@inertiajs/react';

export default function Profile({ user }) {
  const { data, setData, put, processing, errors, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    put('/profil/password');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Modifier votre mot de passe</h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label>Mot de passe actuel</label>
          <input
            type="password"
            value={data.current_password}
            onChange={(e) => setData('current_password', e.target.value)}
            className="input"
          />
          {errors.current_password && <p className="text-red-500">{errors.current_password}</p>}
        </div>

        <div>
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="input"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>

        <div>
          <label>Confirmation</label>
          <input
            type="password"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            className="input"
          />
          {errors.password_confirmation && <p className="text-red-500">{errors.password_confirmation}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={processing}
        >
          Modifier
        </button>
      </form>
    </div>
  );
}
