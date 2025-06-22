<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-green-50">
    
    <section ref="heroRef" class="relative h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-fixed bg-center bg-cover" :style="{ backgroundImage: `url('/placeholder2.jpg')` }" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30" />
      <div v-motion :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }" class="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-extrabold mb-6 text-shadow-lg" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.6);">
          <span class="bg-gradient-to-r from-[#FEFAE0] to-[#d1d8bd] bg-clip-text text-transparent">
            Tobacco Leaf AI
          </span>
        </h1>
        <p class="text-xl md:text-2xl mb-10 text-stone-200 leading-relaxed max-w-3xl mx-auto">
          Inovasi cerdas untuk petani tembakau. Deteksi penyakit daun secara instan, akurat, dan mudah untuk menjaga kualitas panen Anda.
        </p>
        <button @click="scrollToUpload" class="bg-gradient-to-r from-[#B99470] to-[#A88562] hover:from-[#A88562] hover:to-[#967352] text-white px-10 py-4 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center">
          Mulai Analisis <ArrowRight class="ml-3 h-5 w-5" />
        </button>
      </div>
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div class="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center items-start p-1">
          <div v-motion :animate="{ y: [0, 10, 0], opacity: [1, 0, 1] }" :transition="{ duration: 2, repeat: Infinity }" class="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>
    </section>
    <main ref="mainRef" class="py-24 px-4 bg-[#A6B37D] backdrop-blur-sm">
      <div class="max-w-6xl mx-auto">
        
        <div id="upload-section" class="mb-24">
          <div class="bg-[#B99470] backdrop-blur-lg border border-gray-200/50 shadow-2xl rounded-3xl p-8 transition-all duration-500">
            <h2 class="text-4xl font-bold text-center mb-2 text-gray-800">Analisis Daun Tembakau Anda</h2>
            <p class="text-center text-gray-700 mb-10">Unggah foto daun untuk mendapatkan diagnosis dan rekomendasi dari AI kami.</p>

            <div v-if="!uploadedImage" class="relative bg-[#C0C78C] block w-full border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-green-500 transition-colors duration-300 cursor-pointer" @click="triggerFileInput">
              <input type="file" accept="image/*" @change="handleImageUpload" class="hidden" ref="fileInputRef" />
              <div class="flex flex-col items-center">
                <Upload class="h-16 w-16 text-gray-400 mb-4" />
                <span class="text-lg text-gray-600 mb-2">Seret & lepas gambar, atau klik untuk memilih file</span>
                <span class="text-sm text-gray-400">PNG, JPG, JPEG (Maks. 5MB)</span>
              </div>
            </div>
            
            <div v-else>
              <div v-if="isAnalyzing" class="flex flex-col items-center justify-center space-y-6 p-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600" />
                <span class="text-gray-700 text-xl font-medium">Menganalisis Gambar...</span>
              </div>

              <div v-else-if="analysisResult" v-motion :initial="{ opacity: 0, scale: 0.95 }" :enter="{ opacity: 1, scale: 1, transition: { duration: 500 } }">
                <div class="bg-[#C0C78C] rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div class="grid md:grid-cols-5 gap-0">
                    <div class="md:col-span-2 p-4"><img :src="uploadedImage" alt="Uploaded leaf" class="w-full h-full object-cover rounded-xl shadow-md"/></div>
                    <div class="md:col-span-3 p-6 flex flex-col justify-between">
                      <div>
                        <div class="flex justify-between items-start mb-4">
                          <div>
                            <span :class="analysisResult.badgeClass" class="inline-block rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-wider">{{ analysisResult.status }}</span>
                            <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ analysisResult.disease }}</h3>
                          </div>
                           <div class="relative w-20 h-20 flex items-center justify-center shrink-0">
                             <div class="absolute inset-0" :style="accuracyMeterStyle"></div>
                             <span class="text-xl font-bold text-gray-700 z-10">{{ analysisResult.accuracy }}<span class="text-sm">%</span></span>
                           </div>
                        </div>
                        <div class="space-y-4 text-gray-600">
                          <div><h4 class="font-semibold text-gray-800 mb-1 flex items-center"><Leaf class="h-4 w-4 mr-2 text-green-600" /> Deskripsi Gejala</h4><p class="text-sm pl-6">{{ analysisResult.description }}</p></div>
                          <div><h4 class="font-semibold text-gray-800 mb-1 flex items-center"><Microscope class="h-4 w-4 mr-2 text-blue-600" /> Kemungkinan Penyebab</h4><p class="text-sm pl-6">{{ analysisResult.cause }}</p></div>
                          <div><h4 class="font-semibold text-gray-800 mb-1 flex items-center"><Shield class="h-4 w-4 mr-2 text-amber-600" /> Rekomendasi Penanganan</h4><p class="text-sm pl-6">{{ analysisResult.rekomendasi }}</p></div>
                        </div>
                      </div>
                      <div class="mt-8"><button @click="resetAnalysis" class="w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700">Analisis Gambar Lain</button></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-24">
            <h2 
              class="text-4xl font-bold text-center mb-12 text-gray-800"
              v-motion
              :initial="{ opacity: 0, y: 50 }"
              :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
            >
              Kondisi yang Dapat Dideteksi
            </h2>
            <div class="grid md:grid-cols-3 gap-8">
              <div v-for="(disease, index) in commonDiseases" :key="disease.name"
                  v-motion :initial="{ opacity: 0, y: 30 }" :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 + index * 100 } }"
                  class="bg-[#B99470] backdrop-blur-md border border-gray-200/80 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex flex-col text-center">
                <div :class="`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${disease.color} flex items-center justify-center shadow-md`">
                  <component :is="disease.icon" class="h-8 w-8 text-white" />
                </div>
                <h3 class="font-bold text-gray-800 text-lg mb-2">{{ disease.name }}</h3>
                <p class="text-gray-700 text-sm flex-grow">{{ disease.description }}</p>
              </div>
            </div>
        </div>
        <div>
          <h2 
            class="text-4xl font-bold text-center mb-12 text-gray-800"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
          >
            Cara Kerja AI Kami
          </h2>
          <div class="grid md:grid-cols-3 gap-12">
            <div
              v-for="(step, index) in howItWorksSteps"
              :key="step.step"
              v-motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :visibleOnce="{ opacity: 1, scale: 1, transition: { duration: 600, delay: 400 + index * 150 } }"
              class="bg-[#B99470] backdrop-blur-md border border-gray-200/80 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex flex-col text-center"
            >
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {{ step.step }}
              </div>
              <h3 class="font-bold text-lg text-gray-800 mb-2">{{ step.title }}</h3>
              <p class="text-gray-700">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer ref="footerRef" class="bg-green-900/95 text-white py-12 backdrop-blur-lg">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div>
            <h3 class="text-xl font-bold mb-4 text-green-300">Tentang Tobacco Leaf AI</h3>
            <p class="text-green-100/80">
              Proyek ini didedikasikan untuk membantu petani tembakau dengan memanfaatkan kekuatan kecerdasan buatan untuk identifikasi penyakit dini.
            </p>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4 text-green-300">Kontak</h3>
            <div class="space-y-2">
              <a href="mailto:support@tobaccoleafai.com" class="flex items-center justify-center md:justify-start space-x-2 text-green-100/80 hover:text-green-200 transition-colors">
                <Mail class="h-4 w-4" />
                <span>support@tobaccoleafai.com</span>
              </a>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4 text-green-300">Legal</h3>
            <div class="space-y-2">
              <a href="#" class="flex items-center justify-center md:justify-start space-x-2 text-green-100/80 hover:text-green-200 transition-colors">
                <Shield class="h-4 w-4" />
                <span>Kebijakan Privasi</span>
              </a>
              <a href="#" class="flex items-center justify-center md:justify-start space-x-2 text-green-100/80 hover:text-green-200 transition-colors">
                <FileText class="h-4 w-4" />
                <span>Syarat & Ketentuan</span>
              </a>
            </div>
          </div>
        </div>

        <div class="border-t border-green-700/50 pt-8 text-center">
          <p class="text-green-200/70">© {{ new Date().getFullYear() }} Tobacco Leaf AI. Dibuat dengan ❤ untuk pertanian Indonesia.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, computed } from 'vue'
