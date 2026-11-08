// ============================
// ELEMENT
// ============================

const dropArea = document.getElementById("dropArea");
const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");

const resultContent = document.getElementById("resultContent");
const nutritionTable = document.getElementById("nutritionTable");
const loading = document.getElementById("loading");

// ============================
// SCROLL
// ============================

function scrollUpload(){
    document.getElementById("uploadSection")
        .scrollIntoView({ behavior:"smooth" });
}

function scrollFeatures(){
    document.getElementById("featuresSection")
        .scrollIntoView({ behavior:"smooth" });
}

// ============================
// UPLOAD
// ============================

dropArea.addEventListener("click", () => {
    input.click();
});

input.addEventListener("change", (e)=>{
    const file = e.target.files[0];
    handlePreview(file);
});

dropArea.addEventListener("dragover",(e)=>{
    e.preventDefault();
});

dropArea.addEventListener("drop",(e)=>{
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if(file){

        input.files = e.dataTransfer.files;

        handlePreview(file);
    }
});

// ============================
// PREVIEW
// ============================

function handlePreview(file){

    if(!file) return;

    if(!file.type.startsWith("image/")){
        showToast("File harus berupa gambar");
        return;
    }

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
}

// ============================
// ANALYZE
// ============================

async function analyze(){

    const file = input.files[0];

    if(!file){
        showToast("Upload gambar terlebih dahulu");
        return;
    }

    loading.classList.remove("hidden");

    try{

        const formData = new FormData();

        formData.append(
            "file",
            file
        );

        const response = await fetch(
            "http://127.0.0.1:8000/predict",
            {
                method:"POST",
                body:formData
            }
        );

        if(!response.ok){
            throw new Error(
                "Gagal menghubungi backend"
            );
        }

        const data = await response.json();

        renderResult(
            data.detections || []
        );

        renderNutrition(data);

        saveHistory(
            data.detections || [],
            data.summary
        );

        showToast(
            "Analisis berhasil"
        );

    }
    catch(error){

        console.error(error);

        showToast(
            "Backend Error"
        );
    }
    finally{

        loading.classList.add("hidden");
    }
}

// ============================
// RESULT
// ============================

function renderResult(detections){

    resultContent.innerHTML = "";

    if(!detections.length){

        resultContent.innerHTML = `
            <div class="empty-state">
                <h3>Tidak ada objek terdeteksi</h3>
            </div>
        `;

        return;
    }

    detections.forEach(item=>{

        resultContent.innerHTML += `
            <div class="result-item">

                <div class="result-header">
                    <strong>${item.nama}</strong>
                    <span>${item.confidence}%</span>
                </div>

                <small>
                    🔥 ${item.kalori} kcal
                </small>

            </div>
        `;
    });
}

// ============================
// NUTRITION
// ============================

function renderNutrition(data){

    nutritionTable.innerHTML = "";

    data.detections.forEach(item=>{

        nutritionTable.innerHTML += `
            <tr>
                <td>${item.nama}</td>
                <td>${item.kalori}</td>
                <td>${item.protein}</td>
                <td>${item.karbo}</td>
                <td>${item.lemak}</td>
            </tr>
        `;
    });

    nutritionTable.innerHTML += `
        <tr>
            <td><strong>TOTAL</strong></td>
            <td><strong>${data.summary.total_kalori}</strong></td>
            <td><strong>${data.summary.total_protein}</strong></td>
            <td><strong>${data.summary.total_karbo}</strong></td>
            <td><strong>${data.summary.total_lemak}</strong></td>
        </tr>
    `;

    document.getElementById("totalKalori").innerText =
        data.summary.total_kalori;

    document.getElementById("totalProtein").innerText =
        data.summary.total_protein;

    document.getElementById("totalKarbo").innerText =
        data.summary.total_karbo;

    cekStatusMBG(
        data.summary
    );
}

// ============================
// CEK STATUS MBG
// ============================

