import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase.js';
import { DADOS } from './data.js';

/**
 * Hook que gerencia colaboradores do usuário logado no Supabase.
 * Na primeira vez que o usuário acessa, faz seed dos dados sintéticos.
 */
export function useColaboradores(userId) {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Carrega colaboradores do banco ────────────────────────────────────────
  const carregar = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('user_id', userId)
        .order('nome');

      if (error) throw error;

      // Primeira vez: faz seed dos dados sintéticos
      if (data.length === 0) {
        await fazerSeed(userId);
        return carregar();
      }

      setColaboradores(data.map(mapFromDB));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { carregar(); }, [carregar]);

  // ── Adicionar ─────────────────────────────────────────────────────────────
  const adicionar = async (colab) => {
    const { data, error } = await supabase
      .from('colaboradores')
      .insert([mapToDB(colab, userId)])
      .select()
      .single();
    if (error) throw error;
    setColaboradores(prev => [...prev, mapFromDB(data)]);
  };

  // ── Editar ────────────────────────────────────────────────────────────────
  const editar = async (colab) => {
    const { data, error } = await supabase
      .from('colaboradores')
      .update(mapToDB(colab, userId))
      .eq('id', colab.id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    setColaboradores(prev => prev.map(c => c.id === colab.id ? mapFromDB(data) : c));
  };

  // ── Remover ───────────────────────────────────────────────────────────────
  const remover = async (id) => {
    const { error } = await supabase
      .from('colaboradores')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
    setColaboradores(prev => prev.filter(c => c.id !== id));
  };

  return { colaboradores, loading, error, adicionar, editar, remover, recarregar: carregar };
}

// ── Seed inicial com dados sintéticos ────────────────────────────────────────
async function fazerSeed(userId) {
  const registros = DADOS.map(d => mapToDB(d, userId));
  const { error } = await supabase.from('colaboradores').insert(registros);
  if (error) console.error('Erro no seed:', error.message);
}

// ── Mapeamento DB → App ───────────────────────────────────────────────────────
function mapFromDB(row) {
  return {
    id:          row.id,
    nome:        row.nome,
    setor:       row.setor,
    cargo:       row.cargo,
    nivel:       row.nivel,
    salario:     row.salario,
    avaliacao:   row.avaliacao,
    homeOffice:  row.home_office,
    cidade:      row.cidade,
    admissao:    row.admissao,
    demissao:    row.demissao,
    ativo:       row.ativo,
    treinamentos: row.treinamentos,
    antiguidade: row.antiguidade,
    genero:      row.genero,
  };
}

// ── Mapeamento App → DB ───────────────────────────────────────────────────────
function mapToDB(c, userId) {
  return {
    id:           c.id,
    user_id:      userId,
    nome:         c.nome,
    setor:        c.setor,
    cargo:        c.cargo,
    nivel:        c.nivel,
    salario:      Number(c.salario),
    avaliacao:    Number(c.avaliacao),
    home_office:  c.homeOffice,
    cidade:       c.cidade || '',
    admissao:     c.admissao,
    demissao:     c.demissao || null,
    ativo:        c.ativo,
    treinamentos: c.treinamentos || 0,
    antiguidade:  c.antiguidade || 0,
    genero:       c.genero || 'N/I',
  };
}
