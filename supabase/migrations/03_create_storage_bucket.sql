-- Create a public storage bucket for article images
insert into storage.buckets (id, name, public) 
values ('article-images', 'article-images', true);

-- Policy to allow anyone to view images
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'article-images' );

-- Policy to allow uploading images (For demo purposes allowing public, 
-- in production this should be authenticated users only)
create policy "Public Upload" 
on storage.objects for insert 
with check ( bucket_id = 'article-images' );
