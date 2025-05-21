import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Mail, Lock, LockKeyhole } from 'lucide-react';

export default function ResetPassword({ token, email: initialEmail }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: initialEmail || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <GuestLayout>
            <Head title="Réinitialiser le mot de passe" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <Card className="w-full max-w-md shadow-xl">
                    <CardContent className="space-y-6 p-6">
                        <h2 className="text-2xl font-bold text-center">
                            Nouveau mot de passe
                        </h2>

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
                                    />
                                </div>
                                {errors.email && (
                                    <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password">Nouveau mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {errors.password && (
                                    <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Confirmation</Label>
                                <div className="relative">
                                    <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                Réinitialiser
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </GuestLayout>
    );
}
