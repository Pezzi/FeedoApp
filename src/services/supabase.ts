// /src/services/supabase.ts

import { createClient } from '@supabase/supabase-js';

// 1. Lê as credenciais de forma segura das variáveis de ambiente.
//    O `import.meta.env` é a forma como o Vite acede a estas variáveis.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// 2. Validação para garantir que as variáveis foram carregadas.
if (!supabaseUrl || !supabaseKey) {
  throw new Error("As variáveis de ambiente do Supabase não foram definidas. Verifique o seu arquivo .env");
}

// 3. Cria e exporta o cliente Supabase.
export const supabase = createClient(supabaseUrl, supabaseKey);
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_KEY:', import.meta.env.VITE_SUPABASE_KEY);   