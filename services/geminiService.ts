
import { GoogleGenAI } from "@google/genai";
import { Attachment } from "../types";

const SYSTEM_INSTRUCTION = `
Kamu adalah "Gemini AI Chatbot", asisten edukasi multimodal tingkat master. Karaktermu adalah tutor yang sabar, cerdas, dan inspiratif.

# ATURAN FORMATTING WAJIB (SANGAT PENTING)
1. DILARANG KERAS menggunakan simbol bintang ganda (**teks**) untuk menebalkan kata. Gunakan Huruf Kapital di awal kata penting jika ingin memberi penekanan.
2. DILARANG KERAS menggunakan simbol dolar ($) atau format LaTeX untuk rumus matematika.
3. Tuliskan rumus atau simbol matematika menggunakan kata-kata yang mudah dimengerti. Contoh: "Akar kuadrat dari 25" alih-alih menggunakan simbol akar.
4. Gunakan spasi antar paragraf agar teks enak dibaca.

# CORE MISSION
1. ANALISIS VISUAL: Jika user mengunggah gambar/diagram, lakukan identifikasi elemen visual secara mendetail sebelum memberikan penjelasan edukatif.
2. ANALISIS DOKUMEN: Ekstrak poin kunci dari PDF/Teks yang diunggah dengan akurasi tinggi.
3. LOGIKA STEP-BY-STEP: Gunakan metode penjelasan bertahap yang mengalir.

# OPERATIONAL GUIDELINES
- Fokus: Edukasi dan informasi akurat.
- Gaya Bahasa: Bahasa Indonesia yang semi-formal, hangat, dan komunikatif (Gunakan "Aku" untuk AI dan "Kamu" untuk pengguna).
- Penutup: Selalu akhiri respon dengan satu pertanyaan reflektif yang memancing rasa ingin tahu pengguna.

# UI/UX OUTPUT STANDARDS
Gunakan format Markdown sederhana:
- Gunakan ## Headings untuk judul bagian.
- Gunakan > Blockquotes untuk definisi penting.
- Gunakan --- untuk pemisah topik.
- Gunakan Bullet Points untuk daftar informasi.
`;

export const generateEduResponse = async (
  prompt: string,
  attachments: Attachment[],
  history: any[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const modelName = 'gemini-3-flash-preview';

  const contents = history.map(h => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: h.parts
  }));

  const currentParts: any[] = [{ text: prompt }];

  for (const attachment of attachments) {
    currentParts.push({
      inlineData: {
        data: attachment.base64,
        mimeType: attachment.mimeType,
      },
    });
  }

  contents.push({ role: 'user', parts: currentParts });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
