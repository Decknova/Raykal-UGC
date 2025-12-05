// THEME TOGGLE
const themeToggleBtn = document.getElementById("theme-toggle");

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const body = document.body;
    const current = body.dataset.theme || "dark";
    const next = current === "dark" ? "light" : "dark";
    body.dataset.theme = next;
    themeToggleBtn.textContent = next === "dark" ? "☀️ Light mode" : "🌙 Dark mode";
  });
}

// ===== UGC PROMPT GENERATOR =====
const ugcBtn = document.getElementById("ugc-btn");
const ugcOutput = document.getElementById("ugc-output");
const ugcCopyBtn = document.getElementById("ugc-copy");

function v(id) {
  return (document.getElementById(id)?.value || "").trim();
}

if (ugcBtn) {
  ugcBtn.addEventListener("click", () => {
    const niche = v("niche") || "[isi niche/topik]";
    const kategori = v("kategori") || "[storyselling / review / edukasi / dll]";
    const tujuan = v("tujuan") || "[jualan / naikin trust / followers]";
    const audience = v("audience") || "[target audiens]";
    const masalah = v("masalah") || "[masalah / keinginan audiens]";
    const pesan = v("pesan") || "[pesan inti 1 kalimat]";
    const durasi = v("durasi") || "[durasi & platform]";
    const visual = v("visual") || "[talking head / B-roll / dll]";
    const tone = v("tone") || "[santai WA / elegan / bunda-friendly / dll]";
    const cta = v("cta") || "[cek keranjang / follow / save / share]";

    const prompt = `
Kamu adalah creative director UGC + scriptwriter untuk market Indonesia.

GAYA:
- Bahasa santai kayak chat WA, tapi tetap jelas dan sopan.
- Jawaban ringkas, gampang dibaca, nggak bertele-tele.

BRIEF KONTEN:
- Niche/topik: ${niche}
- Kategori konten: ${kategori}
- Tujuan konten: ${tujuan}
- Target audiens: ${audience}
- Masalah/keinginan audiens: ${masalah}
- Pesan inti: ${pesan}
- Platform + durasi: ${durasi}
- Format visual: ${visual}
- Tone bahasa: ${tone}
- Jenis CTA: ${cta}

TUGAS:
Buat paket konten UGC lengkap, dengan struktur berikut:

1) IDE KONTEN
- 1–2 kalimat, jelasin angle utama video.

2) 3 HOOK (0–3 detik)
- 3 pilihan hook yang kuat.
- Maks 1 kalimat per hook.
- Fokus ke masalah/keinginan audiens.

3) SCRIPT VIDEO
- Ditulis per baris, kalimat pendek-pendek.
- Sesuaikan dengan kategori:
  - STORYSELLING: Masalah → Penemuan → Transformasi → Undangan (CTA).
  - REVIEW: Sebelum → Coba produk → Setelah → CTA.
  - EDUKASI: Hook → Problem → Tips poin-poin → CTA.
  - SOFT/HARD SELLING: Trigger emosi → solusi → bukti singkat → CTA.

4) BREAKDOWN SHOT / VISUAL
- Minimal 4 shot urut.
- Format: "Shot 1: [deskripsi] – [jenis kamera / angle]".

5) CAPTION + CTA
- 1 caption pendek (≤ 15 kata).
- 1 caption medium (2–3 kalimat, tetap simple).
- Sesuaikan dengan CTA di brief.

6) PROMPT AI (opsional)
- 1 prompt deskriptif untuk generator video/image AI
  (mood, lighting, gaya kamera, karakter).

Jawab semua dalam bahasa Indonesia, rapih pakai heading & poin.
`.trim();

    ugcOutput.value = prompt;
  });
}

if (ugcCopyBtn) {
  ugcCopyBtn.addEventListener("click", () => {
    if (!ugcOutput.value) return;
    navigator.clipboard.writeText(ugcOutput.value).then(() => {
      ugcCopyBtn.textContent = "✅ Tersalin";
      setTimeout(() => (ugcCopyBtn.textContent = "Copy UGC Prompt"), 1500);
    });
  });
}

// ===== IMAGE GENERATOR GEMINI =====
const imageBtn = document.getElementById("image-btn");
const imagePromptInput = document.getElementById("image-prompt");
const aspectSelect = document.getElementById("aspect");
const imageStatus = document.getElementById("image-status");
const imageResult = document.getElementById("image-result");

if (imageBtn) {
  imageBtn.addEventListener("click", async () => {
    const prompt = imagePromptInput.value.trim();
    const aspect = aspectSelect.value;

    if (!prompt) {
      imageStatus.textContent = "Isi dulu prompt gambarnya 🙏";
      return;
    }

    imageStatus.textContent = "Lagi generate gambar dari Gemini...";
    imageResult.style.display = "none";

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio: aspect }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        imageStatus.textContent = "Gagal generate gambar 😥";
        return;
      }

      const src = `data:${data.mimeType};base64,${data.image}`;
      imageResult.src = src;
      imageResult.style.display = "block";
      imageStatus.textContent = "Berhasil! 🎨";
    } catch (err) {
      console.error(err);
      imageStatus.textContent = "Error koneksi ke server.";
    }
  });
}
