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
    let sheet = ss.getSheetByName(sheetName);

    if (!sheet && sheetName === 'Promo_Codes') {
      sheet = ss.insertSheet('Promo_Codes');
      sheet.appendRow(['Code', 'Type', 'Value', 'Expiry', 'Usage']);
    }
    
    if (!sheet && sheetName === 'Reviews') {
      sheet = ss.insertSheet('Reviews');
      sheet.appendRow(['Timestamp', 'ProductId', 'UserName', 'Rating', 'Comment', 'ImageUrl', 'Status']);
    }

    if (!sheet && sheetName === 'Refunds') {
      sheet = ss.insertSheet('Refunds');
      sheet.appendRow(['Timestamp', 'RefundId', 'OrderId', 'Email', 'Reason', 'Status', 'Comment', 'Image', 'Type']);
    }

    if (!sheet && sheetName === 'Products') {
      sheet = ss.insertSheet('Products');
      sheet.appendRow(['ProductID', 'Name', 'Description', 'Price', 'Stock', 'Category', 'Sizes', 'Image', 'Avatar']);
    }

    if (!sheet && sheetName === 'Orders') {
      sheet = ss.insertSheet('Orders');
      sheet.appendRow(['Timestamp', 'OrderID', 'Customer', 'Phone', 'Email', 'Address', 'Total', 'Payment', 'Status', 'TrackingID']);
    }

    if (!sheet && sheetName === 'Order_Items') {
      sheet = ss.insertSheet('Order_Items');
      sheet.appendRow(['Timestamp', 'OrderID', 'ProductName', 'Size', 'Quantity', 'Price', 'Total']);
    }

    if (!sheet && sheetName === 'Users') {
      sheet = ss.insertSheet('Users');
      sheet.appendRow(['UID', 'Name', 'Email', 'LastLogin', 'Status']);
    }

    if (!sheet && sheetName === 'Offers') {
      sheet = ss.insertSheet('Offers');
      sheet.appendRow(['Timestamp', 'ProductID', 'ProductName', 'Tag']);
    }

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
        return addProduct(sheet, params); // Fixed: added 'sheet' argument
        
      case 'updateProduct':
        return updateProduct(sheet, params);
        
      case 'deleteProduct':
        return deleteProduct(sheet, params.productId);
        
      case 'updateOrderStatus':
        return updateOrderStatus(sheet, params);
        
      case 'updateUserStatus':
        return updateUserStatus(sheet, params);
        
      case 'addOffer':
        return addOffer(sheet, params);
        
      case 'deleteOffer':
        return deleteOffer(sheet, params.productId);

      case 'getPromoCodes':
        return getPromoCodes(sheet);
        
      case 'addPromoCode':
        return addPromoCode(sheet, params);
        
      case 'deletePromoCode':
        return deletePromoCode(sheet, params.code);
        
      case 'bulkUpdatePrices':
        return bulkUpdatePrices(sheet, params);
      
      case 'getReviews':
        return getReviews(sheet, params.productId);
        
      case 'addReview':
        return addReview(sheet, params);
        
      case 'updateReviewStatus':
        return updateReviewStatus(sheet, params);

      case 'getRefunds':
        return getRefunds(sheet);
        
      case 'addRefund':
        return addRefund(sheet, params);

      case 'updateRefundStatus':
        return updateRefundStatus(sheet, params);

      default:
        return response({ success: false, error: "Action '" + action + "' not recognized." });
    }
  } catch (error) {
    return response({ success: false, error: error.toString() });
  }
}

// --- 3. FUNCTION IMPLEMENTATIONS ---

function addRefund(sheet, params) {
  try {
    let imageUrl = "";
    if (params.imageData) {
      const folder = DriveApp.getFolderById(params.folderId);
      const blob = Utilities.newBlob(Utilities.base64Decode(params.imageData), params.mimeType || "image/png", "refund_" + params.orderId + "_" + Date.now() + ".png");
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      imageUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
    }
    
    // Rows: Timestamp, RefundId, OrderId, Email, Reason, Status, Comment, Image, Type
    const row = [
      new Date().toLocaleString(),
      params.refundId,
      params.orderId,
      params.email,
      params.reason,
      "Pending",
      params.comment || "",
      imageUrl,
      params.requestType || "Return"
    ];
    
    sheet.appendRow(row);
    return response({ success: true, refundId: params.refundId, imageUrl: imageUrl });
  } catch (e) {
    return response({ success: false, error: e.toString() });
  }
}

