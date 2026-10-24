'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, CheckCircle2, ShieldAlert, AlertOctagon, Volume2, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmergencyStore } from '@/store/useEmergencyStore';
import { useFamilyEmergencyStore } from '@/store/useFamilyEmergencyStore';
import {
  evaluateTriage,
  classifyTranscript,
  TelemetryInput,
  SeverityLevel,
  EscalationVerdict,
} from '@/engine/triageEngine';

export function VoiceAssistantProtocol() {
  const { activeIncident, triage, updateTriageState, resolveIncident } = useEmergencyStore();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [turn, setTurn] = useState<number>(1); // 1 = Status Check, 2 = Mobility Check

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isTriggeredRef = useRef<boolean>(false);
  const initialTimeRef = useRef<number>(25);

  // Async TTS helper function with proper error handling
  const speakAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError('Web Speech API not supported in this browser.');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }

      updateTriageState({ recognizedTranscript: currentTranscript });
      handleSpeechAnalysis(currentTranscript);
    };

    recognitionRef.current.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setMicError('Microphone permission denied. Please allow mic access.');
      } else if (event.error === 'no-speech') {
        // Halve remaining timer on silence or unintelligible speech
        handleSilence();
      } else {
        console.warn('Speech recognition error:', event.error);
      }
    };

    try {
      recognitionRef.current.start();
      setMicError(null);
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Halve remaining timer on silence or unintelligible speech
  const handleSilence = () => {
    const currentRemaining = useEmergencyStore.getState().triage.timeRemaining;
    const halved = Math.max(Math.floor(currentRemaining / 2), 1);
    updateTriageState({ timeRemaining: halved });
  };

  const startTriageProtocol = async (inputTelemetry: TelemetryInput) => {
    if (isTriggeredRef.current) return;
    isTriggeredRef.current = true;
    setIsActive(true);
    setTurn(1);

    const classification = evaluateTriage(inputTelemetry);
    initialTimeRef.current = classification.initialWindowSec;

    updateTriageState({
      dialogueStep: 1,
      activePrompt: classification.initialPrompt,
      recognizedTranscript: '',
      timeRemaining: classification.initialWindowSec,
      protocolSeverity: classification.severity,
      escalationVerdict: 'AWAITING',
    });

    // Announce Turn 1 Prompt
    await speakAudio(classification.initialPrompt);
    startListening();

    // Start Dynamic Failsafe Timer
    timerRef.current = setInterval(() => {
      const remaining = useEmergencyStore.getState().triage.timeRemaining;
      if (remaining <= 1) {
        handleTimeoutEscalation();
      } else {
        updateTriageState({ timeRemaining: remaining - 1 });
      }
    }, 1000);
  };

  // Multi-Turn Conversational Dialogue Tree Evaluation
  const handleSpeechAnalysis = async (transcriptText: string) => {
    const intent = classifyTranscript(transcriptText);

    // 1. EXPLICIT FAMILY SOS REQUEST -> Direct Family Call & Notification (911 Suppressed)
    if (intent === 'FAMILY_SOS_REQUEST') {
      stopListening();
      const primary =
        useFamilyEmergencyStore.getState().contacts.find((c) => c.isPrimary) ||
        useFamilyEmergencyStore.getState().contacts[0];

      updateTriageState({
        escalationVerdict: 'FAMILY_DISPATCH',
        activePrompt: `Family SOS Confirmed. Directly calling ${primary.name} (${primary.relationship})...`,
      });
      await speakAudio(
        `Family SOS confirmed. Directly calling your primary contact ${primary.name} and sending private SMS alerts to your family.`
      );
      useFamilyEmergencyStore
        .getState()
        .dispatchFamilyOnlySOS(
          `User verbally requested: "${transcriptText}"`,
          activeIncident?.zoneName || 'Living Area'
        );
      setTimeout(() => {
        setIsActive(false);
        isTriggeredRef.current = false;
      }, 4000);
      return;
    }

    // 2. CRITICAL DISTRESS -> Instant Priority EMS Dispatch
    if (intent === 'CRITICAL_DISTRESS') {
      stopListening();
      updateTriageState({
        escalationVerdict: 'EMS_DISPATCH',
        activePrompt: 'Distress confirmed. Dispatching Paramedics (tel:102)...',
      });
      await speakAudio('Distress confirmed. Dispatching assistance immediately. Stay still.');
      window.dispatchEvent(
        new CustomEvent('ESCALATION_LEVEL_RAISED', {
          detail: { reason: 'Explicit Critical Distress Verbally Confirmed', urgency: 'CRITICAL' },
        })
      );
      setTimeout(() => {
        setIsActive(false);
        isTriggeredRef.current = false;
      }, 5000);
      return;
    }

    // TURN 1 EVALUATION
    if (turn === 1) {
      if (intent === 'SAFE_AFFIRMATIVE') {
        setTurn(2);
        const turn2Prompt = 'Can you stand up safely?';
        updateTriageState({
          dialogueStep: 2,
          activePrompt: turn2Prompt,
          timeRemaining: Math.min(useEmergencyStore.getState().triage.timeRemaining + 10, 20),
        });
        await speakAudio(turn2Prompt);
        return;
      }

      if (intent === 'ASSISTANCE_NEEDED') {
        stopListening();
        updateTriageState({
          escalationVerdict: 'ASSISTANCE_REQ',
          activePrompt: 'Assistance requested. Contacting emergency caretakers...',
        });
        await speakAudio('Assistance request logged. Contacting emergency caretakers immediately.');
        window.dispatchEvent(
          new CustomEvent('ESCALATION_LEVEL_RAISED', {
            detail: { reason: 'User requested assistance during Turn 1', urgency: 'HIGH' },
          })
        );
        setTimeout(() => {
          setIsActive(false);
          isTriggeredRef.current = false;
        }, 5000);
        return;
      }
    }

    // TURN 2 EVALUATION (MOBILITY CHECK)
    if (turn === 2) {
      if (intent === 'SAFE_AFFIRMATIVE') {
        stopListening();
        updateTriageState({
          escalationVerdict: 'ABORTED',
          activePrompt: 'Safety code accepted, emergency protocol aborted.',
        });
        await speakAudio(
          'Safety code accepted, emergency protocol aborted and no messages dispatched.'
        );
        resolveIncident();
        setTimeout(() => {
          setIsActive(false);
          isTriggeredRef.current = false;
        }, 4000);
        return;
      }

      if (intent === 'ASSISTANCE_NEEDED') {
        stopListening();
        updateTriageState({
          escalationVerdict: 'ASSISTANCE_REQ',
          activePrompt: 'Mobility compromised. Caretakers alerted.',
        });
        await speakAudio('Assistance request logged. Contacting emergency contacts.');
        window.dispatchEvent(
          new CustomEvent('ESCALATION_LEVEL_RAISED', {
            detail: { reason: 'User unable to stand during Turn 2 mobility check', urgency: 'HIGH' },
          })
        );
        setTimeout(() => {
          setIsActive(false);
          isTriggeredRef.current = false;
        }, 5000);
        return;
      }
    }
  };

  const handleTimeoutEscalation = async () => {
    stopListening();
    updateTriageState({
      escalationVerdict: 'EMS_DISPATCH',
      activePrompt: 'Unresponsive timeout. Dispatching EMS...',
    });
    await speakAudio('No response received. Initiating emergency paramedic dispatch immediately.');
    window.dispatchEvent(
      new CustomEvent('ESCALATION_LEVEL_RAISED', {
        detail: { reason: 'Triage countdown timeout: user unresponsive', urgency: 'CRITICAL' },
      })
    );
    setTimeout(() => {
      setIsActive(false);
      isTriggeredRef.current = false;
    }, 5000);
  };

  const handleTriggerFamilySOS = async () => {
    stopListening();
    const primary =
      useFamilyEmergencyStore.getState().contacts.find((c) => c.isPrimary) ||
      useFamilyEmergencyStore.getState().contacts[0];

    updateTriageState({
      escalationVerdict: 'FAMILY_DISPATCH',
      activePrompt: `Manual Family SOS. Calling ${primary.name}...`,
    });
    await speakAudio(`Family SOS activated. Calling ${primary.name} and sending private SMS alerts.`);
    useFamilyEmergencyStore
      .getState()
      .dispatchFamilyOnlySOS('Manual Family SOS button clicked during voice triage', activeIncident?.zoneName || 'Living Area');
    setTimeout(() => {
      setIsActive(false);
      isTriggeredRef.current = false;
    }, 4000);
  };

  const handleForceClear = async () => {
    stopListening();
    updateTriageState({
      escalationVerdict: 'ABORTED',
      activePrompt: 'Protocol Aborted via Manual Override.',
    });
    await speakAudio('Safety code accepted, emergency protocol aborted and no messages dispatched.');
    resolveIncident();
    setTimeout(() => {
      setIsActive(false);
      isTriggeredRef.current = false;
    }, 4000);
  };

  const handleForceEscalate = async () => {
    stopListening();
    updateTriageState({
      escalationVerdict: 'EMS_DISPATCH',
      activePrompt: 'Manual EMS Dispatch Overridden.',
    });
    await speakAudio('Manual emergency override activated. Contacting dispatch.');
    window.dispatchEvent(
      new CustomEvent('ESCALATION_LEVEL_RAISED', {
        detail: { reason: 'Manual Emergency Override by Operator', urgency: 'CRITICAL' },
      })
    );
    setTimeout(() => {
      setIsActive(false);
      isTriggeredRef.current = false;
    }, 5000);
  };

  useEffect(() => {
    const onTrigger = (e: any) => {
      const confidence = activeIncident?.confidence || e?.detail?.confidence || 85;
      const posture = (e?.detail?.posture || 'horizontal') as TelemetryInput['postureState'];
      const stationarySec = e?.detail?.stationarySec || 38;

      startTriageProtocol({
        visionConfidence: confidence,
        postureState: posture,
        stationaryTimeSec: stationarySec,
      });
    };

    window.addEventListener('VOICE_ASSISTANT_TRIGGER', onTrigger);
    return () => {
      window.removeEventListener('VOICE_ASSISTANT_TRIGGER', onTrigger);
      stopListening();
    };
  }, [activeIncident]);

  if (!isActive) return null;

  const progressPercent = Math.min((triage.timeRemaining / initialTimeRef.current) * 100, 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg"
      >
        <div
          className={`p-6 rounded-3xl backdrop-blur-2xl border-2 shadow-2xl relative overflow-hidden space-y-4 ${
            triage.escalationVerdict === 'ABORTED'
              ? 'bg-emerald-950/90 border-emerald-500/60 shadow-[0_0_40px_rgba(34,197,94,0.4)]'
              : triage.escalationVerdict === 'EMS_DISPATCH'
              ? 'bg-red-950/90 border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.5)]'
              : triage.escalationVerdict === 'FAMILY_DISPATCH'
              ? 'bg-cyan-950/90 border-[#22D3EE]/60 shadow-[0_0_40px_rgba(34,211,238,0.4)]'
              : 'bg-amber-950/90 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.4)]'
          }`}
        >
          {/* Animated Background Scan Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none animate-pulse" />

          {/* Top Bar Badges */}
          <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                TRIAGE STEP {triage.dialogueStep} OF 2
              </span>
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-widest border ${
                  triage.protocolSeverity === 'CRITICAL'
                    ? 'bg-red-900/80 text-red-300 border-red-500'
                    : triage.protocolSeverity === 'HIGH'
                    ? 'bg-amber-900/80 text-amber-300 border-amber-500'
                    : 'bg-blue-900/80 text-blue-300 border-blue-500'
                }`}
              >
                {triage.protocolSeverity} SEVERITY
              </span>
            </div>

            <div className="text-xl font-mono font-black text-amber-400">
              00:{triage.timeRemaining.toString().padStart(2, '0')}
            </div>
          </div>

          {/* Error Banner */}
          {micError && (
            <div className="p-2.5 rounded-xl bg-red-900/80 border border-red-400 text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-300 shrink-0" />
              <span>{micError}</span>
            </div>
          )}

          {/* Active Question Prompt */}
          <div className="text-center space-y-1 relative z-10">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-white/70">
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>AI Audio Inquiry Prompt</span>
            </div>
            <h3 className="text-lg font-heading font-black text-white drop-shadow-md">
              "{triage.activePrompt}"
            </h3>
          </div>

          {/* Live Waveform & STT Speech Bubble */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2 relative z-10">
            {/* Live Audio Waveform Animation */}
            <div className="flex items-center justify-center gap-1 h-6">
              {[0.4, 0.9, 0.3, 0.7, 1.0, 0.6, 0.8, 0.4, 0.9].map((scale, i) => (
                <motion.div
                  key={`wave-${i}`}
                  className="w-1 rounded-full bg-amber-400"
                  animate={{ height: [`${scale * 8}px`, `${scale * 22}px`, `${scale * 8}px`] }}
                  transition={{ repeat: Infinity, duration: 0.8 + (i % 3) * 0.2 }}
                />
              ))}
            </div>

            <div className="text-center">
              <span className="text-[10px] font-mono text-white/50 block uppercase">
                Live Microphone Transcription (Say "Call Family" for Family SOS)
              </span>
              <p className="text-xs font-mono italic text-amber-200 font-bold min-h-[20px]">
                {triage.recognizedTranscript ? `"${triage.recognizedTranscript}..."` : 'Listening for response...'}
              </p>
            </div>
          </div>

          {/* Dynamic Countdown Bar */}
          <div className="space-y-1 relative z-10">
            <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/10">
              <motion.div
                className={`h-full ${
                  triage.protocolSeverity === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-400'
                }`}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Manual Action Buttons (Clear, Family Only SOS, Direct 102 EMS) */}
          <div className="grid grid-cols-3 gap-2 pt-2 relative z-10 border-t border-white/10">
            <button
              onClick={handleForceClear}
              className="py-2.5 px-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-[11px] font-mono font-bold transition-all shadow-md text-center"
            >
              CLEAR SAFE
            </button>
            <button
              onClick={handleTriggerFamilySOS}
              className="py-2.5 px-2 rounded-xl bg-[#22D3EE]/20 hover:bg-[#22D3EE]/30 border border-[#22D3EE]/60 text-[#22D3EE] text-[11px] font-mono font-bold transition-all shadow-md text-center flex items-center justify-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              CALL FAMILY
            </button>
            <a
              href="tel:102"
              onClick={handleForceEscalate}
              className="py-2.5 px-2 text-center rounded-xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-mono font-bold transition-all shadow-md flex items-center justify-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              DISPATCH 102
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

