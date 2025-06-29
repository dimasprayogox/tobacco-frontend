<template>
    <div id="howItWork">
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
          class="bg-white/60 backdrop-blur-md border border-gray-200/80 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex flex-col text-center"
        >
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {{ step.step }}
          </div>
          <h3 class="font-bold text-lg text-gray-800 mb-2">{{ step.title }}</h3>
          <p class="text-gray-700">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">

  const howItWorksSteps = [
    { step: "1", title: "Unggah Gambar", description: "Pilih foto daun tembakau yang jelas dari galeri Anda." },
    { step: "2", title: "Proses AI", description: "Model AI kami menganalisis pola dan tekstur pada gambar." },
    { step: "3", title: "Hasil & Solusi", description: "Dapatkan diagnosis akurat beserta rekomendasi penanganan." },
  ];
  </script>
  