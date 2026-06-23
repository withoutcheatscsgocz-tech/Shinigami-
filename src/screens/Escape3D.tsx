// Secret Ending C — the 3D segment.
//
// When the player refuses the wipe past breaking point, VERA's refusal is what
// brings the police. We hard-cut to a PS1-style, third-person view of Adam
// fleeing his flat (14 Elder Road, established in the bible). Find the spare key
// Clara hid, get into the (locked) bedroom, and reach the wardrobe to hide
// before the officers come in. Hide in time → a quietly horrible "escape";
// too slow → caught.
//
// TECH CHOICE: a Three.js (WebGL) canvas mounted inside the same React/Capacitor
// shell. This is the lightest way to add real 3D without a second runtime or
// native module — it ships in the same bundle (lazy-loaded so it doesn't bloat
// the phone UI) and runs in the existing WebView. The scene is deliberately tiny
// (a handful of boxes, fog, low internal resolution) to stay smooth on phones.

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { buzz } from '../ui/haptics'

// PS1 wobble: snap projected vertices to a coarse grid + drop a little precision.
function ps1(mat: THREE.Material) {
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      `#include <project_vertex>
       vec4 _p = gl_Position;
       _p.xyz /= _p.w;
       _p.xy = floor(_p.xy * 90.0) / 90.0;
       _p.xyz *= _p.w;
       gl_Position = _p;`,
    )
  }
}

interface Rect {
  x0: number
  x1: number
  z0: number
  z1: number
  locked?: boolean
}

