<template>
  <div
    id="identify"
    class="bg-[#ae9173] min-h-screen flex items-center justify-center p-4 font-sans"
  >
    <div
      class="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 transition-all duration-500"
    >
      <div v-if="!uploadedImage" class="text-center">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            Identifikasi Daun Tembakau Anda
          </h1>
          <p class="text-gray-500">
            Unggah gambar daun tembakau untuk identifikasi daun tembakau anda
          </p>
        </div>

        <!-- Modern Upload Card -->
        <div
          class="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 mb-6 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50/20"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
          :class="{ 'border-indigo-500 bg-indigo-50/30': dragOver }"
        >
          <div class="flex flex-col items-center justify-center space-y-4">
            <div class="p-4 bg-indigo-100 rounded-full">
              <Upload class="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <p class="font-medium text-gray-700">
                <span class="text-indigo-600">Klik untuk mengunggah</span> atau
                seret & lepas
              </p>
              <p class="text-sm text-gray-400 mt-1">
                Format: PNG, JPG, atau WEBP (maks. 10MB)
              </p>
            </div>
            <input
              type="file"
              ref="galleryInputRef"
              @change="handleImageUpload"
              accept="image/*"
              class="hidden"
            />
            <button
              @click="triggerGalleryInput"
              class="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Pilih File
            </button>
          </div>
        </div>

        <!-- Or Divider -->
        <div class="flex items-center my-6">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="mx-4 text-gray-400 text-sm">ATAU</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Camera Button -->
        <div
          class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-0.5"
        >
          <button
            @click="openCamera"
            class="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-indigo-600 font-bold py-4 px-6 rounded-[11px] transition-all duration-300 shadow-sm"
          >
            <div class="p-2 bg-indigo-100 rounded-full">
              <Camera class="w-5 h-5 text-indigo-600" />
            </div>
            <span>Ambil Foto dengan Kamera</span>
          </button>
        </div>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="flex flex-col">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Gambar Anda</h3>
            <div
              class="relative w-full h-80 rounded-lg shadow-md overflow-hidden"
            >
              <img
                :src="uploadedImage"
                alt="Uploaded tobacco leaf"
                class="w-full h-full object-cover"
              />
            </div>
            <button
              @click="resetAnalysis"
              class="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-sm"
            >
              Analisis Gambar Lain
            </button>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-4">Hasil Analisis</h3>
            <div v-if="isAnalyzing" class="space-y-4">
              <div class="animate-pulse flex space-x-4">
                <div class="flex-1 space-y-4 py-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="space-y-2">
                    <div class="h-4 bg-gray-200 rounded"></div>
                    <div class="h-8 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div class="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
              <p class="text-center text-gray-500 font-medium">
                Menganalisis gambar...
              </p>
            </div>
            <div v-if="analysisResult && !isAnalyzing" class="space-y-5">
              <div class="flex items-center justify-between">
                <h2
                  class="text-2xl font-bold"
                  :class="analysisResult.progressClass"
                >
                  {{ analysisResult.disease }}
                </h2>
                <span
                  :class="analysisResult.badgeClass"
                  class="text-sm font-semibold px-3 py-1 rounded-full"
                  >{{ analysisResult.status }}</span
                >
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600"
                  >Tingkat Keyakinan: {{ analysisResult.accuracy }}%</label
                >
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    class="h-2.5 rounded-full transition-all duration-500"
                    :class="analysisResult.progressBarBgClass"
                    :style="{ width: analysisResult.accuracy + '%' }"
                  ></div>
                </div>
              </div>
              <div class="space-y-4 pt-2">
                <div class="p-4 border rounded-lg bg-gray-50">
                  <div class="flex items-center mb-2">
                    <Microscope class="w-5 h-5 mr-3 text-indigo-500" />
                    <h4 class="font-semibold text-gray-800">Deskripsi</h4>
                  </div>
                  <p class="text-gray-600 text-sm">
                    {{ analysisResult.description }}
                  </p>
                </div>
                <div class="p-4 border rounded-lg bg-gray-50">
                  <div class="flex items-center mb-2">
                    <Leaf class="w-5 h-5 mr-3 text-green-500" />
                    <h4 class="font-semibold text-gray-800">
                      Kemungkinan Penyebab
                    </h4>
                  </div>
                  <p class="text-gray-600 text-sm">
                    {{ analysisResult.cause }}
                  </p>
                </div>
                <div
                  class="p-4 border rounded-lg bg-yellow-50 border-yellow-200"
                >
                  <div class="flex items-center mb-2">
                    <Shield class="w-5 h-5 mr-3 text-yellow-500" />
                    <h4 class="font-semibold text-gray-800">
                      Rekomendasi & Penanganan
                    </h4>
                  </div>
                  <p class="text-gray-600 text-sm">
                    {{ analysisResult.rekomendasi }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isCameraOpen"
      class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <div class="bg-gray-800 p-4 rounded-lg shadow-2xl max-w-4xl w-full">
        <p class="text-white text-center mb-2">Pratinjau Kamera</p>
        <video
          ref="videoRef"
          autoplay
          playsinline
          muted
          class="w-full h-auto max-h-[70vh] rounded"
        ></video>
        <canvas ref="canvasRef" class="hidden"></canvas>
        <div class="flex justify-center gap-4 mt-4">
          <button
            @click="capturePhoto"
            class="bg-indigo-600 text-white rounded-full p-4 hover:bg-indigo-700 transition-colors"
          >
            <Camera class="w-8 h-8" />
          </button>
          <button
            @click="closeCamera"
            class="bg-red-600 text-white rounded-full p-4 hover:bg-red-700 transition-colors"
          >
            <X class="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"; // 'nextTick' perlu diimpor
import { Upload, Microscope, X, Leaf, Shield, Camera } from "lucide-vue-next";

// --- BAGIAN STATE ---
type AnalysisData = {
  accuracy: number;
  disease: string;
  description: string;
  cause: string;
  status: string;
  rekomendasi: string;
  theme: "green" | "yellow" | "orange" | "red";
  badgeClass: string;
  progressClass: string;
  // [FIX] Tambahkan properti baru untuk kelas background progress bar
  progressBarBgClass: string;
};

const uploadedImage = ref<string | null>(null);
const analysisResult = ref<AnalysisData | null>(null);
const isAnalyzing = ref(false);
const dragOver = ref(false);
const galleryInputRef = ref<HTMLInputElement | null>(null);

// --- BAGIAN LOGIKA KAMERA ---
const isCameraOpen = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const streamRef = ref<MediaStream | null>(null);

const openCamera = async () => {
  isCameraOpen.value = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    streamRef.value = stream;
    await nextTick();
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
    }
  } catch (error) {
    console.error("Gagal mengakses kamera:", error);
    alert(
      "Tidak dapat mengakses kamera. Pastikan Anda memberikan izin dan tidak ada aplikasi lain yang sedang menggunakannya."
    );
    isCameraOpen.value = false;
  }
};

