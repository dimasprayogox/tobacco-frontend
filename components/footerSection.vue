<template>
    <footer class="bg-[#5a4a3a] text-white py-12">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-col items-center text-center space-y-6">
          
          <h3 class="text-2xl font-bold text-green-300">Tobacco Leaf AI</h3>
  
          <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <a href="#" class="text-green-100/80 hover:text-white transition-colors">Beranda</a>
            <a href="#" class="text-green-100/80 hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" class="text-green-100/80 hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="mailto:support@tobaccoleafai.com" class="text-green-100/80 hover:text-white transition-colors">Hubungi Kami</a>
          </div>
  
          <div class="w-full max-w-md border-t border-green-700/50"></div>
  
          <p class="text-green-200/70 text-sm">
            © {{ new Date().getFullYear() }} TOBAC.CO. Dibuat dengan <span class="text-red-400">❤</span> oleh tim project.
          </p>
  
        </div>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  // Tidak perlu import ikon lagi untuk desain ini, jadi bisa dikosongkan.
  </script>