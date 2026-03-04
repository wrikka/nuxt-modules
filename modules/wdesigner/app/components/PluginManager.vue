<script setup lang="ts">
import type { Plugin, PluginManifest } from "../types/plugin";
import { ref } from "vue";

const props = defineProps<{
	plugins: Plugin[];
	activePlugins: Plugin[];
	pluginCount: number;
	activePluginCount: number;
	isLoading: boolean;
	error: string | null;
}>();

const emit = defineEmits<{
	installPlugin: [source: string];
	uninstallPlugin: [pluginId: string];
	activatePlugin: [pluginId: string];
	deactivatePlugin: [pluginId: string];
	updatePluginConfig: [pluginId: string, config: Record<string, unknown>];
	createTemplate: [manifest: Omit<PluginManifest, "apiVersion">];
}>();

const isExpanded = ref(true);
const showInstallModal = ref(false);
const showCreateModal = ref(false);
const showPluginDetail = ref<Plugin | null>(null);
const installSource = ref("");
const activeTab = ref<"all" | "active" | "inactive">("all");

const newPlugin = ref({
	id: "",
	name: "",
	version: "1.0.0",
	description: "",
	author: "",
});

const filteredPlugins = computed(() => {
	switch (activeTab.value) {
		case "active":
			return props.plugins.filter((p) => p.isActive);
		case "inactive":
			return props.plugins.filter((p) => !p.isActive);
		default:
			return props.plugins;
	}
});

const handleInstall = () => {
	emit("installPlugin", installSource.value);
	installSource.value = "";
	showInstallModal.value = false;
};

const handleCreate = () => {
	emit("createTemplate", {
		id: newPlugin.value.id,
		name: newPlugin.value.name,
		version: newPlugin.value.version,
		description: newPlugin.value.description,
		author: newPlugin.value.author,
	});
	showCreateModal.value = false;
	newPlugin.value = { id: "", name: "", version: "1.0.0", description: "", author: "" };
};

const togglePlugin = (plugin: Plugin) => {
	if (plugin.isActive) {
		emit("deactivatePlugin", plugin.manifest.id);
	} else {
		emit("activatePlugin", plugin.manifest.id);
	}
};

const getPluginIcon = (plugin: Plugin): string => {
	return plugin.manifest.icon || "🔌";
};

const getStatusColor = (plugin: Plugin): string => {
	return plugin.isActive ? "#10b981" : "#6b7280";
};
</script>