import { Upload, ArrowRight, Mail, Shield, FileText, Microscope, Leaf, CheckCircle2 } from 'lucide-vue-next'

type AnalysisData = {
  accuracy: number;
  disease: string;
  description: string;
  cause: string;
  status: string;
  rekomendasi: string;
  theme: 'green' | 'yellow' | 'orange' | 'red';
  badgeClass: string;
};

const uploadedImage = ref<string | null>(null);
const uploadedFile = ref<File | null>(null);
const analysisResult = ref<AnalysisData | null>(null);
const isAnalyzing = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);
const mainRef = ref<HTMLElement | null>(null);
const footerRef = ref<HTMLElement | null>(null);

// --- STATIC DATA: DISESUAIKAN DENGAN 3 KELAS DARI API ---

// Bagian "Penyakit Umum" kini mencerminkan 3 kemungkinan hasil deteksi.
const commonDiseases = [
  { name: "Daun Sehat", description: "Daun dalam kondisi prima tanpa gejala penyakit.", icon: markRaw(CheckCircle2), color: "from-green-500 to-lime-500" },
  { name: "Bercak Daun Cercospora", description: "Bercak 'mata katak' berwarna coklat muda/abu-abu.", icon: markRaw(Leaf), color: "from-orange-500 to-red-500" },
  { name: "Bercak Daun Alternaria", description: "Bercak coklat kehitaman dengan pola cincin target.", icon: markRaw(Microscope), color: "from-amber-500 to-orange-500" },
];

