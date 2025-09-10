'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * ExampleButtonHexConfetti
 * - Renders a button labeled "Example"
 * - On click: fires confetti and starts a canvas animation
 *   showing a rotating hexagon with a bouncing ball inside.
 *
 * Drop this file anywhere in your Next.js app (e.g., app/components/).
 * Usage (App Router):
 *   import ExampleButtonHexConfetti from '@/components/ExampleButtonHexConfetti'
 *   export default function Page() { return <ExampleButtonHexConfetti /> }
 *
 * Optional (recommended) dependency for confetti:
 *   npm i canvas-confetti
 *   This component dynamically imports it. If it's not installed, the click still
 *   starts the animation (confetti is simply skipped).
 */
export default function ExampleButtonHexConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const [active, setActive] = useState(false)

  // Confetti on demand (best-effort; works if user installed canvas-confetti)
  async function fireConfettiBurst() {
    try {
      const mod = await import('canvas-confetti')
      const confetti = mod.default
      const end = Date.now() + 1200
      ;(function frame() {
        // multiple bursts for ~1.2s
        confetti({
          particleCount: 60,
          startVelocity: 55,
          spread: 70,
          origin: { x: Math.random(), y: Math.random() * 0.4 + 0.1 },
          ticks: 180,
          scalar: 1.0,
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      })()
    } catch {
      // If the package isn't installed, silently skip.
    }
  }

  // === Canvas animation: rotating hexagon + bouncing ball ===
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    // Handle high-DPI sizing & resize
    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      const rect = canvas.getBoundingClientRect()
      const newWidth = Math.floor(rect.width * dpr)
      const newHeight = Math.floor(rect.height * dpr)
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth
        canvas.height = newHeight
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // scale drawing to CSS pixels
      }
    }
    resize()
    window.addEventListener('resize', resize)

    // World params
    let last = performance.now()
    let angle = 0 // hex rotation (radians)
    const ANG_VEL = 0.6 // rad/s

    const getCenter = () => {
      const rect = canvas.getBoundingClientRect()
      return { cx: rect.width / 2, cy: rect.height / 2 }
    }

    // Hex geometry
    const hexRadius = () => {
      const rect = canvas.getBoundingClientRect()
      return Math.max(40, Math.min(rect.width, rect.height) * 0.35)
    }

    // Ball state
    const ball = {
      r: 12,
      x: 0,
      y: 0,
      vx: 180 * (Math.random() > 0.5 ? 1 : -1),
      vy: 120 * (Math.random() > 0.5 ? 1 : -1),
      bounciness: 0.98, // 1.0 = perfectly elastic
      friction: 0.999,  // speed bleed per frame
    }
    // Initialize ball near center
    ;(() => {
      const { cx, cy } = getCenter()
      ball.x = cx + (Math.random() - 0.5) * 20
      ball.y = cy + (Math.random() - 0.5) * 20
    })()

    function vertices(cx: number, cy: number, R: number, rot: number) {
      const pts: Array<{ x: number; y: number }> = []
      for (let i = 0; i < 6; i++) {
        const t = rot + i * (Math.PI / 3) - Math.PI / 2 // point-up baseline
        pts.push({ x: cx + R * Math.cos(t), y: cy + R * Math.sin(t) })
      }
      return pts
    }

    function drawHex(cx: number, cy: number, R: number, rot: number) {
      const pts = vertices(cx, cy, R, rot)
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < 6; i++) ctx.lineTo(pts[i].x, pts[i].y)
      ctx.closePath()
      // fill subtle
      ctx.fillStyle = 'rgba(99,102,241,0.08)'
      ctx.fill()
      // stroke bold
      ctx.lineWidth = 3
      ctx.strokeStyle = 'rgba(79,70,229,0.9)'
      ctx.stroke()
    }

    function drawBall() {
      const grad = ctx.createRadialGradient(ball.x - ball.r * 0.4, ball.y - ball.r * 0.4, ball.r * 0.6, ball.x, ball.y, ball.r)
      grad.addColorStop(0, 'rgba(16,185,129,0.95)')
      grad.addColorStop(1, 'rgba(16,185,129,0.4)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.lineWidth = 1.5
      ctx.strokeStyle = 'rgba(5,150,105,0.9)'
      ctx.stroke()
    }

    function reflectVelocity(n: { x: number; y: number }) {
      // v' = v - 2 (v·n) n
      const dot = ball.vx * n.x + ball.vy * n.y
      ball.vx = (ball.vx - 2 * dot * n.x) * ball.bounciness
      ball.vy = (ball.vy - 2 * dot * n.y) * ball.bounciness
    }

    function collideWithHex(cx: number, cy: number, R: number, rot: number) {
      const pts = vertices(cx, cy, R, rot)
      // Check against each edge as segment [A,B]
      for (let i = 0; i < 6; i++) {
        const A = pts[i]
        const B = pts[(i + 1) % 6]
        const ABx = B.x - A.x
        const ABy = B.y - A.y
        const APx = ball.x - A.x
        const APy = ball.y - A.y
        const abLen2 = ABx * ABx + ABy * ABy
        const t = Math.max(0, Math.min(1, (APx * ABx + APy * ABy) / (abLen2 || 1)))
        const qx = A.x + ABx * t
        const qy = A.y + ABy * t
        let nx = ball.x - qx
        let ny = ball.y - qy
        let dist2 = nx * nx + ny * ny
        const r = ball.r

        if (dist2 < r * r) {
          let dist = Math.sqrt(dist2)
          if (dist === 0) {
            // Ball center exactly on edge; use outward normal
            // Outward normal is perpendicular to edge, pointing away from hex center
            const mx = (A.x + B.x) * 0.5 - cx
            const my = (A.y + B.y) * 0.5 - cy
            // Perp of AB
            let px = -ABy
            let py = ABx
            // Ensure it points outward
            if (px * mx + py * my < 0) {
              px = -px
              py = -py
            }
            const mag = Math.hypot(px, py) || 1
            nx = px / mag
            ny = py / mag
            // Push out and reflect
            ball.x = qx + nx * r
            ball.y = qy + ny * r
            reflectVelocity({ x: nx, y: ny })
          } else {
            // Normal from contact point to center
            nx /= dist
            ny /= dist
            // Push out to surface
            const overlap = r - dist
            ball.x += nx * overlap
            ball.y += ny * overlap
            reflectVelocity({ x: nx, y: ny })
          }
        }
      }
    }

    function tick(now: number) {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now

      // Physics step
      ball.x += ball.vx * dt
      ball.y += ball.vy * dt
      ball.vx *= ball.friction
      ball.vy *= ball.friction

      const { cx, cy } = getCenter()
      const R = hexRadius()
      angle += ANG_VEL * dt

      // Resolve collisions (iterate a couple times for corner cases)
      for (let i = 0; i < 2; i++) collideWithHex(cx, cy, R, angle)

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background subtle grid
      drawBackgroundGrid()

      // Hexagon
      drawHex(cx, cy, R, angle)

      // Ball
      drawBall()

      rafRef.current = requestAnimationFrame(tick)
    }

    function drawBackgroundGrid() {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      ctx.save()
      ctx.strokeStyle = 'rgba(0,0,0,0.06)'
      ctx.lineWidth = 1
      const step = 24
      for (let x = 0; x < w; x += step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      ctx.restore()
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  function handleClick() {
    fireConfettiBurst()
    setActive(true)
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleClick}
          className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 active:scale-[0.98] transition"
        >
          Example
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 shadow-inner bg-white/80 backdrop-blur">
        {/* <div className="p-2 text-xs text-gray-500">Rotating Hexagon Demo</div> */}
        <div className="relative aspect-[16/9]">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-b-2xl" />
        </div>
      </div>
    </div>
  )
}
