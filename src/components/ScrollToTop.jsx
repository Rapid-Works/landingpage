import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Force scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Changed from default smooth behavior
    })
  }, [pathname]) // This will run on every route change

  return null
}

export default ScrollToTop 