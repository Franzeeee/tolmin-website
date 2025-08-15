'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'next/navigation';


const Editor = dynamic(() =>
  import('@tinymce/tinymce-react').then(mod => mod.Editor),
  { ssr: false }
);

export default function Content() {
  const { id } = useParams();

  const [editorContent, setEditorContent] = useState('');
  const [preview, setPreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [description, setDescription] = useState('');


useEffect(() => {
  if (!id) return;

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/api/news/${id}`);
      setEditorContent(data.content || '');
      setPreview(data.image || '');
      setNewsTitle(data.title || '');
      setDescription(data.description || '');
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
  };

  fetchData();
}, [id]);


  // Handle image input and preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadedImage(file ?? null);
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Save updated image and content
  const handleSave = async () => {
    if (!imageFile && !editorContent) {
      Swal.fire({
        icon: 'info',
        title: 'No changes made',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      let uploadedUrl = preview;
      if (uploadedImage) {
        const formData = new FormData();
        formData.append('file', uploadedImage);

        const { data: uploadData } = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        uploadedUrl = uploadData.url;
      }

      await axios.put(`/api/news/${id}`, {
        title: newsTitle,
        image: uploadedUrl,
        content: editorContent,
        description: description,
      });

      Swal.fire({
        icon: 'success',
        title: 'Successfully updated!',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = '/admin/news';
      });
    } catch (err) {
      console.error('Failed to create:', err);
      Swal.fire({
        icon: 'error',
        title: 'News creation failed.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="space-y-6">
      <a href="/admin/news" className='text-red-600'><FontAwesomeIcon icon={faArrowLeft} /> Go to News Overviews</a>
      <h2 className="text-lg font-semibold text-gray-700 mt-3">Novica - Posodobi - <span className='text-red-600'>{newsTitle}</span></h2>
      <p className="text-gray-600">
        Uporabite ta obrazec za posodobitev in objavo nove novice za Tolmin.
      </p>

        <div className="space-y-6">
          {/* Image Upload Card */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-black">Upload News Cover Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0 file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
              <Image
                width={400}
                height={300}
                src={preview}
                alt="Image Preview"
                className="mt-4 rounded-lg shadow-md max-w-full h-auto"
              />
            )}
        </div>

        <div className="space-y-6">
          {/* News Title Card */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-black">News Title</h2>
            <input
              type="text"
              value={newsTitle}
              onChange={(e) => {
          if (e.target.value.length <= 100) setNewsTitle(e.target.value);
              }}
              maxLength={100}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2"
              placeholder="Enter news title"
            />
            <div className="text-xs text-gray-500 text-right">
              {newsTitle.length}/100 characters
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* News Description Card */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-black">News Description</h2>
            <input
              type="text"
              value={description}
              onChange={(e) => {
          if (e.target.value.length <= 200) setDescription(e.target.value);
              }}
              maxLength={200}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2"
              placeholder="Enter news description"
            />
            <div className="text-xs text-gray-500 text-right">
              {description.length}/200 characters
            </div>
          </div>
        </div>

          {/* TinyMCE Editor Card */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-black">Content Editor</h2>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
              value={editorContent}
              onEditorChange={(content) => setEditorContent(content)}
              init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount', 'hr'
              ],
              toolbar:
                'undo redo | formatselect fontsize | bold italic underline forecolor backcolor | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | link unlink hr | removeformat | preview fullscreen | image',
              fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
              link_title: true,
              default_link_target: '_blank',
              target_list: [
                { title: 'New tab', value: '_blank' },
                { title: 'Same tab', value: '_self' },
              ],
              image_list: [
                { title: 'My image 1', value: 'https://www.example.com/my1.gif' },
                { title: 'My image 2', value: 'http://www.moxiecode.com/my2.gif' }
              ],
              link_context_toolbar: true,
              link_assume_external_targets: true,
              link_default_protocol: 'https',
              image_caption: true,
              image_title: true,
              automatic_uploads: true,
              file_picker_types: 'image',
              file_picker_callback: (callback, value, meta) => {
                if (meta.filetype === 'image') {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.onchange = async function (event: Event) {
                  const target = event.target as HTMLInputElement;
                  if (!target.files || !target.files[0]) return;
                  const file = target.files[0];
                  const formData = new FormData();
                  formData.append('file', file);

                  try {
                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });
                  const data = await res.json();
                  callback(data.url, { title: file.name });
                  } catch (err) {
                  alert('Image upload failed');
                  console.error('Image upload error:', err);
                  }
                };
                input.click();
                }
              },
              }}
            />

          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
    </div>
  );
}
