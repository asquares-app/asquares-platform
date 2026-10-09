type TranscriptLine = { role?: string; content?: string; message?: string; transcript?: string };

export function isBenignVapiEnd(err: unknown) {
  const blob = typeof err === "string" ? err : JSON.stringify(err ?? "");
  const lower = blob.toLowerCase();
  return (
    lower.includes("meeting has ended") ||
    lower.includes("meeting ended") ||
    lower.includes('"ejected"') ||
    lower.includes("type\":\"ejected") ||
    lower.includes("type\\\":\\\"ejected")
  );
}

/**
 * Fold Vapi client messages into a stable transcript.
 * Final transcript lines append; a conversation-update replaces the buffer.
 */
export function absorbCallMessage(lines: string[], message: unknown) {
  if (!message || typeof message !== "object") return;
  const msg = message as {
    type?: string;
    role?: string;
    transcript?: string;
    transcriptType?: string;
    call?: { id?: string };
    conversation?: TranscriptLine[];
    messages?: TranscriptLine[];
  };

  if (msg.type === "transcript") {
    const text = (msg.transcript ?? "").trim();
    if (!text) return;
    const role = msg.role === "user" ? "User" : "AI";
    const line = `${role}: ${text}`;
    const partialKey = `\u0000${role}:`;
    const partialIndex = lines.findIndex((item) => item.startsWith(partialKey));

    if (msg.transcriptType === "partial") {
      const partialLine = `${partialKey} ${text}`;
      if (partialIndex >= 0) lines[partialIndex] = partialLine;
      else lines.push(partialLine);
      return;
    }

    if (partialIndex >= 0) lines.splice(partialIndex, 1);
    if (lines[lines.length - 1] !== line) lines.push(line);
    return;
  }

  if (msg.type === "conversation-update") {
    const convo = msg.conversation ?? msg.messages ?? [];
    const rebuilt = convo
      .map((item) => {
        const text = (item.content || item.message || item.transcript || "").trim();
        if (!text) return "";
        const role = item.role === "user" ? "User" : "AI";
        return `${role}: ${text}`;
      })
      .filter(Boolean);
    if (rebuilt.length > 0) {
      lines.splice(0, lines.length, ...rebuilt);
    }
  }
}
