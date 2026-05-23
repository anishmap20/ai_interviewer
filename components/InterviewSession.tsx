import { speakViaRelay } from "@/lib/supertone";

async function speakText(text: string) {
  return new Promise<void>((resolve) => {
    const chunks: ArrayBuffer[] = [];

    speakViaRelay(
      text,
      (chunk) => chunks.push(chunk),   // collect audio chunks
      () => {
        // all chunks received — combine and play
        const blob = new Blob(chunks, { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        setTtsAudioUrl(url);   // AudioPlayer will autoplay this
        resolve();
      }
    );
  });
}
