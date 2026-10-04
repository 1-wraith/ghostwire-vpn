// Helper to generate a valid Windows ICO and PNG icon for GhostWire VPN
const fs = require('fs');
const path = require('path');

function createPngBuffer(width, height) {
  // A clean 32-bit RGBA PNG file creator
  const zlib = require('zlib');

  const bytesPerPixel = 4;
  const rawData = Buffer.alloc(height * (1 + width * bytesPerPixel));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * bytesPerPixel);
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.95) {
        // Deep cyber slate inside with cyan/emerald border
        if (dist > 0.82) {
          // Cyber cyan glow border
          rawData[pxOffset] = 0;     // R
          rawData[pxOffset + 1] = 229; // G
          rawData[pxOffset + 2] = 255; // B
          rawData[pxOffset + 3] = 255; // A
        } else if (dist > 0.76) {
          // Emerald glow inner border
          rawData[pxOffset] = 0;     // R
          rawData[pxOffset + 1] = 245; // G
          rawData[pxOffset + 2] = 155; // B
          rawData[pxOffset + 3] = 255; // A
        } else {
          // Shield body gradient
          const intensity = Math.max(0, 1 - dist);
          rawData[pxOffset] = Math.round(10 + intensity * 20);
          rawData[pxOffset + 1] = Math.round(20 + intensity * 40);
          rawData[pxOffset + 2] = Math.round(40 + intensity * 80);
          rawData[pxOffset + 3] = 255;

          // Draw a small cyber cross/shield eye in the center
          if (Math.abs(dx) < 0.12 && Math.abs(dy) < 0.12) {
            rawData[pxOffset] = 0;
            rawData[pxOffset + 1] = 245;
            rawData[pxOffset + 2] = 155;
            rawData[pxOffset + 3] = 255;
          }
        }
      } else {
        // Transparent outside
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // ColorType: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeBuf, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }

  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate ICO format wrapping PNG frames
function createIcoFile(pngBuffer256, pngBuffer64, pngBuffer32, pngBuffer16) {
  const images = [
    { width: 256, height: 256, buf: pngBuffer256 },
    { width: 64, height: 64, buf: pngBuffer64 },
    { width: 32, height: 32, buf: pngBuffer32 },
    { width: 16, height: 16, buf: pngBuffer16 }
  ];

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(images.length, 4); // Count

  let offset = 6 + images.length * 16;
  const dirEntries = [];
  const imageBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Palette colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buf.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset

    dirEntries.push(entry);
    imageBuffers.push(img.buf);
    offset += img.buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const png256 = createPngBuffer(256, 256);
const png64 = createPngBuffer(64, 64);
const png32 = createPngBuffer(32, 32);
const png16 = createPngBuffer(16, 16);

fs.writeFileSync(path.join(assetsDir, 'icon.png'), png256);
fs.writeFileSync(path.join(assetsDir, 'tray-icon.png'), png32);

const icoBuf = createIcoFile(png256, png64, png32, png16);
fs.writeFileSync(path.join(assetsDir, 'icon.ico'), icoBuf);

console.log('Successfully generated assets/icon.ico, assets/icon.png and assets/tray-icon.png!');
