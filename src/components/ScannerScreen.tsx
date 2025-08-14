import { useCallback, useMemo, useRef, useState } from "react";
import { useQrScanner } from "../hooks/useQrScanner";

type Props = {
  onResult: (text: string) => void;
  onCancel: () => void;
};

export default function ScannerScreen({ onResult, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permError, setPermError] = useState<string | null>(null);

  const handleErr = useCallback((e: unknown) => {
    const msg = e instanceof Error ? e.message : "Camera error";
    setPermError(msg);
  }, []);

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
