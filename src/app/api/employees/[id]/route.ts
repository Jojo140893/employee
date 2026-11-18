import { NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/mock-data";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const emp = DatabaseStore.getEmployeeById(params.id);
  if (!emp) {
    return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: emp });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const emp = DatabaseStore.getEmployeeById(params.id);
    if (!emp) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 });
    }

    const updates = await request.json();
    Object.assign(emp, updates);

    return NextResponse.json({ success: true, data: emp });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
