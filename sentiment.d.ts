declare module "sentiment" {
  export interface SentimentAnalysis {
    score: number;
    comparative: number;
    calculation: Array<Record<string, number>>;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  }

  export interface SentimentOptions {
    extras?: Record<string, number>;
    language?: string;
  }

  export interface LanguageDefinition {
    labels: Record<string, number>;
    scoringStrategy?: {
      apply: (tokens: string[], cursor: number, tokenScore: number) => number;
    };
  }

  class Sentiment {
    constructor();
    analyze(
      phrase: string,
      options?: SentimentOptions,
      callback?: (error: Error | null, result: SentimentAnalysis) => void,
    ): SentimentAnalysis;
    registerLanguage(
      languageCode: string,
      languageDefinition: LanguageDefinition,
    ): void;
  }

  export = Sentiment;
}
