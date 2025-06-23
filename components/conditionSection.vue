<template>
    <div>
      <h2 
        class="text-4xl font-bold text-center mb-12 text-gray-800"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
      >
        Kondisi yang Dapat dideteksi
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(disease, index) in commonDiseases" :key="disease.name"
             v-motion :initial="{ opacity: 0, y: 30 }" :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 + index * 100 } }"
             class="bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl p-6 text-left transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl flex flex-col">
          
          <div class="flex items-center mb-4">
            <div :class="`w-14 h-14 mr-4 rounded-full bg-gradient-to-br ${disease.color} flex items-center justify-center shadow-md flex-shrink-0`">
              <component :is="disease.icon" class="h-7 w-7 text-white" />
            </div>
            <h3 class="font-bold text-gray-800 text-xl">{{ disease.name }}</h3>
          </div>
          
          <p class="text-gray-700 text-sm flex-grow">{{ disease.description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { markRaw } from 'vue'
  import { CheckCircle2, Leaf, Microscope } from 'lucide-vue-next'
  
  const commonDiseases = [
    { name: "Daun Sehat", description: "Daun dalam kondisi prima tanpa gejala penyakit.", icon: markRaw(CheckCircle2), color: "from-green-500 to-lime-500" },
    { name: "Bercak Daun Cercospora", description: "Bercak 'mata katak' berwarna coklat muda/abu-abu.", icon: markRaw(Leaf), color: "from-orange-500 to-red-500" },
    { name: "Bercak Daun Alternaria", description: "Bercak coklat kehitaman dengan pola cincin target.", icon: markRaw(Microscope), color: "from-amber-500 to-orange-500" },
  ];
  </script>