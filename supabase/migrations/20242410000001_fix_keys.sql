-- Function to delete a storage object
CREATE OR REPLACE FUNCTION delete_storage_object(bucket TEXT, object TEXT, OUT status INT, OUT content TEXT)
RETURNS RECORD
LANGUAGE 'plpgsql'
SECURITY DEFINER
AS $$
DECLARE
  project_url TEXT := 'https://kicsfuyqjoefevzxxitr.supabase.co';
  service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpY3NmdXlxam9lZmV2enh4aXRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTc4NjM3MSwiZXhwIjoyMDQ1MzYyMzcxfQ.N1Rw7FD3kYCH7NcP1zOCllhMszOk65-rP5KPL10YYVE'; -- full access needed for http request to storage
  url TEXT := project_url || '/storage/v1/object/' || bucket || '/' || object;
BEGIN
  SELECT
      INTO status, content
           result.status::INT, result.content::TEXT
      FROM extensions.http((
    'DELETE',
    url,
    ARRAY[extensions.http_header('authorization','Bearer ' || service_role_key)],
    NULL,
    NULL)::extensions.http_request) AS result;
END;
$$;
