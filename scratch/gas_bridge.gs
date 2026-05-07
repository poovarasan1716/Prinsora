/**
 * Prinsora Google Apps Script Bridge
 * This script connects your Next.js application to Google Sheets and Google Drive.
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions -> Apps Script.
 * 3. Delete any existing code and paste this code.
 * 4. Click 'Deploy' -> 'New Deployment'.
 * 5. Select 'Web App'.
 * 6. Set 'Execute as' to 'Me'.
 * 7. Set 'Who has access' to 'Anyone'.
 * 8. Click 'Deploy' and copy the 'Web App URL'.
 * 9. Paste this URL into your .env file as GOOGLE_APPS_SCRIPT_URL.
 */

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const sheetId = params.sheetId;
    const sheetName = params.sheetName;

    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return response({ success: false, error: "Sheet not found: " + sheetName });
    }

    switch (action) {
      case 'getSheetData':
        return getSheetData(sheet);
      
      case 'placeOrder':
      case 'syncUser':
        return appendRows(sheet, params.orderRows || params.rows);
      
      case 'addProduct':
        return addProduct(params);
        
      case 'deleteProduct':
        return deleteProduct(sheet, params.productId);
        
      case 'addOffer':
        return addOffer(sheet, params);
        
      case 'deleteOffer':
        return deleteOffer(sheet, params.productId);

      default:
        return response({ success: false, error: "Unknown action: " + action });
    }
  } catch (error) {
    return response({ success: false, error: error.toString() });
  }
}

function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  return response({ success: true, products: data, orders: data }); // Returning both for compatibility
}

function appendRows(sheet, rows) {
  if (!rows || !rows.length) {
    return response({ success: false, error: "No rows provided" });
  }
  
  rows.forEach(row => {
    sheet.appendRow(row);
  });
  
  return response({ success: true });
}

function addProduct(params) {
  try {
    const folder = DriveApp.getFolderById(params.folderId);
    const contentType = params.mimeType || "image/png";
    const blob = Utilities.newBlob(Utilities.base64Decode(params.imageData), contentType, params.fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const imageUrl = "https://lh3.googleusercontent.com/d/" + file.getId();

    const productId = "PRD" + Math.floor(Math.random() * 10000);
    const row = [
      productId,
      params.name,
      params.description,
      params.price,
      params.stock,
      params.category,
      params.sizes || "",
      imageUrl,
      "" // Avatar
    ];
    
    sheet.appendRow(row);
    
    return response({ success: true, productId: productId, imageUrl: imageUrl });
  } catch (e) {
    return response({ success: false, error: "addProduct failed: " + e.toString() });
  }
}

function deleteProduct(sheet, productId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == productId) {
      sheet.deleteRow(i + 1);
      return response({ success: true });
    }
  }
  return response({ success: false, error: "Product not found" });
}

function addOffer(sheet, params) {
  sheet.appendRow([new Date().toLocaleString(), params.productId, params.productName, params.tag]);
  return response({ success: true });
}

function deleteOffer(sheet, productId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] == productId) {
      sheet.deleteRow(i + 1);
      return response({ success: true });
    }
  }
  return response({ success: true });
}

function response(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
