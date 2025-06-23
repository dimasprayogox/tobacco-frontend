import { ref, computed, markRaw } from "vue";
import { CheckCircle2, Leaf, Microscope } from "lucide-vue-next";

// Tipe data untuk hasil analisis
type AnalysisData = {
  accuracy: number;
  disease: string;
  description: string;
  cause: string;
  status: string;
  rekomendasi: string;
  theme: "green" | "yellow" | "orange" | "red";
  badgeClass: string;
};

// "Kamus" ini sekarang secara presisi memetakan 3 output API Anda.
// Kunci objek (e.g., 'cercospora nicotianae') HARUS SAMA PERSIS dengan nilai "class" dari JSON API.
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
  },
};

const getBadgeClass = (theme: "green" | "yellow" | "orange" | "red") => {
  const classes = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    orange: "bg-orange-100 text-orange-800",
    red: "bg-red-100 text-red-800",
  };
  return classes[theme] || "bg-gray-100 text-gray-800";
};

// Ekspor fungsi composable
export function useAnalysis() {
  const uploadedImage = ref<string | null>(null);
  const uploadedFile = ref<File | null>(null);
  const analysisResult = ref<AnalysisData | null>(null);
  const isAnalyzing = ref(false);
  const fileInputRef = ref<HTMLInputElement | null>(null);

  const triggerFileInput = () => {
    fileInputRef.value?.click();
  };

  const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      uploadedFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImage.value = e.target?.result as string;
        performAnalysis(); // Langsung analisis setelah gambar di-load
      };
      reader.readAsDataURL(file);
    }
  };

  const mapApiResponseToAnalysisData = (response: {
    predictions: { class: string; confidence: number }[];
  }) => {
    // ... (fungsi ini tetap sama seperti di file asli Anda)
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
      };
    }
  };

  const performAnalysis = async () => {
    if (!uploadedFile.value) return;
    isAnalyzing.value = true;
    analysisResult.value = null;

    const formData = new FormData();
    formData.append("file", uploadedFile.value);

    try {
      const apiEndpoint = "https://flask-tobacco.euphemia.site/predict";
      const response = await $fetch<{
        predictions: { class: string; confidence: number }[];
      }>(apiEndpoint, {
        method: "POST",
        body: formData,
      });
      mapApiResponseToAnalysisData(response);
    } catch (error) {
      console.error("Gagal saat memanggil API:", error);
      analysisResult.value = {
        disease: "Gagal Menganalisis",
        status: "Error",
        description:
          "Terjadi kesalahan saat menghubungi server analisis. Mohon periksa koneksi internet Anda dan coba lagi.",
        cause:
          "Koneksi internet terputus atau server sedang mengalami gangguan.",
        rekomendasi:
          "Jika masalah berlanjut, hubungi tim support kami untuk bantuan.",
        accuracy: 0,
        theme: "red",
        badgeClass: getBadgeClass("red"),
      };
    } finally {
      isAnalyzing.value = false;
    }
  };

  const resetAnalysis = () => {
    uploadedImage.value = null;
    uploadedFile.value = null;
    analysisResult.value = null;
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
  };

  const accuracyMeterStyle = computed(() => {
    if (!analysisResult.value) return {};
    const themeColors = {
      green: "#16a34a",
      yellow: "#ca8a04",
      orange: "#ea580c",
      red: "#dc2626",
    };
    const { accuracy, theme } = analysisResult.value;
    const color = themeColors[theme] || "#6b7280";
    return {
      background: `radial-gradient(white 65%, transparent 66%), conic-gradient(${color} 0% ${accuracy}%, #e5e7eb ${accuracy}% 100%)`,
    };
  });

  // Kembalikan semua state dan fungsi yang dibutuhkan oleh komponen UI
  return {
    uploadedImage,
    analysisResult,
    isAnalyzing,
    fileInputRef,
    triggerFileInput,
    handleImageUpload,
    resetAnalysis,
    accuracyMeterStyle,
  };
}
