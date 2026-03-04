//! Spatial audio integration for 3D environments

use ultraviolet::{Vec3, Vec2};
use std::collections::HashMap;

/// Audio format
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AudioFormat {
    Wav,
    Mp3,
    Ogg,
    Flac,
    Aac,
    WebM,
}

/// Audio source state
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AudioState {
    Stopped,
    Playing,
    Paused,
    Loading,
    Error,
}

/// Audio source (3D spatial)
#[derive(Debug, Clone)]
pub struct AudioSource {
    pub id: u64,
    pub position: Vec3,
    pub velocity: Vec3,
    pub direction: Vec3,
    pub volume: f32,
    pub pitch: f32,
    pub pan: f32,
    pub looped: bool,
    pub spatial_blend: f32,
    pub min_distance: f32,
    pub max_distance: f32,
    pub rolloff_factor: f32,
    pub doppler_level: f32,
    pub spread: f32,
    pub priority: i32,
    pub state: AudioState,
    pub buffer: Vec<u8>,
    pub duration: f32,
    pub current_time: f32,
}

impl Default for AudioSource {
    fn default() -> Self {
        Self {
            id: 0,
            position: Vec3::zero(),
            velocity: Vec3::zero(),
            direction: Vec3::new(0.0, 0.0, 1.0),
            volume: 1.0,
            pitch: 1.0,
            pan: 0.0,
            looped: false,
            spatial_blend: 1.0,
            min_distance: 1.0,
            max_distance: 500.0,
            rolloff_factor: 1.0,
            doppler_level: 1.0,
            spread: 0.0,
            priority: 128,
            state: AudioState::Stopped,
            buffer: Vec::new(),
            duration: 0.0,
            current_time: 0.0,
        }
    }
}

impl AudioSource {
    pub fn new(id: u64) -> Self {
        Self {
            id,
            ..Default::default()
        }
    }

    pub fn with_position(mut self, x: f32, y: f32, z: f32) -> Self {
        self.position = Vec3::new(x, y, z);
        self
    }

    pub fn with_volume(mut self, volume: f32) -> Self {
        self.volume = volume.clamp(0.0, 1.0);
        self
    }

    pub fn with_pitch(mut self, pitch: f32) -> Self {
        self.pitch = pitch.max(0.0);
        self
    }

    pub fn with_spatial_blend(mut self, blend: f32) -> Self {
        self.spatial_blend = blend.clamp(0.0, 1.0);
        self
    }

    pub fn with_loop(mut self, looped: bool) -> Self {
        self.looped = looped;
        self
    }

    pub fn with_distance_range(mut self, min: f32, max: f32) -> Self {
        self.min_distance = min;
        self.max_distance = max;
        self
    }

    pub fn play(&mut self) {
        self.state = AudioState::Playing;
    }

    pub fn pause(&mut self) {
        if self.state == AudioState::Playing {
            self.state = AudioState::Paused;
        }
    }

    pub fn stop(&mut self) {
        self.state = AudioState::Stopped;
        self.current_time = 0.0;
    }

    pub fn seek(&mut self, time: f32) {
        self.current_time = time.clamp(0.0, self.duration);
    }
}

/// Audio listener (represents the player's ears)
#[derive(Debug, Clone, Copy)]
pub struct AudioListener {
    pub position: Vec3,
    pub forward: Vec3,
    pub up: Vec3,
    pub velocity: Vec3,
}

impl Default for AudioListener {
    fn default() -> Self {
        Self {
            position: Vec3::zero(),
            forward: Vec3::new(0.0, 0.0, 1.0),
            up: Vec3::new(0.0, 1.0, 0.0),
            velocity: Vec3::zero(),
        }
    }
}

impl AudioListener {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn set_position(&mut self, x: f32, y: f32, z: f32) {
        self.position = Vec3::new(x, y, z);
    }

    pub fn set_orientation(&mut self, fx: f32, fy: f32, fz: f32, ux: f32, uy: f32, uz: f32) {
        self.forward = Vec3::new(fx, fy, fz).normalized();
        self.up = Vec3::new(ux, uy, uz).normalized();
    }
}

/// Audio environment settings
#[derive(Debug, Clone, Copy)]
pub struct AudioEnvironment {
    pub reverb_enabled: bool,
    pub reverb_decay: f32,
    pub reverb_density: f32,
    pub reverb_diffusion: f32,
    pub reverb_gain: f32,
    pub occlusion_enabled: bool,
    pub occlusion_factor: f32,
    pub obstruction_enabled: bool,
    pub obstruction_factor: f32,
}

