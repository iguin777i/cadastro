-- Habilitar RLS para a tabela jogos
ALTER TABLE public.jogos ENABLE ROW LEVEL SECURITY;

-- Remover política existente se houver
DROP POLICY IF EXISTS jogos_policy ON public.jogos;

-- Criar política para a tabela jogos (permitir todas as operações para usuários autenticados)
CREATE POLICY jogos_policy ON public.jogos
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Habilitar RLS para a tabela usuarios
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Remover política existente se houver
DROP POLICY IF EXISTS usuarios_policy ON public.usuarios;

-- Criar política para a tabela usuarios (permitir todas as operações para usuários autenticados)
CREATE POLICY usuarios_policy ON public.usuarios
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true); 