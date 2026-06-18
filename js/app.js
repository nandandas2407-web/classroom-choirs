/* ═══════════════════════════════════════════════════════════════
   CLASSROOM CHOIRS — Global JavaScript
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Utility: DOM Ready ── */
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {

    /* ═══════════════════════════════════════════════════════════
       1. CURTAIN LOADER
       ═══════════════════════════════════════════════════════════ */
    const curtain = document.querySelector('.curtain');
    if (curtain) {
      const hasVisited = sessionStorage.getItem('cc-curtain-seen');
      if (hasVisited) {
        curtain.classList.add('is-hidden');
      } else {
        document.body.classList.add('no-scroll');
        setTimeout(function () {
          curtain.classList.add('is-open');
          document.body.classList.remove('no-scroll');
          sessionStorage.setItem('cc-curtain-seen', '1');
          setTimeout(function () {
            curtain.classList.add('is-hidden');
          }, 900);
        }, 400);
      }
    }

    /* ═══════════════════════════════════════════════════════════
       2. SCROLL PROGRESS BAR
       ═══════════════════════════════════════════════════════════ */
    const progressBar = document.querySelector('.scroll-progress');
    const progressLabel = document.querySelector('.scroll-progress__label');
    if (progressBar) {
      window.addEventListener('scroll', function () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
        if (progress >= 99) {
          progressBar.classList.add('is-complete');
        } else {
          progressBar.classList.remove('is-complete');
        }
      }, { passive: true });
    }

    /* ═══════════════════════════════════════════════════════════
       3. NAVBAR SCROLL STATE
       ═══════════════════════════════════════════════════════════ */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 60) {
          navbar.classList.add('is-scrolled');
        } else {
          navbar.classList.remove('is-scrolled');
        }
      }, { passive: true });
    }

    /* ═══════════════════════════════════════════════════════════
       4. MOBILE MENU
       ═══════════════════════════════════════════════════════════ */
    const hamburger = document.querySelector('.navbar__hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileClose = document.querySelector('.mobile-menu__close');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('is-active');
        mobileMenu.classList.toggle('is-open');
        document.body.classList.toggle('no-scroll');
      });

      if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
      }

      mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
      });

      function closeMobileMenu() {
        hamburger.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
      }
    }

    /* ═══════════════════════════════════════════════════════════
       5. TYPEWRITER TAGLINE
       ═══════════════════════════════════════════════════════════ */
    const tagline = document.querySelector('.hero__tagline');
    if (tagline) {
      var text = tagline.getAttribute('data-text') || tagline.textContent;
      tagline.textContent = '';
      var cursor = document.createElement('span');
      cursor.className = 'cursor';
      tagline.appendChild(cursor);
      var i = 0;
      function typeChar() {
        if (i < text.length) {
          tagline.insertBefore(document.createTextNode(text.charAt(i)), cursor);
          i++;
          setTimeout(typeChar, 60);
        } else {
          setTimeout(function () {
            cursor.style.animation = 'blink 0.8s step-end 2';
            setTimeout(function () {
              cursor.style.opacity = '0';
            }, 1600);
          }, 500);
        }
      }
      setTimeout(typeChar, 1400);
    }

    /* ═══════════════════════════════════════════════════════════
       6. SCROLL REVEAL (IntersectionObserver)
       ═══════════════════════════════════════════════════════════ */
    var revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    }

    /* ═══════════════════════════════════════════════════════════
       7. STAT COUNTER ANIMATION
       ═══════════════════════════════════════════════════════════ */
    var statNumbers = document.querySelectorAll('.stats__number[data-count]');
    if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
      var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      statNumbers.forEach(function (el) {
        statObserver.observe(el);
      });

      function animateCount(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1500;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }
        requestAnimationFrame(step);
      }
    }

    /* ═══════════════════════════════════════════════════════════
       8. FILTER TABS
       ═══════════════════════════════════════════════════════════ */
    document.querySelectorAll('.filters').forEach(function (filterGroup) {
      var tabs = filterGroup.querySelectorAll('.filter-tab');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) { t.classList.remove('is-active'); });
          tab.classList.add('is-active');
          var category = tab.getAttribute('data-filter');
          var cards = tab.closest('section') ?
            tab.closest('section').querySelectorAll('[data-category]') :
            [];
          cards.forEach(function (card) {
            if (category === 'all' || card.getAttribute('data-category') === category) {
              card.style.display = '';
              setTimeout(function () { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(20px)';
              setTimeout(function () { card.style.display = 'none'; }, 400);
            }
          });
        });
      });
    });

    /* ═══════════════════════════════════════════════════════════
       9. SEARCH OVERLAY
       ═══════════════════════════════════════════════════════════ */
    const searchBtn = document.querySelector('.topbar__action-btn--search');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-overlay__close');
    const searchInput = document.querySelector('.search-overlay__input');
    const searchResults = document.querySelector('.search-overlay__results');

    if (searchBtn && searchOverlay) {
      searchBtn.addEventListener('click', function () {
        searchOverlay.classList.add('is-open');
        document.body.classList.add('no-scroll');
        setTimeout(function () { searchInput && searchInput.focus(); }, 300);
      });

      if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
      }

      searchOverlay.addEventListener('click', function (e) {
        if (e.target === searchOverlay) closeSearch();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('is-open')) {
          closeSearch();
        }
      });

      function closeSearch() {
        searchOverlay.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        if (searchInput) searchInput.value = '';
        if (searchResults) searchResults.innerHTML = '';
      }

      if (searchInput && searchResults) {
        searchInput.addEventListener('input', debounce(function () {
          var query = searchInput.value.trim().toLowerCase();
          if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
          }

          var db = JSON.parse(localStorage.getItem('cc-db') || '{}');
          var allItems = [];

          if (db.works) {
            db.works.forEach(function (w) {
              allItems.push({ type: '🎬', title: w.title, meta: w.category, link: 'our-works.html', category: w.category });
            });
          }
          if (db.events) {
            db.events.forEach(function (e) {
              allItems.push({ type: '📅', title: e.name, meta: e.date, link: 'upcoming-events.html' });
            });
          }
          if (db.programmes) {
            db.programmes.forEach(function (p) {
              allItems.push({ type: '🎭', title: p.title, meta: p.category, link: 'past-programmes.html' });
            });
          }
          if (db.members) {
            db.members.forEach(function (m) {
              allItems.push({ type: '👤', title: m.name, meta: m.role, link: 'members.html' });
            });
          }

          var filtered = allItems.filter(function (item) {
            return item.title.toLowerCase().includes(query) ||
              (item.meta && item.meta.toLowerCase().includes(query));
          });

          searchResults.innerHTML = filtered.slice(0, 8).map(function (item) {
            return '<a href="' + item.link + '" class="search-result">' +
              '<span class="search-result__icon">' + item.type + '</span>' +
              '<div><div class="search-result__title">' + highlightMatch(item.title, query) + '</div>' +
              '<div class="search-result__meta">' + (item.meta || '') + '</div></div></a>';
          }).join('');

          if (filtered.length === 0) {
            searchResults.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-dim);font-style:italic;">No results found</div>';
          }
        }, 250));
      }

      function highlightMatch(text, query) {
        var idx = text.toLowerCase().indexOf(query);
        if (idx === -1) return text;
        return text.substring(0, idx) + '<strong style="color:var(--accent)">' +
          text.substring(idx, idx + query.length) + '</strong>' +
          text.substring(idx + query.length);
      }
    }

    /* ═══════════════════════════════════════════════════════════
       10. PAGE TRANSITIONS
       ═══════════════════════════════════════════════════════════ */
    const pageTransition = document.querySelector('.page-transition');
    var internalLinks = document.querySelectorAll('a[href$=".html"]');

    internalLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          e.preventDefault();
          if (pageTransition) {
            pageTransition.classList.add('is-active');
            setTimeout(function () {
              window.location.href = href;
            }, 300);
          } else {
            window.location.href = href;
          }
        }
      });
    });

    /* ═══════════════════════════════════════════════════════════
       11. BACK TO TOP
       ═══════════════════════════════════════════════════════════ */
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
          backToTop.classList.add('is-visible');
        } else {
          backToTop.classList.remove('is-visible');
        }
      }, { passive: true });

      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ═══════════════════════════════════════════════════════════
       12. IMAGE HOVER PARALLAX TILT
       ═══════════════════════════════════════════════════════════ */
    document.querySelectorAll('.programme-card, .nav-tile, .work-card--theatre').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        var y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
        var image = card.querySelector('.programme-card__image, .nav-tile__image, .work-card__image');
        if (image) {
          image.style.transform = 'scale(1.05) translate(' + x + 'px, ' + y + 'px)';
        }
        // Theatre spotlight follow
        var spotlight = card.querySelector('.work-card__spotlight');
        if (spotlight) {
          var px = ((e.clientX - rect.left) / rect.width) * 100;
          var py = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--mouse-x', px + '%');
          card.style.setProperty('--mouse-y', py + '%');
        }
      });

      card.addEventListener('mouseleave', function () {
        var image = card.querySelector('.programme-card__image, .nav-tile__image, .work-card__image');
        if (image) {
          image.style.transform = '';
        }
      });
    });

    /* ═══════════════════════════════════════════════════════════
       13. COUNTDOWN TIMERS
       ═══════════════════════════════════════════════════════════ */
    document.querySelectorAll('[data-countdown]').forEach(function (el) {
      var targetDate = new Date(el.getAttribute('data-countdown')).getTime();
      if (isNaN(targetDate)) return;

      function updateCountdown() {
        var now = Date.now();
        var diff = targetDate - now;
        if (diff <= 0) {
          el.innerHTML = '<span style="font-style:italic;color:var(--text-muted)">Happening now</span>';
          return;
        }

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);

        var units = [
          { num: days, label: 'Days' },
          { num: hours, label: 'Hrs' },
          { num: minutes, label: 'Min' },
          { num: seconds, label: 'Sec' }
        ];

        el.innerHTML = units.map(function (u) {
          return '<div class="playbill__countdown-unit">' +
            '<div class="playbill__countdown-num">' + String(u.num).padStart(2, '0') + '</div>' +
            '<div class="playbill__countdown-label">' + u.label + '</div></div>';
        }).join('');
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);
    });

    /* ═══════════════════════════════════════════════════════════
       14. LIGHTBOX
       ═══════════════════════════════════════════════════════════ */
    const lightbox = document.querySelector('.lightbox');
    const lightboxContent = document.querySelector('.lightbox__content');
    const lightboxClose = document.querySelector('.lightbox__close');

    document.querySelectorAll('[data-lightbox]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        if (!lightbox || !lightboxContent) return;
        var src = trigger.getAttribute('data-lightbox');
        var type = trigger.getAttribute('data-lightbox-type') || 'image';

        if (type === 'video') {
          lightboxContent.innerHTML = '<video controls autoplay style="max-width:100%;max-height:85vh;display:block"><source src="' + src + '" type="video/mp4"></video>';
        } else {
          lightboxContent.innerHTML = '<img src="' + src + '" alt="Preview" style="max-width:100%;max-height:85vh;display:block">';
        }

        lightbox.classList.add('is-open');
        document.body.classList.add('no-scroll');
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });

    function closeLightbox() {
      if (lightbox) lightbox.classList.remove('is-open');
      if (lightboxContent) lightboxContent.innerHTML = '';
      document.body.classList.remove('no-scroll');
    }

    /* ═══════════════════════════════════════════════════════════
       15. DATABASE UTILITY (localStorage)
       ═══════════════════════════════════════════════════════════ */
    window.CCDB = {
      get: function (key) {
        var db = JSON.parse(localStorage.getItem('cc-db') || '{}');
        return db[key] || [];
      },
      set: function (key, data) {
        var db = JSON.parse(localStorage.getItem('cc-db') || '{}');
        db[key] = data;
        localStorage.setItem('cc-db', JSON.stringify(db));
      },
      add: function (key, item) {
        var items = this.get(key);
        item.id = item.id || Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        items.push(item);
        this.set(key, items);
        return item;
      },
      remove: function (key, id) {
        var items = this.get(key).filter(function (item) { return item.id !== id; });
        this.set(key, items);
      },
      init: function () {
        if (!localStorage.getItem('cc-db')) {
          this.set('works', []);
          this.set('events', []);
          this.set('programmes', []);
          this.set('members', []);
        }
      }
    };

    CCDB.init();

    /* ═══════════════════════════════════════════════════════════
       16. SEED DATA (first visit only)
       ═══════════════════════════════════════════════════════════ */
    if (CCDB.get('works').length === 0) {
      CCDB.set('works', [
        { id: 'w1', title: 'The Last Classroom', category: 'film', description: 'A short film about the final day of an old school building.', year: '2025', image: '' },
        { id: 'w2', title: 'Echoes in the Hall', category: 'theatre', description: 'A one-act play exploring memory and space.', year: '2025', image: '' },
        { id: 'w3', title: 'Monsoon Sessions', category: 'music', description: 'An original album recorded during the rainy season.', year: '2024', image: '' },
        { id: 'w4', title: 'Faces of Our City', category: 'photography', description: 'A photo series capturing everyday life.', year: '2025', image: '' },
        { id: 'w5', title: 'Between the Lines', category: 'film', description: 'A documentary about student journalism.', year: '2024', image: '' },
        { id: 'w6', title: 'Stage Whisper', category: 'theatre', description: 'An experimental theatre piece about whispered secrets.', year: '2025', image: '' },
        { id: 'w7', title: 'Reverb', category: 'music', description: 'A live recording session captured in a single take.', year: '2025', image: '' },
        { id: 'w8', title: 'Light & Shadow', category: 'photography', description: 'Exploring contrast through architecture.', year: '2024', image: '' }
      ]);
    }

    if (CCDB.get('events').length === 0) {
      CCDB.set('events', [
        { id: 'e1', name: 'Short Film Screening Night', date: '2026-07-15T19:00:00', mode: 'Offline', description: 'Join us for an evening of student-made short films, followed by director Q&A sessions.', location: 'City Auditorium', image: '' },
        { id: 'e2', name: 'Theatre Workshop: Stage Presence', date: '2026-07-22T14:00:00', mode: 'Online', description: 'A hands-on workshop on commanding attention on stage, led by guest director Ananya Roy.', location: 'Zoom', image: '' },
        { id: 'e3', name: 'Original Composition Showcase', date: '2026-08-05T18:00:00', mode: 'Offline', description: 'Students perform original compositions ranging from classical to contemporary.', location: 'School Auditorium', image: '' }
      ]);
    }

    if (CCDB.get('programmes').length === 0) {
      CCDB.set('programmes', [
        { id: 'p1', title: 'Monsoon Theatre Festival 2025', category: 'theatre', date: 'Aug 2025', description: 'Three original plays performed over two weekends.', image: '' },
        { id: 'p2', title: 'Short Film Lab', category: 'film', date: 'Jan 2025', description: 'A 6-week intensive where students wrote, directed, and edited short films.', image: '' },
        { id: 'p3', title: 'Sound & Silence', category: 'music', date: 'Nov 2024', description: 'An exploration of ambient music and field recording.', image: '' },
        { id: 'p4', title: 'Portraits of Home', category: 'photography', date: 'Sep 2024', description: 'A photography exhibition about belonging and identity.', image: '' },
        { id: 'p5', title: 'The Reading Room', category: 'theatre', date: 'Mar 2024', description: 'A staged reading of original student-written scripts.', image: '' },
        { id: 'p6', title: 'Film Futures', category: 'film', date: 'Jun 2024', description: 'A mentorship programme pairing students with indie filmmakers.', image: '' }
      ]);
    }

    if (CCDB.get('members').length === 0) {
      CCDB.set('members', [
        { id: 'm1', name: 'Arjun Mehta', role: 'Founder & Director', department: 'Direction', tags: 'Direction, Scriptwriting, Leadership', image: '', isFounder: true },
        { id: 'm2', name: 'Saanvi Kaur', role: 'Head of Theatre', department: 'Theatre', tags: 'Acting, Stage Design, Dramaturgy', image: '' },
        { id: 'm3', name: 'Rohan Das', role: 'Lead Cinematographer', department: 'Film', tags: 'Cinematography, Editing, Color Grading', image: '' },
        { id: 'm4', name: 'Meera Iyer', role: 'Music Director', department: 'Music', tags: 'Composition, Vocal, Arrangement', image: '' },
        { id: 'm5', name: 'Kabir Singh', role: 'Photography Lead', department: 'Photography', tags: 'Portrait, Street, Documentary', image: '' },
        { id: 'm6', name: 'Priya Nair', role: 'Scriptwriter', department: 'Scriptwriting', tags: 'Screenplay, Dialogue, Story Development', image: '' },
        { id: 'm7', name: 'Vikram Joshi', role: 'Sound Designer', department: 'Music', tags: 'Sound Design, Mixing, Foley', image: '' },
        { id: 'm8', name: 'Anika Roy', role: 'Production Designer', department: 'Theatre', tags: 'Set Design, Props, Visual Identity', image: '' }
      ]);
    }

    /* ── Debounce Utility ── */
    function debounce(fn, delay) {
      var timer;
      return function () {
        var args = arguments;
        var ctx = this;
        clearTimeout(timer);
        timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
      };
    }

  }); // end onReady
})();
