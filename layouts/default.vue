<template>
  <div class="layout-container">
    <header ref="header" class="header">
      <div class="container">
        <h1 class="logo">TechnoShop</h1>
        <nav>
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">Sobre</NuxtLink>
          <NuxtLink to="/contact">Contato</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer>
      <p>© 2025 Meu Projeto</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { gsap } from "gsap";

const header = ref(null);

onMounted(async () => {
  await nextTick(); // Garante que o DOM está completamente montado
  if (header.value) {
    gsap.from(header.value, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
  }
});
</script>


<style scoped>
/* Layout geral */
html,
body,
.layout-container {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* Conteúdo principal ocupa o espaço restante */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px); /* Altura total menos header e footer */
}

/* Rodapé fixado ao final */
footer {
  text-align: center;
  padding: 1rem;
  background: #f5f5f5;
  width: 100%;
  position: relative;
  bottom: 0;
}

/* Cabeçalho estilizado */
.header {
  background: #333;
  color: white;
  padding: 1rem;
  position: relative;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: auto;
}

.header nav a {
  color: white;
  text-decoration: none;
  margin: 0 0.5rem;
}


footer {
  text-align: center; /* Centraliza horizontalmente o texto */
  padding: 1rem;
  background: #f5f5f5;
  width: 100%; /* Garante que o rodapé ocupa a largura total */
  position: relative; /* Pode ser alterado para 'fixed' ou 'absolute' se necessário */
  bottom: 0; /* Fixa no final da página */
}

</style>
