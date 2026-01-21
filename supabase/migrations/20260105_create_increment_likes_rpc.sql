-- Create RPC function to increment likes safely
create or replace function increment_likes(row_id bigint)
returns void as $$
begin
  update public.articles
  set likes = coalesce(likes, 0) + 1
  where id = row_id;
end;
$$ language plpgsql;
