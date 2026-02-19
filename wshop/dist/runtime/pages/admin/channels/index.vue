<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Sales Channels</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminChannelsChannelListItem
        v-for="channel in combinedChannels"
        :key="channel.id"
        :channel="channel"
        @toggle="handleToggle"
        @configure="handleConfigure"
        @connect="connectChannel"
      />
    </div>

    <AdminChannelsChannelConfigModal
      :show="showConfigModal"
      :channel="selectedChannel"
      @close="showConfigModal = false"
      @save="handleSaveConfig"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useChannels } from "~/composables/useChannels";
const { connectedChannels, connectChannel, toggleChannel, saveConfig } = useChannels();
const showConfigModal = ref(false);
const selectedChannel = ref(null);
const availableChannels = [
  { id: "facebook", name: "Facebook Shop", icon: "\u{1F4D8}", description: "Sell on Facebook Marketplace" },
  { id: "instagram", name: "Instagram Shopping", icon: "\u{1F4F7}", description: "Sell on Instagram" },
  { id: "tiktok", name: "TikTok Shop", icon: "\u{1F3B5}", description: "Sell on TikTok" },
  { id: "shopee", name: "Shopee", icon: "\u{1F6D2}", description: "Sell on Shopee Marketplace" },
  { id: "lazada", name: "Lazada", icon: "\u{1F6CD}\uFE0F", description: "Sell on Lazada Marketplace" }
];
const combinedChannels = computed(() => {
  return availableChannels.map((ac) => {
    const connected = connectedChannels.value?.find((cc) => cc.id === ac.id);
    return {
      ...ac,
      enabled: connected?.enabled || false,
      config: connected?.config || {}
    };
  });
});
const handleToggle = (channelId) => {
  const channel = combinedChannels.value.find((c) => c.id === channelId);
  if (channel) {
    toggleChannel(channelId, channel.enabled);
  }
};
const handleConfigure = (channelId) => {
  selectedChannel.value = combinedChannels.value.find((c) => c.id === channelId) || null;
  showConfigModal.value = true;
};
const handleSaveConfig = async (config) => {
  if (!selectedChannel.value) return;
  await saveConfig(selectedChannel.value.id, config);
  showConfigModal.value = false;
};
</script>
