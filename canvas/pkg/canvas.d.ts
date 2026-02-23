/* tslint:disable */
/* eslint-disable */

export class Client {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Renders a frame
   */
  draw(): void;
  /**
   * Resizes the canvas
   */
  resize(width: number, height: number): void;
}

export class Client3d {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  setAutoRotate(enabled: boolean): void;
  draw(): void;
  reset(): void;
  resize(width: number, height: number): void;
}

export class Size {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Canvas width in pixels
   */
  width: number;
  /**
   * Canvas height in pixels
   */
  height: number;
}

export function createClient(canvas: HTMLCanvasElement): Promise<Client>;

export function createClient3d(canvas: HTMLCanvasElement): Promise<Client3d>;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_client3d_free: (a: number, b: number) => void;
  readonly client3d_draw: (a: number) => void;
  readonly client3d_reset: (a: number) => void;
  readonly client3d_resize: (a: number, b: number, c: number) => void;
  readonly client3d_setAutoRotate: (a: number, b: number) => void;
  readonly createClient3d: (a: any) => any;
  readonly __wbg_client_free: (a: number, b: number) => void;
  readonly __wbg_get_size_height: (a: number) => number;
  readonly __wbg_get_size_width: (a: number) => number;
  readonly __wbg_set_size_height: (a: number, b: number) => void;
  readonly __wbg_set_size_width: (a: number, b: number) => void;
  readonly __wbg_size_free: (a: number, b: number) => void;
  readonly client_draw: (a: number) => void;
  readonly client_resize: (a: number, b: number, c: number) => void;
  readonly createClient: (a: any) => any;
  readonly wasm_bindgen__convert__closures_____invoke__h165335fa58188c1a: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__h6340a3d24bc9929e: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__h117acbe3fd438207: (a: number, b: number, c: any) => void;
  readonly wasm_bindgen__closure__destroy__h9651559ad17dc211: (a: number, b: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__hf103af991beac1e6: (a: number, b: number) => number;
  readonly wasm_bindgen__convert__closures_____invoke__hed178cedbd723e99: (a: number, b: number, c: any, d: any) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
