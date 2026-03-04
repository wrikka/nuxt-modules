//! 2D/3D Particle system for visual effects

use ultraviolet::{Vec2, Vec3, Vec4};
use std::f32::consts::PI;

/// Particle emitter shape
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum EmitterShape {
    Point,
    Sphere { radius: f32 },
    Box { width: f32, height: f32, depth: f32 },
    Cone { angle: f32, length: f32 },
    Circle { radius: f32 },
    Line { length: f32 },
    Mesh { spread: f32 },
}

/// Particle simulation space
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SimulationSpace {
    Local,
    World,
}

/// Particle data
#[derive(Debug, Clone, Copy)]
pub struct Particle {
    pub position: Vec3,
    pub velocity: Vec3,
    pub acceleration: Vec3,
    pub rotation: Vec3,
    pub angular_velocity: Vec3,
    pub scale: Vec3,
    pub color: Vec4,
    pub lifetime: f32,
    pub max_lifetime: f32,
    pub age: f32,
    pub active: bool,
    pub id: u32,
}

impl Default for Particle {
    fn default() -> Self {
        Self {
            position: Vec3::zero(),
            velocity: Vec3::zero(),
            acceleration: Vec3::zero(),
            rotation: Vec3::zero(),
            angular_velocity: Vec3::zero(),
            scale: Vec3::one(),
            color: Vec4::one(),
            lifetime: 1.0,
            max_lifetime: 1.0,
            age: 0.0,
            active: false,
            id: 0,
        }
    }
}

/// Particle module - size over lifetime
#[derive(Debug, Clone, Copy)]
pub struct SizeOverLifetime {
    pub enabled: bool,
    pub start_size: Vec3,
    pub end_size: Vec3,
    pub curve: Curve,
}

impl Default for SizeOverLifetime {
    fn default() -> Self {
        Self {
            enabled: true,
            start_size: Vec3::one(),
            end_size: Vec3::one(),
            curve: Curve::Linear,
        }
    }
}

/// Particle module - color over lifetime
#[derive(Debug, Clone)]
pub struct ColorOverLifetime {
    pub enabled: bool,
    pub gradient: Gradient,
}

impl Default for ColorOverLifetime {
    fn default() -> Self {
        Self {
            enabled: true,
            gradient: Gradient::default(),
        }
    }
}

/// Particle module - velocity over lifetime
#[derive(Debug, Clone, Copy)]
pub struct VelocityOverLifetime {
    pub enabled: bool,
    pub start_speed: f32,
    pub end_speed: f32,
    pub curve: Curve,
    pub orbital_velocity: Vec3,
    pub radial_velocity: f32,
}

impl Default for VelocityOverLifetime {
    fn default() -> Self {
        Self {
            enabled: false,
            start_speed: 1.0,
            end_speed: 1.0,
            curve: Curve::Linear,
            orbital_velocity: Vec3::zero(),
            radial_velocity: 0.0,
        }
    }
}

/// Curve types for interpolation
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Curve {
    Linear,
    EaseIn,
    EaseOut,
    EaseInOut,
    Constant,
    Custom([f32; 4]),
}

impl Curve {
    pub fn evaluate(&self, t: f32) -> f32 {
        let t = t.clamp(0.0, 1.0);
        match self {
            Self::Linear => t,
            Self::EaseIn => t * t,
            Self::EaseOut => 1.0 - (1.0 - t) * (1.0 - t),
            Self::EaseInOut => {
                if t < 0.5 {
                    2.0 * t * t
                } else {
                    1.0 - (-2.0 * t + 2.0).powi(2) / 2.0
                }
            }
            Self::Constant => 1.0,
            Self::Custom(c) => c[0] + c[1] * t + c[2] * t * t + c[3] * t * t * t,
        }
    }
}

/// Color gradient
#[derive(Debug, Clone)]
pub struct Gradient {
    pub keys: Vec<(f32, Vec4)>,
}

impl Gradient {
    pub fn new() -> Self {
        Self {
            keys: vec![(0.0, Vec4::one()), (1.0, Vec4::one())],
        }
    }

