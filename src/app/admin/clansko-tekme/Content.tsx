'use client'
import axios from "axios"
import React, { useEffect } from "react"
import Swal from "sweetalert2"
import 'sweetalert2/dist/sweetalert2.min.css'

const Content = () => {
  const handleAddTekme = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add Tekma',
      html:
      `<input id="swal-league" class="swal2-input" placeholder="League" required>
       <input id="swal-season" class="swal2-input" placeholder="Season" required>
       <input id="swal-datetime" type="datetime-local" class="swal2-input" placeholder="Date & Time" required>
       <input id="swal-place" class="swal2-input" placeholder="Place" required>
       <input id="swal-enemy" class="swal2-input" placeholder="Enemy" required>
       <input id="swal-enemyLogo" type="file" class="swal2-input" accept="image/*" required>
       <input id="swal-score" class="swal2-input" placeholder="Score" required>`,
      focusConfirm: false,
      preConfirm: () => {
      const league = (document.getElementById('swal-league') as HTMLInputElement)?.value
      const season = (document.getElementById('swal-season') as HTMLInputElement)?.value
      const datetime = (document.getElementById('swal-datetime') as HTMLInputElement)?.value
      const place = (document.getElementById('swal-place') as HTMLInputElement)?.value
      const enemy = (document.getElementById('swal-enemy') as HTMLInputElement)?.value
      const enemyLogoInput = document.getElementById('swal-enemyLogo') as HTMLInputElement
      const enemyLogoFile = enemyLogoInput?.files?.[0]
      const score = (document.getElementById('swal-score') as HTMLInputElement)?.value

      if (!league || !season || !datetime || !place || !enemy || !enemyLogoFile || !score) {
        Swal.showValidationMessage('Please fill all fields')
        return
      }

      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
        resolve({
          league,
          season,
          datetime,
          place,
          enemy,
          enemyLogo: reader.result, // base64 string
          score
        })
        }
        reader.readAsDataURL(enemyLogoFile)
      })
      }
    })

    if (formValues) {
      // Handle the formValues here (e.g., send to API)
      console.log('Tekma data:', formValues)
      Swal.fire('Added!', 'Tekma has been added.', 'success')
    }
  }

  useEffect(() => {
    axios.get("https://cors-anywhere.herokuapp.com/https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=390&onlydetails=true")
      .then(response => {
        console.log('Fetched tekme:', response.data)
      })
      .catch(error => {
        console.error('Error fetching tekme:', error)
      })
  },[]);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Tekme Page! 👋</h1>
        <p className="text-gray-600 mt-1">
          This is the admin section where you can manage your club&#39;s tekme.
        </p>
      </div>
      {/* Products Grid */}
      <div className="flex items-center justify-between lg:mb-8">
        <h2 className="text-2xl font-semibold text-gray-700">Tekme</h2>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition"
          onClick={handleAddTekme}
        >
          Add Tekme
        </button>
      </div>
    </div>
  )
}

export default Content;
