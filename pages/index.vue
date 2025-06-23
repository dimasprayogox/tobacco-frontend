<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
    <HeroSection id="heroSection" />

    <IdentifySection />

    <div
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :visibleOnce="{
        opacity: 1,
        y: 0,
        transition: { duration: 800, delay: 200 },
      }"
      class="mb-20 max-w-6xl mx-auto px-4"
    >
      <h2 class="text-3xl font-bold text-center mb-12 text-green-800">
        Penyakit Umum pada Tembakau
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(disease, index) in commonDiseases"
          :key="disease.name"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            transition: { duration: 600, delay: 400 + index * 100 },
          }"
          class="backdrop-blur-lg bg-white/80 border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center"
        >
          <div
            :class="`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${disease.color} flex items-center justify-center`"
          >
            <component :is="disease.icon" class="h-8 w-8 text-white" />
          </div>
          <h3 class="font-bold text-green-800 mb-2">{{ disease.name }}</h3>
          <p class="text-green-600 text-sm">{{ disease.description }}</p>
        </div>
      </div>
    </div>

    <div
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :visibleOnce="{
        opacity: 1,
        y: 0,
        transition: { duration: 800, delay: 400 },
      }"
      class="mb-20 max-w-6xl mx-auto px-4"
    >
      <h2 class="text-3xl font-bold text-center mb-12 text-green-800">
        Cara Kerja AI Kami
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(step, index) in howItWorksSteps"
          :key="step.step"
          v-motion
          class="text-center"
          :initial="{ opacity: 0, scale: 0.8 }"
          :visibleOnce="{
            opacity: 1,
            scale: 1,
            transition: { duration: 600, delay: 600 + index * 100 },
          }"
        >
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-600 to-amber-600 flex items-center justify-center text-white text-2xl font-bold"
          >
            {{ step.step }}
          </div>
          <h3 class="font-bold text-green-800 mb-2">{{ step.title }}</h3>
          <p class="text-green-600">{{ step.description }}</p>
        </div>
      </div>
    </div>

    <footer
      ref="footerRef"
      class="relative backdrop-blur-lg bg-green-900/80 text-white py-12"
    >
      </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, computed } from "vue";
import {
  Upload,
  ArrowRight,
  Mail,
  Shield,
  FileText,
  Microscope,
  Leaf,
  BarChart3,
} from "lucide-vue-next";

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

// --- ELEMENT REFS ---
const heroRef = ref<HTMLElement | null>(null);
const mainRef = ref<HTMLElement | null>(null);
const footerRef = ref<HTMLElement | null>(null);

// --- STATIC DATA ---
const commonDiseases = [
  {
    name: "Tobacco Mosaic Virus (TMV)",
    description: "Virus yang menyebabkan pola mozaik pada daun",
    icon: markRaw(Microscope),
    color: "from-red-500 to-orange-500",
  },
  {
    name: "Bercak Daun Cercospora",
    description: "Infeksi jamur dengan bercak coklat",
    icon: markRaw(Leaf),
    color: "from-amber-500 to-yellow-500",
  },
  {
    name: "Busuk Akar",
    description: "Penyakit yang menyerang sistem akar tanaman",
    icon: markRaw(BarChart3),
    color: "from-green-500 to-emerald-500",
  },
];
const howItWorksSteps = [
  {
    step: "1",
    title: "Unggah Gambar",
    description: "Upload foto daun tembakau dengan kualitas yang baik",
  },
  {
    step: "2",
    title: "Proses AI",
    description: "AI menganalisis gambar menggunakan deep learning",
  },
  {
    step: "3",
    title: "Hasil Diagnosis",
    description: "Dapatkan hasil diagnosis dengan tingkat akurasi tinggi",
  },
];

// "KAMUS" UNTUK MENERJEMAHKAN RESPON SERVER
// Kunci objek (misal 'cercospora nicotianae') harus SAMA PERSIS dengan nilai 'class' dari API Anda.
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
  // Tambahkan penyakit lain dari model Anda di sini
  // 'alternaria alternata': { ... }
};

// --- METHODS ---

// 1. Modifikasi handleImageUpload untuk menyimpan file asli
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

// 2. Fungsi baru untuk memanggil API (menggantikan simulateAnalysis)
const performAnalysis = async () => {
  if (!uploadedFile.value) {
    console.error("Tidak ada file untuk dianalisis.");
    return;
  }

  isAnalyzing.value = true;
  analysisResult.value = null;

  // Gunakan FormData untuk mengirim file
  const formData = new FormData();
  formData.append("image", uploadedFile.value); // 'image' adalah key, sesuaikan dengan yang diharapkan server

  try {
    // GANTI URL INI DENGAN ENDPOINT SERVER ANDA
    const apiEndpoint = "https://flask-tobacco.euphemia.site/predict";

    console.log("Mengirim gambar ke server...");
    const response = await $fetch<{
      predictions: { class: string; confidence: number }[];
    }>(apiEndpoint, {
      method: "POST",
      body: formData,
    });
    console.log("Respon diterima dari server:", response);

    // Proses respon yang berhasil
    mapApiResponseToAnalysisData(response);
  } catch (error) {
    console.error("Gagal saat memanggil API:", error);
    // Tampilkan pesan error di UI
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

// 3. Fungsi baru untuk "menerjemahkan" respon API
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
  const predictedClass = topPrediction.class.trim(); // trim() untuk menghapus spasi di awal/akhir

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
    // Fallback jika kelas penyakit tidak ada dalam "kamus"
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

const scrollToUpload = () => {
  document
    .getElementById("upload-section")
    ?.scrollIntoView({ behavior: "smooth" });
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