const closeCamera = () => {
  if (streamRef.value) {
    streamRef.value.getTracks().forEach((track) => track.stop());
  }
  isCameraOpen.value = false;
};

const capturePhoto = () => {
  if (!videoRef.value || !canvasRef.value) return;

  const video = videoRef.value;
  const canvas = canvasRef.value;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");
  context?.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    if (blob) {
      const fileName = `capture-${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });
      startAnalysisWithFile(file);
    }
  }, "image/jpeg");

  closeCamera();
};

// --- BAGIAN UPLOAD GALERI ---
const triggerGalleryInput = () => {
  galleryInputRef.value?.click();
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    startAnalysisWithFile(file);
  }
};

const handleDrop = (e: DragEvent) => {
  dragOver.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length && files[0].type.match("image.*")) {
    startAnalysisWithFile(files[0]);
  }
};

// --- LOGIKA UTAMA ---
const startAnalysisWithFile = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
  performAnalysis(file);
};

const resetAnalysis = () => {
  uploadedImage.value = null;
  analysisResult.value = null;
  if (galleryInputRef.value) {
    galleryInputRef.value.value = "";
  }
};

const performAnalysis = async (file: File) => {
  if (!file) return;
  isAnalyzing.value = true;
  analysisResult.value = null;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const apiEndpoint = "https://flask-tobacco.euphemia.site/predict";
    const response = await fetch(apiEndpoint, {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    mapApiResponseToAnalysisData(response);
  } catch (error) {
    console.error("Gagal saat memanggil API:", error);
    analysisResult.value = {
      disease: "Error Koneksi",
      status: "Error",
      description: "Gagal terhubung ke server analisis.",
      cause: "Masalah jaringan atau server sedang down.",
      rekomendasi: "Periksa koneksi internet Anda dan coba lagi.",
      accuracy: 0,
      theme: "red",
      badgeClass: getBadgeClass("red"),
      progressClass: "text-red-500",
      // [FIX] Tambahkan kelas background untuk state error
      progressBarBgClass: "bg-red-500",
    };
  } finally {
    isAnalyzing.value = false;
  }
};

const diseaseKnowledgeBase = {
  "no cercospora nicotianae or alternaria alternata present": {
    displayName: "Daun Sehat",
    description:
      "Tidak ditemukan indikasi visual dari penyakit jamur Cercospora maupun Alternaria. Daun tampak dalam kondisi sehat.",
    cause:
      "Praktik agronomi yang baik, nutrisi seimbang, dan lingkungan yang mendukung pertumbuhan tanaman.",
    rekomendasi:
      "Pertahankan praktik perawatan rutin. Lakukan pemantauan berkala untuk deteksi dini masalah di masa depan.",
    theme: "green" as const,
    status: "Sehat",
    progressClass: "text-green-500",
    // [FIX] Definisikan kelas background secara eksplisit
    progressBarBgClass: "bg-green-500",
  },
  "cercospora nicotianae": {
    displayName: "Bercak Daun Cercospora",
    description:
      "Terdeteksi bercak nekrotik khas berwarna coklat muda hingga abu-abu dengan tepi gelap yang jelas, seringkali disebut 'mata katak' (frog-eye spot).",
    cause:
      "Disebabkan oleh jamur Cercospora nicotianae. Jamur ini berkembang pesat dalam kondisi cuaca yang hangat dan lembab.",
    rekomendasi:
      "Gunakan fungisida sistemik atau kontak yang sesuai anjuran. Tingkatkan sirkulasi udara di sekitar tanaman dan hindari penyiraman dari atas daun.",
    theme: "orange" as const,
    status: "Penyakit Terdeteksi",
    progressClass: "text-orange-500",
    // [FIX] Definisikan kelas background secara eksplisit
    progressBarBgClass: "bg-orange-500",
  },
  "alternaria alternata": {
    displayName: "Bercak Daun Alternaria",
    description:
      "Teridentifikasi bercak berwarna coklat kehitaman, seringkali dengan pola cincin konsentris yang khas seperti papan target.",
    cause:
      "Disebabkan oleh jamur Alternaria alternata. Penyakit ini sering menyerang daun yang lebih tua dan pada kondisi kelembaban udara yang tinggi.",
    rekomendasi:
      "Segera buang dan musnahkan daun yang terinfeksi untuk mengurangi sumber spora. Aplikasikan fungisida yang mengandung mancozeb atau chlorothalonil. Jaga kebersihan lahan dari gulma.",
    theme: "yellow" as const,
    status: "Penyakit Terdeteksi",
    progressClass: "text-yellow-500",
    // [FIX] Definisikan kelas background secara eksplisit
    progressBarBgClass: "bg-yellow-500",
  },
};

const mapApiResponseToAnalysisData = (response: {
  predictions: { class: string; confidence: number }[];
}) => {
  if (!response.predictions || response.predictions.length === 0) {
    analysisResult.value = {
      disease: "Respon Tidak Valid",
      status: "Error",
      description:
        "Server memberikan respon dengan format yang tidak dikenali.",
      cause: "Kemungkinan ada perubahan pada format output API.",
      rekomendasi: "Hubungi administrator sistem.",
      accuracy: 0,
      theme: "red",
      badgeClass: getBadgeClass("red"),
      progressClass: "text-red-500",
      // [FIX] Tambahkan kelas background untuk state error
      progressBarBgClass: "bg-red-500",
    };
    return;
  }

  const topPrediction = response.predictions[0];
  const predictedClass = topPrediction.class.trim();
  const knownDisease =
    diseaseKnowledgeBase[predictedClass as keyof typeof diseaseKnowledgeBase];

  if (knownDisease) {
    analysisResult.value = {
      disease: knownDisease.displayName,
      status: knownDisease.status,
      description: knownDisease.description,
      cause: knownDisease.cause,
      rekomendasi: knownDisease.rekomendasi,
      theme: knownDisease.theme,
      accuracy: Math.round(topPrediction.confidence * 100),
      badgeClass: getBadgeClass(knownDisease.theme),
      progressClass: knownDisease.progressClass,
      // [FIX] Ambil kelas background dari knowledge base
      progressBarBgClass: knownDisease.progressBarBgClass,
    };
  } else {
    analysisResult.value = {
      disease: "Kelas Tidak Dikenali",
      status: "Peringatan",
      description: `Model AI mengembalikan kelas "${predictedClass}" yang belum terdaftar di dalam sistem UI.`,
      cause:
        "Ada ketidaksesuaian antara model AI yang di-deploy dengan konfigurasi UI saat ini.",
      rekomendasi:
        "Harap perbarui 'diseaseKnowledgeBase' di dalam kode untuk menangani kelas ini, atau periksa kembali model AI Anda.",
      accuracy: Math.round(topPrediction.confidence * 100),
      theme: "yellow",
      badgeClass: getBadgeClass("yellow"),
      progressClass: "text-yellow-500",
      // [FIX] Tambahkan kelas background untuk state peringatan
      progressBarBgClass: "bg-yellow-500",
    };
  }
};

const getBadgeClass = (theme: "green" | "yellow" | "orange" | "red") => {
  const classes = {
    green: "bg-green-100 text-green-800 border border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    orange: "bg-orange-100 text-orange-800 border border-orange-200",
    red: "bg-red-100 text-red-800 border border-red-200",
  };
  return classes[theme] || "bg-gray-100 text-gray-800";
};
</script>