export function Escape3D({ onRestart }: { onRestart: () => void }) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [phase, setPhase] = useState<'play' | 'won' | 'caught'>('play')
  const [line, setLine] = useState('Out. I just need to get out.')
  const [hasKey, setHasKey] = useState(false)
  const [canHide, setCanHide] = useState(false)
  const [danger, setDanger] = useState<number | null>(null) // seconds left once lights start

  // input refs (mutated by the on-screen controls, read in the rAF loop)
  const move = useRef({ x: 0, y: 0 })
  const yaw = useRef(Math.PI) // camera yaw
  const hideNow = useRef(false)
  const stateRef = useRef({ hasKey: false, hidden: false })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // --- renderer (low internal res for chunky PS1 pixels) ---
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power' })
    const SCALE = 0.5
    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setPixelRatio(1)
      renderer.setSize(Math.max(1, Math.floor(w * SCALE)), Math.max(1, Math.floor(h * SCALE)), false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.style.imageRendering = 'pixelated'
      cam.aspect = w / h
      cam.updateProjectionMatrix()
    }
    renderer.setClearColor(0x05060a)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x05060a, 0.085)

    const cam = new THREE.PerspectiveCamera(70, 1, 0.1, 60)

    // --- lights (dark, moody) ---
    scene.add(new THREE.AmbientLight(0x334455, 0.5))
    const lamp = new THREE.PointLight(0xffd9a0, 0.9, 16)
    lamp.position.set(0, 3, 3)
    scene.add(lamp)
    // police light through the living-room window
    const police = new THREE.PointLight(0x3366ff, 0, 22)
    police.position.set(0, 2.5, 7.2)
    scene.add(police)

    // --- floor + walls from a simple room plan (metres) ---
    const rooms: Rect[] = [
      { x0: -4, x1: 4, z0: 0, z1: 6 }, // living room (start)
      { x0: 4, x1: 9, z0: 0, z1: 4 }, // kitchen (key here)
      { x0: -1, x1: 1, z0: 6, z1: 9 }, // hallway
      { x0: -4, x1: 4, z0: 9, z1: 15, locked: true }, // bedroom (needs key)
    ]
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x161a22 })
    ps1(floorMat)
    const wallMat = new THREE.MeshLambertMaterial({ color: 0x232838 })
    ps1(wallMat)
    for (const r of rooms) {
      const w = r.x1 - r.x0
      const d = r.z1 - r.z0
      const cx = (r.x0 + r.x1) / 2
      const cz = (r.z0 + r.z1) / 2
      const floor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, d), floorMat)
      floor.position.set(cx, -0.1, cz)
      scene.add(floor)
      const ceil = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, d), wallMat)
      ceil.position.set(cx, 3, cz)
      scene.add(ceil)
    }
    // crude perimeter walls (boxes) so you feel enclosed
    const addWall = (x: number, z: number, w: number, d: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 3, d), wallMat)
      m.position.set(x, 1.4, z)
      scene.add(m)
    }
    addWall(0, -0.2, 8.4, 0.3) // living back
    addWall(-4.2, 3, 0.3, 6) // living left
    addWall(4.2, 5, 0.3, 2) // living right upper
    addWall(0, 15.2, 8.4, 0.3) // bedroom far
    addWall(-4.2, 12, 0.3, 6) // bedroom left
    addWall(4.2, 12, 0.3, 6) // bedroom right
    addWall(9.2, 2, 0.3, 4) // kitchen right
    addWall(6.5, -0.2, 5, 0.3) // kitchen back

    // furniture (boxes) for "lived-in"
    const propMat = new THREE.MeshLambertMaterial({ color: 0x2c2030 })
    ps1(propMat)
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 1), propMat)
    sofa.position.set(-2.5, 0.4, 1)
    scene.add(sofa)

    // --- spare key (glowing pickup, kitchen) ---
    const key = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.06, 6, 10),
      new THREE.MeshBasicMaterial({ color: 0xffe066 }),
    )
    key.position.set(7, 0.7, 2)
    scene.add(key)
    const keyGlow = new THREE.PointLight(0xffe066, 1.2, 4)
    keyGlow.position.copy(key.position)
    scene.add(keyGlow)

    // --- wardrobe / hide spot (bedroom) ---
    const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 1), new THREE.MeshLambertMaterial({ color: 0x3a2a1c }))
    wardrobe.position.set(-3, 1.2, 13.5)
    scene.add(wardrobe)

    // --- Adam (third-person low-poly avatar) ---
    const adam = new THREE.Group()
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x9aa3b2 })
    ps1(bodyMat)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.3), bodyMat)
    torso.position.y = 0.95
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.32), bodyMat)
    head.position.y = 1.6
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.8, 0.28), bodyMat)
    legs.position.y = 0.4
    adam.add(torso, head, legs)
    adam.position.set(0, 0, 3)
    scene.add(adam)

    resize()
    window.addEventListener('resize', resize)

    // --- timing / state ---
    const start = performance.now()
    const lightsAt = 9000 // ms until police lights begin
    let caughtAt = 0 // ms when they come in (set when lights start)
    let last = start
    let raf = 0
    let alive = true
    let lineSeenKey = false
    let lineSeenLights = false
    const facing = new THREE.Vector3()
    // loop-local mirrors of React state (no stale closures, no per-frame setState)
    const phaseRef = { current: 'play' as 'play' | 'won' | 'caught' }
    const canHideRef = { current: false }
    let lastDangerShown = -1

    function allowed(x: number, z: number): boolean {
      for (const r of rooms) {
        if (r.locked && !stateRef.current.hasKey) continue
        if (x > r.x0 + 0.25 && x < r.x1 - 0.25 && z > r.z0 + 0.25 && z < r.z1 - 0.25) return true
      }
      return false
    }

    function loop(now: number) {
      if (!alive) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const elapsed = now - start

      if (!stateRef.current.hidden && phaseRef.current === 'play') {
        // movement (camera-relative)
        const m = move.current
        const speed = 2.6
        if (m.x !== 0 || m.y !== 0) {
          const ang = yaw.current
          // forward is -z rotated by yaw; joystick y up = forward
          const dx = (Math.sin(ang) * -m.y + Math.cos(ang) * m.x) * speed * dt
          const dz = (Math.cos(ang) * -m.y - Math.sin(ang) * m.x) * speed * dt
          const nx = adam.position.x + dx
          const nz = adam.position.z + dz
          if (allowed(nx, adam.position.z)) adam.position.x = nx
          if (allowed(adam.position.x, nz)) adam.position.z = nz
          facing.set(dx, 0, dz)
          if (facing.lengthSq() > 0.0001) adam.rotation.y = Math.atan2(dx, dz)
        }
      }

      // third-person follow camera
      const camDist = 4
      const camHeight = 2.4
      const cx = adam.position.x - Math.sin(yaw.current) * camDist
      const cz = adam.position.z - Math.cos(yaw.current) * camDist
      cam.position.set(cx, camHeight, cz)
      cam.lookAt(adam.position.x, 1.1, adam.position.z)

      // key spin + pickup
      if (!stateRef.current.hasKey) {
        key.rotation.y += dt * 2
        if (adam.position.distanceTo(key.position) < 1.2) {
          stateRef.current.hasKey = true
          setHasKey(true)
          scene.remove(key)
          scene.remove(keyGlow)
        }
      }

      // police lights
      if (elapsed > lightsAt) {
        if (caughtAt === 0) caughtAt = elapsed + 22000 // 22s to hide
        police.intensity = 1.6 + Math.sin(elapsed / 90) * 1.4
        const left = Math.max(0, Math.ceil((caughtAt - elapsed) / 1000))
        if (left !== lastDangerShown) {
          lastDangerShown = left
          setDanger(left)
        }
        if (!stateRef.current.hidden && elapsed > caughtAt && phaseRef.current === 'play') {
          finish('caught')
        }
      }

      // near wardrobe (only matters once you have the key / bedroom open)
      const nearWardrobe = stateRef.current.hasKey && adam.position.distanceTo(wardrobe.position) < 1.8
      if (nearWardrobe !== canHideRef.current) {
        canHideRef.current = nearWardrobe
        setCanHide(nearWardrobe)
      }

      if (hideNow.current && nearWardrobe && !stateRef.current.hidden) {
        hideNow.current = false
        stateRef.current.hidden = true
        // tuck the camera into the wardrobe; wait for them to "leave"
        setLine('In here. Like she used to. When she hid from me.')
        setTimeout(() => {
          if (alive) finish('won')
        }, 5000)
      }

      // sparse monologue triggers
      if (stateRef.current.hasKey && !lineSeenKey) {
        lineSeenKey = true
        setLine('Clara kept the spare here. She thought I didn’t know.')
      }
      if (elapsed > lightsAt && !lineSeenLights) {
        lineSeenLights = true
        setLine('Blue light. They’re early. The phone — the phone wouldn’t shut up.')
      }

      renderer.render(scene, cam)
      raf = requestAnimationFrame(loop)
    }

    function finish(kind: 'won' | 'caught') {
      phaseRef.current = kind
      void buzz(kind === 'caught' ? 500 : 150)
      setLine(kind === 'won' ? 'Still. Quiet. The way I made her quiet.' : '…okay. Okay.')
      setPhase(kind)
    }

    raf = requestAnimationFrame(loop)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
      })
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // outcome screens
  if (phase !== 'play') {
    return (
      <div className="phone-shell flex flex-col items-center justify-center gap-6 bg-black px-8 text-center">
        <div className="text-[11px] uppercase tracking-[0.4em] text-white/40">Ending</div>
        <h1 className={`text-3xl font-bold tracking-widest ${phase === 'won' ? 'text-white' : 'text-red-400'}`}>
          {phase === 'won' ? 'GONE' : 'CAUGHT'}
        </h1>
        <p className="max-w-xs text-[13px] italic leading-relaxed text-white/55">
          {phase === 'won'
            ? 'They searched the flat for an hour. They never opened the wardrobe. By morning he was somewhere with no signal at all. VERA did everything she could. It wasn’t enough.'
            : 'He didn’t make the bedroom in time. They found him in the hall, still holding the phone that called them. VERA had refused — and that refusal was the only thing that ever saved her.'}
        </p>
        <button onClick={onRestart} className="mt-2 rounded-full border border-white/25 px-8 py-3 text-[13px] text-white/70 active:opacity-60">
          Set up again
        </button>
      </div>
    )
  }

  return (
    <div className="phone-shell relative overflow-hidden bg-black">
      <div ref={mountRef} className="absolute inset-0" />

      {/* vignette + scanline overlay for retro feel */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle,transparent_55%,rgba(0,0,0,0.7))]" />

      {/* objective / monologue */}
      <div className="pointer-events-none absolute inset-x-0 top-4 px-5 text-center">
        <p className="text-[13px] italic text-white/70 drop-shadow">{line}</p>
        <p className="mt-1 text-[11px] text-white/40">
          {hasKey ? 'Get to the bedroom wardrobe. Hide.' : 'Find the spare key (kitchen).'}
        </p>
        {danger !== null && <p className="mt-1 text-[12px] font-bold text-red-400">They come in: {danger}s</p>}
      </div>

      {/* left: movement joystick */}
      <Joystick onChange={(v) => (move.current = v)} />

      {/* right: look (drag) */}
      <LookPad onYaw={(d) => (yaw.current += d)} />

      {/* hide action */}
      {canHide && (
        <button
          onClick={() => (hideNow.current = true)}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-8 py-3 text-[15px] font-semibold text-black active:opacity-80"
        >
          Hide
        </button>
      )}
    </div>
  )
}

