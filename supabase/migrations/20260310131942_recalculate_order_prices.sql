DO $$
DECLARE
    r RECORD;
    b_price NUMERIC;
    p_text TEXT;
    t_count INT;
    a_count INT;
    multiplier INT;
    d_discount NUMERIC;
BEGIN
    FOR r IN SELECT o.id, o.work_type, o.sector, o.tooth_or_arch, o.dentist_id, o.cleared_balance, o.status, o.base_price
             FROM public.orders o LOOP

        -- Get discount
        SELECT commercial_agreement INTO d_discount FROM public.profiles WHERE id = r.dentist_id;
        IF d_discount IS NULL THEN d_discount := 0; END IF;

        -- Get unit price
        SELECT price INTO p_text FROM public.price_list
        WHERE work_type = r.work_type AND (sector = r.sector OR sector IS NULL)
        LIMIT 1;

        IF p_text IS NOT NULL THEN
            p_text := REGEXP_REPLACE(p_text, '[^\d,]', '', 'g');
            p_text := REPLACE(p_text, ',', '.');
            BEGIN
                b_price := CAST(p_text AS NUMERIC);

                -- Apply discount
                IF d_discount > 0 THEN
                    b_price := b_price * (1 - (d_discount / 100));
                END IF;

                -- Calculate multiplier
                t_count := 0;
                a_count := 0;

                IF r.tooth_or_arch IS NOT NULL THEN
                    IF jsonb_typeof(r.tooth_or_arch->'teeth') = 'array' THEN
                        t_count := jsonb_array_length(r.tooth_or_arch->'teeth');
                    END IF;
                    IF jsonb_typeof(r.tooth_or_arch->'arches') = 'array' THEN
                        a_count := jsonb_array_length(r.tooth_or_arch->'arches');
                    END IF;
                END IF;

                multiplier := t_count + a_count;
                IF multiplier < 1 THEN multiplier := 1; END IF;

                -- Final price
                b_price := b_price * multiplier;

                -- Update base_price
                UPDATE public.orders SET base_price = b_price WHERE id = r.id;

                -- Update cleared_balance if it was fully settled based on the old base_price
                IF r.status IN ('completed', 'delivered') THEN
                    IF r.cleared_balance > 0 AND r.cleared_balance >= r.base_price THEN
                       UPDATE public.orders SET cleared_balance = b_price WHERE id = r.id;
                    END IF;
                END IF;

                -- Update expenses amount if order is completed
                IF r.status IN ('completed', 'delivered') THEN
                    UPDATE public.expenses 
                    SET amount = b_price 
                    WHERE order_id = r.id AND status = 'pending';
                END IF;

            EXCEPTION WHEN OTHERS THEN
                -- ignore cast errors
            END;
        END IF;
    END LOOP;
END $$;

