import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload files' });
    }

    const uploadedFiles = [];
    const fileArray = Array.isArray(files.files) ? files.files : files.files ? [files.files] : [];

    for (const file of fileArray) {
      const ext = path.extname(file.originalFilename || '').toLowerCase();
      if (!ALLOWED_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
        // Delete the bad file
        try { fs.unlinkSync(file.filepath); } catch(_) {}
        return res.status(400).json({ error: 'Only image files (jpg, png, webp, gif) are allowed.' });
      }
      
      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const webpFilename = `img-${uniqueSuffix}.webp`;
        const webpPath = path.join(uploadDir, webpFilename);
        
        if (ext === '.gif') {
           // Skip compression for GIFs to preserve animations
           const gifPath = path.join(uploadDir, `img-${uniqueSuffix}.gif`);
           fs.renameSync(file.filepath, gifPath);
           uploadedFiles.push(`/uploads/img-${uniqueSuffix}.gif`);
        } else {
           // Compress image: resize if too large (max 1200px width), convert to webp, 80% quality
           await sharp(file.filepath)
             .resize({ width: 1200, withoutEnlargement: true })
             .webp({ quality: 80 })
             .toFile(webpPath);
             
           // Delete the original uncompressed file from formidable
           fs.unlinkSync(file.filepath);
           uploadedFiles.push(`/uploads/${webpFilename}`);
        }
      } catch (compressionError) {
        console.error("Compression error:", compressionError);
        // Fallback: if compression fails, keep original
        const relativePath = `/uploads/${path.basename(file.filepath)}`;
        uploadedFiles.push(relativePath);
      }
    }

    res.status(200).json({ urls: uploadedFiles });
  });
}
