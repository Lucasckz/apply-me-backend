import OpenAI from "openai";
import * as fs from 'fs';
// import * as path from 'path';

class OpenAITool {

    // key = new OpenAI({ apiKey: 'My API Key' });
    client = new OpenAI();    

    OpenAITool(){}

    jobDescription = "";
    profile = "";

    async readFile(): Promise<string> {
        try {
            // const absolutePath = path.resolve(__dirname, filePath);
            const data = await fs.promises.readFile("./src/profile.txt", 'utf-8');
            return data;
        } catch (err) {
            console.error("An error occurred:", err);
            throw err;
        }
    } 
    
    async readFile2(): Promise<string> {
        try {
            // const absolutePath = path.resolve(__dirname, filePath);
            const data = await fs.promises.readFile("./src/job.txt", 'utf-8');
            return data;
        } catch (err) {
            console.error("An error occurred:", err);
            throw err;
        }
    } 

    async getResume(prompt: JSON): Promise<string>{
        console.log(prompt);

        this.profile = prompt["profile" as keyof JSON].toString();
        this.jobDescription = prompt["job" as keyof JSON].toString();

        // this.profile = await this.readFile()
        // this.jobDescription = await this.readFile2()

        // console.log(this.profile);
        // console.log(this.jobDescription);


        const response = await this.client.responses.create({
            model: "gpt-4.1",
            input:   "Create a clean, ATS-friendly resume in plain text without using markdown, asterisks, or formatting symbols. Structure the resume using ALL CAPS section headers (e.g., SUMMARY, SKILLS, EXPERIENCE) and dashes (-) for bullet points.Base it on the following LinkedIn profile: " +
    this.profile +
    " and the following job description: " +
    this.jobDescription +
    ". Include these sections in order: Contact Information, Summary, Skills, Experience, Education, Certifications, Additional Information."
});

        console.log(response.output_text);
        return response.output_text;
   
    }

}

export {OpenAITool}