function cekStatusMBG(summary){

    const kalori = Number(summary.total_kalori || 0);
    const protein = Number(summary.total_protein || 0);
    const karbo = Number(summary.total_karbo || 0);
    const lemak = Number(summary.total_lemak || 0);

    // TARGET MBG
    const TARGET_KALORI = 500;
    const TARGET_PROTEIN = 15;
    const TARGET_KARBO = 65;
    const TARGET_LEMAK = 20;

    // HITUNG PERSENTASE
    const persenKalori =
        Math.min((kalori / TARGET_KALORI) * 100, 100);

    const persenProtein =
        Math.min((protein / TARGET_PROTEIN) * 100, 100);

    const persenKarbo =
        Math.min((karbo / TARGET_KARBO) * 100, 100);

    const persenLemak =
        Math.min((lemak / TARGET_LEMAK) * 100, 100);

    const skor =
        (
            persenKalori +
            persenProtein +
            persenKarbo +
            persenLemak
        ) / 4;

    let status = "";

    if(skor >= 80){

        status = "🟢 Bergizi";

    }else if(skor >= 50){

        status = "🟡 Kurang Bergizi";

    }else{

        status = "🔴 Tidak Bergizi";
    }

    // UPDATE TABEL STATUS

    document.getElementById("statusBadge").innerHTML =
        `${status} (${skor.toFixed(1)}%)`;

    document.getElementById("statusKalori").innerHTML =
        `${kalori} / ${TARGET_KALORI}`;

    document.getElementById("statusProtein").innerHTML =
        `${protein} / ${TARGET_PROTEIN}`;

    document.getElementById("statusKarbo").innerHTML =
        `${karbo} / ${TARGET_KARBO}`;

    document.getElementById("statusLemak").innerHTML =
        `${lemak} / ${TARGET_LEMAK}`;

    // ALASAN

    document.getElementById("statusReason").innerHTML = `
        <tr>
            <td>Kalori memenuhi ${persenKalori.toFixed(1)}% dari standar MBG</td>
        </tr>
        <tr>
            <td>Protein memenuhi ${persenProtein.toFixed(1)}% dari standar MBG</td>
        </tr>
        <tr>
            <td>Karbohidrat memenuhi ${persenKarbo.toFixed(1)}% dari standar MBG</td>
        </tr>
        <tr>
            <td>Lemak memenuhi ${persenLemak.toFixed(1)}% dari standar MBG</td>
        </tr>
        <tr>
            <td>
                <strong>
                    Status Akhir: ${status}
                </strong>
            </td>
        </tr>
    `;
}

// ============================
// TAMPILKAN STATUS
// ============================

function tampilkanStatusMBG(status, alasan){

    const badge =
        document.getElementById("statusBadge");

    badge.className = "";

    if(status === "Bergizi"){

        badge.innerHTML =
            "🟢 Bergizi";

        badge.classList.add(
            "bergizi"
        );

    }
    else if(status === "Kurang Bergizi"){

        badge.innerHTML =
            "🟡 Kurang Bergizi";

        badge.classList.add(
            "kurang"
        );

    }
    else{

        badge.innerHTML =
            "🔴 Tidak Bergizi";

        badge.classList.add(
            "tidak"
        );
    }

    let html = "";

    alasan.forEach(item => {

        html += `
            <tr>
                <td>${item}</td>
            </tr>
        `;

    });

    document.getElementById(
        "statusReason"
    ).innerHTML = html;
}

// ============================
// HISTORY
// ============================

function saveHistory(data, summary){

    let laporan = JSON.parse(
        localStorage.getItem(
            "mbg_laporan"
        )
    ) || [];

    const kalori = Number(summary.total_kalori || 0);
    const protein = Number(summary.total_protein || 0);
    const karbo = Number(summary.total_karbo || 0);
    const lemak = Number(summary.total_lemak || 0);

    const TARGET_KALORI = 500;
    const TARGET_PROTEIN = 15;
    const TARGET_KARBO = 65;
    const TARGET_LEMAK = 20;

    const skor =
    (
        Math.min((kalori / TARGET_KALORI) * 100,100) +
        Math.min((protein / TARGET_PROTEIN) * 100,100) +
        Math.min((karbo / TARGET_KARBO) * 100,100) +
        Math.min((lemak / TARGET_LEMAK) * 100,100)
    ) / 4;

    let status = "";

    if(skor >= 80){

        status = "Bergizi";

    }else if(skor >= 50){

        status = "Kurang Bergizi";

    }else{

        status = "Tidak Bergizi";
    }

    laporan.push({

        id: Date.now(),

        tanggal:
        new Date()
        .toLocaleDateString("id-ID"),

        makanan:data,

        totalKalori:kalori,
        totalProtein:protein,
        totalKarbo:karbo,
        totalLemak:lemak,

        status:status
    });

    localStorage.setItem(

        "mbg_laporan",

        JSON.stringify(laporan)

    );
}

// ============================
// TOAST
// ============================

function showToast(message){

    alert(message);
}