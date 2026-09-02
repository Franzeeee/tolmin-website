'use client'

import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid'
import { KNOWN_TEAMS } from '@/util/getTeamLogo'
import type { Fixture } from '@/util/fixtures'
import { useAdminLanguage } from '@/context/AdminLanguageContext'
import { tekmeText } from './translations'

const OTHER_VALUE = '__other__'

function currentSeasonDefault() {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const start = m >= 6 ? y : y - 1
  return `${start}/${start + 1}`
}

function toDatetimeLocalValue(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function Content() {
  const { lang } = useAdminLanguage()
  const t = tekmeText[lang]

  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFixtures = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/tekme')
      setFixtures(res.data)
    } catch (error) {
      console.error('Failed to fetch tekme:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFixtures()
  }, [fetchFixtures])

  const openFixtureModal = async (existing?: Fixture) => {
    const isEdit = !!existing
    const knownMatch = existing ? KNOWN_TEAMS.find((team) => team.name === existing.opponent) : undefined
    const m = t.modal

    const { value: formValues } = await Swal.fire({
      title: isEdit ? m.titleEdit : m.titleAdd,
      width: 620,
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      focusConfirm: false,
      html: `
        <div style="display:flex; flex-direction:column; gap:10px; text-align:left; font-family:sans-serif; max-height:65vh; overflow-y:auto; padding-right:4px;">
          <div style="display:flex; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.league}</label>
              <input id="swal-league" class="swal2-input" style="margin:0; width:100%;" placeholder="${m.leaguePlaceholder}" value="${existing?.league ?? ''}">
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.season}</label>
              <input id="swal-season" class="swal2-input" style="margin:0; width:100%;" placeholder="2025/2026" value="${existing?.season ?? currentSeasonDefault()}">
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.round}</label>
              <input id="swal-round" class="swal2-input" style="margin:0; width:100%;" placeholder="${m.roundPlaceholder}" value="${existing?.round ?? ''}">
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.datetime}</label>
              <input id="swal-datetime" type="datetime-local" class="swal2-input" style="margin:0; width:100%;" value="${toDatetimeLocalValue(existing?.datetime)}">
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.venueLabel}</label>
              <select id="swal-venue" class="swal2-input" style="margin:0; width:100%;">
                <option value="HOME" ${existing?.venue !== 'AWAY' ? 'selected' : ''}>${m.venueHome}</option>
                <option value="AWAY" ${existing?.venue === 'AWAY' ? 'selected' : ''}>${m.venueAway}</option>
              </select>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.place}</label>
              <input id="swal-place" class="swal2-input" style="margin:0; width:100%;" placeholder="${m.placePlaceholder}" value="${existing?.place ?? ''}">
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:13px; color:#444; font-weight:500;">${m.opponent}</label>
            <select id="swal-opponent" class="swal2-input" style="margin:0; width:100%;">
              <option value="" disabled ${!existing ? 'selected' : ''}>${m.opponentSelect}</option>
              ${KNOWN_TEAMS.map(
                (team) =>
                  `<option value="${team.name}" ${existing?.opponent === team.name ? 'selected' : ''}>${team.name}</option>`
              ).join('')}
              <option value="${OTHER_VALUE}" ${existing && !knownMatch ? 'selected' : ''}>${m.opponentOther}</option>
            </select>
          </div>

          <div id="swal-other-wrap" style="display:${existing && !knownMatch ? 'flex' : 'none'}; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.opponentName}</label>
              <input id="swal-opponent-name" class="swal2-input" style="margin:0; width:100%;" placeholder="${m.opponentNamePlaceholder}" value="${existing && !knownMatch ? existing.opponent : ''}">
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.logo}</label>
              <input type="file" id="swal-opponent-logo" accept="image/*" style="border-radius:6px; border:1px solid #ccc; padding:6px; background:#f9f9f9; font-size:13px; width:100%; box-sizing:border-box;">
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.status}</label>
              <select id="swal-status" class="swal2-input" style="margin:0; width:100%;">
                <option value="SCHEDULED" ${existing?.status !== 'FINISHED' ? 'selected' : ''}>${m.statusScheduled}</option>
                <option value="FINISHED" ${existing?.status === 'FINISHED' ? 'selected' : ''}>${m.statusFinished}</option>
              </select>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:13px; color:#444; font-weight:500;">${m.score}</label>
              <div style="display:flex; gap:6px; align-items:center;">
                <input id="swal-score-tolmin" type="number" min="0" class="swal2-input" style="margin:0; width:100%;" value="${existing?.tolminScore ?? ''}">
                <span>:</span>
                <input id="swal-score-opponent" type="number" min="0" class="swal2-input" style="margin:0; width:100%;" value="${existing?.opponentScore ?? ''}">
              </div>
            </div>
          </div>
        </div>
      `,
      didOpen: () => {
        const opponentSelect = document.getElementById('swal-opponent') as HTMLSelectElement | null
        const otherWrap = document.getElementById('swal-other-wrap') as HTMLDivElement | null
        opponentSelect?.addEventListener('change', () => {
          if (otherWrap) {
            otherWrap.style.display = opponentSelect.value === OTHER_VALUE ? 'flex' : 'none'
          }
        })
      },
      preConfirm: async () => {
        const league = (document.getElementById('swal-league') as HTMLInputElement)?.value.trim()
        const season = (document.getElementById('swal-season') as HTMLInputElement)?.value.trim()
        const round = (document.getElementById('swal-round') as HTMLInputElement)?.value.trim()
        const datetime = (document.getElementById('swal-datetime') as HTMLInputElement)?.value
        const venue = (document.getElementById('swal-venue') as HTMLSelectElement)?.value as 'HOME' | 'AWAY'
        const place = (document.getElementById('swal-place') as HTMLInputElement)?.value.trim()
        const opponentSelectValue = (document.getElementById('swal-opponent') as HTMLSelectElement)?.value
        const status = (document.getElementById('swal-status') as HTMLSelectElement)?.value as
          | 'SCHEDULED'
          | 'FINISHED'
        const scoreTolminRaw = (document.getElementById('swal-score-tolmin') as HTMLInputElement)?.value
        const scoreOpponentRaw = (document.getElementById('swal-score-opponent') as HTMLInputElement)?.value

        if (!league || !season || !datetime || !venue || !place || !opponentSelectValue) {
          Swal.showValidationMessage(t.validation.requiredFields)
          return
        }

        let opponent = opponentSelectValue
        let opponentLogo = KNOWN_TEAMS.find((team) => team.name === opponentSelectValue)?.logo ?? ''

        if (opponentSelectValue === OTHER_VALUE) {
          const otherName = (document.getElementById('swal-opponent-name') as HTMLInputElement)?.value.trim()
          if (!otherName) {
            Swal.showValidationMessage(t.validation.opponentNameRequired)
            return
          }
          opponent = otherName
          opponentLogo = existing && !knownMatch ? existing.opponentLogo ?? '' : ''

          const fileInput = document.getElementById('swal-opponent-logo') as HTMLInputElement
          const file = fileInput?.files?.[0]
          if (file) {
            try {
              const formData = new FormData()
              formData.append('file', file)
              const uploadRes = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              })
              opponentLogo = uploadRes.data.url
            } catch (error) {
              console.error(error)
              Swal.showValidationMessage(t.validation.logoUploadFailed)
              return
            }
          }
        }

        if (status === 'FINISHED' && (scoreTolminRaw === '' || scoreOpponentRaw === '')) {
          Swal.showValidationMessage(t.validation.scoreRequired)
          return
        }

        return {
          league,
          season,
          round,
          datetime: new Date(datetime).toISOString(),
          venue,
          place,
          opponent,
          opponentLogo,
          status,
          tolminScore: status === 'FINISHED' ? Number(scoreTolminRaw) : null,
          opponentScore: status === 'FINISHED' ? Number(scoreOpponentRaw) : null,
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    })

    if (!formValues) return

    try {
      if (isEdit && existing) {
        await axios.put(`/api/tekme/${existing._id}`, formValues)
      } else {
        await axios.post('/api/tekme', formValues)
      }
      Swal.fire({
        icon: 'success',
        title: isEdit ? t.toast.updated : t.toast.added,
        showConfirmButton: false,
        timer: 1200,
      })
      await fetchFixtures()
    } catch (error) {
      console.error(error)
      Swal.fire({ icon: 'error', title: t.toast.saveError, showConfirmButton: false, timer: 1500 })
    }
  }

  const handleDelete = async (fixture: Fixture) => {
    const result = await Swal.fire({
      title: t.toast.deleteTitle(fixture.opponent),
      text: t.toast.deleteText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: t.toast.deleteConfirm,
    })

    if (!result.isConfirmed) return

    try {
      await axios.delete(`/api/tekme/${fixture._id}`)
      Swal.fire({ icon: 'success', title: t.toast.deleted, showConfirmButton: false, timer: 1200 })
      await fetchFixtures()
    } catch (error) {
      console.error(error)
      Swal.fire({ icon: 'error', title: t.toast.deleteError, showConfirmButton: false, timer: 1500 })
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString(lang === 'sl' ? 'sl-SI' : 'en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.pageTitle}</h1>
          <p className="text-gray-600 mt-1">{t.pageSubtitle}</p>
        </div>
        <button
          onClick={() => openFixtureModal()}
          className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition"
        >
          <PlusIcon className="h-4 w-4" />
          {t.addButton}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">{t.table.date}</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">{t.table.leagueSeason}</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">{t.table.venue}</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">{t.table.opponent}</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">{t.table.result}</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">{t.table.status}</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">{t.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  {t.table.loading}
                </td>
              </tr>
            ) : fixtures.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  {t.table.empty}
                </td>
              </tr>
            ) : (
              fixtures.map((f) => (
                <tr key={f._id}>
                  <td className="px-4 py-3 text-black whitespace-nowrap">{formatDate(f.datetime)}</td>
                  <td className="px-4 py-3 text-black">
                    <div>{f.league}</div>
                    <div className="text-xs text-gray-500">
                      {f.season}
                      {f.round ? ` · ${f.round}` : ''}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        f.venue === 'HOME' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {f.venue === 'HOME' ? t.venue.home : t.venue.away}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{f.place}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-black">
                      <Image
                        src={f.opponentLogo || '/logo/placeholder-team.png'}
                        alt={f.opponent}
                        width={28}
                        height={28}
                        className="object-contain"
                        unoptimized
                      />
                      {f.opponent}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-black">
                    {f.status === 'FINISHED' ? `${f.tolminScore} : ${f.opponentScore}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        f.status === 'FINISHED' ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {f.status === 'FINISHED' ? t.status.finished : t.status.scheduled}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openFixtureModal(f)} className="text-blue-600 hover:text-blue-800">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(f)} className="text-red-500 hover:text-red-700">
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
    </div>
  )
}
