// ===== THEME TOGGLE =====
const themeToggleBtn = document.getElementById("theme-toggle");

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const body = document.body;
    const current = body.dataset.theme || "dark";
    const next = current === "dark" ? "light" : "dark";
    body.dataset.theme = next;
    themeToggleBtn.textContent =
      next === "dark" ? "☀️ Light mode" : "🌙 Dark mode";
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
    const prompt = `
Kamu adalah creative director UGC + scriptwriter market Indonesia.

GAYA BAHASA:
- Santai kayak chat WA, jelas, tidak bertele-tele.
- Fokus ke relevansi dan storytelling.

BRIEF:
- Niche/topik: ${v("niche") || "[isi niche/topik]"}
- Kategori konten: ${v("kategori") || "[storyselling / review / edukasi]"}
- Tujuan konten: ${v("tujuan") || "[jualan / naikin trust / followers]"}
- Target audiens: ${v("audience") || "[target audiens]"}
- Masalah audiens: ${v("masalah") || "[tulis 1–3 poin]"}
- Pesan inti konten: ${v("pesan") || "[pesan inti]"}
- Durasi + Platform: ${v("durasi") || "[7s TikTok / 15s Reels / Shopee]"}
- Format visual: ${v("visual") || "[talking head / B-roll]"}
- Tone: ${v("tone") || "[santai WA / elegan]"}
- CTA: ${v("cta") || "[cek keranjang / follow]"}

TUGAS:
Buat paket konten lengkap dengan struktur:
1) IDE KONTEN
2) 3 HOOK kuat (maks 1 kalimat)
3) SCRIPT VIDEO (per baris pendek)
   - STORYSELLING: Masalah → Penemuan → Transformasi → CTA
   - REVIEW PRODUK: Before → Coba → After → CTA
4) BREAKDOWN SHOT (min 4 shot urut)
5) CAPTION x2 (pendek & medium)
6) PROMPT untuk AI video/image (teknis visual)

Jawab rapi, bahasa Indonesia, format markdown.
`.trim();

    ugcOutput.value = prompt;
  });
}

if (ugcCopyBtn) {
  ugcCopyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(ugcOutput.value).then(() => {
      ugcCopyBtn.textContent = "✔ Tersalin";
      setTimeout(() => (ugcCopyBtn.textContent = "Copy UGC Prompt"), 1500);
    });
  });
}

// ===== IMAGE GENERATOR FLUX AI =====
const imageBtn = document.getElementById("image-btn");
const imagePromptInput = document.getElementById("image-prompt");
const imageStatus = document.getElementById("image-status");
const imageResult = document.getElementById("image-result");

if (imageBtn) {
  imageBtn.addEventListener("click", async () => {
    const prompt = imagePromptInput.value.trim();

    if (!prompt) {
      imageStatus.textContent = "⚠️ Isi prompt gambarnya dulu ya";
      return;
    }

    imageStatus.textContent = "⏳ Lagi generate gambar...";
    imageResult.style.display = "none";

    try {
      const res = await fetch("/api/generate-flux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok || !data.image) {
        console.error(data);
        imageStatus.textContent = "❌ Gagal generate gambar";
        return;
      }

      imageResult.src = data.image;
      imageResult.style.display = "block";
      imageStatus.textContent = "✨ Berhasil! gambar siap";
    } catch (err) {
      console.error(err);
      imageStatus.textContent = "❌ Server error / koneksi gagal";
    }
  });
}
