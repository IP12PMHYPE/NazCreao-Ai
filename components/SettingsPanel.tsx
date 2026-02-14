
import React from 'react';
import { GenerationSettings, AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';

interface SettingsPanelProps {
  settings: GenerationSettings;
  setSettings: (s: GenerationSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings }) => {
  const handleRatioChange = (aspectRatio: AspectRatio) => {
    setSettings({ ...settings, aspectRatio });
  };

  return (
    <div className="glass p-6 rounded-3xl flex flex-col gap-6 w-full shadow-xl text-left">
      {/* Model Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Engine Model</label>
        <div className="grid grid-cols-1 gap-3">
          <div
            className="p-4 rounded-2xl border transition-all bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            <div className="font-bold text-lg">Creao 1</div>
            <div className="text-[11px] opacity-70 uppercase tracking-widest font-bold">Standard Engine</div>
          </div>
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Aspect Ratio</label>
        <div className="grid grid-cols-2 gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => handleRatioChange(ratio.value)}
              className={`py-3 px-1 rounded-xl border text-xs font-bold transition-all ${
                settings.aspectRatio === ratio.value
                  ? 'bg-white/20 border-white/30 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
