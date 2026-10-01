/* MisoPretty Seeds — 3D & motion layer.
   Petal + glitter WebGL hero, scroll reveals, 3D tilt cards,
   magnetic buttons, hero parallax. Content untouched. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- 1. Scroll reveals ---------- */
  try {
    var revealEls = document.querySelectorAll(
      '.seed-section__heading, .seed-steps li, .seed-about > div, ' +
      '.seed-faq details, .seed-final h2, .seed-final p, .seed-final a, ' +
      '.seed-feature-card, .seed-scarcity'
    );
    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      revealEls.forEach(function (el, i) {
        el.classList.add('seed-reveal');
        el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
        io.observe(el);
      });
    }
  } catch (err) { /* reveals are decorative */ }

  /* ---------- 2. Hero parallax on scroll (uses `translate` so it composes
     with the existing rise-in keyframe animation) ---------- */
  try {
    var hero = document.querySelector('.seed-hero');
    var hl = document.querySelector('.seed-hero__headline');
    var hc = document.querySelector('.seed-hero__copy');
    var ticking = false;
    function parallax() {
      ticking = false;
      if (!hero) return;
      var y = window.scrollY || window.pageYOffset;
      var h = hero.offsetHeight || 1;
      if (y < h * 1.2 && !reduceMotion) {
        if (hl) hl.style.translate = '0 ' + (y * 0.22).toFixed(1) + 'px';
        if (hc) hc.style.translate = '0 ' + (y * 0.1).toFixed(1) + 'px';
      }
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
    }, { passive: true });
  } catch (err) { /* parallax is decorative */ }

  /* ---------- 3. 3D tilt on product cards ---------- */
  try {
    if (finePointer && !reduceMotion) {
      document.querySelectorAll('.seed-product').forEach(function (card) {
        // Free `transform` for tilt once the entrance animation is done.
        card.addEventListener('animationend', function () {
          card.style.animation = 'none';
        }, { once: true });
        // Safety: also clear after 2.5s in case animationend is missed.
        setTimeout(function () { card.style.animation = 'none'; }, 2500);
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            'perspective(900px) rotateY(' + (px * 10).toFixed(2) + 'deg)' +
            ' rotateX(' + (-py * 10).toFixed(2) + 'deg) translateZ(6px)';
        });
        card.addEventListener('mouseleave', function () {
          card.style.transform = '';
        });
      });
    }
  } catch (err) { /* tilt is decorative */ }

  /* ---------- 4. Magnetic buttons ---------- */
  try {
    if (finePointer && !reduceMotion) {
      document.querySelectorAll('.seed-button').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2);
          var dy = e.clientY - (r.top + r.height / 2);
          btn.style.transform =
            'translate(' + (dx * 0.14).toFixed(1) + 'px,' + (dy * 0.22).toFixed(1) + 'px)';
        });
        btn.addEventListener('mouseleave', function () {
          btn.style.transform = '';
        });
      });
    }
  } catch (err) { /* magnetic is decorative */ }

  /* ---------- 5. WebGL hero: floating petals + glitter ---------- */
  function petalTexture() {
    var c = document.createElement('canvas');
    c.width = 128; c.height = 160;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(64, 92, 8, 64, 84, 95);
    g.addColorStop(0, '#fff6f8');
    g.addColorStop(0.55, '#f8c2d3');
    g.addColorStop(1, '#ec8dab');
    x.fillStyle = g;
    x.beginPath();
    x.moveTo(64, 6);
    x.bezierCurveTo(118, 42, 124, 112, 64, 154);
    x.bezierCurveTo(4, 112, 10, 42, 64, 6);
    x.fill();
    x.strokeStyle = 'rgba(186, 92, 122, 0.35)';
    x.lineWidth = 3;
    x.beginPath();
    x.moveTo(64, 16);
    x.quadraticCurveTo(60, 82, 64, 146);
    x.stroke();
    return new THREE.CanvasTexture(c);
  }

  function sparkleTexture() {
    var c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(32, 32, 1, 32, 32, 30);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,244,214,0.9)');
    g.addColorStop(1, 'rgba(255,244,214,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    // cross flare
    x.strokeStyle = 'rgba(255,255,255,0.85)';
    x.lineWidth = 3;
    x.beginPath(); x.moveTo(32, 4); x.lineTo(32, 60); x.stroke();
    x.beginPath(); x.moveTo(4, 32); x.lineTo(60, 32); x.stroke();
    return new THREE.CanvasTexture(c);
  }

  function initWebGL() {
    var canvas = document.getElementById('seedWebgl');
    var heroEl = document.querySelector('.seed-hero');
    if (!canvas || !heroEl || !window.THREE) return;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (err) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 60);
    camera.position.set(0, 0, 10);

    scene.add(new THREE.AmbientLight(0xfff2e8, 0.95));
    var sun = new THREE.DirectionalLight(0xfff6e0, 1.35);
    sun.position.set(4, 6, 6);
    scene.add(sun);
    var rim = new THREE.DirectionalLight(0xf7b8cd, 0.5);
    rim.position.set(-5, -2, 4);
    scene.add(rim);

    var isMobile = heroEl.clientWidth < 620;
    var PETALS = isMobile ? 26 : 64;
    var SPARKS = isMobile ? 90 : 200;

    // Bent petal geometry (cupped, tapered) so instances read as 3D.
    var geo = new THREE.PlaneGeometry(0.55, 0.85, 6, 6);
    var pos = geo.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var px = pos.getX(i), py = pos.getY(i);
      var bend = Math.sin((py / 0.85 + 0.5) * Math.PI) * 0.22;
      var cup = Math.pow(Math.abs(px) / 0.275, 2) * 0.12;
      pos.setZ(i, bend + cup);
      pos.setX(i, px * (1 - Math.abs(py) / 0.85 * 0.25));
    }
    geo.computeVertexNormals();

    var mat = new THREE.MeshStandardMaterial({
      map: petalTexture(),
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.55,
      metalness: 0.05,
      depthWrite: false
    });
    var petals = new THREE.InstancedMesh(geo, mat, PETALS);
    petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(petals);

    var dummy = new THREE.Object3D();
    var col = new THREE.Color();
    var data = [];
    function pickColor() {
      var r = Math.random();
      if (r < 0.55) return col.setHSL(0.94 + Math.random() * 0.04, 0.55, 0.78 + Math.random() * 0.1); // rose
      if (r < 0.75) return col.setHSL(0.12, 0.72, 0.68 + Math.random() * 0.08);                        // gold
      if (r < 0.9) return col.setHSL(0.09, 0.35, 0.9);                                               // cream
      return col.setHSL(0.36, 0.3, 0.72 + Math.random() * 0.1);                                       // leaf
    }
    for (var p = 0; p < PETALS; p++) {
      data.push({
        bx: (Math.random() - 0.5) * 16,
        by: (Math.random() - 0.5) * 9,
        bz: -3.5 + Math.random() * 5,
        ph: Math.random() * Math.PI * 2,
        ph2: Math.random() * Math.PI * 2,
        sp: 0.25 + Math.random() * 0.5,
        rx: (Math.random() - 0.5) * 1.4,
        ry: (Math.random() - 0.5) * 1.4,
        s: 0.6 + Math.random() * 0.9
      });
      petals.setColorAt(p, pickColor());
    }
    if (petals.instanceColor) petals.instanceColor.needsUpdate = true;

    // Glitter: two twinkling point layers.
    var sparkTex = sparkleTexture();
    var sparkLayers = [];
    for (var L = 0; L < 2; L++) {
      var n = Math.floor(SPARKS / 2);
      var sp = new Float32Array(n * 3);
      var sc = new Float32Array(n * 3);
      for (var s = 0; s < n; s++) {
        sp[s * 3] = (Math.random() - 0.5) * 15;
        sp[s * 3 + 1] = (Math.random() - 0.5) * 9;
        sp[s * 3 + 2] = -3 + Math.random() * 5;
        var gold = Math.random() < 0.6;
        sc[s * 3] = 1;
        sc[s * 3 + 1] = gold ? 0.88 : 0.96;
        sc[s * 3 + 2] = gold ? 0.66 : 0.98;
      }
      var sg = new THREE.BufferGeometry();
      sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
      sg.setAttribute('color', new THREE.BufferAttribute(sc, 3));
      var sm = new THREE.PointsMaterial({
        size: 0.14, map: sparkTex, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, vertexColors: true, opacity: 0.8,
        sizeAttenuation: true
      });
      var pts = new THREE.Points(sg, sm);
      pts.userData.phase = L * Math.PI;
      scene.add(pts);
      sparkLayers.push(pts);
    }

    // Mouse parallax.
    var mx = 0, my = 0, cx = 0, cy = 0;
    heroEl.addEventListener('mousemove', function (e) {
      var r = heroEl.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    heroEl.addEventListener('mouseleave', function () { mx = 0; my = 0; });

    function resize() {
      var w = heroEl.clientWidth, h = heroEl.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    var running = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        running = es[0].isIntersecting && !document.hidden;
      }).observe(heroEl);
    }
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
    });

    var clock = new THREE.Clock();
    (function tick() {
      requestAnimationFrame(tick);
      if (!running) return;
      var t = clock.getElapsedTime();

      for (var k = 0; k < PETALS; k++) {
        var d = data[k];
        dummy.position.set(
          d.bx + Math.sin(t * d.sp * 0.7 + d.ph2) * 0.7,
          d.by + Math.sin(t * d.sp + d.ph) * 0.55 + Math.sin(t * 0.12 + d.ph) * 0.3,
          d.bz
        );
        dummy.rotation.set(t * d.rx + d.ph, t * d.ry + d.ph2, Math.sin(t * 0.4 + d.ph) * 0.5);
        dummy.scale.setScalar(d.s);
        dummy.updateMatrix();
        petals.setMatrixAt(k, dummy.matrix);
      }
      petals.instanceMatrix.needsUpdate = true;

      sparkLayers.forEach(function (pts) {
        pts.material.opacity = 0.45 + 0.4 * Math.abs(Math.sin(t * 1.6 + pts.userData.phase));
        pts.rotation.z = Math.sin(t * 0.05) * 0.05;
      });

      cx += (mx * 1.1 - cx) * 0.04;
      cy += (my * 0.7 - cy) * 0.04;
      camera.position.x = cx;
      camera.position.y = -cy;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    })();
  }

  if (!reduceMotion) {
    if (window.THREE) {
      initWebGL();
    } else {
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.158.0/three.min.js';
      s.onload = initWebGL;
      s.onerror = function () { /* hero still looks great without WebGL */ };
      document.head.appendChild(s);
    }
  }
})();
