import { useState } from "react";
import Frame from "./Frame";

type Props = {
  onStart: () => void;
  onSubmitOrder: (orderId: string) => void;
  submitting: boolean;
};

export default function IdleScreen({
  onStart,
  onSubmitOrder,
  submitting,
}: Props) {
  const [orderId, setOrderId] = useState("");

  return (
    <div className="stack-24" style={{ width: "100%" }}>
      <h1 className="title">
        Please position the QR code from your Purchase Confirmation screen over
        the scanning area on this tablet, thanks.
      </h1>

      <Frame />

      <div className="row">
        <button className="button" onClick={onStart}>
          Start
        </button>
        <button className="button" onClick={onStart}>
          Retry
        </button>
      </div>

      <div className="or">OR</div>

      <div className="row">
        <input
          className="input"
          inputMode="numeric"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          className="button"
          onClick={() => onSubmitOrder(orderId)}
          disabled={!orderId || submitting}
        >
          Submit
        </button>
      </div>
      <div className="footerGap" />
    </div>
  );
}
