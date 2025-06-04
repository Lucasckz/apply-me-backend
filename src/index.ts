import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { ResumeService } from './resumeService.js';
import multer from 'multer';
import path from 'path';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import cors from 'cors';

dotenv.config();

const resumeService = new ResumeService();
const app = express();

// CORS and body parsing middleware (must be first)
app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
  exposedHeaders: ['Content-Disposition', 'Content-Type']
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from /outputs
app.use('/outputs', express.static(path.join(__dirname, '../outputs')));

const PORT = 4000;
const upload = multer({ dest: 'uploads/' });

// Basic route
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, you!');
});

// CORS test route
app.get('/test-cors', (_req: Request, res: Response) => {
  res.json({ message: 'CORS works!' });
});

// Resume creation endpoint
app.post('/resume', async (req: Request, res: Response) => {
  res.send(await resumeService.createResume(req.body));
});

// File upload and resume PDF generation endpoint
app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).send('No file uploaded.');
    }
    console.log('File received:', req.file.path);

    const profileText = await resumeService.extractTextFromPdf(req.file.path);
    console.log('Extracted profile text');

    const jobDescription = req.body.job || "Default job description here";
    const resumeText = await resumeService.openAITool.getResume({
      profile: profileText,
      job: jobDescription
    } as any);
    console.log('Resume text generated');

    // Create PDF
    const pdfPath = path.join(__dirname, '../outputs/resume.pdf');
    await createPdfFromText(resumeText, pdfPath);

    console.log(`Sending PDF: ${pdfPath}`);

    // Send PDF as download
    res.download(pdfPath, 'resume.pdf', (err) => {
      if (err) {
        console.error('Error sending PDF:', err);
      } else {
        console.log('PDF sent successfully');
      }
    });
  } catch (err) {
    console.error('Error in /upload:', err);
    res.status(500).send('Internal server error');
  }
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