-- Adicionar índices em colunas utilizadas frequentemente para filtros ou agrupamentos

-- Index em profiles(role) para agilizar consultas que filtram dentistas ou laboratórios
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles USING btree (role);

-- Index conjunto em profiles(is_active, is_approved) para acelerar a busca de usuários liberados para operar
CREATE INDEX IF NOT EXISTS idx_profiles_active_approved ON public.profiles USING btree (is_active, is_approved);

-- Index em orders(dentist_id) para acelerar o agrupamento de pedidos por dentista (Dashboard, Faturamento, etc.)
CREATE INDEX IF NOT EXISTS idx_orders_dentist_id ON public.orders USING btree (dentist_id);

-- Index em orders(status) e orders(kanban_stage) para melhorar os cálculos de Kanban e KPIs baseados em status
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders USING btree (status);
CREATE INDEX IF NOT EXISTS idx_orders_kanban_stage ON public.orders USING btree (kanban_stage);

-- Index em expenses(status, due_date) para relatórios financeiros que filtram pagamentos pendentes/vencidos
CREATE INDEX IF NOT EXISTS idx_expenses_status_due_date ON public.expenses USING btree (status, due_date);
