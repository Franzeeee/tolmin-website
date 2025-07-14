'use client';

import Image from 'next/image';
import { useState } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';

export default function Page() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/login', { email, password })
      console.log(res.data)
      if (res.status === 200) {
        Swal.fire({
          title: "User Created Successfully!",
          text: "User was Created and Added to the Database!",
          icon: "success"
        });
      }
      // optionally: redirect or save session
      setEmail('')
      setPassword('')
    } catch (err) {
      console.error(err)
    }
  }
  
  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Your Company"
            src={'/tolmin-logo.png'}
            className="mx-auto h-28 w-auto"
            width={100}
            height={100}
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:text-sm/6"
                />
              </div>
                </div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-red-400 cursor-pointer px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                        Sign in
                    </button>
                <div>
              <div className="text-sm">
                  <a href="/register" className="font-semibold text-red-600 hover:text-red-500">
                    Dont Have and account? Sign In
                  </a>
                </div>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <a href="#" className="font-semibold text-red-600 hover:text-red-500">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
