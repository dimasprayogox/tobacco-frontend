<script setup lang="ts">
import { ref, markRaw, computed } from "vue";
import { Upload } from "lucide-vue-next";

// --- TYPE DEFINITION ---
type AnalysisData = {
  accuracy: number;
  disease: string;
  description: string;
  status: string;
  rekomendasi: string;
  theme: "green" | "yellow" | "orange" | "red";
};

// --- STATE MANAGEMENT ---
const uploadedImage = ref<string | null>(null); // Untuk preview gambar di UI
const uploadedFile = ref<File | null>(null); // Untuk dikirim ke API
const analysisResult = ref<AnalysisData | null>(null);
const isAnalyzing = ref(false);

// "KAMUS" UNTUK MENERJEMAHKAN RESPON SERVER
const diseaseKnowledgeBase = {
  "cercospora nicotianae": {
    displayName: "Bercak Daun Cercospora",
    description:
      "Ditemukan bercak nekrotik berwarna coklat muda hingga abu-abu dengan tepi gelap. Gejala ini mengarah kuat pada infeksi jamur Cercospora.",
    rekomendasi:
      "Gunakan fungisida yang sesuai. Tingkatkan sirkulasi udara di sekitar tanaman dan hindari penyiraman berlebih pada daun.",
    theme: "orange" as const,
  },
  " alternaria alternata": {
    displayName: "Daun Busuk",
    description:
      "Tidak ditemukan indikasi penyakit jamur Cercospora atau Alternaria. Daun tampak dalam kondisi sehat.",
    rekomendasi:
      "Lanjutkan praktik perawatan rutin. Pastikan nutrisi dan air tercukupi untuk menjaga kesehatan tanaman.",
    theme: "red" as const,
  },
  " no cercospora nicotianae or alternaria alternata present": {
    displayName: "Daun Sehat",
    description:
      "Tidak ditemukan indikasi penyakit jamur Cercospora atau Alternaria. Daun tampak dalam kondisi sehat.",
    rekomendasi:
      "Lanjutkan praktik perawatan rutin. Pastikan nutrisi dan air tercukupi untuk menjaga kesehatan tanaman.",
    theme: "green" as const,
  },
};

// --- METHODS ---
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    uploadedFile.value = file; // Simpan file asli

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string; // Simpan preview
      performAnalysis(); // Panggil fungsi analisis API
    };
    reader.readAsDataURL(file);
  }
};

const performAnalysis = async () => {
  if (!uploadedFile.value) {
    console.error("Tidak ada file untuk dianalisis.");
    return;
  }

  isAnalyzing.value = true;
  analysisResult.value = null;

  const formData = new FormData();
  formData.append("image", uploadedFile.value);

  try {
    const apiEndpoint = "https://flask-tobacco.euphemia.site/predict";

    console.log("Mengirim gambar ke server...");
    const response = await $fetch<{
      predictions: { class: string; confidence: number }[];
    }>(apiEndpoint, {
      method: "POST",
      body: formData,
    });
    console.log("Respon diterima dari server:", response);

    mapApiResponseToAnalysisData(response);
  } catch (error) {
    console.error("Gagal saat memanggil API:", error);
    analysisResult.value = {
      disease: "Gagal Menganalisis",
      status: "Error",
      description:
        "Terjadi kesalahan saat menghubungi server. Silakan coba lagi nanti.",
      rekomendasi:
        "Pastikan Anda terhubung ke internet dan server analisis sedang berjalan.",
      accuracy: 0,
      theme: "red",
    };
  } finally {
    isAnalyzing.value = false;
  }
};

const mapApiResponseToAnalysisData = (response: {
  predictions: { class: string; confidence: number }[];
}) => {
  if (!response.predictions || response.predictions.length === 0) {
    console.error("Respon API tidak valid.");
    analysisResult.value = {
      disease: "Respon Tidak Valid",
      status: "Error",
      description:
        "Server memberikan respon dengan format yang tidak dikenali.",
      rekomendasi: "Hubungi administrator server.",
      accuracy: 0,
      theme: "red",
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
      status: knownDisease.theme === "green" ? "Sehat" : "Penyakit Terdeteksi",
      description: knownDisease.description,
      rekomendasi: knownDisease.rekomendasi,
      theme: knownDisease.theme,
      accuracy: Math.round(topPrediction.confidence * 100),
    };
  } else {
    analysisResult.value = {
      disease: `Kelas Tidak Dikenali: ${predictedClass}`,
      status: "Tidak Diketahui",
      description:
        "Model AI mendeteksi sebuah kelas yang belum terdaftar di dalam sistem UI.",
      rekomendasi:
        "Harap perbarui 'diseaseKnowledgeBase' di dalam kode untuk menangani kelas ini.",
      accuracy: Math.round(topPrediction.confidence * 100),
      theme: "yellow",
    };
  }
};

