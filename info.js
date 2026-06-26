document.addEventListener('DOMContentLoaded', () => {
    
    // ── 1. PROFILE DROPDOWN TOGGLE LOGIC ──
    const profileAvatar = document.getElementById('profileAvatar');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileAvatar && profileDropdown) {
        profileAvatar.addEventListener('click', (event) => {
            event.stopPropagation(); // Avoid background reset events triggering instantly
            profileDropdown.classList.toggle('active');
        });

        // Close dropdown instantly when clicking anywhere outside of it
        document.addEventListener('click', (event) => {
            if (!profileDropdown.contains(event.target) && event.target !== profileAvatar) {
                profileDropdown.classList.remove('active');
            }
        });
    }

    // ── 2. BULLETPROOF REDIRECT BACK TO SEARCH ──
    const backBtn = document.getElementById('backToSearchBtn');
    if (backBtn) {
        backBtn.addEventListener('click', (event) => {
            event.preventDefault(); 
            window.location.href = 'search.html'; 
        });
    }

    // ── 3. TAB SWITCHING LOGIC ──
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            const targetPanel = document.getElementById(tab.dataset.tab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ── 4. STAR PICKER LOGIC ──
    let selectedRating = 0;
    const stars = document.querySelectorAll('#starPicker .star');
    
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            stars.forEach(s => s.classList.remove('hovered'));
            for (let i = 0; i < star.dataset.val; i++) {
                stars[i].classList.add('hovered');
            }
        });
        
        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hovered'));
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add('selected');
            }
        });
        
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.val);
            stars.forEach(s => s.classList.remove('selected'));
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add('selected');
            }
        });
    });

    // ── 5. SUBMIT REVIEW LOGIC ──
    const submitBtn = document.getElementById('submitReview');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('reviewName');
            const textInput = document.getElementById('reviewText');
            const list = document.getElementById('reviewsList');

            if (!nameInput || !textInput || !list) return;

            const name = nameInput.value.trim();
            const text = textInput.value.trim();
            
            if (!name || !text) { 
                alert('Please enter your name and review.'); 
                return; 
            }

            const starStr = '★'.repeat(selectedRating || 5) + '☆'.repeat(5 - (selectedRating || 5));
            const initial = name.charAt(0).toUpperCase();
            const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            const card = document.createElement('div');
            card.className = 'review-card new-review';
            card.innerHTML = `
                <div class="review-top">
                    <div class="reviewer-avatar">${initial}</div>
                    <div>
                        <div class="reviewer-name">${name}</div>
                        <div class="review-stars">${starStr}</div>
                    </div>
                </div>
                <p class="review-body">${text}</p>
                <div class="review-date">${today}</div>
            `;

            list.insertBefore(card, list.firstChild);

            // Clear Input Form Fields
            nameInput.value = '';
            textInput.value = '';
            selectedRating = 0;
            stars.forEach(s => s.classList.remove('selected', 'hovered'));
        });
    }
});