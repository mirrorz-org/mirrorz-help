/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import { useState, useRef, useEffect } from 'react';

const TOP_OFFSET = 75;

export function getHeaderAnchors(): HTMLAnchorElement[] {
  return Array.from(document.getElementsByClassName('toc-heading-anchor') as HTMLCollectionOf<HTMLAnchorElement>);
}

/**
 * Sets up Table of Contents highlighting.
 */
export function useTocHighlight(enableTracking = true) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const updateActiveLink = () => {
      const pageHeight = document.body.scrollHeight;
      const scrollPosition = window.scrollY + window.innerHeight;
      const headersAnchors = getHeaderAnchors();

      if (scrollPosition >= 0 && scrollPosition >= pageHeight - TOP_OFFSET) {
        // Scrolled to bottom of page.
        setCurrentIndex(() => headersAnchors.length - 1);
        return;
      }

      let index = -1;
      while (index < headersAnchors.length - 1) {
        const headerAnchor = headersAnchors[index + 1];
        const { top } = headerAnchor.getBoundingClientRect();

        if (top >= TOP_OFFSET) {
          break;
        }
        index += 1;
      }

      setCurrentIndex(() => (index > 0 ? index : 0));
    };

    const throttledUpdateActiveLink = () => {
      if (timeoutRef.current === null) {
        timeoutRef.current = window.setTimeout(() => {
          timeoutRef.current = null;
          updateActiveLink();
        }, 100);
      }
    };

    if (enableTracking) {
      document.addEventListener('scroll', throttledUpdateActiveLink);
      document.addEventListener('resize', throttledUpdateActiveLink);

      updateActiveLink();

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        document.removeEventListener('scroll', throttledUpdateActiveLink);
        document.removeEventListener('resize', throttledUpdateActiveLink);
      };
    }
  }, [enableTracking]);

  return currentIndex;
}
