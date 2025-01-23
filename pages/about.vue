<template>
  <div class="about">
    <h1>Sobre o Projeto</h1>
    <p>Este site será usado para explorar modelos 3D e animações dinâmicas.</p>
    <NuxtLink to="/">Voltar para Home</NuxtLink>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { gsap } from 'gsap';

onMounted(() => {
  gsap.from('.about', { opacity: 0, scale: 0.8, duration: 1 });
});
</script>

<style scoped>
.about {
  text-align: center;
  padding: 2rem;
}
</style>
