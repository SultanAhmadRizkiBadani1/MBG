// =====================================
// AMBIL ID DARI URL
// =====================================

const params = new URLSearchParams(
    window.location.search
);

const laporanId = Number(
    params.get("id")
);


// =====================================
// AMBIL DATA DARI LOCAL STORAGE
// =====================================

let laporanList = JSON.parse(
    localStorage.getItem("mbg_laporan")
) || [];

const laporan = laporanList.find(
    item => item.id === laporanId
);


// =====================================
// VALIDASI DATA
// =====================================

if(!laporan){

    alert("Laporan tidak ditemukan!");

    window.location.href =
        "histori.html";
}


// =====================================
// ELEMENT
// =====================================

const form =
document.getElementById("editForm");

const tanggal =
document.getElementById("tanggal");

const status =
document.getElementById("status");

const kalori =
document.getElementById("kalori");

const protein =
document.getElementById("protein");

const karbo =
document.getElementById("karbo");

const lemak =
document.getElementById("lemak");


// =====================================
// LOAD DATA
// =====================================

function loadData(){

    tanggal.value =
        laporan.tanggal || "";

    status.value =
        laporan.status || "Bergizi";

    kalori.value =
        laporan.totalKalori || 0;

    protein.value =
        laporan.totalProtein || 0;

    karbo.value =
        laporan.totalKarbo || 0;

    lemak.value =
        laporan.totalLemak || 0;
}


// =====================================
// HITUNG STATUS MBG OTOMATIS
// =====================================

function hitungStatus(){

    const totalKalori =
        Number(kalori.value) || 0;

    const totalProtein =
        Number(protein.value) || 0;

    const totalKarbo =
        Number(karbo.value) || 0;

    const totalLemak =
        Number(lemak.value) || 0;

    const TARGET_KALORI = 500;
    const TARGET_PROTEIN = 15;
    const TARGET_KARBO = 65;
    const TARGET_LEMAK = 20;

    const persenKalori =
        Math.min(
            (totalKalori / TARGET_KALORI) * 100,
            100
        );

    const persenProtein =
        Math.min(
            (totalProtein / TARGET_PROTEIN) * 100,
            100
        );

    const persenKarbo =
        Math.min(
            (totalKarbo / TARGET_KARBO) * 100,
            100
        );

    const persenLemak =
        Math.min(
            (totalLemak / TARGET_LEMAK) * 100,
            100
        );

    const skor =
    (
        persenKalori +
        persenProtein +
        persenKarbo +
        persenLemak
    ) / 4;

    if(skor >= 80){

        status.value =
            "Bergizi";

    }
    else if(skor >= 50){

        status.value =
            "Kurang Bergizi";

    }
    else{

        status.value =
            "Tidak Bergizi";
    }
}


// =====================================
// AUTO UPDATE STATUS
// =====================================

kalori.addEventListener(
    "input",
    hitungStatus
);

protein.addEventListener(
    "input",
    hitungStatus
);

karbo.addEventListener(
    "input",
    hitungStatus
);

lemak.addEventListener(
    "input",
    hitungStatus
);


// =====================================
// SIMPAN PERUBAHAN
// =====================================

form.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        laporan.status =
            status.value;

        laporan.totalKalori =
            Number(kalori.value);

        laporan.totalProtein =
            Number(protein.value);

        laporan.totalKarbo =
            Number(karbo.value);

        laporan.totalLemak =
            Number(lemak.value);

        localStorage.setItem(

            "mbg_laporan",

            JSON.stringify(
                laporanList
            )

        );

        alert(
            "Laporan berhasil diperbarui!"
        );

        window.location.href =
            `detail.html?id=${laporanId}`;
    }
);


// =====================================
// RESET FORM
// =====================================

function resetForm(){

    if(
        confirm(
            "Kembalikan data seperti semula?"
        )
    ){

        loadData();
    }
}


// =====================================
// LOAD PERTAMA
// =====================================

loadData();