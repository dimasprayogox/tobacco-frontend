<script setup>
defineProps({
  result: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['reset']);

function startNewDetection() {
  emit('reset');
}

// Menambahkan data baru untuk demonstrasi grid
const resultData = {
  ...useSlots().default.result, // Menggunakan spread operator untuk data lama
  spreadPotential: 'Tinggi', // Data baru: Potensi penyebaran
};

</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-5xl mx-auto text-left animate-fade-in border-t-8 border-green-600">
    
    <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-center mb-6">
      <div class="w-full md:w-1/3 flex-shrink-0">
        <img :src="result.imageUrl" alt="Hasil Deteksi" class="rounded-xl object-cover w-full h-auto shadow-lg">
      </div>
      <div class="w-full md:w-2/3 text-center md:text-left">
        <p class="text-base font-semibold text-green-700">Hasil Analisis AI</p>
        <h2 class="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight">{{ result.diagnosis }}</h2>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-4">
        <div class="bg-green-100 p-2 rounded-full">
          <svg class="w-6 h-6 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p class="text-sm text-slate-500">Tingkat Keyakinan</p>
          <p class="text-2xl font-bold text-slate-800">{{ result.confidence }}%</p>
        </div>
      </div>
      
      <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-4">
        <div class="bg-yellow-100 p-2 rounded-full">
          <svg class="w-6 h-6 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
        </div>
        <div>
          <p class="text-sm text-slate-500">Tingkat Keparahan</p>
          <p class="text-2xl font-bold text-slate-800">{{ result.severity }}</p>
        </div>
      </div>

      <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-4">
        <div class="bg-red-100 p-2 rounded-full">
          <svg class="w-6 h-6 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.024.217 1.464l-.69.825a1.125 1.125 0 01-1.664 0l-.69-.825a1.125 1.125 0 01.217-1.464l1.068-.89a1.125 1.125 0 00.405-.864v-.568a1.125 1.125 0 10-2.25 0v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.024.217 1.464l-.69.825a1.125 1.125 0 01-1.664 0l-.69-.825a1.125 1.125 0 01.217-1.464l1.068-.89a1.125 1.125 0 00.405-.864v-.568a1.125 1.125 0 10-2.25 0v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.024.217 1.464l-.69.825a1.125 1.125 0 01-1.664 0l-.69-.825a1.125 1.125 0 01.217-1.464l1.068-.89a1.125 1.125 0 00.405-.864v-.568a1.125 1.125 0 00-2.25 0" /></svg>
        </div>
        <div>
          <p class="text-sm text-slate-500">Potensi Penyebaran</p>
          <p class="text-2xl font-bold text-slate-800">Tinggi</p> </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      
      <div class="lg:col-span-3">
        <h3 class="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <svg class="w-6 h-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          Detail Penyakit
        </h3>
        <div class="bg-white p-5 rounded-lg border border-slate-200">
          <p class="text-slate-600 mb-4">{{ result.description }}</p>
          <h4 class="font-semibold text-slate-700 mb-2">Gejala Umum:</h4>
          <ul class="list-disc list-inside space-y-1 text-slate-600">
            <li v-for="(symptom, index) in result.symptoms" :key="index">{{ symptom }}</li>
          </ul>
        </div>
      </div>

      <div class="lg:col-span-2">
        <h3 class="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <svg class="w-6 h-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-7.5 0C4.508 19.659 2.25 16.187 2.25 12c0-4.187 2.258-7.659 5.25-9.47m1.424 0a2.986 2.986 0 014.552 0" /></svg>
          Saran Penanganan
        </h3>
        <div class="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-lg space-y-3">
          <div>
            <h4 class="font-bold text-emerald-800">Tindakan Segera:</h4>
            <p class="text-sm text-emerald-700">{{ result.recommendations.immediate }}</p>
          </div>
          <div>
            <h4 class="font-bold text-emerald-800">Sanitasi Alat:</h4>
            <p class="text-sm text-emerald-700">{{ result.recommendations.sanitation }}</p>
          </div>
          <div>
            <h4 class="font-bold text-emerald-800">Pencegahan:</h4>
            <p class="text-sm text-emerald-700">{{ result.recommendations.prevention }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-slate-200 text-center">
       <p class="text-xs text-slate-500 bg-slate-100 p-3 rounded-lg border border-slate-200 mb-6 max-w-2xl mx-auto">
         <strong>Penting:</strong> Hasil ini adalah prediksi berdasarkan model AI dan harus digunakan sebagai referensi awal. Untuk diagnosis pasti, selalu konsultasikan dengan ahli pertanian setempat.
       </p>
      <button 
        @click="startNewDetection" 
        class="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition-transform duration-200 active:scale-95">
        Analisis Gambar Lain
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>