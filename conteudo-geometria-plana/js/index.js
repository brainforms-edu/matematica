// BNCC
    const bnccData = {

        EM13MAT201: `Propor ou participar de ações adequadas às demandas da região,
preferencialmente para sua comunidade, envolvendo medições e cálculos de perímetro,
de área, de volume, de capacidade ou de massa.`,

        EM13MAT307: `Empregar diferentes métodos para a obtenção da medida da área de
uma superfície (reconfigurações, aproximação por cortes etc.) e deduzir expressões de
cálculo para aplicá-las em situações reais (como o remanejamento e a distribuição de
plantações, entre outros), com ou sem apoio de tecnologias digitais.`,

        EM13MAT105: `Utilizar as noções de transformações isométricas (translação, reflexão,
rotação e composições destas) e transformações homotéticas para construir figuras e
analisar elementos da natureza e diferentes produções humanas (fractais, construções
civis, obras de arte, entre outras).`,

        EM13MAT308: `Aplicar as relações métricas, incluindo as leis do seno e do cosseno ou as
noções de congruência e semelhança, para resolver e elaborar problemas que envolvem
triângulos, em variados contextos.`,

        EM13MAT505: `Resolver problemas sobre ladrilhamento do plano, com ou sem apoio de
aplicativos de geometria dinâmica, para conjecturar a respeito dos tipos ou composição de
polígonos que podem ser utilizados em ladrilhamento, generalizando padrões observados.`,

        EM13MAT506: ` Representar graficamente a variação da área e do perímetro de
um polígono regular quando os comprimentos de seus lados variam, analisando e
classificando as funções envolvidas.`
      };

      function initBnccModal() {
        const modal = document.getElementById('bnccModal');
        const modalTitle = document.getElementById('bnccModalTitle');
        const modalBody = document.getElementById('bnccModalBody');
        const closeBtn = document.getElementById('bnccModalClose');
        const codeButtons = document.querySelectorAll('.bncc-btn[data-bncc-code]');

        if (!modal || !modalTitle || !modalBody || !closeBtn || !codeButtons.length) return;

        function closeModal() {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }

        function openModal(code) {
          const description = bnccData[code];
          if (!description) return;
          modalTitle.textContent = `${code} — BNCC`;
          modalBody.textContent = description;
          modal.style.display = 'flex';
          modal.setAttribute('aria-hidden', 'false');
        }

        codeButtons.forEach((button) => {
          button.addEventListener('click', () => {
            openModal(button.dataset.bnccCode);
          });
        });

        closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (event) => {
          if (event.target === modal) closeModal();
        });

        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
          }
        });
      }
    function initTopicSidebar() {
      const sidebar = document.querySelector('.topic-sidebar');
      const links = Array.from(document.querySelectorAll('.topic-sidebar a'));
      if (!links.length) return;

      const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

      function setActiveByHash(hash, shouldSyncScroll = true) {
        let activeLink = null;
        links.forEach((link) => {
          const isActive = link.getAttribute('href') === hash;
          link.classList.toggle('active', isActive);
          if (isActive) activeLink = link;
        });

        if (shouldSyncScroll && activeLink && sidebar) {
          activeLink.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      }

      function getScrollActivationOffset() {
        const navbar = document.querySelector('.navbar');
        const breadcrumb = document.querySelector('.breadcrumb');
        const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
        const breadcrumbHeight = breadcrumb ? breadcrumb.getBoundingClientRect().height : 0;
        const baseOffset = navHeight + breadcrumbHeight + 24;
        const firstSection = sections[0];
        const scrollMarginTop = firstSection
          ? parseFloat(window.getComputedStyle(firstSection).scrollMarginTop) || 0
          : 0;

        // Keep the active topic aligned with where anchor scrolling lands.
        return Math.max(baseOffset, scrollMarginTop + 2);
      }

      function updateActiveOnScroll() {
        if (!sections.length) return;

        const activationOffset = getScrollActivationOffset();
        let currentSection = sections[0];

        sections.forEach((section) => {
          if (section.getBoundingClientRect().top - activationOffset <= 0) {
            currentSection = section;
          }
        });

        setActiveByHash(`#${currentSection.id}`);
      }

      links.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const hash = link.getAttribute('href');
          const target = document.querySelector(hash);
          if (!target) return;
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', hash);
          setActiveByHash(hash);
        });
      });

      const onScroll = () => {
        window.requestAnimationFrame(updateActiveOnScroll);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);

      if (window.location.hash && document.querySelector(window.location.hash)) {
        setActiveByHash(window.location.hash, false);
      } else {
        setActiveByHash('#introducao', false);
      }

      updateActiveOnScroll();
    }

    document.addEventListener('DOMContentLoaded', () => {
      initBnccModal();
      initTopicSidebar();
    });

    function toggleAccordion(header) {
      if (!window.matchMedia('(max-width: 480px)').matches) return;
      const content = header.nextElementSibling;
      const isActive = header.classList.contains('active');
      if (isActive) {
        header.classList.remove('active');
        content.classList.remove('active');
      } else {
        header.classList.add('active');
        content.classList.add('active');
      }
    }

    (function(){
      let lastAccordionIsMobile = null;

      function applyAccordionMode(force = false) {
        const isMobile = window.matchMedia('(max-width: 480px)').matches;
        if (!force && lastAccordionIsMobile === isMobile) return;

        const headers = document.querySelectorAll('.accordion-header');

        headers.forEach((header) => {
          const content = header.nextElementSibling;
          if (!content || !content.classList.contains('accordion-content')) return;

          if (isMobile) {
            header.classList.remove('active');
            content.classList.remove('active');
          } else {
            header.classList.add('active');
            content.classList.add('active');
          }
        });

        lastAccordionIsMobile = isMobile;
      }

      function updateBreadcrumbPosition(){
        const navbar = document.querySelector('.navbar');
        const breadcrumb = document.querySelector('.breadcrumb');
        const section = document.querySelector('.section');
        const sidebar = document.querySelector('.topic-sidebar');
        const footer = document.querySelector('.footer-desktop');
        if (!breadcrumb || !navbar) return;
        const rootStyle = getComputedStyle(document.documentElement);
        const belowNavbarGap = parseFloat(rootStyle.getPropertyValue('--below-navbar-gap')) || 24;
        const navHeight = Math.ceil(navbar.offsetHeight || navbar.getBoundingClientRect().height || 90);
        document.documentElement.style.setProperty('--navbar-height', `${navHeight}px`);
        const breadcrumbTop = navHeight;
        breadcrumb.style.top = `${breadcrumbTop}px`;
        if (section) {
          const bcHeight = breadcrumb.getBoundingClientRect().height || 0;
          const contentStartLine = Math.ceil(navHeight + bcHeight + belowNavbarGap);
          section.style.marginTop = `${contentStartLine}px`;

          if (sidebar && window.matchMedia('(min-width: 481px)').matches) {
            const headerIsHidden =
              navbar.classList.contains('is-hidden') || breadcrumb.classList.contains('is-hidden');
            const sidebarLiftWhenHeaderHidden = headerIsHidden ? Math.min(56, Math.floor(navHeight * 0.65)) : 0;
            const baseTop = contentStartLine - sidebarLiftWhenHeaderHidden;
            let computedTop = baseTop;
            const viewportGap = 20;
            const footerGap = 20;
            let footerTop = null;

            if (footer) {
              const footerRect = footer.getBoundingClientRect();
              footerTop = footerRect.top;
              const sidebarHeight = Math.ceil(sidebar.getBoundingClientRect().height || 0);
              const maxTop = Math.floor(footerTop - sidebarHeight - footerGap);
              computedTop = Math.min(baseTop, maxTop);
            }

            const sidebarTop = Math.max(8, computedTop);
            let maxHeightPx = window.innerHeight - sidebarTop - viewportGap;

            if (typeof footerTop === 'number') {
              maxHeightPx = Math.min(maxHeightPx, footerTop - sidebarTop - footerGap);
            }

            maxHeightPx = Math.max(120, Math.floor(maxHeightPx));

            sidebar.style.setProperty('--sidebar-top', `${sidebarTop}px`);
            sidebar.style.setProperty('--sidebar-max-height', `${maxHeightPx}px`);
          }
        }
      }

      function initSmartNavbar() {
        const navbar = document.querySelector('.navbar');
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!navbar || !breadcrumb) return;

        let lastScrollY = window.scrollY;
        const minDelta = 8;
        const hideAfter = 120;

        function applyHeaderVisibility() {
          const currentY = window.scrollY;

          if (currentY <= 10) {
            navbar.classList.remove('is-hidden');
            breadcrumb.classList.remove('is-hidden');
            lastScrollY = currentY;
            return;
          }

          if (currentY > hideAfter && currentY > lastScrollY + minDelta) {
            navbar.classList.add('is-hidden');
            breadcrumb.classList.add('is-hidden');
          } else if (currentY < lastScrollY - minDelta) {
            navbar.classList.remove('is-hidden');
            breadcrumb.classList.remove('is-hidden');
          }

          lastScrollY = currentY;
        }

        window.addEventListener('scroll', applyHeaderVisibility, { passive: true });
      }

      document.addEventListener('DOMContentLoaded', () => applyAccordionMode(true));
      document.addEventListener('DOMContentLoaded', updateBreadcrumbPosition);
      document.addEventListener('DOMContentLoaded', initSmartNavbar);
      window.addEventListener('scroll', updateBreadcrumbPosition, { passive: true });
      window.addEventListener('resize', updateBreadcrumbPosition);
      window.addEventListener('resize', applyAccordionMode);
      const navEl = document.querySelector('.navbar');
      if (navEl && window.ResizeObserver) {
        const ro = new ResizeObserver(updateBreadcrumbPosition);
        ro.observe(navEl);
      }
    })();
