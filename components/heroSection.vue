<template>
    <NavbarSection />
    <section class="relative bg-[#5a4a3a] flex flex-col-reverse md:flex-row mx-auto justify-between items-center gap-9 md:gap-4 max-w-[1300px] pt-24 overflow-hidden pb-9 px-4 md:px-8">
      
      <div class="md:w-[520px] z-20">
        <h1 class="text-3xl md:text-[36px] lg:text-[46px] leading-tight lg:leading-[56px] text-white font-bold tracking-wide">
          <span class="text-[#77B254]">Identify</span> Your Tobacco Leaf with
          <span class="text-[#77B254]">TOBA.CO</span>
        </h1>
        <p class="text-base text-white mt-4 md:mt-9 mb-10 md:mb-16 tracking-normal">
          Don't let leaf disease threaten your yield. Instantly upload a photo of a leaf, and our advanced AI will deliver a precise diagnosis and treatment plan in seconds.
        </p>
        <div class="flex gap-6 sm:gap-10">
          <button class="uppercase font-bold text-xs rounded-[40px] py-2 lg:py-4 px-4 lg:px-9 text-[#5a4a3a] bg-gradient-to-r from-[#77B254] to-[#5B913B] transition-all duration-300 transform hover:scale-105 hover:to-[#77B254] hover:text-white hover:shadow-lg"> <a href="#identify">
            Scan Your Leaf Now </a>
          </button>
        </div>
      </div>
  
      <div class="p-0.3 z-20 bg-white rounded-[100px] md:rounded-bl-[200px] lg:rounded-bl-[250px] bg-opacity-20">
        <img class="max-w-[453px] w-full" src="../public/assets/tobacco.png" alt="Tobacco Leaf">
      </div>
  
    </section>
  </template>