const howItWorksSteps = [
  { step: "1", title: "Unggah Gambar", description: "Pilih foto daun tembakau yang jelas dari galeri Anda." },
  { step: "2", title: "Proses AI", description: "Model AI kami menganalisis pola dan tekstur pada gambar." },
  { step: "3", title: "Hasil & Solusi", description: "Dapatkan diagnosis akurat beserta rekomendasi penanganan." },
];

// **DATABASE PENGETAHUAN PENYAKIT (DISESUAIKAN TOTAL)**
// "Kamus" ini sekarang secara presisi memetakan 3 output API Anda.
// Kunci objek (e.g., 'cercospora nicotianae') HARUS SAMA PERSIS dengan nilai "class" dari JSON API.
const diseaseKnowledgeBase = {
  'no cercospora nicotianae or alternaria alternata present': {
    displayName: "Daun Sehat",
    description: "Tidak ditemukan indikasi visual dari penyakit jamur Cercospora maupun Alternaria. Daun tampak dalam kondisi sehat.",
    cause: "Praktik agronomi yang baik, nutrisi seimbang, dan lingkungan yang mendukung pertumbuhan tanaman.",
    rekomendasi: "Pertahankan praktik perawatan rutin. Lakukan pemantauan berkala untuk deteksi dini masalah di masa depan.",
    theme: 'green' as const,
    status: 'Sehat'
  },
  'cercospora nicotianae': {
    displayName: "Bercak Daun Cercospora",
    description: "Terdeteksi bercak nekrotik khas berwarna coklat muda hingga abu-abu dengan tepi gelap yang jelas, seringkali disebut 'mata katak' (frog-eye spot).",
    cause: "Disebabkan oleh jamur Cercospora nicotianae. Jamur ini berkembang pesat dalam kondisi cuaca yang hangat dan lembab.",
    rekomendasi: "Gunakan fungisida sistemik atau kontak yang sesuai anjuran. Tingkatkan sirkulasi udara di sekitar tanaman dan hindari penyiraman dari atas daun.",
    theme: 'orange' as const,
    status: 'Penyakit Terdeteksi'
  },
  'alternaria alternata': {
    displayName: "Bercak Daun Alternaria",
    description: "Teridentifikasi bercak berwarna coklat kehitaman, seringkali dengan pola cincin konsentris yang khas seperti papan target.",
    cause: "Disebabkan oleh jamur Alternaria alternata. Penyakit ini sering menyerang daun yang lebih tua dan pada kondisi kelembaban udara yang tinggi.",
    rekomendasi: "Segera buang dan musnahkan daun yang terinfeksi untuk mengurangi sumber spora. Aplikasikan fungisida yang mengandung mancozeb atau chlorothalonil. Jaga kebersihan lahan dari gulma.",
    theme: 'yellow' as const,
    status: 'Penyakit Terdeteksi'
  },
};

const triggerFileInput = () => { fileInputRef.value?.click(); };
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    uploadedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string;
      performAnalysis();
    };
    reader.readAsDataURL(file);
  }
};

