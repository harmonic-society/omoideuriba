import { prisma } from './prisma'

export interface StockCheckResult {
  productId: string
  available: boolean
  currentStock: number
  requestedQuantity: number
  message?: string
}

/**
 * 単一商品の在庫を確認
 */
export async function checkStock(
  productId: string,
  quantity: number
): Promise<StockCheckResult> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, stock: true, name: true, isActive: true },
  })

  if (!product) {
    return {
      productId,
      available: false,
      currentStock: 0,
      requestedQuantity: quantity,
      message: '商品が見つかりません',
    }
  }

  if (!product.isActive) {
    return {
      productId,
      available: false,
      currentStock: product.stock,
      requestedQuantity: quantity,
      message: 'この商品は現在販売していません',
    }
  }

  if (product.stock < quantity) {
    return {
      productId,
      available: false,
      currentStock: product.stock,
      requestedQuantity: quantity,
      message: `在庫が不足しています（在庫: ${product.stock}個）`,
    }
  }

  return {
    productId,
    available: true,
    currentStock: product.stock,
    requestedQuantity: quantity,
  }
}

/**
 * 複数商品の在庫を一括確認
 */
export async function checkMultipleStock(
  items: Array<{ productId: string; quantity: number }>
): Promise<{
  allAvailable: boolean
  results: StockCheckResult[]
  unavailableProducts: StockCheckResult[]
}> {
  const results = await Promise.all(
    items.map(item => checkStock(item.productId, item.quantity))
  )

  const unavailableProducts = results.filter(r => !r.available)

  return {
    allAvailable: unavailableProducts.length === 0,
    results,
    unavailableProducts,
  }
}

/**
 * 在庫を減算（トランザクション内で使用）
 * 注意: この関数は必ずトランザクション内で呼び出すこと
 */
export async function decrementStock(
  productId: string,
  quantity: number,
  tx?: any // Prisma Transaction Client
) {
  const client = tx || prisma

  // 楽観的ロック: 在庫が十分にあることを確認しながら更新
  const product = await client.product.updateMany({
    where: {
      id: productId,
      stock: {
        gte: quantity, // 在庫が要求数量以上であることを確認
      },
    },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  })

  if (product.count === 0) {
    throw new Error(`在庫の減算に失敗しました: 商品ID ${productId}`)
  }

  return product
}

/**
 * 在庫を増やす（キャンセル時など）
 */
export async function incrementStock(
  productId: string,
  quantity: number,
  tx?: any
) {
  const client = tx || prisma

  const product = await client.product.update({
    where: { id: productId },
    data: {
      stock: {
        increment: quantity,
      },
    },
  })

  return product
}

/**
 * 注文アイテム全体の在庫を減算（トランザクション）
 */
export async function decrementOrderStock(
  items: Array<{ productId: string; quantity: number }>
) {
  return await prisma.$transaction(async (tx) => {
    // まず在庫をチェック
    const stockCheck = await checkMultipleStock(items)

    if (!stockCheck.allAvailable) {
      const unavailableNames = stockCheck.unavailableProducts
        .map(p => p.message)
        .join(', ')
      throw new Error(`在庫不足: ${unavailableNames}`)
    }

    // 全ての商品の在庫を減算
    const results = await Promise.all(
      items.map(item => decrementStock(item.productId, item.quantity, tx))
    )

    return results
  })
}

/**
 * 注文キャンセル時に在庫を戻す
 */
export async function restoreOrderStock(
  items: Array<{ productId: string; quantity: number }>
) {
  return await prisma.$transaction(async (tx) => {
    const results = await Promise.all(
      items.map(item => incrementStock(item.productId, item.quantity, tx))
    )

    return results
  })
}

/**
 * 在庫状況のサマリーを取得
 */
export async function getStockSummary(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      stock: true,
      isActive: true,
    },
  })

  if (!product) {
    return null
  }

  let status: 'available' | 'low' | 'out_of_stock' | 'inactive'

  if (!product.isActive) {
    status = 'inactive'
  } else if (product.stock === 0) {
    status = 'out_of_stock'
  } else if (product.stock <= 5) {
    status = 'low'
  } else {
    status = 'available'
  }

  return {
    ...product,
    status,
    statusMessage:
      status === 'inactive'
        ? '販売終了'
        : status === 'out_of_stock'
        ? '在庫切れ'
        : status === 'low'
        ? '残りわずか'
        : '在庫あり',
  }
}
