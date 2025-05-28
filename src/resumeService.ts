import {OpenAITool} from "./OpenAITool.js"


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

}