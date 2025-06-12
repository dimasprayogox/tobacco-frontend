<script setup>
import { ref } from 'vue';
// Impor komponen ResultCard menggunakan alias '~' dari Nuxt
import ResultCard from '~/components/ResultCard.vue';

// --- STATE MANAGEMENT ---
const imagePreviewUrl = ref(null);
const isProcessing = ref(false);
const detectionResult = ref(null);
const fileInput = ref(null);

// --- METHODS ---
function triggerFileInput() {
  fileInput.value.click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  imagePreviewUrl.value = URL.createObjectURL(file);
  detectionResult.value = null;
  simulateDetection();
}

function simulateDetection() {
  isProcessing.value = true;
  setTimeout(() => {
    const mockResult = {
      diagnosis: 'Penyakit Mosaik Tembakau (TMV)',
      confidence: 96,
      severity: 'Stadium Awal',
      imageUrl: imagePreviewUrl.value,
      description: 'Penyakit Mosaik Tembakau disebabkan oleh virus TMV dan ditandai dengan munculnya bercak-bercak hijau muda atau kuning pada daun, membuatnya terlihat seperti mosaik. Penyakit ini sangat menular melalui kontak.',
      symptoms: [
        'Pola mosaik atau belang-belang kuning dan hijau pada daun.',
        'Daun mengerut, melengkung, atau ukurannya kerdil.',
        'Pertumbuhan tanaman secara keseluruhan terhambat.',
      ],
      recommendations: {
        immediate: 'Segera cabut dan musnahkan (bakar) tanaman yang terinfeksi untuk mencegah penyebaran. Jangan dijadikan kompos.',
        sanitation: 'Bersihkan semua peralatan (gunting, pisau, sarung tangan) dengan disinfektan setelah menangani tanaman sakit.',
        prevention: 'Gunakan bibit yang bersertifikat tahan virus dan hindari menyentuh tanaman setelah menggunakan produk tembakau.',
      },
    };
    detectionResult.value = mockResult;
    isProcessing.value = false;
  }, 3000);
}

function resetState() {
  imagePreviewUrl.value = null;
  isProcessing.value = false;
  detectionResult.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 md:py-12">
    <header class="text-center mb-10">
      <h1 class="text-4xl md:text-5xl font-extrabold text-green-800 tracking-tight">
        Tembakau Sehat <span class="text-green-600">AI</span>
      </h1>
      <p class="mt-2 text-lg text-slate-600 max-w-2xl mx-auto">
        Unggah foto daun tembakau Anda, dan biarkan teknologi AI kami menganalisisnya dalam hitungan detik.
      </p>
    </header>

    <div v-if="!imagePreviewUrl" class="max-w-2xl mx-auto">
      <div
        @click="triggerFileInput"
        class="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors duration-300"
      >
        <svg class="w-16 h-16 text-slate-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
        <p class="text-lg font-semibold text-slate-700">Klik untuk memilih gambar</p>
        <button class="mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition-transform duration-200 active:scale-95">
          Pilih Gambar
        </button>
      </div>
      <p class="text-center text-xs text-slate-500 mt-4">Format: JPG, PNG, JPEG | Ukuran Maks: 10MB</p>
      <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/png, image/jpeg, image/jpg" class="hidden"/>
    </div>

    <div v-else class="text-center">
      <div class="flex justify-center">
        <img :src="imagePreviewUrl" alt="Preview Daun Tembakau" class="max-h-80 w-auto rounded-lg shadow-xl" />
      </div>
      <div v-if="isProcessing" class="mt-8 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
        <p class="mt-4 text-lg font-semibold text-slate-700">Menganalisis gambar Anda...</p>
      </div>
      <ResultCard v-if="detectionResult" :result="detectionResult" @reset="resetState" class="mt-8" />
    </div>
  </div>
</template>