'use client'
import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"
import 'sweetalert2/dist/sweetalert2.min.css'

type LestvicaItem = {
  _id: string
  season_start: string
  season_end: string
  image: string
}

const Content = () => {
  const [items, setItems] = useState<LestvicaItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  /* ================= FETCH DATA ================= */
  const fetchLestvica = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/lestvica')
      const data: LestvicaItem[] = await res.json()
      setItems(data)
    } catch (err) {
      console.error('❌ Failed to fetch lestvica:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLestvica()
  }, [])

  /* ================= ADD MODAL (UNCHANGED) ================= */
  const handleAddTekme = async () => {
    const currentYear = new Date().getFullYear()

    const { value } = await Swal.fire({
      title: 'Add Season Statistics',
      width: 600,
      background: '#f9fafb',
      html: `
        <div style="text-align:left">
          <label style="font-weight:600; color:#374151;">Season</label>
          <div style="display:flex; gap:12px; margin-top:6px;">
            <select id="season-start" class="swal2-input" style="flex:1;">
              ${Array.from({ length: 8 }, (_, i) => `<option value="${currentYear + i}">${currentYear + i}</option>`).join('')}
            </select>
            <select id="season-end" class="swal2-input" style="flex:1;">
              ${Array.from({ length: 8 }, (_, i) => `<option value="${currentYear + i + 1}">${currentYear + i + 1}</option>`).join('')}
            </select>
          </div>

          <label style="font-weight:600; color:#374151; margin-top:18px; display:block;">
            Season Stats Image
          </label>

          <div id="upload-box"
            style="margin-top:8px;border:2px dashed #d1d5db;border-radius:14px;
            padding:22px;text-align:center;cursor:pointer;background:#ffffff;">
            <p style="color:#6b7280;font-size:14px;margin:0;">
              Click to upload or drag & drop<br/>
              <span style="font-size:12px;">PNG, JPG, WEBP</span>
            </p>
            <input id="season-image" type="file" accept="image/*" hidden />
          </div>

          <img id="image-preview"
            style="display:none;width:100%;margin-top:14px;border-radius:14px;
            box-shadow:0 12px 30px rgba(0,0,0,0.12);" />
        </div>
      `,
      didOpen: () => {
        const uploadBox = document.getElementById('upload-box')!
        const fileInput = document.getElementById('season-image') as HTMLInputElement
        const preview = document.getElementById('image-preview') as HTMLImageElement

        uploadBox.onclick = () => fileInput.click()
        fileInput.onchange = () => {
          const file = fileInput.files?.[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = e => {
            preview.src = e.target?.result as string
            preview.style.display = 'block'
          }
          reader.readAsDataURL(file)
        }
      },
      preConfirm: () => {
        const start = (document.getElementById('season-start') as HTMLSelectElement).value
        const end = (document.getElementById('season-end') as HTMLSelectElement).value
        const file = (document.getElementById('season-image') as HTMLInputElement).files?.[0]

        if (Number(end) !== Number(start) + 1) {
          Swal.showValidationMessage('Season must be consecutive years')
          return
        }
        if (!file) {
          Swal.showValidationMessage('Please upload an image')
          return
        }
        return { season: `${start}-${end}`, imageFile: file }
      },
      showCancelButton: true,
      confirmButtonText: 'Save Season',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'px-6 py-2 rounded-lg bg-red-600 text-white font-semibold',
        cancelButton: 'px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold',
        actions: 'flex justify-end gap-3 mt-6',
        popup: 'rounded-2xl shadow-xl'
      }
    })

    if (!value) return

    try {
      const formData = new FormData()
      formData.append('season', value.season)
      formData.append('image', value.imageFile)

      const res = await fetch('/api/lestvica', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }

      await fetchLestvica()

      Swal.fire('Saved!', 'Season added successfully.', 'success')
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Failed to save season', 'error')
    }
  }

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Delete this season?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete',
    })

    if (!confirm.isConfirmed) return

    await fetch(`/api/lestvica?id=${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i._id !== id))

    Swal.fire('Deleted!', 'Season removed.', 'success')
  }

  /* ================= UI ================= */
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Lestvica Page! 👋</h1>
        <p className="text-gray-600 mt-1">Manage season statistics.</p>
      </div>

      <div className="flex items-center justify-between mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">Lestvica</h2>
        <button
          onClick={handleAddTekme}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
        >
          Add Season Stats
        </button>
      </div>

      {/* LIST */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p>Loading...</p>}
        {!loading && items.length === 0 && (
          <p className="text-gray-500">No seasons added yet.</p>
        )}

        {items.map(item => (
          <div key={item._id} className="bg-white rounded-xl shadow border overflow-hidden">
            <img src={item.image} className="w-full h-48 object-cover" />
            <div className="p-4 flex items-center justify-between">
              <span className="font-semibold">
                {item.season_start} – {item.season_end}
              </span>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Content
