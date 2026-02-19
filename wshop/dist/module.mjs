import { defineNuxtModule, createResolver, useLogger } from '@nuxt/kit';
import { defu } from 'defu';

const module$1 = defineNuxtModule({
  meta: {
    name: "@wrikka/wshop",
    configKey: "wshop",
    compatibility: {
      nuxt: "^4.0.0"
    }
  },
  defaults: {
    siteUrl: "http://localhost:3000",
    stripeSecretKey: "",
    stripePublishableKey: "",
    databaseUrl: "",
    resendApiKey: "",
    resendFromEmail: "",
    enableAdmin: true,
    adminPath: "/admin",
    enableCustomerAccounts: true,
    enableReviews: true,
    enableWishlist: true,
    enableInventory: true,
    enableDiscounts: true,
    enableShipping: true,
    enableTaxes: true,
    componentPrefix: "WShop",
    enableComponents: true,
    locales: ["en", "th"],
    defaultLocale: "en",
    currency: {
      code: "USD",
      symbol: "$",
      position: "before"
    },
    image: {
      formats: ["webp", "jpg"],
      sizes: {
        thumbnail: 150,
        small: 300,
        medium: 600,
        large: 1200
      }
    }
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const logger = useLogger("@wrikka/wshop");
    const config = defu(nuxt.options.runtimeConfig.public.wshop, options);
    nuxt.options.runtimeConfig.public.wshop = {
      siteUrl: config.siteUrl ?? "http://localhost:3000",
      stripePublishableKey: config.stripePublishableKey ?? "",
      enableAdmin: config.enableAdmin ?? true,
      adminPath: config.adminPath ?? "/admin",
      enableCustomerAccounts: config.enableCustomerAccounts ?? true,
      enableReviews: config.enableReviews ?? true,
      enableWishlist: config.enableWishlist ?? true,
      enableInventory: config.enableInventory ?? true,
      enableDiscounts: config.enableDiscounts ?? true,
      enableShipping: config.enableShipping ?? true,
      enableTaxes: config.enableTaxes ?? true,
      componentPrefix: config.componentPrefix ?? "WShop",
      enableComponents: config.enableComponents ?? true,
      locales: config.locales ?? ["en", "th"],
      defaultLocale: config.defaultLocale ?? "en",
      currency: config.currency ?? {
        code: "USD",
        symbol: "$",
        position: "before"
      },
      image: config.image ?? {
        formats: ["webp", "jpg"],
        sizes: {
          thumbnail: 150,
          small: 300,
          medium: 600,
          large: 1200
        }
      }
    };
    nuxt.options.runtimeConfig.wshop = {
      stripeSecretKey: config.stripeSecretKey ?? "",
      databaseUrl: config.databaseUrl ?? "",
      resendApiKey: config.resendApiKey ?? "",
      resendFromEmail: config.resendFromEmail ?? ""
    };
    nuxt.hook("app:resolve", (app) => {
      app.composables.push({
        name: "useWShop",
        path: resolver.resolve("./runtime/composables/useWShop")
      });
      app.composables.push({
        name: "useCart",
        path: resolver.resolve("./runtime/composables/useCart")
      });
      app.composables.push({
        name: "useProducts",
        path: resolver.resolve("./runtime/composables/useProducts")
      });
      app.composables.push({
        name: "useOrders",
        path: resolver.resolve("./runtime/composables/useOrders")
      });
    });
    if (config.enableComponents) {
      nuxt.hook("components:dirs", (dirs) => {
        dirs.push({
          path: resolver.resolve("./runtime/components"),
          prefix: config.componentPrefix || "WShop"
        });
      });
    }
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.handlers = nitroConfig.handlers || [];
      nitroConfig.handlers.push({
        route: "/api/shop/**",
        handler: resolver.resolve("./runtime/server/routes/shop")
      });
      if (config.enableAdmin) {
        nitroConfig.handlers.push({
          route: "/api/admin/**",
          handler: resolver.resolve("./runtime/server/routes/admin")
        });
      }
      nitroConfig.handlers.push({
        route: "/api/webhooks/stripe",
        handler: resolver.resolve("./runtime/server/routes/webhooks/stripe")
      });
    });
    nuxt.hook("prepare:types", ({ references }) => {
      references.push({
        types: resolver.resolve("./types")
      });
    });
    nuxt.hook("app:resolve", (app) => {
      app.plugins.push({
        src: resolver.resolve("./runtime/plugins/stripe.client")
      });
    });
    if (config.locales && config.locales.length > 0) {
      nuxt.hook("i18n:registerLocale", (locale) => {
        locale.locales = locale.locales || [];
        locale.locales.push(...config.locales.map((code) => ({
          code,
          file: `${code}.json`,
          name: code === "en" ? "English" : code === "th" ? "\u0E44\u0E17\u0E22" : code
        })));
      });
    }
    if (config.image) {
      nuxt.options.image = nuxt.options.image || {};
      nuxt.options.image.format = config.image.formats;
      nuxt.options.image.screens = Object.entries(config.image.sizes).reduce(
        (acc, [name, size]) => ({ ...acc, [name]: size }),
        {}
      );
    }
    logger.success("WShop module loaded");
  }
});

export { module$1 as default };
