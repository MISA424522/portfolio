import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { id, name, completed} = await request.json();

    if (!id || !name) {
      return NextResponse.json({ error: "IDと名前は必須です" }, { status: 400 });
    }

    // insertするときは1件でも配列で渡す必要がある
    const { data, error } = await supabase.from("tasks").insert([{ id, name, completed }]).select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "タスク追加成功", data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, name, completed");

    if (error) {
      throw error;
    }

    return NextResponse.json({ tasks: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, completed } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({ name, completed })
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "タスク更新成功", data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "タスク削除成功" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
