import { useCallback, useRef, useState } from "react";
import IdleScreen from "./components/IdleScreen";
import ScannerScreen from "./components/ScannerScreen";
import ResultScreen from "./components/ResultScreen";
import type { VerifyStatus } from "./types";
import { api } from "./services/api";

export default function App() {
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [message, setMessage] = useState<string | undefined>(undefined);
  const verifyingRef = useRef(false); // debounce API calls

  const reset = useCallback(() => {
    verifyingRef.current = false;
    setMessage(undefined);
    setStatus("idle");
  }, []);

  const startScan = useCallback(() => {
    setMessage(undefined);
    setStatus("scanning");
  }, []);

  const handleApiResult = useCallback((ok: boolean, msg?: string) => {
    setMessage(msg);
    setStatus(ok ? "success" : "error");
  }, []);

  const verifyToken = useCallback(
    async (token: string) => {
      if (verifyingRef.current) return;
      verifyingRef.current = true;

      try {
        const res = await api.verifyQrToken(token);
        handleApiResult(res.success, res.message);
      } catch (e) {
        handleApiResult(
          false,
          e instanceof Error ? e.message : "Network error"
        );
      } finally {
        setTimeout(() => {
          verifyingRef.current = false;
        }, 300); // allow retry
      }
    },
    [handleApiResult]
  );

  const submitOrder = useCallback(
    async (orderId: string) => {
      if (!orderId?.trim() || verifyingRef.current) return;
      verifyingRef.current = true;
      setStatus("scanning"); // show spinner feel

      try {
        const res = await api.verifyOrderId(orderId.trim());
        handleApiResult(res.success, res.message);
      } catch (e) {
        handleApiResult(
          false,
          e instanceof Error ? e.message : "Network error"
        );
      } finally {
        setTimeout(() => {
          verifyingRef.current = false;
        }, 300);
      }
    },
    [handleApiResult]
  );

  return (
    <div className="app">
      <main
        className="container"
        onTouchStart={() => {
          /* ensures iOS treats as user-activated */
        }}
      >
        {status === "idle" && (
          <IdleScreen
            onStart={startScan}
            onSubmitOrder={submitOrder}
            submitting={verifyingRef.current}
          />
        )}

        {status === "scanning" && (
          <ScannerScreen onResult={verifyToken} onCancel={reset} />
        )}

        {status === "success" && <ResultScreen ok onReset={reset} />}

        {status === "error" && (
          <ResultScreen ok={false} message={message} onReset={reset} />
        )}
      </main>
    </div>
  );
}
