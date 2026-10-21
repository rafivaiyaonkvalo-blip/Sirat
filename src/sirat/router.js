import { useEffect, useState } from 'react';

// হ্যাশ রাউটার: /sirat/#/dars/3/2 — রিভার্স প্রক্সির সাবপাথেও নিরাপদ
const read = () => window.location.hash.replace(/^#/, '') || '/';

export function useRoute() {
  const [path, setPath] = useState(read);
  useEffect(() => {
    const on = () => {
      setPath(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return path;
}

export const href = (path) => `#${path}`;
