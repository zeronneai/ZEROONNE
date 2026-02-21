import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service, RevealProps } from './types';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

// --- TRANSLATIONS ---
const translations = {
  en: {
    nav: {
      services: "Our Services +",
      close: "Close",
      contact: "Contact"
    },
    hero: {
      evolution: "Evolution is not optional",
      crafting: "CRAFTING",
      intelligence: "INTELLIGENCE",
      scroll: "Scroll to Explore"
    },
    work: {
      selected: "Selected Work",
      digital: "Digital",
      frontiers: "Frontiers",
      caseStudy: "CASE STUDY",
      anymore: "AND ANYMORE...",
      partOfIt: "YOU CAN BE PART OF IT.",
      startProject: "Start Project"
    },
    services: {
      title: "What we do",
      subtitle: "Our Core",
      subtitleItalic: "Capabilities",
      viewProject: "VIEW PROJECT",
      items: [
        { 
          id: '01', 
          title: 'AI STRATEGY', 
          desc: 'We architect the intelligent core of your business future.', 
          detail: 'From custom LLM integration to predictive analytics, we design the roadmap for your AI transformation.' 
        },
        { 
          id: '02', 
          title: 'LUXURY LANDINGS', 
          desc: 'High-conversion interfaces powered by cognitive psychology.', 
          detail: 'Our landing pages aren’t just beautiful; they use AI-driven heatmaps to ensure every pixel converts.' 
        },
        { 
          id: '03', 
          title: 'CREATIVE AUTOMATION', 
          desc: 'Scaling content production without losing human soul.', 
          detail: 'Custom diffusion models trained specifically on your brand’s visual DNA for infinite, consistent assets.' 
        }
      ],
      list: [
        "Web Design", "Web Hosting", "App Design", "UI Design", "UX", 
        "Custom Software", "AI Video", "AI Graphic Design", "AI Images", 
        "AI Upscaling", "AI Creative Strategy", "AI Automation", 
        "AI Education", "AI Integration", "AI Installation"
      ]
    },
    blueprint: {
      title: "The Blueprint",
      strategy: { title: "STRATEGY", desc: "Deep dive into your ecosystem to identify AI leverage points." },
      build: { title: "BUILD", desc: "Agile development of your custom intelligent solution." },
      launch: { title: "LAUNCH", desc: "Deployment and continuous optimization for maximum ROI." }
    },
    marquee: {
      small: "SMALL BUSINESS",
      personal: "PERSONAL BRANDS",
      growth: "GROWTH FIRMS",
      everyone: "EVERYONNE"
    },
    impact: {
      question: "How much",
      questionItalic: "growth",
      questionEnd: "is your brand sacrificing by ignoring AI?",
      button: "Click to reveal the gap",
      advantage: "The Advantage",
      faster: "FASTER",
      statDesc: "Companies integrating AI-driven creative strategies see an average surge in digital authority within the first 12 months.",
      back: "← Back to question"
    },
    agency: {
      text1: "is a next-gen",
      text2: "AI agency",
      text3: "focused on",
      text4: "creative",
      text5: "and",
      text6: "workflow optimization"
    },
    contact: {
      ready: "READY TO",
      transcend: "TRANSCEND?",
      mark: "Leave your mark below",
      namePlaceholder: "Full Name",
      emailPlaceholder: "Business Email",
      msgPlaceholder: "Tell us about your vision",
      submit: "Submit Request"
    },
    modal: {
      details: "Service Details",
      enquire: "Enquire Now",
      start: "Start a",
      project: "Project",
      startDesc: "Tell us about your vision. We will guide you from there.",
      labelName: "Name",
      labelProject: "Project Name",
      projectPlaceholder: "Project Title",
      labelEmail: "Email",
      labelDesc: "Project Description",
      submitProposal: "Submit Proposal"
    },
    footer: {
      designed: "Designed by AI. Built for Humans."
    }
  },
  es: {
    nav: {
      services: "Nuestros Servicios +",
      close: "Cerrar",
      contact: "Contacto"
    },
    hero: {
      evolution: "La evolución no es opcional",
      crafting: "CREANDO",
      intelligence: "INTELIGENCIA",
      scroll: "Desliza para Explorar"
    },
    work: {
      selected: "Trabajos Seleccionados",
      digital: "Fronteras",
      frontiers: "Digitales",
      caseStudy: "ESTUDIO DE CASO",
      anymore: "Y AÚN HAY MÁS...",
      partOfIt: "TÚ PUEDES SER PARTE.",
      startProject: "Iniciar Proyecto"
    },
    services: {
      title: "Lo que hacemos",
      subtitle: "Nuestras Capacidades",
      subtitleItalic: "Centrales",
      viewProject: "VER PROYECTO",
      items: [
        { 
          id: '01', 
          title: 'ESTRATEGIA IA', 
          desc: 'Arquitectamos el núcleo inteligente del futuro de tu negocio.', 
          detail: 'Desde la integración de LLM personalizados hasta análisis predictivos, diseñamos la hoja de ruta para tu transformación con IA.' 
        },
        { 
          id: '02', 
          title: 'LANDINGS DE LUJO', 
          desc: 'Interfaces de alta conversión impulsadas por psicología cognitiva.', 
          detail: 'Nuestras landing pages no son solo hermosas; usan mapas de calor impulsados por IA para asegurar que cada píxel convierta.' 
        },
        { 
          id: '03', 
          title: 'AUTOMATIZACIÓN CREATIVA', 
          desc: 'Escalando la producción de contenido sin perder el alma humana.', 
          detail: 'Modelos de difusión personalizados entrenados específicamente en el ADN visual de tu marca para activos infinitos y consistentes.' 
        }
      ],
      list: [
        "Diseño Web", "Hosting Web", "Diseño de Apps", "Diseño UI", "UX", 
        "Software a Medida", "Video IA", "Diseño Gráfico IA", "Imágenes IA", 
        "Escalado IA", "Estrategia Creativa IA", "Automatización IA", 
        "Educación IA", "Integración IA", "Instalación IA"
      ]
    },
    blueprint: {
      title: "El Plano",
      strategy: { title: "ESTRATEGIA", desc: "Profundizamos en tu ecosistema para identificar puntos de apalancamiento de IA." },
      build: { title: "CONSTRUCCIÓN", desc: "Desarrollo ágil de tu solución inteligente personalizada." },
      launch: { title: "LANZAMIENTO", desc: "Implementación y optimización continua para el máximo ROI." }
    },
    marquee: {
      small: "PEQUEÑOS NEGOCIOS",
      personal: "MARCAS PERSONALES",
      growth: "EMPRESAS EN CRECIMIENTO",
      everyone: "TODOS"
    },
    impact: {
      question: "¿Cuánto",
      questionItalic: "crecimiento",
      questionEnd: "está sacrificando tu marca al ignorar la IA?",
      button: "Clic para revelar la brecha",
      advantage: "La Ventaja",
      faster: "MÁS RÁPIDO",
      statDesc: "Las empresas que integran estrategias creativas impulsadas por IA ven un aumento promedio en autoridad digital en los primeros 12 meses.",
      back: "← Volver a la pregunta"
    },
    agency: {
      text1: "es una",
      text2: "agencia de IA",
      text3: "de próxima generación enfocada en",
      text4: "creatividad",
      text5: "y",
      text6: "optimización de flujos de trabajo"
    },
    contact: {
      ready: "¿LISTO PARA",
      transcend: "TRANSCENDER?",
      mark: "Deja tu huella abajo",
      namePlaceholder: "Nombre Completo",
      emailPlaceholder: "Correo Empresarial",
      msgPlaceholder: "Cuéntanos sobre tu visión",
      submit: "Enviar Solicitud"
    },
    modal: {
      details: "Detalles del Servicio",
      enquire: "Consultar Ahora",
      start: "Inicia un",
      project: "Proyecto",
      startDesc: "Cuéntanos sobre tu visión. Te guiaremos desde allí.",
      labelName: "Nombre",
      labelProject: "Nombre del Proyecto",
      projectPlaceholder: "Título del Proyecto",
      labelEmail: "Correo",
      labelDesc: "Descripción del Proyecto",
      submitProposal: "Enviar Propuesta"
    },
    footer: {
      designed: "Diseñado por IA. Construido para Humanos."
    }
  }
};

