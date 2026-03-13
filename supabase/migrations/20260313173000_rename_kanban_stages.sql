-- Rename 'TRIAGEM' to 'EM TRIAGEM'
UPDATE kanban_stages 
SET name = 'EM TRIAGEM' 
WHERE name = 'TRIAGEM';

-- Rename 'PENDÊNCIAS' / 'PENDENCIAS' to 'AGUARDANDO RETORNO DO DENTISTA'
UPDATE kanban_stages 
SET name = 'AGUARDANDO RETORNO DO DENTISTA' 
WHERE name IN ('PENDÊNCIAS', 'PENDENCIAS');

-- Update related orders for TRIAGEM
UPDATE orders 
SET kanban_stage = 'EM TRIAGEM' 
WHERE kanban_stage = 'TRIAGEM';

-- Update related orders for PENDENCIAS
UPDATE orders 
SET kanban_stage = 'AGUARDANDO RETORNO DO DENTISTA' 
WHERE kanban_stage IN ('PENDÊNCIAS', 'PENDENCIAS');

-- Update price stages if any exist for TRIAGEM
UPDATE price_stages 
SET kanban_stage = 'EM TRIAGEM' 
WHERE kanban_stage = 'TRIAGEM';

-- Update price stages if any exist for PENDENCIAS
UPDATE price_stages 
SET kanban_stage = 'AGUARDANDO RETORNO DO DENTISTA' 
WHERE kanban_stage IN ('PENDÊNCIAS', 'PENDENCIAS');
