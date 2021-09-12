import * as React from 'react'
let cachedCavas

function getTextWidth(text: string, el: HTMLElement | null) {
  const font = getCanvasFontSize(el ? el : undefined)
  cachedCavas = cachedCavas || document.createElement('canvas')
  const context = cachedCavas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}

function getCssStyle(element: Element, prop: string) {
  return window.getComputedStyle(element, null).getPropertyValue(prop)
}

function getCanvasFontSize(el: HTMLElement = document.body) {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal'
  const fontSize = getCssStyle(el, 'font-size') || '16px'
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman'

  return `${fontWeight} ${fontSize} ${fontFamily}`
}

export default function ScrollingText({
  children,
  className,
  ...props
}: React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>) {
  const divRef = React.useRef<HTMLDivElement>(null)
  const animationRef = React.useRef<number | null>(null)
  const windowWidthRef = React.useRef<number | null>(null)
  const [isScroll, setIsScroll] = React.useState(false)
  const [width, setWidth] = React.useState(0)
  const content = `${children || 'Info'}`
  React.useEffect(() => {
    if (typeof window !== 'undefined' && typeof content === 'string' && divRef) {
      const width = getTextWidth(`${content}⠀`, divRef.current)
      const currentWindowWidth = window.innerWidth
      windowWidthRef.current = currentWindowWidth
      if (width > currentWindowWidth) {
        setIsScroll(true)
        setWidth(width)
      } else {
        setIsScroll(false)
      }
    }
  }, [content])
  function animate(_time: number) {
    if (divRef.current) {
      const left = parseFloat(divRef.current.style.left)
      if (!isNaN(left) && left < -width) {
        divRef.current.style.left = `${windowWidthRef.current}px`
      } else {
        divRef.current.style.left = `${(left || 0) - width / 800}px`
      }
    }
    animationRef.current = requestAnimationFrame(animate)
  }
  React.useEffect(() => {
    const refValue = divRef.current
    if (isScroll) {
      animationRef.current = requestAnimationFrame(animate)
    } else if (divRef.current) {
      divRef.current.style.left = `0px`
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      if (refValue) {
        refValue.style.left = `0px`
      }
    }
  }, [isScroll, width, animate])
  return (
    <div {...props} ref={divRef} className={className} data-content={content}>
      {content}
    </div>
  )
}
