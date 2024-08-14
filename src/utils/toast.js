import { useToast } from "vue-toastification";

const toast = useToast();

const toastConfig = {
    position: "top-center",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
};

export default {
    showDefault(message) {
        toast(message, toastConfig);
    },
    showSuccess(message) {
        toast.success(message, toastConfig);
    },
    showInfo(message) {
        toast.info(message, toastConfig);
    },
    showWarning(message) {
        toast.warning(message, toastConfig);
    },
    showError(message) {
        toast.error(message, toastConfig);
    },
};
