import React, { useState } from 'react';
import { supabase } from './supabase.js';

const inputStyle = {
  width: '100%', background: '#0E1419', border: '1px solid #1E2D3D',
  color: '#E8EDF2', fontFamily: "'DM Sans', sans-serif", fontSize: '14px',
  borderRadius: '8px', padding: '10px 14px', outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  fontSize: '10px', color: '#607D8B', textTransform: 'uppercase',
  letterSpacing: '0.1em', display: 'block', marginBottom: '6px',
  fontFamily: "'Space Mono', monospace",
};

export default function AuthPage() {
  const [mode, setMode]     = useState('login'); // 'login' | 'signup'
  const [email, setEmail]   = useState('');
  const [senha, setSenha]   = useState('');
  const [msg, setMsg]       = useState(null);   // { type: 'error'|'success', text }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !senha.trim()) {
      setMsg({ type: 'error', text: 'Preencha e-mail e senha.' });
      return;
    }
    setLoading(true);
    setMsg(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password: senha });
        if (error) throw error;
        setMsg({ type: 'success', text: 'Conta criada! Verifique seu e-mail para confirmar e depois faça login.' });
        setMode('login');
        return;
      }
    } catch (e) {
      setMsg({ type: 'error', text: traduzirErro(e.message) });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{
            width: '40px', height: '40px', background: 'var(--accent1)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 700, color: '#080C10', fontFamily: "'Space Mono', monospace",
          }}>PA</div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>People Analytics</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Departamento de TI</div>
          </div>
        </div>

        {/* Título */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
            {mode === 'login' ? 'Entrar na conta' : 'Criar conta'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
            {mode === 'login'
              ? 'Seus dados são privados e vinculados ao seu perfil.'
              : 'Crie uma conta para acessar o dashboard.'}
          </div>
        </div>

        {/* Mensagem de feedback */}
        {msg && (
          <div style={{
            padding: '10px 14px', borderRadius: '8px', marginBottom: '18px',
            fontSize: '13px', fontWeight: 500,
            background: msg.type === 'error' ? '#FF525218' : '#4CAF5018',
            border: `1px solid ${msg.type === 'error' ? '#FF525244' : '#4CAF5044'}`,
            color: msg.type === 'error' ? '#FF5252' : '#4CAF50',
          }}>
            {msg.text}
          </div>
        )}

        {/* Campos */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>E-mail</label>
          <input
            style={inputStyle}
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Senha</label>
          <input
            style={inputStyle}
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Botão principal */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
            background: loading ? '#607D8B' : 'var(--accent1)',
            color: '#080C10', fontSize: '14px', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s',
          }}
        >
          {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        {/* Alternar modo */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMsg(null); }}
            style={{
              background: 'transparent', border: 'none', color: 'var(--accent1)',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0,
            }}
          >
            {mode === 'login' ? 'Criar conta' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Traduz mensagens de erro do Supabase para português
function traduzirErro(msg) {
  if (msg.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (msg.includes('Email not confirmed'))       return 'Confirme seu e-mail antes de entrar.';
  if (msg.includes('User already registered'))   return 'E-mail já cadastrado. Faça login.';
  if (msg.includes('Password should be'))        return 'Senha deve ter pelo menos 6 caracteres.';
  if (msg.includes('Unable to validate'))        return 'Sessão expirada. Faça login novamente.';
  return msg;
}
