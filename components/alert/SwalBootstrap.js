import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const SwalBootstrap = MySwal.mixin({
  buttonsStyling: false,
  customClass: {
    confirmButton: "btn btn-primary",
    cancelButton: "btn btn-danger",
  },
});

export default SwalBootstrap;
