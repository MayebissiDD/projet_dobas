import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-100 dark:from-zinc-900 dark:to-zinc-800">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full max-w-md"
                >
                  <Card className="shadow-2xl border-0">
                    <CardContent className="space-y-6 p-8">
                        <h2 className="text-3xl font-bold text-center text-green-700 dark:text-yellow-400 mb-2">Connexion</h2>
                        <p className="text-center text-zinc-500 dark:text-zinc-300 mb-4">Accédez à votre espace personnel DOBAS</p>
                        {status && <div className="text-green-600 text-center font-semibold">{status}</div>}
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
                                        autoFocus
                                        autoComplete="username"
                                    />
                                </div>
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
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
                                        autoComplete="current-password"
                                    />
                                </div>
                                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                            </div>
                            <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={processing}>
                                {processing && <Loader2 className="animate-spin w-4 h-4" />} Connexion
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
                </motion.div>
            </div>
        </>
    );
}
