-- Banksman sales chat leads → DM4U-CRM: CHECK (read-only, changes nothing).
-- Run in the DM4U-CRM project's SQL Editor before sales_leads_apply.sql and again after it.
-- Before: "sales_leads table" says missing. After: every row says ok.
select 'sales_leads table' as item,
       case when to_regclass('public.sales_leads') is null then 'missing' else 'there' end as now,
       'there' as after_apply,
       case when to_regclass('public.sales_leads') is null then 'not applied yet' else 'ok' end as status
union all
select 'row security on, no public access',
       case when to_regclass('public.sales_leads') is null then 'missing'
            when (select relrowsecurity from pg_class where oid = to_regclass('public.sales_leads'))
                 and not has_table_privilege('anon', 'public.sales_leads', 'select')
                 and not has_table_privilege('authenticated', 'public.sales_leads', 'select') then 'yes' else 'no' end,
       'yes',
       case when to_regclass('public.sales_leads') is null then 'not applied yet'
            when (select relrowsecurity from pg_class where oid = to_regclass('public.sales_leads'))
                 and not has_table_privilege('anon', 'public.sales_leads', 'select')
                 and not has_table_privilege('authenticated', 'public.sales_leads', 'select') then 'ok' else 'PROBLEM: tell Claude' end
union all
select 'leads so far (info)',
       case when to_regclass('public.sales_leads') is null then '0'
            else (xpath('/row/n/text()', query_to_xml('select count(*) as n from public.sales_leads', false, true, '')))[1]::text end,
       '', '';
