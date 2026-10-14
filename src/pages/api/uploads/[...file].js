import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    responseLimit: false,
  },
};

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export default function handler(req, res) {
  const { file } = req.query;

  if (!file) {
    return res.status(400).send('File parameter required');
  }

  // Prevent directory traversal attacks
  const safeFilename = path.basename(Array.isArray(file) ? file.join('/') : file);
  const filePath = path.join(process.cwd(), 'public', 'uploads', safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}
