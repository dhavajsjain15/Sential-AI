'use client';

import React from 'react';
import { RecordingState } from '../types';
import { Cloud, CheckCircle2, RefreshCw } from 'lucide-react';

interface RecordingIndicatorProps {
  recordingState: RecordingState;
}

export function RecordingIndicator({ recordingState }: RecordingIndicatorProps) {
  if (!recordingState.isRecording) return null;

  const formatElapsed = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/50 text-white text-xs font-mono font-bold select-none shadow-lg shadow-[#EF4444]/30 animate-pulse">
      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
      <span>REC {formatElapsed(recordingState.elapsedSeconds)}</span>
      <span className="text-[10px] text-[#94A3B8]">({recordingState.fileSizeMb.toFixed(1)} MB)</span>

      {recordingState.autoTriggered && (
        <span className="px-1.5 py-0.5 rounded bg-[#EF4444] text-[#020617] text-[9px] font-black uppercase tracking-wider">
          AUTO-INCIDENT
        </span>
      )}

      {/* Cloud buffer sync state */}
      <span className="ml-1 flex items-center gap-1 text-[10px] text-[#22D3EE]">
        {recordingState.cloudUploadStatus === 'uploading' ? (
          <>
            <RefreshCw className="w-3 h-3 animate-spin" /> Cloud Buffer
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> Synced
          </>
        )}
      </span>
    </div>
  );
}
