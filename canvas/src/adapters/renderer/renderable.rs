use wgpu::RenderPass;

#[allow(dead_code)]
pub trait Renderable {
    fn draw<'a>(&'a self, render_pass: &mut RenderPass<'a>);
}