function getRefunds(sheet) {
  const data = sheet.getDataRange().getValues();
  return response({ success: true, refunds: data });
}

function updateRefundStatus(sheet, params) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] == params.refundId) {
      sheet.getRange(i + 1, 6).setValue(params.status);
      return response({ success: true });
    }
  }
  return response({ success: false, error: "Refund not found" });
}

function getPromoCodes(sheet) {
  const data = sheet.getDataRange().getValues();
  return response({ success: true, codes: data });
}

function addPromoCode(sheet, params) {
  sheet.appendRow([
    params.code,
    params.type, // 'percentage' or 'fixed'
    params.value,
    params.expiry,
    0 // Usage count
  ]);
  return response({ success: true });
}

function deletePromoCode(sheet, code) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === String(code).trim().toLowerCase()) {
      sheet.deleteRow(i + 1);
      return response({ success: true });
    }
  }
  return response({ success: false, error: "Promo code not found: " + code });
}

function bulkUpdatePrices(sheet, params) {
  const data = sheet.getDataRange().getValues();
  const category = params.category;
  const change = parseFloat(params.change); // e.g. -10 for 10% discount
  const type = params.type; // 'percentage' or 'fixed'
  
  let count = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i][5] == category) { // Category column
      const currentPrice = parseFloat(data[i][3]);
      let newPrice = currentPrice;
      
      if (type === 'percentage') {
        newPrice = currentPrice * (1 + (change / 100));
      } else {
        newPrice = currentPrice + change;
      }
      
      sheet.getRange(i + 1, 4).setValue(Math.round(newPrice));
      count++;
    }
  }
  return response({ success: true, updatedCount: count });
}

function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  return response({ success: true, products: data, orders: data, users: data });
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

function addProduct(sheet, params) {
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

function updateProduct(sheet, params) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == params.productId) {
      const row = i + 1;
      sheet.getRange(row, 2).setValue(params.name);
      sheet.getRange(row, 3).setValue(params.description);
      sheet.getRange(row, 4).setValue(params.price);
      sheet.getRange(row, 5).setValue(params.stock);
      sheet.getRange(row, 6).setValue(params.category);
      sheet.getRange(row, 7).setValue(params.sizes || "");
      
      if (params.imageData) {
        const folder = DriveApp.getFolderById(params.folderId);
        const contentType = params.mimeType || "image/png";
        const blob = Utilities.newBlob(Utilities.base64Decode(params.imageData), contentType, params.fileName);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        const imageUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
        sheet.getRange(row, 8).setValue(imageUrl);
      }
      
      return response({ success: true });
    }
  }
  return response({ success: false, error: "Product not found" });
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

function updateOrderStatus(sheet, params) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] == params.orderId) {
      const row = i + 1;
      sheet.getRange(row, 9).setValue(params.status);
      if (params.trackingId) {
        sheet.getRange(row, 10).setValue(params.trackingId);
      }
      return response({ success: true });
    }
  }
  return response({ success: false, error: "Order not found" });
}

function updateUserStatus(sheet, params) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] == params.email) {
      const row = i + 1;
      sheet.getRange(row, 5).setValue(params.status);
      return response({ success: true });
    }
  }
  return response({ success: false, error: "User not found" });
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

function getReviews(sheet, productId) {
  const data = sheet.getDataRange().getValues();
  const reviews = data.slice(1).filter(row => !productId || row[1] == productId);
  return response({ success: true, reviews: reviews });
}

function addReview(sheet, params) {
  try {
    let imageUrl = "";
    if (params.imageData) {
      const folder = DriveApp.getFolderById(params.folderId);
      const blob = Utilities.newBlob(Utilities.base64Decode(params.imageData), params.mimeType || "image/png", params.fileName);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      imageUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
    }

    sheet.appendRow([
      new Date().toLocaleString(),
      params.productId,
      params.userName,
      params.rating,
      params.comment,
      imageUrl,
      "Pending" // For moderation
    ]);
    return response({ success: true });
  } catch (e) {
    return response({ success: false, error: e.toString() });
  }
}

function updateReviewStatus(sheet, params) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    // Search by product and username/comment for uniqueness
    if (data[i][1] == params.productId && data[i][2] == params.userName) {
      sheet.getRange(i + 1, 7).setValue(params.status);
      return response({ success: true });
    }
  }
  return response({ success: false, error: "Review not found" });
}

function response(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

