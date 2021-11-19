import * as OrbitControls from '../libs/orbit-controls.min.js';
import { EffectComposer } from '../libs/postprocessing/EffectComposer.js';
import { RenderPass } from '../libs/postprocessing/RenderPass.js';
import { SSAOPass } from '../libs/postprocessing/SSAOPass.js';
import AnimationsHandler from './animations.js';
import Cube from './cube.js';

class SceneManager {
    constructor() {
        this.init();
    }

    init() {
        this.postprocessing = { enabled: true };
        this.clock = new THREE.Clock();
        this.backgroundColor = 0xa7d2f2;

        this.setupScene();
        this.setupCamera();
        this.setupLights();
        this.setupControls();
        this.setupRenderer();
        this.setupPostprocessing();
        this.setupRaycaster();
        this.addMeshes();
        this.addUtils();
        this.addListeners();
        this.render();
    }

    setupScene() {
        this.canvas = document.querySelector('canvas.webgl');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.backgroundColor);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 300);
        this.camera.position.x = 20;
        this.camera.position.y = 20;
        this.camera.position.z = 20;
        this.scene.add(this.camera);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
    }

    setupPostprocessing() {
        this.renderer.autoClear = false;

        const composer = new EffectComposer(this.renderer);
        composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        composer.setSize(window.innerWidth, window.innerHeight);

        const renderPass = new RenderPass(this.scene, this.camera);
        composer.addPass(renderPass);
        this.setupSSAOS(composer);

        this.postprocessing.composer = composer;
    }

    setupSSAOS(composer) {
        this.ssaoPass = new SSAOPass(this.scene, this.camera, window.innerWidth, window.innerHeight);
        this.ssaoPass.kernelRadius = 5;
        composer.addPass(this.ssaoPass);
    }

    setupRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    addMeshes() {
        this.cube = new Cube();
        this.scene.add(this.cube.group);
        AnimationsHandler.add(this.cube);
    }

    addUtils() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }

    addListeners() {
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('mousemove', (event) => this.handleMouseMove(event));
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.postprocessing.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.postprocessing.composer.setSize(window.innerWidth, window.innerHeight);
    }

    handleMouseMove(event) {
        this.mouse.x = event.clientX / window.innerWidth * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera)
        const objectsToTest = this.scene.children;

        let intersected = this.raycaster.intersectObjects(objectsToTest, true);
        intersected = intersected[0] && intersected[0].object;

        this.cube.handleHover(intersected);
    }

    render = () => {
        AnimationsHandler.animate(this.clock.getElapsedTime());
        this.controls.update();
        this.stats.update();
        this.postprocessing.composer.render();
        window.requestAnimationFrame(this.render);
    }

}

export default SceneManager;