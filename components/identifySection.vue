<template>
    <div class="bg-[#ae9173] min-h-screen flex items-center justify-center p-4 font-sans">
      <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 transition-all duration-500">
        
        <div v-if="!uploadedImage" class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Identifikkasi Daun Tembakau Anda</h1>
          <p class="text-gray-500 mb-8">Unggah gambar daun tembakau untuk mendeteksi penyakit secara otomatis.</p>
          
          <div 
            @click="triggerFileInput"
            class="border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:border-indigo-500 hover:bg-gray-100 transition-colors duration-300"
          >
            <div class="flex flex-col items-center justify-center space-y-4">
              <Upload class="w-16 h-16 text-gray-400" />
              <p class="text-lg font-semibold text-gray-700">Klik untuk memilih gambar</p>
              <p class="text-sm text-gray-500">PNG, JPG, atau WEBP. Ukuran maksimal 10MB.</p>
            </div>
          </div>
          
          <input 
            type="file" 
            ref="fileInputRef" 
            @change="handleImageUpload" 
            accept="image/*" 
            capture="environment"
            class="hidden"
          />
          
          
        </div>
  
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div class="flex flex-col">
              <h3 class="text-xl font-bold text-gray-800 mb-4">Gambar Anda</h3>
              <div class="relative w-full h-80 rounded-lg shadow-md overflow-hidden">
                  <img :src="uploadedImage" alt="Uploaded tobacco leaf" class="w-full h-full object-cover">
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
                  <p class="text-center text-gray-500 font-medium">Menganalisis gambar...</p>
              </div>
              
              <div v-if="analysisResult && !isAnalyzing" class="space-y-5">
                <div class="flex items-center justify-between">
                  <h2 class="text-2xl font-bold" :class="analysisResult.progressClass">
                    {{ analysisResult.disease }}
                  </h2>
                  <span :class="analysisResult.badgeClass" class="text-sm font-semibold px-3 py-1 rounded-full">
                    {{ analysisResult.status }}
                  </span>
                </div>
  
                <div>
                  <label class="text-sm font-medium text-gray-600">Tingkat Keyakinan: {{ analysisResult.accuracy }}%</label>
                  <div class="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      class="h-2.5 rounded-full transition-all duration-500" 
                      :class="analysisResult.progressClass.replace('text-', 'bg-')" 
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
                    <p class="text-gray-600 text-sm">{{ analysisResult.description }}</p>
                  </div>
  
                  <div class="p-4 border rounded-lg bg-gray-50">
                    <div class="flex items-center mb-2">
                      <Leaf class="w-5 h-5 mr-3 text-green-500" />
                      <h4 class="font-semibold text-gray-800">Kemungkinan Penyebab</h4>
                    </div>
                    <p class="text-gray-600 text-sm">{{ analysisResult.cause }}</p>
                  </div>
                  
                  <div class="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div class="flex items-center mb-2">
                      <Shield class="w-5 h-5 mr-3 text-yellow-500" />
                      <h4 class="font-semibold text-gray-800">Rekomendasi & Penanganan</h4>
                    </div>
                    <p class="text-gray-600 text-sm">{{ analysisResult.rekomendasi }}</p>
                  </div>
                </div>
  
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Upload, Microscope, Leaf, Shield } from 'lucide-vue-next'
  
  // Tipe data dengan penambahan 'progressClass'
  type AnalysisData = {
    accuracy: number;
    disease: string;
    description: string;
    cause: string;
    status: string;
    rekomendasi: string;
    theme: 'green' | 'yellow' | 'orange' | 'red';
    badgeClass: string;
    progressClass: string; // <-- PENAMBAHAN DI SINI
  };
  
  const uploadedImage = ref<string | null>(null);
  const uploadedFile = ref<File | null>(null);
  const analysisResult = ref<AnalysisData | null>(null);
  const isAnalyzing = ref(false);
  const fileInputRef = ref<HTMLInputElement | null>(null);
  
  // Database Pengetahuan dengan penambahan 'progressClass'
  const diseaseKnowledgeBase = {
    'no cercospora nicotianae or alternaria alternata present': {
      displayName: "Daun Sehat",
      description: "Tidak ditemukan indikasi visual dari penyakit jamur Cercospora maupun Alternaria. Daun tampak dalam kondisi sehat.",
      cause: "Praktik agronomi yang baik, nutrisi seimbang, dan lingkungan yang mendukung pertumbuhan tanaman.",
      rekomendasi: "Pertahankan praktik perawatan rutin. Lakukan pemantauan berkala untuk deteksi dini masalah di masa depan.",
      theme: 'green' as const,
      status: 'Sehat',
      progressClass: 'text-green-500', // <-- PENAMBAHAN DI SINI
    },
    'cercospora nicotianae': {
      displayName: "Bercak Daun Cercospora",
      description: "Terdeteksi bercak nekrotik khas berwarna coklat muda hingga abu-abu dengan tepi gelap yang jelas, seringkali disebut 'mata katak' (frog-eye spot).",
      cause: "Disebabkan oleh jamur Cercospora nicotianae. Jamur ini berkembang pesat dalam kondisi cuaca yang hangat dan lembab.",
      rekomendasi: "Gunakan fungisida sistemik atau kontak yang sesuai anjuran. Tingkatkan sirkulasi udara di sekitar tanaman dan hindari penyiraman dari atas daun.",
      theme: 'orange' as const,
      status: 'Penyakit Terdeteksi',
      progressClass: 'text-orange-500', // <-- PENAMBAHAN DI SINI
    },
    'alternaria alternata': {
      displayName: "Bercak Daun Alternaria",
      description: "Teridentifikasi bercak berwarna coklat kehitaman, seringkali dengan pola cincin konsentris yang khas seperti papan target.",
      cause: "Disebabkan oleh jamur Alternaria alternata. Penyakit ini sering menyerang daun yang lebih tua dan pada kondisi kelembaban udara yang tinggi.",
      rekomendasi: "Segera buang dan musnahkan daun yang terinfeksi untuk mengurangi sumber spora. Aplikasikan fungisida yang mengandung mancozeb atau chlorothalonil. Jaga kebersihan lahan dari gulma.",
      theme: 'yellow' as const,
      status: 'Penyakit Terdeteksi',
      progressClass: 'text-yellow-500', // <-- PENAMBAHAN DI SINI
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
    // Pastikan nama 'key' sesuai dengan yang diharapkan oleh API Anda ('file' atau 'image')
    formData.append('file', uploadedFile.value);
  
    try {
      const apiEndpoint = 'https://flask-tobacco.euphemia.site/predict';
      
      // Asumsi $fetch didefinisikan secara global (misal: oleh Nuxt 3)
      // Jika tidak, ganti dengan 'fetch' biasa.
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      }).then(res => res.json());
      
      // Simulasi penundaan agar loading terlihat
      // await new Promise(resolve => setTimeout(resolve, 1500));
  
      mapApiResponseToAnalysisData(response);
  
    } catch (error) {
      console.error("Gagal saat memanggil API:", error);
      // Menambahkan 'progressClass' untuk kondisi error
      analysisResult.value = {
          disease: "Gagal Menganalisis",
          status: "Error",
          description: "Terjadi kesalahan saat menghubungi server analisis. Mohon periksa koneksi internet Anda dan coba lagi.",
          cause: "Koneksi internet terputus atau server sedang mengalami gangguan.",
          rekomendasi: "Jika masalah berlanjut, hubungi tim support kami untuk bantuan.",
          accuracy: 0,
          theme: 'red',
          badgeClass: getBadgeClass('red'),
          progressClass: 'text-red-500', // <-- PENAMBAHAN DI SINI
      };
    } finally {
      isAnalyzing.value = false;
    }
  };
  
  const mapApiResponseToAnalysisData = (response: { predictions: { class: string, confidence: number }[] }) => {
    if (!response.predictions || response.predictions.length === 0) {
      // Menambahkan 'progressClass' untuk kondisi respon tidak valid
      analysisResult.value = {
          disease: "Respon Tidak Valid", status: "Error",
          description: "Server memberikan respon dengan format yang tidak dikenali.",
          cause: "Kemungkinan ada perubahan pada format output API.",
          rekomendasi: "Hubungi administrator sistem.",
          accuracy: 0, theme: 'red', 
          badgeClass: getBadgeClass('red'),
          progressClass: 'text-red-500', // <-- PENAMBAHAN DI SINI
      };
      return;
    }
    
    const topPrediction = response.predictions[0];
    const predictedClass = topPrediction.class.trim();
    const knownDisease = diseaseKnowledgeBase[predictedClass as keyof typeof diseaseKnowledgeBase];
  
    if (knownDisease) {
      // Memetakan 'progressClass' dari knowledge base
      analysisResult.value = {
        disease: knownDisease.displayName,
        status: knownDisease.status,
        description: knownDisease.description,
        cause: knownDisease.cause,
        rekomendasi: knownDisease.rekomendasi,
        theme: knownDisease.theme,
        accuracy: Math.round(topPrediction.confidence * 100),
        badgeClass: getBadgeClass(knownDisease.theme),
        progressClass: knownDisease.progressClass, // <-- PENAMBAHAN DI SINI
      };
    } else {
        // Menambahkan 'progressClass' untuk kelas tidak dikenali
        analysisResult.value = {
          disease: "Kelas Tidak Dikenali", status: "Peringatan",
          description: `Model AI mengembalikan kelas "${predictedClass}" yang belum terdaftar di dalam sistem UI.`,
          cause: "Ada ketidaksesuaian antara model AI yang di-deploy dengan konfigurasi UI saat ini.",
          rekomendasi: "Harap perbarui 'diseaseKnowledgeBase' di dalam kode untuk menangani kelas ini, atau periksa kembali model AI Anda.",
          accuracy: Math.round(topPrediction.confidence * 100),
          theme: 'yellow', 
          badgeClass: getBadgeClass('yellow'),
          progressClass: 'text-yellow-500', // <-- PENAMBAHAN DI SINI
      };
    }
  };
  
  const resetAnalysis = () => {
    uploadedImage.value = null;
    uploadedFile.value = null;
    analysisResult.value = null;
    if(fileInputRef.value) { fileInputRef.value.value = ''; }
  };
  
  // Fungsi ini sedikit diubah untuk menambahkan border yang lebih jelas
  const getBadgeClass = (theme: 'green' | 'yellow' | 'orange' | 'red') => {
    const classes = {
      green: 'bg-green-100 text-green-800 border border-green-200', 
      yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      orange: 'bg-orange-100 text-orange-800 border border-orange-200', 
      red: 'bg-red-100 text-red-800 border border-red-200'
    };
    return classes[theme] || 'bg-gray-100 text-gray-800';
  };
  </script>