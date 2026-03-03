let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error(`expected a boolean argument, found ${typeof(n)}`);
    }
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error(`expected a number argument, found ${typeof(n)}`);
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => state.dtor(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (typeof(arg) !== 'string') throw new Error(`expected a string argument, found ${typeof(arg)}`);
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

function wasm_bindgen__convert__closures_____invoke__h165335fa58188c1a(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h165335fa58188c1a(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h117acbe3fd438207(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__h117acbe3fd438207(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__hf103af991beac1e6(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    const ret = wasm.wasm_bindgen__convert__closures_____invoke__hf103af991beac1e6(arg0, arg1);
    return ret !== 0;
}

function wasm_bindgen__convert__closures_____invoke__hed178cedbd723e99(arg0, arg1, arg2, arg3) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.wasm_bindgen__convert__closures_____invoke__hed178cedbd723e99(arg0, arg1, arg2, arg3);
}

const __wbindgen_enum_GpuAddressMode = ["clamp-to-edge", "repeat", "mirror-repeat"];

const __wbindgen_enum_GpuBlendFactor = ["zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant", "src1", "one-minus-src1", "src1-alpha", "one-minus-src1-alpha"];

const __wbindgen_enum_GpuBlendOperation = ["add", "subtract", "reverse-subtract", "min", "max"];

const __wbindgen_enum_GpuBufferBindingType = ["uniform", "storage", "read-only-storage"];

const __wbindgen_enum_GpuCanvasAlphaMode = ["opaque", "premultiplied"];

const __wbindgen_enum_GpuCompareFunction = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"];

const __wbindgen_enum_GpuCullMode = ["none", "front", "back"];

const __wbindgen_enum_GpuDeviceLostReason = ["unknown", "destroyed"];

const __wbindgen_enum_GpuErrorFilter = ["validation", "out-of-memory", "internal"];

const __wbindgen_enum_GpuFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuFrontFace = ["ccw", "cw"];

const __wbindgen_enum_GpuIndexFormat = ["uint16", "uint32"];

const __wbindgen_enum_GpuLoadOp = ["load", "clear"];

const __wbindgen_enum_GpuMipmapFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuPowerPreference = ["low-power", "high-performance"];

const __wbindgen_enum_GpuPrimitiveTopology = ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"];

const __wbindgen_enum_GpuQueryType = ["occlusion", "timestamp"];

const __wbindgen_enum_GpuSamplerBindingType = ["filtering", "non-filtering", "comparison"];

const __wbindgen_enum_GpuStencilOperation = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];

const __wbindgen_enum_GpuStorageTextureAccess = ["write-only", "read-only", "read-write"];

const __wbindgen_enum_GpuStoreOp = ["store", "discard"];

const __wbindgen_enum_GpuTextureAspect = ["all", "stencil-only", "depth-only"];

const __wbindgen_enum_GpuTextureDimension = ["1d", "2d", "3d"];

const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];

const __wbindgen_enum_GpuTextureSampleType = ["float", "unfilterable-float", "depth", "sint", "uint"];

const __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];

const __wbindgen_enum_GpuVertexFormat = ["uint8", "uint8x2", "uint8x4", "sint8", "sint8x2", "sint8x4", "unorm8", "unorm8x2", "unorm8x4", "snorm8", "snorm8x2", "snorm8x4", "uint16", "uint16x2", "uint16x4", "sint16", "sint16x2", "sint16x4", "unorm16", "unorm16x2", "unorm16x4", "snorm16", "snorm16x2", "snorm16x4", "float16", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4", "unorm10-10-10-2", "unorm8x4-bgra"];

const __wbindgen_enum_GpuVertexStepMode = ["vertex", "instance"];

const ClientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_client_free(ptr >>> 0, 1));

const Client3dFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_client3d_free(ptr >>> 0, 1));

const SizeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_size_free(ptr >>> 0, 1));

/**
 * WebGPU canvas client for high-performance rendering
 */
