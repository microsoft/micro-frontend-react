import { useEffect } from 'react';

export function usePageTitle(title: string): void {
  useEffect(() => {
    window.document.title = title;
  }, [title]);
}
