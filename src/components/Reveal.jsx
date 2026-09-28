import { motion, useReducedMotion } from 'framer-motion'

// Wrapper de revelação ao entrar na viewport (fade + slide), reutilizado em
// todas as seções. Respeita `prefers-reduced-motion` automaticamente.
export default function Reveal({
  as = 'div',
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
  amount = 0.3,
  ...rest
}) {
  const reduceMotion = useReducedMotion()
  const Component = typeof as === 'string' ? motion[as] : as

  return (
    <Component
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Component>
  )
}
