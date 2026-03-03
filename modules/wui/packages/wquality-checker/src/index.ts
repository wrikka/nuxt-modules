import { existsSync } from 'fs'
import { vueScriptOrder, vueComponentNaming } from './rules/vue'
import { wuiThemeValidator, wuiNoDarkClasses } from './rules/wui'
import { reduceConsoleLogs, reduceGlobalMutations } from './rules/reduce-side-effect'
import { architectureFilePlacement, architectureNamingConvention } from './rules/architecture'
import { securityEvalCheck, securityInnerHTMLCheck } from './rules/security'
import { performanceLargeObjects, performanceRecursiveFunctions } from './rules/performance'
import { tsUtilsPurity, tsLibExports, tsServerSafety } from './rules/ts'
import { default as nuxtVueRules } from './rules/nuxt'

export function createWQualityChecker() {
    const isNuxt = existsSync('nuxt.config.ts') || existsSync('nuxt.config.js')

    if (isNuxt) {
        // For Nuxt projects, use the module (handled separately in nuxt.config)
        return []
    } else {
        // For Vite projects, return all plugins
        return [
            vueScriptOrder(),
            vueComponentNaming(),
            wuiThemeValidator(),
            wuiNoDarkClasses(),
            reduceConsoleLogs(),
            reduceGlobalMutations(),
            architectureFilePlacement(),
            architectureNamingConvention(),
            securityEvalCheck(),
            securityInnerHTMLCheck(),
            performanceLargeObjects(),
            performanceRecursiveFunctions(),
            tsUtilsPurity(),
            tsLibExports(),
            tsServerSafety()
        ]
    }
}

// Also export individual rules for manual use
export { vueScriptOrder, vueComponentNaming } from './rules/vue'
export { default as nuxtVueRules } from './rules/nuxt'
export { wuiThemeValidator, wuiNoDarkClasses } from './rules/wui'
export { reduceConsoleLogs, reduceGlobalMutations } from './rules/reduce-side-effect'
export { architectureFilePlacement, architectureNamingConvention } from './rules/architecture'
export { securityEvalCheck, securityInnerHTMLCheck } from './rules/security'
export { performanceLargeObjects, performanceRecursiveFunctions } from './rules/performance'
export { tsUtilsPurity, tsLibExports, tsServerSafety } from './rules/ts'
