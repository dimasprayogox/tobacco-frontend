<script setup>
import { ref } from 'vue';

// Logika state dan toggle tetap sama, tidak perlu diubah.
const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<template>
  <div>
    <section class="fixed top-0 left-0 w-full z-50 bg-[#5a4a3a]/80 backdrop-blur-md shadow-lg border-b border-white/10">
      <header class="flex mx-auto justify-between items-center max-w-[1300px] py-2 px-4 md:px-8">
        <div class="flex items-center gap-3">
          <img src="../public/assets/tobacco.png" alt="Tobacco Logo" class="w-10 md:w-16 h-10 md:h-16">
          <span class="text-[#77B254] font-bold text-lg">TOBAC.CO</span>
        </div>

        <nav class="hidden sm:inline-block">
          <ul class="flex gap-2 lg:gap-6">
            <li><a href="#hero" class="uppercase font-bold text-sm text-white hover:text-[#77B254] rounded-md px-3 py-2 transition-colors duration-300">HOME</a></li>
            <li><a href="#identify" class="uppercase font-bold text-sm text-white hover:text-[#77B254] rounded-md px-3 py-2 transition-colors duration-300">IDENTIFY</a></li>
            <li><a href="#condition" class="uppercase font-bold text-sm text-white hover:text-[#77B254] rounded-md px-3 py-2 transition-colors duration-300">CONDITION</a></li>
            <li><a href="#howItWork" class="uppercase font-bold text-sm text-white hover:text-[#77B254] rounded-md px-3 py-2 transition-colors duration-300">HOW IT WORK</a></li>
          </ul>
        </nav>

        <div class="hidden sm:flex items-center gap-4">
          <button class="uppercase font-bold text-xs text-white border-2 border-white rounded-[40px] py-2 px-6 hover:bg-white hover:text-[#77B254] transition-all duration-300 transform hover:scale-105">
            <a href="#identify">SCAN NOW</a>
          </button>
        </div>

        <button @click="toggleMenu" class="sm:hidden inline-block z-[60]">
          <svg width="33" height="26" viewBox="0 0 33 26" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="33" height="3.71429" rx="1.85714" fill="url(#paint0_linear_13_83)"></rect><rect y="22.2857" width="33" height="3.71429" rx="1.85714" fill="url(#paint1_linear_13_83)"></rect><rect x="9" y="11.1429" width="24" height="3.71429" rx="1.85714" fill="url(#paint2_linear_13_83)"></rect><defs><linearGradient id="paint0_linear_13_83" x1="-8.62252e-09" y1="3.46667" x2="36.0395" y2="3.46666" gradientUnits="userSpaceOnUse"><stop stop-color="#8FBC8F"></stop><stop offset="1" stop-color="#6B8E23"></stop></linearGradient><linearGradient id="paint1_linear_13_83" x1="-3.90789" y1="26" x2="33" y2="26" gradientUnits="userSpaceOnUse"><stop stop-color="#8FBC8F"></stop><stop offset="1" stop-color="#6B8E23"></stop></linearGradient><linearGradient id="paint2_linear_13_83" x1="5.21062" y1="13" x2="33.0001" y2="13" gradientUnits="userSpaceOnUse"><stop stop-color="#8FBC8F"></stop><stop offset="1" stop-color="#6B8E23"></stop></linearGradient></defs></svg>
        </button>
      </header>
    </section>

    <div 
      v-show="isMenuOpen"
      @click="toggleMenu"
      class="sm:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
      :class="isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    ></div>

    <div 
      class="sm:hidden fixed top-0 right-0 h-full w-72 bg-[#5a4a3a] shadow-2xl z-50
             transform transition-transform duration-300 ease-in-out"
      :class="isMenuOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="p-6 flex flex-col h-full">
        <div class="flex justify-between items-center mb-10">
          <span class="text-white font-bold text-lg">MENU</span>
          <button @click="toggleMenu">
            <svg class="w-6 h-6 text-white hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <ul class="flex flex-col gap-5 flex-grow">
          <li><a href="#hero" @click="toggleMenu" class="text-white hover:text-[#77B254] font-semibold text-lg transition-colors">HOME</a></li>
          <li><a href="#identify" @click="toggleMenu" class="text-white hover:text-[#77B254] font-semibold text-lg transition-colors">IDENTIFY</a></li>
          <li><a href="#condition" @click="toggleMenu" class="text-white hover:text-[#77B254] font-semibold text-lg transition-colors">CONDITION</a></li>
          <li><a href="#howItWork" @click="toggleMenu" class="text-white hover:text-[#77B254] font-semibold text-lg transition-colors">HOW IT WORK</a></li>
        </ul>

        <button class="w-full mt-auto uppercase font-bold text-sm text-white border-2 border-white rounded-[40px] py-3 px-8 hover:bg-white hover:text-[#77B254] transition-all duration-300">
            <a href="#identify" @click="toggleMenu" class="block">SCAN NOW</a>
        </button>
      </div>
    </div>
  </div>
</template>