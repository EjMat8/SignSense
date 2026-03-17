"use client";

import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export type CameraFeedHandle = {
  captureFrame: () => Promise<Blob>;
};

type CameraFeedProps = {
  /** Called when camera permission is granted and feed is ready (or on error/cleanup with false). */
  onCameraReady?: (ready: boolean) => void;
  enabled?: boolean;
};

export const CameraFeed = forwardRef<CameraFeedHandle, CameraFeedProps>(
  function CameraFeed({ onCameraReady, enabled = true }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const handsRef = useRef<any | null>(null);
    const lastHandBoxRef = useRef<{
      xMin: number;
      yMin: number;
      xMax: number;
      yMax: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastCropPreview, setLastCropPreview] = useState<string | null>(null);
    const onCameraReadyRef = useRef(onCameraReady);
    onCameraReadyRef.current = onCameraReady;

    useImperativeHandle(ref, () => ({
      captureFrame: () =>
        new Promise<Blob>((resolve, reject) => {
          const video = videoRef.current;
          if (!video || video.readyState < 2) {
            reject(new Error("Video not ready"));
            return;
          }
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("No canvas context"));
            return;
          }
          // Draw full frame first
          ctx.drawImage(video, 0, 0);

          const box = lastHandBoxRef.current;
          if (box) {
            // Crop to last detected hand region
            const cropCanvas = document.createElement("canvas");
            const cropW = box.xMax - box.xMin;
            const cropH = box.yMax - box.yMin;
            cropCanvas.width = cropW;
            cropCanvas.height = cropH;
            const cropCtx = cropCanvas.getContext("2d");
            if (!cropCtx) {
              reject(new Error("No crop canvas context"));
              return;
            }
            cropCtx.drawImage(
              canvas,
              box.xMin,
              box.yMin,
              cropW,
              cropH,
              0,
              0,
              cropW,
              cropH
            );
            // Update debug preview
            try {
              setLastCropPreview(cropCanvas.toDataURL("image/jpeg", 0.7));
            } catch {
              // ignore preview errors
            }
            cropCanvas.toBlob(
              (blob) =>
                blob ? resolve(blob) : reject(new Error("Failed to capture")),
              "image/jpeg",
              0.9
            );
          } else {
            // Fallback to full frame when no hand detected yet
            try {
              setLastCropPreview(canvas.toDataURL("image/jpeg", 0.7));
            } catch {
              // ignore preview errors
            }
            canvas.toBlob(
              (blob) =>
                blob ? resolve(blob) : reject(new Error("Failed to capture")),
              "image/jpeg",
              0.9
            );
          }
        }),
    }));

    useEffect(() => {
      if (!enabled) return;

      let cancelled = false;
      let rafId: number | null = null;

      async function run() {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: 640, height: 480 },
          });
          if (cancelled) {
            mediaStream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = mediaStream;
          const video = videoRef.current;
          if (!video) return;
          video.srcObject = mediaStream;
          await video.play();

          const { Hands } = await import("@mediapipe/hands");

          const hands = new Hands({
            locateFile: (file) =>
              `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
          });
          hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
          hands.onResults((results: any) => {
            const image = results.image;
            if (!image || !results.multiHandLandmarks?.length) {
              lastHandBoxRef.current = null;
              return;
            }
            const landmarks = results.multiHandLandmarks[0];
            const xs = landmarks.map((lm) => lm.x);
            const ys = landmarks.map((lm) => lm.y);
            const xMinN = Math.max(0, Math.min(...xs));
            const xMaxN = Math.min(1, Math.max(...xs));
            const yMinN = Math.max(0, Math.min(...ys));
            const yMaxN = Math.min(1, Math.max(...ys));

            const w = video.videoWidth;
            const h = video.videoHeight;
            const pad = 0.2;
            let xMin = Math.floor((xMinN - pad) * w);
            let xMax = Math.ceil((xMaxN + pad) * w);
            let yMin = Math.floor((yMinN - pad) * h);
            let yMax = Math.ceil((yMaxN + pad) * h);
            xMin = Math.max(0, xMin);
            yMin = Math.max(0, yMin);
            xMax = Math.min(w, xMax);
            yMax = Math.min(h, yMax);
            if (xMax > xMin && yMax > yMin) {
              const box = { xMin, yMin, xMax, yMax };
              lastHandBoxRef.current = box;

              const overlay = overlayRef.current;
              if (overlay) {
                overlay.width = w;
                overlay.height = h;
                const ctx = overlay.getContext("2d");
                if (ctx) {
                  ctx.clearRect(0, 0, overlay.width, overlay.height);
                  ctx.strokeStyle = "#22c55e";
                  ctx.lineWidth = 4;
                  ctx.beginPath();
                  ctx.roundRect(
                    box.xMin,
                    box.yMin,
                    box.xMax - box.xMin,
                    box.yMax - box.yMin,
                    12
                  );
                  ctx.stroke();
                }
              }
            } else {
              lastHandBoxRef.current = null;
              const overlay = overlayRef.current;
              if (overlay) {
                const ctx = overlay.getContext("2d");
                ctx?.clearRect(0, 0, overlay.width, overlay.height);
              }
            }
          });

          handsRef.current = hands;

          const loop = async () => {
            if (cancelled || !videoRef.current) return;
            try {
              await hands.send({ image: videoRef.current });
            } catch {}
            rafId = requestAnimationFrame(loop);
          };
          loop();

          if (!cancelled) onCameraReadyRef.current?.(true);
        } catch (e) {
          if (!cancelled) {
            setError(
              e instanceof Error ? e.message : "Could not access camera"
            );
            onCameraReadyRef.current?.(false);
          }
        }
      }

      run();
      return () => {
        cancelled = true;
        if (rafId !== null) cancelAnimationFrame(rafId);
        onCameraReadyRef.current?.(false);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        handsRef.current?.close();
        handsRef.current = null;
        lastHandBoxRef.current = null;
        const overlay = overlayRef.current;
        if (overlay) {
          const ctx = overlay.getContext("2d");
          ctx?.clearRect(0, 0, overlay.width, overlay.height);
        }
      };
    }, [enabled]);

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-destructive/10 rounded-3xl aspect-[4/3] flex flex-col items-center justify-center gap-3 border-2 border-destructive/30 p-4"
        >
          <Camera className="w-10 h-10 text-destructive" />
          <p className="text-sm font-bold text-destructive text-center">
            {error}
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Allow camera access to use the camera.
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-foreground/5 rounded-3xl aspect-[4/3] border-2 border-border relative overflow-hidden"
      >
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
          style={{ transform: "scaleX(-1)" }}
        />
        <canvas
          ref={overlayRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        {lastCropPreview && (
          <div className="absolute bottom-3 left-3 border border-white/60 rounded-lg overflow-hidden bg-black/60 shadow-lg">
            <img
              src={lastCropPreview}
              alt="Last cropped hand preview"
              className="w-28 h-20 object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.1)_100%)] pointer-events-none" />
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-bold text-foreground">LIVE</span>
        </div>
      </motion.div>
    );
  }
);

export function CameraFeedPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-foreground/5 rounded-3xl aspect-[4/3] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.03)_100%)]" />
      <div className="bg-card rounded-2xl p-4 shadow-md">
        <Camera className="w-10 h-10 text-muted-foreground" />
      </div>
      <p className="text-sm font-bold text-muted-foreground">Camera Feed</p>
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
        <span className="text-xs font-bold text-destructive">LIVE</span>
      </div>
    </motion.div>
  );
}
