document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });
    
    // Navigation between sections
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(navLink => navLink.parentElement.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active-section'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Show corresponding section
            const target = this.getAttribute('href').substring(1);
            document.getElementById(`${target}-section`).classList.add('active-section');
        });
    });
    
    // Settings tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    openModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            openModal(modal);
        });
    });
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(modal);
            }
        });
    });
    
    // Quick action buttons
    document.getElementById('add-news-btn').addEventListener('click', function() {
        openModal(document.getElementById('news-modal'));
    });
    
    document.getElementById('add-event-btn').addEventListener('click', function() {
        openModal(document.getElementById('event-modal'));
    });
    
    document.getElementById('upload-media-btn').addEventListener('click', function() {
        openModal(document.getElementById('media-upload-modal'));
    });
    
    document.getElementById('manage-users-btn').addEventListener('click', function() {
        openModal(document.getElementById('user-modal'));
    });
    
    // Section action buttons
    document.getElementById('add-new-news').addEventListener('click', function() {
        openModal(document.getElementById('news-modal'));
    });
    
    document.getElementById('add-new-event').addEventListener('click', function() {
        openModal(document.getElementById('event-modal'));
    });
    
    document.getElementById('upload-media').addEventListener('click', function() {
        openModal(document.getElementById('media-upload-modal'));
    });
    
    document.getElementById('add-new-user').addEventListener('click', function() {
        openModal(document.getElementById('user-modal'));
    });
    
    // News status change shows/hides schedule date
    const newsStatus = document.getElementById('news-status');
    const scheduleDateGroup = document.getElementById('schedule-date-group');
    
    newsStatus.addEventListener('change', function() {
        if (this.value === 'scheduled') {
            scheduleDateGroup.style.display = 'block';
        } else {
            scheduleDateGroup.style.display = 'none';
        }
    });
    
    // File upload functionality
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseFilesBtn = document.getElementById('browse-files-btn');
    const uploadProgress = document.getElementById('upload-progress');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const fileList = document.getElementById('file-list');
    const startUploadBtn = document.getElementById('start-upload-btn');
    const cancelUploadBtn = document.getElementById('cancel-upload-btn');
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Browse files button
    browseFilesBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', handleFiles);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropZone.classList.add('highlight');
    }
    
    function unhighlight() {
        dropZone.classList.remove('highlight');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }
    
    function handleFiles(e) {
        const files = e.target.files;
        if (files.length === 0) return;
        
        // Show upload progress section
        uploadProgress.style.display = 'block';
        startUploadBtn.style.display = 'inline-block';
        cancelUploadBtn.style.display = 'inline-block';
        
        // Clear previous files
        fileList.innerHTML = '';
        
        // Add files to list
        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file-alt file-icon"></i>
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <div class="file-status uploading">Uploading...</div>
            `;
            fileList.appendChild(fileItem);
        });
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Start upload button
    startUploadBtn.addEventListener('click', function() {
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Update file statuses
                const statuses = document.querySelectorAll('.file-status');
                statuses.forEach(status => {
                    status.textContent = 'Completed';
                    status.classList.remove('uploading');
                    status.classList.add('completed');
                });
                
                // Hide start/cancel buttons
                startUploadBtn.style.display = 'none';
                cancelUploadBtn.style.display = 'none';
            }
            
            progressBar.style.width = `${progress}%`;
            progressBar.firstChild.textContent = `${Math.round(progress)}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }, 300);
        
        // Cancel upload button
        cancelUploadBtn.addEventListener('click', function() {
            clearInterval(interval);
            uploadProgress.style.display = 'none';
            startUploadBtn.style.display = 'none';
            cancelUploadBtn.style.display = 'none';
        }, { once: true });
    });
    
    // Rich text editor functionality
    const formatButtons = document.querySelectorAll('.format-btn');
    const editor = document.getElementById('news-content');
    
    formatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            
            if (command === 'createLink' || command === 'insertImage') {
                let url = prompt('Enter the link URL:', 'http://');
                if (url) {
                    document.execCommand(command, false, url);
                }
            } else {
                document.execCommand(command, false, null);
            }
            
            editor.focus();
        });
    });
    
    // Preview buttons
    document.getElementById('preview-news-btn').addEventListener('click', function() {
        const previewModal = document.getElementById('preview-modal');
        const previewContent = document.getElementById('preview-content');
        
        // Get form values
        const title = document.getElementById('news-title').value || 'News Title';
        const content = editor.innerHTML || '<p>News content goes here...</p>';
        
        // Create preview HTML
        previewContent.innerHTML = `
            <h1>${title}</h1>
            <div class="news-meta">
                <span><i class="fas fa-user"></i> Admin User</span>
                <span><i class="fas fa-calendar"></i> ${new Date().toLocaleDateString()}</span>
            </div>
            <div class="news-content">${content}</div>
        `;
        
        openModal(previewModal);
    });
    
    document.getElementById('preview-event-btn').addEventListener('click', function() {
        const previewModal = document.getElementById('preview-modal');
        const previewContent = document.getElementById('preview-content');
        
        // Get form values
        const title = document.getElementById('event-title').value || 'Event Title';
        const startDate = document.getElementById('event-start-date').value || new Date().toISOString().slice(0, 16);
        const endDate = document.getElementById('event-end-date').value || new Date(Date.now() + 3600000).toISOString().slice(0, 16);
        const location = document.getElementById('event-location').value || 'School Auditorium';
        const description = document.getElementById('event-description').value || 'Event description goes here...';
        
        // Format dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Create preview HTML
        previewContent.innerHTML = `
            <h1>${title}</h1>
            <div class="event-meta">
                <p><i class="fas fa-clock"></i> ${start.toLocaleString()} - ${end.toLocaleString()}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${location}</p>
            </div>
            <div class="event-description">
                <p>${description.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        
        openModal(previewModal);
    });
    
    // Confirmation modals for delete actions
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmActionBtn = document.getElementById('confirm-action-btn');
    const cancelConfirmBtn = document.getElementById('cancel-confirm-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemType = this.closest('.news-item') ? 'news article' : 
                           this.closest('.event-item') ? 'event' : 
                           this.closest('tr') ? (this.closest('.users-table') ? 'user' : 'item') : 'item';
            
            confirmMessage.textContent = `Are you sure you want to delete this ${itemType}? This action cannot be undone.`;
            openModal(confirmModal);
            
            // Store reference to the clicked button
            confirmActionBtn.dataset.target = this;
        });
    });
    
    confirmActionBtn.addEventListener('click', function() {
        // In a real application, this would trigger an AJAX request to delete the item
        const target = this.dataset.target;
        const item = target.closest('.news-item, .event-item, tr');
        
        if (item) {
            item.style.opacity = '0.5';
            item.style.pointerEvents = 'none';
            
            // Simulate async deletion
            setTimeout(() => {
                item.remove();
            }, 500);
        }
        
        closeModal(confirmModal);
    });
    
    cancelConfirmBtn.addEventListener('click', function() {
        closeModal(confirmModal);
    });
    
    // Image upload buttons
    const uploadImageBtn = document.getElementById('upload-image-btn');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const newsImagePreview = document.getElementById('news-image-preview');
    
    uploadImageBtn.addEventListener('click', function() {
        // In a real application, this would open a file dialog or media library
        newsImagePreview.src = 'https://source.unsplash.com/random/800x400/?school';
    });
    
    removeImageBtn.addEventListener('click', function() {
        newsImagePreview.src = 'https://via.placeholder.com/400x200';
    });
    
    // Event image upload buttons
    const uploadEventImageBtn = document.getElementById('upload-event-image-btn');
    const removeEventImageBtn = document.getElementById('remove-event-image-btn');
    const eventImagePreview = document.getElementById('event-image-preview');
    
    uploadEventImageBtn.addEventListener('click', function() {
        // In a real application, this would open a file dialog or media library
        eventImagePreview.src = 'https://source.unsplash.com/random/800x400/?event';
    });
    
    removeEventImageBtn.addEventListener('click', function() {
        eventImagePreview.src = 'https://via.placeholder.com/400x200';
    });
    
    // User avatar upload buttons
    const uploadAvatarBtn = document.getElementById('upload-avatar-btn');
    const removeAvatarBtn = document.getElementById('remove-avatar-btn');
    const userAvatarPreview = document.getElementById('user-avatar-preview');
    
    uploadAvatarBtn.addEventListener('click', function() {
        // In a real application, this would open a file dialog or media library
        userAvatarPreview.src = 'https://source.unsplash.com/random/150x150/?portrait';
    });
    
    removeAvatarBtn.addEventListener('click', function() {
        userAvatarPreview.src = 'https://via.placeholder.com/150';
    });
    
    // Initialize date inputs with current date/time
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const today = `${year}-${month}-${day}`;
    const nowTime = `${hours}:${minutes}`;
    const nowDateTime = `${today}T${nowTime}`;
    
    // Set default values for date inputs
    document.getElementById('news-date-filter').value = today;
    document.getElementById('events-start-date').value = today;
    document.getElementById('events-end-date').value = today;
    document.getElementById('media-date-filter').value = today;
    document.getElementById('activity-start-date').value = today;
    document.getElementById('activity-end-date').value = today;
    document.getElementById('news-publish-date').value = nowDateTime;
    document.getElementById('event-start-date').value = nowDateTime;
    document.getElementById('event-end-date').value = nowDateTime;
});