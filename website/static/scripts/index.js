document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');

    const signupButton = document.getElementById('signup-button');
    const signupOverlay = document.getElementById('signup-overlay');
    const closeSignupOverlay = document.getElementById('close-signup-overlay');

    const loginButton = document.getElementById('login-button');
    const loginOverlay = document.getElementById('login-overlay');
    const closeOverlay = document.getElementById('close-overlay');

    function showNotification(message, type = 'error') {
        notificationMessage.textContent = message;
        if (type === 'success') {
            notification.classList.remove('bg-red-600');
            notification.classList.add('bg-green-600');
        } else {
            notification.classList.remove('bg-green-600');
            notification.classList.add('bg-red-600');
        }
        notification.classList.remove('-translate-y-full');
        notification.classList.add('translate-y-0');
        setTimeout(() => {
            notification.classList.remove('translate-y-0');
            notification.classList.add('-translate-y-full');
        }, 3000);
    }

    async function handleFormSubmit(event, form, endpoint) {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (response.ok) {
                showNotification(result.message, 'success');
                alert(result.message); // Alert message on success
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                showNotification(result.message, 'error');
                alert(result.message); // Alert message on failure
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', 'error');
            alert('An error occurred. Please try again.');
        }
    }

    async function handleLogout(event) {
        event.preventDefault();

        try {
            const response = await fetch('/auth/logout', {
                method: 'GET',
            });
            const result = await response.json();

            if (response.ok) {
                showNotification(result.message, 'success');
                alert(result.message); // Alert message on success
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                showNotification(result.message, 'error');
                alert(result.message); // Alert message on failure
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', 'error');
            alert('An error occurred. Please try again.');
        }
    }

    function handleMenuToggle(button, menu) {
        button.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    function handleOverlayToggle(button, overlay, closeButton) {
        button.addEventListener('click', () => {
            overlay.classList.remove('hidden');
        });

        closeButton.addEventListener('click', () => {
            overlay.classList.add('hidden');
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (event) => handleFormSubmit(event, signupForm, '/auth/signup'));
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => handleFormSubmit(event, loginForm, '/auth/login'));
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    if (mobileMenuButton && mobileMenu) {
        handleMenuToggle(mobileMenuButton, mobileMenu);
    }

    if (userMenuButton && userMenu) {
        handleMenuToggle(userMenuButton, userMenu);
    }

    if (signupButton && signupOverlay && closeSignupOverlay) {
        handleOverlayToggle(signupButton, signupOverlay, closeSignupOverlay);
    }

    if (loginButton && loginOverlay && closeOverlay) {
        handleOverlayToggle(loginButton, loginOverlay, closeOverlay);
    }

    // Display flash messages if any
    if (typeof flashMessages !== 'undefined') {
        flashMessages.forEach(message => {
            alert(message); // Show each flash message in an alert
        });
    }
});
