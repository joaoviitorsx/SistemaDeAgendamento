import React from 'react';
import { Modal, Button } from '../common';

interface CredenciaisModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: 'medico' | 'paciente';
  nome: string;
  username: string;
  senha: string;
}

const CredenciaisModal: React.FC<CredenciaisModalProps> = ({
  isOpen,
  onClose,
  tipo,
  nome,
  username,
  senha,
}) => {
  const handleCopiar = () => {
    const texto = `Credenciais de Acesso
Nome: ${nome}
Usuário: ${username}
Senha Temporária: ${senha}

⚠️ IMPORTANTE: Altere a senha no primeiro acesso!`;
    
    navigator.clipboard.writeText(texto);
    alert('Credenciais copiadas para a área de transferência!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastro Realizado com Sucesso!"
    >
      <div className="space-y-6">
        <div className="bg-success-50 border-l-4 border-success-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-success-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-success-800">
                {tipo === 'medico' ? 'Médico' : 'Paciente'} cadastrado com sucesso!
              </h3>
              <p className="mt-1 text-sm text-success-700">
                As credenciais de acesso foram criadas automaticamente.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
          <h4 className="text-lg font-heading font-bold text-primary-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Credenciais de Acesso
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-primary-700 uppercase tracking-wide mb-1">
                Nome
              </label>
              <div className="bg-white rounded-lg px-4 py-3 border border-primary-200">
                <p className="text-neutral-900 font-medium">{nome}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary-700 uppercase tracking-wide mb-1">
                Usuário (Login)
              </label>
              <div className="bg-white rounded-lg px-4 py-3 border border-primary-200">
                <p className="text-primary-700 font-mono font-bold text-lg">{username}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary-700 uppercase tracking-wide mb-1">
                Senha Temporária
              </label>
              <div className="bg-white rounded-lg px-4 py-3 border border-primary-200">
                <p className="text-primary-700 font-mono font-bold text-lg">{senha}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-warning-50 border-l-4 border-warning-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-warning-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-bold text-warning-800">
                Importante!
              </h4>
              <p className="mt-1 text-sm text-warning-700">
                Anote ou copie estas credenciais antes de fechar esta janela.
                O usuário deve alterar a senha no primeiro acesso ao sistema.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCopiar}
            className="flex-1"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copiar Credenciais
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
            className="flex-1"
          >
            Entendi
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CredenciaisModal;
