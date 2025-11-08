import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// 商品詳細取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "商品が見つかりません" },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "商品の取得に失敗しました",
      },
      { status: 500 },
    );
  }
}

// 商品更新
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      stock,
      imageUrl,
      images,
      categoryId,
      isActive,
    } = body;

    // 既存商品チェック
    const existing = await prisma.product.findUnique({ where: { id: id } });
    if (!existing) {
      return NextResponse.json(
        { error: "商品が見つかりません" },
        { status: 404 },
      );
    }

    // slug重複チェック（自分以外）
    if (slug && slug !== existing.slug) {
      const duplicate = await prisma.product.findUnique({ where: { slug } });
      if (duplicate) {
        return NextResponse.json(
          { error: "このスラッグは既に使用されています" },
          { status: 400 },
        );
      }
    }

    // 商品更新
    const product = await prisma.product.update({
      where: { id: id },
      data: {
        name: name || existing.name,
        slug: slug || existing.slug,
        description: description || existing.description,
        price: price ? parseFloat(price) : existing.price,
        stock: stock !== undefined ? parseInt(stock) : existing.stock,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        images: images !== undefined ? JSON.stringify(images) : existing.images,
        categoryId: categoryId || existing.categoryId,
        isActive: isActive !== undefined ? isActive : existing.isActive,
      },
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "商品の更新に失敗しました",
      },
      { status: 500 },
    );
  }
}

// 商品削除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;
    // 既存商品チェック
    const existing = await prisma.product.findUnique({ where: { id: id } });
    if (!existing) {
      return NextResponse.json(
        { error: "商品が見つかりません" },
        { status: 404 },
      );
    }

    // 商品削除
    await prisma.product.delete({ where: { id: id } });

    return NextResponse.json({ message: "商品を削除しました" });
  } catch (error) {
    console.error("Product deletion error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "商品の削除に失敗しました",
      },
      { status: 500 },
    );
  }
}
