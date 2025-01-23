<template>
  <div ref="container" class="webgl-container"></div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { markRaw } from "vue";
import Stats from "stats.js"; // Importação do Stats.js

export default {
  name: "KeyboardModel",
  data() {
    return {
      model: null,
      animationId: null,
      renderer: null,
      scene: null,
      camera: null,
      controls: null,
      hdrTexture: null, // Para guardar referência do HDR
      stats: null, // Referência ao monitor de recursos
    };
  },
  mounted() {
    this.initScene();
    // this.initStats(); // Inicializa o monitor de recursos
    this.loadModel();
    window.addEventListener("resize", this.onWindowResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
    this.cleanUpScene();
  },
  methods: {
    initScene() {
      const container = this.$refs.container;

      // Cria cena, câmera, renderer
      this.scene = markRaw(new THREE.Scene());
      this.camera = markRaw(
        new THREE.PerspectiveCamera(
          75,
          container.clientWidth / container.clientHeight,
          0.1,
          1000
        )
      );
      this.camera.position.set(0, 0, 3.6);

      this.renderer = markRaw(
        new THREE.WebGLRenderer({ antialias: true, alpha: true })
      );
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);

      // Fundo transparente
      this.scene.background = null;

      // Controles de órbita
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;

      // Carrega HDR (Environment Map)
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load("/textures/blocky_photo_studio_1k.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment = texture;
        this.hdrTexture = texture;
      });

      // Inicia loop de animação
      this.animate();
    },

    initStats() {
      // Inicializa o monitor de recursos (Stats.js)
      this.stats = new Stats();
      this.stats.showPanel(0, 1, 2); // 0: FPS, 1: tempo, 2: memória
      document.body.appendChild(this.stats.dom); // Adiciona o monitor ao DOM
    },

    loadModel() {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/mechanical-keyboard/model.gltf",
        (gltf) => {
          const model = markRaw(gltf.scene);

          // Crie um grupo para facilitar posicionamento
          const group = new THREE.Group();
          group.add(model);

          // Ajustes de posição
          group.position.y += 0.8;
          group.position.x += 0.1;

          // Adiciona à cena e salva referência
          this.scene.add(group);
          this.model = group;

          // Rotação inicial no eixo X
          model.rotation.x = THREE.MathUtils.degToRad(60);
        },
        undefined,
        (error) => {
          console.error("Error loading the model:", error);
        }
      );
    },

    animate() {
      this.animationId = requestAnimationFrame(this.animate);

      // Atualiza o monitor de recursos
      this.stats?.begin();

      // Exemplo de rotação limitada
      if (this.model) {
        const time = Date.now() * 0.0002; // Tempo
        const angle = Math.sin(time) * THREE.MathUtils.degToRad(60);
        this.model.rotation.y = angle;
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);

      // Finaliza o monitor de recursos
      this.stats?.end();
    },

    onWindowResize() {
      const container = this.$refs.container;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    },

    cleanUpScene() {
      // Cancela o loop de animação
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }

      // Remove o canvas do DOM
      if (this.renderer && this.renderer.domElement && this.$refs.container) {
        this.$refs.container.removeChild(this.renderer.domElement);
      }

      // Remove o monitor de recursos
      if (this.stats) {
        document.body.removeChild(this.stats.dom);
        this.stats = null;
      }

      // Descartar objetos da cena
      if (this.scene) {
        this.scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();

          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => {
                if (mat.map) mat.map.dispose();
                mat.dispose();
              });
            } else {
              if (object.material.map) object.material.map.dispose();
              object.material.dispose();
            }
          }
        });
      }

      // Se tiver carregado HDR, descartamos também
      if (this.hdrTexture) {
        this.hdrTexture.dispose();
      }
      if (this.scene) {
        this.scene.environment = null;
        this.scene.background = null;
      }

      // Descartar renderer
      if (this.renderer) {
        this.renderer.dispose();
      }

      // Zera as referências
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.model = null;
      this.hdrTexture = null;
    },
  },
};
</script>


<style scoped>
.webgl-container {
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: hidden;
}
</style>
