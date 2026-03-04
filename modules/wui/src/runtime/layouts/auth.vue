<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
    <div class="w-full max-w-md">
      <div class="bg-background rounded-lg shadow-lg p-8">
        <slot name="logo">
          <div class="text-center mb-8">
            <div class="font-bold text-2xl text-primary mb-2">Welcome Back</div>
            <p class="text-muted-foreground">Sign in to your account</p>
          </div>
        </slot>
        
        <NuxtPage />
        
        <slot name="footer">
          <div class="text-center mt-6 text-sm text-muted-foreground">
            <p>Don't have an account? 
              <a href="#" class="text-primary hover:underline">Sign up</a>
            </p>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
