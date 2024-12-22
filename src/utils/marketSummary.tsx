import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import axios from "axios";
import textversion from "textversionjs";


process.env.YOU_SEARCH_API = "a40b91bb-ecce-45e6-aecf-2b17a2f7c70b<__>1QRUjvETU8N2v5f491aUW6Zm"
process.env.GEMINI_API = "AIzaSyBOL8GIejQSW7fry2kk5IEr1A6O-wDBCZo"

export class MarketSummary {
  private genAI: GoogleGenerativeAI;
  private searchApiKey: string;

  constructor() {
    if (!process.env.GEMINI_API || !process.env.YOU_SEARCH_API) {
      throw new Error(
        "Environment variables GEMINI_API and YOU_SEARCH_API must be set."
      );
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    this.searchApiKey = process.env.YOU_SEARCH_API;
  }

  private async getLLMResponse(
    prompt: string = "",
    system: string = "You are a helpful assistant."
  ): Promise<string> {
    const model: GenerativeModel = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: system,
    });

    const result = await model.generateContent(prompt);
    return result.response.text(); // Ensure `text` method is correctly used
  }

  private async generateSearchQueries(
    topic: string,
    topicDescription: string,
    n: number
  ): Promise<string[]> {
    const currentDate = `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    const userPrompt = `I'm writing a research report on ${topic} and its description: ${topicDescription} and need help coming up with diverse search queries.
    Please generate a list of ${n} search queries that would be useful for writing a research report on ${topic}. These queries can be in various formats, from simple keywords to more complex phrases. Do not add any formatting or numbering to the queries. If the topic refers to time, right now is ${currentDate}. If talking about the future, it is 2025 and beyond.`;

    const completion = await this.getLLMResponse(
      userPrompt,
      "The user will ask you to help generate some search queries. Respond with only the suggested queries in plain text with no extra formatting, each on its own line."
    );

    return completion
      .split("\n")
      .filter((s) => s.trim().length > 0)
      .slice(0, n);
  }

  private async getSearchResults(queries: string[]): Promise<string[][]> {
    const headers = {
      "X-API-Key": this.searchApiKey,
    };

    const results: any[] = [];
    for (const query of queries) {
      const url = `https://api.ydc-index.io/search?query=${encodeURIComponent(
        query
      )}`;
      const response = await axios.get(url, { headers });
      results.push(response.data);
      break; // Stops after the first query
    }

    return results.map((result) =>
      result.hits.map((hit: { snippets: string[] }) => hit.snippets)
    );
  }

  private async synthesizeReport(
    topic: string,
    searchResults: string[][],
    contentSlice: number = 750
  ): Promise<string> {
    const inputData = searchResults
      .map((result) => result.slice(0, contentSlice))
      .join(",");

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const prompt = `Input data: ${inputData} write a short paragraph summary of the research report about ${topic} based on the provided information. Just short paragraph! about 8-10 sentences long. No need to say "based on the provided information". Don't give your opinion, just summarize the information.`;

    const model: GenerativeModel = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(prompt);

    return result.response.text().replace(/\. {2,}/g, ". ");
  }

  public async summaryMarketTopic(
    marketTitle: string,
    marketDescription: string
  ): Promise<string> {
    const description = textversion(marketDescription);
    const searchQueries = await this.generateSearchQueries(
      marketTitle,
      description,
      3
    );
    const searchResults = await this.getSearchResults(searchQueries);
    return this.synthesizeReport(marketTitle, searchResults);
  }
}
