export interface RegistrationEntry {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  numero_bilhete: string;
  criado_em: string;
  origem?: 'supabase' | 'local_demo';
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}
