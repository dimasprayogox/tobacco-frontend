<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-green-50">
    <navbarSection />
    <heroSection id="hero" />
    <identifySection id="identify"/>

    <main class="py-24 px-4 bg-[#ae9173] backdrop-blur-sm">
      <div class="max-w-6xl mx-auto space-y-40">
        <conditionSection id="condition" />
        <howItWorkSection id="howItWork" />
      </div>
    </main>

    <footerSection />
  </div>
</template>

<style>
#hero, #identify, #condition, #howItWork {
  scroll-margin-top: 90px; 
}
</style>