    pub fn add_key(&mut self, time: f32, color: Vec4) {
        self.keys.push((time, color));
        self.keys.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap());
    }

    pub fn evaluate(&self, t: f32) -> Vec4 {
        if self.keys.is_empty() {
            return Vec4::one();
        }

        let t = t.clamp(0.0, 1.0);

        if t <= self.keys[0].0 {
            return self.keys[0].1;
        }

        if t >= self.keys[self.keys.len() - 1].0 {
            return self.keys[self.keys.len() - 1].1;
        }

        for i in 0..self.keys.len() - 1 {
            let (t1, c1) = self.keys[i];
            let (t2, c2) = self.keys[i + 1];

            if t >= t1 && t <= t2 {
                let local_t = (t - t1) / (t2 - t1);
                return Vec4::new(
                    c1.x + (c2.x - c1.x) * local_t,
                    c1.y + (c2.y - c1.y) * local_t,
                    c1.z + (c2.z - c1.z) * local_t,
                    c1.w + (c2.w - c1.w) * local_t,
                );
            }
        }

        self.keys[self.keys.len() - 1].1
    }
}

impl Default for Gradient {
    fn default() -> Self {
        let mut g = Self::new();
        g.keys = vec![
            (0.0, Vec4::new(1.0, 1.0, 1.0, 1.0)),
            (1.0, Vec4::new(1.0, 1.0, 1.0, 0.0)),
        ];
        g
    }
}

/// Particle emitter configuration
#[derive(Debug, Clone)]
pub struct ParticleEmitter {
    pub max_particles: usize,
    pub emission_rate: f32,
    pub emission_burst: u32,
    pub lifetime_min: f32,
    pub lifetime_max: f32,
    pub start_speed_min: f32,
    pub start_speed_max: f32,
    pub start_size_min: Vec3,
    pub start_size_max: Vec3,
    pub start_color: Vec4,
    pub start_rotation_min: Vec3,
    pub start_rotation_max: Vec3,
    pub shape: EmitterShape,
    pub simulation_space: SimulationSpace,
    pub gravity: Vec3,
    pub drag: f32,
    pub size_over_lifetime: SizeOverLifetime,
    pub color_over_lifetime: ColorOverLifetime,
    pub velocity_over_lifetime: VelocityOverLifetime,
    pub looping: bool,
    pub prewarm: bool,
    pub duration: f32,
    pub delay: f32,
    pub playing: bool,
}

impl Default for ParticleEmitter {
    fn default() -> Self {
        Self {
            max_particles: 1000,
            emission_rate: 10.0,
            emission_burst: 0,
            lifetime_min: 1.0,
            lifetime_max: 2.0,
            start_speed_min: 1.0,
            start_speed_max: 5.0,
            start_size_min: Vec3::one(),
            start_size_max: Vec3::one(),
            start_color: Vec4::one(),
            start_rotation_min: Vec3::zero(),
            start_rotation_max: Vec3::zero(),
            shape: EmitterShape::Cone { angle: 25.0, length: 1.0 },
            simulation_space: SimulationSpace::World,
            gravity: Vec3::new(0.0, -9.81, 0.0),
            drag: 0.0,
            size_over_lifetime: SizeOverLifetime::default(),
            color_over_lifetime: ColorOverLifetime::default(),
            velocity_over_lifetime: VelocityOverLifetime::default(),
            looping: true,
            prewarm: false,
            duration: 5.0,
            delay: 0.0,
            playing: true,
        }
    }
}

impl ParticleEmitter {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_max_particles(mut self, max: usize) -> Self {
        self.max_particles = max;
        self
    }

    pub fn with_emission_rate(mut self, rate: f32) -> Self {
        self.emission_rate = rate;
        self
    }

    pub fn with_lifetime(mut self, min: f32, max: f32) -> Self {
        self.lifetime_min = min;
        self.lifetime_max = max;
        self
    }

    pub fn with_start_speed(mut self, min: f32, max: f32) -> Self {
        self.start_speed_min = min;
        self.start_speed_max = max;
        self
    }

    pub fn with_start_size(mut self, min: f32, max: f32) -> Self {
        self.start_size_min = Vec3::new(min, min, min);
        self.start_size_max = Vec3::new(max, max, max);
        self
    }

    pub fn with_shape(mut self, shape: EmitterShape) -> Self {
        self.shape = shape;
        self
    }

    pub fn with_gravity(mut self, x: f32, y: f32, z: f32) -> Self {
        self.gravity = Vec3::new(x, y, z);
        self
    }

    pub fn with_looping(mut self, looping: bool) -> Self {
        self.looping = looping;
        self
    }

    pub fn play(&mut self) {
        self.playing = true;
    }

    pub fn pause(&mut self) {
        self.playing = false;
    }

    pub fn stop(&mut self) {
        self.playing = false;
    }
}

