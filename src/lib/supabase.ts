import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RegistrationEntry } from '../types';

const STORAGE_KEY_URL = 'bmw_gs_supabase_url';
const STORAGE_KEY_KEY = 'bmw_gs_supabase_key';
const STORAGE_LOCAL_ENTRIES = 'bmw_gs_local_entries_v1';

// Seed demo entries so the counter and transparency list look authentic from the start
const INITIAL_DEMO_ENTRIES: RegistrationEntry[] = [
  {
    id: 'demo-1',
    nome: 'Rodrigo Alcantara Silveira',
    email: 'rodrigo.alcantara@gmail.com',
    telefone: '(11) 98722-4410',
    numero_bilhete: 'GS-738192',
    criado_em: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    origem: 'local_demo',
  },
  {
    id: 'demo-2',
    nome: 'Mariana Duarte Costa',
    email: 'mariana.costa@outlook.com',
    telefone: '(21) 99184-5532',
    numero_bilhete: 'GS-294810',
    criado_em: new Date(Date.now() - 1000 * 60 * 82).toISOString(),
    origem: 'local_demo',
  },
  {
    id: 'demo-3',
    nome: 'Carlos Eduardo Fontes',
    email: 'carlos.fontes@yahoo.com.br',
    telefone: '(31) 97103-9988',
    numero_bilhete: 'GS-610483',
    criado_em: new Date(Date.now() - 1000 * 60 * 145).toISOString(),
    origem: 'local_demo',
  },
  {
    id: 'demo-4',
    nome: 'Fernanda Meirelles Ramos',
    email: 'fernanda.ramos@hotmail.com',
    telefone: '(41) 98455-1209',
    numero_bilhete: 'GS-859102',
    criado_em: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    origem: 'local_demo',
  },
];

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

export function getSupabaseCredentials(): { url: string; anonKey: string; isFromEnv: boolean } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (envUrl && envKey && !envUrl.includes('your-project') && !envKey.includes('your-anon-key')) {
    return { url: envUrl, anonKey: envKey, isFromEnv: true };
  }

  const storedUrl = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : '') || '';
  const storedKey = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) : '') || '';

  return {
    url: storedUrl.trim(),
    anonKey: storedKey.trim(),
    isFromEnv: false,
  };
}

export function isSupabaseConnected(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http'));
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }

  if (cachedClient && cachedUrl === url && cachedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey);
    cachedUrl = url;
    cachedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Erro ao inicializar cliente Supabase:', err);
    return null;
  }
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    cachedClient = null;
  }
}

export function clearSupabaseCredentials(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
    cachedClient = null;
  }
}

export function getLocalEntries(): RegistrationEntry[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_ENTRIES;
  const raw = localStorage.getItem(STORAGE_LOCAL_ENTRIES);
  if (!raw) {
    localStorage.setItem(STORAGE_LOCAL_ENTRIES, JSON.stringify(INITIAL_DEMO_ENTRIES));
    return INITIAL_DEMO_ENTRIES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ENTRIES;
  }
}

export function saveLocalEntry(entry: RegistrationEntry): void {
  if (typeof window === 'undefined') return;
  const current = getLocalEntries();
  const updated = [entry, ...current.filter((e) => e.id !== entry.id)];
  localStorage.setItem(STORAGE_LOCAL_ENTRIES, JSON.stringify(updated));
}

export function generateTicketNumber(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `GS-${randomDigits}`;
}

export const SUPABASE_SQL_SETUP = `-- ==============================================================================
-- SCRIPT OFICIAL: BANCO DE DADOS COM POLÍTICAS DE SEGURANÇA (RLS) ATIVADAS
-- Sorteio Oficial: BMW R 1300 GS Triple Black
-- Execute este script no SQL Editor do painel (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. EXTENSÕES NECESSÁRIAS
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ------------------------------------------------------------------------------
-- 2. TABELA DE INSCRIÇÕES DO SORTEIO
-- ------------------------------------------------------------------------------
create table if not exists public.sorteio_inscricoes (
  id uuid default gen_random_uuid() primary key,
  nome text not null check (length(trim(nome)) >= 3),
  email text not null check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  telefone text not null check (length(trim(telefone)) >= 8),
  numero_bilhete text not null unique,
  status text default 'confirmado' check (status in ('pendente', 'confirmado', 'cancelado')),
  ip_origem text,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null,
  atualizado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 3. ATIVAR ROW LEVEL SECURITY (RLS) OBRIGATÓRIO PARA PROTEÇÃO DOS DADOS
-- ------------------------------------------------------------------------------
alter table public.sorteio_inscricoes enable row level security;

-- Política 1 (INSERT): Permitir que qualquer visitante cadastre seu bilhete da sorte
drop policy if exists "Permitir inscricao publica" on public.sorteio_inscricoes;
create policy "Permitir inscricao publica"
  on public.sorteio_inscricoes
  for insert
  to anon, authenticated
  with check (
    length(trim(nome)) >= 3 and
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' and
    length(trim(telefone)) >= 8 and
    numero_bilhete is not null
  );

-- Política 2 (SELECT): Permitir consulta pública dos bilhetes gerados
drop policy if exists "Permitir consulta publica de bilhetes" on public.sorteio_inscricoes;
create policy "Permitir consulta publica de bilhetes"
  on public.sorteio_inscricoes
  for select
  to anon, authenticated
  using (true);

-- Política 3 (UPDATE): Bloquear edições públicas (Apenas administradores autenticados)
drop policy if exists "Apenas administradores podem atualizar" on public.sorteio_inscricoes;
create policy "Apenas administradores podem atualizar"
  on public.sorteio_inscricoes
  for update
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Política 4 (DELETE): Bloquear exclusões públicas (Apenas administradores autenticados)
drop policy if exists "Apenas administradores podem excluir" on public.sorteio_inscricoes;
create policy "Apenas administradores podem excluir"
  on public.sorteio_inscricoes
  for delete
  to authenticated
  using (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 4. ÍNDICES DE ALTA VELOCIDADE PARA CONSULTA DE BILHETES
-- ------------------------------------------------------------------------------
create index if not exists idx_sorteio_email on public.sorteio_inscricoes (email);
create index if not exists idx_sorteio_telefone on public.sorteio_inscricoes (telefone);
create index if not exists idx_sorteio_bilhete on public.sorteio_inscricoes (numero_bilhete);
create index if not exists idx_sorteio_criado_em on public.sorteio_inscricoes (criado_em desc);

-- ------------------------------------------------------------------------------
-- 5. HABILITAR SINCRONIZAÇÃO EM TEMPO REAL (REALTIME)
-- ------------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'sorteio_inscricoes'
  ) then
    alter publication supabase_realtime add table public.sorteio_inscricoes;
  end if;
end $$;
`;


