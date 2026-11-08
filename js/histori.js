// =====================================
// ELEMENT
// =====================================

const reportContainer =
document.getElementById(
    "dailyReports"
);

const totalLaporan =
document.getElementById(
    "totalLaporan"
);

const totalKalori =
document.getElementById(
    "totalKalori"
);

const statusTerakhir =
document.getElementById(
    "statusTerakhir"
);

const searchInput =
document.getElementById(
    "searchInput"
);


// =====================================
// AMBIL DATA
// =====================================

let laporan = JSON.parse(

    localStorage.getItem(
        "mbg_laporan"
    )

) || [];


// =====================================
// RENDER SUMMARY
// =====================================

function renderSummary(){

    totalLaporan.innerText =
        laporan.length;

    let total = 0;

    laporan.forEach(item=>{

        total += Number(
            item.totalKalori || 0
        );

    });

    totalKalori.innerText =
        total;

    if(laporan.length > 0){

        statusTerakhir.innerText =
            laporan[
                laporan.length - 1
            ].status;

    }else{

        statusTerakhir.innerText =
            "-";
    }
}


// =====================================
// RENDER REPORT
// =====================================

function renderReports(data){

    reportContainer.innerHTML = "";

    if(data.length === 0){

        reportContainer.innerHTML = `

            <div class="empty-state">

                <h3>
                    Belum ada laporan
                </h3>

            </div>

        `;

        return;
    }

    data.forEach(item=>{

        reportContainer.innerHTML += `

            <div class="report-card">

                <h3>
                    📅 ${item.tanggal}
                </h3>

                <p>
                    🔥 Total Kalori :
                    <strong>
                        ${item.totalKalori}
                    </strong>
                </p>

                <p>
                    📊 Status :
                    <strong>
                        ${item.status}
                    </strong>
                </p>

                <div class="report-actions">

                    <button
                        onclick="lihatLaporan(${item.id})"
                        class="primary">

                        👁 Detail

                    </button>

                    <button
                        onclick="editLaporan(${item.id})"
                        class="secondary">

                        ✏ Edit

                    </button>

                    <button
                        onclick="hapusLaporan(${item.id})"
                        class="danger">

                        🗑 Hapus

                    </button>

                </div>

            </div>

        `;
    });
}


// =====================================
// LIHAT LAPORAN
// =====================================

function lihatLaporan(id){

    const data =
    laporan.find(
        item => item.id === id
    );

    if(!data) return;

    let detail = `

Tanggal :
${data.tanggal}

Status :
${data.status}

Total Kalori :
${data.totalKalori}

Protein :
${data.totalProtein}

Karbo :
${data.totalKarbo}

Lemak :
${data.totalLemak}

========================

`;

    data.makanan.forEach(item=>{

        detail +=

`${item.nama}
Kalori : ${item.kalori}
Protein : ${item.protein}
Karbo : ${item.karbo}
Lemak : ${item.lemak}

`;
    });

    alert(detail);
}


// =====================================
// EDIT
// =====================================

function editLaporan(id){

    window.location.href =
        `edit.html?id=${id}`;
}


// =====================================
// HAPUS
// =====================================

function hapusLaporan(id){

    const yakin = confirm(

        "Hapus laporan ini?"

    );

    if(!yakin) return;

    laporan =
    laporan.filter(
        item => item.id !== id
    );

    localStorage.setItem(

        "mbg_laporan",

        JSON.stringify(laporan)

    );

    renderReports(laporan);

    renderSummary();

    showToast(
        "Laporan berhasil dihapus"
    );
}


// =====================================
// SEARCH
// =====================================

searchInput.addEventListener(

    "keyup",

    function(){

        const keyword =
        this.value.toLowerCase();

        const hasil =

        laporan.filter(item=>

            item.tanggal
            .toLowerCase()
            .includes(keyword)

        );

        renderReports(hasil);
    }
);


// =====================================
// EXPORT
// =====================================

function exportHistory(){

    let content =
        "LAPORAN MBG AI\n\n";

    laporan.forEach(item=>{

        content +=

`Tanggal : ${item.tanggal}
Status : ${item.status}
Kalori : ${item.totalKalori}

`;
    });

    const blob =
    new Blob(

        [content],

        {
            type:"text/plain"
        }

    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "laporan_mbg.txt";

    link.click();

    showToast(
        "Export berhasil"
    );
}


// =====================================
// CLEAR
// =====================================

function clearHistory(){

    const yakin = confirm(

        "Hapus semua laporan?"

    );

    if(!yakin) return;

    localStorage.removeItem(
        "mbg_laporan"
    );

    laporan = [];

    renderReports(laporan);

    renderSummary();

    showToast(
        "Semua laporan dihapus"
    );
}


// =====================================
// TOAST
// =====================================

function showToast(message){

    alert(message);
}


// =====================================
// LOAD
// =====================================

renderReports(laporan);

renderSummary();

function lihatLaporan(id){

    window.location.href =
        `detail.html?id=${id}`;
}