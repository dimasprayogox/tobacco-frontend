<template>
  <div>
    <footer class="bg-[#5a4a3a] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto flex flex-col items-center text-center">
        
        <div class="mb-6">
          <h3 class="text-2xl font-bold tracking-wider text-green-300">TOBA.CO</h3>
          <p class="text-xs text-green-200/60 mt-1">Solusi Cerdas untuk Pertanian Tembakau Anda.</p>
        </div>

        <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <button @click="openModal('privasi')" class="text-green-100/70 hover:text-white transition-colors">Kebijakan Privasi</button>
          <button @click="openModal('syarat')" class="text-green-100/70 hover:text-white transition-colors">Syarat & Ketentuan</button>
          <button @click="openModal('kontak')" class="text-green-100/70 hover:text-white transition-colors">Hubungi Kami</button>
        </div>

        <div class="w-full max-w-xs mt-8 pt-6 border-t border-white">
          <p class="text-green-200/70 text-xs">
            © {{ new Date().getFullYear() }} TOBA.CO. Dibuat dengan <span class="text-red-400">❤</span> oleh tim onic.
          </p>
        </div>

      </div>
    </footer>

    <Transition name="fade">
      <div v-if="isModalOpen" @click="closeModal" class="fixed inset-0 bg-black/60 z-50 cursor-pointer"></div>
    </Transition>
    
    <Transition name="pop">
      <div v-if="isModalOpen" class="fixed inset-0 m-auto w-11/12 md:w-3/4 lg:w-1/2 max-w-lg h-fit max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50">
        <div class="flex justify-between items-center p-4 sm:p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">{{ modalTitle }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-800 transition-colors">
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>
        
        <div class="p-6 sm:p-8 text-gray-600 text-sm leading-relaxed overflow-y-auto" v-html="modalContent">
        </div>

        <div class="p-4 bg-gray-50 border-t mt-auto text-right rounded-b-2xl">
            <button @click="closeModal" class="bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                Tutup
            </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// --- PENAMBAHAN IKON BARU ---
import { XMarkIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/vue/24/solid';

// State untuk mengelola modal
const isModalOpen = ref(false);
const activeContentKey = ref('');

// Data konten untuk modal
const contentData = {
  privasi: {
    title: 'Kebijakan Privasi',
    content: `
      <div class="space-y-3">
        <p><strong>Pembaruan Terakhir: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
        <p>Kami di TOBA.CO sangat menghargai privasi Anda. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.</p>
        <h4 class="font-semibold text-gray-700">1. Informasi yang Kami Kumpulkan</h4>
        <p>Kami mengumpulkan gambar daun tembakau yang Anda unggah dan hasil analisisnya. Kami tidak mengumpulkan data pribadi seperti nama atau email kecuali Anda memberikannya secara sukarela melalui formulir kontak.</p>
        <h4 class="font-semibold text-gray-700">2. Penggunaan Informasi</h4>
        <p>Gambar yang diunggah digunakan secara anonim untuk melatih dan meningkatkan akurasi model AI kami. Ini membantu kami memberikan layanan yang lebih baik bagi semua pengguna.</p>
        <h4 class="font-semibold text-gray-700">3. Keamanan Data</h4>
        <p>Kami menerapkan langkah-langkah keamanan standar industri untuk melindungi data Anda dari akses yang tidak sah.</p>
      </div>
    `,
  },
  syarat: {
    title: 'Syarat & Ketentuan',
    content: `
      <div class="space-y-3">
        <p>Dengan menggunakan layanan TOBA.CO ("Layanan"), Anda setuju untuk terikat oleh Syarat dan Ketentuan berikut:</p>
        <ul class="list-disc list-inside space-y-2 pl-4">
          <li>Layanan ini disediakan "sebagaimana adanya". Hasil analisis merupakan indikasi berdasarkan AI dan tidak boleh dianggap sebagai pengganti nasihat agronomi profesional.</li>
          <li>Anda bertanggung jawab penuh atas gambar yang Anda unggah. Dilarang mengunggah konten yang melanggar hukum atau tidak pantas.</li>
          <li>Kami berhak mengubah atau menghentikan layanan kapan saja tanpa pemberitahuan sebelumnya.</li>
          <li>Dengan mengunggah gambar, Anda memberikan kami lisensi non-eksklusif, bebas royalti, untuk menggunakan data tersebut untuk tujuan penelitian dan pengembangan layanan.</li>
        </ul>
      </div>
    `,
  },
  // --- KONTEN KONTAK DIUBAH DI SINI ---
  kontak: {
    title: 'Informasi Kontak',
    content: `
      <div class="space-y-6 text-left">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          </div>
          <div>
            <h5 class="font-semibold text-gray-800">Telepon / WhatsApp</h5>
            <p class="text-gray-500 text-sm">Hubungi kami untuk dukungan cepat.</p>
            <a href="https://wa.me/6281234567890" target="_blank" class="text-indigo-600 hover:underline font-medium mt-1 inline-block">+62 812-3456-7890</a>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
             <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <h5 class="font-semibold text-gray-800">Email</h5>
            <p class="text-gray-500 text-sm">Untuk pertanyaan umum dan kerjasama.</p>
            <a href="mailto:support@toba.co.id" class="text-indigo-600 hover:underline font-medium mt-1 inline-block">support@toba.co.id</a>
          </div>
        </div>
      </div>
    `
  }
};

// Computed properties untuk mendapatkan judul dan konten modal saat ini
const modalTitle = computed(() => contentData[activeContentKey.value]?.title || '');
const modalContent = computed(() => contentData[activeContentKey.value]?.content || '');

// Fungsi untuk membuka dan menutup modal
const openModal = (key: string) => {
  activeContentKey.value = key;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style scoped>
/* Transisi untuk fade in/out backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transisi untuk panel modal (pop up dan scale) */
.pop-enter-active,
.pop-leave-active {
  transition: all 0.4s cubic-bezier(0.5, 0.75, 0.75, 1.25); /* Efek 'bouncy' */
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>