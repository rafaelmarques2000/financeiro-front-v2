import Swal from "sweetalert2";

const alertError = (title, message) => {
    Swal.fire({
        title,
        text: message,
        icon: "error",
        confirmButtonText: "Ok"
    });
}

const alertSuccess = (title, message) => {
    return Swal.fire({
        title,
        allowEscapeKey: false,
        allowOutsideClick: false,
        text: message,
        icon: "success",
        confirmButtonText: "Ok"
    });
}

const alertConfirm = (title, message, callback) => {
    Swal.fire({
        title,
        text: message,
        icon:"question",
        showConfirmButton: true,
        confirmButtonText: 'Sim',
        showCancelButton: true,
        cancelButtonText: "Não"
    }).then(result => {
        if(result.isConfirmed) {
            callback()
        }
    })
}

export {
    alertError,
    alertConfirm,
    alertSuccess
}