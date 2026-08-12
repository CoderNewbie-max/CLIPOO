export interface Clip {
  id: string;
  timestamp: string;
  duration: number;
  viralScore: number;
  hookStrength: number;
  retentionScore: number;
  predictedViews: string;
  title: string;
  transcript: string;
  niche: string;
  confidence: number;
  thumbnail: string;
  tags: string[];
  hooks: string[];
  engagementPrompts: string[];
  startSeconds?: number;
  endSeconds?: number;
  videoId?: string;
  videoType?: 'youtube' | 'file' | 'demo';
  fileUrl?: string;
}

export type ProcessingStage = 
  | 'idle'
  | 'downloading'
  | 'transcribing'
  | 'analyzing'
  | 'detecting'
  | 'generating'
  | 'complete';
