document.addEventListener('DOMContentLoaded', function () {
    // Function to refresh CAPTCHA (you can replace with your actual CAPTCHA API)
    function refreshCaptcha() {
        const captchaInput = document.getElementById('captcha');
        captchaInput.value = ''; // Clear the input field for the new CAPTCHA
        // Here you would usually fetch a new CAPTCHA image or string from your server
        alert('New CAPTCHA generated');
    }

    // Attach the click event listener to the "Refresh Captcha" button
    const refreshButton = document.querySelector('.refresh-captcha');
    refreshButton.addEventListener('click', refreshCaptcha);

    // Basic form validation before submission
    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        const macInput = document.getElementById('mac');
        const deviceKeyInput = document.getElementById('device-key');
        const captchaInput = document.getElementById('captcha');

        // Check if all required fields are filled
        if (macInput.value.trim() === '' || deviceKeyInput.value.trim() === '' || captchaInput.value.trim() === '') {
            e.preventDefault(); // Prevent form submission
            alert('Please fill in all required fields.');
        }
    });
});
