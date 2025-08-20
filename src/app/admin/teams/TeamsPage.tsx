'use client'

import React, { useEffect, useState } from 'react'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import axios from 'axios'

type Team = {
  _id: string;
  firstName: string;
  lastName: string;
  number: number;
  img?: string;
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward' | 'coach' | 'staff';
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/teams');
      setTeams(res.data);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAddTeam = async (category: string) => {
    const { value: result } = await Swal.fire({
      title: `Add Team Member to ${category} category`,
      confirmButtonColor: '#ef4444',
      html: `
        <div style="display: flex; flex-direction: column; gap: 6px; text-align: left; font-family: sans-serif;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label for="swal-input-firstname" style="font-size: 13px; color: #444; font-weight: 500;">
              First Name
            </label>
            <input 
              id="swal-input-firstname"
              placeholder="Enter First Name"
              style="border-radius: 6px; border: 1px solid #ccc; padding: 8px; font-size: 14px; width: 100%; box-sizing: border-box;"
            >
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label for="swal-input-lastname" style="font-size: 13px; color: #444; font-weight: 500;">
              Last Name
            </label>
            <input 
              id="swal-input-lastname"
              placeholder="Enter Last Name"
              style="border-radius: 6px; border: 1px solid #ccc; padding: 8px; font-size: 14px; width: 100%; box-sizing: border-box;"
            >
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label for="swal-input-number" style="font-size: 13px; color: #444; font-weight: 500;">
              Number
            </label>
            <input 
              id="swal-input-number"
              type="number"
              placeholder="Enter Number"
              style="border-radius: 6px; border: 1px solid #ccc; padding: 8px; font-size: 14px; width: 100%; box-sizing: border-box;"
            >
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <label for="swal-input-file" style="font-size: 13px; color: #444; font-weight: 500;">
              Image
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
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const firstName = (document.getElementById('swal-input-firstname') as HTMLInputElement)?.value;
        const lastName = (document.getElementById('swal-input-lastname') as HTMLInputElement)?.value;
        const number = (document.getElementById('swal-input-number') as HTMLInputElement)?.value;
        const fileInput = document.getElementById('swal-input-file') as HTMLInputElement;
        const file = fileInput?.files ? fileInput.files[0] : null;

        if (!firstName) {
          Swal.showValidationMessage('Please enter a first name');
          return;
        }
        if (!lastName) {
          Swal.showValidationMessage('Please enter a last name');
          return;
        }
        if (!number) {
          Swal.showValidationMessage('Please enter a number');
          return;
        }
        if (!file) {
          Swal.showValidationMessage('Please select an image');
          return;
        }

        try {
          const formData = new FormData();
          formData.append('file', file);

          const uploadResponse = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          const imageUrl = uploadResponse.data.url;

          await axios.post('/api/teams', {
            firstName,
            lastName,
            number,
            img: imageUrl,
            position: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
          });

          return { name: `${firstName} ${lastName}` };
        } catch (error) {
          console.error(error);
          Swal.showValidationMessage('Upload or save failed. Please try again.');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result) {
      Swal.fire('Added!', `Team "${result.name}" has been added.`, 'success');
      await fetchTeams();
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    const result = await Swal.fire({
      title: `Delete "${teamName}"?`,
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await axios.delete(`/api/teams/${teamId}`);
          return true;
        } catch (error) {
          console.error(error);
          Swal.showValidationMessage('Delete failed. Please try again.');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed && result.value) {
      Swal.fire('Deleted!', `"${teamName}" has been deleted.`, 'success');
      await fetchTeams();
    }
  }

  const categories = [
    { label: 'Goal Keeper', key: 'goalkeeper' },
    { label: 'Defenders', key: 'defender' },
    { label: 'Midfields', key: 'midfielder' },
    { label: 'Forwards', key: 'forward' },
    { label: 'Coach', key: 'coach' },
    { label: 'Staff', key: 'staff' },
  ];

  const handleAddOldSeasonTeam = async () => {
    const { value: result } = await Swal.fire({
      title: 'Add Old Season Team',
      confirmButtonColor: '#ef4444',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      html: `
      <div style="display: flex; flex-direction: column; gap: 10px; text-align: left; font-family: sans-serif;">
        <div style="display: flex; flex-direction: column; gap: 4px;">
        <label for="swal-input-season" style="font-size: 13px; color: #444; font-weight: 500;">
          Season
        </label>
        <input 
          id="swal-input-season"
          placeholder="e.g. 2022/2023"
          style="border-radius: 6px; border: 1px solid #ccc; padding: 8px; font-size: 14px; width: 100%; box-sizing: border-box;"
        >
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
        <label for="swal-input-file" style="font-size: 13px; color: #444; font-weight: 500;">
          Team Image
        </label>
        <input 
          type="file" 
          id="swal-input-file"
          accept="image/*"
          style="border-radius: 6px; border: 1px solid #ccc; padding: 6px; background: #f9f9f9; font-size: 13px; width: 100%; box-sizing: border-box;"
        >
        </div>
      </div>
      `,
      focusConfirm: false,
      preConfirm: async () => {
      const season = (document.getElementById('swal-input-season') as HTMLInputElement)?.value;
      const fileInput = document.getElementById('swal-input-file') as HTMLInputElement;
      const file = fileInput?.files ? fileInput.files[0] : null;

      if (!season) {
        Swal.showValidationMessage('Please enter a season');
        return;
      }
      if (!file) {
        Swal.showValidationMessage('Please select an image');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
        });

        return { img: uploadResponse.data.url, season };
      } catch (error) {
        Swal.showValidationMessage('Upload failed. Please try again.');
        console.error('Upload error:', error);
      }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (!result) return;

    await axios.post('/api/old-team', { image: result.img, season: result.season });
    Swal.fire('Added!', `Old season team for "${result.season}" has been added.`, 'success');

  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-700">Team Management</h2>
      <p className="text-gray-600">
        Manage and organize your teams by their respective roles in the club.
      </p>

      <div className='w-full flex gap-2'>
        <button onClick={handleAddOldSeasonTeam} className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded'>
          Add Old Season Team
        </button>
        <button className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded'>
          View Old Season Teams
        </button>
      </div>

      {categories.map(cat => {
        const filteredTeams = teams.filter(t => t.position.toLowerCase() === cat.key);

        return (
          <div key={cat.key} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-gray-800">{cat.label}</h3>
              <button
                onClick={() => handleAddTeam(cat.key)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md"
              >
                <PlusIcon className="h-4 w-4" />
                Add {cat.label}
              </button>
            </div>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Logo</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Number</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-400">
                      No {cat.label.toLowerCase()} found.
                    </td>
                  </tr>
                ) : (
                  filteredTeams.map(t => (
                    <tr key={t._id}>
                      <td className="px-4 py-2">
                        <Image
                          src={t.img || '/placeholder-logo.png'}
                          alt={t.firstName + ' ' + t.lastName}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </td>
                      <td className="px-4 py-4 text-black">{t.firstName + ' ' + t.lastName}</td>
                      <td className="px-4 py-4 text-black">{t.number}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center h-full">
                          <button
                            onClick={() => handleDeleteTeam(t._id, t.firstName + ' ' + t.lastName)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
