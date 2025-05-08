const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// File size range: 4 MiB to 12 MiB
const MIN_SIZE = 2 * 1024 * 1024;
const MAX_SIZE = 12 * 1024 * 1024;
const size = Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) + MIN_SIZE;

const filePath = path.join(__dirname, 'random.bin');
const stream = fs.createWriteStream(filePath);
const CHUNK_SIZE = 1024 * 1024; // 1 MiB
let written = 0;

function writeChunk() {
  if (written >= size) {
    stream.end(() => {
      const MB = size / (1024 * 1024);
      console.log(`Generated ${filePath} of size ${MB.toFixed(2)} MiB`);
    });
    return;
  }

  const remaining = size - written;
  const currentChunkSize = Math.min(CHUNK_SIZE, remaining);
  const buffer = Buffer.alloc(currentChunkSize);
  crypto.randomFill(buffer, (err, buf) => {
    if (err) throw err;
    stream.write(buf, () => {
      written += currentChunkSize;
      writeChunk();
    });
  });
}

writeChunk();