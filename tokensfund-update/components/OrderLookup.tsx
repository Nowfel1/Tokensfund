"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Same alphabet the codes are generated from (lib/db.ts): no 0/O/1/I/L.
const CODE_RE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{12}$/;

export default function OrderLookup() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit() {
    // Accept pasted full URLs, dashes, spaces and lowercase.
    const raw = value.trim().split("/order/").pop() ?? "";
    const code = raw.replace(/[\s-]/g, "").toUpperCase();
    if (!code) {
      setError("Enter your order code first.");
      return;
    }
    if (!CODE_RE.test(code)) {
      setError("That doesn't look like an order code. It's 12 letters and numbers, like K7M4-PQX9-RTVB.");
      return;
    }
    router.push("/order/" + code);
  }

  return (
    <div className="ol-form">
      <input
        type="text"
        className="ol-input"
        placeholder="K7M4-PQX9-RTVB"
        value={value}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError("");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <button type="button" className="ol-btn" onClick={submit}>
        Check status
      </button>
      {error && <p className="ol-error">{error}</p>}
    </div>
  );
}
