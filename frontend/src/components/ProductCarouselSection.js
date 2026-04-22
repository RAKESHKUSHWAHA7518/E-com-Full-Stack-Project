import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { AnimatePresence, motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import ProductCard, { CARD_TONE_COUNT } from './ProductCard'
import ProductQuickViewModal from './ProductQuickViewModal'

const loadingList = new Array(6).fill(null)
const scrollAmount = 344

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const ProductCardSkeleton = ({ index }) => (
  <div
    className={`product-card-frame product-card-tone-${
      index % CARD_TONE_COUNT
    }`}
  >
    <div className="product-card product-card-skeleton">
      <div className="product-card-skeleton-media" />
      <div className="product-card-skeleton-content">
        <div className="product-card-skeleton-line" />
        <div className="product-card-skeleton-line product-card-skeleton-line-sm" />
        <div className="product-card-skeleton-row">
          <div className="product-card-skeleton-line" />
          <div className="product-card-skeleton-line" />
        </div>
        <div className="product-card-skeleton-button" />
      </div>
    </div>
  </div>
)

const ProductCarouselSection = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleItemCount, setVisibleItemCount] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  const scrollElement = useRef(null)
  const { fetchUserAddToCart } = useContext(Context)
  const [sectionRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const totalPages =
    visibleItemCount > 0 ? Math.ceil(data.length / visibleItemCount) : 0

  const updateVisibleItemCount = useCallback(() => {
    const containerWidth = scrollElement.current?.clientWidth || 0
    const count = Math.floor(containerWidth / scrollAmount)
    setVisibleItemCount(count > 0 ? count : 1)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setData(categoryProduct?.data || [])
      } catch (error) {
        console.error('Error fetching products', error)
        setData([])
      } finally {
        setLoading(false)
        requestAnimationFrame(updateVisibleItemCount)
      }
    }

    fetchData()
    setActiveIndex(0)
  }, [category, updateVisibleItemCount])

  useEffect(() => {
    updateVisibleItemCount()
    window.addEventListener('resize', updateVisibleItemCount)

    return () => window.removeEventListener('resize', updateVisibleItemCount)
  }, [updateVisibleItemCount])

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart?.()
  }

  const scrollToIndex = useCallback((index) => {
    if (!scrollElement.current) return

    const maxIndex = Math.max(data.length - visibleItemCount, 0)
    const nextIndex = Math.max(0, Math.min(index, maxIndex))

    setActiveIndex(nextIndex)
    scrollElement.current.scrollTo({
      left: nextIndex * scrollAmount,
      behavior: 'smooth',
    })
  }, [data.length, visibleItemCount])

  const scrollRight = useCallback(() => {
    const maxIndex = Math.max(data.length - visibleItemCount, 0)
    scrollToIndex(activeIndex >= maxIndex ? 0 : activeIndex + 1)
  }, [activeIndex, data.length, scrollToIndex, visibleItemCount])

  const scrollLeft = useCallback(() => {
    const maxIndex = Math.max(data.length - visibleItemCount, 0)
    scrollToIndex(activeIndex <= 0 ? maxIndex : activeIndex - 1)
  }, [activeIndex, data.length, scrollToIndex, visibleItemCount])

  useEffect(() => {
    let intervalId

    if (inView && data.length > visibleItemCount) {
      intervalId = setInterval(scrollRight, 6000)
    }

    return () => clearInterval(intervalId)
  }, [inView, data.length, visibleItemCount, scrollRight])

  return (
    <section className="product-section" ref={sectionRef}>
      <div className="product-section-header">
        <h2 className="product-section-title">{heading}</h2>

        <div className="product-section-actions">
          <button
            type="button"
            className="product-scroll-button"
            onClick={scrollLeft}
            aria-label="Scroll products left"
          >
            <FaAngleLeft />
          </button>
          <button
            type="button"
            className="product-scroll-button"
            onClick={scrollRight}
            aria-label="Scroll products right"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>

      <motion.div
        className="product-carousel"
        ref={scrollElement}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <AnimatePresence>
          {loading
            ? loadingList.map((_, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  exit={{ opacity: 0 }}
                >
                  <ProductCardSkeleton index={index} />
                </motion.div>
              ))
            : data.map((product, index) => (
                <motion.div
                  key={product?._id}
                  variants={itemVariants}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard
                    product={product}
                    index={index}
                    showBadge={index < 2}
                    onAddToCart={handleAddToCart}
                    onQuickView={setQuickViewProduct}
                  />
                </motion.div>
              ))}
        </AnimatePresence>
      </motion.div>

      {!loading && totalPages > 1 && (
        <div className="product-pagination">
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const isActive =
              Math.floor(activeIndex / visibleItemCount) === pageIndex

            return (
              <button
                key={pageIndex}
                type="button"
                className={`product-pagination-dot ${
                  isActive ? 'product-pagination-dot-active' : ''
                }`}
                onClick={() => scrollToIndex(pageIndex * visibleItemCount)}
                aria-label={`Go to product page ${pageIndex + 1}`}
              />
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {quickViewProduct && (
          <ProductQuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProductCarouselSection
