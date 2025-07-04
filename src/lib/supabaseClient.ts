import { createClient } from '@supabase/supabase-js';

// Pega as variáveis de ambiente do arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Cria e exporta o cliente Supabase para ser usado em todo o aplicativo.
// Esta é a única vez que você precisará fazer isso no seu projeto.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);