import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button, Input, Card } from '../../components/common';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [identifier, setIdentifier] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login({ identifier, senha });
      
      if (success) {
        const user = useAuthStore.getState().user;
        if (user?.tipo === 'paciente') {
          navigate('/paciente/home');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setError('Email/CRM ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl relative z-10 border border-primary-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-heading font-bold text-neutral-900">
            Sistema de Agendamento
          </h1>
          <p className="text-neutral-600 mt-2 font-medium">
            Faça login para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="text"
            label="Email ou CRM"
            placeholder="ana.souza@example.com ou crm123"
            value={identifier}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          <Input
            type="password"
            label="Senha"
            placeholder="••••••"
            value={senha}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          {error && (
            <div className="bg-danger-50 border border-danger-300 text-danger-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
            Entrar
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-200">
          <p className="text-xs text-neutral-600 text-center font-semibold mb-3">
            Usuários de teste:
          </p>
          <div className="space-y-2 text-xs">
            <div className="bg-primary-50 p-3 rounded-lg border border-primary-200 hover:border-primary-300 transition-colors">
              <strong className="text-primary-700">Paciente:</strong> <span className="text-neutral-700">ana.souza@example.com / 123456</span>
            </div>
            <div className="bg-primary-50 p-3 rounded-lg border border-primary-200 hover:border-primary-300 transition-colors">
              <strong className="text-primary-700">Médico:</strong> <span className="text-neutral-700">crm123 / 123456</span>
            </div>
            <div className="bg-primary-50 p-3 rounded-lg border border-primary-200 hover:border-primary-300 transition-colors">
              <strong className="text-primary-700">Admin:</strong> <span className="text-neutral-700">admin.crm / admin123</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
