'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import Swal from 'sweetalert2';

// type PageProps = {
//   name: string;
//   content: string;
//   img: string;
// };

const Editor = dynamic(() =>
  import('@tinymce/tinymce-react').then(mod => mod.Editor),
  { ssr: false }
);

export default function Content() {
  const id = '6884cbedf71ec698fd833eb9'; // Your football school document ID
//   const [data, setData] = useState<PageProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [preview, setPreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [coach, setCoach] = useState<{
    name: string;
    phone: string;
    email: string;
  }>({
    name: '',
    phone: '',
    email: '',
  });

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

  // Fetch existing data on load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/football-school/${id}`);
        const item = res.data;
        if (item.img) setPreview(item.img);
        if (item.content) setEditorContent(item.content);
        if (item.coaches && item.coaches.length > 0) {
          setCoach({
            name: item.coaches[0].name || '',
            phone: item.coaches[0].phone || '',
            email: item.coaches[0].email || '',
          });
        }
      } catch (error) {
        console.error('Error fetching football school data:', error);
        setError('Failed to fetch football school data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      await axios.put(`/api/football-school/${id}`, {
        img: uploadedUrl,
        content: editorContent,
        coaches: [coach],
      });

      Swal.fire({
        icon: 'success',
        title: 'Successfully updated!',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error('Failed to update:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update failed.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };


  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-700">Mladinske Ekipe - U19</h2>
      <p className="text-gray-600">
        This section is dedicated to the management and organization of the coaching staff and leadership of the NŠ Hidria Tolmin football club.
      </p>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-6">
          {/* Image Upload Card */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-black">Upload Header Image</h2>
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
                'link',
                'advlist autolink lists image charmap preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table code help wordcount',
                'textcolor', 'hr',
                ],
                toolbar:
                'undo redo | formatselect fontsize | bold italic underline forecolor backcolor | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | link unlink hr | removeformat | preview fullscreen',
                fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
                link_title: true,
                default_link_target: '_blank',
                target_list: [
                { title: 'New tab', value: '_blank' },
                { title: 'Same tab', value: '_self' },
                ],
                link_context_toolbar: true,
                link_assume_external_targets: true,
                link_default_protocol: 'https',
            }}
        />
<h1 className='text-xl text-red-600 font-bold lg:mt-6'>Coach Information:</h1>

        <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={coach.name}
              onChange={(e) => setCoach({ ...coach, name: e.target.value })}
              className="mt-1 w-full rounded-sm p-2 px-3 text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter name"
            />
          </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input
            type="text"
            value={coach.phone}
              onChange={(e) => setCoach({ ...coach, phone: e.target.value })}
              className="mt-1 w-full rounded-sm p-2 px-3 text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter contact number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={coach.email}
              placeholder="Enter email address"
              onChange={(e) => setCoach({ ...coach, email: e.target.value })}
              className="mt-1 w-full rounded-sm p-2 text-black px-3 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
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
      )}
    </div>
  );
}
