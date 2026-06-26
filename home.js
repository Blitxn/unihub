document.addEventListener('DOMContentLoaded', () => {
    
    // Core structural elements
    const loginModal = document.getElementById('loginModal');
    const exploreBtn = document.getElementById('exploreBtn');
    const closeModal = document.getElementById('closeModal');
    const navTriggers = document.querySelectorAll('.login-trigger');

    // Loader elements
    const modalLoader = document.getElementById('modalLoader');
    const loaderText = document.getElementById('loaderText');
    const modalCard = document.getElementById('modalCard');

    // Forms swapping elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const modalPrompt = document.getElementById('modalPrompt');

    // Direct ID references to buttons
    const submitLoginBtn = document.getElementById('submitLoginBtn');
    const submitSignupBtn = document.getElementById('submitSignupBtn');

    // Show modal with entry loading spinner
    const openModal = (event) => {
        event.preventDefault(); 
        
        // Reset modal layout views
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        modalPrompt.innerHTML = `Don't have an account? <a href="#" id="toSignupLink">Create one</a>`;
        attachToggleListener(); 
        
        loaderText.textContent = "Connecting to Unihub...";
        modalCard.classList.add('hidden');
        modalLoader.classList.remove('hidden');
        loginModal.classList.add('active');

        setTimeout(() => {
            modalLoader.classList.add('hidden');
            modalCard.classList.remove('hidden');
        }, 1000); 
    };

    const hideModal = () => {
        loginModal.classList.remove('active');
    };

    // Swap layout views with interior spinner load delays
    const toggleFormView = (event) => {
        event.preventDefault();
        
        modalCard.classList.add('hidden');
        modalLoader.classList.remove('hidden');
        
        if (loginForm.classList.contains('hidden')) {
            loaderText.textContent = "Loading Login Portal...";
        } else {
            loaderText.textContent = "Setting up your Registration...";
        }

        setTimeout(() => {
            if (loginForm.classList.contains('hidden')) {
                loginForm.classList.remove('hidden');
                signupForm.classList.add('hidden');
                modalPrompt.innerHTML = `Don't have an account? <a href="#" id="toSignupLink">Create one</a>`;
            } else {
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
                modalPrompt.innerHTML = `Already have an account? <a href="#" id="toSignupLink">Log In</a>`;
            }
            
            attachToggleListener(); 
            
            modalLoader.classList.add('hidden');
            modalCard.classList.remove('hidden');
        }, 800); 
    };

    const attachToggleListener = () => {
        const dynamicLink = document.getElementById('toSignupLink');
        if (dynamicLink) {
            dynamicLink.removeEventListener('click', toggleFormView);
            dynamicLink.addEventListener('click', toggleFormView);
        }
    };

    // Form Submission Redirection Engine
    const handleNavigationRedirect = (event, actionName) => {
        event.preventDefault();
        event.stopPropagation(); // Avoid event bubbling issues

        // Trigger loading screen elements
        modalCard.classList.add('hidden');
        modalLoader.classList.remove('hidden');
        
        if (actionName === 'login') {
            loaderText.textContent = "Verifying credentials...";
        } else {
            loaderText.textContent = "Creating your profile...";
        }

        // Execute relocation route safely
        setTimeout(() => {
            window.location.assign('search.html');
        }, 1200);
    };

    // Bind event configuration hooks safely
    if (exploreBtn) exploreBtn.addEventListener('click', openModal);
    navTriggers.forEach(trigger => trigger.addEventListener('click', openModal));
    if (closeModal) closeModal.addEventListener('click', hideModal);

    if (submitLoginBtn) {
        submitLoginBtn.addEventListener('click', (e) => handleNavigationRedirect(e, 'login'));
    }
    if (submitSignupBtn) {
        submitSignupBtn.addEventListener('click', (e) => handleNavigationRedirect(e, 'signup'));
    }

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            hideModal();
        }
    });
});