import { useRef, useEffect, useCallback } from "react";

export const useInfiniteScroll = (
  targetRef: React.MutableRefObject<HTMLElement | null>,
  options: IntersectionObserverInit,
  getData: () => void,
  isFetching: false
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isFetching) {
          getData();
        }
      });
    },
    [getData]
  );

  useEffect(() => {
    if (targetRef.current) {
      observer.current = new IntersectionObserver(handleIntersection, options);
      observer.current.observe(targetRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [targetRef, handleIntersection, options]);

  return observer;
};
