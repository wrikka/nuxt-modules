//! Scene graph for hierarchical transforms

use std::collections::HashMap;
use ultraviolet::{Mat4, Vec3, Quat};

/// Node ID
pub type NodeId = usize;

/// Transform component
#[derive(Debug, Clone, Copy)]
pub struct Transform {
    pub position: Vec3,
    pub rotation: Quat,
    pub scale: Vec3,
    pub local_matrix: Mat4,
    pub world_matrix: Mat4,
    pub dirty: bool,
}

impl Default for Transform {
    fn default() -> Self {
        Self {
            position: Vec3::zero(),
            rotation: Quat::identity(),
            scale: Vec3::one(),
            local_matrix: Mat4::identity(),
            world_matrix: Mat4::identity(),
            dirty: true,
        }
    }
}

impl Transform {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn from_position(x: f32, y: f32, z: f32) -> Self {
        let mut t = Self::new();
        t.set_position(x, y, z);
        t
    }

    pub fn set_position(&mut self, x: f32, y: f32, z: f32) {
        self.position = Vec3::new(x, y, z);
        self.dirty = true;
    }

    pub fn set_rotation_euler(&mut self, pitch: f32, yaw: f32, roll: f32) {
        self.rotation = Quat::from_euler_angles_zyx(pitch, yaw, roll);
        self.dirty = true;
    }

    pub fn set_rotation_quat(&mut self, x: f32, y: f32, z: f32, w: f32) {
        self.rotation = Quat::new(x, y, z, w);
        self.dirty = true;
    }

    pub fn set_scale(&mut self, x: f32, y: f32, z: f32) {
        self.scale = Vec3::new(x, y, z);
        self.dirty = true;
    }

    pub fn set_uniform_scale(&mut self, scale: f32) {
        self.scale = Vec3::new(scale, scale, scale);
        self.dirty = true;
    }

    pub fn translate(&mut self, dx: f32, dy: f32, dz: f32) {
        self.position += Vec3::new(dx, dy, dz);
        self.dirty = true;
    }

    pub fn rotate(&mut self, axis_x: f32, axis_y: f32, axis_z: f32, angle: f32) {
        let axis = Vec3::new(axis_x, axis_y, axis_z).normalized();
        let rotation = Quat::from_axis_angle(axis, angle);
        self.rotation = rotation * self.rotation;
        self.dirty = true;
    }

    pub fn rotate_euler(&mut self, pitch: f32, yaw: f32, roll: f32) {
        let rotation = Quat::from_euler_angles_zyx(pitch, yaw, roll);
        self.rotation = rotation * self.rotation;
        self.dirty = true;
    }

    pub fn look_at(&mut self, target_x: f32, target_y: f32, target_z: f32, up_x: f32, up_y: f32, up_z: f32) {
        let target = Vec3::new(target_x, target_y, target_z);
        let up = Vec3::new(up_x, up_y, up_z);
        let forward = (target - self.position).normalized();
        let right = up.cross(forward).normalized();
        let up = forward.cross(right);

        let rotation_matrix = Mat4::new(
            right.x, right.y, right.z, 0.0,
            up.x, up.y, up.z, 0.0,
            forward.x, forward.y, forward.z, 0.0,
            0.0, 0.0, 0.0, 1.0,
        );

        self.rotation = Quat::from_matrix(rotation_matrix);
        self.dirty = true;
    }

    pub fn update_local_matrix(&mut self) {
        if !self.dirty {
            return;
        }

        let translation = Mat4::from_translation(self.position);
        let rotation = Mat4::from(self.rotation);
        let scale = Mat4::from_nonuniform_scale(self.scale);

        self.local_matrix = translation * rotation * scale;
        self.dirty = false;
    }

    pub fn forward(&self) -> Vec3 {
        self.rotation * Vec3::new(0.0, 0.0, 1.0)
    }

    pub fn right(&self) -> Vec3 {
        self.rotation * Vec3::new(1.0, 0.0, 0.0)
    }

    pub fn up(&self) -> Vec3 {
        self.rotation * Vec3::new(0.0, 1.0, 0.0)
    }
}

/// Scene node data
#[derive(Debug, Clone)]
pub struct Node {
    pub id: NodeId,
    pub name: String,
    pub transform: Transform,
    pub parent: Option<NodeId>,
    pub children: Vec<NodeId>,
    pub visible: bool,
    pub layer: u32,
    pub tag: Option<String>,
}

impl Node {
    pub fn new(id: NodeId, name: impl Into<String>) -> Self {
        Self {
            id,
            name: name.into(),
            transform: Transform::new(),
            parent: None,
            children: Vec::new(),
            visible: true,
            layer: 0,
            tag: None,
        }
    }

    pub fn with_position(mut self, x: f32, y: f32, z: f32) -> Self {
        self.transform.set_position(x, y, z);
        self
    }

    pub fn with_rotation(mut self, pitch: f32, yaw: f32, roll: f32) -> Self {
        self.transform.set_rotation_euler(pitch, yaw, roll);
        self
    }

    pub fn with_scale(mut self, x: f32, y: f32, z: f32) -> Self {
        self.transform.set_scale(x, y, z);
        self
    }

    pub fn with_uniform_scale(mut self, scale: f32) -> Self {
        self.transform.set_uniform_scale(scale);
        self
    }

