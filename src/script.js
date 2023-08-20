function openSuccessModal () {
  document.getElementById('successModal').style.display = 'block'
}

function openErrorModal (message) {
  const errorModal = document.getElementById('errorModal')
  const errorContent = errorModal.querySelector('.modal-content p')
  errorContent.textContent = message
  errorModal.style.display = 'block'
}

// eslint-disable-next-line no-unused-vars
function closeModal (modalId) {
  document.getElementById(modalId).style.display = 'none'
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form')
  const loadingSpinner = document.querySelector('.loading-spinner')

  form.addEventListener('submit', async function (event) {
    event.preventDefault()

    const formData = new FormData(form)

    try {
      loadingSpinner.style.display = 'block' // Show loading animation

      const response = await fetch('/send-email', {
        method: 'POST',
        body: formData
      })

      loadingSpinner.style.display = 'none' // Hide loading animation

      if (response.ok) {
        openSuccessModal()
      } else {
        const errorMessage = await response.text()
        openErrorModal(errorMessage)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      openErrorModal('An error occurred while sending emails.')
    }
  })
})
