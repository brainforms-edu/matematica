(function() {
    function fixMobileHeaderAndText() {
      document.querySelectorAll('.container .explicacao, .container .explicacao *').forEach(el => {
        el.style.setProperty('color', '#333', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#333', 'important');
        el.style.setProperty('text-shadow', 'none', 'important');
        el.style.setProperty('filter', 'none', 'important');
        el.style.setProperty('mix-blend-mode', 'normal', 'important');
        el.style.setProperty('background', 'transparent', 'important');
        el.style.setProperty('opacity', '1', 'important');
        el.style.setProperty('visibility', 'visible', 'important');
      });

      document.querySelectorAll('.container .header-container h3, .container .header-container h3 a, .header-container h3, .header-container h3 a').forEach(el => {
        el.style.setProperty('color', '#ffffff', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#ffffff', 'important');
        el.style.setProperty('text-shadow', 'none', 'important');
        el.style.setProperty('filter', 'none', 'important');
        el.style.setProperty('mix-blend-mode', 'normal', 'important');
        el.style.setProperty('opacity', '1', 'important');
      });

      document.querySelectorAll('.container .header-container img').forEach(img => {
        img.style.setProperty('mix-blend-mode', 'normal', 'important');
        img.style.setProperty('filter', 'none', 'important');
      });
    }

    window.addEventListener('load', () => { setTimeout(fixMobileHeaderAndText, 50); });

    const mo = new MutationObserver(() => {
      if (window.matchMedia && window.matchMedia('(max-width:480px)').matches) {
        fixMobileHeaderAndText();
      }
    });
    mo.observe(document.body, { attributes: true, childList: true, subtree: true, attributeFilter: ['class', 'style'] });

    window.addEventListener('resize', () => {
      if (window.matchMedia && window.matchMedia('(max-width:480px)').matches) {
        fixMobileHeaderAndText();
      }
    });
  })();
