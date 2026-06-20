document.addEventListener('DOMContentLoaded', () => {
  // --- SCROLL ANIMATIONS ---
  const animateElements = document.querySelectorAll('.publication-item');
  
  animateElements.forEach(el => {
    // Only animate if it doesn't already have a transform (like the glow blobs)
    if (getComputedStyle(el).position !== 'absolute') {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(el => {
    if (getComputedStyle(el).position !== 'absolute') {
      observer.observe(el);
    }
  });

  // --- COLLAPSIBLE SECTIONS ---
  // Target main section headers in index.astro
  const sectionHeaders = document.querySelectorAll('section h2');
  sectionHeaders.forEach(header => {
    const section = header.closest('section');
    if (!section) return;

    // Create a container for the header to add the chevron
    const headerWrapper = header.parentElement;
    headerWrapper.style.cursor = 'pointer';
    headerWrapper.classList.add('group');
    
    // Check if it already has a chevron (to prevent duplicates)
    if(headerWrapper.querySelector('.chevron')) return;

    const headerContent = header.innerHTML;
    header.innerHTML = `
      <div class="flex items-center justify-between w-full gap-4">
        <span>${headerContent}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="chevron w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    `;

    // The siblings of the wrapper (or the wrapper's parent if it's deeply nested) that should be toggled
    // In index.astro, the h2 is usually inside a div which is the first child of the section.
    // So the content to toggle are the subsequent children of the section.
    const headerContainer = Array.from(section.children)[0]; 
    const contentElements = Array.from(section.children).slice(1);
    
    let isOpen = true;
    const chevron = header.querySelector('.chevron');

    headerWrapper.addEventListener('click', () => {
      isOpen = !isOpen;
      chevron.style.transform = isOpen ? 'rotate(-90deg)' : 'rotate(0deg)';
      contentElements.forEach(el => {
        if (isOpen) {
          el.style.display = '';
          setTimeout(() => el.style.opacity = '1', 10);
        } else {
          el.style.opacity = '0';
          setTimeout(() => el.style.display = 'none', 300); // Wait for fade out
        }
      });
    });
  });

  // Target specific sub-headers like "Featured Works" and "All Publications"
  const subHeaders = document.querySelectorAll('.uppercase.tracking-wider');
  subHeaders.forEach(header => {
    if (header.tagName !== 'DIV' && header.tagName !== 'SPAN') return;
    
    const nextSibling = header.nextElementSibling;
    if (nextSibling && (nextSibling.classList.contains('space-y-4') || nextSibling.id === 'publications-list')) {
      header.style.cursor = 'pointer';
      header.classList.add('flex', 'items-center', 'justify-between', 'group');
      
      const chevron = document.createElement('div');
      chevron.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-300 chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      `;
      header.appendChild(chevron);

      let isOpen = true;
      const chevronSvg = chevron.querySelector('svg');

      header.addEventListener('click', () => {
        isOpen = !isOpen;
        chevronSvg.style.transform = isOpen ? 'rotate(-90deg)' : 'rotate(0deg)';
        
        if (isOpen) {
          nextSibling.style.display = '';
          setTimeout(() => nextSibling.style.opacity = '1', 10);
        } else {
          nextSibling.style.opacity = '0';
          setTimeout(() => nextSibling.style.display = 'none', 300);
        }
      });
    }
  });
  // --- SCROLL SPY (SIDEBAR HIGHLIGHTING) ---
  const sections = document.querySelectorAll('section[id]');
  const sidebarLinks = document.querySelectorAll('#sidebar-nav a.sidebar-link');

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeSectionId = entry.target.id;
        sidebarLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeSectionId}`) {
            link.classList.add('text-slate-100', 'border-blue-500');
            link.classList.remove('text-slate-400', 'border-transparent');
          } else {
            link.classList.remove('text-slate-100', 'border-blue-500');
            link.classList.add('text-slate-400', 'border-transparent');
          }
        });
      }
    });
  }, {
    rootMargin: '-100px 0px -40% 0px' 
  });

  sections.forEach(section => scrollSpyObserver.observe(section));
});
