import Swal from "sweetalert2";

const showLoading = () => {
        Swal.fire({
            title:"",
            text:"Processando aguarde....",
            icon: "",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false
        });
}

const hiddenLoading = () => {
    Swal.close()
}

const showAlert = (message, icon) => {
    return Swal.fire({
        title:"",
        text:"",
        html:`<h3>${message}</h3>`,
        icon: icon,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true
    });
}

export  {
    showLoading,
    showAlert,
    hiddenLoading
}