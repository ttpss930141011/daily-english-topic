import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      filter: 'blur(10px)',
    },
    in: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    out: {
      opacity: 0,
      scale: 1.02,
      filter: 'blur(10px)',
    }
  }
  
  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.6
  }
  
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </Head>
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{ position: 'relative' }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </>
  )
}