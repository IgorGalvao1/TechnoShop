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
import Stats from "stats.js";

export default {
  name: "IphoneModel",
  data() {
    return {
      model: null,
      animationId: null,
      renderer: null,
      scene: null,
      camera: null,
      controls: null,
      hdrTexture: null, // Para guardar referência do HDR
      stats: null,
      isSceneReady: false, // Adicionado para evitar múltiplas execuções
    };
  },
  mounted() {
    this.initScene();
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
      this.camera.position.set(0, 1, 4.1);

      this.renderer = markRaw(
        new THREE.WebGLRenderer({ antialias: true, alpha: true })
      );
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);

      // Controles de órbita
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;

      // Adiciona luz ambiente como fallback
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz ambiente
      this.scene.add(ambientLight);

      // Carrega HDR (Environment Map)
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load(
        "/textures/blocky_photo_studio_1k.hdr",
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          this.scene.environment = texture;
          this.scene.background = texture; // Caso queira fundo HDR
          this.hdrTexture = texture;

          // Só inicia o modelo e animação depois que o HDR estiver carregado
          this.loadModel();
          this.animate();
        },
        undefined,
        (error) => console.error("Erro ao carregar o HDR:", error)
      );
    },

    loadModel() {
      if (this.isSceneReady) return; // Evita carregar o modelo mais de uma vez

      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf",
        (gltf) => {
          this.model = markRaw(gltf.scene);

          // Certifique-se de que o modelo é válido antes de adicionar à cena
          if (this.model) {
            // Ajustes de rotação e posição
            this.model.rotation.x = THREE.MathUtils.degToRad(0);
            this.model.position.y = -1.4;
            this.model.position.z = 0.2;

            this.scene.add(this.model);
            this.isSceneReady = true; // Marca como carregado
          } else {
            console.error("Modelo carregado, mas não possui uma cena válida.");
          }
        },
        undefined,
        (error) => console.error("Erro ao carregar o modelo iPhone:", error)
      );
    },

    animate() {
      this.animationId = requestAnimationFrame(this.animate);

      // Atualiza o monitor de recursos
      if (this.stats) this.stats.begin();

      // Rotação contínua do modelo
      if (this.model) {
        this.model.rotation.y += 0.005;
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);

      // Finaliza o monitor de recursos
      if (this.stats) this.stats.end();
    },

    onWindowResize() {
      const container = this.$refs.container;
      if (this.camera && this.renderer) {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
      }
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

      // Remove o Stats.js do DOM
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

      // Se tiver carregado HDR, descartar
      if (this.hdrTexture) {
        this.hdrTexture.dispose();
      }
      if (this.scene) {
        this.scene.environment = null;
        this.scene.background = null;
      }

      // Descartar controles
      if (this.controls) {
        this.controls.dispose();
        this.controls = null;
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
  overflow: hidden;
  background-color: #f5f5f5;
}
</style>