impl Default for AudioEnvironment {
    fn default() -> Self {
        Self {
            reverb_enabled: false,
            reverb_decay: 1.5,
            reverb_density: 0.5,
            reverb_diffusion: 0.5,
            reverb_gain: 0.5,
            occlusion_enabled: false,
            occlusion_factor: 0.5,
            obstruction_enabled: false,
            obstruction_factor: 0.5,
        }
    }
}

/// Audio mixer for managing multiple sources
#[derive(Debug)]
pub struct AudioMixer {
    sources: HashMap<u64, AudioSource>,
    listener: AudioListener,
    environment: AudioEnvironment,
    master_volume: f32,
    music_volume: f32,
    sfx_volume: f32,
    voice_volume: f32,
    next_id: u64,
}

impl AudioMixer {
    pub fn new() -> Self {
        Self {
            sources: HashMap::new(),
            listener: AudioListener::new(),
            environment: AudioEnvironment::default(),
            master_volume: 1.0,
            music_volume: 1.0,
            sfx_volume: 1.0,
            voice_volume: 1.0,
            next_id: 1,
        }
    }

    pub fn create_source(&mut self) -> u64 {
        let id = self.next_id;
        self.next_id += 1;

        let source = AudioSource::new(id);
        self.sources.insert(id, source);

        id
    }

    pub fn remove_source(&mut self, id: u64) {
        self.sources.remove(&id);
    }

    pub fn get_source(&self, id: u64) -> Option<&AudioSource> {
        self.sources.get(&id)
    }

    pub fn get_source_mut(&mut self, id: u64) -> Option<&mut AudioSource> {
        self.sources.get_mut(&id)
    }

    pub fn play(&mut self, id: u64) {
        if let Some(source) = self.sources.get_mut(&id) {
            source.play();
        }
    }

    pub fn pause(&mut self, id: u64) {
        if let Some(source) = self.sources.get_mut(&id) {
            source.pause();
        }
    }

    pub fn stop(&mut self, id: u64) {
        if let Some(source) = self.sources.get_mut(&id) {
            source.stop();
        }
    }

    pub fn stop_all(&mut self) {
        for source in self.sources.values_mut() {
            source.stop();
        }
    }

    pub fn pause_all(&mut self) {
        for source in self.sources.values_mut() {
            source.pause();
        }
    }

    pub fn resume_all(&mut self) {
        for source in self.sources.values_mut() {
            if source.state == AudioState::Paused {
                source.play();
            }
        }
    }

    pub fn update(&mut self, delta_time: f32) {
        for source in self.sources.values_mut() {
            if source.state == AudioState::Playing {
                source.current_time += delta_time;

                if source.current_time >= source.duration {
                    if source.looped {
                        source.current_time = 0.0;
                    } else {
                        source.stop();
                    }
                }
            }
        }
    }

    pub fn set_listener(&mut self, listener: AudioListener) {
        self.listener = listener;
    }

    pub fn get_listener(&self) -> &AudioListener {
        &self.listener
    }

    pub fn get_listener_mut(&mut self) -> &mut AudioListener {
        &mut self.listener
    }

    pub fn set_master_volume(&mut self, volume: f32) {
        self.master_volume = volume.clamp(0.0, 1.0);
    }

    pub fn set_music_volume(&mut self, volume: f32) {
        self.music_volume = volume.clamp(0.0, 1.0);
    }

    pub fn set_sfx_volume(&mut self, volume: f32) {
        self.sfx_volume = volume.clamp(0.0, 1.0);
    }

    pub fn set_voice_volume(&mut self, volume: f32) {
        self.voice_volume = volume.clamp(0.0, 1.0);
    }

