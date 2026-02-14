
import React, { useState, useRef, useEffect } from 'react';
import { GeneratedImage, GenerationSettings } from './types';
import { STYLE_PRESETS } from './constants';
import { generateImage } from './services/geminiService';
import SettingsPanel from './components/SettingsPanel';
import Gallery from './components/Gallery';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const [refImage, setRefImage] = useState<{ data: string; mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generatorRef = useRef<HTMLDivElement>(null);
  
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: '1:1',
    imageSize: '1K',
    model: 'gemini-2.5-flash-image',
    style: STYLE_PRESETS[0].promptSuffix,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setRefImage({
        data: base64String,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeRefImage = () => {
    setRefImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !refImage) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateImage(prompt, settings, refImage || undefined);
      
      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: result.url,
        prompt: prompt || (refImage ? "Image modification" : "Untitled"),
        timestamp: Date.now(),
        settings: { ...settings },
        groundingChunks: result.groundingChunks,
      };

      setImages([newImage, ...images]);
      setSelectedImage(newImage);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imgUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#030712] selection:bg-purple-500/30">
      <div 
        className="mouse-glow" 
        style={{ 
          left: `${mousePos.x}px`, 
          top: `${mousePos.y}px` 
        }} 
      />

      {/* Dashboard Screen (Hero) */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="hero-vortex">
          <div className="vortex-layer" style={{ animationDuration: '30s' }} />
          <div className="vortex-layer" style={{ animationDuration: '45s', opacity: 0.3, transform: 'scale(1.5)' }} />
        </div>
        
        <div className="relative z-10 w-full max-w-full">
          <h1 className="text-6xl sm:text-8xl md:text-[12rem] lg:text-[18rem] font-display font-black leading-none tracking-tighter text-white/90 mix-blend-difference select-none px-2 break-words">
            NazCreao
          </h1>
          <div className="mt-4 md:mt-8 space-y-4 md:space-y-6">
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-white/60 tracking-tight px-4 leading-tight">
              Where the next wave of storytelling <br className="hidden md:block" /> happens with <span className="text-white font-medium">Creao</span>
            </p>
            <button 
              onClick={() => generatorRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-6 md:mt-8 px-8 md:px-10 py-3 md:py-4 bg-white text-black font-bold rounded-full text-base md:text-lg hover:scale-105 transition-transform shadow-2xl shadow-white/10"
            >
              Enter Studio
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 animate-bounce text-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Navigation - Minimal */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Naz<span className="gradient-text">Creao</span></h1>
          </div>
        </div>
      </nav>

      {/* Main Generator Section */}
      <main ref={generatorRef} className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="relative group flex flex-col">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={refImage ? "Describe how to modify the uploaded image..." : "What shall we create today? (e.g., 'An ancient library in space')"}
                className="w-full h-48 md:h-56 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-lg md:text-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all resize-none group-hover:border-white/20 leading-relaxed"
              />
              
              <div className="absolute bottom-6 left-6 md:left-8 flex items-center gap-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs md:text-sm font-bold text-gray-300 transition-all shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {refImage ? "Replace" : "Ref Image"}
                </button>

                {refImage && (
                  <div className="flex items-center gap-2 md:gap-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl px-2 md:px-3 py-1.5 md:py-2 animate-in fade-in slide-in-from-left-4">
                    <img 
                      src={`data:${refImage.mimeType};base64,${refImage.data}`} 
                      className="w-6 h-6 md:w-8 md:h-8 rounded-lg object-cover border border-white/20" 
                      alt="Ref" 
                    />
                    <button 
                      onClick={removeRefImage}
                      className="p-1 hover:text-white text-purple-300 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="absolute bottom-6 right-6">
                <button
                   onClick={() => { setPrompt(''); removeRefImage(); }}
                   className="p-2 md:p-3 text-gray-500 hover:text-white transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                </button>
              </div>
            </div>

            <div className="space-y-4">
               <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider ml-1">Artistic Style</label>
               <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                 {STYLE_PRESETS.map((style) => (
                    <button
                      key={style.name}
                      onClick={() => setSettings({ ...settings, style: style.promptSuffix })}
                      className={`flex-shrink-0 relative w-32 h-20 md:w-40 md:h-24 rounded-2xl overflow-hidden group transition-all shadow-xl ${
                        settings.style === style.promptSuffix ? 'ring-4 ring-indigo-500 ring-offset-4 ring-offset-[#030712] scale-95' : 'opacity-50 hover:opacity-100 hover:scale-[1.02]'
                      }`}
                    >
                      <img src={style.previewUrl} alt={style.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="text-xs font-black text-white uppercase tracking-tighter">{style.name}</span>
                      </div>
                    </button>
                 ))}
               </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-[2rem] flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold leading-snug">{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!prompt.trim() && !refImage)}
              className={`w-full py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl flex items-center justify-center gap-4 transition-all glow-button shadow-2xl ${
                isGenerating || (!prompt.trim() && !refImage)
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-6 w-6 md:h-7 md:w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>NazCreao is working...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{refImage ? "Transform Masterpiece" : "Generate Masterpiece"}</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-4">
             <SettingsPanel settings={settings} setSettings={setSettings} />
          </div>
        </div>

        <div className="mt-20 md:mt-32">
          <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-white/5 pb-6">
            <h3 className="text-3xl md:text-4xl font-display font-black tracking-tight">Your <span className="gradient-text">Atelier</span></h3>
            <span className="bg-white/5 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">{images.length} creations</span>
          </div>
          <Gallery images={images} onSelect={setSelectedImage} />
        </div>
      </main>

      {/* Modal & Footer */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8 md:gap-12 items-center my-auto">
            <div className="relative group w-full md:w-3/5">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.prompt} 
                className="w-full h-auto max-h-[70vh] md:max-h-[85vh] object-contain rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-white/10"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 md:-top-16 right-0 text-white/40 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="w-full md:w-2/5 text-left space-y-6 md:space-y-8 bg-white/5 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="space-y-2 md:space-y-3">
                <span className="text-[10px] md:text-[11px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-black tracking-widest uppercase">
                  Engine: Creao 1
                </span>
                <h4 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none">Generation Specs</h4>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                 <div>
                   <p className="text-[9px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Prompt</p>
                   <p className="text-sm md:text-base text-gray-200 leading-relaxed italic opacity-80">"{selectedImage.prompt}"</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 md:gap-6">
                   <div>
                     <p className="text-[9px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Canvas</p>
                     <p className="text-xs md:text-sm font-bold text-white">{selectedImage.settings.aspectRatio}</p>
                   </div>
                   <div>
                     <p className="text-[9px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Format</p>
                     <p className="text-xs md:text-sm font-bold text-white">PNG Lossless</p>
                   </div>
                 </div>
              </div>

              <div className="pt-4 md:pt-8 flex gap-4">
                <button 
                  onClick={() => handleDownload(selectedImage.url, `nazcreao-${selectedImage.id}.png`)}
                  className="flex-1 py-3 md:py-4 bg-white text-black font-black rounded-xl md:rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-xl text-sm md:text-base"
                >
                  Download PNG
                </button>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="px-6 md:px-8 py-3 md:py-4 glass rounded-xl md:rounded-2xl hover:bg-white/10 transition-colors text-white font-bold text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="py-12 md:py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <div className="flex flex-col items-center gap-4">
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-lg md:text-xl">N</span>
             </div>
             <p className="text-gray-500 text-xs md:text-sm font-medium tracking-tight px-4">© 2024 NazCreao Studio. Built for the new era of storytelling.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-gray-600 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="hover:text-white transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
