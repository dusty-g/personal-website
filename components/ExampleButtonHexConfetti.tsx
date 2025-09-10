'use client'

import React from 'react'

/**
 * ExampleButtonHexConfetti
 * - Renders a button labeled "Example"
 * - On click: fires a confetti burst if canvas-confetti is installed.
 */
export default function ExampleButtonHexConfetti() {
  async function fireConfettiBurst() {
    try {
      const mod = await import('canvas-confetti')
      const confetti = mod.default
      const end = Date.now() + 1200
      ;(function frame() {
        confetti({
          particleCount: 6,
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

  function handleClick() {
    fireConfettiBurst()
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 active:scale-[0.98] transition"
    >
      Example
    </button>
  )
}
