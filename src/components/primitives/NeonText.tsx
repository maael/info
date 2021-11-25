import React from 'react'
import cls from 'classnames'

export default function NeonText({
  Element,
  children,
  className,
  ...props
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
React.HTMLProps<HTMLElement> & { Element: any }) {
  return (
    <Element
      {...props}
      className={cls(className, 'neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600')}
    >
      {children?.toString().replace(/ /g, ' ')}
    </Element>
  )
}
