import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrainCircuit, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import api from '../services/api'

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
  const nav = useNavigate()

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
  })

  const [err, setErr] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    setErr('')

    try {
      const { data } = await api.post(`/auth/${mode}`, form)

      localStorage.setItem('hiresense_token', data.access_token)
      nav('/dashboard')
    } catch (x: any) {
      setErr(x.response?.data?.detail || 'Request failed')
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className="min-h-screen bg-[#FFF1EA] text-[#171717]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}
        <div className="relative hidden overflow-hidden bg-[#FF4B26] lg:flex">

          {/* Decorative circles */}
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#FF6A45] opacity-40" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#E63D1D] opacity-40" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg">
                <BrainCircuit size={27} className="text-[#FF4B26]" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  HireSense AI
                </h1>

                <p className="text-sm text-white/75">
                  Resume intelligence, explained.
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="max-w-xl text-white">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                <Sparkles size={16} />
                AI-powered career intelligence
              </div>

              <h2 className="text-5xl font-bold leading-tight xl:text-6xl">
                Build a resume
                <br />
                that gets noticed.
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/80">
                Understand exactly how your resume matches a job,
                discover missing skills and get a personalized path
                to improve.
              </p>

              {/* Features */}
              <div className="mt-10 space-y-4">

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    ✓
                  </div>
                  <span className="text-white/90">
                    Explainable resume matching
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    ✓
                  </div>
                  <span className="text-white/90">
                    Identify missing job skills
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    ✓
                  </div>
                  <span className="text-white/90">
                    Generate personalized learning roadmaps
                  </span>
                </div>

              </div>
            </div>

            <p className="text-sm text-white/60">
              Make every application more intentional.
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center justify-center bg-[#FFF8F5] px-5 py-10 sm:px-8">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF4B26]">
                <BrainCircuit size={24} className="text-white" />
              </div>

              <div>
                <h1 className="font-bold text-[#171717]">
                  HireSense AI
                </h1>

                <p className="text-xs text-[#8A746C]">
                  Resume intelligence, explained.
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFB8A4] bg-[#FFF0EA] px-3 py-1.5 text-xs font-semibold text-[#E84522]">
                <Sparkles size={14} />
                AI-powered career intelligence
              </div>

              <h2 className="text-4xl font-bold tracking-tight text-[#171717]">
                {isLogin ? 'Welcome back 👋' : 'Create your account'}
              </h2>

              <p className="mt-3 leading-6 text-[#806E67]">
                {isLogin
                  ? 'Sign in to continue improving your resume and finding better job matches.'
                  : 'Start analyzing your resume and discover what skills you need for your target roles.'}
              </p>
            </div>

            {/* Form Card */}
            <form
              className="rounded-3xl border border-[#F2D7CD] bg-white p-6 shadow-[0_20px_60px_rgba(72,36,24,0.08)] sm:p-8"
              onSubmit={submit}
            >

              {/* Full Name */}
              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#332924]">
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B8178]"
                    />

                    <input
                      required
                      className="w-full rounded-xl border border-[#E8D5CE] bg-[#FFFCFA] py-3.5 pl-11 pr-4 text-[#171717] outline-none transition placeholder:text-[#AA9891] focus:border-[#FF4B26] focus:ring-4 focus:ring-[#FF4B26]/10"
                      placeholder="Enter your full name"
                      value={form.full_name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          full_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className={!isLogin ? 'mt-5' : ''}>
                <label className="mb-2 block text-sm font-semibold text-[#332924]">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B8178]"
                  />

                  <input
                    required
                    className="w-full rounded-xl border border-[#E8D5CE] bg-[#FFFCFA] py-3.5 pl-11 pr-4 text-[#171717] outline-none transition placeholder:text-[#AA9891] focus:border-[#FF4B26] focus:ring-4 focus:ring-[#FF4B26]/10"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-[#332924]">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B8178]"
                  />

                  <input
                    required
                    className="w-full rounded-xl border border-[#E8D5CE] bg-[#FFFCFA] py-3.5 pl-11 pr-4 text-[#171717] outline-none transition placeholder:text-[#AA9891] focus:border-[#FF4B26] focus:ring-4 focus:ring-[#FF4B26]/10"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Error */}
              {err && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {err}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF4B26] px-5 py-3.5 font-semibold text-white shadow-[0_8px_20px_rgba(255,75,38,0.25)] transition hover:bg-[#F04421] hover:shadow-[0_10px_25px_rgba(255,75,38,0.32)] active:scale-[0.99]"
              >
                {isLogin ? 'Login to HireSense' : 'Create account'}

                <ArrowRight size={18} />
              </button>

              {/* Switch */}
              <div className="mt-6 border-t border-[#F0E1DB] pt-5 text-center">
                <p className="text-sm text-[#806E67]">
                  {isLogin
                    ? "Don't have an account?"
                    : 'Already have an account?'}
                </p>

                <button
                  type="button"
                  className="mt-1 font-semibold text-[#FF4B26] transition hover:text-[#D93D1D]"
                  onClick={() =>
                    nav(isLogin ? '/register' : '/login')
                  }
                >
                  {isLogin
                    ? 'Create your account'
                    : 'Login to your account'}
                </button>
              </div>

            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-[#A28D85]">
              Your resume data stays protected and is used only for
              personalized analysis.
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}