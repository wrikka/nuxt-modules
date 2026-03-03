import { computed, ref } from 'vue';
import type { NotificationType } from '#notifications/types';

export interface SoundConfig {
  enabled: boolean;
  volume: number;
  sounds: Partial<Record<NotificationType, string>>;
  defaultSound: string;
}

const defaultSounds: Record<NotificationType, string> = {
  info: '/sounds/notification-info.mp3',
  success: '/sounds/notification-success.mp3',
  warning: '/sounds/notification-warning.mp3',
  error: '/sounds/notification-error.mp3',
  system: '/sounds/notification-system.mp3',
  message: '/sounds/notification-message.mp3',
};

const audioInstances = new Map<string, HTMLAudioElement>();
const isMuted = ref(false);

export const useNotificationSound = (config?: Partial<SoundConfig>) => {
  const defaultConfig: SoundConfig = {
    enabled: true,
    volume: 0.5,
    sounds: defaultSounds,
    defaultSound: '/sounds/notification.mp3',
  };

  const mergedConfig = { ...defaultConfig, ...config };
  const volume = ref(mergedConfig.volume);

  const getAudio = (soundPath: string): HTMLAudioElement | null => {
    if (!import.meta.client) {
      return null;
    }

    if (audioInstances.has(soundPath)) {
      return audioInstances.get(soundPath)!;
    }

    try {
      const audio = new Audio(soundPath);
      audioInstances.set(soundPath, audio);
      return audio;
    } catch {
      return null;
    }
  };

  const play = async (type?: NotificationType, customSound?: string): Promise<boolean> => {
    if (!mergedConfig.enabled || !import.meta.client || isMuted.value) {
      return false;
    }

    const soundPath = customSound
      ?? (type && mergedConfig.sounds[type])
      ?? mergedConfig.defaultSound;

    const audio = getAudio(soundPath);
    if (!audio) {
      return false;
    }

    try {
      audio.volume = volume.value;
      audio.currentTime = 0;
      await audio.play();
      return true;
    } catch {
      // Audio playback failed (e.g., user hasn't interacted with page)
      return false;
    }
  };

  const stop = (soundPath?: string) => {
    if (!import.meta.client) {
      return;
    }

    if (soundPath) {
      const audio = audioInstances.get(soundPath);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } else {
      for (const audio of audioInstances.values()) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  };

  const setVolume = (newVolume: number) => {
    volume.value = Math.max(0, Math.min(1, newVolume));
  };

  const mute = () => {
    isMuted.value = true;
  };

  const unmute = () => {
    isMuted.value = false;
  };

  const toggleMute = () => {
    isMuted.value = !isMuted.value;
  };

  const preload = (types?: NotificationType[]) => {
    if (!import.meta.client) {
      return;
    }

    const typesToPreload = types ?? (Object.keys(defaultSounds) as NotificationType[]);

    for (const type of typesToPreload) {
      const soundPath = mergedConfig.sounds[type] ?? mergedConfig.defaultSound;
      getAudio(soundPath);
    }
  };

  return {
    play,
    stop,
    setVolume,
    mute,
    unmute,
    toggleMute,
    preload,
    isMuted: computed(() => isMuted.value),
    volume: computed(() => volume.value),
  };
};
