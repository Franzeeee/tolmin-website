'use client'

import React, { useEffect, useState } from 'react'
import { TrashIcon, PlusIcon, PencilIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import axios from 'axios'
import { getSponsorCategories, sponsorHasCategory, CATEGORY_LABELS, type SponsorCategory } from '@/util/sponsorCategories'

type Sponsor = {
  _id: string;
  name: string;
  logoUrl?: string;
  category?: string;
  categories?: string[];
};

const ALL_CATEGORIES: SponsorCategory[] = ['main', 'gold', 'silver', 'bronze', 'transporter', 'support']

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

    const handleAddSponsor = async (
        sectionLabel: string,
        categoryOptions: { value: SponsorCategory; label: string }[],
        requiresLogo: boolean
    ) => {
    const { value: result } = await Swal.fire({
        title: `Add Sponsor to ${sectionLabel}`,
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
            ${categoryOptions.length > 1 ? `
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <label style="font-size: 13px; color: #444; font-weight: 500;">Tier(s)</label>
              <div style="display:flex; flex-direction:column; gap:4px;">
                ${categoryOptions.map(opt => `
                  <label style="display:flex; align-items:center; gap:6px; font-size:14px; font-weight:normal;">
                    <input type="checkbox" class="swal-category-checkbox" value="${opt.value}"> ${opt.label}
                  </label>
                `).join('')}
              </div>
            </div>
            ` : ''}
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
        if (requiresLogo && !file) {
            Swal.showValidationMessage('Please select a sponsor logo');
            return;
        }

        let categories: SponsorCategory[];
        if (categoryOptions.length > 1) {
            const checked = Array.from(
                document.querySelectorAll('.swal-category-checkbox:checked')
            ) as HTMLInputElement[];
            categories = checked.map(c => c.value as SponsorCategory);
            if (categories.length === 0) {
                Swal.showValidationMessage('Select at least one tier');
                return;
            }
        } else {
            categories = [categoryOptions[0].value];
        }

        try {
            const formData = new FormData();
            let imageUrl = '';
            if (requiresLogo && file) {
                formData.append('file', file);

                const uploadResponse = await axios.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadResponse.data.url;
            }

            await axios.post('/api/sponsors', {
            name,
            logoUrl: imageUrl,
            categories
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

    const handleEditCategories = async (sponsor: Sponsor) => {
        const current = getSponsorCategories(sponsor);

        const { value: selected } = await Swal.fire({
            title: `Edit tiers for "${sponsor.name}"`,
            confirmButtonColor: '#ef4444',
            html: `
              <div style="display:flex; flex-direction:column; gap:4px; text-align:left; font-family:sans-serif;">
                ${ALL_CATEGORIES.map(cat => `
                  <label style="display:flex; align-items:center; gap:6px; font-size:14px;">
                    <input type="checkbox" class="swal-edit-category-checkbox" value="${cat}" ${current.includes(cat) ? 'checked' : ''}> ${CATEGORY_LABELS[cat]}
                  </label>
                `).join('')}
              </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const checked = Array.from(
                    document.querySelectorAll('.swal-edit-category-checkbox:checked')
                ) as HTMLInputElement[];
                const categories = checked.map(c => c.value);
                if (categories.length === 0) {
                    Swal.showValidationMessage('Select at least one tier');
                    return;
                }
                return categories;
            },
        });

        if (!selected) return;

        try {
            await axios.put(`/api/sponsors/${sponsor._id}`, { categories: selected });
            Swal.fire({ icon: 'success', title: 'Updated!', showConfirmButton: false, timer: 1200 });
            await fetchSponsors();
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Update failed', showConfirmButton: false, timer: 1500 });
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

    const renderLogoSection = (
        title: string,
        categories: SponsorCategory[],
        addSectionLabel: string,
        addCategoryOptions: { value: SponsorCategory; label: string }[]
    ) => {
        const list = sponsors.filter(s => categories.some(c => sponsorHasCategory(s, c)));
        return (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-md font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={() => handleAddSponsor(addSectionLabel, addCategoryOptions, true)}
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
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Tiers</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-4 text-center text-gray-400">Loading...</td>
                            </tr>
                        ) : list.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-4 text-center text-gray-400">No sponsors found.</td>
                            </tr>
                        ) : (
                            list.map(s => (
                                <tr key={s._id}>
                                    <td className="px-4 py-2">
                                        <Image src={s.logoUrl || '/placeholder-logo.png'} alt={s.name} width={80} height={80} className="object-contain" />
                                    </td>
                                    <td className="px-4 py-4 text-black">{s.name}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {getSponsorCategories(s).map(c => (
                                                <span key={c} className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700">
                                                    {CATEGORY_LABELS[c]}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 flex gap-3">
                                        <button onClick={() => handleEditCategories(s)} className="text-blue-600 hover:text-blue-800 cursor-pointer"><PencilIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleDeleteSponsor(s._id, s.name)} className="text-red-500 hover:text-red-700 cursor-pointer"><TrashIcon className="h-5 w-5" /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    };


  return (
    <div className="space-y-6">
      {/* Page heading */}
      <h2 className="text-lg font-semibold text-gray-700">Club Sponsors Overview</h2>
      <p className="text-gray-600">
        Manage and view the sponsors that support your club. A sponsor can belong to more than one tier (e.g. Main &amp; Gold).
      </p>

      {renderLogoSection('Main & Gold Sponsors', ['main', 'gold'], 'Main & Gold Sponsors', [
        { value: 'main', label: 'Glavni (Main)' },
        { value: 'gold', label: 'Zlati (Gold)' },
      ])}

      {renderLogoSection('Silver Sponsors', ['silver'], 'Silver Sponsors', [
        { value: 'silver', label: 'Srebrni (Silver)' },
      ])}

      {renderLogoSection('Bronze Sponsors', ['bronze'], 'Bronze Sponsors', [
        { value: 'bronze', label: 'Bronasti (Bronze)' },
      ])}

      {renderLogoSection('Uradni prevoznik kluba', ['transporter'], 'Uradni prevoznik kluba', [
        { value: 'transporter', label: 'Uradni prevoznik kluba' },
      ])}

      {/* Support Sponsors card */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-gray-800">Support Sponsors</h3>
          <button
            onClick={() => handleAddSponsor('Support Sponsors', [{ value: 'support', label: 'Support' }], false)}
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
                const supportSponsors = sponsors.filter(s => sponsorHasCategory(s, 'support'));
                if (loading) {
                    return (
                        <tr>
                            <td colSpan={2} className="px-4 py-4 text-center text-gray-400">
                                Loading...
                            </td>
                        </tr>
                    );
                }
                if (supportSponsors.length === 0) {
                    return (
                        <tr>
                            <td colSpan={2} className="px-4 py-4 text-center text-gray-400">
                                No support sponsors found.
                            </td>
                        </tr>
                    );
                }
                return supportSponsors.map(s => (
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
