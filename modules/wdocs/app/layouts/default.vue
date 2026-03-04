<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <DocsHeader />
    <DocsSidebar />
    <main class="docs-main">
      <div class="docs-content">
        <slot />
        <DocsPrevNext />
        <DocsEditLink :edit-link="{ pattern: 'https://github.com/wrikka/wdocs/edit/main/content/:path', text: 'Edit this page' }" />
        <DocsFooter />
      </div>
    </main>
    <DocsOutline />
  </div>
</template>
