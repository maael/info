import * as React from 'react'
import c from 'classnames'

export default function ScrollingText({
  children,
  className,
  timingCount = 20,
  ...props
}: React.PropsWithChildren<React.HTMLProps<HTMLDivElement> & { timingCount?: number }>) {
  const divRef = React.useRef<HTMLDivElement>(null)
  const textRef = React.useRef<HTMLDivElement>(null)
  const windowWidthRef = React.useRef<number | null>(null)
  const [isScroll, setIsScroll] = React.useState(false)
  const [width, setWidth] = React.useState(0)
  const content = `${children || 'Info'}`
  React.useEffect(() => {
    if (typeof window !== 'undefined' && typeof content === 'string' && divRef.current && textRef.current) {
      const width = textRef.current?.clientWidth
      const currentWindowWidth = window.innerWidth
      windowWidthRef.current = currentWindowWidth
      setWidth(width)
      if (width > currentWindowWidth) {
        setIsScroll(true)
      } else {
        setIsScroll(false)
      }
    }
  }, [content])
  const duration = Math.max(timingCount * 0.5, 10)
  return (
    <>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0px);
          }
          30% {
            transform: translateX(0px);
          }
          90% {
            transform: translateX(calc(-200% - 1rem));
          }
          100% {
            transform: translateX(calc(-200% - 1rem));
          }
        }
        @keyframes swap {
          0% {
            opacity: 0;
          }
          88% {
            opacity: 0;
          }
          89% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          91% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
        div.scrolling div.scrollable {
          animation: scroll ${duration}s linear infinite;
          animation-fill-mode: forwards;
        }
        div.scrolling div.delayed {
          animation-delay: ${(duration / 100) * 2}s;
        }
      `}</style>
      <div {...props} ref={divRef} className={c(className, 'flex flex-row', { scrolling: isScroll })}>
        <div ref={textRef} className="scrollable" data-content={content}>
          {content}
        </div>
        {isScroll ? (
          <div className="scrollable delayed" style={{ marginLeft: `calc(${width}px + 1rem)` }} data-content={content}>
            {content}
          </div>
        ) : null}
      </div>
    </>
  )
}
