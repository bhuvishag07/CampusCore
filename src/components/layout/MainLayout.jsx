import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconRail } from './IconRail';
import { TopBar } from './TopBar';
import { MobileDrawer } from './MobileDrawer';
import styles from './Layout.module.css';

export const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className={styles.pageWrapper}>
      {/* Background Gradient Blobs */}
      <div className="app-background-blobs" aria-hidden="true">
        <div className="app-blob app-blob-lavender" />
        <div className="app-blob app-blob-blue" />
        <div className="app-blob app-blob-pink" />
      </div>

      {/* Main Glass Portal Container */}
      <div className={styles.portalContainer}>
        {/* Floating Icon Rail (Left) */}
        <IconRail />

        {/* Mobile Navigation Drawer */}
        <MobileDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Central Content Area */}
        <div className={styles.mainContentArea}>
          {/* Frosted Glass Top Navigation */}
          <TopBar onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

          {/* Dynamic Animated Route Content */}
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{ width: '100%', flex: 1 }}
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
