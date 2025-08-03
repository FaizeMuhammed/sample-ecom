'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Zap, 
  Star, 
  Rocket, 
  Trophy,
  ChevronRight,
  Gift,
  Heart,
  Users,
  Shield,
  Home,
  Settings,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar
} from 'lucide-react';

export default function InaugurationPage() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchPhase, setLaunchPhase] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize Three.js background animation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadThreeJS = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        initThreeJS();
      };
      document.head.appendChild(script);
    };

    const initThreeJS = () => {
      if (!window.THREE || !sceneRef.current) return;

      const scene = new window.THREE.Scene();
      const camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      sceneRef.current.appendChild(renderer.domElement);

      // Create floating particles
      const particles = [];
      const particleCount = 80;
      
      for (let i = 0; i < particleCount; i++) {
        const geometry = new window.THREE.SphereGeometry(0.02, 8, 8);
        const material = new window.THREE.MeshBasicMaterial({ 
          color: new window.THREE.Color().setHSL((i / particleCount) * 0.6 + 0.4, 0.8, 0.5),
          transparent: true,
          opacity: 0.7
        });
        
        const particle = new window.THREE.Mesh(geometry, material);
        
        particle.position.set(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        );
        
        particle.userData = {
          velocity: new window.THREE.Vector3(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
          ),
          originalPosition: particle.position.clone(),
          phase: Math.random() * Math.PI * 2
        };
        
        scene.add(particle);
        particles.push(particle);
      }

      // Create celebration particles for launch
      const celebrationParticles = [];
      
      const createCelebrationParticles = () => {
        for (let i = 0; i < 200; i++) {
          const geometry = new window.THREE.SphereGeometry(0.03, 8, 8);
          const material = new window.THREE.MeshBasicMaterial({ 
            color: new window.THREE.Color().setHSL(Math.random(), 0.9, 0.7),
            transparent: true,
            opacity: 1
          });
          
          const particle = new window.THREE.Mesh(geometry, material);
          
          particle.position.set(0, 0, 0);
          particle.userData = {
            velocity: new window.THREE.Vector3(
              (Math.random() - 0.5) * 0.2,
              Math.random() * 0.15,
              (Math.random() - 0.5) * 0.1
            ),
            life: 1.0,
            decay: 0.01 + Math.random() * 0.01
          };
          
          scene.add(particle);
          celebrationParticles.push(particle);
        }
      };

      camera.position.z = 10;
      
      cameraRef.current = camera;
      rendererRef.current = renderer;
      sceneRef.current.particles = particles;
      sceneRef.current.celebrationParticles = celebrationParticles;
      sceneRef.current.createCelebrationParticles = createCelebrationParticles;

      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // Animate floating particles
        particles.forEach((particle, index) => {
          const { velocity, originalPosition, phase } = particle.userData;
          
          // Gentle floating motion
          particle.position.x = originalPosition.x + Math.sin(time * 0.5 + phase) * 0.5;
          particle.position.y = originalPosition.y + Math.cos(time * 0.3 + phase) * 0.3;
          particle.position.z = originalPosition.z + Math.sin(time * 0.4 + phase) * 0.2;
          
          particle.rotation.x += 0.005;
          particle.rotation.y += 0.005;
          
          // Pulsing opacity
          particle.material.opacity = 0.2 + 0.2 * Math.sin(time * 2 + phase);
          
          // Rainbow effect during launch
          if (isLaunching) {
            const hue = (time * 0.2 + index * 0.05) % 1;
            particle.material.color.setHSL(hue, 0.8, 0.7);
            particle.material.opacity = 0.8;
          }
        });

        // Animate celebration particles
        celebrationParticles.forEach((particle, index) => {
          const { velocity, life, decay } = particle.userData;
          
          particle.position.add(velocity);
          velocity.y -= 0.003; // Gravity
          
          particle.userData.life -= decay;
          particle.material.opacity = Math.max(0, particle.userData.life);
          
          if (particle.userData.life <= 0) {
            particle.position.set(0, 0, 0);
            particle.userData.life = 1.0;
            particle.userData.velocity.set(
              (Math.random() - 0.5) * 0.2,
              Math.random() * 0.15,
              (Math.random() - 0.5) * 0.1
            );
          }
        });

        // Mouse interaction
        camera.position.x += (mousePosition.x * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mousePosition.y * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = window.innerWidth / window.innerHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    loadThreeJS();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, isLaunching]);

  const handleLaunch = () => {
    setIsLaunching(true);
    
    // Trigger celebration particles
    if (sceneRef.current?.createCelebrationParticles) {
      sceneRef.current.createCelebrationParticles();
    }
    
    // Launch sequence
    setTimeout(() => setLaunchPhase(1), 500);
    setTimeout(() => setLaunchPhase(2), 1500);
    setTimeout(() => setLaunchPhase(3), 2500);
    setTimeout(() => {
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.href = 'https://ableautomation.in';
      }, 2000);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-teal-50 relative overflow-hidden">
      {/* Enhanced Animations & Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(20, 184, 166, 0.4), 0 0 40px rgba(59, 130, 246, 0.2);
            filter: brightness(1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(20, 184, 166, 0.8), 0 0 80px rgba(59, 130, 246, 0.4);
            filter: brightness(1.2);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; opacity: 0; }
          50% { opacity: 1; }
          100% { background-position: 200% 0; opacity: 0; }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-20px); }
          70% { transform: translateY(-10px); }
        }
        
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .float { animation: float 4s ease-in-out infinite; }
        .glow { animation: glow 3s ease-in-out infinite; }
        .shimmer { 
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        .slide-in-up { animation: slideInUp 0.8s ease-out forwards; }
        .slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
        .slide-in-right { animation: slideInRight 0.8s ease-out forwards; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        .bounce { animation: bounce 2s infinite; }
        .sparkle { animation: sparkle 2s ease-in-out infinite; }
        .gradient-shift {
          background: linear-gradient(-45deg, #ffffff, #f8fafc, #e0f2fe, #ecfdf5);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        
        .text-shadow {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        /* Floating stars background */
        .star-field {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .star {
          position: absolute;
          background: linear-gradient(45deg, #14b8a6, #3b82f6);
          border-radius: 50%;
          animation: sparkle 3s ease-in-out infinite;
        }
        
        /* Launch phase animations */
        .launch-phase-1 { animation: slideInUp 0.8s ease-out forwards; }
        .launch-phase-2 { animation: bounce 1s ease-out forwards; }
        .launch-phase-3 { animation: pulse 1s ease-out forwards; }
      `}</style>

      {/* Three.js Background */}
      <div 
        ref={sceneRef} 
        className="absolute inset-0 z-0"
        style={{ pointerEvents: 'none' }}
      />

      {/* Animated Background */}
      <div className="absolute inset-0 gradient-shift opacity-90" />
      
      {/* Floating Stars */}
      <div className="star-field">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 slide-in-left">
              <div className="relative">
                <img 
                  src="/Screenshot_2025-08-01_232030-removebg-preview.png" 
                  alt="Able Automation" 
                  className="h-19 w-auto object-contain glow"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-40 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg items-center justify-center text-white font-bold text-lg glow">
                  Able Automation
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-5 h-5 text-yellow-500 sparkle" />
                </div>
              </div>
              
            </div>
            
            <div className="flex items-center space-x-6 text-gray-700 slide-in-right">
              <div className="hidden md:flex items-center space-x-2 bg-teal-50 rounded-lg p-2 border border-teal-200">
                <Phone className="w-4 h-4 text-teal-600" />
                <span className="text-sm">+91 9072206030</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2 bg-blue-50 rounded-lg p-2 border border-blue-200">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-sm">info@ableautomation.net</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2 bg-green-50 rounded-lg p-2 border border-green-200">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm">Amala Nagar ,Thrissur- Kerala</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          
          {/* Hero Section */}
          <section className="space-y-8">
            <div className="space-y-6 slide-in-up">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Trophy className="w-12 h-12 text-yellow-500 float" />
                <h1 className="text-5xl md:text-7xl font-bold text-gray-800 text-shadow">
                  <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                    Grand
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Inauguration
                  </span>
                </h1>
                <Trophy className="w-12 h-12 text-yellow-500 float" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative">
                <p className="text-2xl md:text-3xl text-gray-700 font-semibold text-shadow">
                  🎉 Welcome to the Future of Smart Automation 🎉
                </p>
                <div className="absolute inset-0 shimmer rounded-lg" />
              </div>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Today marks a revolutionary milestone in smart home and business automation. 
                We are unveiling our comprehensive digital platform featuring cutting-edge solutions 
                that will transform how you interact with your spaces.
              </p>
            </div>

            {/* Date & Time */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-teal-200 shadow-lg max-w-md mx-auto slide-in-up glow">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <Calendar className="w-6 h-6 text-teal-600" />
                <span className="text-gray-800 font-semibold text-lg">Launch Day</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center justify-center space-x-2 text-teal-600">
                <Clock className="w-4 h-4" />
                <span>Digital Platform Launch</span>
              </div>
            </div>
          </section>

          {/* Features Showcase */}
          <section className="slide-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-shadow">
              Revolutionary Solutions Await
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: Home, 
                  title: "Smart Home Systems", 
                  desc: "Complete automation with IoT integration",
                  color: "from-blue-500 to-blue-600",
                  delay: "0s"
                },
                { 
                  icon: Shield, 
                  title: "Advanced Security", 
                  desc: "Digital locks & access control systems",
                  color: "from-green-500 to-green-600",
                  delay: "0.1s"
                },
                { 
                  icon: Settings, 
                  title: "Automation Control", 
                  desc: "Rolling shutters & gate automation",
                  color: "from-purple-500 to-purple-600",
                  delay: "0.2s"
                },
                { 
                  icon: Users, 
                  title: "Expert Support", 
                  desc: "20+  technicians ready",
                  color: "from-orange-500 to-orange-600",
                  delay: "0.3s"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg card-hover float"
                  style={{ animationDelay: feature.delay, animationDuration: `${4 + index}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 glow`}>
                    {React.createElement(feature.icon, {
                      className: "w-8 h-8 text-white"
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 text-shadow">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Company Stats */}
          <section className="slide-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-lg glow">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-shadow">Trusted Excellence</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { number: "4000+", label: "Happy Customers", icon: Heart, color: "text-red-500" },
                  { number: "10+", label: "Years Experience", icon: Award, color: "text-yellow-500" },
                  { number: "20+", label: "Expert Technicians", icon: Users, color: "text-blue-500" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      {React.createElement(stat.icon, {
                        className: `w-8 h-8 ${stat.color} pulse`
                      })}
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Launch Animation Messages */}
          {isLaunching && (
            <section className="space-y-6">
              {launchPhase >= 1 && (
                <div className="text-4xl font-bold text-yellow-600 launch-phase-1 text-shadow">
                  🎊 Igniting Innovation! 🎊
                </div>
              )}
              {launchPhase >= 2 && (
                <div className="text-3xl font-bold text-teal-600 launch-phase-2 text-shadow">
                  ✨ Transforming Dreams into Smart Reality ✨
                </div>
              )}
              {launchPhase >= 3 && (
                <div className="text-2xl font-bold text-purple-600 launch-phase-3 text-shadow">
                  🚀 Welcome to the Future! 🚀
                </div>
              )}
            </section>
          )}

          {/* Launch Button */}
          {!isLaunching && !isRedirecting && (
            <section className="slide-in-up" style={{ animationDelay: '0.7s' }}>
              <button
                onClick={handleLaunch}
                className="group relative bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 text-white font-bold py-6 px-12 rounded-2xl text-2xl shadow-2xl transform hover:scale-110 transition-all duration-500 glow pulse"
              >
                <div className="flex items-center space-x-4">
                  <Gift className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-shadow">🎉 Launch Website 🎉</span>
                  <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
                
                {/* Button effects */}
                <div className="absolute inset-0 shimmer rounded-2xl" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-yellow-300 sparkle" />
                </div>
                <div className="absolute -bottom-2 -left-2">
                  <Star className="w-6 h-6 text-pink-300 sparkle" style={{ animationDelay: '1s' }} />
                </div>
              </button>
            </section>
          )}

          {/* Redirect Screen */}
          {isRedirecting && (
            <div className="fixed inset-0 bg-gradient-to-br from-white via-teal-50 to-blue-50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="text-center space-y-8 max-w-lg">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto glow pulse">
                    <Rocket className="w-16 h-16 text-white bounce" />
                  </div>
                  <div className="absolute inset-0 shimmer rounded-full" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-gray-800 text-shadow">Taking You to Our World!</h2>
                  <p className="text-xl text-teal-600">Redirecting to ableautomation.in...</p>
                </div>
                
                <div className="relative w-80 h-3 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 rounded-full animate-pulse" 
                       style={{ width: '100%' }} />
                  <div className="absolute inset-0 shimmer rounded-full" />
                </div>
                
                <div className="text-gray-600">
                  🚀 Prepare for an amazing experience! 🚀
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="relative z-20 mt-16 text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 text-gray-600">
            <Heart className="w-5 h-5 text-red-500 pulse" />
            <span className="text-lg">Pioneering Smart Solutions </span>
            <Heart className="w-5 h-5 text-red-500 pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
        </footer>
      </main>
    </div>
  );
}