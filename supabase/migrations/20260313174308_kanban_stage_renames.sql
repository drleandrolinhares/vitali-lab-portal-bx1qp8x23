-- Rename to 'EM TRIAGEM'
UPDATE kanban_stages 
SET name = 'EM TRIAGEM' 
WHERE name = 'TRIAGEM';

-- Rename to 'PENDÊNCIAS'
UPDATE kanban_stages 
SET name = 'PENDÊNCIAS' 
WHERE name IN ('PENDENCIAS', 'AGUARDANDO RETORNO DO DENTISTA');

-- Update related orders
UPDATE orders 
SET kanban_stage = 'EM TRIAGEM' 
WHERE kanban_stage = 'TRIAGEM';

UPDATE orders 
SET kanban_stage = 'PENDÊNCIAS' 
WHERE kanban_stage IN ('PENDENCIAS', 'AGUARDANDO RETORNO DO DENTISTA');

-- Update price stages if any exist
UPDATE price_stages 
SET kanban_stage = 'EM TRIAGEM' 
WHERE kanban_stage = 'TRIAGEM';

UPDATE price_stages 
SET kanban_stage = 'PENDÊNCIAS' 
WHERE kanban_stage IN ('PENDENCIAS', 'AGUARDANDO RETORNO DO DENTISTA');