<template>
	<div class="plugin-manager">
		<!-- Header -->
		<div class="panel-header" @click="isExpanded = !isExpanded">
			<div class="header-left">
				<span class="panel-icon">🔌</span>
				<span class="panel-title">Plugins</span>
				<span class="plugin-count">({{ activePluginCount }}/{{ pluginCount }})</span>
			</div>
			<div class="header-actions">
				<button class="icon-btn" @click.stop="showInstallModal = true" title="Install plugin">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 5v14" />
						<path d="M5 12h14" />
					</svg>
				</button>
				<button class="icon-btn" @click.stop="isExpanded = !isExpanded">
					<svg v-if="isExpanded" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m18 15-6-6-6 6" />
					</svg>
					<svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m6 9 6 6 6-6" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Content -->
		<div v-if="isExpanded" class="panel-content">
			<!-- Error Message -->
			<div v-if="error" class="error-message">
				{{ error }}
			</div>

			<!-- Tabs -->
			<div class="tabs">
				<button
					class="tab"
					:class="{ active: activeTab === 'all' }"
					@click="activeTab = 'all'"
				>
					All
				</button>
				<button
					class="tab"
					:class="{ active: activeTab === 'active' }"
					@click="activeTab = 'active'"
				>
					Active
				</button>
				<button
					class="tab"
					:class="{ active: activeTab === 'inactive' }"
					@click="activeTab = 'inactive'"
				>
					Inactive
				</button>
			</div>

			<!-- Plugin List -->
			<div class="plugin-list">
				<div v-if="filteredPlugins.length === 0" class="empty-state">
					<p v-if="isLoading">Loading plugins...</p>
					<p v-else>No plugins found</p>
				</div>

				<div
					v-for="plugin in filteredPlugins"
					:key="plugin.manifest.id"
					class="plugin-item"
					:class="{ active: plugin.isActive }"
					@click="showPluginDetail = plugin"
				>
					<div class="plugin-icon">{{ getPluginIcon(plugin) }}</div>
					<div class="plugin-info">
						<div class="plugin-header">
							<span class="plugin-name">{{ plugin.manifest.name }}</span>
							<span class="plugin-version">v{{ plugin.manifest.version }}</span>
						</div>
						<span class="plugin-id">{{ plugin.manifest.id }}</span>
					</div>
					<div class="plugin-actions">
						<div class="status-dot" :style="{ backgroundColor: getStatusColor(plugin) }" />
						<button
							class="toggle-btn"
							:class="{ active: plugin.isActive }"
							@click.stop="togglePlugin(plugin)"
						>
							{{ plugin.isActive ? 'On' : 'Off' }}
						</button>
						<button
							class="uninstall-btn"
							@click.stop="$emit('uninstallPlugin', plugin.manifest.id)"
							title="Uninstall plugin"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M3 6h18" />
								<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
								<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Create Plugin Button -->
			<button class="btn btn-secondary create-btn" @click="showCreateModal = true">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
					<polyline points="14 2 14 8 20 8" />
					<path d="M12 18v-6" />
					<path d="M9 15h6" />
				</svg>
				Create Plugin Template
			</button>
		</div>

		<!-- Install Modal -->
		<div v-if="showInstallModal" class="modal-overlay" @click="showInstallModal = false">
			<div class="modal" @click.stop>
				<h3>Install Plugin</h3>
				<div class="form-group">
					<label>Plugin Source</label>
					<textarea
						v-model="installSource"
						placeholder="Enter plugin URL or paste plugin code..."
						rows="6"
					/ />
				</div>
				<p class="hint">Supports: URL (http/https), inline code, or builtin:plugin-id</p>
				<div class="modal-actions">
					<button class="btn btn-secondary" @click="showInstallModal = false">Cancel</button>
					<button class="btn btn-primary" :disabled="!installSource.trim() || isLoading" @click="handleInstall">
						{{ isLoading ? 'Installing...' : 'Install' }}
					</button>
				</div>
			</div>
		</div>

		<!-- Create Modal -->
		<div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
			<div class="modal" @click.stop>
				<h3>Create Plugin Template</h3>
				<div class="form-group">
					<label>Plugin ID *</label>
					<input v-model="newPlugin.id" type="text" placeholder="my-plugin" />
				</div>
				<div class="form-group">
					<label>Name *</label>
					<input v-model="newPlugin.name" type="text" placeholder="My Plugin" />
				</div>
				<div class="form-group">
					<label>Version</label>
					<input v-model="newPlugin.version" type="text" placeholder="1.0.0" />
				</div>
				<div class="form-group">
					<label>Description</label>
					<input v-model="newPlugin.description" type="text" placeholder="Plugin description..." />
				</div>
				<div class="form-group">
					<label>Author</label>
					<input v-model="newPlugin.author" type="text" placeholder="Your name" />
				</div>
				<div class="modal-actions">
					<button class="btn btn-secondary" @click="showCreateModal = false">Cancel</button>
					<button class="btn btn-primary" :disabled="!newPlugin.id.trim() || !newPlugin.name.trim()" @click="handleCreate">
						Create Template
					</button>
				</div>
			</div>
		</div>

		<!-- Plugin Detail Modal -->
		<div v-if="showPluginDetail" class="modal-overlay" @click="showPluginDetail = null">
			<div class="modal" @click.stop>
				<div class="detail-header">
					<div class="detail-icon">{{ getPluginIcon(showPluginDetail) }}</div>
					<div class="detail-title">
						<h3>{{ showPluginDetail.manifest.name }}</h3>
						<span class="detail-version">v{{ showPluginDetail.manifest.version }}</span>
					</div>
				</div>
				<div class="detail-info">
					<div class="info-row">
						<span class="info-label">ID:</span>
						<code>{{ showPluginDetail.manifest.id }}</code>
					</div>
					<div v-if="showPluginDetail.manifest.description" class="info-row">
						<span class="info-label">Description:</span>
						<p>{{ showPluginDetail.manifest.description }}</p>
					</div>
					<div v-if="showPluginDetail.manifest.author" class="info-row">
						<span class="info-label">Author:</span>
						<span>{{ showPluginDetail.manifest.author }}</span>
					</div>
					<div class="info-row">
						<span class="info-label">API Version:</span>
						<span>{{ showPluginDetail.manifest.apiVersion }}</span>
					</div>
					<div class="info-row">
						<span class="info-label">Status:</span>
						<span :class="{ 'status-active': showPluginDetail.isActive }">
							{{ showPluginDetail.isActive ? 'Active' : 'Inactive' }}
						</span>
					</div>
					<div class="info-row">
						<span class="info-label">Source:</span>
						<code class="source-code">{{ showPluginDetail.source }}</code>
					</div>
				</div>
				<div class="modal-actions">
					<button class="btn btn-secondary" @click="showPluginDetail = null">Close</button>
					<button
						class="btn"
						:class="showPluginDetail.isActive ? 'btn-danger' : 'btn-primary'"
						@click="togglePlugin(showPluginDetail); showPluginDetail = null"
					>
						{{ showPluginDetail.isActive ? 'Deactivate' : 'Activate' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.plugin-manager {
	background: var(--panel-bg, #1e1e1e);
	border-radius: 8px;
	border: 1px solid var(--panel-border, #333);
	overflow: hidden;
	font-family: system-ui, -apple-system, sans-serif;
	font-size: 14px;
}

.panel-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	background: var(--header-bg, #252525);
	cursor: pointer;
	user-select: none;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 8px;
}

.panel-icon {
	font-size: 16px;
}

.panel-title {
	font-weight: 600;
	color: var(--text-primary, #fff);
}

.plugin-count {
	color: var(--text-secondary, #9ca3af);
	font-size: 12px;
}

.header-actions {
	display: flex;
	gap: 4px;
}

.icon-btn {
	background: transparent;
	border: none;
	color: var(--text-secondary, #9ca3af);
	cursor: pointer;
	padding: 4px;
	border-radius: 4px;
	transition: all 0.2s;
}

.icon-btn:hover {
	background: var(--hover-bg, #374151);
	color: var(--text-primary, #fff);
}

.panel-content {
	padding: 12px;
}

.error-message {
	background: #fef2f2;
	border: 1px solid #fecaca;
	color: #dc2626;
	padding: 10px 12px;
	border-radius: 6px;
	margin-bottom: 12px;
	font-size: 13px;
}

.tabs {
	display: flex;
	gap: 4px;
	margin-bottom: 12px;
}

.tab {
	flex: 1;
	padding: 6px 12px;
	border: none;
	background: transparent;
	color: var(--text-secondary, #9ca3af);
	font-size: 13px;
	cursor: pointer;
	border-radius: 4px;
	transition: all 0.2s;
}

.tab:hover {
	background: var(--hover-bg, #374151);
}

.tab.active {
	background: #3b82f6;
	color: white;
}

.plugin-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-height: 300px;
	overflow-y: auto;
}

.empty-state {
	text-align: center;
	padding: 24px;
	color: var(--text-secondary, #9ca3af);
	font-size: 13px;
}

.plugin-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px;
	border-radius: 6px;
	background: var(--item-bg, #252525);
	cursor: pointer;
	transition: all 0.2s;
}

.plugin-item:hover {
	background: var(--item-hover-bg, #374151);
}

.plugin-item.active {
	border-left: 3px solid #10b981;
}

.plugin-icon {
	font-size: 20px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--icon-bg, #1e1e1e);
	border-radius: 6px;
}

.plugin-info {
	flex: 1;
	min-width: 0;
}

.plugin-header {
	display: flex;
	align-items: center;
	gap: 6px;
}

.plugin-name {
	font-weight: 500;
	color: var(--text-primary, #fff);
	font-size: 13px;
}

.plugin-version {
	color: var(--text-tertiary, #6b7280);
	font-size: 11px;
}

.plugin-id {
	display: block;
	color: var(--text-secondary, #9ca3af);
	font-size: 11px;
	font-family: monospace;
	margin-top: 2px;
}

.plugin-actions {
	display: flex;
	align-items: center;
	gap: 8px;
}

.status-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
}

.toggle-btn {
	padding: 4px 10px;
	border: none;
	border-radius: 4px;
	font-size: 11px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	background: #374151;
	color: #9ca3af;
}

.toggle-btn.active {
	background: #10b981;
	color: white;
}

.uninstall-btn {
	background: transparent;
	border: none;
	color: #6b7280;
	cursor: pointer;
	padding: 4px;
	border-radius: 4px;
	transition: all 0.2s;
}

.uninstall-btn:hover {
	color: #ef4444;
	background: #fef2f2;
}

.create-btn {
	margin-top: 12px;
	width: 100%;
}

.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 10px 16px;
	border: none;
	border-radius: 6px;
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.btn-primary {
	background: #3b82f6;
	color: white;
}

.btn-primary:hover:not(:disabled) {
	background: #2563eb;
}

.btn-secondary {
	background: #374151;
	color: #f3f4f6;
}

.btn-secondary:hover {
	background: #4b5563;
}

.btn-danger {
	background: #dc2626;
	color: white;
}

.btn-danger:hover {
	background: #b91c1c;
}

.btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal {
	background: var(--modal-bg, #1e1e1e);
	border-radius: 12px;
	padding: 24px;
	width: 100%;
	max-width: 500px;
	border: 1px solid var(--modal-border, #333);
	max-height: 90vh;
	overflow-y: auto;
}

.modal h3 {
	margin: 0 0 20px 0;
	color: var(--text-primary, #fff);
	font-size: 18px;
}

.form-group {
	margin-bottom: 16px;
}

.form-group label {
	display: block;
	margin-bottom: 6px;
	color: var(--text-secondary, #9ca3af);
	font-size: 13px;
}

.form-group input,
.form-group textarea {
	width: 100%;
	padding: 10px 12px;
	border: 1px solid var(--input-border, #374151);
	border-radius: 6px;
	background: var(--input-bg, #252525);
	color: var(--text-primary, #fff);
	font-size: 14px;
	box-sizing: border-box;
	font-family: inherit;
}

.form-group textarea {
	resize: vertical;
	font-family: monospace;
	font-size: 12px;
}

.form-group input:focus,
.form-group textarea:focus {
	outline: none;
	border-color: #3b82f6;
}

.hint {
	color: var(--text-tertiary, #6b7280);
	font-size: 12px;
	margin-top: -8px;
	margin-bottom: 16px;
}

.modal-actions {
	display: flex;
	gap: 12px;
	justify-content: flex-end;
	margin-top: 24px;
}

.detail-header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 20px;
}

.detail-icon {
	font-size: 32px;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--icon-bg, #252525);
	border-radius: 8px;
}

.detail-title h3 {
	margin: 0;
	font-size: 18px;
}

.detail-version {
	color: var(--text-secondary, #9ca3af);
	font-size: 13px;
}

.detail-info {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 20px;
}

.detail-info .info-row {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.detail-info .info-label {
	color: var(--text-secondary, #9ca3af);
	font-size: 12px;
}

.detail-info code {
	background: var(--code-bg, #252525);
	padding: 4px 8px;
	border-radius: 4px;
	font-family: monospace;
	font-size: 12px;
	color: var(--text-primary, #fff);
}

.detail-info .source-code {
	word-break: break-all;
	font-size: 11px;
}

.status-active {
	color: #10b981;
	font-weight: 500;
}
</style>
