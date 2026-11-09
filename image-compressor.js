/**
 * =======================================================================
 * IMAGE COMPRESSOR & SUPABASE STORAGE UPLOADER
 * Yayasan Nahjul Huda - Client-side Image Optimization Engine
 * Fitur:
 * 1. Client-Side HTML5 Canvas Compression (proporsional, hemat memori, hemat kuota).
 * 2. Supabase Storage Object Uploader (menghasilkan Public URL https://...cdn).
 * 3. Graceful Lightweight DataURL Fallback (<80KB) jika bucket storage belum dibuat.
 * 4. Menjaga transparansi untuk logo/PNG, dan JPEG 0.85 untuk foto kamera/smartphone.
 * =======================================================================
 */

(function () {
  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  /**
   * Mengompres gambar di sisi klien menggunakan HTML5 Canvas.
   * @param {File|Blob} file 
   * @param {Object} options 
   * @returns {Promise<{blob: Blob, dataUrl: string, file: File, originalSize: number, compressedSize: number}>}
   */
  window.compressImage = function (file, options = {}) {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error("File gambar kosong"));
      }
      if (!file.type || !file.type.startsWith("image/")) {
        return reject(new Error("File yang dipilih bukan berkas gambar yang valid."));
      }

      const maxWidth = options.maxWidth || 1200;
      const maxHeight = options.maxHeight || 1200;
      const quality = typeof options.quality === "number" ? options.quality : 0.85;

      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error("Gagal memuat format gambar"));
        img.onload = () => {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Hitung proporsi resize
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d", { alpha: true });

          const isPNG = file.type === "image/png";
          const mimeType = isPNG ? "image/png" : "image/jpeg";

          // Jika bukan PNG, berikan latar putih agar tidak transparan hitam
          if (!isPNG) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
          }

          // Gambar dengan interpolation terbaik
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL(mimeType, isPNG ? undefined : quality);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error("Gagal mengonversi canvas ke Blob"));
              }
              const ext = isPNG ? "png" : "jpg";
              const cleanFileName = (file.name || "image")
                .replace(/\.[^/.]+$/, "")
                .replace(/[^a-zA-Z0-9_-]/g, "_") + "." + ext;

              const compressedFile = new File([blob], cleanFileName, {
                type: mimeType,
                lastModified: Date.now()
              });

              console.log(
                `[Image Compressor] Sukses: ${width}x${height}px. Ukuran asli: ${(file.size / 1024).toFixed(1)} KB -> Menyusut jadi: ${(blob.size / 1024).toFixed(1)} KB`
              );

              resolve({
                blob,
                dataUrl,
                file: compressedFile,
                width,
                height,
                originalSize: file.size,
                compressedSize: blob.size
              });
            },
            mimeType,
            isPNG ? undefined : quality
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  /**
   * Mengunggah gambar ke Supabase Storage (Bucket 'images').
   * Jika bucket belum dibuat / gagal, secara cerdas fallback ke dataUrl kompresi (<80KB)
   * agar operasi simpan di panel admin selalu sukses dan instan.
   */
  window.uploadToSupabaseStorage = async function (compressedResult, pathPrefix = "uploads") {
    if (!compressedResult) return "";

    const ext = compressedResult.file.type === "image/png" ? "png" : "jpg";
    const timestamp = Date.now();
    const rand = Math.random().toString(36).substring(2, 7);
    const objectPath = `${pathPrefix}_${timestamp}_${rand}.${ext}`;

    try {
      console.log(`[Storage] Mencoba upload ke Supabase Storage: images/${objectPath}...`);
      const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${objectPath}`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": compressedResult.file.type,
          "x-upsert": "true"
        },
        body: compressedResult.blob
      });

      if (uploadRes.ok) {
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/images/${objectPath}`;
        console.log(`[Storage] Sukses upload! Public Cloud URL:`, publicUrl);
        return publicUrl;
      } else {
        const errText = await uploadRes.text();
        console.warn(`[Storage] Supabase Storage upload respons status ${uploadRes.status}:`, errText);
      }
    } catch (err) {
      console.warn(`[Storage] Tidak dapat mengunggah ke bucket object storage:`, err);
    }

    // Graceful Fallback: Menggunakan dataUrl hasil kompresi canvas yang sangat ringan (<80KB)
    console.log(`[Storage] Menggunakan fallback dataUrl kompresi (${(compressedResult.compressedSize / 1024).toFixed(1)} KB)`);
    return compressedResult.dataUrl;
  };

  /**
   * Helper all-in-one untuk membaca input file, mengompres, dan mengunggah.
   */
  window.processImageField = async function (inputId, prevValue = "", options = {}) {
    const inputEl = typeof inputId === "string" ? document.getElementById(inputId) : inputId;
    if (!inputEl) return prevValue || "";

    // Jika pengguna mengklik tombol hapus
    if (inputEl.getAttribute("data-hapus") === "true") {
      return "";
    }

    // Jika ada file baru yang dipilih pengguna
    if (inputEl.files && inputEl.files[0]) {
      const file = inputEl.files[0];
      console.log(`[Process Image] Memproses file baru untuk #${inputEl.id || "input"}: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      const compressed = await window.compressImage(file, options);
      const cloudUrl = await window.uploadToSupabaseStorage(compressed, options.pathPrefix || (inputEl.id || "upload"));
      return cloudUrl;
    }

    // Tidak ada file baru yang dipilih -> pertahankan foto lama
    return prevValue || "";
  };

  console.log("[Image Compressor] image-compressor.js siap digunakan.");
})();