    pub fn with_tag(mut self, tag: impl Into<String>) -> Self {
        self.tag = Some(tag.into());
        self
    }

    pub fn with_layer(mut self, layer: u32) -> Self {
        self.layer = layer;
        self
    }
}

/// Scene graph
#[derive(Debug)]
pub struct SceneGraph {
    nodes: HashMap<NodeId, Node>,
    next_id: NodeId,
    root_nodes: Vec<NodeId>,
}

impl SceneGraph {
    pub fn new() -> Self {
        Self {
            nodes: HashMap::new(),
            next_id: 1,
            root_nodes: Vec::new(),
        }
    }

    pub fn create_node(&mut self, name: impl Into<String>) -> NodeId {
        let id = self.next_id;
        self.next_id += 1;

        let node = Node::new(id, name);
        self.nodes.insert(id, node);
        self.root_nodes.push(id);

        id
    }

    pub fn create_child(&mut self, parent_id: NodeId, name: impl Into<String>) -> Option<NodeId> {
        if !self.nodes.contains_key(&parent_id) {
            return None;
        }

        let id = self.next_id;
        self.next_id += 1;

        let mut node = Node::new(id, name);
        node.parent = Some(parent_id);

        self.nodes.insert(id, node);
        self.nodes.get_mut(&parent_id).unwrap().children.push(id);

        Some(id)
    }

    pub fn remove_node(&mut self, id: NodeId) -> bool {
        if let Some(node) = self.nodes.remove(&id) {
            if let Some(parent_id) = node.parent {
                if let Some(parent) = self.nodes.get_mut(&parent_id) {
                    parent.children.retain(|&child_id| child_id != id);
                }
            } else {
                self.root_nodes.retain(|&root_id| root_id != id);
            }

            for child_id in node.children {
                self.remove_node(child_id);
            }

            true
        } else {
            false
        }
    }

    pub fn get_node(&self, id: NodeId) -> Option<&Node> {
        self.nodes.get(&id)
    }

    pub fn get_node_mut(&mut self, id: NodeId) -> Option<&mut Node> {
        self.nodes.get_mut(&id)
    }

    pub fn set_parent(&mut self, child_id: NodeId, new_parent_id: Option<NodeId>) -> bool {
        let child = match self.nodes.get(&child_id) {
            Some(n) => n.clone(),
            None => return false,
        };

        if let Some(parent_id) = child.parent {
            if let Some(parent) = self.nodes.get_mut(&parent_id) {
                parent.children.retain(|&id| id != child_id);
            }
        } else {
            self.root_nodes.retain(|&id| id != child_id);
        }

        if let Some(new_parent_id) = new_parent_id {
            if let Some(new_parent) = self.nodes.get_mut(&new_parent_id) {
                new_parent.children.push(child_id);
            }
            if let Some(child) = self.nodes.get_mut(&child_id) {
                child.parent = Some(new_parent_id);
            }
        } else {
            self.root_nodes.push(child_id);
            if let Some(child) = self.nodes.get_mut(&child_id) {
                child.parent = None;
            }
        }

        self.update_transforms();
        true
    }

    pub fn reparent(&mut self, child_id: NodeId, new_parent_id: NodeId) -> bool {
        self.set_parent(child_id, Some(new_parent_id))
    }

    pub fn update_transforms(&mut self) {
        for root_id in &self.root_nodes {
            self.update_node_transform(*root_id, Mat4::identity());
        }
    }

    fn update_node_transform(&mut self, node_id: NodeId, parent_world: Mat4) {
        if let Some(node) = self.nodes.get_mut(&node_id) {
            node.transform.update_local_matrix();
            node.transform.world_matrix = parent_world * node.transform.local_matrix;
            let world = node.transform.world_matrix;

            let children: Vec<NodeId> = node.children.clone();
            for child_id in children {
                self.update_node_transform(child_id, world);
            }
        }
    }

    pub fn find_by_name(&self, name: &str) -> Vec<NodeId> {
        self.nodes
            .iter()
            .filter(|(_, node)| node.name == name)
            .map(|(id, _)| *id)
            .collect()
    }

    pub fn find_by_tag(&self, tag: &str) -> Vec<NodeId> {
        self.nodes
            .iter()
            .filter(|(_, node)| node.tag.as_ref() == Some(&tag.to_string()))
            .map(|(id, _)| *id)
            .collect()
    }

    pub fn get_root_nodes(&self) -> &[NodeId] {
        &self.root_nodes
    }

    pub fn get_children(&self, parent_id: NodeId) -> Option<&[NodeId]> {
        self.nodes.get(&parent_id).map(|n| n.children.as_slice())
    }

    pub fn get_parent(&self, node_id: NodeId) -> Option<NodeId> {
        self.nodes.get(&node_id).and_then(|n| n.parent)
    }

    pub fn iter(&self) -> impl Iterator<Item = (&NodeId, &Node)> {
        self.nodes.iter()
    }

    pub fn iter_mut(&mut self) -> impl Iterator<Item = (&NodeId, &mut Node)> {
        self.nodes.iter_mut()
    }

    pub fn node_count(&self) -> usize {
        self.nodes.len()
    }

    pub fn clear(&mut self) {
        self.nodes.clear();
        self.root_nodes.clear();
        self.next_id = 1;
    }
}

impl Default for SceneGraph {
    fn default() -> Self {
        Self::new()
    }
}
