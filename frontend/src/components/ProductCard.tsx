import { validatedProduct } from "../interfaces/interfaces"

function ProductCard({ product }: { product: validatedProduct }) {
  return (
    <div style={ { border: '1px solid black'} }>
      <p>Código do produto: {product.product_code.length ? product.product_code : '-'}</p>
      <p>Produto: {product.name ?? '-'}</p>
      <p>Preço atual: {product.current_price ?? '-'}</p>
      <p>Novo preço: {product.new_price.length ? product.new_price : '-'}</p>
      <p>{product.error ?? 'V'}</p>
    </div>
  )
}

export default ProductCard