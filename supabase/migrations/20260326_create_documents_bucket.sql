-- Create a public storage bucket for documents (PDFs, banners, etc.)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Policy to allow anyone to view documents
create policy "Public Access Documents"
on storage.objects for select
using ( bucket_id = 'documents' );

-- Policy to allow uploading documents
create policy "Public Upload Documents"
on storage.objects for insert
with check ( bucket_id = 'documents' );

-- Policy to allow updating documents
create policy "Public Update Documents"
on storage.objects for update
using ( bucket_id = 'documents' );

-- Policy to allow deleting documents
create policy "Public Delete Documents"
on storage.objects for delete
using ( bucket_id = 'documents' );
