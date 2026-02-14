
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K';
export type ModelType = 'gemini-2.5-flash-image';

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  model: ModelType;
  style: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  settings: GenerationSettings;
  groundingChunks?: any[];
}

export interface StylePreset {
  name: string;
  promptSuffix: string;
  previewUrl: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
