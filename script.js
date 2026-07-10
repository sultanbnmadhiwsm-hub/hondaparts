import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { parts } from "./parts.js";

const viewer = document.getElementById("viewer");
const yearSelect = document.getElementById("year");

const partInfo = document.getElementById("partInfo");
const partName = document.getElementById("partName");
const partPrice = document.getElementById("partPrice");
const partNumber = document.getElementById("partNumber");
const partStock = document.getElementById("partStock");
const partImage = document.getElementById("partImage");
const buyBtn = document.getElementById("buyBtn");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

const camera = new THREE.PerspectiveCamera(
    45,
    viewer.clientWidth / viewer.clientHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.35;
controls.zoomSpeed = 0.8;

controls.enablePan = false;
controls.minDistance = 2.5;
controls.maxDistance = 8;

scene.add(new THREE.AmbientLight(0xffffff, 2));

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5,10,5);
scene.add(light);

const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let car = null;

let isDragging = false;
let downX = 0;
let downY = 0;

const carSettings = {

    "2007": {
        scale:1,
        position:[0,0,0],
        camera:[0,2,6],
        target:[0,1,0]
    },

    "2017": {
        scale:1,
        position:[0,0,0],
        camera:[0,2,6],
        target:[0,1,0]
    },

    "2018": {
        scale:1,
        position:[0,0,0],
        camera:[0,2,6],
        target:[0,1,0]
    },

    "2019": {
        scale:1,
        position:[0,-1,0],
        camera:[0,2,20],
        target:[3,2,0]
    },

    "2024": {
        scale:10,
        position:[0,0,0],
        camera:[0,2,6],
        target:[0,1,0]
    }

};
function resetCamera(year){

    const setting = carSettings[year];

    camera.position.set(
        setting.camera[0],
        setting.camera[1],
        setting.camera[2]
    );

    controls.target.set(
        setting.target[0],
        setting.target[1],
        setting.target[2]
    );

    camera.zoom = 1;
    camera.updateProjectionMatrix();

    controls.update();

}

function loadCar(year){

    if(car){

        scene.remove(car);

        car = null;
        const devPanel = document.getElementById("devPanel");

        const camZ = document.getElementById("camZ");
        const camY = document.getElementById("camY");
        const scaleSlider = document.getElementById("scale");

    }

       resetCamera(year);

    loader.load(

        `models/accord${year}.glb`,

        (gltf)=>{

            car = gltf.scene;

            const setting = carSettings[year];

            car.scale.set(
                setting.scale,
                setting.scale,
                setting.scale
            );

            car.position.set(
                setting.position[0],
                setting.position[1],
                setting.position[2]
            );

            car.rotation.set(0,0,0);

            scene.add(car);

            resetCamera(year);

        },

        undefined,

        (err)=>{

            console.error(err);

        }

    );

}
function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);

}

animate();

// تحميل أول موديل عند فتح الصفحة
loadCar(yearSelect.value);

// تغيير السيارة عند تغيير السنة
yearSelect.addEventListener("change", () => {

    loadCar(yearSelect.value);

});

// عند تغيير حجم النافذة
window.addEventListener("resize", () => {

    camera.aspect = viewer.clientWidth / viewer.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        viewer.clientWidth,
        viewer.clientHeight
    );

});
renderer.domElement.addEventListener("pointerdown", (e) => {

    downX = e.clientX;
    downY = e.clientY;
    isDragging = false;

});

renderer.domElement.addEventListener("pointermove", (e) => {

    if (
        Math.abs(e.clientX - downX) > 5 ||
        Math.abs(e.clientY - downY) > 5
    ) {
        isDragging = true;
    }

});

renderer.domElement.addEventListener("pointerup", (event) => {

    if (isDragging) return;
    if (!car) return;

    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(car, true);

    if (intersects.length === 0) return;

    const part = intersects[0].object.name;

    console.log(part);

    if (!parts[part]) {

        alert(part);
        return;

    }

    partName.textContent = parts[part].name;
    partPrice.textContent = parts[part].price;
    partNumber.textContent = parts[part].number;
    partStock.textContent = parts[part].stock;
    partImage.src = parts[part].image;

    buyBtn.onclick = () => {

        if (parts[part].url) {

            window.open(parts[part].url, "_blank");

        }

    };

    partInfo.style.display = "block";

});

document.getElementById("closeInfo").addEventListener("click", () => {

    partInfo.style.display = "none";

});

document.addEventListener("keydown",(e)=>{

    if(e.key==="F1"){

        devPanel.style.display =
        devPanel.style.display==="block"
        ?"none":"block";

    }

});

camZ.oninput=()=>{

    camera.position.z=Number(camZ.value);

};

camY.oninput=()=>{

    camera.position.y=Number(camY.value);

};

scaleSlider.oninput=()=>{

    if(car){

        car.scale.setScalar(Number(scaleSlider.value));

    }

};

