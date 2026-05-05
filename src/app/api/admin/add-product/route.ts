import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json({ success: false, error: 'GOOGLE_APPS_SCRIPT_URL not set' }, { status: 500 });
    }

    const imageFile = formData.get('image') as File;
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = buffer.toString('base64');

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addProduct', // The flag for the Apps Script
        folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_NAME,
        imageData: base64Image,
        fileName: imageFile.name,
        mimeType: imageFile.type,
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        category: formData.get('category'),
        sizes: formData.get('sizes')
      }),
    });

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
