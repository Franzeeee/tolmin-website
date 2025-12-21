'use client'
import React from "react"
import Swal from "sweetalert2"
import 'sweetalert2/dist/sweetalert2.min.css'

const Content = () => {
  const handleAddTekme = async () => {
    const currentYear = new Date().getFullYear()

    const { value } = await Swal.fire({
      title: 'Add Season Statistics',
      width: 600,
      background: '#f9fafb',
      html: `
        <div style="text-align:left">

          <!-- Season -->
          <label style="font-weight:600; color:#374151;">Season</label>
          <div style="display:flex; gap:12px; margin-top:6px;">
            <select id="season-start" class="swal2-input" style="flex:1;">
              ${Array.from({ length: 8 }, (_, i) => {
                const y = currentYear + i
                return `<option value="${y}">${y}</option>`
              }).join('')}
            </select>

            <select id="season-end" class="swal2-input" style="flex:1;">
              ${Array.from({ length: 8 }, (_, i) => {
                const y = currentYear + i + 1
                return `<option value="${y}">${y}</option>`
              }).join('')}
            </select>
          </div>

          <!-- Upload -->
          <label style="font-weight:600; color:#374151; margin-top:18px; display:block;">
            Season Stats Image
          </label>

          <div 
            id="upload-box"
            style="
              margin-top:8px;
              border:2px dashed #d1d5db;
              border-radius:14px;
              padding:22px;
              text-align:center;
              cursor:pointer;
              background:#ffffff;
              transition:border-color .2s;
            "
          >
            <p style="color:#6b7280; font-size:14px; margin:0;">
              Click to upload or drag & drop<br/>
              <span style="font-size:12px;">PNG, JPG, WEBP</span>
            </p>
            <input id="season-image" type="file" accept="image/*" hidden />
          </div>

          <img 
            id="image-preview"
            style="
              display:none;
              width:100%;
              margin-top:14px;
              border-radius:14px;
              box-shadow:0 12px 30px rgba(0,0,0,0.12);
            "
          />
        </div>
      `,
      didOpen: () => {
        const uploadBox = document.getElementById('upload-box') as HTMLElement
        const fileInput = document.getElementById('season-image') as HTMLInputElement
        const preview = document.getElementById('image-preview') as HTMLImageElement

        uploadBox.onclick = () => fileInput.click()

        uploadBox.onmouseenter = () => {
          uploadBox.style.borderColor = '#ef4444'
        }
        uploadBox.onmouseleave = () => {
          uploadBox.style.borderColor = '#d1d5db'
        }

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
        const start = (document.getElementById('season-start') as HTMLSelectElement)?.value
        const end = (document.getElementById('season-end') as HTMLSelectElement)?.value
        const fileInput = document.getElementById('season-image') as HTMLInputElement
        const file = fileInput?.files?.[0]

        if (!start || !end || Number(end) !== Number(start) + 1) {
          Swal.showValidationMessage('Season must be consecutive years (e.g. 2025 - 2026)')
          return
        }

        if (!file) {
          Swal.showValidationMessage('Please upload a season image')
          return
        }

        return {
          season: `${start}-${end}`,
          imageFile: file
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Save Season',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-2xl shadow-xl',
        confirmButton:
          'px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition',
        cancelButton:
          'px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition',
        actions: 'flex justify-end gap-3 mt-6'
      }
    })

    if (value) {
        console.log('Saved season:', value)

        const formData = new FormData();
        formData.append('season', value.season);
        formData.append('image', value.imageFile);

        await fetch('/api/results', {
        method: 'POST',
        body: formData,
        })
        .then(async (res) => {
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to save season');
        }
        Swal.fire({
            icon: 'success',
            title: 'Season saved successfully!',
            timer: 2000,
            showConfirmButton: false,
        }).then(() => {
            window.location.reload();
        });
        })
        .catch((error) => {
        console.error('❌ Error saving season:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to save season',
        });
        });
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to Lestvica Page! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          This is the admin section where you can manage your club&#39;s lestvica.
        </p>
      </div>

      <div className="flex items-center justify-between lg:mb-8 mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">Lestvica</h2>
        <button
          onClick={handleAddTekme}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition"
        >
          Add Season Stats
        </button>
      </div>
    </div>
  )
}

export default Content
