// Splash Screen Component

import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
    const { setCurrentScreen } = useApp();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animate progress bar
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 40);

        // Navigate to login screen after animation
        const timer = setTimeout(() => {
            setCurrentScreen('login');
        }, 2500);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [setCurrentScreen]);

    return (
        <div className="app-container" style={styles.container}>
            <div style={styles.content}>
                {/* Logo */}
                <div style={styles.logoContainer}>
                    <div style={styles.logoIcon}>
                        <Zap size={48} color="#2563EB" fill="#2563EB" />
                    </div>
                </div>

                {/* Brand Name */}
                <h1 style={styles.brandName}>
                    <span>F</span>
                    <span className="relative inline-block">
                        ı
                        <motion.div
                            className="absolute bg-current rounded-full"
                            style={{
                                width: '0.15em',
                                height: '0.15em',
                                left: '65%',
                                bottom: '0.75em',
                                transform: 'translateX(-50%)'
                            }}
                            animate={{
                                y: [0, -20, 0],
                                scaleY: [1, 0.7, 1.2, 1]
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </span>
                    <span>nTrack</span>
                </h1>

                {/* Loading Bar */}
                <div style={styles.loadingBar}>
                    <div
                        style={{
                            ...styles.loadingProgress,
                            width: `${progress}%`
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        padding: '2rem'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
    },
    logoContainer: {
        width: '100px',
        height: '100px',
        borderRadius: '32px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(37, 99, 235, 0.1)',
        animation: 'pulse 2s ease-in-out infinite'
    },
    logoIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    brandName: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#1F2937',
        margin: '0'
    },
    brandItalic: {
        fontStyle: 'italic'
    },
    loadingBar: {
        width: '200px',
        height: '4px',
        backgroundColor: '#E5E7EB',
        borderRadius: '9999px',
        overflow: 'hidden',
        marginTop: '2rem'
    },
    loadingProgress: {
        height: '100%',
        backgroundColor: '#2563EB',
        borderRadius: '9999px',
        transition: 'width 0.1s ease'
    }
};

export default SplashScreen;
