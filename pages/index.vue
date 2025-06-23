<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-green-50">
    <heroSection id="hero" />
    <identifySection id="identify"/>

    <main class="py-24 px-4 bg-[#ae9173] backdrop-blur-sm">
      <div class="max-w-6xl mx-auto space-y-24">
        <ConditionSection id="condition" />
        <HowItWorkSection id="howItWork" />
      </div>
    </main>

    <FooterSection />
  </div>
</template>
