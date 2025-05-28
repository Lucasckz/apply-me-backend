import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv'
import { ResumeService } from './resumeService.js';

dotenv.config()

const resumeService = new ResumeService();
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  console.log(req);
  res.send('Hello, you!');
});

app.post('/resume', async (req: Request, res: Response) => {
  res.send(await resumeService.createResume(req.body));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});