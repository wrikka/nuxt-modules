<script setup>
definePageMeta({
  title: "\u0E23\u0E49\u0E32\u0E19\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E02\u0E2D\u0E07\u0E40\u0E23\u0E32",
  description: "\u0E23\u0E49\u0E32\u0E19\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E2D\u0E23\u0E48\u0E2D\u0E22\u0E46 \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E1C\u0E48\u0E32\u0E19 LINE"
});
const menuItems = [
  {
    id: 1,
    name: "\u0E02\u0E49\u0E32\u0E27\u0E1C\u0E31\u0E14\u0E01\u0E23\u0E30\u0E40\u0E1E\u0E23\u0E32",
    description: "\u0E02\u0E49\u0E32\u0E27\u0E1C\u0E31\u0E14\u0E01\u0E23\u0E30\u0E40\u0E1E\u0E23\u0E32\u0E2B\u0E21\u0E39\u0E01\u0E23\u0E2D\u0E1A \u0E23\u0E2A\u0E40\u0E14\u0E47\u0E14",
    price: "50\u0E3F",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "\u0E02\u0E49\u0E32\u0E27\u0E21\u0E31\u0E19\u0E44\u0E01\u0E48",
    description: "\u0E02\u0E49\u0E32\u0E27\u0E21\u0E31\u0E19\u0E44\u0E01\u0E48\u0E2A\u0E39\u0E15\u0E23\u0E1E\u0E34\u0E40\u0E28\u0E29 \u0E19\u0E38\u0E48\u0E21\u0E25\u0E34\u0E49\u0E19",
    price: "45\u0E3F",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "\u0E02\u0E49\u0E32\u0E27\u0E23\u0E32\u0E14\u0E2B\u0E19\u0E49\u0E32",
    description: "\u0E02\u0E49\u0E32\u0E27\u0E23\u0E32\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E21\u0E39\u0E41\u0E14\u0E07 \u0E19\u0E49\u0E33\u0E23\u0E32\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E02\u0E49\u0E21\u0E02\u0E49\u0E19",
    price: "55\u0E3F",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "\u0E02\u0E49\u0E32\u0E27\u0E44\u0E02\u0E48\u0E40\u0E08\u0E35\u0E22\u0E27",
    description: "\u0E02\u0E49\u0E32\u0E27\u0E44\u0E02\u0E48\u0E40\u0E08\u0E35\u0E22\u0E27\u0E2B\u0E21\u0E39\u0E2A\u0E31\u0E1A \u0E44\u0E02\u0E48\u0E40\u0E08\u0E35\u0E22\u0E27\u0E1F\u0E39",
    price: "40\u0E3F",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "\u0E02\u0E49\u0E32\u0E27\u0E2B\u0E21\u0E01\u0E44\u0E01\u0E48",
    description: "\u0E02\u0E49\u0E32\u0E27\u0E2B\u0E21\u0E01\u0E44\u0E01\u0E48\u0E21\u0E31\u0E19 \u0E2B\u0E2D\u0E21\u0E01\u0E23\u0E38\u0E48\u0E19",
    price: "60\u0E3F",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    name: "\u0E02\u0E49\u0E32\u0E27\u0E1C\u0E31\u0E14",
    description: "\u0E02\u0E49\u0E32\u0E27\u0E1C\u0E31\u0E14\u0E23\u0E27\u0E21\u0E21\u0E34\u0E15\u0E23 \u0E2D\u0E23\u0E48\u0E2D\u0E22\u0E16\u0E39\u0E01\u0E1B\u0E32\u0E01",
    price: "35\u0E3F",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    name: "\u0E02\u0E49\u0E32\u0E27\u0E15\u0E49\u0E21",
    description: "\u0E02\u0E49\u0E32\u0E27\u0E15\u0E49\u0E21\u0E17\u0E23\u0E07\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07 \u0E2D\u0E38\u0E48\u0E19\u0E2B\u0E31\u0E27\u0E43\u0E08",
    price: "30\u0E3F",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
  },
  {
    id: 8,
    name: "\u0E02\u0E49\u0E32\u0E27\u0E04\u0E25\u0E38\u0E01\u0E01\u0E30\u0E40\u0E1E\u0E23\u0E32",
    description: "\u0E02\u0E49\u0E32\u0E27\u0E04\u0E25\u0E38\u0E01\u0E01\u0E30\u0E40\u0E1E\u0E23\u0E32\u0E44\u0E02\u0E48\u0E14\u0E32\u0E27 \u0E23\u0E2A\u0E0A\u0E32\u0E15\u0E34\u0E08\u0E31\u0E14\u0E08\u0E49\u0E32\u0E19",
    price: "45\u0E3F",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop"
  }
];
const bookViaLine = (itemName) => {
  const message = `\u0E2A\u0E19\u0E43\u0E08\u0E08\u0E2D\u0E07: ${itemName}`;
  const lineUrl = `https://line.me/R/oaMessage/@lineoa?message=${encodeURIComponent(message)}`;
  window.open(lineUrl, "_blank");
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
    <!-- Header -->
    <header class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-orange-600 mb-2">🍽️ ร้านอาหารของเรา</h1>
          <p class="text-gray-600 text-lg">อาหารไทยอร่อยๆ พร้อมบริการจองผ่าน LINE</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Menu Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in menuItems"
          :key="item.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Image -->
          <div class="aspect-w-16 aspect-h-12">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-48 object-cover"
            />
          </div>
          
          <!-- Content -->
          <div class="p-4">
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ item.name }}</h3>
            <p class="text-gray-600 text-sm mb-3">{{ item.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-orange-600">{{ item.price }}</span>
              <button
                @click="bookViaLine(item.name)"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.684 7.925l-5.131-4.967c-.6-.58-1.552-.58-2.151 0L5.271 7.925A1.497 1.497 0 004.5 9.193v11.559h4.5V15.75h6v5.002h4.5V9.193c0-.5-.247-.969-.684-1.268h.018zM12 2.5l6 6v11h-3v-5H9v5H6v-11l6-6z"/>
                </svg>
                จอง
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="mt-16 text-center bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">📞 ติดต่อเรา</h2>
        <p class="text-gray-600 mb-6">สามารถจองอาหารผ่าน LINE หรือโทรมาหาเราได้เลย</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="bookViaLine('\u0E2A\u0E2D\u0E1A\u0E16\u0E32\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25')"
            class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.684 7.925l-5.131-4.967c-.6-.58-1.552-.58-2.151 0L5.271 7.925A1.497 1.497 0 004.5 9.193v11.559h4.5V15.75h6v5.002h4.5V9.193c0-.5-.247-.969-.684-1.268h.018zM12 2.5l6 6v11h-3v-5H9v5H6v-11l6-6z"/>
            </svg>
            จองผ่าน LINE
          </button>
          <a
            href="tel:0812345678"
            class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            081-234-5678
          </a>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-400">© 2026 ร้านอาหารของเรา. All rights reserved.</p>
        <p class="text-gray-400 mt-2">เปิดทุกวัน 10:00 - 22:00 น.</p>
      </div>
    </footer>
  </div>
</template>
