import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Mail } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Mot de passe oublié" />

            <div className=" justify-center px-4">
    
                    <CardContent className="space-y-6 p-6">
                        <h2 className="text-2xl font-bold text-center">
                            Réinitialiser le mot de passe
                        </h2>

                        <p className="text-sm text-gray-600 text-center">
                            Mot de passe oublié ? Pas de souci. Saisis ton adresse email et nous t'enverrons un lien pour le réinitialiser.
                        </p>

                        {status && (
                            <div className="text-sm font-medium text-green-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Adresse email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="pl-10"
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.email && (
                                    <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                Envoyer le lien de réinitialisation
                            </Button>
                        </form>
                    </CardContent>
            </div>
        </GuestLayout>
    );
}
