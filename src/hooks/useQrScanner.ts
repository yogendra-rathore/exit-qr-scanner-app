import { useEffect, useRef, type RefObject } from 'react';
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';

type UseQrScannerArgs = {
  active: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  onResult: (text: string) => void;
  onError?: (err: unknown) => void;
};

/**
 * Starts camera + QR decode when `active` is true.
 * Tries to use the front camera; falls back to any available camera if not accessible.
 * Stops cleanly on unmount/deactivation.
 */
export function useQrScanner({ active, videoRef, onResult, onError }: UseQrScannerArgs) {
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!active || !videoRef.current) return;

    const reader = new BrowserMultiFormatReader();

    const startScanner = async (constraints: MediaStreamConstraints) => {
      try {
        await reader.decodeFromConstraints(constraints, videoRef.current!, (result, err, controls) => {
          if (err) {
            console.warn("QR decode error:", err);
          }

          if (controls && !controlsRef.current) controlsRef.current = controls;

          if (result && isMounted) {
            onResult(result.getText());
          }
        });
      } catch (e) {
        throw e; // Bubble up to outer handler
      }
    };

    (async () => {
      try {
        // Try using the front camera
        await startScanner({
          video: { facingMode: { exact: 'user' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch (err) {
        console.warn("Front camera not available, falling back to default camera:", err);

        // Fallback to any available camera
        try {
          await startScanner({
            video: { facingMode: 'user' }, // Try user-facing if available, or fallback to default
            audio: false
          });
        } catch (fallbackErr) {
          console.error("Camera access failed:", fallbackErr);
          onError?.(fallbackErr);
        }
      }
    })();

    return () => {
      isMounted = false;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [active, onResult, onError, videoRef]);
}