/// Particle system
#[derive(Debug)]
pub struct ParticleSystem {
    pub emitter: ParticleEmitter,
    pub particles: Vec<Particle>,
    pub active_count: usize,
    pub emission_accumulator: f32,
    pub elapsed_time: f32,
    pub next_particle_id: u32,
}

impl ParticleSystem {
    pub fn new(emitter: ParticleEmitter) -> Self {
        let capacity = emitter.max_particles;
        Self {
            emitter,
            particles: vec![Particle::default(); capacity],
            active_count: 0,
            emission_accumulator: 0.0,
            elapsed_time: 0.0,
            next_particle_id: 1,
        }
    }

    pub fn update(&mut self, delta_time: f32) {
        if !self.emitter.playing {
            return;
        }

        self.elapsed_time += delta_time;

        self.emit_particles(delta_time);
        self.simulate_particles(delta_time);
        self.remove_dead_particles();
    }

    fn emit_particles(&mut self, delta_time: f32) {
        self.emission_accumulator += self.emitter.emission_rate * delta_time;

        let particles_to_emit = self.emission_accumulator.floor() as u32;
        self.emission_accumulator -= particles_to_emit as f32;

        for _ in 0..particles_to_emit {
            self.spawn_particle();
        }
    }

    fn spawn_particle(&mut self) {
        if self.active_count >= self.emitter.max_particles {
            return;
        }

        let index = self.active_count;
        let particle = &mut self.particles[index];

        particle.id = self.next_particle_id;
        self.next_particle_id += 1;

        particle.position = self.get_spawn_position();
        particle.velocity = self.get_spawn_velocity();
        particle.acceleration = Vec3::zero();
        particle.rotation = self.get_spawn_rotation();
        particle.angular_velocity = Vec3::zero();
        particle.scale = self.get_spawn_scale();
        particle.color = self.emitter.start_color;
        particle.lifetime = self.get_lifetime();
        particle.max_lifetime = particle.lifetime;
        particle.age = 0.0;
        particle.active = true;

        self.active_count += 1;
    }

    fn simulate_particles(&mut self, delta_time: f32) {
        for i in 0..self.active_count {
            let particle = &mut self.particles[i];
            if !particle.active {
                continue;
            }

            particle.age += delta_time;
            particle.lifetime -= delta_time;

            if particle.lifetime <= 0.0 {
                particle.active = false;
                continue;
            }

            let life_t = 1.0 - (particle.lifetime / particle.max_lifetime);

            particle.velocity += self.emitter.gravity * delta_time;
            particle.velocity *= 1.0 - self.emitter.drag * delta_time;

            if self.emitter.velocity_over_lifetime.enabled {
                let speed = self.emitter.velocity_over_lifetime.start_speed
                    + (self.emitter.velocity_over_lifetime.end_speed - self.emitter.velocity_over_lifetime.start_speed)
                    * self.emitter.velocity_over_lifetime.curve.evaluate(life_t);
                particle.velocity = particle.velocity.normalized() * speed;
            }

            particle.position += particle.velocity * delta_time;
            particle.rotation += particle.angular_velocity * delta_time;

            if self.emitter.size_over_lifetime.enabled {
                let size_t = self.emitter.size_over_lifetime.curve.evaluate(life_t);
                particle.scale = self.emitter.size_over_lifetime.start_size
                    + (self.emitter.size_over_lifetime.end_size - self.emitter.size_over_lifetime.start_size)
                    * size_t;
            }

            if self.emitter.color_over_lifetime.enabled {
                particle.color = self.emitter.color_over_lifetime.gradient.evaluate(life_t);
            }
        }
    }

    fn remove_dead_particles(&mut self) {
        let mut i = 0;
        while i < self.active_count {
            if !self.particles[i].active {
                self.particles.swap(i, self.active_count - 1);
                self.active_count -= 1;
            } else {
                i += 1;
            }
        }
    }