    pub fn calculate_spatial_parameters(&self, source: &AudioSource) -> (f32, f32, f32) {
        let direction = source.position - self.listener.position;
        let distance = direction.mag();

        if distance < 0.001 {
            return (source.volume, 0.0, 0.0);
        }

        let direction_normalized = direction / distance;

        let attenuated_volume = if distance <= source.min_distance {
            source.volume
        } else if distance >= source.max_distance {
            0.0
        } else {
            let t = (distance - source.min_distance) / (source.max_distance - source.min_distance);
            let attenuation = (1.0 - t).powf(source.rolloff_factor);
            source.volume * attenuation
        };

        let listener_right = self.listener.up.cross(self.listener.forward).normalized();
        let projection = direction_normalized.dot(listener_right);
        let pan = projection.clamp(-1.0, 1.0);

        let doppler_pitch = if source.velocity.mag() > 0.0 || self.listener.velocity.mag() > 0.0 {
            let relative_velocity = source.velocity.dot(direction_normalized) - self.listener.velocity.dot(direction_normalized);
            let speed_of_sound = 343.0;
            1.0 + (relative_velocity / speed_of_sound) * source.doppler_level
        } else {
            1.0
        };

        let final_volume = attenuated_volume * source.spatial_blend + source.volume * (1.0 - source.spatial_blend);
        let final_pan = pan * source.spatial_blend;
        let final_pitch = source.pitch * doppler_pitch;

        (final_volume, final_pan, final_pitch)
    }

    pub fn get_active_sources(&self) -> Vec<&AudioSource> {
        self.sources
            .values()
            .filter(|s| s.state == AudioState::Playing)
            .collect()
    }

    pub fn get_source_count(&self) -> usize {
        self.sources.len()
    }

    pub fn get_playing_count(&self) -> usize {
        self.sources
            .values()
            .filter(|s| s.state == AudioState::Playing)
            .count()
    }

    pub fn clear(&mut self) {
        self.sources.clear();
        self.next_id = 1;
    }
}

impl Default for AudioMixer {
    fn default() -> Self {
        Self::new()
    }
}

/// Audio asset loader
pub mod loader {
    use super::*;

    pub fn decode_wav(data: &[u8]) -> Option<(Vec<f32>, u32, u16)> {
        if data.len() < 44 {
            return None;
        }

        if &data[0..4] != b"RIFF" || &data[8..12] != b"WAVE" {
            return None;
        }

        let sample_rate = u32::from_le_bytes([data[24], data[25], data[26], data[27]]);
        let channels = u16::from_le_bytes([data[22], data[23]]);
        let bits_per_sample = u16::from_le_bytes([data[34], data[35]]);

        let data_chunk_start = find_data_chunk(data)?;
        let data_size = u32::from_le_bytes([data[data_chunk_start + 4], data[data_chunk_start + 5], data[data_chunk_start + 6], data[data_chunk_start + 7]]) as usize;

        let sample_data = &data[data_chunk_start + 8..data_chunk_start + 8 + data_size];

        let samples: Vec<f32> = if bits_per_sample == 16 {
            sample_data
                .chunks_exact(2)
                .map(|chunk| {
                    let sample = i16::from_le_bytes([chunk[0], chunk[1]]) as f32;
                    sample / 32768.0
                })
                .collect()
        } else if bits_per_sample == 8 {
            sample_data
                .iter()
                .map(|&sample| (sample as f32 - 128.0) / 128.0)
                .collect()
        } else {
            return None;
        };

        Some((samples, sample_rate, channels))
    }

    fn find_data_chunk(data: &[u8]) -> Option<usize> {
        let mut i = 12;
        while i < data.len() - 8 {
            if &data[i..i + 4] == b"data" {
                return Some(i);
            }
            let chunk_size = u32::from_le_bytes([data[i + 4], data[i + 5], data[i + 6], data[i + 7]]) as usize;
            i += 8 + chunk_size;
            if chunk_size % 2 == 1 {
                i += 1;
            }
        }
        None
    }
}

/// Preset audio configurations
pub mod presets {
    use super::*;

    pub fn ambient_sound() -> AudioSource {
        AudioSource::new(0)
            .with_spatial_blend(0.0)
            .with_volume(0.5)
    }

    pub fn music_track() -> AudioSource {
        AudioSource::new(0)
            .with_spatial_blend(0.0)
            .with_volume(0.7)
            .with_loop(true)
    }

    pub fn sfx_3d() -> AudioSource {
        AudioSource::new(0)
            .with_spatial_blend(1.0)
            .with_distance_range(1.0, 100.0)
    }

    pub fn voice_chat() -> AudioSource {
        AudioSource::new(0)
            .with_spatial_blend(0.0)
            .with_volume(1.0)
    }

    pub fn footsteps() -> AudioSource {
        AudioSource::new(0)
            .with_spatial_blend(1.0)
            .with_distance_range(0.5, 20.0)
            .with_volume(0.6)
    }

    pub fn explosion_sound() -> AudioSource {
        AudioSource::new(0)
            .with_spatial_blend(1.0)
            .with_distance_range(5.0, 500.0)
            .with_volume(1.0)
    }
}
