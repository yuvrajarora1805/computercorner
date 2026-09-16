import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    maxFiles: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(500).json({ error: 'Failed to upload files' });
    }

    const uploadedFiles = [];
    const fileArray = Array.isArray(files.files) ? files.files : files.files ? [files.files] : [];

    fileArray.forEach(file => {
      // Create a web-accessible URL
      const relativePath = `/uploads/${path.basename(file.filepath)}`;
      uploadedFiles.push(relativePath);
    });

    res.status(200).json({ urls: uploadedFiles });
  });
}
