import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

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
      console.error("Formidable error:", err);
      return res.status(500).json({ error: 'Failed to upload files', details: err.message });
    }

    const uploadedFiles = [];
    const fileArray = Array.isArray(files.files) ? files.files : files.files ? [files.files] : [];

    for (const file of fileArray) {
      const ext = path.extname(file.originalFilename || '').toLowerCase();
      if (!ALLOWED_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
        try { fs.unlinkSync(file.filepath); } catch(_) {}
        return res.status(400).json({ error: 'Only image files (jpg, png, webp, gif) are allowed.' });
      }
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      
      try {
        let sharpModule = null;
        try {
          sharpModule = (await import('sharp')).default;
        } catch (e) {
          console.warn("Sharp not available, fallback to direct upload:", e.message);
        }

        if (sharpModule && ext !== '.gif') {
          const webpFilename = `img-${uniqueSuffix}.webp`;
          const webpPath = path.join(uploadDir, webpFilename);
          await sharpModule(file.filepath)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(webpPath);
          try { fs.unlinkSync(file.filepath); } catch(_) {}
          uploadedFiles.push(`/uploads/${webpFilename}`);
        } else {
          const safeExt = ext || '.jpg';
          const targetFilename = `img-${uniqueSuffix}${safeExt}`;
          const targetPath = path.join(uploadDir, targetFilename);
          fs.copyFileSync(file.filepath, targetPath);
          try { fs.unlinkSync(file.filepath); } catch(_) {}
          uploadedFiles.push(`/uploads/${targetFilename}`);
        }
      } catch (err) {
        console.error("Upload error for file:", err);
        const safeExt = ext || '.jpg';
        const targetFilename = `img-${uniqueSuffix}${safeExt}`;
        const targetPath = path.join(uploadDir, targetFilename);
        try {
          fs.copyFileSync(file.filepath, targetPath);
          try { fs.unlinkSync(file.filepath); } catch(_) {}
          uploadedFiles.push(`/uploads/${targetFilename}`);
        } catch(copyErr) {
          console.error("Direct copy failed:", copyErr);
        }
      }
    }

    res.status(200).json({ urls: uploadedFiles });
  });
}
