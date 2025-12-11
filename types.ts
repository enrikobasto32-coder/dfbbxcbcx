export interface SentimentDataPoint {
  id: number;
  score: number; // -1 to 1
  snippet: string;
}

export interface KeywordData {
  word: string;
  count: number;
  category: 'praise' | 'complaint';
}

export interface ActionItem {
  title: string;
  description: string;
}

export interface AnalysisResult {
  executiveSummary: string;
  actionItems: ActionItem[];
  sentimentTrend: SentimentDataPoint[];
  keywords: KeywordData[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}