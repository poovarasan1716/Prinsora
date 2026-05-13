import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, error: 'GOOGLE_APPS_SCRIPT_URL not set' },
        { status: 500 }
      );
    }

    const payload: any = {
      action: 'updateProduct',
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
      sheetId: process.env.GOOGLE_SHEET_ID,
      sheetName: process.env.GOOGLE_SHEET_NAME,
      productId: formData.get('productId'),
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      category: formData.get('category'),
      sizes: formData.get('sizes'),
    };

    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64Image = buffer.toString('base64');
      payload.imageData = base64Image;
      payload.fileName = imageFile.name;
      payload.mimeType = imageFile.type;
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
