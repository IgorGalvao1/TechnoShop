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
      raycaster: null, // Para raycasting
      mouse: new THREE.Vector2(), // Posição do mouse normalizada
      hdrTexture: null, // Para guardar referência do HDR
    };
  },
  mounted() {
    this.initScene();
    this.loadModel();
    window.addEventListener("resize", this.onWindowResize);
    this.$refs.container.addEventListener("click", this.onCanvasClick); // Adiciona evento de clique no canvas
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
    this.$refs.container.removeEventListener("click", this.onCanvasClick); // Remove evento de clique
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

      // Configura Raycaster
      this.raycaster = new THREE.Raycaster();

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

    loadModel() {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/mechanical-keyboard/model.gltf",
        (gltf) => {
          const model = markRaw(gltf.scene);

          // Inclinação inicial do modelo
          model.rotation.x = THREE.MathUtils.degToRad(60); // Inclinação de 60 graus

          // Cria um grupo para o modelo
          const group = new THREE.Group();
          group.add(model);

          // Ajuste inicial da posição do grupo
          group.position.y += 0.8;
          group.position.x += 0.1;

          // Adiciona à cena e salva referência
          this.scene.add(group);
          this.model = group;

          // Configuração inicial dos materiais para evitar compartilhamento
          model.traverse((child) => {
            if (child.isMesh) {
              switch (child.name) {
                case "Case":
                  child.material = child.material.clone(); // Clona o material
                  child.material.color.set(0x000000); // Preto inicial
                  break;
                case "Keyboard_cable":
                  child.material = child.material.clone(); // Clona o material
                  child.material.color.set(0x000000); // Preto inicial
                  break;
                case "Keycaps":
                  child.material = child.material.clone(); // Clona o material
                  child.material.color.set(0xcccccc); // Branco inicial
                  break;
              }
            }
          });
        },
        undefined,
        (error) => {
          console.error("Error loading the model:", error);
        }
      );
    },

    animate() {
      this.animationId = requestAnimationFrame(this.animate);

      // Animação de vai e vem
      if (this.model) {
        const time = Date.now() * 0.0002; // Tempo
        const angle = Math.sin(time) * THREE.MathUtils.degToRad(60); // Vai e vem no eixo Y
        this.model.rotation.y = angle;
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },

    onCanvasClick(event) {
      // Converte coordenadas do mouse para o sistema normalizado (-1 a +1)
      const rect = this.$refs.container.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Define o raycaster a partir da câmera e da posição do mouse
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // Calcula os objetos intersectados pelo raycaster
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);

      if (intersects.length > 0) {
        // Obtém o primeiro objeto intersectado
        const clickedObject = intersects[0].object;

        // Troca a cor de acordo com o nome
        if (clickedObject.isMesh) {
          switch (clickedObject.name) {
            case "Case":
              // Alterna entre branco e preto
              clickedObject.material.color.set(
                clickedObject.material.color.getHex() === 0xffffff ? 0x000000 : 0xffffff
              );
              break;
            case "Keyboard_cable":
              // Alterna entre preto, branco, azul e vermelho
              const cableColors = [0x000000, 0xffffff, 0x0000ff, 0xff0000];
              const currentCableColorIndex = cableColors.indexOf(
                clickedObject.material.color.getHex()
              );
              clickedObject.material.color.set(
                cableColors[(currentCableColorIndex + 1) % cableColors.length]
              );
              break;
            case "Keycaps":
              // Alterna entre preto, branco, vermelho e azul
              const keycapColors = [0x000000, 0xffffff, 0xff0000, 0x0000ff];
              const currentKeycapColorIndex = keycapColors.indexOf(
                clickedObject.material.color.getHex()
              );
              clickedObject.material.color.set(
                keycapColors[(currentKeycapColorIndex + 1) % keycapColors.length]
              );
              break;
          }
        }
      }
    },

    onWindowResize() {
      const container = this.$refs.container;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    },

    cleanUpScene() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }

      if (this.renderer && this.renderer.domElement && this.$refs.container) {
        this.$refs.container.removeChild(this.renderer.domElement);
      }

      if (this.scene) {
        this.scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }

      if (this.hdrTexture) {
        this.hdrTexture.dispose();
      }
      if (this.renderer) {
        this.renderer.dispose();
      }

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
