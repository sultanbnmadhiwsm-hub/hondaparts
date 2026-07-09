import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { parts } from "./parts.js";

const partInfo = document.getElementById("partInfo");
const partName = document.getElementById("partName");
const partPrice = document.getElementById("partPrice");
const partNumber = document.getElementById("partNumber");
const partStock = document.getElementById("partStock");
const partImage = document.getElementById("partImage");
const buyBtn = document.getElementById("buyBtn");

const viewer = document.getElementById("viewer");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

const camera = new THREE.PerspectiveCamera(
    45,
    viewer.clientWidth / viewer.clientHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(viewer.clientWidth, viewer.clientHeight);
viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 2));

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 10, 5);
scene.add(light);

const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let car;

loader.load(
    "models/accord.glb",

    (gltf) => {

        car = gltf.scene;
        car.scale.set(1, 1, 1);

        scene.add(car);

    },

    undefined,

    (err) => console.error(err)

);

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);

}

animate();

window.addEventListener("click", (event) => {

    if (!car) return;

    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(car, true);

    if (intersects.length === 0) return;

    const part = intersects[0].object.name;

    console.log(part);

    if (parts[part]) {

        partName.textContent = parts[part].name;
        partPrice.textContent = parts[part].price;
        partNumber.textContent = parts[part].number;
        partStock.textContent = parts[part].stock;
        partImage.src = parts[part].image;

        buyBtn.onclick = () => {
            window.open(parts[part].url, "_blank");
        };

        partInfo.style.display = "block";

    } else {

        alert(part);

    }

});

document.getElementById("closeInfo").onclick = () => {

    partInfo.style.display = "none";

};