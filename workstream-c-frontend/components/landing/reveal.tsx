"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"

const EASE_SIGNAL = [0.2, 0, 0, 1] as const

/**
 * Scroll-triggered reveal: slide-fade in with --ease-signal when the element
 * enters the viewport. Collapses to a plain fade-none under reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, delay, ease: EASE_SIGNAL }}
    >
      {children}
    </motion.div>
  )
}

/** Parent/child pair for staggered lists of reveals. */
export function RevealGroup({
  children,
  className,
  stagger = 0.14,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-64px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  const variants: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE_SIGNAL },
        },
      }
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
}
