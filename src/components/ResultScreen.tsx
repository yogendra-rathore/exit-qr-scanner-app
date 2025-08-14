type Props = {
  ok: boolean;
  message?: string;
  onReset: () => void;
};

export default function ResultScreen({ ok, message, onReset }: Props) {
  return (
    <div className="stack-24" style={{ width: "100%", textAlign: "center" }}>
      <h1 className="title">Scanning Result</h1>

      <div className={`resultIcon ${ok ? "success" : "error"}`}>
        {ok ? (
          <svg
            className="check"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M20 6L9 17l-5-5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className="cross"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {ok ? (
        <p className="helper" style={{ fontSize: 18 }}>
          All good! Thank you for shopping with <br />
          Neighbors Market on Nimble
        </p>
      ) : (
        <p
          className="helper"
          style={{ fontSize: 18, maxWidth: 540, margin: "0 auto" }}
        >
          Hi! There&apos;s an issue with your order. Please see one of our team
          members to resolve this. We apologize for the inconvenience.
          {message ? ` (${message})` : ""}
        </p>
      )}

      <button className="button" onClick={onReset}>
        {ok ? "Done" : "Try Again"}
      </button>
      <div className="footerGap" />
    </div>
  );
}
