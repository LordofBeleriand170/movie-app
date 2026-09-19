declare module "sentiment" {
  interface SentimentAnalysis {
    score: number;
    comparative: number;
    calculation: Array<{ [key: string]: number }>;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  }

  interface SentimentOptions {
    extras?: { [key: string]: number };
    language?: string;
  }

  class Sentiment {
    constructor();
    analyze(phrase: string, options?: SentimentOptions): SentimentAnalysis;
    registerLanguage(languageCode: string, languageDefinition: any): void;
  }

  export default Sentiment;
}
