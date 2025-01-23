<template>
  <div class="macbook-page">
    <!-- Botão de Voltar -->
    <div class="back-button-container">
      <button class="back-button" @click="goBack">Voltar</button>
    </div>

    <!-- Contêiner Principal -->
    <div class="content-container">
      <!-- Modelo 3D -->
      <div class="model-container">
        <MacbookModel />
      </div>

      <!-- Menu à Direita -->
      <aside class="menu-container">
        <h2>MacBook Pro</h2>
        <p>Explore o design e os recursos do MacBook Pro em 3D.</p>
        <ul>
          <li>Chip M1 Pro</li>
          <li>16 GB de RAM</li>
          <li>512 GB SSD</li>
          <li>Tela Retina de 14 polegadas</li>
        </ul>
        <button class="buy-button">Comprar Agora</button>
      </aside>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import MacbookModel from "~/components/MacbookModel.vue";

export default {
  name: "MacBook",
  components: { MacbookModel },
  methods: {
    goBack() {
      this.$router.go(-1); // Retorna à página anterior
    },
  },
  mounted() {
    // Animação de entrada dos elementos
    gsap.from(".back-button", { 
      y: -50, 
      opacity: 0, 
      duration: 1, 
      ease: "power2.out" 
    });

    gsap.from(".model-container", { 
      x: -100, 
      opacity: 0, 
      duration: 1.5, 
      ease: "power2.out", 
      delay: 0.2 
    });

    gsap.from(".menu-container", { 
      x: 100, 
      opacity: 0, 
      duration: 1.5, 
      ease: "power2.out", 
      delay: 0.2 
    });

    gsap.from(".menu-container h2, .menu-container p, .menu-container ul, .buy-button", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      delay: 0.5
    });
  },
};
</script>
  
  <style scoped>
  /* Contêiner Principal */
  .macbook-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  /* Botão de Voltar */
  .back-button-container {
    width: 90%;
    max-width: 1200px;
    margin-bottom: 1rem;
    display: flex;
    justify-content: flex-start;
  }
  
  .back-button {
    margin-top: 50px;
    background-color: #007bff;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .back-button:hover {
    background-color: #0056b3;
  }
  
  /* Contêiner do Conteúdo */
  .content-container {
    display: flex;
    width: 90%;
    max-width: 1200px;
    height: 80%;
    background: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
  }
  
  /* Contêiner do Modelo 3D */
  .model-container {
    flex: 2;
    background: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Menu à Direita */
  .menu-container {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #333;
    color: #fff;
  }
  
  .menu-container h2 {
    margin-bottom: 1rem;
    font-size: 1.8rem;
    font-weight: bold;
  }
  
  .menu-container p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  .menu-container ul {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;
  }
  
  .menu-container ul li {
    margin-bottom: 0.5rem;
  }
  
  .buy-button {
    background-color: #007bff;
    color: white;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
  }
  
  .buy-button:hover {
    background-color: #0056b3;
  }
  </style>