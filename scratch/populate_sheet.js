const fs = require('fs');
const path = require('path');

const scriptUrl = 'https://script.google.com/macros/s/AKfycbzgVG-Nqoc0aZxWMMSvA8CCcpFjI5-CnR7Nh3Sjpojg8ai4JV40PvRr1R7Di3U1J2id/exec';
const sheetId = '1xJZYOwkt0JXDwlGpAJZRAQzTrJ4rSeCktGCN5TjLwd4';
const folderId = '15La-XgP4K40MLHYOg6xqsDPnNSDIzLvc';
const sheetName = 'Inventory';

async function addProduct(name, description, price, stock, category, imagePath) {
    console.log(`Adding ${name}...`);
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const fileName = path.basename(imagePath);

        const body = {
            action: 'addProduct',
            folderId,
            sheetId,
            sheetName,
            imageData: base64Image,
            fileName: fileName,
            mimeType: 'image/png',
            name,
            description,
            price,
            stock,
            category
        };

        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const result = await response.json();
        console.log(`Result for ${name}:`, result);
        return result;
    } catch (error) {
        console.error(`Error adding ${name}:`, error);
    }
}

async function run() {
    const baseDir = 'e:/prinsora/prinsora/src/assets/images';
    
    const productsToAdd = [
        {
            name: 'Maharani Crimson Silk Saree',
            description: 'Hand-woven Banarasi silk in deep crimson, adorned with 24k gold zari floral motifs. A masterpiece of traditional Indian craftsmanship.',
            price: '48500',
            stock: '15',
            category: 'Sarees',
            image: 'product-1.png'
        },
        {
            name: 'Vrindavan Emerald Lehenga',
            description: 'Breathtaking forest green velvet lehenga featuring intricate peacock embroidery and hand-stitched sequins. Includes a sheer gold-bordered dupatta.',
            price: '89900',
            stock: '8',
            category: 'Lehengas',
            image: 'product-2.png'
        },
        {
            name: 'Starry Night Fusion Gown',
            description: 'A contemporary floor-length gown in midnight navy silk-satin, featuring a hand-embroidered bodice and a dramatic pleated skirt.',
            price: '65000',
            stock: '12',
            category: 'Gowns',
            image: 'product-3.png'
        },
        {
            name: 'Royal Heritage Silk Saree',
            description: 'A timeless heritage saree woven with pure Kanjivaram silk, embodying centuries of Indian craft. Its rich texture and vibrant palette speak of royalty.',
            price: '38000',
            stock: '20',
            category: 'Sarees',
            image: 'luxury-saree.png'
        },
        {
            name: 'Desert Rose Collection Saree',
            description: 'Inspired by the hues of the Thar desert, this sand-colored silk saree features delicate rose-gold embroidery and a subtle shimmer.',
            price: '42000',
            stock: '10',
            category: 'Sarees',
            image: 'collection-1.png'
        },
        {
            name: 'Ocean Mist Designer Lehenga',
            description: 'A refreshing aqua-blue lehenga with silver thread work and mirror accents. Perfect for summer weddings and seaside celebrations.',
            price: '76000',
            stock: '5',
            category: 'Lehengas',
            image: 'collection-2.png'
        },
        {
            name: 'Midnight Bloom Gala Gown',
            description: 'A black velvet gown with hand-painted floral motifs and a structured trail. Designed for those who want to make a statement.',
            price: '54000',
            stock: '7',
            category: 'Gowns',
            image: 'collection-3.png'
        },
        {
            name: 'Imperial Gold Festive Saree',
            description: 'A variant of our signature crimson saree, this piece features heavier gold work on the borders, specifically for festive occasions.',
            price: '52000',
            stock: '18',
            category: 'Sarees',
            image: 'product-1.png'
        },
        {
            name: 'Emerald Forest Bridal Set',
            description: 'The ultimate bridal lehenga in forest green, featuring 3D floral embroidery and thousands of hand-placed crystals.',
            price: '95000',
            stock: '3',
            category: 'Lehengas',
            image: 'product-2.png'
        },
        {
            name: 'Celestial Navy Evening Gown',
            description: 'A celestial-themed navy gown with sparkling silver constellations embroidered across the skirt. Truly a work of art.',
            price: '68000',
            stock: '10',
            category: 'Gowns',
            image: 'product-3.png'
        }
    ];

    for (const p of productsToAdd) {
        await addProduct(p.name, p.description, p.price, p.stock, p.category, path.join(baseDir, p.image));
        // Add a small delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('All 10 products successfully added to Google Sheets and Drive!');
}

run();