// --- ANIMATION WRAPPER ---
const Reveal: React.FC<RevealProps> = ({ children, viewport }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={viewport || { once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// --- COUNTER COMPONENT ---
const Counter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1.5; // seconds
    const increment = target / (duration * 60);
    
    const handle = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(handle);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(handle);
  }, [target]);

  return <span>{count}%</span>;
};

// --- GROWTH IMPACT SECTION COMPONENT ---
const GrowthImpactSection = ({ text }: { text: typeof translations.en.impact }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="py-40 px-8 relative z-10 flex items-center justify-center min-h-[500px]">
      <div className="max-w-4xl w-full text-center">
        <AnimatePresence mode="wait">
          {!revealed ? (
            // --- ESTADO PRE-CLICK ---
            <motion.div
              key="pre-click"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="cursor-pointer group"
              onClick={() => setRevealed(true)}
            >
              <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-tight mb-8">
                {text.question} <span className="italic">{text.questionItalic}</span> {text.questionEnd}
              </h2>
              
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block"
              >
                <button className="bg-white/5 border border-[#7000FF]/50 px-8 py-4 rounded-full text-[10px] tracking-[0.3em] font-bold uppercase group-hover:bg-[#7000FF] group-hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(112,0,255,0.2)]">
                  {text.button}
                </button>
              </motion.div>
            </motion.div>
          ) : (
            // --- ESTADO REVELADO (EL DATO) ---
            <motion.div
              key="post-click"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="flex flex-col items-center"
            >
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 text-[#7000FF] mb-6"
              >
                <span className="text-[10px] tracking-[0.5em] font-bold uppercase">{text.advantage}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-bounce">
                  <path d="M12 4V20M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>

              <h3 className="text-[12vw] md:text-[10vw] font-black leading-none tracking-tighter text-white mb-6">
                <span className="text-[#7000FF]"><Counter target={45} /></span> {text.faster}
              </h3>
              
              <p className="text-xl md:text-2xl font-light opacity-60 max-w-2xl mx-auto">
                {text.statDesc}
              </p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={(e) => { e.stopPropagation(); setRevealed(false); }}
                className="mt-12 text-[9px] uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
              >
                {text.back}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// --- 3D PARTICLE SCENE WITH AI HAND TRACKING ---
const EscenaZeronne = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Configuración de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 2. Crear las Partículas (El polvo digital)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 4000;
    const posArray = new Float32Array(particlesCount * 3);
    const basePosArray = new Float32Array(particlesCount * 3); // Para recordar dónde estaban originalmente

    for (let i = 0; i < particlesCount * 3; i++) {
      const val = (Math.random() - 0.5) * 12;
      posArray[i] = val;
      basePosArray[i] = val;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material de las partículas (Color morado Zeronne)
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x7000FF,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 3. Variables para la interacción
    let handX = 0;
    let handY = 0;
    let isHandPresent = false;
    
    // Si no hay cámara, usamos el mouse como fallback
    const onMouseMove = (event: MouseEvent) => {
      if (isHandPresent) return; // Si la IA controla, ignoramos el mouse
      
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Convertir coordenadas del ratón a espacio 3D
      handX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      handY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Ajustar escala para Three.js
      handX *= 6;
      handY *= 4;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Función para actualizar las partículas desde la IA
    (window as any).updateHandPosition = (x: number, y: number) => {
      isHandPresent = true;
      // Invertir X por el efecto espejo de la cámara y mapear a 3D
      handX = -((x * 2) - 1) * 6;
      handY = -((y * 2) - 1) * 4;
    };

    (window as any).handLost = () => {
      isHandPresent = false;
    };

    // 4. Bucle de Animación (La magia del movimiento)
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotación suave de toda la galaxia de partículas
      particlesMesh.rotation.y = elapsedTime * 0.05;

      // Animar cada partícula individualmente (Física de repulsión)
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = basePosArray[i3];
        const y = basePosArray[i3 + 1];
        const z = basePosArray[i3 + 2];

        // Calcular distancia a la "mano" o "ratón"
        // Como la malla rota, tenemos que hacer una aproximación sencilla
        const dx = positions[i3] - handX;
        const dy = positions[i3 + 1] - handY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Si la mano está cerca, repeler la partícula
        if (dist < 2.5) {
          const force = (2.5 - dist) / 2.5;
          positions[i3] += (dx / dist) * force * 0.1;
          positions[i3 + 1] += (dy / dist) * force * 0.1;
          positions[i3 + 2] += force * 0.1;
        } else {
          // Regresar lentamente a su posición original
          positions[i3] += (x - positions[i3]) * 0.02;
          positions[i3 + 1] += (y - positions[i3 + 1]) * 0.02;
          positions[i3 + 2] += (z - positions[i3 + 2]) * 0.02;
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(frameId);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  // Función para inyectar MediaPipe y activar la cámara
  const initAI = async () => {
    setLoadingAI(true);
    
    // 1. Inyectar scripts de MediaPipe de Google
    const loadScript = (src: string) => new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = "anonymous";
      script.onload = resolve;
      document.body.appendChild(script);
    });

    await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
    await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

    // 2. Configurar la IA de Manos
    const Hands = (window as any).Hands;
    const Camera = (window as any).Camera;

    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    });

    hands.onResults((results: any) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Obtenemos la punta del dedo índice (landmark 8)
        const indexFinger = results.multiHandLandmarks[0][8];
        // Enviamos las coordenadas a Three.js
        (window as any).updateHandPosition(indexFinger.x, indexFinger.y);
      } else {
        (window as any).handLost();
      }
    });

    // 3. Iniciar la cámara
    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current! });
        },
        width: 640,
        height: 480
      });
      camera.start();
      setCameraActive(true);
      setLoadingAI(false);
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-[#050505]">
      {/* Contenedor 3D */}
      <div ref={mountRef} className="absolute inset-0 z-10" />

      {/* Video oculto para procesar la cámara */}
      <video ref={videoRef} className="hidden" playsInline />

      {/* Botón de activación y estado */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        {!cameraActive && (
          <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center max-w-md pointer-events-auto">
            <div className="mb-4">
              <span className="text-[#7000FF] text-[10px] uppercase tracking-[0.4em] font-bold">Experiencia IA</span>
            </div>
            <h3 className="text-2xl font-light mb-4 text-white">Interactúa con el entorno</h3>
            <p className="text-white/50 text-sm mb-8 font-light">
              Mueve el ratón para repeler las partículas, o activa tu cámara para controlarlas con el movimiento real de tu mano.
            </p>
            <button 
              onClick={initAI}
              disabled={loadingAI}
              className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#7000FF] hover:text-white transition-all w-full disabled:opacity-50"
            >
              {loadingAI ? 'Iniciando Red Neuronal...' : 'Activar Reconocimiento Gestual'}
            </button>
          </div>
        )}
        
        {cameraActive && (
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] tracking-widest uppercase text-white/50 font-bold">Rastreo de mano activo</span>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const t = translations[lang];

  const projects = [
    { 
      id: '01', 
      title: 'HOUSE OF KINGS', 
      category: lang === 'en' ? 'Immersive Web Experience' : 'Experiencia Web Inmersiva',
      image: 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1770931913/Remove_the_loose_4k_202602100841_ed1o70.jpg'
    },
    { 
      id: '02', 
      title: 'AMO CAFE', 
      category: lang === 'en' ? 'Sensory Brand Identity' : 'Identidad de Marca Sensorial',
      image: 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1770932056/Generate_this_image_4k_202602121532_oyxlid.jpg'
    },
    { 
      id: '03', 
      title: 'ALEXBOOTS', 
      category: lang === 'en' ? 'High-Fidelity E-Commerce' : 'E-Commerce de Alta Fidelidad',
      image: 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1770931913/A_detailed_cinematic_4k_202602091405_lnlgb5.jpg'
    },
    { 
      id: '04', 
      title: 'THECOCREATIVE HUB', 
      category: lang === 'en' ? 'Innovation Platform' : 'Plataforma de Innovación',
      image: 'https://res.cloudinary.com/dsprn0ew4/image/upload/v1770932085/A_photorealistic_wide_4k_202602121534_zixtsc.jpg'
    }
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = '+5216142857193';
    const message = lang === 'en' ? 'I want to evolve my brand!' : '¡Quiero evolucionar mi marca!';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-[#000000] text-white font-sans selection:bg-[#7000FF] selection:text-white min-h-screen relative">
      
      {/* --- GLOBAL VIDEO BACKGROUND WITH FADE-IN --- */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}  
        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }} 
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
        >
          <source src="https://res.cloudinary.com/dsprn0ew4/video/upload/v1770924915/Generate_a_cinematic_1080p_202602121329_eiuxgx.mp4" type="video/mp4" />
        </video>
        {/* Overlay para asegurar legibilidad del texto */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </motion.div>

      <div className="relative z-10">
        {/* --- NAVIGATION --- */}
        <nav className="fixed top-0 w-full z-[100] px-8 py-6 flex justify-between items-center mix-blend-difference">
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-[0.3em] cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
            >
              ZERONNE<span className="text-[#7000FF]">.</span>
            </motion.div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1">
               <button 
                 onClick={() => setLang('en')}
                 className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${lang === 'en' ? 'text-white' : 'text-white/40 hover:text-white'}`}
               >
                 EN
               </button>
               <span className="text-white/20 text-[9px]">/</span>
               <button 
                 onClick={() => setLang('es')}
                 className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${lang === 'es' ? 'text-white' : 'text-white/40 hover:text-white'}`}
               >
                 ES
               </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Botón de Pestaña de Servicios */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-[#7000FF] transition-all z-[101]"
            >
              {isMenuOpen ? t.nav.close : t.nav.services}
            </button>

            <button 
              onClick={() => setIsContactOpen(true)}
              className="hidden md:block bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#7000FF] hover:text-white transition-all"
            >
              {t.nav.contact}
            </button>
          </div>
        </nav>

        {/* --- DROPDOWN DE LOS 15 SERVICIOS (Centered Modal) --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                className="w-full max-w-5xl bg-[#0A0A0A] p-8 md:p-12 rounded-[2rem] border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 shadow-2xl shadow-[#7000FF]/20 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {t.services.list.map((service, index) => (
                  <button 
                    key={index}
                    onClick={() => { 
                      setSelectedService({
                          id: `EXP-${index + 1}`,
                          title: service, 
                          desc: lang === 'en' ? "Specialized solution by Zeronne AI Studio." : "Solución especializada por Zeronne AI Studio.",
                          detail: lang === 'en' 
                            ? "We harness the power of advanced artificial intelligence to deliver this service with maximizing efficiency and creativity. Contact us to discuss your bespoke requirements."
                            : "Aprovechamos el poder de la inteligencia artificial avanzada para ofrecer este servicio maximizando la eficiencia y la creatividad. Contáctanos para discutir tus requisitos personalizados."
                      }); 
                      setIsMenuOpen(false); 
                    }}
                    className="text-left text-[11px] uppercase tracking-tighter opacity-60 hover:opacity-100 hover:text-[#7000FF] transition-all py-2 border-b border-white/5 pb-2"
                  >
                    {service}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- CONTACT FORM MODAL --- */}
        <AnimatePresence>
          {isContactOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
              onClick={() => setIsContactOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="relative w-full max-w-2xl bg-[#0A0A0A] p-8 md:p-16 rounded-[2rem] border border-white/10 shadow-2xl shadow-[#7000FF]/10"
                onClick={(e) => e.stopPropagation()}
              >
                 <div className="absolute top-0 right-0 p-8">
                  <button 
                    onClick={() => setIsContactOpen(false)} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-10">
                  <h3 className="text-3xl font-light tracking-tight mb-2">{t.modal.start} <span className="text-[#7000FF]">{t.modal.project}</span></h3>
                  <p className="text-white/40 text-sm">{t.modal.startDesc}</p>
                </div>

               <form className="space-y-8" onSubmit={async (e: any) => {
  e.preventDefault();
  const formData = {
    name: e.target.name.value,
    email: e.target.email.value,
    projectName: e.target.projectName.value,
    description: e.target.description.value,
  };
  try {
    await fetch("https://script.google.com/macros/s/AKfycbwXwWFhbXD-7zyVhCcpfA_def8aykuX_r9DphgsIeEdWEfQg1YjER9EW25J4cmyjUSq/exec", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    alert("Your proposal has been submitted! We'll be in touch soon.");
    setIsContactOpen(false);
  } catch (error) {
    alert("Something went wrong. Please try again.");
  }
}}>
  <div className="grid md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest text-[#7000FF]">{t.modal.labelName}</label>
      <input 
        type="text"
        name="name"
        placeholder={t.contact.namePlaceholder} 
        className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light"
      />
    </div>
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest text-[#7000FF]">{t.modal.labelProject}</label>
      <input 
        type="text"
        name="projectName"
        placeholder={t.modal.projectPlaceholder} 
        className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light"
      />
    </div>
  </div>

  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-widest text-[#7000FF]">{t.modal.labelEmail}</label>
    <input 
      type="email"
      name="email"
      placeholder="name@company.com" 
      className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light" 
    />
  </div>
  
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-widest text-[#7000FF]">{t.modal.labelDesc}</label>
    <textarea 
      name="description"
      placeholder={t.contact.msgPlaceholder}
      rows={4} 
      className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light resize-none"
    ></textarea>
  </div>

  <motion.button 
    type="submit"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#7000FF] hover:text-white transition-all duration-300"
  >
    {t.modal.submitProposal}
  </motion.button>
</form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- HERO SECTION --- */}
        <section className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
          {/* Deep Glow Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#7000FF]/10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#7000FF]/5 rounded-full blur-[150px]"></div>
          </div>

          <div className="z-10 text-center relative">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.2 }}
              className="text-[12px] tracking-[0.5em] uppercase mb-4 block"
            >
              {t.hero.evolution}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[12vw] md:text-[8vw] font-bold leading-[0.85] tracking-tighter"
            >
              {t.hero.crafting} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#7000FF]">{t.hero.intelligence}</span>
            </motion.h1>

            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 1, duration: 1.5 }}
              className="h-[1px] bg-gradient-to-r from-transparent via-[#7000FF] to-transparent mt-12 max-w-4xl mx-auto"
            />
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 15, 0] }}
            transition={{ 
              opacity: { delay: 1.5, duration: 1 },
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" } 
            }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <span className="text-[9px] uppercase tracking-[0.3em] opacity-40">{t.hero.scroll}</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#7000FF] to-transparent"></div>
          </motion.div>
        </section>

        {/* --- WORK / FEATURED (VERTICAL SCROLL) --- */}
        <section id="work" className="py-20 border-b border-white/5 overflow-hidden">
           <div className="px-8 max-w-[1400px] mx-auto mb-12">
               <Reveal>
                   <div className="flex flex-col md:flex-row justify-between items-end">
                       <div>
                          <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#7000FF] mb-4">{t.work.selected}</h2>
                          <h3 className="text-4xl md:text-5xl font-light tracking-tight">{t.work.digital} <span className="italic">{t.work.frontiers}</span></h3>
                       </div>
                       <div className="hidden md:block text-[10px] tracking-widest opacity-40 uppercase">
                           2023 — 2025
                       </div>
                   </div>
               </Reveal>
           </div>
           
           <div className="relative w-full px-8 max-w-[1400px] mx-auto">
               <div className="grid grid-cols-1 gap-16 md:gap-24">
                   {projects.map((project, index) => (
                       <Reveal key={project.id}>
                           <div className="group relative w-full aspect-video md:aspect-[16/7] bg-[#080808] border border-white/5 rounded-2xl overflow-hidden cursor-pointer">
                               {/* Image Background */}
                               <img 
                                   src={project.image} 
                                   alt={project.title} 
                                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                               />
                               
                               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

                               <div className="absolute bottom-0 left-0 p-8 z-20">
                                   <div className="text-[10px] text-[#7000FF] tracking-widest mb-2">{t.work.caseStudy} {project.id}</div>
                                   <div className="text-2xl md:text-4xl font-bold uppercase tracking-tighter">{project.title}</div>
                                   <div className="text-[10px] text-white/40 tracking-widest mt-2 uppercase">{project.category}</div>
                               </div>
                           </div>
                       </Reveal>
                   ))}
               </div>

               {/* End of section text */}
               <div className="mt-24 md:mt-32 pt-20 pb-40 text-center">
                 <Reveal viewport={{ once: true, amount: 0.8 }}>
                   <p className="text-[8vw] md:text-[6vw] font-black uppercase text-[#7000FF] leading-none mb-8">
                     {t.work.anymore}
                   </p>
                 </Reveal>
                 <Reveal viewport={{ once: true, amount: 0.8 }}>
                   <p className="text-[8vw] md:text-[6vw] font-black uppercase text-[#7000FF] leading-none">
                     {t.work.partOfIt}
                   </p>
                 </Reveal>
                 {/* New "Start Project" button */}
                 <motion.button 
                   onClick={handleWhatsAppClick}
                   className="mt-16 bg-[#7000FF] text-white px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[12px] hover:shadow-[0_0_50px_rgba(112,0,255,0.4)] transition-all duration-300"
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, amount: 0.5 }}
                   transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                 >
                   {t.work.startProject}
                 </motion.button>
               </div>
           </div>
        </section>

        {/* --- 3D INTERACTIVE SCENE --- */}
        <section className="relative z-10 w-full flex justify-center py-20 px-8">
           <div className="max-w-[1400px] w-full">
               <EscenaZeronne />
           </div>
        </section>

        {/* --- SERVICES BENTO GRID --- */}
        <section id="services" className="py-32 px-8 max-w-[1400px] mx-auto">
          <Reveal>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#7000FF] mb-4">{t.services.title}</h2>
            <h3 className="text-4xl md:text-6xl font-light mb-20 tracking-tight">{t.services.subtitle} <span className="italic">{t.services.subtitleItalic}</span></h3>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {t.services.items.map((service) => (
              <motion.div 
                key={service.id}
                whileHover={{ backgroundColor: "rgba(112, 0, 255, 0.03)" }}
                onClick={() => setSelectedService(service)}
                className="group p-10 border border-white/5 bg-[#080808] rounded-[2rem] cursor-pointer transition-all duration-500 hover:border-[#7000FF]/30 hover:shadow-[0_0_30px_rgba(112,0,255,0.05)]"
              >
                <div className="text-[#7000FF] font-mono mb-12 text-sm">{service.id}</div>
                <h4 className="text-2xl font-bold mb-6 tracking-tight group-hover:text-[#7000FF] transition-colors">{service.title}</h4>
                <p className="text-white/40 font-light leading-relaxed mb-10 text-sm md:text-base">{service.desc}</p>
                <div className="flex items-center gap-3 text-[10px] tracking-widest font-bold">
                  {t.services.viewProject} <span className="w-8 h-[1px] bg-white group-hover:bg-[#7000FF] group-hover:w-12 transition-all"></span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- HOW WE WORK --- */}
        <section className="py-32 bg-white text-black rounded-[3rem] md:rounded-[4rem] relative z-10 mx-4 md:mx-8 mb-20">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-[10px] tracking-[0.5em] text-[#7000FF] mb-20 uppercase font-bold text-center">{t.blueprint.title}</h2>
            <div className="grid md:grid-cols-3 gap-16">
              <div className="border-l border-black/10 pl-6">
                <h4 className="text-3xl font-bold mb-4">{t.blueprint.strategy.title}</h4>
                <p className="opacity-70">{t.blueprint.strategy.desc}</p>
              </div>
              <div className="border-l border-black/10 pl-6">
                <h4 className="text-3xl font-bold mb-4">{t.blueprint.build.title}</h4>
                <p className="opacity-70">{t.blueprint.build.desc}</p>
              </div>
              <div className="border-l border-black/10 pl-6">
                <h4 className="text-3xl font-bold mb-4">{t.blueprint.launch.title}</h4>
                <p className="opacity-70">{t.blueprint.launch.desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- WHO WE WORK WITH (MARQUEE) --- */}
        <section className="py-24 border-t border-white/10 overflow-hidden relative z-10">
           <div className="relative w-full">
               <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
               <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

               <div className="flex whitespace-nowrap">
                 <motion.div 
                   animate={{ x: ["0%", "-50%"] }} 
                   transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                   className="flex"
                 >
                   {[1, 2].map((i) => (
                      <div key={i} className="flex gap-20 text-6xl md:text-8xl font-black opacity-20 pr-20 items-center">
                       <span>{t.marquee.small}</span> <span>{t.marquee.personal}</span> <span>{t.marquee.growth}</span> <span className="text-[#7000FF] opacity-100">{t.marquee.everyone}</span>
                     </div>
                   ))}
                 </motion.div>
               </div>
           </div>
        </section>

        {/* --- WHY ZERONNE (Interactive Growth Impact) --- */}
        <GrowthImpactSection text={t.impact} />

        {/* --- AGENCY DEFINITION --- */}
        <section className="pb-32 px-8 text-center relative z-10">
          <Reveal>
            <h3 className="text-2xl md:text-4xl font-light max-w-5xl mx-auto leading-relaxed text-white/80">
              <span className="text-[#7000FF] font-bold">ZERO ONNE</span> {t.agency.text1} <span className="text-[#7000FF] font-bold">{t.agency.text2}</span> {t.agency.text3} <span className="text-[#7000FF] font-bold">{t.agency.text4}</span> {t.agency.text5} <span className="text-[#7000FF] font-bold">{t.agency.text6}</span>.
            </h3>
          </Reveal>
        </section>

        {/* --- MODAL SYSTEM --- */}
        <AnimatePresence>
          {selectedService && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedService(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                className="bg-[#0A0A0A] p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] max-w-3xl w-full border border-white/10 relative overflow-hidden shadow-2xl shadow-[#7000FF]/10"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute top-0 right-0 p-8">
                  <button 
                    onClick={() => setSelectedService(null)} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                  >
                    ✕
                  </button>
                </div>
                <span className="text-[#7000FF] font-mono text-xs tracking-wider">{t.modal.details}</span>
                <h3 className="text-3xl md:text-5xl font-bold mt-4 mb-8 tracking-tight">{selectedService.title}</h3>
                <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-12 font-light italic border-l-2 border-[#7000FF] pl-6">
                  "{selectedService.detail}"
                </p>
                <button 
                  onClick={() => { setSelectedService(null); setIsContactOpen(true); }}
                  className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-[#7000FF] hover:text-white transition-all duration-300"
                >
                  {t.modal.enquire}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- CONTACT / LEAD CAPTURE (Bottom Section) --- */}
        <section id="contact" className="py-40 relative overflow-hidden">
          {/* Decorative background element for contact */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7000FF]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-3xl mx-auto px-8 relative z-10">
            <Reveal>
              <div className="text-center mb-20">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">{t.contact.ready} <br /><span className="italic font-light text-white/40">{t.contact.transcend}</span></h2>
                <p className="text-white/40 tracking-widest text-[10px] uppercase font-light">{t.contact.mark}</p>
              </div>
              
              <form className="space-y-6" onSubmit={async (e: any) => {
  e.preventDefault();
  const formData = {
    name: e.target.name.value,
    email: e.target.email.value,
    projectName: e.target.projectName.value,
    description: e.target.description.value,
  };
  try {
    await fetch("https://script.google.com/macros/s/AKfycbwXwWFhbXD-7zyVhCcpfA_def8aykuX_r9DphgsIeEdWEfQg1YjER9EW25J4cmyjUSq/exec", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    alert("Your proposal has been submitted! We'll be in touch soon.");
    e.target.reset();
  } catch (error) {
    alert("Something went wrong. Please try again.");
  }
}}>
  <div className="grid md:grid-cols-2 gap-6">
    <input 
      type="text"
      name="name"
      placeholder={t.contact.namePlaceholder} 
      className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light" 
    />
    <input 
      type="text"
      name="projectName"
      placeholder={t.modal.projectPlaceholder} 
      className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light" 
    />
  </div>
  <input 
    type="email"
    name="email"
    placeholder={t.contact.emailPlaceholder} 
    className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light" 
  />
  <textarea 
    name="description"
    placeholder={t.contact.msgPlaceholder}
    rows={4} 
    className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-[#7000FF] transition-colors placeholder:text-white/20 text-white font-light resize-none"
  ></textarea>
  
  <motion.button 
    type="submit"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full bg-[#7000FF] text-white py-6 rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] mt-10 hover:shadow-[0_0_50px_rgba(112,0,255,0.4)] transition-all"
  >
    {t.contact.submit}
  </motion.button>
</form>
            </Reveal>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 p-12 flex flex-col md:flex-row justify-between items-center gap-8 bg-black">
          <div className="text-[10px] tracking-[0.5em] font-bold opacity-30">ZERONNE © 2026</div>
          <div className="flex gap-8 text-[9px] tracking-widest uppercase opacity-40">
            <a href="https://instagram.com/zeronne.ai" target="_blank" rel="noopener noreferrer" className="hover:text-[#7000FF] transition-colors">Instagram</a>
            <a href="https://www.facebook.com/zeronneai/" target="_blank" rel="noopener noreferrer" className="hover:text-[#7000FF] transition-colors">Facebook</a>
            <a href="mailto:zeronne.ai@gmail.com" className="hover:text-[#7000FF] transition-colors">Email</a>
          </div>
          <div className="text-[10px] tracking-[0.2em] font-light text-white/20 italic">{t.footer.designed}</div>
        </footer>
      </div>
    </div>
  );
}
