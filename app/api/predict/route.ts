import { NextRequest, NextResponse } from "next/server";

const MODEL_API_URL = process.env.MODEL_API_URL ?? "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    if (!image || !(image instanceof Blob)) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }
    const body = new FormData();
    body.append("image", image, "frame.jpg");
    const res = await fetch(`${MODEL_API_URL}/predict`, {
      method: "POST",
      body,
    });
    const data = await res.json().catch(() => ({}));
    console.log(data);
    if (!res.ok) {
      return NextResponse.json(data || { error: "Model API error" }, {
        status: res.status,
      });
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Prediction failed" },
      { status: 500 }
    );
  }
}
