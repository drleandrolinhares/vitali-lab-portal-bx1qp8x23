ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS base_price NUMERIC NOT NULL DEFAULT 0;

DO $$
DECLARE
    r RECORD;
    b_price NUMERIC;
    p_text TEXT;
BEGIN
    FOR r IN SELECT id, work_type, sector FROM public.orders WHERE base_price = 0 LOOP
        SELECT price INTO p_text FROM public.price_list 
        WHERE work_type = r.work_type AND (sector = r.sector OR sector IS NULL) 
        LIMIT 1;
        
        IF p_text IS NOT NULL THEN
            p_text := REGEXP_REPLACE(p_text, '[^\d,]', '', 'g'); 
            p_text := REPLACE(p_text, ',', '.');
            BEGIN
                b_price := CAST(p_text AS NUMERIC);
                UPDATE public.orders SET base_price = b_price WHERE id = r.id;
            EXCEPTION WHEN OTHERS THEN
                -- ignore
            END;
        END IF;
    END LOOP;
END $$;
