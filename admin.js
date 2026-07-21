let parts = {};
alert("admin.js اشتغل");
const deleteBtn = document.getElementById("delete");
const allParts = document.getElementById("allParts");
const partsSelect = document.getElementById("partsSelect");

const relatedList = document.getElementById("relatedList");
const addRelated = document.getElementById("addRelated");

const idInput = document.getElementById("id");
const name = document.getElementById("name");
const number = document.getElementById("number");
const price = document.getElementById("price");
const stock = document.getElementById("stock");
const image = document.getElementById("image");
const description = document.getElementById("description");
const url = document.getElementById("url");


const save = document.getElementById("save");
const outputCode = document.getElementById("outputCode");

let related = [];
async function loadDatabase() {

    const response = await fetch("/get-parts/2018");

    parts = await response.json();

    allParts.innerHTML = "";
    partsSelect.innerHTML = "";

    for (const id in parts) {

        const option1 = document.createElement("option");
        option1.value = id;
        option1.textContent = parts[id].name;
        allParts.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = id;
        option2.textContent = parts[id].name;
        partsSelect.appendChild(option2);

    }

    if (allParts.options.length) {
        loadPart(allParts.value);
    }

}

loadDatabase();

function loadPart(id){

    idInput.value = id;

    const part = parts[id];

    if(!part) return;

    name.value = part.name || "";
    number.value = part.number || "";
    url.value = part.url || "";
    price.value = part.price || "";
    stock.value = part.stock || "";
    image.value = part.image || "";
    description.value = part.description || "";

    related = part.related ? [...part.related] : [];

    drawRelated();

}

allParts.onchange = () => {

    loadPart(allParts.value);

};

if(allParts.options.length){

    loadPart(allParts.value);

}
// إضافة قطعة مرتبطة
addRelated.onclick = () => {

    const id = partsSelect.value;

    if (!parts[id]) return;

    related.push({

        id: id,
        name: parts[id].name,
        price: parts[id].price,
        image: parts[id].image

    });

    drawRelated();

};

// رسم القطع المرتبطة
function drawRelated() {

    relatedList.innerHTML = "";

    related.forEach((item, index) => {

        relatedList.innerHTML += `
        <div class="relatedItem">

            <div>

                <b>${item.name}</b><br>

                ${item.price} ريال

            </div>

            <button
                onclick="removeRelated(${index})"
                style="width:70px;height:35px;background:red;color:white;border:none;border-radius:8px">

                حذف

            </button>

        </div>
        `;

    });

}

window.removeRelated = function(index) {

    related.splice(index, 1);

    drawRelated();

};

save.onclick = async () => {

    try {

        const id = idInput.value.trim();

        if (!id) {
            alert("اكتب معرف القطعة (ID)");
            return;
        }

        const data = {
            id: id,
            name: name.value,
            number: number.value,
            price: price.value,
            stock: stock.value,
            image: image.value,
            description: description.value,
            url: url.value,
            related: JSON.stringify(related)
        };

        const response = await fetch("/save-part", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result);
        console.log(response.status);
        if (result.success) {

    alert("✅ تم الحفظ بنجاح");

    await loadDatabase();

    allParts.value = id;

    loadPart(id);

}
    } catch (err) {

        console.error(err);
        alert(err);

    }

};
deleteBtn.onclick = async ()=>{

    const id = idInput.value.trim();

    if(!id){
        alert("اختر قطعة أولاً");
        return;
    }

    if(!confirm("هل تريد حذف هذه القطعة؟")){
        return;
    }

    const response = await fetch("/delete-part",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            id:id
        })
    });

    const result = await response.json();

    alert(JSON.stringify(result));

    location.reload();

};