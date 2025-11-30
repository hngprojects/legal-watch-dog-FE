import Swal from 'sweetalert2'

const themedSwal = Swal.mixin({
  customClass: {
    confirmButton: 'btn--primary btn--lg',
    cancelButton: 'btn--secondary btn--lg',
  },
  buttonsStyling: false,
})

export default themedSwal
