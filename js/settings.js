// ==============================
// ELEMENT
// ==============================

const usernameInput =
document.getElementById(
    "username"
);

const darkModeToggle =
document.getElementById(
    "darkModeToggle"
);

const notifToggle =
document.getElementById(
    "notifToggle"
);


// ==============================
// LOAD USERNAME
// ==============================

window.addEventListener(
    "DOMContentLoaded",

    ()=>{

        const savedUsername =

        localStorage.getItem(
            "mbg_username"
        );


        if(savedUsername){

            usernameInput.value =
            savedUsername;
        }


        // ======================
        // DARK MODE
        // ======================

        const darkMode =

        localStorage.getItem(
            "mbg_darkmode"
        );


        if(darkMode === "true"){

            document.body.classList.add(
                "dark-mode"
            );

            darkModeToggle.checked = true;
        }


        // ======================
        // NOTIFICATION
        // ======================

        const notif =

        localStorage.getItem(
            "mbg_notification"
        );


        if(notif === "false"){

            notifToggle.checked = false;
        }
    }
);


// ==============================
// SAVE USERNAME
// ==============================

usernameInput.addEventListener(
    "keyup",

    ()=>{

        localStorage.setItem(

            "mbg_username",

            usernameInput.value
        );
    }
);


// ==============================
// DARK MODE
// ==============================

darkModeToggle.addEventListener(
    "change",

    ()=>{


        if(darkModeToggle.checked){

            document.body.classList.add(
                "dark-mode"
            );

            localStorage.setItem(

                "mbg_darkmode",

                "true"
            );


            showToast(
                "Dark mode aktif 🌙"
            );
        }

        else{

            document.body.classList.remove(
                "dark-mode"
            );

            localStorage.setItem(

                "mbg_darkmode",

                "false"
            );


            showToast(
                "Dark mode nonaktif ☀️"
            );
        }
    }
);


// ==============================
// NOTIFICATION
// ==============================

notifToggle.addEventListener(
    "change",

    ()=>{


        if(notifToggle.checked){

            localStorage.setItem(

                "mbg_notification",

                "true"
            );


            showToast(
                "Notifikasi aktif 🔔"
            );
        }

        else{

            localStorage.setItem(

                "mbg_notification",

                "false"
            );


            showToast(
                "Notifikasi nonaktif 🔕"
            );
        }
    }
);


// ==============================
// RESET HISTORY
// ==============================

function resetHistory(){


    const confirmDelete = confirm(

        "Yakin ingin menghapus semua histori?"
    );


    if(!confirmDelete) return;


    localStorage.removeItem(
        "mbg_histori"
    );


    showToast(
        "Histori berhasil dihapus 🗑"
    );
}


// ==============================
// TOAST
// ==============================

function showToast(message){

    const toast =
    document.createElement("div");

    toast.className = "toast";

    toast.innerText = message;

    document.body.appendChild(toast);


    setTimeout(()=>{

        toast.classList.add("show");

    },100);


    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },2500);
}