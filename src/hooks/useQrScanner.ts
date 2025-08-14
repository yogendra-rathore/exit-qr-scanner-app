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
 * Stops cleanly on unmount/deactivation. Uses back camera on tablets/phones.
 */
export function useQrScanner({ active, videoRef, onResult, onError }: UseQrScannerArgs){
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    let isMounted = true;
    if(!active || !videoRef.current) return;

    const reader = new BrowserMultiFormatReader();

    (async () => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        await reader.decodeFromConstraints(constraints, videoRef.current!, (result, err, controls) => {
            console.log("Error while decoding",err);
            
          if(controls && !controlsRef.current) controlsRef.current = controls;
          if(result && isMounted){
            onResult(result.getText());
          }
          // ignore decoding errors; stream continues
        });
      } catch (e){
        onError?.(e);
      }
    })();

    return () => {
      isMounted = false;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [active, onResult, onError, videoRef]);
}
