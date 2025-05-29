import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { ResumeService } from './resumeService.js';
import multer from 'multer';
import path from 'path';
import PDFDocument from 'pdfkit';
import fs from 'fs';

dotenv.config();

const resumeService = new ResumeService();
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Basic route
app.get('/', (req: Request, res: Response) => {
  console.log(req);
  res.send('Hello, you!');
});

app.post('/resume', async (req: Request, res: Response) => {
  res.send(await resumeService.createResume(req.body));
});

// New endpoint for file upload
app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const profileText = await resumeService.extractTextFromPdf(req.file.path);
  const jobDescription = req.body.job || "Default job description here";
  const resumeText = await resumeService.openAITool.getResume({
    profile: profileText,
    job: jobDescription
  } as any);

  // Create PDF
  const pdfPath = path.join(__dirname, '../outputs/resume.pdf');
  await createPdfFromText(resumeText, pdfPath);

  // Send PDF as download
  res.download(pdfPath, 'resume.pdf', (err) => {
    if (err) {
      res.status(500).send('Error sending PDF');
    }
    // Optionally, delete the file after sending
    // fs.unlinkSync(pdfPath);
  });
});

// Helper function to create a PDF from text
async function createPdfFromText(text: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
    doc.text(text);
    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});