const performAnalysis = async () => {
  if (!uploadedFile.value) return;
  isAnalyzing.value = true;
  analysisResult.value = null;

  const formData = new FormData();
  formData.append('file', uploadedFile.value);

  try {
    const apiEndpoint = 'https://flask-tobacco.euphemia.site/predict';
    
    // PANGGILAN API SEBENARNYA (Hapus komentar '/*' dan '*/' untuk mengaktifkan)
    const response = await $fetch<{ predictions: { class: string, confidence: number }[] }>(apiEndpoint, {
      method: 'POST',
      body: formData,
    });
    
    mapApiResponseToAnalysisData(response);

  } catch (error) {
    console.error("Gagal saat memanggil API:", error);
    // Tampilkan pesan error
    analysisResult.value = {
        disease: "Gagal Menganalisis",
        status: "Error",
        description: "Terjadi kesalahan saat menghubungi server analisis. Mohon periksa koneksi internet Anda dan coba lagi.",
        cause: "Koneksi internet terputus atau server sedang mengalami gangguan.",
        rekomendasi: "Jika masalah berlanjut, hubungi tim support kami untuk bantuan.",
        accuracy: 0,
        theme: 'red',
        badgeClass: getBadgeClass('red'),
    };
  } finally {
    isAnalyzing.value = false;
  }
};

const mapApiResponseToAnalysisData = (response: { predictions: { class: string, confidence: number }[] }) => {
  if (!response.predictions || response.predictions.length === 0) {
    // Penanganan jika API merespon dengan format tak terduga
    analysisResult.value = {
        disease: "Respon Tidak Valid", status: "Error",
        description: "Server memberikan respon dengan format yang tidak dikenali.",
        cause: "Kemungkinan ada perubahan pada format output API.",
        rekomendasi: "Hubungi administrator sistem.",
        accuracy: 0, theme: 'red', badgeClass: getBadgeClass('red'),
    };
    return;
  }
  
  const topPrediction = response.predictions[0];
  // Menggunakan .trim() untuk menghapus spasi di awal/akhir dari respons class API
  const predictedClass = topPrediction.class.trim();
  
  // Mencari padanan di database pengetahuan
  const knownDisease = diseaseKnowledgeBase[predictedClass as keyof typeof diseaseKnowledgeBase];

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
    // Fallback jika API mengembalikan kelas di luar 3 yang diketahui
     analysisResult.value = {
        disease: "Kelas Tidak Dikenali", status: "Peringatan",
        description: `Model AI mengembalikan kelas "${predictedClass}" yang belum terdaftar di dalam sistem UI.`,
        cause: "Ada ketidaksesuaian antara model AI yang di-deploy dengan konfigurasi UI saat ini.",
        rekomendasi: "Harap perbarui 'diseaseKnowledgeBase' di dalam kode untuk menangani kelas ini, atau periksa kembali model AI Anda.",
        accuracy: Math.round(topPrediction.confidence * 100),
        theme: 'yellow', badgeClass: getBadgeClass('yellow'),
    };
  }
};

const scrollToUpload = () => { document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth", block: "center" }); };
const resetAnalysis = () => {
  uploadedImage.value = null;
  uploadedFile.value = null;
  analysisResult.value = null;
  if(fileInputRef.value) { fileInputRef.value.value = ''; }
};

const getBadgeClass = (theme: 'green' | 'yellow' | 'orange' | 'red') => {
  const classes = {
    green: 'bg-green-100 text-green-800', yellow: 'bg-yellow-100 text-yellow-800',
    orange: 'bg-orange-100 text-orange-800', red: 'bg-red-100 text-red-800'
  };
  return classes[theme] || 'bg-gray-100 text-gray-800';
};
const themeColors = { green: '#16a34a', yellow: '#ca8a04', orange: '#ea580c', red: '#dc2626' };
const accuracyMeterStyle = computed(() => {
  if (!analysisResult.value) return {};
  const { accuracy, theme } = analysisResult.value;
  const color = themeColors[theme] || '#6b7280';
  return { background: `radial-gradient(white 65%, transparent 66%), conic-gradient(${color} 0% ${accuracy}%, #e5e7eb ${accuracy}% 100%)`};
});
</script>