    fn get_spawn_position(&self) -> Vec3 {
        use rand::Rng;
        let mut rng = rand::thread_rng();

        match self.emitter.shape {
            EmitterShape::Point => Vec3::zero(),
            EmitterShape::Sphere { radius } => {
                let theta = rng.gen_range(0.0..2.0 * PI);
                let phi = rng.gen_range(0.0..PI);
                let r = radius * rng.gen_range(0.0..1.0).cbrt();
                Vec3::new(
                    r * phi.sin() * theta.cos(),
                    r * phi.cos(),
                    r * phi.sin() * theta.sin(),
                )
            }
            EmitterShape::Box { width, height, depth } => {
                Vec3::new(
                    rng.gen_range(-width / 2.0..width / 2.0),
                    rng.gen_range(-height / 2.0..height / 2.0),
                    rng.gen_range(-depth / 2.0..depth / 2.0),
                )
            }
            EmitterShape::Cone { angle, length } => {
                let theta = rng.gen_range(0.0..2.0 * PI);
                let r = rng.gen_range(0.0..length) * (angle.to_radians()).tan();
                Vec3::new(
                    r * theta.cos(),
                    r * theta.sin(),
                    rng.gen_range(0.0..length),
                )
            }
            EmitterShape::Circle { radius } => {
                let theta = rng.gen_range(0.0..2.0 * PI);
                let r = radius * rng.gen_range(0.0..1.0).sqrt();
                Vec3::new(r * theta.cos(), 0.0, r * theta.sin())
            }
            EmitterShape::Line { length } => {
                Vec3::new(0.0, rng.gen_range(0.0..length), 0.0)
            }
            EmitterShape::Mesh { spread } => {
                Vec3::new(
                    rng.gen_range(-spread / 2.0..spread / 2.0),
                    rng.gen_range(-spread / 2.0..spread / 2.0),
                    rng.gen_range(-spread / 2.0..spread / 2.0),
                )
            }
        }
    }

    fn get_spawn_velocity(&self) -> Vec3 {
        use rand::Rng;
        let mut rng = rand::thread_rng();

        let speed = rng.gen_range(self.emitter.start_speed_min..self.emitter.start_speed_max);

        match self.emitter.shape {
            EmitterShape::Cone { angle, .. } => {
                let half_angle = angle.to_radians() / 2.0;
                let theta = rng.gen_range(0.0..2.0 * PI);
                let phi = rng.gen_range(0.0..half_angle);
                Vec3::new(
                    phi.sin() * theta.cos() * speed,
                    phi.sin() * theta.sin() * speed,
                    phi.cos() * speed,
                )
            }
            _ => {
                Vec3::new(
                    rng.gen_range(-1.0..1.0),
                    rng.gen_range(-1.0..1.0),
                    rng.gen_range(-1.0..1.0),
                ).normalized() * speed
            }
        }
    }

    fn get_spawn_rotation(&self) -> Vec3 {
        use rand::Rng;
        let mut rng = rand::thread_rng();
        Vec3::new(
            rng.gen_range(self.emitter.start_rotation_min.x..self.emitter.start_rotation_max.x),
            rng.gen_range(self.emitter.start_rotation_min.y..self.emitter.start_rotation_max.y),
            rng.gen_range(self.emitter.start_rotation_min.z..self.emitter.start_rotation_max.z),
        )
    }

    fn get_spawn_scale(&self) -> Vec3 {
        use rand::Rng;
        let mut rng = rand::thread_rng();
        Vec3::new(
            rng.gen_range(self.emitter.start_size_min.x..self.emitter.start_size_max.x),
            rng.gen_range(self.emitter.start_size_min.y..self.emitter.start_size_max.y),
            rng.gen_range(self.emitter.start_size_min.z..self.emitter.start_size_max.z),
        )
    }

    fn get_lifetime(&self) -> f32 {
        use rand::Rng;
        let mut rng = rand::thread_rng();
        rng.gen_range(self.emitter.lifetime_min..self.emitter.lifetime_max)
    }

    pub fn play(&mut self) {
        self.emitter.play();
    }

    pub fn pause(&mut self) {
        self.emitter.pause();
    }

    pub fn stop(&mut self) {
        self.emitter.stop();
        self.active_count = 0;
        for particle in &mut self.particles {
            particle.active = false;
        }
    }

    pub fn clear(&mut self) {
        self.active_count = 0;
        for particle in &mut self.particles {
            particle.active = false;
        }
    }

    pub fn burst(&mut self, count: u32) {
        for _ in 0..count.min(self.emitter.max_particles as u32) {
            self.spawn_particle();
        }
    }

    pub fn get_active_particles(&self) -> &[Particle] {
        &self.particles[..self.active_count]
    }
}

/// Preset particle effects
pub mod presets {
    use super::*;

