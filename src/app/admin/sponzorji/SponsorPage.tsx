'use client'

import React, { useEffect, useState } from 'react'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import axios from 'axios'

type Sponsor = {
  _id: string;
  name: string;
  logoUrl?: string;
  category: 'main' | 'partner' | 'support' | 'bronze';
};

export default function SponsorPage() {

    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchSponsors = async () => {
        setLoading(true);
        try {
        const res = await axios.get('/api/sponsors');
            setSponsors(res.data);
        } catch (error) {
        console.error('Failed to fetch sponsors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsors();
    }, []);

    const handleAddSponsor = async (category: string) => {
    const { value: result } = await Swal.fire({
        title: `Add Sponsor to ${category} Sponsors`,
        confirmButtonColor: '#ef4444',
        html: `
        <div style="display: flex; flex-direction: column; gap: 6px; text-align: left; font-family: sans-serif;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
            <label for="swal-input-name" style="font-size: 13px; color: #444; font-weight: 500;">
                Sponsor Name
            </label>
            <input 
                id="swal-input-name"
                placeholder="Enter sponsor name"
                style="border-radius: 6px; border: 1px solid #ccc; padding: 8px; font-size: 14px; width: 100%; box-sizing: border-box;"
            >
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
            <label for="swal-input-file" style="font-size: 13px; color: #444; font-weight: 500;">
                Sponsor Logo
            </label>
            <input 
                type="file" 
                id="swal-input-file"
                style="border-radius: 6px; border: 1px solid #ccc; padding: 6px; background: #f9f9f9; font-size: 13px; width: 100%; box-sizing: border-box;"
            >
            </div>
        </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        showLoaderOnConfirm: true,      // ✅ show loading spinner on confirm
        preConfirm: async () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement)?.value;
        const fileInput = document.getElementById('swal-input-file') as HTMLInputElement;
        const file = fileInput?.files ? fileInput.files[0] : null;

        if (!name) {
            Swal.showValidationMessage('Please enter a sponsor name');
            return;
        }
        if (category !== 'Support' && !file) {
            Swal.showValidationMessage('Please select a sponsor logo');
            return;
        }

        try {
            const formData = new FormData();
            let imageUrl = '';
            if (category !== 'Support' && file) {
                formData.append('file', file);

                const uploadResponse = await axios.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadResponse.data.url;
            }

            await axios.post('/api/sponsors', {
            name,
            logoUrl: imageUrl,
            category: category.toLowerCase()
            });

            return { name }; // return something on success
        } catch (error) {
            console.error(error);
            Swal.showValidationMessage('Upload or save failed. Please try again.');
        }
        },
        allowOutsideClick: () => !Swal.isLoading(), // prevent closing by clicking outside while loading
    });

    if (result) {
        Swal.fire('Added!', `Sponsor "${result.name}" has been added.`, 'success');
        await fetchSponsors(); // refresh table
    }
    };


    const handleDeleteSponsor = async (sponsorId: string, sponsorName: string) => {
        const result = await Swal.fire({
            title: `Delete "${sponsorName}"?`,
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Yes, delete it!',
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await axios.delete(`/api/sponsors/${sponsorId}`);
                    return true; // ✅ return something to indicate success
                } catch (error) {
                    console.error(error);
                    Swal.showValidationMessage('Delete failed. Please try again.');
                }
            },
            allowOutsideClick: () => !Swal.isLoading(),
        });

        if (result.isConfirmed && result.value) {
            Swal.fire('Deleted!', `"${sponsorName}" has been deleted.`, 'success');
            await fetchSponsors(); // ✅ refresh table
        }
    }


  return (
    <div className="space-y-6">
      {/* Page heading */}
      <h2 className="text-lg font-semibold text-gray-700">Club Sponsors Overview</h2>
      <p className="text-gray-600">
        Manage and view the sponsors that support your club. Below are the three categories of sponsors.
      </p>

      {/* Main Sponsors card */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-gray-800">Main Sponsors</h3>
          <button
            onClick={() => handleAddSponsor('Main')}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md"
          >
            <PlusIcon className="h-4 w-4" />
            Add Sponsor
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Logo</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
        <tbody className="divide-y divide-gray-100">
            {(() => {
                const mainSponsors = sponsors.filter(s => s.category === 'main');
                if (loading) {
                    return (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-gray-400">
                                Loading...
                            </td>
                        </tr>
                    );
                }
                if (mainSponsors.length === 0) {
                    return (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-gray-400">
                                No main sponsors found.
                            </td>
                        </tr>
                    );
                }
                return mainSponsors.map(s => (
                    <tr key={s._id}>
                        <td className="px-4 py-2">
                            <Image src={s.logoUrl || '/placeholder-logo.png'} alt={s.name} width={80} height={80} className="object-contain" />
                        </td>
                        <td className="px-4 py-4 text-black">{s.name}</td>
                        <td className="px-4 py-4 flex gap-2">
                            <button onClick={() => handleDeleteSponsor(s._id, s.name)} className="text-red-500 hover:text-red-700 cursor-pointer"><TrashIcon className="h-5 w-5" /></button>
                        </td>
                    </tr>
                ));
            })()}
        </tbody>
        </table>
      </div>

      {/* Partner Sponsors card */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-gray-800">Silver Sponsors</h3>
          <button
            onClick={() => handleAddSponsor('Partner')}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md"
          >
            <PlusIcon className="h-4 w-4" />
            Add Sponsor
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Logo</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(() => {
                const partnerSponsors = sponsors.filter(s => s.category === 'partner');
                if (loading) {
                    return (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-gray-400">
                                Loading...
                            </td>
                        </tr>
                    );
                }
                if (partnerSponsors.length === 0) {
                    return (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-gray-400">
                                No Silver sponsors found.
                            </td>
                        </tr>
                    );
                }
                return partnerSponsors.map(s => (
                    <tr key={s._id}>
                        <td className="px-4 py-2">
                            <Image src={s.logoUrl || '/placeholder-logo.png'} alt={s.name} width={80} height={80} className="object-contain" />
                        </td>
                        <td className="px-4 py-4 text-black">{s.name}</td>
                        <td className="px-4 py-4 flex gap-2 cursor-pointer">
                            <button onClick={() => handleDeleteSponsor(s._id, s.name)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
                        </td>
                    </tr>
                ));
            })()}
        </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-gray-800">Bronze Sponsors</h3>
          <button
            onClick={() => handleAddSponsor('Bronze')}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md"
          >
            <PlusIcon className="h-4 w-4" />
            Add Sponsor
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Logo</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(() => {
                const bronzeSponsors = sponsors.filter(s => s.category === 'bronze');
                if (loading) {
                    return (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-gray-400">
                                Loading...
                            </td>
                        </tr>
                    );
                }
                if (bronzeSponsors.length === 0) {
                    return (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-gray-400">
                                No Bronze sponsors found.
                            </td>
                        </tr>
                    );
                }
                return bronzeSponsors.map(s => (
                    <tr key={s._id}>
                        <td className="px-4 py-2">
                            <Image src={s.logoUrl || '/placeholder-logo.png'} alt={s.name} width={80} height={80} className="object-contain" />
                        </td>
                        <td className="px-4 py-4 text-black">{s.name}</td>
                        <td className="px-4 py-4 flex gap-2 cursor-pointer">
                            <button onClick={() => handleDeleteSponsor(s._id, s.name)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
                        </td>
                    </tr>
                ));
            })()}
        </tbody>
        </table>
      </div>

      {/* Support Sponsors card */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-gray-800">Support Sponsors</h3>
          <button
            onClick={() => handleAddSponsor('Support')}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md"
          >
            <PlusIcon className="h-4 w-4" />
            Add Sponsor
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(() => {
                const partnerSponsors = sponsors.filter(s => s.category === 'support');
                if (loading) {
                    return (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-gray-400">
                                Loading...
                            </td>
                        </tr>
                    );
                }
                if (partnerSponsors.length === 0) {
                    return (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-gray-400">
                                No support sponsors found.
                            </td>
                        </tr>
                    );
                }
                return partnerSponsors.map(s => (
                    <tr key={s._id}>
                        <td className="px-4 py-4 text-black">{s.name}</td>
                        <td className="px-4 py-4 flex gap-2 cursor-pointer">
                            <button onClick={() => handleDeleteSponsor(s._id, s.name)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
                        </td>
                    </tr>
                ));
            })()}
          </tbody>
        </table>
      </div>
    </div>
  )
}
