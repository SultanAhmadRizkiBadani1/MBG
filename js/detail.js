// =====================================
// AMBIL ID DARI URL
// =====================================

const params =
new URLSearchParams(
    window.location.search
);

const laporanId =
Number(
    params.get("id")
);


// =====================================
// AMBIL DATA LAPORAN
// =====================================

let laporanList = JSON.parse(

    localStorage.getItem(
        "mbg_laporan"
    )

) || [];

const laporan =
laporanList.find(
    item => item.id === laporanId
);


// =====================================
// ELEMENT
// =====================================

const laporanTanggal =
document.getElementById(
    "laporanTanggal"
);

const laporanKalori =
document.getElementById(
    "laporanKalori"
);

const laporanProtein =
document.getElementById(
    "laporanProtein"
);

const laporanStatus =
document.getElementById(
    "laporanStatus"
);

const detailMakanan =
document.getElementById(
    "detailMakanan"
);


// =====================================
// CEK DATA
// =====================================

if(!laporan){

    alert(
        "Laporan tidak ditemukan"
    );

    window.location.href =
        "histori.html";
}


// =====================================
// RENDER DATA
// =====================================

function renderDetail(){

    laporanTanggal.innerText =
        laporan.tanggal;

    laporanKalori.innerText =
        laporan.totalKalori;

    laporanProtein.innerText =
        laporan.totalProtein;

    laporanStatus.innerText =
        laporan.status;


    // ==========================
    // TABEL MAKANAN
    // ==========================

    detailMakanan.innerHTML = "";

    laporan.makanan.forEach(item=>{

        detailMakanan.innerHTML += `
            <tr>

                <td>
                    ${item.nama}
                </td>

                <td>
                    ${item.kalori}
                </td>

                <td>
                    ${item.protein}
                </td>

                <td>
                    ${item.karbo}
                </td>

                <td>
                    ${item.lemak}
                </td>

            </tr>
        `;
    });


    // ==========================
    // STATUS MBG
    // ==========================

    document.getElementById(
        "statusBadge"
    ).innerHTML =
        laporan.status;

    document.getElementById(
        "statusKalori"
    ).innerHTML =
        laporan.totalKalori;

    document.getElementById(
        "statusProtein"
    ).innerHTML =
        laporan.totalProtein;

    document.getElementById(
        "statusKarbo"
    ).innerHTML =
        laporan.totalKarbo;

    document.getElementById(
        "statusLemak"
    ).innerHTML =
        laporan.totalLemak;


    // ==========================
    // ALASAN
    // ==========================

    const reason =
    document.getElementById(
        "statusReason"
    );

    reason.innerHTML = "";

    const alasan = [];

    if(laporan.totalKalori >= 500){

        alasan.push(
            "✅ Kalori memenuhi standar MBG"
        );

    }else{

        alasan.push(
            "⚠ Kalori belum memenuhi standar MBG"
        );
    }

    if(laporan.totalProtein >= 15){

        alasan.push(
            "✅ Protein memenuhi standar MBG"
        );

    }else{

        alasan.push(
            "⚠ Protein belum memenuhi standar MBG"
        );
    }

    if(laporan.totalKarbo >= 65){

        alasan.push(
            "✅ Karbohidrat memenuhi standar MBG"
        );

    }else{

        alasan.push(
            "⚠ Karbohidrat belum memenuhi standar MBG"
        );
    }

    alasan.forEach(item=>{

        reason.innerHTML += `
            <tr>
                <td>
                    ${item}
                </td>
            </tr>
        `;
    });
}


// =====================================
// EDIT
// =====================================

function editLaporan(){

    window.location.href =
        `edit.html?id=${laporanId}`;
}

// =====================================
// HAPUS
// =====================================

function hapusLaporan(){

    const yakin = confirm(

        "Yakin ingin menghapus laporan ini?"

    );

    if(!yakin) return;

    laporanList =
    laporanList.filter(
        item =>
        item.id !== laporanId
    );

    localStorage.setItem(

        "mbg_laporan",

        JSON.stringify(
            laporanList
        )

    );

    alert(
        "Laporan berhasil dihapus"
    );

    window.location.href =
        "histori.html";
}


// =====================================
// EXPORT
// =====================================

function exportLaporan(){

    let content = `

===== DETAIL LAPORAN MBG =====

Tanggal :
${laporan.tanggal}

Status :
${laporan.status}

Total Kalori :
${laporan.totalKalori}

Total Protein :
${laporan.totalProtein}

Total Karbo :
${laporan.totalKarbo}

Total Lemak :
${laporan.totalLemak}

==============================

`;

    laporan.makanan.forEach(item=>{

        content += `

Nama :
${item.nama}

Kalori :
${item.kalori}

Protein :
${item.protein}

Karbo :
${item.karbo}

Lemak :
${item.lemak}

`;
    });

    const blob = new Blob(

        [content],

        {
            type:"text/plain"
        }

    );

    const link =
    document.createElement("a");

    link.href =
        URL.createObjectURL(
            blob
        );

    link.download =
        `laporan_${laporan.tanggal}.txt`;

    link.click();
}


// =====================================
// LOAD
// =====================================

renderDetail();

// ==========================
// TOGGLE EXPORT MENU
// ==========================

function toggleExportMenu(){

    document
    .getElementById("exportMenu")
    .classList
    .toggle("show");
}


// TUTUP SAAT KLIK DI LUAR

window.addEventListener(
    "click",
    function(e){

        const menu =
        document.getElementById(
            "exportMenu"
        );

        const button =
        document.querySelector(
            ".export-dropdown button"
        );

        if(
            !menu.contains(e.target)
            &&
            e.target !== button
        ){

            menu.classList.remove(
                "show"
            );
        }
    }
);

function exportCSV(){

    alert("CSV jalan");

}

function exportExcel(){

    alert("Excel jalan");

}

// =====================================
// EXPORT CSV
// =====================================

function exportCSV(){

    let csv =
    "Tanggal,Status,Kalori,Protein,Karbo,Lemak\n";

    csv +=
    `"${laporan.tanggal}",` +
    `"${laporan.status}",` +
    `${laporan.totalKalori},` +
    `${laporan.totalProtein},` +
    `${laporan.totalKarbo},` +
    `${laporan.totalLemak}\n`;

    const blob = new Blob(
        [csv],
        {
            type:"text/csv;charset=utf-8;"
        }
    );

    const url =
    URL.createObjectURL(blob);

    const link =
    document.createElement("a");

    link.href = url;

    link.download =
        `laporan_${laporan.tanggal}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

// =====================================
// EXPORT EXCEL
// =====================================

function exportExcel(){

    const data = [

        {
            Tanggal:
                laporan.tanggal,

            Status:
                laporan.status,

            Kalori:
                laporan.totalKalori,

            Protein:
                laporan.totalProtein,

            Karbohidrat:
                laporan.totalKarbo,

            Lemak:
                laporan.totalLemak
        }

    ];

    const worksheet =
    XLSX.utils.json_to_sheet(
        data
    );

    const workbook =
    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Laporan MBG"
    );

    XLSX.writeFile(

        workbook,

        `laporan_${laporan.tanggal}.xlsx`
    );
}