"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()

  // 初期ロード時にセッションチェック
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.push("/") // ログイン済みならトップへ
      } else {
        setInitialLoading(false)
      }
    }
    checkSession()
  }, [router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // ① Supabaseでユーザー登録（メール認証あり）
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      console.log("authData.user:", authData.user)

      // ② メール認証が必要な場合は user は null（ここで insert しない）
      if (!authData.user) {
        alert("認証メールを送信しました。メールをご確認ください。")
        router.push("/auth/login")
        return
      }

      // ③ 認証不要な場合や user が即時取得できた場合のみ insert
      const { error: profileError } = await supabase.from("user").insert([
        {
          user_id: authData.user.id,
          name: name || email.split("@")[0],
        },
      ])

      if (profileError) throw profileError

      alert("登録が完了しました。ログインしてください。")
      router.push("/auth/login")

    } catch (err: any) {
      console.error("登録エラー:", err)
      setError(err.message || "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div className="max-w-md mx-auto">読み込み中...</div>
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">新規登録</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">名前（任意）</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "登録中..." : "登録する"}
        </button>
      </form>

      <p className="mt-4 text-center">
        すでにアカウントをお持ちの方は
        <Link href="/auth/login" className="text-blue-500 hover:underline ml-1">
          ログイン
        </Link>
      </p>
    </div>
  )
}
