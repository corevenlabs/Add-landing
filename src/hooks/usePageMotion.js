import { useLayoutEffect } from 'react';
import { createRevealMotion } from '../utils/revealMotion';

export function usePageMotion(ref, pathname) {
  useLayoutEffect(() => {
    if (ref.current) return createRevealMotion(ref.current);
  }, [ref, pathname]);
}
