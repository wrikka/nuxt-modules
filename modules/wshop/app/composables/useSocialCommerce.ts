import { ref, computed } from "vue"
import type { Product } from "~~/types"

export interface SocialPlatform {
  id: string
  name: string
  icon: string
  enabled: boolean
}

export interface SocialShareData {
  productId: string
  platform: string
  url: string
  title: string
  description: string
  image: string
  hashtags: string[]
}

export interface SocialBuyButton {
  id: string
  productId: string
  platform: string
  embedCode: string
  clicks: number
  conversions: number
}

export interface InstagramShop {
  id: string
  productId: string
  instagramId: string
  taggedPosts: string[]
  taggedStories: string[]
  shopLink: string
}

export const useSocialCommerce = () => {
  const platforms = ref<SocialPlatform[]>([
    { id: "facebook", name: "Facebook", icon: "facebook", enabled: true },
    { id: "instagram", name: "Instagram", icon: "instagram", enabled: true },
    { id: "tiktok", name: "TikTok", icon: "tiktok", enabled: true },
    { id: "pinterest", name: "Pinterest", icon: "pinterest", enabled: true },
    { id: "twitter", name: "Twitter", icon: "twitter", enabled: true },
  ])

  const shareProduct = async (productId: string, platformId: string): Promise<string> => {
    const product = await $fetch<Product>(`/api/shop/products/${productId}`)

    const shareData: SocialShareData = {
      productId,
      platform: platformId,
      url: `${window.location.origin}/products/${product.id}`,
      title: product.name,
      description: product.description.slice(0, 200),
      image: product.images[0] || "",
      hashtags: product.tags.slice(0, 5),
    }

    // Track share
    await $fetch("/api/shop/social/share", {
      method: "POST",
      body: shareData,
    })

    // Generate share URL based on platform
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareData.url)}&media=${encodeURIComponent(shareData.image)}&description=${encodeURIComponent(shareData.title)}`,
      tiktok: shareData.url, // TikTok requires manual sharing
    }

    return shareUrls[platformId] || shareData.url
  }

  const createBuyButton = async (productId: string, platform: string): Promise<SocialBuyButton> => {
    const button = await $fetch<SocialBuyButton>("/api/shop/social/buy-buttons", {
      method: "POST",
      body: { productId, platform },
    })
    return button
  }

  const getBuyButtonEmbed = (button: SocialBuyButton): string => {
    // Generate embed code for the platform
    switch (button.platform) {
      case "facebook":
        return `<div class="fb-product" data-product-id="${button.productId}"></div>`
      case "instagram":
        return `<a href="${button.embedCode}" class="instagram-shop-button">Shop Now</a>`
      default:
        return `<a href="${button.embedCode}" class="buy-button">Buy Now</a>`
    }
  }

  const syncWithInstagram = async (productId: string): Promise<InstagramShop> => {
    const shop = await $fetch<InstagramShop>("/api/shop/social/instagram/sync", {
      method: "POST",
      body: { productId },
    })
    return shop
  }

  const tagProductOnInstagram = async (
    productId: string,
    postId: string,
    type: "post" | "story" = "post",
  ): Promise<void> => {
    await $fetch("/api/shop/social/instagram/tag", {
      method: "POST",
      body: { productId, postId, type },
    })
  }

  const getSocialStats = async (productId: string): Promise<{
    shares: Record<string, number>
    clicks: number
    conversions: number
    revenue: number
  }> => {
    return await $fetch(`/api/shop/social/stats/${productId}`)
  }

  const enablePlatform = (platformId: string) => {
    const platform = platforms.value.find(p => p.id === platformId)
    if (platform) {
      platform.enabled = true
    }
  }

  const disablePlatform = (platformId: string) => {
    const platform = platforms.value.find(p => p.id === platformId)
    if (platform) {
      platform.enabled = false
    }
  }

  const getEnabledPlatforms = computed(() =>
    platforms.value.filter(p => p.enabled),
  )

  return {
    platforms: computed(() => platforms.value),
    enabledPlatforms: getEnabledPlatforms,
    shareProduct,
    createBuyButton,
    getBuyButtonEmbed,
    syncWithInstagram,
    tagProductOnInstagram,
    getSocialStats,
    enablePlatform,
    disablePlatform,
  }
}
