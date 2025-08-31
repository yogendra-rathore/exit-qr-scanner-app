import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useQrScanner } from "../hooks/useQrScanner";

type Props = {
  onResult: (text: string) => void;
  onCancel: () => void;
};

export default function ScannerScreen({ onResult, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permError, setPermError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleErr = useCallback((e: unknown) => {
    const msg = e instanceof Error ? e.message : "Camera error";
    setPermError(msg);
  }, []);

  useEffect(() => {
    // Request **front camera** explicitly
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { exact: "user" } }, // force front camera
        audio: false,
      })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.warn(
          "Front camera not available, fallback to default camera",
          err
        );

        // fallback to any available camera
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((mediaStream) => {
            setStream(mediaStream);
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
            }
          })
          .catch(handleErr);
      });

    return () => {
      // Clean up camera stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [handleErr]);

  useQrScanner({
    active: true,
    videoRef,
    onResult,
    onError: handleErr,
  });

  const helper = useMemo(() => {
    return permError
      ? "Camera access error. Please allow camera permission in the browser settings and try again."
      : "Scanning QR code on your mobile device";
  }, [permError]);

  return (
    <div className="stack-16" style={{ width: "100%" }}>
      <h1 className="title">
        Please position the QR code from your Purchase Confirmation screen over
        the scanning area on this tablet, thanks.
      </h1>

      <div className="videoWrap">
        <video ref={videoRef} muted playsInline autoPlay />
        {/* translucent scanning bar */}
        <div className="scanbar">
          <div className="scanline" />
        </div>
      </div>

      <div className="card">
        <div className="spinner" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong>{helper}</strong>
          {!permError && (
            <span className="helper">
              Please wait, scanning QR code on your mobile device…
            </span>
          )}
        </div>
      </div>

      <button className="button" onClick={onCancel}>
        Cancel
      </button>
      <div className="footerGap" />
    </div>
  );
}
