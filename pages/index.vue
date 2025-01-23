<template>
  <div>

    <!-- Seção Hero -->
    <section ref="hero" class="hero">
      <div class="container">
        <div class="hero-text">
          <h1>Explore o Futuro da Tecnologia</h1>
          <p>
            Na TechnoShop, você encontra os produtos de tecnologia mais inovadores do mercado. Veja nossos itens em 3D e experimente antes de comprar!
          </p>
          <button @click="scrollToAbout">Saiba Mais</button>
        </div>
        <div class="hero-model">
          <!-- Insere o Modelo 3D Condicionalmente -->
          <KeyboardModel v-if="showModel" />
        </div>
        <img 
          class="icon-resize" 
          src="https://img.icons8.com/ios-filled/50/resize-four-directions.png" 
          alt="resize-four-directions"
        />

      </div>
    </section>

    <!-- Seção Produtos -->
    <section ref="products" class="products">
      <div class="container">
        <h2>Produtos Disponíveis</h2>
        <div class="product-grid">
          <!-- Card 1 - iPhone X -->
          <div class="product-card">
            <img src="/images/iphone-x.jpg" alt="iPhone X" />
            <h3>iPhone X</h3>
            <p>Experimente o futuro com o iPhone X. Explore cada detalhe em 3D antes de comprar.</p>
            <NuxtLink to="/products/iphone-x" class="product-button">Ver Mais</NuxtLink>
          </div>

          <!-- Card 2 - MacBook -->
          <div class="product-card">
            <img src="/images/macbook.jpg" alt="MacBook" />
            <h3>MacBook</h3>
            <p>Descubra a potência e elegância do MacBook. Veja o modelo em 3D agora!</p>
            <NuxtLink to="/products/macbook" class="product-button">Ver Mais</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção Sobre -->
    <section ref="about" class="about">
      <div class="container">
        <h2>Sobre a TechnoShop</h2>
        <p>
          A TechnoShop é mais do que uma loja de tecnologia. Nosso objetivo é revolucionar a experiência de compra online, permitindo que você veja e interaja com nossos produtos em 3D. Design, inovação e qualidade em um só lugar.
        </p>
      </div>
    </section>

    <!-- Seção Features -->
    <section class="features">
      <div class="container">
        <h2>Por que escolher a TechnoShop?</h2>
        <div class="features-grid">
          <div class="feature-item" ref="feature1">
            <h3>Produtos de Última Geração</h3>
            <p>
              Encontre o que há de mais avançado em tecnologia, de gadgets a equipamentos de ponta.
            </p>
          </div>
          <div class="feature-item" ref="feature2">
            <h3>Experiência Imersiva</h3>
            <p>
              Visualize nossos produtos em 3D e explore cada detalhe antes de fazer sua escolha.
            </p>
          </div>
          <div class="feature-item" ref="feature3">
            <h3>Qualidade Garantida</h3>
            <p>
              Trabalhamos apenas com marcas confiáveis para oferecer o melhor a nossos clientes.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import KeyboardModel from '@/components/KeyboardModel.vue';

// Registra o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const header = ref(null);
const hero = ref(null);
const about = ref(null);
const feature1 = ref(null);
const feature2 = ref(null);
const feature3 = ref(null);
const showModel = ref(false); // Controle para mostrar o modelo 3D

const scrollToAbout = () => {
  about.value.scrollIntoView({ behavior: 'smooth' });
};

const animateSections = () => {

  // Animação da seção Hero
  gsap.from(hero.value, {
    opacity: 0,
    scale: 0.1,
    duration: 1,
    onComplete: () => {
      // Exibe o modelo após a animação
      setTimeout(() => {
        showModel.value = true;
      }, 100); // Delay adicional de 500ms
    },
  });

  // Animação da seção About
  gsap.from(about.value, {
    opacity: 0,
    y: 100,
    duration: 1,
    scrollTrigger: {
      trigger: about.value,
      start: "top bottom",
    },
  });

  // Animação das Features
  gsap.from(feature1.value, {
    x: -50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: feature1.value,
      start: "top 90%",
    },
  });

  gsap.from(feature2.value, {
    y: 50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: feature2.value,
      start: "top 90%",
    },
  });

  gsap.from(feature3.value, {
    x: 50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: feature3.value,
      start: "top 90%",
    },
  });
};

onMounted(animateSections);
</script>


<style>
/* Estilos Globais */
body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  color: #333;
  background: #f5f5f5;
  line-height: 1.6;
}

/* Cabeçalho */
.header {
  background: #333;
  color: white;
  padding: 1rem 0;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: auto;
  padding: 0 1rem;
}
.header nav a {
  color: white;
  text-decoration: none;
  margin: 0 0.5rem;
}

/* Seção Hero */
.hero {
  height: 100vh;
  background: linear-gradient(135deg, #333, #444);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.hero .container {
  display: flex;
  flex-direction: column;
}
.hero button {
  background: #007bff;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

/* Seção Sobre */
.about {
  padding: 4rem 1rem;
  background: #f9f9f9;
  text-align: center;
}
.about h2 {
  margin-bottom: 1rem;
}

/* Seção Features */
.features {
  padding: 4rem 1rem;
  background: #333;
  color: white;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
.feature-item {
  background: #444;
  padding: 2rem;
  border-radius: 10px;
}

.hero-model {
  height: 500px;
  width: 600px;
  margin: 0 auto; /* Centraliza horizontalmente */
  display: flex;
  justify-content: center; /* Centraliza o conteúdo horizontalmente */
  align-items: center; /* Centraliza o conteúdo verticalmente */
  border-radius: 10px;
  overflow: hidden;
}

.products {
  padding: 4rem 1rem;
  background: #f9f9f9;
  text-align: center;
}

.products h2 {
  margin-bottom: 2rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card img {
  width: 60%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
}

.product-card h3 {
  margin: 1rem 0;
  font-size: 1.5rem;
}

.product-card p {
  font-size: 1rem;
  color: #666;
}

.product-card .product-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.7rem 1.5rem;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.product-card .product-button:hover {
  background: #0056b3;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.icon-resize {
  margin: 0 auto;

  width: 30px; /* Ajuste o tamanho */
  height: 30px;
  filter: brightness(0) invert(1); /* Deixa o ícone branco */
}

</style>