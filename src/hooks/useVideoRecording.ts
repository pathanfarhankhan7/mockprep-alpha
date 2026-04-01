import { useState, useRef, useCallback, useEffect } from "react";

export interface VideoRecordingState {
  isRecording: boolean;
  hasPermission: boolean | null; // null = not yet determined
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  recordedBlob: Blob | null;
  videoUrl: string | null;
  error: string | null;
  stream: MediaStream | null; // live stream for preview
}

export function useVideoRecording(enabled: boolean): VideoRecordingState {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  // Revoke object URLs when they change to avoid memory leaks
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  // Clean up stream and recorder on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
    // stopStream is stable (empty deps) so omitting it is intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = useCallback(async () => {
    if (!enabled) return;

    setError(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      setStream(stream);
      setHasPermission(true);

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "video/webm",
        });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        stopStream();
      };

      recorder.onerror = () => {
        setError("Recording failed. Please try again.");
        setIsRecording(false);
        stopStream();
      };

      recorder.start(1000); // collect data every second
      setIsRecording(true);
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Camera/microphone access was denied. Recording is disabled."
          : "Could not access camera. Recording is disabled.";
      setError(message);
      setHasPermission(false);
    }
  }, [enabled, stopStream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return {
    isRecording,
    hasPermission,
    startRecording,
    stopRecording,
    recordedBlob,
    videoUrl,
    error,
    stream,
  };
}

function getSupportedMimeType(): string | null {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return null;
}
