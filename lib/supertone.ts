// lib/supertone.ts
// Connects to the WebSocket TTS relay server

export function speakViaRelay(
  text: string,
  onAudioChunk: (chunk: ArrayBuffer) => void,
  onDone: () => void
) {
  const url = process.env.NEXT_PUBLIC_VOICE_RELAY_URL;
  if (!url) throw new Error("NEXT_PUBLIC_VOICE_RELAY_URL not set in .env.local");

  const socket = new WebSocket(url);
  socket.binaryType = "arraybuffer";

  socket.onopen = () => {
    socket.send(JSON.stringify({ text }));
  };

  socket.onmessage = (event) => {
    if (event.data instanceof ArrayBuffer) {
      onAudioChunk(event.data);   // audio bytes coming in
    } else {
      // maybe a JSON status message — check what the server sends
      try {
        const msg = JSON.parse(event.data);
        if (msg.status === "done" || msg.type === "end") {
          onDone();
          socket.close();
        }
      } catch {
        // ignore non-JSON text frames
      }
    }
  };

  socket.onerror = (e) => console.error("TTS relay error:", e);
  socket.onclose = () => onDone();
}
