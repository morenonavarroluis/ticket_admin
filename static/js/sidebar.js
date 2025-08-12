
        // Toggle Sidebar
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');

        // Toggle sidebar on desktop
        document.addEventListener('DOMContentLoaded', function() {
            // Collapse sidebar by default on mobile
            if (window.innerWidth < 768) {
                sidebar.classList.remove('left-0');
                sidebar.classList.add('left-[-100%]');
            }
        });

        sidebarToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-collapsed');
            mainContent.classList.toggle('main-content-expanded');
        });

        mobileSidebarToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-active');
            sidebar.classList.toggle('left-[-100%]');
        });

        // Toggle theme
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;

        themeToggle?.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        });

        // Check for saved theme preference or use preferred color scheme
        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (window.innerWidth < 768 && 
                !sidebar.contains(event.target) && 
                !mobileSidebarToggle.contains(event.target) && 
                sidebar.classList.contains('sidebar-active')) {
                sidebar.classList.remove('sidebar-active');
                sidebar.classList.add('left-[-100%]');
            }
        });

        // Make sidebar collapse when clicking on a link on mobile
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    sidebar.classList.remove('sidebar-active');
                    sidebar.classList.add('left-[-100%]');
                }
            });
        });
