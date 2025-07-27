import { createClient } from "@supabase/supabase-js"

// 環境変数が存在するか確認し、存在しない場合はエラーメッセージを表示
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabaseの環境変数が設定されていません。NEXT_PUBLIC_SUPABASE_URLとNEXT_PUBLIC_SUPABASE_ANON_KEYを確認してください。",
  )
}

// Supabaseクライアントを作成
export const supabase = createClient(supabaseUrl || "", supabaseKey || "")