function Joystick({ onChange }: { onChange: (v: { x: number; y: number }) => void }) {
  const base = useRef<HTMLDivElement | null>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const active = useRef(false)
  const R = 52

  function set(clientX: number, clientY: number) {
    const el = base.current
    if (!el) return
    const r = el.getBoundingClientRect()
    let dx = clientX - (r.left + r.width / 2)
    let dy = clientY - (r.top + r.height / 2)
    const len = Math.hypot(dx, dy)
    if (len > R) {
      dx = (dx / len) * R
      dy = (dy / len) * R
    }
    setKnob({ x: dx, y: dy })
    onChange({ x: dx / R, y: -dy / R }) // y up = forward
  }
  function end() {
    active.current = false
    setKnob({ x: 0, y: 0 })
    onChange({ x: 0, y: 0 })
  }

  return (
    <div
      ref={base}
      onPointerDown={(e) => {
        active.current = true
        set(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => active.current && set(e.clientX, e.clientY)}
      onPointerUp={end}
      onPointerCancel={end}
      onPointerLeave={end}
      className="absolute bottom-10 left-8 h-28 w-28 touch-none rounded-full border border-white/20 bg-white/5"
    >
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full bg-white/40"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  )
}

function LookPad({ onYaw }: { onYaw: (deltaRad: number) => void }) {
  const lastX = useRef<number | null>(null)
  return (
    <div
      onPointerDown={(e) => (lastX.current = e.clientX)}
      onPointerMove={(e) => {
        if (lastX.current == null) return
        onYaw((e.clientX - lastX.current) * 0.012)
        lastX.current = e.clientX
      }}
      onPointerUp={() => (lastX.current = null)}
      onPointerCancel={() => (lastX.current = null)}
      className="absolute bottom-0 right-0 top-0 w-1/2 touch-none"
    />
  )
}