export class Client {
    constructor() {
        throw new Error('cannot invoke `new` directly');
    }
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Client.prototype);
        obj.__wbg_ptr = ptr;
        ClientFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ClientFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_client_free(ptr, 0);
    }
    /**
     * Renders a frame
     */
    draw() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        wasm.client_draw(this.__wbg_ptr);
    }
    /**
     * Resizes the canvas
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(width);
        _assertNum(height);
        wasm.client_resize(this.__wbg_ptr, width, height);
    }
}
if (Symbol.dispose) Client.prototype[Symbol.dispose] = Client.prototype.free;

export class Client3d {
    constructor() {
        throw new Error('cannot invoke `new` directly');
    }
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Client3d.prototype);
        obj.__wbg_ptr = ptr;
        Client3dFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Client3dFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_client3d_free(ptr, 0);
    }
    /**
     * @param {boolean} enabled
     */
    setAutoRotate(enabled) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertBoolean(enabled);
        wasm.client3d_setAutoRotate(this.__wbg_ptr, enabled);
    }
    draw() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        wasm.client3d_draw(this.__wbg_ptr);
    }
    reset() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        wasm.client3d_reset(this.__wbg_ptr);
    }
    /**
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(width);
        _assertNum(height);
        wasm.client3d_resize(this.__wbg_ptr, width, height);
    }
}
if (Symbol.dispose) Client3d.prototype[Symbol.dispose] = Client3d.prototype.free;

export class Size {
    constructor() {
        throw new Error('cannot invoke `new` directly');
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SizeFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_size_free(ptr, 0);
    }
    /**
     * Canvas width in pixels
     * @returns {number}
     */
    get width() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_size_width(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Canvas width in pixels
     * @param {number} arg0
     */
    set width(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(arg0);
        wasm.__wbg_set_size_width(this.__wbg_ptr, arg0);
    }
    /**
     * Canvas height in pixels
     * @returns {number}
     */
    get height() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_size_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Canvas height in pixels
     * @param {number} arg0
     */
    set height(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(arg0);
        wasm.__wbg_set_size_height(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Size.prototype[Symbol.dispose] = Size.prototype.free;

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<Client>}
 */
export function createClient(canvas) {
    const ret = wasm.createClient(canvas);
    return ret;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<Client3d>}
 */
export function createClient3d(canvas) {
    const ret = wasm.createClient3d(canvas);
    return ret;
}

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_Window_7b2011a6368164ef = function() { return logError(function (arg0) {
        const ret = arg0.Window;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_WorkerGlobalScope_4bddbcb12b3f5a28 = function() { return logError(function (arg0) {
        const ret = arg0.WorkerGlobalScope;
        return ret;
    }, arguments) };
    imports.wbg.__wbg___wbindgen_debug_string_adfb662ae34724b6 = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg___wbindgen_is_function_8d400b8b1af978cd = function(arg0) {
        const ret = typeof(arg0) === 'function';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_null_dfda7d66506c95b5 = function(arg0) {
        const ret = arg0 === null;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_object_ce774f3490692386 = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_undefined_f6b95eab589e0269 = function(arg0) {
        const ret = arg0 === undefined;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_string_get_a2a31e16edf96e42 = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg__wbg_cb_unref_87dfb5aaa0cbcea7 = function() { return logError(function (arg0) {
        arg0._wbg_cb_unref();
    }, arguments) };
    imports.wbg.__wbg_beginComputePass_8971ad8382254094 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.beginComputePass(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_beginRenderPass_599b98d9a6ba5692 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.beginRenderPass(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buffer_6cb2fecb1f253d71 = function() { return logError(function (arg0) {
        const ret = arg0.buffer;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_3020136f7a2d6e44 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_abb4ff46ce38be40 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clearBuffer_90dd5c24d3374f2d = function() { return logError(function (arg0, arg1, arg2, arg3) {
        arg0.clearBuffer(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_clearBuffer_ecde8985ebb316ea = function() { return logError(function (arg0, arg1, arg2) {
        arg0.clearBuffer(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_client3d_new = function() { return logError(function (arg0) {
        const ret = Client3d.__wrap(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_client_new = function() { return logError(function (arg0) {
        const ret = Client.__wrap(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_configure_bee5e0250d8526d5 = function() { return handleError(function (arg0, arg1) {
        arg0.configure(arg1);
    }, arguments) };
    imports.wbg.__wbg_copyBufferToBuffer_3e2b8d1e524281f5 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.copyBufferToBuffer(arg1, arg2, arg3, arg4, arg5);
    }, arguments) };
    imports.wbg.__wbg_copyBufferToBuffer_6a6449c0e5793f4c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.copyBufferToBuffer(arg1, arg2, arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_copyBufferToTexture_1a28136f43dc6ddd = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.copyBufferToTexture(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_copyExternalImageToTexture_27cc97955849d4dc = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.copyExternalImageToTexture(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_copyTextureToBuffer_d24dda6fabc7ee56 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.copyTextureToBuffer(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_copyTextureToTexture_bf93074b99536fcf = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.copyTextureToTexture(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_createBindGroupLayout_f543b79f894eed2e = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createBindGroupLayout(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBindGroup_06db01d96df151a7 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createBindGroup(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBuffer_6e69283608e8f98f = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createBuffer(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createCommandEncoder_88e8ef64b19cdb2c = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createCommandEncoder(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createComputePipeline_d24ca7b211444394 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createComputePipeline(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createPipelineLayout_0f960a922b66be56 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createPipelineLayout(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createQuerySet_23e578b66db97e49 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createQuerySet(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createRenderBundleEncoder_a372ee6ba86577dc = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createRenderBundleEncoder(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createRenderPipeline_725209221f17f288 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createRenderPipeline(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createSampler_36aca895fb724d8b = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createSampler(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createShaderModule_714b17aece65828e = function() { return logError(function (arg0, arg1) {
        const ret = arg0.createShaderModule(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createTask_432d6d38dc688bee = function() { return handleError(function (arg0, arg1) {
        const ret = console.createTask(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createTexture_63195fd0d63c3a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createTexture(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createView_79f49fbd3fb5f94f = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createView(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_destroy_7602e890b930bb90 = function() { return logError(function (arg0) {
        arg0.destroy();
    }, arguments) };
    imports.wbg.__wbg_destroy_9155d0887cf67205 = function() { return logError(function (arg0) {
        arg0.destroy();
    }, arguments) };
    imports.wbg.__wbg_destroy_aae96ad45238cff2 = function() { return logError(function (arg0) {
        arg0.destroy();
    }, arguments) };
    imports.wbg.__wbg_document_5b745e82ba551ca5 = function() { return logError(function (arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_done_62ea16af4ce34b24 = function() { return logError(function (arg0) {
        const ret = arg0.done;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_drawIndexedIndirect_5502f87d16fa681a = function() { return logError(function (arg0, arg1, arg2) {
        arg0.drawIndexedIndirect(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_drawIndexed_c47b56e3bafadecb = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.drawIndexed(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_drawIndirect_fb473a1c2f258da2 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.drawIndirect(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_draw_3f782f0d09a907da = function() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_end_8bb194afb9988691 = function() { return logError(function (arg0) {
        arg0.end();
    }, arguments) };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function() { return logError(function (arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_error_c1c426d1ef02ccf6 = function() { return logError(function (arg0) {
        const ret = arg0.error;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_executeBundles_de62b9f5a1376f4b = function() { return logError(function (arg0, arg1) {
        arg0.executeBundles(arg1);
    }, arguments) };
    imports.wbg.__wbg_features_2dff276169fd5138 = function() { return logError(function (arg0) {
        const ret = arg0.features;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_features_5d2c2677affa352d = function() { return logError(function (arg0) {
        const ret = arg0.features;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_finish_08e2d7b08c066b25 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.finish(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_finish_5ebfba3167b3092c = function() { return logError(function (arg0) {
        const ret = arg0.finish();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getContext_01f42b234e833f0a = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getContext_2f210d0a58d43d95 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getCurrentTexture_6dc4d0ea8555e374 = function() { return handleError(function (arg0) {
        const ret = arg0.getCurrentTexture();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getMappedRange_3cb6354f7963e27e = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getMappedRange(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getPreferredCanvasFormat_06854455b835cf40 = function() { return logError(function (arg0) {
        const ret = arg0.getPreferredCanvasFormat();
        return (__wbindgen_enum_GpuTextureFormat.indexOf(ret) + 1 || 96) - 1;
    }, arguments) };
    imports.wbg.__wbg_get_c53d381635aa3929 = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_gpu_653e59c6ae8028a8 = function() { return logError(function (arg0) {
        const ret = arg0.gpu;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_has_f1efef5b257eade8 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.has(getStringFromWasm0(arg1, arg2));
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_height_a07787f693c253d2 = function() { return logError(function (arg0) {
        const ret = arg0.height;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_GpuAdapter_b2c1300e425af95c = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof GPUAdapter;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_GpuCanvasContext_c9b75b4b7dc7555e = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof GPUCanvasContext;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_GpuDeviceLostInfo_d07227c7621bedb8 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof GPUDeviceLostInfo;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_GpuOutOfMemoryError_36be198c7584d724 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof GPUOutOfMemoryError;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_GpuValidationError_9f5a409dc19b2a44 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof GPUValidationError;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Object_577e21051f7bcb79 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Object;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Window_b5cf7783caa68180 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_keys_f0752df54b3ecc47 = function() { return logError(function (arg0) {
        const ret = arg0.keys();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_label_f279af9fe090b53f = function() { return logError(function (arg0, arg1) {
        const ret = arg1.label;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_length_22ac23eaec9d8053 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_limits_486026e4aa69b9b2 = function() { return logError(function (arg0) {
        const ret = arg0.limits;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_limits_59402e6db2c6b230 = function() { return logError(function (arg0) {
        const ret = arg0.limits;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_lost_494e98e7ee6d8da8 = function() { return logError(function (arg0) {
        const ret = arg0.lost;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_mapAsync_e89ffbd0722e6025 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.mapAsync(arg1 >>> 0, arg2, arg3);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxBindGroups_52e3144d1d4f3951 = function() { return logError(function (arg0) {
        const ret = arg0.maxBindGroups;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxBindingsPerBindGroup_8e383157db4cfd9d = function() { return logError(function (arg0) {
        const ret = arg0.maxBindingsPerBindGroup;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxBufferSize_4bed0deb2b5570bc = function() { return logError(function (arg0) {
        const ret = arg0.maxBufferSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxColorAttachmentBytesPerSample_2ded1d176129b49e = function() { return logError(function (arg0) {
        const ret = arg0.maxColorAttachmentBytesPerSample;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxColorAttachments_a363e1f84136b445 = function() { return logError(function (arg0) {
        const ret = arg0.maxColorAttachments;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeInvocationsPerWorkgroup_8c8259a34a467300 = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeInvocationsPerWorkgroup;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeWorkgroupSizeX_6a123a5258a37c70 = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeWorkgroupSizeX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeWorkgroupSizeY_212a6e863b315f06 = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeWorkgroupSizeY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeWorkgroupSizeZ_53a8c06a42e0daa4 = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeWorkgroupSizeZ;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeWorkgroupStorageSize_0940bd6b70d5ee03 = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeWorkgroupStorageSize;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxComputeWorkgroupsPerDimension_155968404880d2bc = function() { return logError(function (arg0) {
        const ret = arg0.maxComputeWorkgroupsPerDimension;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxDynamicStorageBuffersPerPipelineLayout_7d88fb9026cd8af3 = function() { return logError(function (arg0) {
        const ret = arg0.maxDynamicStorageBuffersPerPipelineLayout;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxDynamicUniformBuffersPerPipelineLayout_146ac1a721fbca9b = function() { return logError(function (arg0) {
        const ret = arg0.maxDynamicUniformBuffersPerPipelineLayout;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxSampledTexturesPerShaderStage_10ee96b97a701e05 = function() { return logError(function (arg0) {
        const ret = arg0.maxSampledTexturesPerShaderStage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxSamplersPerShaderStage_7546a712e69839d0 = function() { return logError(function (arg0) {
        const ret = arg0.maxSamplersPerShaderStage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxStorageBufferBindingSize_6f36ebfc9d4874d1 = function() { return logError(function (arg0) {
        const ret = arg0.maxStorageBufferBindingSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxStorageBuffersPerShaderStage_ad3988a66894ccd8 = function() { return logError(function (arg0) {
        const ret = arg0.maxStorageBuffersPerShaderStage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxStorageTexturesPerShaderStage_3c4b0fd6cdb25d2f = function() { return logError(function (arg0) {
        const ret = arg0.maxStorageTexturesPerShaderStage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxTextureArrayLayers_596c959454186b7e = function() { return logError(function (arg0) {
        const ret = arg0.maxTextureArrayLayers;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxTextureDimension1D_395c7225194787e6 = function() { return logError(function (arg0) {
        const ret = arg0.maxTextureDimension1D;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxTextureDimension2D_1c70c07372595733 = function() { return logError(function (arg0) {
        const ret = arg0.maxTextureDimension2D;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxTextureDimension3D_c2c0b973db2f7087 = function() { return logError(function (arg0) {
        const ret = arg0.maxTextureDimension3D;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxUniformBufferBindingSize_18e95cb371149021 = function() { return logError(function (arg0) {
        const ret = arg0.maxUniformBufferBindingSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxUniformBuffersPerShaderStage_e21721df6407d356 = function() { return logError(function (arg0) {
        const ret = arg0.maxUniformBuffersPerShaderStage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxVertexAttributes_3685d049fb4b9557 = function() { return logError(function (arg0) {
        const ret = arg0.maxVertexAttributes;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxVertexBufferArrayStride_799ce7d416969442 = function() { return logError(function (arg0) {
        const ret = arg0.maxVertexBufferArrayStride;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_maxVertexBuffers_9e36c1cf99fac3d6 = function() { return logError(function (arg0) {
        const ret = arg0.maxVertexBuffers;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_message_622af13c44fafefe = function() { return logError(function (arg0, arg1) {
        const ret = arg1.message;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_message_b173dc74ecacb5d2 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.message;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_minStorageBufferOffsetAlignment_04598b6c2361de5d = function() { return logError(function (arg0) {
        const ret = arg0.minStorageBufferOffsetAlignment;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_minUniformBufferOffsetAlignment_0743900952f2cbce = function() { return logError(function (arg0) {
        const ret = arg0.minUniformBufferOffsetAlignment;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_navigator_11b7299bb7886507 = function() { return logError(function (arg0) {
        const ret = arg0.navigator;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_navigator_b49edef831236138 = function() { return logError(function (arg0) {
        const ret = arg0.navigator;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_1ba21ce319a06297 = function() { return logError(function () {
        const ret = new Object();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_25f239778d6112b9 = function() { return logError(function () {
        const ret = new Array();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() { return logError(function () {
        const ret = new Error();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_ff12d2b041fb48f1 = function() { return logError(function (arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return wasm_bindgen__convert__closures_____invoke__hed178cedbd723e99(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    }, arguments) };
    imports.wbg.__wbg_new_from_slice_f9c22b9153b26992 = function() { return logError(function (arg0, arg1) {
        const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_no_args_cb138f77cf6151ee = function() { return logError(function (arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_with_byte_offset_and_length_d85c3da1fd8df149 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_3cfe5c0fe2a4cc53 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_onSubmittedWorkDone_babe5ab237e856ff = function() { return logError(function (arg0) {
        const ret = arg0.onSubmittedWorkDone();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_popErrorScope_e824ee97fc4191f3 = function() { return logError(function (arg0) {
        const ret = arg0.popErrorScope();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_prototypesetcall_dfe9b766cdc1f1fd = function() { return logError(function (arg0, arg1, arg2) {
        Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
    }, arguments) };
    imports.wbg.__wbg_pushErrorScope_6ed69f7e8013c9c8 = function() { return logError(function (arg0, arg1) {
        arg0.pushErrorScope(__wbindgen_enum_GpuErrorFilter[arg1]);
    }, arguments) };
    imports.wbg.__wbg_push_7d9be8f38fc13975 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.push(arg1);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_querySelectorAll_aa1048eae18f6f1a = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.querySelectorAll(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_9b549dfce8865860 = function() { return logError(function (arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_fca69f5bfad613a5 = function() { return logError(function (arg0) {
        queueMicrotask(arg0);
    }, arguments) };
    imports.wbg.__wbg_queue_13a5c48e3c54a28c = function() { return logError(function (arg0) {
        const ret = arg0.queue;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_reason_70f510afd8774d84 = function() { return logError(function (arg0) {
        const ret = arg0.reason;
        return (__wbindgen_enum_GpuDeviceLostReason.indexOf(ret) + 1 || 3) - 1;
    }, arguments) };
    imports.wbg.__wbg_requestAdapter_cc9a9924f72519ab = function() { return logError(function (arg0, arg1) {
        const ret = arg0.requestAdapter(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_requestDevice_295504649d1da14c = function() { return logError(function (arg0, arg1) {
        const ret = arg0.requestDevice(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_resolveQuerySet_58d78db4578ebdb5 = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.resolveQuerySet(arg1, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_resolve_fd5bfbaa4ce36e1e = function() { return logError(function (arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_run_51bf644e39739ca6 = function() { return logError(function (arg0, arg1, arg2) {
        try {
            var state0 = {a: arg1, b: arg2};
            var cb0 = () => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return wasm_bindgen__convert__closures_____invoke__hf103af991beac1e6(a, state0.b, );
                } finally {
                    state0.a = a;
                }
            };
            const ret = arg0.run(cb0);
            _assertBoolean(ret);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    }, arguments) };
    imports.wbg.__wbg_setBindGroup_bf7233e51ee0fd56 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.setBindGroup(arg1 >>> 0, arg2);
    }, arguments) };
    imports.wbg.__wbg_setBindGroup_c532d9e80c3b863a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_setBlendConstant_1c24115d90a69114 = function() { return handleError(function (arg0, arg1) {
        arg0.setBlendConstant(arg1);
    }, arguments) };
    imports.wbg.__wbg_setIndexBuffer_d5812b7c5ff15c50 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3);
    }, arguments) };
    imports.wbg.__wbg_setIndexBuffer_d6851b016152211a = function() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_setPipeline_b632e313f54b1cb1 = function() { return logError(function (arg0, arg1) {
        arg0.setPipeline(arg1);
    }, arguments) };
    imports.wbg.__wbg_setScissorRect_13be2665184d6e20 = function() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setScissorRect(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_setStencilReference_0e9e96a76b035161 = function() { return logError(function (arg0, arg1) {
        arg0.setStencilReference(arg1 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_setVertexBuffer_71f6b6b9f7c32e99 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_setVertexBuffer_c8234139ead62a61 = function() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_setViewport_b25340c5cfc5e64f = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.setViewport(arg1, arg2, arg3, arg4, arg5, arg6);
    }, arguments) };
    imports.wbg.__wbg_set_781438a03c0c3c81 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_a_e87a2053d5fccb4c = function() { return logError(function (arg0, arg1) {
        arg0.a = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_access_69d91e9d4e4ceac2 = function() { return logError(function (arg0, arg1) {
        arg0.access = __wbindgen_enum_GpuStorageTextureAccess[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_address_mode_u_17e91ba6701d7cdf = function() { return logError(function (arg0, arg1) {
        arg0.addressModeU = __wbindgen_enum_GpuAddressMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_address_mode_v_83cff33885b49fd0 = function() { return logError(function (arg0, arg1) {
        arg0.addressModeV = __wbindgen_enum_GpuAddressMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_address_mode_w_2445963d0feae757 = function() { return logError(function (arg0, arg1) {
        arg0.addressModeW = __wbindgen_enum_GpuAddressMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_alpha_a7a68e5ec04efe77 = function() { return logError(function (arg0, arg1) {
        arg0.alpha = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_alpha_mode_60f87267fa3d95d0 = function() { return logError(function (arg0, arg1) {
        arg0.alphaMode = __wbindgen_enum_GpuCanvasAlphaMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_alpha_to_coverage_enabled_67782b8fff854d06 = function() { return logError(function (arg0, arg1) {
        arg0.alphaToCoverageEnabled = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_array_layer_count_2bd74e56899b603a = function() { return logError(function (arg0, arg1) {
        arg0.arrayLayerCount = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_array_stride_acb85bd3848529a6 = function() { return logError(function (arg0, arg1) {
        arg0.arrayStride = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_aspect_01abc5aa9afad261 = function() { return logError(function (arg0, arg1) {
        arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_aspect_82ca9caa27a4c533 = function() { return logError(function (arg0, arg1) {
        arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_aspect_b78bd0b34ebfe19b = function() { return logError(function (arg0, arg1) {
        arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_attributes_4d5de6c80e3a7e73 = function() { return logError(function (arg0, arg1) {
        arg0.attributes = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_b_87725d82ac69a631 = function() { return logError(function (arg0, arg1) {
        arg0.b = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_base_array_layer_064977086530f2e7 = function() { return logError(function (arg0, arg1) {
        arg0.baseArrayLayer = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_base_mip_level_845abe28a57bd901 = function() { return logError(function (arg0, arg1) {
        arg0.baseMipLevel = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_bc3a432bdcd60886 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_set_beginning_of_pass_write_index_18bb7ab9fb16de02 = function() { return logError(function (arg0, arg1) {
        arg0.beginningOfPassWriteIndex = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_beginning_of_pass_write_index_1d1dcdf984952e54 = function() { return logError(function (arg0, arg1) {
        arg0.beginningOfPassWriteIndex = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_bind_group_layouts_db65f9787380e242 = function() { return logError(function (arg0, arg1) {
        arg0.bindGroupLayouts = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_binding_35fa28beda49ff83 = function() { return logError(function (arg0, arg1) {
        arg0.binding = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_binding_3b4abee15b11f6ec = function() { return logError(function (arg0, arg1) {
        arg0.binding = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_blend_21337ec514ad2280 = function() { return logError(function (arg0, arg1) {
        arg0.blend = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_buffer_a9223dfcc0e34853 = function() { return logError(function (arg0, arg1) {
        arg0.buffer = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_buffer_d49e95bb5349d827 = function() { return logError(function (arg0, arg1) {
        arg0.buffer = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_buffer_f8967886328760f6 = function() { return logError(function (arg0, arg1) {
        arg0.buffer = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_buffers_68609a5d48c31b27 = function() { return logError(function (arg0, arg1) {
        arg0.buffers = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_bytes_per_row_1ee6dfa31a861d51 = function() { return logError(function (arg0, arg1) {
        arg0.bytesPerRow = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_bytes_per_row_4a52bbf4cdbfe78b = function() { return logError(function (arg0, arg1) {
        arg0.bytesPerRow = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_clear_value_8fc3623594df71b2 = function() { return logError(function (arg0, arg1) {
        arg0.clearValue = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_code_20093e29960281f8 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.code = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_color_64a633bf7b4cf6fe = function() { return logError(function (arg0, arg1) {
        arg0.color = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_color_attachments_4d4c71d7eeba8e2f = function() { return logError(function (arg0, arg1) {
        arg0.colorAttachments = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_color_formats_124c2fc8ea5f658d = function() { return logError(function (arg0, arg1) {
        arg0.colorFormats = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_compare_0376672b0c0bbfd8 = function() { return logError(function (arg0, arg1) {
        arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_compare_f3fb77a9bf3f0f7e = function() { return logError(function (arg0, arg1) {
        arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_compute_937f4ee700e465ff = function() { return logError(function (arg0, arg1) {
        arg0.compute = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_count_6f4f66c8eedc9bba = function() { return logError(function (arg0, arg1) {
        arg0.count = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_count_8cf9a3dd1ffc7b7d = function() { return logError(function (arg0, arg1) {
        arg0.count = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_cull_mode_41c12526410d3e05 = function() { return logError(function (arg0, arg1) {
        arg0.cullMode = __wbindgen_enum_GpuCullMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_bias_31554aeaaa675954 = function() { return logError(function (arg0, arg1) {
        arg0.depthBias = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_bias_clamp_8cf5f4f0d80e8cba = function() { return logError(function (arg0, arg1) {
        arg0.depthBiasClamp = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_bias_slope_scale_310ae406f2d3a055 = function() { return logError(function (arg0, arg1) {
        arg0.depthBiasSlopeScale = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_clear_value_8760aafb583d5312 = function() { return logError(function (arg0, arg1) {
        arg0.depthClearValue = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_compare_8831904ce3173063 = function() { return logError(function (arg0, arg1) {
        arg0.depthCompare = __wbindgen_enum_GpuCompareFunction[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_fail_op_62ec602580477afc = function() { return logError(function (arg0, arg1) {
        arg0.depthFailOp = __wbindgen_enum_GpuStencilOperation[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_load_op_102d57f3ddf95461 = function() { return logError(function (arg0, arg1) {
        arg0.depthLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_or_array_layers_d7b93db07c5da69d = function() { return logError(function (arg0, arg1) {
        arg0.depthOrArrayLayers = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_depth_read_only_aebc24a542debafd = function() { return logError(function (arg0, arg1) {
        arg0.depthReadOnly = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_depth_read_only_efe1c5933ff74d4e = function() { return logError(function (arg0, arg1) {
        arg0.depthReadOnly = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_depth_stencil_5627e73aaf33912c = function() { return logError(function (arg0, arg1) {
        arg0.depthStencil = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_stencil_attachment_04b936535778e362 = function() { return logError(function (arg0, arg1) {
        arg0.depthStencilAttachment = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_depth_stencil_format_9206864898d88c62 = function() { return logError(function (arg0, arg1) {
        arg0.depthStencilFormat = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_store_op_610b0a50dbb00eb8 = function() { return logError(function (arg0, arg1) {
        arg0.depthStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_depth_write_enabled_f94217df9ff2d60c = function() { return logError(function (arg0, arg1) {
        arg0.depthWriteEnabled = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_device_dab18ead7bfc077b = function() { return logError(function (arg0, arg1) {
        arg0.device = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_dimension_2a75a794a0bfcc94 = function() { return logError(function (arg0, arg1) {
        arg0.dimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_dimension_a3c50fb6d43f6cec = function() { return logError(function (arg0, arg1) {
        arg0.dimension = __wbindgen_enum_GpuTextureDimension[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_dst_factor_cf872fec841747ac = function() { return logError(function (arg0, arg1) {
        arg0.dstFactor = __wbindgen_enum_GpuBlendFactor[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_end_of_pass_write_index_02ee5189026c1d3a = function() { return logError(function (arg0, arg1) {
        arg0.endOfPassWriteIndex = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_end_of_pass_write_index_12c25e0a48d5aa5c = function() { return logError(function (arg0, arg1) {
        arg0.endOfPassWriteIndex = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_entries_1472deaee7053fb7 = function() { return logError(function (arg0, arg1) {
        arg0.entries = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_entries_b2258b5ef29810b0 = function() { return logError(function (arg0, arg1) {
        arg0.entries = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_entry_point_11f912102ade99b1 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_entry_point_7f546bbf1e63e58d = function() { return logError(function (arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_entry_point_f9224cdb29cbe5df = function() { return logError(function (arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_external_texture_613e4434100d63ee = function() { return logError(function (arg0, arg1) {
        arg0.externalTexture = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_fail_op_73a4e194f4bc914a = function() { return logError(function (arg0, arg1) {
        arg0.failOp = __wbindgen_enum_GpuStencilOperation[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_flip_y_330c483dc6f7916c = function() { return logError(function (arg0, arg1) {
        arg0.flipY = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_format_1670e760e18ac001 = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_2141a8a1fd36fb9c = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_25e4aacc74949e38 = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_3f7008e9e568f0fc = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuVertexFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_4a4fccdfc45bc409 = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_7696f8290da8a36b = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_format_974a01725f579c5d = function() { return logError(function (arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_fragment_f7ce64feaf1cd7dc = function() { return logError(function (arg0, arg1) {
        arg0.fragment = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_front_face_09e32557f8852301 = function() { return logError(function (arg0, arg1) {
        arg0.frontFace = __wbindgen_enum_GpuFrontFace[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_g_c31c959457596456 = function() { return logError(function (arg0, arg1) {
        arg0.g = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_has_dynamic_offset_fbc1bb343939ed0b = function() { return logError(function (arg0, arg1) {
        arg0.hasDynamicOffset = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_height_6f8f8ef4cb40e496 = function() { return logError(function (arg0, arg1) {
        arg0.height = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_height_710b87344b3d6748 = function() { return logError(function (arg0, arg1) {
        arg0.height = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_height_afe09c24165867f7 = function() { return logError(function (arg0, arg1) {
        arg0.height = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_label_026fd015857827ae = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_0ec13ba975f77124 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_3b658d9ce970552c = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_48883f5f49e4ec47 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_4bbbc289ddddebd7 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_4d609666f09cfdfb = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_4f4264b0041180e2 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_5b46e419b9e88c5e = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_95423cd2e1f4b5dd = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_9acf6c263479f46f = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_ad0f2c69b41c3483 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_c3fc0a66f4ecc82b = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_c857f45a8485236a = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_d0fd4d4810525bf2 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_dc8df9969898889c = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_e3709fe3e82429b5 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_label_fb5d28b3ba7af11f = function() { return logError(function (arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_layout_170ec6b8aa37178f = function() { return logError(function (arg0, arg1) {
        arg0.layout = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_layout_7f76289be3294b4a = function() { return logError(function (arg0, arg1) {
        arg0.layout = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_layout_c20d48b352b24c1b = function() { return logError(function (arg0, arg1) {
        arg0.layout = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_load_op_c71d200e998908b0 = function() { return logError(function (arg0, arg1) {
        arg0.loadOp = __wbindgen_enum_GpuLoadOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_lod_max_clamp_aaac5daaecca96d4 = function() { return logError(function (arg0, arg1) {
        arg0.lodMaxClamp = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_lod_min_clamp_ed2162d4b198abba = function() { return logError(function (arg0, arg1) {
        arg0.lodMinClamp = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_mag_filter_c8a8c1218cd38da6 = function() { return logError(function (arg0, arg1) {
        arg0.magFilter = __wbindgen_enum_GpuFilterMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_mapped_at_creation_2d003ce549611385 = function() { return logError(function (arg0, arg1) {
        arg0.mappedAtCreation = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_mask_a933ba2e61c7610a = function() { return logError(function (arg0, arg1) {
        arg0.mask = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_max_anisotropy_fb4bae64cb5acf57 = function() { return logError(function (arg0, arg1) {
        arg0.maxAnisotropy = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_min_binding_size_308360802ae7a9ba = function() { return logError(function (arg0, arg1) {
        arg0.minBindingSize = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_min_filter_2dafbdeb188fd817 = function() { return logError(function (arg0, arg1) {
        arg0.minFilter = __wbindgen_enum_GpuFilterMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_mip_level_4b256e2cda4a4c5c = function() { return logError(function (arg0, arg1) {
        arg0.mipLevel = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_mip_level_babe1ff64201f0ea = function() { return logError(function (arg0, arg1) {
        arg0.mipLevel = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_mip_level_count_cd3197411f4f2432 = function() { return logError(function (arg0, arg1) {
        arg0.mipLevelCount = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_mip_level_count_fdc72450a94244ef = function() { return logError(function (arg0, arg1) {
        arg0.mipLevelCount = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_mipmap_filter_79f552c459e63aa6 = function() { return logError(function (arg0, arg1) {
        arg0.mipmapFilter = __wbindgen_enum_GpuMipmapFilterMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_module_18d541838665d831 = function() { return logError(function (arg0, arg1) {
        arg0.module = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_module_20641353ebb28712 = function() { return logError(function (arg0, arg1) {
        arg0.module = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_module_6ece909be28666dd = function() { return logError(function (arg0, arg1) {
        arg0.module = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_multisample_e0f310ea9e40c2d9 = function() { return logError(function (arg0, arg1) {
        arg0.multisample = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_multisampled_cd50d8f6709cea1a = function() { return logError(function (arg0, arg1) {
        arg0.multisampled = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_offset_2e78915f5d65d704 = function() { return logError(function (arg0, arg1) {
        arg0.offset = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_offset_405017033a936d89 = function() { return logError(function (arg0, arg1) {
        arg0.offset = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_offset_e7ce8b8eaaf46b95 = function() { return logError(function (arg0, arg1) {
        arg0.offset = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_offset_efe9880f803c2500 = function() { return logError(function (arg0, arg1) {
        arg0.offset = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onuncapturederror_87bababe367ddca7 = function() { return logError(function (arg0, arg1) {
        arg0.onuncapturederror = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_operation_b96fabca3716aaa3 = function() { return logError(function (arg0, arg1) {
        arg0.operation = __wbindgen_enum_GpuBlendOperation[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_origin_7561d69f0dc1ba08 = function() { return logError(function (arg0, arg1) {
        arg0.origin = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_origin_c2a973e78d223dd6 = function() { return logError(function (arg0, arg1) {
        arg0.origin = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_origin_c5f017d3f09ad7ff = function() { return logError(function (arg0, arg1) {
        arg0.origin = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_pass_op_765be90bb2f27220 = function() { return logError(function (arg0, arg1) {
        arg0.passOp = __wbindgen_enum_GpuStencilOperation[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_power_preference_39b347bf0d236ce6 = function() { return logError(function (arg0, arg1) {
        arg0.powerPreference = __wbindgen_enum_GpuPowerPreference[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_premultiplied_alpha_3664301ff462d8bc = function() { return logError(function (arg0, arg1) {
        arg0.premultipliedAlpha = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_primitive_d6456d7efe6b4fe5 = function() { return logError(function (arg0, arg1) {
        arg0.primitive = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_query_set_20ecd7f9a16f3ec6 = function() { return logError(function (arg0, arg1) {
        arg0.querySet = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_query_set_3afc955600bc819a = function() { return logError(function (arg0, arg1) {
        arg0.querySet = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_r_07bd987697069496 = function() { return logError(function (arg0, arg1) {
        arg0.r = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_required_features_650c9e5dafbaa395 = function() { return logError(function (arg0, arg1) {
        arg0.requiredFeatures = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_resolve_target_c18cd4048765732a = function() { return logError(function (arg0, arg1) {
        arg0.resolveTarget = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_resource_8cea0fe2c8745c3e = function() { return logError(function (arg0, arg1) {
        arg0.resource = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_rows_per_image_2f7969031c71f0d8 = function() { return logError(function (arg0, arg1) {
        arg0.rowsPerImage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_rows_per_image_a5295fffedd9f061 = function() { return logError(function (arg0, arg1) {
        arg0.rowsPerImage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_sample_count_07aedd28692aeae8 = function() { return logError(function (arg0, arg1) {
        arg0.sampleCount = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_sample_count_483b61e508f24e85 = function() { return logError(function (arg0, arg1) {
        arg0.sampleCount = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_sample_type_601a744a4bd6ea07 = function() { return logError(function (arg0, arg1) {
        arg0.sampleType = __wbindgen_enum_GpuTextureSampleType[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_sampler_1a2729c0aa194081 = function() { return logError(function (arg0, arg1) {
        arg0.sampler = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_shader_location_bdcfdc1009d351b1 = function() { return logError(function (arg0, arg1) {
        arg0.shaderLocation = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_size_7a392ee585f87da8 = function() { return logError(function (arg0, arg1) {
        arg0.size = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_size_c6bf409f70f4420f = function() { return logError(function (arg0, arg1) {
        arg0.size = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_size_f902b266d636bf6e = function() { return logError(function (arg0, arg1) {
        arg0.size = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_source_e41ff077cbd9b133 = function() { return logError(function (arg0, arg1) {
        arg0.source = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_src_factor_50cef27aa8aece91 = function() { return logError(function (arg0, arg1) {
        arg0.srcFactor = __wbindgen_enum_GpuBlendFactor[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_stencil_back_e740415a5c0b637a = function() { return logError(function (arg0, arg1) {
        arg0.stencilBack = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_clear_value_6be76b512040398d = function() { return logError(function (arg0, arg1) {
        arg0.stencilClearValue = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_front_03185e1c3bafa411 = function() { return logError(function (arg0, arg1) {
        arg0.stencilFront = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_load_op_084f44352b978b3d = function() { return logError(function (arg0, arg1) {
        arg0.stencilLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_stencil_read_mask_e2736fc4af9399e4 = function() { return logError(function (arg0, arg1) {
        arg0.stencilReadMask = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_read_only_31f3d99299373c12 = function() { return logError(function (arg0, arg1) {
        arg0.stencilReadOnly = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_read_only_cea23ff30262cbb2 = function() { return logError(function (arg0, arg1) {
        arg0.stencilReadOnly = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_stencil_store_op_428fb4955e4899d6 = function() { return logError(function (arg0, arg1) {
        arg0.stencilStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_stencil_write_mask_b1d3e1655305a187 = function() { return logError(function (arg0, arg1) {
        arg0.stencilWriteMask = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_step_mode_98e49f7877daf1c5 = function() { return logError(function (arg0, arg1) {
        arg0.stepMode = __wbindgen_enum_GpuVertexStepMode[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_storage_texture_6ee0cbeb50698110 = function() { return logError(function (arg0, arg1) {
        arg0.storageTexture = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_store_op_e761080d541a10cc = function() { return logError(function (arg0, arg1) {
        arg0.storeOp = __wbindgen_enum_GpuStoreOp[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_strip_index_format_16df9e33c7aa97e6 = function() { return logError(function (arg0, arg1) {
        arg0.stripIndexFormat = __wbindgen_enum_GpuIndexFormat[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_targets_9fd1ec0b8edc895c = function() { return logError(function (arg0, arg1) {
        arg0.targets = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_texture_b0ca3ffcb0c2688c = function() { return logError(function (arg0, arg1) {
        arg0.texture = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_texture_f03807916f70dcc6 = function() { return logError(function (arg0, arg1) {
        arg0.texture = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_texture_f8ae0bb4bb159354 = function() { return logError(function (arg0, arg1) {
        arg0.texture = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_timestamp_writes_3998dbfa21e48dbe = function() { return logError(function (arg0, arg1) {
        arg0.timestampWrites = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_timestamp_writes_de925214f236e575 = function() { return logError(function (arg0, arg1) {
        arg0.timestampWrites = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_topology_036632318a24227d = function() { return logError(function (arg0, arg1) {
        arg0.topology = __wbindgen_enum_GpuPrimitiveTopology[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_type_0cb4cdb5eff87f31 = function() { return logError(function (arg0, arg1) {
        arg0.type = __wbindgen_enum_GpuBufferBindingType[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_type_3099d48161846862 = function() { return logError(function (arg0, arg1) {
        arg0.type = __wbindgen_enum_GpuQueryType[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_type_d05fa8415ad0761f = function() { return logError(function (arg0, arg1) {
        arg0.type = __wbindgen_enum_GpuSamplerBindingType[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_unclipped_depth_17a5ab83d4e7cadc = function() { return logError(function (arg0, arg1) {
        arg0.unclippedDepth = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_set_usage_3d569e7b02227032 = function() { return logError(function (arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_usage_ac222ece73f994b7 = function() { return logError(function (arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_usage_ca00520767c8a475 = function() { return logError(function (arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_usage_fe13088353b65bee = function() { return logError(function (arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_vertex_76b7ac4bdfbb06f4 = function() { return logError(function (arg0, arg1) {
        arg0.vertex = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_view_1ef41eeb26eaf718 = function() { return logError(function (arg0, arg1) {
        arg0.view = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_view_46b654a12649c6f6 = function() { return logError(function (arg0, arg1) {
        arg0.view = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_view_dimension_12c332494a2697dc = function() { return logError(function (arg0, arg1) {
        arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_view_dimension_31b9fd7126132e82 = function() { return logError(function (arg0, arg1) {
        arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_view_formats_152cb995add2ee4e = function() { return logError(function (arg0, arg1) {
        arg0.viewFormats = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_view_formats_cc77650da6c3b25b = function() { return logError(function (arg0, arg1) {
        arg0.viewFormats = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_visibility_6d1fc94552f22ac3 = function() { return logError(function (arg0, arg1) {
        arg0.visibility = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_width_0a22c810f06a5152 = function() { return logError(function (arg0, arg1) {
        arg0.width = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_width_5ee1e2d4a0fd929b = function() { return logError(function (arg0, arg1) {
        arg0.width = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_width_7ff7a22c6e9f423e = function() { return logError(function (arg0, arg1) {
        arg0.width = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_write_mask_c92743022356850e = function() { return logError(function (arg0, arg1) {
        arg0.writeMask = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_x_0771b0f86d56cdf9 = function() { return logError(function (arg0, arg1) {
        arg0.x = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_x_7bd1a7929fa138eb = function() { return logError(function (arg0, arg1) {
        arg0.x = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_y_37d5f6d9b550b4ad = function() { return logError(function (arg0, arg1) {
        arg0.y = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_y_668d1578881576dd = function() { return logError(function (arg0, arg1) {
        arg0.y = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_set_z_3e24a918a76c816d = function() { return logError(function (arg0, arg1) {
        arg0.z = arg1 >>> 0;
    }, arguments) };
    imports.wbg.__wbg_size_0ee2999debd2b5d2 = function() { return logError(function (arg0) {
        const ret = arg0.size;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function() { return logError(function (arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_769e6b65d6557335 = function() { return logError(function () {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_60cf02db4de8e1c1 = function() { return logError(function () {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_SELF_08f5a74c69739274 = function() { return logError(function () {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_WINDOW_a8924b26aa92d024 = function() { return logError(function () {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_submit_a1850a1cb6baf64a = function() { return logError(function (arg0, arg1) {
        arg0.submit(arg1);
    }, arguments) };
    imports.wbg.__wbg_then_429f7caf1026411d = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_then_4f95312d68691235 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_unmap_ab94ab04cfb14bee = function() { return logError(function (arg0) {
        arg0.unmap();
    }, arguments) };
    imports.wbg.__wbg_usage_6fec626a30cc0aff = function() { return logError(function (arg0) {
        const ret = arg0.usage;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_valueOf_663ea9f1ad0d6eda = function() { return logError(function (arg0) {
        const ret = arg0.valueOf();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_value_57b7b035e117f7ee = function() { return logError(function (arg0) {
        const ret = arg0.value;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_wgslLanguageFeatures_a6dc1ac6bcdcb1ca = function() { return logError(function (arg0) {
        const ret = arg0.wgslLanguageFeatures;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_width_dd0cfe94d42f5143 = function() { return logError(function (arg0) {
        const ret = arg0.width;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_writeBuffer_b203cf79b98d6dd8 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.writeBuffer(arg1, arg2, arg3, arg4, arg5);
    }, arguments) };
    imports.wbg.__wbg_writeTexture_0466bf7d7d35e04e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.writeTexture(arg1, arg2, arg3, arg4);
    }, arguments) };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_2b447f5b135748a6 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 811, function: Function { arguments: [Externref], shim_idx: 812, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h9651559ad17dc211, wasm_bindgen__convert__closures_____invoke__h117acbe3fd438207);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_cb9088102bce6b30 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
        const ret = getArrayU8FromWasm0(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_d6cd19b81560fd6e = function() { return logError(function (arg0) {
        // Cast intrinsic for `F64 -> Externref`.
        const ret = arg0;
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_ebf2623471c9608b = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 658, function: Function { arguments: [NamedExternref("GPUUncapturedErrorEvent")], shim_idx: 803, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h6340a3d24bc9929e, wasm_bindgen__convert__closures_____invoke__h165335fa58188c1a);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('canvas_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
