import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Mail, ShieldCheck, Lock } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 'etudiant',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Inscription" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Card className="w-full max-w-md shadow-xl">
                    <CardContent className="space-y-6 p-6">
                        <h2 className="text-2xl font-bold text-center">Créer un compte</h2>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nom complet</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>

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
                                <Label htmlFor="role">Rôle</Label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        id="role"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="pl-10 mt-1 block w-full border rounded-md shadow-sm p-2 focus:outline-none focus:ring"
                                    >
                                        <option value="etudiant">Étudiant</option>
                                        <option value="agent">Agent</option>
                                    </select>
                                </div>
                                {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}
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

                            <div>
                                <Label htmlFor="password_confirmation">Confirmation</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
                                S'inscrire
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
