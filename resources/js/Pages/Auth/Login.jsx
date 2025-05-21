import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Connexion" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Card className="w-full max-w-md shadow-xl">
                    <CardContent className="space-y-6 p-6">
                        <h2 className="text-2xl font-bold text-center">Se connecter</h2>

                        {status && <div className="text-green-600">{status}</div>}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
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
                                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                            </div>

                            <div>
                                <Label htmlFor="password">Mot de passe</Label>
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
                                {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                Connexion
                            </Button>

                            {canResetPassword && (
                                <div className="text-sm text-right">
                                    <a href={route('password.request')} className="text-blue-500 hover:underline">
                                        Mot de passe oublié ?
                                    </a>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
