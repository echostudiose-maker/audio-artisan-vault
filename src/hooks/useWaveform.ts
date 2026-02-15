import { useState, useEffect } from 'react';

const cache = new Map<string, number[]>();

export function useWaveform(fileUrl: string, bars = 40): number[] | null {
  const [waveform, setWaveform] = useState<number[] | null>(cache.get(fileUrl) ?? null);

  useEffect(() => {
    if (cache.has(fileUrl)) {
      setWaveform(cache.get(fileUrl)!);
      return;
    }

    let cancelled = false;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    fetch(fileUrl)
      .then((res) => res.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((audioBuffer) => {
        if (cancelled) return;
        const rawData = audioBuffer.getChannelData(0);
        const blockSize = Math.floor(rawData.length / bars);
        const peaks: number[] = [];

        for (let i = 0; i < bars; i++) {
          let sum = 0;
          const start = i * blockSize;
          for (let j = start; j < start + blockSize; j++) {
            sum += Math.abs(rawData[j]);
          }
          peaks.push(sum / blockSize);
        }

        // Normalize to 0-1
        const max = Math.max(...peaks, 0.001);
        const normalized = peaks.map((p) => Math.max(0.05, p / max));

        cache.set(fileUrl, normalized);
        setWaveform(normalized);
      })
      .catch(() => {
        // Fallback: don't show waveform
      })
      .finally(() => {
        ctx.close().catch(() => {});
      });

    return () => {
      cancelled = true;
    };
  }, [fileUrl, bars]);

  return waveform;
}
