
import React from 'react';
import { StylePreset, AspectRatio } from './types';

export const STYLE_PRESETS: StylePreset[] = [
  { name: 'Cinematic', promptSuffix: ', cinematic lighting, photorealistic, 8k, highly detailed, film grain', previewUrl: 'https://picsum.photos/seed/cine/300/300' },
  { name: 'Cyberpunk', promptSuffix: ', cyberpunk aesthetic, neon lights, futuristic city, glowing accents, synthwave palette', previewUrl: 'https://picsum.photos/seed/cyber/300/300' },
  { name: 'Anime', promptSuffix: ', high quality anime style, vibrant colors, studio ghibli inspiration, cel shaded', previewUrl: 'https://picsum.photos/seed/anime/300/300' },
  { name: 'Oil Painting', promptSuffix: ', expressive oil painting, thick brushstrokes, classical art style, textured canvas', previewUrl: 'https://picsum.photos/seed/oil/300/300' },
  { name: 'Minimalist', promptSuffix: ', minimalist design, clean lines, flat colors, modern aesthetic, vector art', previewUrl: 'https://picsum.photos/seed/mini/300/300' },
  { name: '3D Render', promptSuffix: ', octane render, 3d isometric, soft lighting, unreal engine 5, raytracing', previewUrl: 'https://picsum.photos/seed/3d/300/300' },
];

export const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
  { label: '1:1 Square', value: '1:1' },
  { label: '4:3 Classic', value: '4:3' },
  { label: '3:4 Portrait', value: '3:4' },
  { label: '16:9 Cinema', value: '16:9' },
  { label: '9:16 Mobile', value: '9:16' },
];
