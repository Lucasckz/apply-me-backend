import {OpenAITool} from "./OpenAITool.js"
import fs from 'fs';
import pdfParse from 'pdf-parse';

export class ResumeService {

    openAITool = new OpenAITool();

    ResumeService () {}

    async createResume(body: JSON): Promise<string> {

        try {
            return await this.openAITool.getResume(body);
        } catch (error) {
            console.log(error);
            return "error";
        }
    }

    async extractTextFromPdf(filePath: string): Promise<string> {
        const dataBuffer = await fs.promises.readFile(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    }

    async getResume(data: { profile: string; job: string }): Promise<any> {
        // Implement your logic here, for now just return the data for demonstration
        return {
            message: "Resume processed successfully",
            profile: data.profile,
            job: data.job
        };
    }
}