    pub fn fire() -> ParticleEmitter {
        let mut gradient = Gradient::new();
        gradient.keys = vec![
            (0.0, Vec4::new(1.0, 1.0, 0.5, 0.8)),
            (0.2, Vec4::new(1.0, 0.5, 0.0, 0.8)),
            (0.5, Vec4::new(0.5, 0.1, 0.0, 0.5)),
            (1.0, Vec4::new(0.0, 0.0, 0.0, 0.0)),
        ];

        ParticleEmitter::new()
            .with_max_particles(500)
            .with_emission_rate(50.0)
            .with_lifetime(0.5, 1.5)
            .with_start_speed(1.0, 3.0)
            .with_start_size(0.5, 1.0)
            .with_shape(EmitterShape::Cone { angle: 15.0, length: 0.5 })
            .with_gravity(0.0, -2.0, 0.0)
    }

    pub fn smoke() -> ParticleEmitter {
        let mut gradient = Gradient::new();
        gradient.keys = vec![
            (0.0, Vec4::new(0.5, 0.5, 0.5, 0.3)),
            (0.5, Vec4::new(0.3, 0.3, 0.3, 0.2)),
            (1.0, Vec4::new(0.2, 0.2, 0.2, 0.0)),
        ];

        ParticleEmitter::new()
            .with_max_particles(300)
            .with_emission_rate(20.0)
            .with_lifetime(2.0, 4.0)
            .with_start_speed(0.5, 1.5)
            .with_start_size(1.0, 2.0)
            .with_shape(EmitterShape::Sphere { radius: 0.5 })
            .with_gravity(0.0, 0.5, 0.0)
    }

    pub fn explosion() -> ParticleEmitter {
        let mut gradient = Gradient::new();
        gradient.keys = vec![
            (0.0, Vec4::new(1.0, 0.8, 0.2, 1.0)),
            (0.1, Vec4::new(1.0, 0.3, 0.0, 1.0)),
            (0.3, Vec4::new(0.5, 0.1, 0.0, 0.8)),
            (1.0, Vec4::new(0.1, 0.05, 0.05, 0.0)),
        ];

        let mut emitter = ParticleEmitter::new()
            .with_max_particles(1000)
            .with_emission_rate(0.0)
            .with_lifetime(0.5, 1.5)
            .with_start_speed(10.0, 30.0)
            .with_start_size(0.5, 1.0)
            .with_shape(EmitterShape::Sphere { radius: 0.1 })
            .with_gravity(0.0, -9.81, 0.0)
            .with_looping(false);

        emitter.emission_burst = 500;
        emitter
    }

    pub fn sparkle() -> ParticleEmitter {
        let mut gradient = Gradient::new();
        gradient.keys = vec![
            (0.0, Vec4::new(1.0, 1.0, 1.0, 1.0)),
            (0.5, Vec4::new(1.0, 0.9, 0.5, 0.8)),
            (1.0, Vec4::new(1.0, 0.5, 0.0, 0.0)),
        ];

        ParticleEmitter::new()
            .with_max_particles(200)
            .with_emission_rate(30.0)
            .with_lifetime(0.5, 1.0)
            .with_start_speed(0.5, 2.0)
            .with_start_size(0.1, 0.3)
            .with_shape(EmitterShape::Sphere { radius: 2.0 })
            .with_gravity(0.0, -1.0, 0.0)
    }

    pub fn rain() -> ParticleEmitter {
        let mut gradient = Gradient::new();
        gradient.keys = vec![
            (0.0, Vec4::new(0.7, 0.8, 1.0, 0.6)),
            (1.0, Vec4::new(0.7, 0.8, 1.0, 0.0)),
        ];

        ParticleEmitter::new()
            .with_max_particles(2000)
            .with_emission_rate(200.0)
            .with_lifetime(1.0, 2.0)
            .with_start_speed(5.0, 10.0)
            .with_start_size(0.05, 0.1)
            .with_shape(EmitterShape::Box { width: 20.0, height: 0.1, depth: 20.0 })
            .with_gravity(0.0, -15.0, 0.0)
    }

    pub fn snow() -> ParticleEmitter {
        let mut gradient = Gradient::new();
        gradient.keys = vec![
            (0.0, Vec4::new(1.0, 1.0, 1.0, 0.8)),
            (1.0, Vec4::new(1.0, 1.0, 1.0, 0.0)),
        ];

        ParticleEmitter::new()
            .with_max_particles(1500)
            .with_emission_rate(100.0)
            .with_lifetime(3.0, 5.0)
            .with_start_speed(0.5, 1.5)
            .with_start_size(0.05, 0.15)
            .with_shape(EmitterShape::Box { width: 20.0, height: 0.1, depth: 20.0 })
            .with_gravity(0.0, -1.0, 0.0)
    }
}