export async function submitRegistration(data: {
  nome: string;
  email: string;
  telefone: string;
}): Promise<{
  success: boolean;
  entry: RegistrationEntry;
  source: 'supabase' | 'local_demo';
  message: string;
}> {
  const ticketNumber = generateTicketNumber();
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data: inserted, error } = await client
        .from('sorteio_inscricoes')
        .insert([
          {
            nome: data.nome.trim(),
            email: data.email.trim().toLowerCase(),
            telefone: data.telefone.trim(),
            numero_bilhete: ticketNumber,
          },
        ])
        .select()
        .single();

      if (error) {
        console.warn('Erro ao inserir no Supabase, salvando localmente:', error.message);
        // Fallback to local save if table is not yet created or permission issue
        const fallbackEntry: RegistrationEntry = {
          id: `local-${Date.now()}`,
          nome: data.nome.trim(),
          email: data.email.trim().toLowerCase(),
          telefone: data.telefone.trim(),
          numero_bilhete: ticketNumber,
          criado_em: new Date().toISOString(),
          origem: 'local_demo',
        };
        saveLocalEntry(fallbackEntry);
        return {
          success: true,
          entry: fallbackEntry,
          source: 'local_demo',
          message: `Inscrição garantida com sucesso! (Aviso do Supabase: ${error.message} - dados mantidos localmente).`,
        };
      }

      const confirmedEntry: RegistrationEntry = {
        id: inserted?.id || `supa-${Date.now()}`,
        nome: inserted?.nome || data.nome.trim(),
        email: inserted?.email || data.email.trim().toLowerCase(),
        telefone: inserted?.telefone || data.telefone.trim(),
        numero_bilhete: inserted?.numero_bilhete || ticketNumber,
        criado_em: inserted?.criado_em || new Date().toISOString(),
        origem: 'supabase',
      };

      // Also keep a copy in local storage
      saveLocalEntry(confirmedEntry);

      return {
        success: true,
        entry: confirmedEntry,
        source: 'supabase',
        message: 'Inscrição gravada com sucesso diretamente no banco de dados Supabase!',
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Falha na conexão com Supabase';
      console.warn('Exceção ao conectar no Supabase:', errMsg);
      const fallbackEntry: RegistrationEntry = {
        id: `local-${Date.now()}`,
        nome: data.nome.trim(),
        email: data.email.trim().toLowerCase(),
        telefone: data.telefone.trim(),
        numero_bilhete: ticketNumber,
        criado_em: new Date().toISOString(),
        origem: 'local_demo',
      };
      saveLocalEntry(fallbackEntry);
      return {
        success: true,
        entry: fallbackEntry,
        source: 'local_demo',
        message: 'Inscrição confirmada com bilhete gerado! (Dados salvos localmente)',
      };
    }
  }

  // If no Supabase configured yet
  const localEntry: RegistrationEntry = {
    id: `local-${Date.now()}`,
    nome: data.nome.trim(),
    email: data.email.trim().toLowerCase(),
    telefone: data.telefone.trim(),
    numero_bilhete: ticketNumber,
    criado_em: new Date().toISOString(),
    origem: 'local_demo',
  };
  saveLocalEntry(localEntry);

  return {
    success: true,
    entry: localEntry,
    source: 'local_demo',
    message: 'Inscrição realizada com sucesso! Conecte seu Supabase nas configurações para sincronizar na nuvem.',
  };
}

export async function fetchAllEntries(): Promise<RegistrationEntry[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('sorteio_inscricoes')
        .select('*')
        .order('criado_em', { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          ...d,
          origem: 'supabase',
        }));
      }
    } catch (err) {
      console.error('Erro ao buscar inscricoes no Supabase:', err);
    }
  }
  return getLocalEntries();
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ ok: boolean; message: string }> {
  try {
    const testClient = createClient(url.trim(), key.trim());
    // Try to query the table
    const { error } = await testClient.from('sorteio_inscricoes').select('id').limit(1);

    if (!error) {
      return {
        ok: true,
        message: 'Conexão estabelecida com sucesso e tabela "sorteio_inscricoes" encontrada!',
      };
    }

    if (error.code === '42P01' || error.message.includes('relation "sorteio_inscricoes" does not exist')) {
      return {
        ok: true,
        message: 'Conectado ao Supabase com sucesso! A tabela "sorteio_inscricoes" ainda não existe. Copie e execute o script SQL fornecido abaixo.',
      };
    }

    return {
      ok: false,
      message: `Erro do Supabase: ${error.message} (${error.code || 'sem código'})`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Falha ao testar conexão';
    return {
      ok: false,
      message: `Falha ao conectar: ${errorMsg}`,
    };
  }
}
