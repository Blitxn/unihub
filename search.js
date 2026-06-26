document.addEventListener('DOMContentLoaded', () => {
    const profileAvatar = document.getElementById('profileAvatar');
    const profileDropdown = document.getElementById('profileDropdown');
    const uniCards = document.querySelectorAll('.uni-card');

    // Toggle menu state when clicking on the profile picture
    if (profileAvatar && profileDropdown) {
        profileAvatar.addEventListener('click', (event) => {
            event.stopPropagation(); 
            profileDropdown.classList.toggle('active');
        });
    }

    // Automatically close dropdown menu if clicking anywhere outside of it
    window.addEventListener('click', (event) => {
        if (profileDropdown && profileDropdown.classList.contains('active')) {
            if (!profileDropdown.contains(event.target) && event.target !== profileAvatar) {
                profileDropdown.classList.remove('active');
            }
        }
    });
uniCards.forEach(card => {
    card.addEventListener('click', () => {
        window.location.href = 'info.html';
    });
});
});