import { validatedProduct } from "../interfaces/interfaces"
import styles from '../css/ProductCard.module.css'
import validIcon from '../assets/v_icon.jpg';
import invalidIcon from '../assets/x_icon.jpg';

function ProductCard({ product }: { product: validatedProduct }) {
  return (
    <div className={ styles.product }>
      <div className={ `${styles.productCategory} ${styles.code}` }>
        <span className={ styles.category }>Cód. </span>
        <span>{product.product_code.length ? product.product_code : '-'}</span>
      </div>
      <div className={ `${styles.productCategory} ${styles.name}` }>
        <p className={ styles.category }>Produto</p>
        <p>{product.name ?? '-'}</p>
      </div>
      <div className={ styles.prices }>
        <div className={ styles.productCategory }>
          <p className={ styles.category }>Preço atual</p>
          <p>{product.current_price ? 'R$ ' + parseFloat(product.current_price).toFixed(2) : '-'}</p>
        </div>
        <div className={ styles.productCategory }>
          <p className={ styles.category }>Novo preço</p>
          <p>{product.new_price.length ? 'R$ ' + parseFloat(product.new_price).toFixed(2) : '-'}</p>
        </div>
      </div>
      <div className={ `${product.error ? styles.messageInvalid : styles.messageValid} ${styles.message}` }>{product.error
      ? (
        <div className={ styles.messageDiv }>
          <img className={ styles.icon } src={ invalidIcon } alt="check icon" />
          {product.error}
        </div>
      )
      : (
        <div className={ styles.messageDiv }>
          <img className={ styles.icon } src={ validIcon } alt="check icon" />
          Reajuste válido
        </div>
      )}</div>
    </div>
  )
}

export default ProductCard