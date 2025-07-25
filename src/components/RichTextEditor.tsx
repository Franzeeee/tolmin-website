// src/components/TinyEditor.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically load TinyMCE to avoid SSR issues
const Editor = dynamic(() =>
  import('@tinymce/tinymce-react').then(mod => mod.Editor),
  { ssr: false }
);

export default function TinyEditor({
  content,
  onEditorChange,
}: {
  content: string;
  onEditorChange: (newContent: string) => void;
}) {
return (
    <Editor
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
        value={content}
        init={{
            height: 300,
            menubar: false,
            toolbar: 'undo redo | bold italic underline | bullist numlist | code',
        }}
        onEditorChange={(newContent) => onEditorChange(newContent)}
    />
);
}
