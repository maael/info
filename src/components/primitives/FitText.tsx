import * as React from 'react'
import { Textfit } from 'react-textfit'

const FitText: React.FC<React.ComponentProps<typeof Textfit>> = ({ children, max, ...props }) => (
  <Textfit forceSingleModeWidth={true} mode="single" max={max ?? 75} {...props}>
    {children}
  </Textfit>
)

export default FitText
