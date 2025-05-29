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
            input: "Create an ATS compatible resume as a pdf template based on this linked in profile: "+this.profile+" and this job description: "+ this.jobDescription
             + "Please provide the output in a specific visual format, MS Word, or PDF. The resume should be ATS compatible and include the following sections: Contact Information, Summary, Skills, Experience, Education, Certifications, and Additional Information. Ensure that the formatting is clean and professional.", 
        });

        console.log(response.output_text);
        return response.output_text;
   
    }

}

export {OpenAITool}