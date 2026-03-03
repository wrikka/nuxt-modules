1. ทุก packages ต้องใช้ wdesign
2. อัพเดย README.md ทุก package
3. ทุก modules ให้มี w นำหน้า เช่น wdocs
4. ทุก modules ต้องใช้ modules/wui หรือ refactor ไปใน modules/wui
5. ทุก modules ต้องใช้ wcomposables หรือ refactor ไปใน wcomposables
6. ทุก modules ให้มีโครงสร้างตามนีคือ
   ```
   module-name/
   ├── docs/
   │   ├app/
   │   │   ├components/
   │   │   ├composables/
   │   │   ├middleware/ (optional)
   │   │   ├plugins/
   │   │   ├store/ (optional)
   │   │   ├types/
   │   │   └utils/
   │   └── index.ts
   ├── test/
   │   ├── e2e/
   │   └── unit/
   ├── .gitignore
   ├── CHANGELOG.md
   ├── LICENSE
   ├── README.md
   ├── package.json
   ├── tsconfig.json
   ├── nuxt.config.ts
   └── uno.config.ts
   ```

7. ทุก package.json ใน modules ต้องมี scripts ตามนี้คือ
   ```json
   "scripts": {
     "dev": "nuxt dev",
     "build": "nuxt-build-module",
     "lint": "nuxt typecheck",
     "release": "release-it",
     "test": "vitest",
     "postinstall": "nuxt prepare"
   }
   ```


8. ทุก package.json ใน modules ต้องกำหนด 

 "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }