import Swal from 'sweetalert2'

const themedSwal = Swal.mixin({
  customClass: {
    confirmButton: 'btn--default btn--lg',
    cancelButton: 'btn--outline btn--lg',
  },
  buttonsStyling: false,
})

export default themedSwal
