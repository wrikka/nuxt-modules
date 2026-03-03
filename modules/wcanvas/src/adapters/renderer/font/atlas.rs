use serde::Deserialize;
use std::collections::HashMap;

use crate::adapters::renderer::texture::Texture;

#[derive(Debug, Deserialize)]
pub struct FontAtlas {
    #[serde(rename = "atlas")]
    pub atlas_info: AtlasInfo,
    #[serde(rename = "metrics")]
    pub metrics_info: MetricsInfo,
    #[serde(rename = "glyphs")]
    pub glyphs_info: Vec<GlyphInfo>,

    #[serde(skip)]
    pub texture: Option<Texture>,
    #[serde(skip)]
    glyph_map: HashMap<char, GlyphInfo>,
}

#[derive(Debug, Deserialize)]
pub struct AtlasInfo {
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Deserialize)]
pub struct MetricsInfo {
    #[serde(rename = "lineHeight")]
    pub line_height: f64,
    pub ascender: f64,
    pub descender: f64,
}

#[derive(Debug, Deserialize, Clone)]
pub struct GlyphInfo {
    pub unicode: u32,
    pub advance: f64,
    #[serde(rename = "planeBounds")]
    pub plane_bounds: Option<Bounds>,
    #[serde(rename = "atlasBounds")]
    pub atlas_bounds: Option<Bounds>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Bounds {
    pub left: f64,
    pub bottom: f64,
    pub right: f64,
    pub top: f64,
}

impl FontAtlas {
    pub fn new(
        device: &wgpu::Device,
        queue: &wgpu::Queue,
        atlas_json_bytes: &[u8],
        atlas_image_bytes: &[u8],
    ) -> Result<Self, serde_json::Error> {
        let mut atlas: FontAtlas = serde_json::from_slice(atlas_json_bytes)?;
        let texture = Texture::from_bytes(device, queue, atlas_image_bytes, "font_atlas").unwrap();
        atlas.texture = Some(texture);

        // Create a map for quick glyph lookup
        atlas.glyph_map = atlas
            .glyphs_info
            .iter()
            .map(|g| (std::char::from_u32(g.unicode).unwrap_or('?'), g.clone()))
            .collect();

        Ok(atlas)
    }

    pub fn get_glyph(&self, c: char) -> Option<&GlyphInfo> {
        self.glyph_map.get(&c)
    }
}
