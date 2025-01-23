<template>
  <div class="contact" ref="contactForm">
    <h1>Contato</h1>
    <form @submit.prevent="handleSubmit">
      <input type="text" placeholder="Seu nome" required />
      <input type="email" placeholder="Seu email" required />
      <textarea placeholder="Sua mensagem" required></textarea>
      <button type="submit">Enviar</button>
    </form>
    <NuxtLink to="/">Voltar para Home</NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';

const contactForm = ref(null);

const handleSubmit = () => {
  alert('Mensagem enviada com sucesso!');
};

onMounted(() => {
  gsap.from(contactForm.value, { opacity: 0, y: 100, duration: 1 });
});
</script>

<style scoped>
.contact {
  text-align: center;
  padding: 2rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}
button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