const resetAnalysis = () => {
  uploadedImage.value = null;
  uploadedFile.value = null;
  analysisResult.value = null;
};

// --- COMPUTED PROPERTIES ---
const themeColors = {
  green: "#16a34a",
  yellow: "#ca8a04",
  orange: "#ea580c",
  red: "#dc2626",
};

const accuracyMeterStyle = computed(() => {
  if (!analysisResult.value) return {};
  const { accuracy, theme } = analysisResult.value;
  const color = themeColors[theme] || "#6b7280";
  return {
    background: `radial-gradient(white 60%, transparent 61%), conic-gradient(${color} 0% ${accuracy}%, #e5e7eb ${accuracy}% 100%)`,
    borderRadius: "50%",
  };
});
</script>

<template>
  <section ref="mainRef" class="py-20 px-4" id="identifySection">
    <div class="max-w-6xl mx-auto">
      <div
        id="upload-section"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 800 } }"
        class="mb-20"
      >
        <div
          class="backdrop-blur-lg bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden p-8"
        >
          <h2 class="text-3xl font-bold text-center mb-8 text-green-800">
            Analisis Daun Tembakau Anda
          </h2>

          <div v-if="!uploadedImage">
            <div
              class="border-2 border-dashed border-green-300 rounded-2xl p-12 text-center hover:border-green-500 transition-colors duration-300"
            >
              <Upload class="mx-auto h-16 w-16 text-green-500 mb-4" />
              <p class="text-lg text-green-700 mb-4">
                Unggah foto daun tembakau untuk analisis
              </p>
              <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
                id="image-upload"
              />
              <label for="image-upload">
                <span
                  class="bg-green-600 hover:bg-green-700 text-white cursor-pointer py-2 px-4 rounded-md inline-block"
                >
                  Pilih Gambar
                </span>
              </label>
            </div>
          </div>

          <div v-else>
            <div
              v-if="isAnalyzing"
              class="flex flex-col items-center justify-center space-y-4 p-8"
            >
              <div class="flex items-center space-x-2">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"
                />
                <span class="text-green-700 text-lg"
                  >Menganalisis Gambar...</span
                >
              </div>
              <div class="w-full max-w-md bg-green-200 rounded-full h-3">
                <div
                  v-motion
                  class="bg-green-600 h-3 rounded-full"
                  :initial="{ width: 0 }"
                  :animate="{ width: '100%' }"
                  :transition="{ duration: 3 }"
                />
              </div>
            </div>

            <div
              v-else-if="analysisResult"
              v-motion
              :initial="{ opacity: 0, scale: 0.95 }"
              :enter="{ opacity: 1, scale: 1, transition: { duration: 500 } }"
            >
              <div
                class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div class="grid md:grid-cols-2">
                  <div class="p-4">
                    <img
                      :src="uploadedImage"
                      alt="Uploaded leaf"
                      class="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div class="p-6 flex flex-col justify-between">
                    <div>
                      <div class="flex justify-between items-start mb-4">
                        <div>
                          <p
                            class="font-semibold text-sm uppercase tracking-wider"
                            :class="{
                              'text-green-600':
                                analysisResult.theme === 'green',
                              'text-yellow-600':
                                analysisResult.theme === 'yellow',
                              'text-orange-600':
                                analysisResult.theme === 'orange',
                              'text-red-600': analysisResult.theme === 'red',
                            }"
                          >
                            {{ analysisResult.status }}
                          </p>
                          <h2 class="text-2xl font-bold text-gray-800">
                            {{ analysisResult.disease }}
                          </h2>
                        </div>
                        <div
                          class="relative w-16 h-16 flex items-center justify-center"
                        >
                          <div
                            class="absolute inset-0 transform"
                            :style="accuracyMeterStyle"
                          ></div>
                          <span
                            class="text-xl font-semibold text-gray-700 z-10"
                            >{{ analysisResult.accuracy
                            }}<span class="text-sm">%</span></span
                          >
                        </div>
                      </div>
                      <div class="space-y-3 text-gray-600">
                        <div>
                          <h3 class="font-semibold text-gray-800 mb-1">
                            Keterangan
                          </h3>
                          <p class="text-sm">
                            {{ analysisResult.description }}
                          </p>
                        </div>
                        <div>
                          <h3 class="font-semibold text-gray-800 mb-1">
                            Rekomendasi
                          </h3>
                          <p class="text-sm">
                            {{ analysisResult.rekomendasi }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="mt-6">
                      <button
                        @click="resetAnalysis"
                        class="w-full text-center py-2 px-4 rounded-lg font-semibold transition-colors duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        Analisis Gambar Lain
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>