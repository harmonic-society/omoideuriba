'use client'

import { CartItem } from '@/lib/store/cart'

interface OrderSummaryProps {
  items: CartItem[]
  shippingFee: number
  showTitle?: boolean
}

export default function OrderSummary({ items, shippingFee, showTitle = true }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + shippingFee

  return (
    <div className="card-retro">
      {showTitle && (
        <h2 className="text-2xl font-bold text-vintage-brown mb-6 font-pixel">
          注文サマリー
        </h2>
      )}

      {/* 商品リスト */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            {/* 商品画像 */}
            <div className="w-20 h-20 flex-shrink-0">
              {item.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-retro border-2 border-vintage-brown"
                />
              ) : (
                <div className="w-full h-full bg-vintage-brown/10 rounded-retro border-2 border-vintage-brown flex items-center justify-center text-2xl">
                  📦
                </div>
              )}
            </div>

            {/* 商品情報 */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-vintage-brown truncate">
                {item.name}
              </h3>
              <p className="text-sm text-vintage-brown/70">
                数量: {item.quantity}
              </p>
              <p className="font-bold text-retro-pink">
                ¥{item.price.toLocaleString()} × {item.quantity}
              </p>
            </div>

            {/* 小計 */}
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-vintage-brown">
                ¥{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-vintage-brown pt-4 space-y-2">
        {/* 小計 */}
        <div className="flex justify-between text-vintage-brown">
          <span>小計</span>
          <span className="font-bold">¥{subtotal.toLocaleString()}</span>
        </div>

        {/* 送料 */}
        <div className="flex justify-between text-vintage-brown">
          <span>送料</span>
          <span className="font-bold">
            {shippingFee === 0 ? '無料' : `¥${shippingFee.toLocaleString()}`}
          </span>
        </div>

        {/* 合計 */}
        <div className="flex justify-between text-xl font-bold text-vintage-brown border-t-2 border-vintage-brown pt-4 mt-4">
          <span>合計</span>
          <span className="text-retro-pink">¥{total.toLocaleString()}</span>
        </div>
      </div>

      {/* 注意事項 */}
      <div className="mt-6 p-4 bg-retro-yellow/20 border-2 border-vintage-brown rounded-retro">
        <p className="text-sm text-vintage-brown">
          💡 お支払いはPayPalで安全に行われます
        </p>
      </div>
    </div>
  )
}
