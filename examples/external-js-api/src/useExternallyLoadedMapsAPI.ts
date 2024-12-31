import {useEffect, useRef, useState} from 'react';

/**
 * Simple hook to load an external Maps API script and check if it is loaded.
 * @param {String} url - URL of the script to load.
 */
export function useExternallyLoadedMapsAPI(url: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (scriptRef.current?.src !== url) {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Validate if google.maps.importLibrary is loaded,
        // it is not enough to check if window.google is loaded.maps
        intervalRef.current = setInterval(() => {
          if (window.google?.maps?.importLibrary as unknown) {
            clearInterval(intervalRef.current as unknown as number);
            setIsLoaded(true);
          }
        }, 10);
      };

      scriptRef.current = script;
      document.head.appendChild(script);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as unknown as number);
      }
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, [url]);

  return isLoaded;
}
