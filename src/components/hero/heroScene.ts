import * as THREE from 'three'

export interface HeroSceneOptions {
  reducedMotion: boolean
  compact: boolean
  /** DOM elements that should follow labelled anchor nodes */
  labels: (HTMLElement | null)[]
}

/**
 * The hero computational ecosystem:
 *  - a central core (wireframe icosahedron + fresnel sphere)
 *  - three tilted orbital layers carrying workflow / agent nodes
 *  - curved links from the core with travelling data pulses
 *  - a calm, deep particle field
 * Everything is additive & unlit so it stays cheap.
 */
export function createHeroScene(canvas: HTMLCanvasElement, opts: HeroSceneOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.compact ? 1.5 : 1.75))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x04060b, 0.045)
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(0, 0.6, 13)

  const world = new THREE.Group()
  scene.add(world)

  const CYAN = new THREE.Color('#45d3e6')
  const BLUE = new THREE.Color('#5b8cff')
  const SAFFRON = new THREE.Color('#e09a52')
  const TEAL = new THREE.Color('#2fb9a6')
  const SOFT = new THREE.Color('#8fa3c7')

  // ── Core ────────────────────────────────────────────────
  const core = new THREE.Group()
  world.add(core)

  const coreGeo = new THREE.IcosahedronGeometry(1.15, 1)
  const coreEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(coreGeo),
    new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }),
  )
  core.add(coreEdges)

  const fresnelMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uA: { value: CYAN }, uB: { value: BLUE } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uA; uniform vec3 uB;
      varying vec3 vN; varying vec3 vV;
      void main(){
        float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.4);
        float pulse = 0.85 + 0.15 * sin(uTime * 1.4);
        vec3 c = mix(uB, uA, f);
        gl_FragColor = vec4(c, f * 0.9 * pulse + 0.05);
      }`,
  })
  const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.82, 48, 48), fresnelMat)
  core.add(coreSphere)

  // inner bright seed
  const seed = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xe8f6ff, transparent: true, opacity: 0.95 }),
  )
  core.add(seed)

  // 24-tick precision ring around the core — a quiet geometric nod
  const tickPos: number[] = []
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    const r1 = 1.62
    const r2 = i % 6 === 0 ? 1.82 : 1.72
    tickPos.push(Math.cos(a) * r1, Math.sin(a) * r1, 0, Math.cos(a) * r2, Math.sin(a) * r2, 0)
  }
  const tickGeo = new THREE.BufferGeometry()
  tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(tickPos, 3))
  const ticks = new THREE.LineSegments(
    tickGeo,
    new THREE.LineBasicMaterial({ color: SAFFRON, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }),
  )
  core.add(ticks)
  const tickRing = circleLine(1.62, 128, SOFT, 0.25)
  core.add(tickRing)

  // ── Orbital layers with nodes ─────────────────────────────
  interface Orbit {
    group: THREE.Group
    radius: number
    speed: number
    nodes: THREE.Object3D[]
  }
  const orbitDefs = [
    { radius: 2.7, tilt: [1.2, 0.0, 0.25], speed: 0.06, count: 6, color: CYAN },
    { radius: 3.7, tilt: [1.38, 0.0, -0.32], speed: -0.04, count: 8, color: BLUE },
    { radius: 4.8, tilt: [1.05, 0.0, 0.08], speed: 0.025, count: 10, color: TEAL },
  ]
  const orbits: Orbit[] = []
  const nodeGeo = new THREE.OctahedronGeometry(0.11, 0)
  const haloTex = makeHaloTexture()

  orbitDefs.forEach((d, oi) => {
    const g = new THREE.Group()
    g.rotation.set(d.tilt[0], d.tilt[1], d.tilt[2])
    world.add(g)
    g.add(circleLine(d.radius, 220, d.color, 0.16 - oi * 0.03))
    const nodes: THREE.Object3D[] = []
    for (let i = 0; i < d.count; i++) {
      const a = (i / d.count) * Math.PI * 2 + oi * 0.7
      const n = new THREE.Group()
      n.position.set(Math.cos(a) * d.radius, Math.sin(a) * d.radius, 0)
      const accent = i % 5 === 0 && oi === 1 ? SAFFRON : d.color
      const m = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.95 }))
      m.scale.setScalar(i % 3 === 0 ? 1.25 : 0.85)
      n.add(m)
      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: haloTex, color: accent, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }),
      )
      halo.scale.setScalar(0.55)
      n.add(halo)
      g.add(n)
      nodes.push(n)
    }
    orbits.push({ group: g, radius: d.radius, speed: d.speed, nodes })
  })

  // ── Links from core to selected nodes, with pulses ─────────
  interface Link {
    node: THREE.Object3D
    line: THREE.Line
    curve: THREE.QuadraticBezierCurve3
    t: number
    speed: number
  }
  const links: Link[] = []
  const linkMat = new THREE.LineBasicMaterial({ color: SOFT, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false })
  const linkTargets: THREE.Object3D[] = []
  orbits.forEach((o, oi) => o.nodes.forEach((n, i) => (i % (oi + 2) === 0 ? linkTargets.push(n) : null)))
  // node-to-node links between neighbouring orbits (agent ↔ workflow communication)
  const peerPairs: [THREE.Object3D, THREE.Object3D][] = []
  for (let i = 0; i < 6; i++) peerPairs.push([orbits[0].nodes[i % orbits[0].nodes.length], orbits[1].nodes[(i * 2 + 1) % orbits[1].nodes.length]])
  for (let i = 0; i < 5; i++) peerPairs.push([orbits[1].nodes[(i * 2) % orbits[1].nodes.length], orbits[2].nodes[(i * 2 + 1) % orbits[2].nodes.length]])

  const tmpA = new THREE.Vector3()
  const tmpB = new THREE.Vector3()
  const tmpC = new THREE.Vector3()

  const makeLink = (node: THREE.Object3D, from: THREE.Object3D | null, opacity: number) => {
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3())
    const geo = new THREE.BufferGeometry().setFromPoints(new Array(24).fill(0).map(() => new THREE.Vector3()))
    const mat = linkMat.clone()
    mat.opacity = opacity
    const line = new THREE.Line(geo, mat)
    world.add(line)
    const l: Link & { from: THREE.Object3D | null } = { node, line, curve, t: Math.random(), speed: 0.12 + Math.random() * 0.18, from }
    links.push(l)
    return l
  }
  const allLinks = [
    ...linkTargets.map((n) => makeLink(n, null, 0.16)),
    ...peerPairs.map(([a, b]) => makeLink(b, a, 0.08)),
  ] as (Link & { from: THREE.Object3D | null })[]

  const pulseGeo = new THREE.BufferGeometry()
  const pulsePos = new Float32Array(allLinks.length * 3)
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3))
  const pulses = new THREE.Points(
    pulseGeo,
    new THREE.PointsMaterial({
      size: 0.2,
      map: haloTex,
      color: 0xbff4ff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  )
  world.add(pulses)

  // ── Particle field ─────────────────────────────────────
  const pCount = opts.compact ? 700 : 1600
  const pGeo = new THREE.BufferGeometry()
  const pp = new Float32Array(pCount * 3)
  const pc = new Float32Array(pCount * 3)
  const palette = [SOFT, CYAN, BLUE, TEAL, SAFFRON]
  for (let i = 0; i < pCount; i++) {
    const r = 6 + Math.random() * 18
    const th = Math.random() * Math.PI * 2
    const ph = Math.acos(2 * Math.random() - 1)
    pp[i * 3] = r * Math.sin(ph) * Math.cos(th)
    pp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.55
    pp[i * 3 + 2] = r * Math.cos(ph) - 4
    const c = palette[Math.random() < 0.04 ? 4 : Math.floor(Math.random() * 4)]
    pc[i * 3] = c.r
    pc[i * 3 + 1] = c.g
    pc[i * 3 + 2] = c.b
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(pc, 3))
  const field = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }),
  )
  scene.add(field)

  // ── Labelled anchors (DOM labels follow these nodes) ─────────
  const anchors: THREE.Object3D[] = [orbits[0].nodes[1], orbits[1].nodes[4], orbits[2].nodes[7], orbits[1].nodes[0]]

  // ── Interaction state ──────────────────────────────────
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  let scrollFade = 0
  let width = 1
  let height = 1
  let offsetX = 0
  let offsetY = 0

  const resize = () => {
    const parent = canvas.parentElement!
    width = parent.clientWidth
    height = parent.clientHeight
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    // shift the system to the right on wide screens so the headline has room
    offsetX = width > 1024 ? 3.2 : width > 720 ? 1.6 : 1.2
    offsetY = width > 720 ? 0 : -2.7
    camera.position.z = width < 720 ? 16 : 13
    camera.updateProjectionMatrix()
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas.parentElement!)

  const onPointer = (e: PointerEvent) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
  }
  const onScroll = () => {
    scrollFade = Math.min(1, window.scrollY / (window.innerHeight * 0.9))
  }
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })

  // ── Loop ───────────────────────────────────────────
  let last = performance.now()
  let elapsed = 0
  let raf = 0
  let running = false
  let intro = opts.reducedMotion ? 1 : 0

  const updateLinks = () => {
    allLinks.forEach((l, i) => {
      if (l.from) l.from.getWorldPosition(tmpA)
      else tmpA.set(0, 0, 0)
      world.worldToLocal(tmpA)
      l.node.getWorldPosition(tmpB)
      world.worldToLocal(tmpB)
      tmpC.copy(tmpA).add(tmpB).multiplyScalar(0.5)
      tmpC.y += l.from ? 0.25 : 0.9
      l.curve.v0.copy(tmpA)
      l.curve.v1.copy(tmpC)
      l.curve.v2.copy(tmpB)
      const pos = l.line.geometry.attributes.position as THREE.BufferAttribute
      for (let k = 0; k < pos.count; k++) {
        l.curve.getPoint(k / (pos.count - 1), tmpC)
        pos.setXYZ(k, tmpC.x, tmpC.y, tmpC.z)
      }
      pos.needsUpdate = true
      l.curve.getPoint(l.t, tmpC)
      pulsePos[i * 3] = tmpC.x
      pulsePos[i * 3 + 1] = tmpC.y
      pulsePos[i * 3 + 2] = tmpC.z
    })
    pulseGeo.attributes.position.needsUpdate = true
  }

  const project = new THREE.Vector3()
  const updateLabels = () => {
    anchors.forEach((a, i) => {
      const el = opts.labels[i]
      if (!el) return
      a.getWorldPosition(project)
      project.project(camera)
      const x = (project.x * 0.5 + 0.5) * width
      const y = (-project.y * 0.5 + 0.5) * height
      const visible = project.z < 1 && x > 40 && x < width - 40 && y > 80 && y < height - 40
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      el.style.opacity = visible ? String(Math.max(0, (intro - 0.6) * 2.5) * (1 - scrollFade)) : '0'
    })
  }

  const frame = () => {
    const now = performance.now()
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    elapsed += dt
    const t = elapsed
    if (!opts.reducedMotion) {
      intro = Math.min(1, intro + dt * 0.45)
      orbits.forEach((o) => (o.group.rotation.z += o.speed * dt))
      core.rotation.y += dt * 0.12
      coreEdges.rotation.x += dt * 0.05
      ticks.rotation.z -= dt * 0.05
      field.rotation.y += dt * 0.006
      allLinks.forEach((l) => {
        l.t += l.speed * dt
        if (l.t > 1) l.t = 0
      })
      orbits.forEach((o) =>
        o.nodes.forEach((n, i) => {
          n.children[0].rotation.y += dt * (0.6 + (i % 3) * 0.2)
        }),
      )
    }
    fresnelMat.uniforms.uTime.value = t

    pointer.x += (pointer.tx - pointer.x) * 0.04
    pointer.y += (pointer.ty - pointer.y) * 0.04
    const ease = 1 - Math.pow(1 - intro, 3)
    world.position.x = offsetX
    world.rotation.y = pointer.x * 0.22 + (1 - ease) * -0.8
    world.rotation.x = pointer.y * 0.12 + 0.1
    world.scale.setScalar(0.75 + ease * 0.25 - scrollFade * 0.08)
    world.position.y = offsetY + scrollFade * 1.2
    field.position.x = -pointer.x * 0.4
    field.position.y = pointer.y * 0.25
    camera.lookAt(0, 0, 0)

    updateLinks()
    renderer.render(scene, camera)
    updateLabels()
    if (running) raf = requestAnimationFrame(frame)
  }

  const start = () => {
    if (running) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  if (opts.reducedMotion) {
    frame()
  }

  return {
    start: () => (opts.reducedMotion ? frame() : start()),
    stop,
    dispose() {
      stop()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose?.()
        const mat = m.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else mat?.dispose?.()
      })
      haloTex.dispose()
      renderer.dispose()
    },
  }
}

function circleLine(radius: number, segments: number, color: THREE.Color, opacity: number) {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0))
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }),
  )
}

function makeHaloTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.25, 'rgba(255,255,255,.55)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}
