import { TextToSpeech } from "@capacitor-community/text-to-speech";

export class TtsService {
  async speak(text: string) {
    try {
      await TextToSpeech.speak({
        text,
        lang: "th-TH",
        rate: 1.0,
      });
    } catch (e) { console.error("TTS Error", e); }
  }
}