'use client'
import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import Swal from "sweetalert2"
import 'sweetalert2/dist/sweetalert2.min.css'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { KNOWN_TEAMS } from '@/util/getTeamLogo'
import { TOLMIN_LOGO } from '@/util/fixtures'
import { goalsDiff, sortStandings, type StandingsRow } from '@/util/standings'
import { useAdminLanguage } from '@/context/AdminLanguageContext'
import { lestvicaText } from './translations'

type LestvicaItem = {
  _id: string
  season_start: string
  season_end: string
  league: string
  image: string
}

const OTHER_VALUE = '__other__'
const TOLMIN_VALUE = 'NK Tolmin'

const TEAM_OPTIONS = [{ name: TOLMIN_VALUE, logo: TOLMIN_LOGO }, ...KNOWN_TEAMS]

const Content = () => {
  const { lang } = useAdminLanguage()
  const t = lestvicaText[lang]

  const [items, setItems] = useState<LestvicaItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const [rows, setRows] = useState<StandingsRow[]>([])
  const [rowsLoading, setRowsLoading] = useState<boolean>(true)

  /* ================= FETCH DATA ================= */
  const fetchLestvica = useCallback(async () => {
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
  }, [])

  const fetchRows = useCallback(async () => {
    try {
      setRowsLoading(true)
      const res = await axios.get('/api/lestvica-tabela')
      setRows(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('❌ Failed to fetch lestvica_tabela:', err)
    } finally {
      setRowsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLestvica()
    fetchRows()
  }, [fetchLestvica, fetchRows])

  /* ================= STANDINGS TABLE (current season) ================= */
  const openRowModal = async (existing?: StandingsRow) => {
    const isEdit = !!existing
    const knownMatch = existing ? TEAM_OPTIONS.find((team) => team.name === existing.team) : undefined
    const defaultLeague = existing?.league ?? rows[0]?.league ?? ''
    const m = t.standings.modal

    const { value: formValues } = await Swal.fire({
      title: isEdit ? m.titleEdit : m.titleAdd,
      width: 620,
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      focusConfirm: false,
      html: `
        <div style="display:flex; flex-direction:column; gap:10px; text-align:left; font-family:sans-serif; max-height:65vh; overflow-y:auto; padding-right:4px;">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:13px; color:#444; font-weight:500;">${m.league}</label>
            <input id="row-league" class="swal2-input" style="margin:0; width:100%;" placeholder="${m.leaguePlaceholder}" value="${defaultLeague}">
          </div>

          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:13px; color:#444; font-weight:500;">${m.team}</label>
            <select id="row-team" class="swal2-input" style="margin:0; width:100%;">
              <option value="" disabled ${!existing ? 'selected' : ''}>${m.teamSelect}</option>
              ${TEAM_OPTIONS.map(
                (team) =>
                  `<option value="${team.name}" ${existing?.team === team.name ? 'selected' : ''}>${team.name}</option>`
              ).join('')}
              <option value="${OTHER_VALUE}" ${existing && !knownMatch ? 'selected' : ''}>${m.teamOther}</option>
            </select>
          </div>

          <div id="row-other-wrap" style="display:${existing && !knownMatch ? 'flex' : 'none'}; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.teamName}</label>
              <input id="row-team-name" class="swal2-input" style="margin:0; width:100%;" placeholder="${m.teamNamePlaceholder}" value="${existing && !knownMatch ? existing.team : ''}">
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.logo}</label>
              <input type="file" id="row-team-logo" accept="image/*" style="border-radius:6px; border:1px solid #ccc; padding:6px; background:#f9f9f9; font-size:13px; width:100%; box-sizing:border-box;">
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.played}</label>
              <input id="row-played" type="number" min="0" class="swal2-input" style="margin:0; width:100%;" value="${existing?.played ?? 0}">
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.wins}</label>
              <input id="row-wins" type="number" min="0" class="swal2-input" style="margin:0; width:100%;" value="${existing?.wins ?? 0}">
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.draws}</label>
              <input id="row-draws" type="number" min="0" class="swal2-input" style="margin:0; width:100%;" value="${existing?.draws ?? 0}">
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.losses}</label>
              <input id="row-losses" type="number" min="0" class="swal2-input" style="margin:0; width:100%;" value="${existing?.losses ?? 0}">
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.goalsFor}</label>
              <input id="row-goals-for" type="number" min="0" class="swal2-input" style="margin:0; width:100%;" value="${existing?.goalsFor ?? 0}">
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.goalsAgainst}</label>
              <input id="row-goals-against" type="number" min="0" class="swal2-input" style="margin:0; width:100%;" value="${existing?.goalsAgainst ?? 0}">
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:13px; color:#444; font-weight:500;">${m.points}</label>
            <div style="display:flex; gap:6px;">
              <input id="row-points" type="number" min="0" class="swal2-input" style="margin:0; width:100%;" value="${existing?.points ?? 0}">
              <button type="button" id="row-points-calc" style="white-space:nowrap; border-radius:6px; border:1px solid #ccc; padding:0 10px; background:#f3f4f6; font-size:13px; cursor:pointer;">${m.pointsCalc}</button>
            </div>
          </div>
        </div>
      `,
      didOpen: () => {
        const teamSelect = document.getElementById('row-team') as HTMLSelectElement | null
        const otherWrap = document.getElementById('row-other-wrap') as HTMLDivElement | null
        teamSelect?.addEventListener('change', () => {
          if (otherWrap) {
            otherWrap.style.display = teamSelect.value === OTHER_VALUE ? 'flex' : 'none'
          }
        })

        const calcBtn = document.getElementById('row-points-calc')
        calcBtn?.addEventListener('click', () => {
          const wins = Number((document.getElementById('row-wins') as HTMLInputElement)?.value) || 0
          const draws = Number((document.getElementById('row-draws') as HTMLInputElement)?.value) || 0
          const pointsInput = document.getElementById('row-points') as HTMLInputElement
          if (pointsInput) pointsInput.value = String(wins * 3 + draws)
        })
      },
      preConfirm: async () => {
        const league = (document.getElementById('row-league') as HTMLInputElement)?.value.trim()
        const teamSelectValue = (document.getElementById('row-team') as HTMLSelectElement)?.value
        const played = (document.getElementById('row-played') as HTMLInputElement)?.value
        const wins = (document.getElementById('row-wins') as HTMLInputElement)?.value
        const draws = (document.getElementById('row-draws') as HTMLInputElement)?.value
        const losses = (document.getElementById('row-losses') as HTMLInputElement)?.value
        const goalsFor = (document.getElementById('row-goals-for') as HTMLInputElement)?.value
        const goalsAgainst = (document.getElementById('row-goals-against') as HTMLInputElement)?.value
        const points = (document.getElementById('row-points') as HTMLInputElement)?.value

        if (!league || !teamSelectValue) {
          Swal.showValidationMessage(t.standings.validation.requiredFields)
          return
        }

        let team = teamSelectValue
        let teamLogo = TEAM_OPTIONS.find((opt) => opt.name === teamSelectValue)?.logo ?? ''

        if (teamSelectValue === OTHER_VALUE) {
          const otherName = (document.getElementById('row-team-name') as HTMLInputElement)?.value.trim()
          if (!otherName) {
            Swal.showValidationMessage(t.standings.validation.teamNameRequired)
            return
          }
          team = otherName
          teamLogo = existing && !knownMatch ? existing.teamLogo ?? '' : ''

          const fileInput = document.getElementById('row-team-logo') as HTMLInputElement
          const file = fileInput?.files?.[0]
          if (file) {
            try {
              const formData = new FormData()
              formData.append('file', file)
              const uploadRes = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              })
              teamLogo = uploadRes.data.url
            } catch (error) {
              console.error(error)
              Swal.showValidationMessage(t.standings.validation.logoUploadFailed)
              return
            }
          }
        }

        return {
          league,
          team,
          teamLogo,
          played: Number(played) || 0,
          wins: Number(wins) || 0,
          draws: Number(draws) || 0,
          losses: Number(losses) || 0,
          goalsFor: Number(goalsFor) || 0,
          goalsAgainst: Number(goalsAgainst) || 0,
          points: Number(points) || 0,
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    })

    if (!formValues) return

    try {
      if (isEdit && existing) {
        await axios.put(`/api/lestvica-tabela/${existing._id}`, formValues)
      } else {
        await axios.post('/api/lestvica-tabela', formValues)
      }
      Swal.fire({
        icon: 'success',
        title: isEdit ? t.standings.toast.updated : t.standings.toast.added,
        showConfirmButton: false,
        timer: 1200,
      })
      await fetchRows()
    } catch (error) {
      console.error(error)
      Swal.fire({ icon: 'error', title: t.standings.toast.saveError, showConfirmButton: false, timer: 1500 })
    }
  }

  const handleDeleteRow = async (row: StandingsRow) => {
    const result = await Swal.fire({
      title: t.standings.toast.deleteTitle(row.team),
      text: t.standings.toast.deleteText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: t.standings.toast.deleteConfirm,
    })

    if (!result.isConfirmed) return

    try {
      await axios.delete(`/api/lestvica-tabela/${row._id}`)
      Swal.fire({ icon: 'success', title: t.standings.toast.deleted, showConfirmButton: false, timer: 1200 })
      await fetchRows()
    } catch (error) {
      console.error(error)
      Swal.fire({ icon: 'error', title: t.standings.toast.deleteError, showConfirmButton: false, timer: 1500 })
    }
  }

  const sortedRows = sortStandings(rows)

  /* ================= SEASON ARCHIVE ================= */
  const handleAddSeason = async () => {
    const currentYear = new Date().getFullYear()
    const a = t.archive

    const oldestYear = 1921
    const { value } = await Swal.fire({
      title: a.modal.title,
      width: 600,
      background: '#f9fafb',
      html: `
        <div style="text-align:left">
          <label style="font-weight:600; color:#374151;">${a.modal.season}</label>
          <div style="display:flex; gap:12px; margin-top:6px;">
            <select id="season-start" class="swal2-input" style="flex:1; border: 1px solid red; outline: none;">
              ${Array.from({ length: currentYear - oldestYear + 1 }, (_, i) => `<option value="${oldestYear + i}">${oldestYear + i}</option>`).join('')}
            </select>
            <select id="season-end" class="swal2-input" style="flex:1; border: 1px solid red; outline: none;">
              ${Array.from({ length: currentYear - oldestYear + 2 }, (_, i) => `<option value="${oldestYear + i + 1}">${oldestYear + i + 1}</option>`).join('')}
            </select>
          </div>

          <label style="font-weight:600; color:#374151; margin-top:18px; display:block;">
            ${a.modal.leagueName}
          </label>

          <input
            id="league-name"
            type="text"
            class="swal2-input"
            placeholder="${a.modal.leagueNamePlaceholder}"
            style="
              width:100%;
              margin:6px 5px 0 0;
              padding: 25px 10px;
              border:1px solid red;
              font-size:14px;
              outline:none;
              box-sizing:border-box;
            "
          />

          <label style="font-weight:600; color:#374151; margin-top:18px; display:block;">
            ${a.modal.image}
          </label>

          <div id="upload-box"
            style="margin-top:8px;border:2px dashed #d1d5db;border-radius:14px;
            padding:22px;text-align:center;cursor:pointer;background:#ffffff;">
            <p style="color:#6b7280;font-size:14px;margin:0;">
              ${a.modal.uploadPrompt}<br/>
              <span style="font-size:12px;">${a.modal.uploadHint}</span>
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
        const league = (document.getElementById('league-name') as HTMLInputElement).value.trim()
        if (!league) {
          Swal.showValidationMessage(a.validation.leagueRequired)
          return
        }
        const file = (document.getElementById('season-image') as HTMLInputElement).files?.[0]

        if (Number(end) !== Number(start) + 1) {
          Swal.showValidationMessage(a.validation.consecutiveYears)
          return
        }
        if (!file) {
          Swal.showValidationMessage(a.validation.imageRequired)
          return
        }
        return { season: `${start}-${end}`, league, imageFile: file }
      },
      showCancelButton: true,
      confirmButtonText: a.modal.save,
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
      formData.append('league', value.league)
      formData.append('image', value.imageFile)

      const res = await fetch('/api/lestvica', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }

      await fetchLestvica()

      Swal.fire(a.toast.saved, a.toast.savedText, 'success')
    } catch (err) {
      const errorMessage = (err as Error).message || a.toast.saveFailed
      Swal.fire('Error', errorMessage, 'error')
    }
  }

  /* ================= DELETE ================= */
  const handleDeleteSeason = async (id: string) => {
    const a = t.archive
    const confirm = await Swal.fire({
      title: a.toast.deleteConfirmTitle,
      text: a.toast.deleteConfirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: a.toast.deleteConfirmButton,
    })

    if (!confirm.isConfirmed) return

    await fetch(`/api/lestvica?id=${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i._id !== id))

    Swal.fire(a.toast.deleted, a.toast.deletedText, 'success')
  }

  /* ================= UI ================= */
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t.pageTitle}</h1>
        <p className="text-gray-600 mt-1">{t.pageSubtitle}</p>
      </div>

      {/* CURRENT SEASON STANDINGS TABLE */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700">{t.standings.title}</h2>
          <p className="text-gray-500 text-sm">{t.standings.subtitle}</p>
        </div>
        <button
          onClick={() => openRowModal()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
        >
          {t.standings.addButton}
        </button>
      </div>

      <div className="mt-4 bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">{t.standings.table.rank}</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">{t.standings.table.team}</th>
              <th className="px-2 py-2 text-center font-semibold text-gray-600">{t.standings.table.played}</th>
              <th className="px-2 py-2 text-center font-semibold text-gray-600">{t.standings.table.wins}</th>
              <th className="px-2 py-2 text-center font-semibold text-gray-600">{t.standings.table.draws}</th>
              <th className="px-2 py-2 text-center font-semibold text-gray-600">{t.standings.table.losses}</th>
              <th className="px-2 py-2 text-center font-semibold text-gray-600">{t.standings.table.goalDiff}</th>
              <th className="px-2 py-2 text-center font-semibold text-gray-600">{t.standings.table.points}</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">{t.standings.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rowsLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-400">
                  {t.standings.table.loading}
                </td>
              </tr>
            ) : sortedRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-400">
                  {t.standings.table.empty}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, idx) => (
                <tr key={row._id}>
                  <td className="px-4 py-3 text-black">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-black">
                      <Image
                        src={row.teamLogo || '/logo/placeholder-team.png'}
                        alt={row.team}
                        width={24}
                        height={24}
                        className="object-contain"
                        unoptimized
                      />
                      {row.team}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center text-black">{row.played}</td>
                  <td className="px-2 py-3 text-center text-black">{row.wins}</td>
                  <td className="px-2 py-3 text-center text-black">{row.draws}</td>
                  <td className="px-2 py-3 text-center text-black">{row.losses}</td>
                  <td className="px-2 py-3 text-center text-black">{goalsDiff(row)}</td>
                  <td className="px-2 py-3 text-center text-black font-semibold">{row.points}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openRowModal(row)} className="text-blue-600 hover:text-blue-800">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDeleteRow(row)} className="text-red-500 hover:text-red-700">
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

      {/* SEASON ARCHIVE (past seasons, shown as an uploaded image) */}
      <div className="flex items-center justify-between mt-10">
        <h2 className="text-2xl font-semibold text-gray-700">{t.archive.title}</h2>
        <button
          onClick={handleAddSeason}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
        >
          {t.archive.addButton}
        </button>
      </div>

      {/* LIST */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p>{t.archive.loading}</p>}
        {!loading && items.length === 0 && (
          <p className="text-gray-500">{t.archive.empty}</p>
        )}

        {items.map(item => (
          <div key={item._id} className="bg-white rounded-xl shadow border overflow-hidden">
            <img src={item.image} alt={item.league ?? t.archive.unknownLeague} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-red-600 text-lg">
                {item.league ?? t.archive.unknownLeague}
              </span>
                <button
                onClick={() => handleDeleteSeason(item._id)}
                className="text-red-600 hover:text-red-800 cursor-pointer"
                title={t.archive.deleteTitle}
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                </button>
              </div>
              <span className="text-gray-600 text-sm">
              {item.season_start} – {item.season_end}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Content
