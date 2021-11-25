import * as React from 'react'
import { FaSave } from 'react-icons/fa'

const COLOURS = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FFA500', '#FF10F0', '#B026FF', '#FFFFFF', '#000000']

export default function Paint({ onSave }: { onSave: (name: string, blob: Blob | null) => void }) {
  const [colour, setColour] = React.useState('#000000')
  const areaRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const isDrawing = React.useRef(false)
  const mousePosition = React.useRef({ x: 0, y: 0 })

  const [areaSize, setAreaSize] = React.useState({ w: 0, h: 0 })
  React.useEffect(() => {
    function handler() {
      setAreaSize({ h: areaRef.current?.clientHeight || 1, w: areaRef.current?.clientWidth || 1 })
    }
    setAreaSize({ h: areaRef.current?.clientHeight || 1, w: areaRef.current?.clientWidth || 1 })
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])
  const height = areaSize.h - 10 - areaSize.w / COLOURS.length
  const width = areaSize.w
  function onStart(e) {
    if (!canvasRef.current) return
    isDrawing.current = true
    mousePosition.current = {
      x: e.pageX - canvasRef.current.offsetLeft,
      y: e.pageY - canvasRef.current.offsetTop,
    }
  }
  function onEnd() {
    isDrawing.current = false
  }
  function onMove(e) {
    const ctx = canvasRef.current?.getContext('2d')
    if (isDrawing.current && ctx && canvasRef.current) {
      const newMousePosition = {
        x: e.pageX - canvasRef.current.offsetLeft,
        y: e.pageY - canvasRef.current.offsetTop,
      }
      ctx.strokeStyle = colour
      ctx.lineJoin = 'round'
      ctx.lineWidth = 10
      ctx.beginPath()
      ctx.moveTo(mousePosition.current.x, mousePosition.current.y)
      ctx.lineTo(newMousePosition.x, newMousePosition.y)
      ctx.closePath()
      ctx.stroke()
      mousePosition.current = newMousePosition
    }
  }
  return (
    <div className="flex flex-col flex-1">
      <form
        className="flex flex-row items-center justify-center"
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          canvasRef.current?.toBlob((b) => onSave(formData.get('name')?.toString() || new Date().toISOString(), b))
        }}
      >
        <input
          name="name"
          placeholder="Name..."
          className="flex-1 px-2 py-1 mx-2 mt-2 mb-3 text-white bg-gray-800 border border-gray-900 rounded-md"
        />
        <button
          className="flex flex-row items-center justify-center px-2 py-1 font-bold text-gray-800 bg-pink-600 border border-pink-700 rounded-md hover:bg-pink-700 hover:animate-pulse"
          type="submit"
        >
          <FaSave className="mr-1" /> Save
        </button>
      </form>
      <div className="flex-1" ref={areaRef}>
        <canvas
          className="overflow-hidden bg-white rounded-md"
          style={{ height, width, touchAction: 'none' }}
          height={height}
          width={width}
          ref={canvasRef}
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseLeave={onEnd}
          onMouseUp={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
          onTouchCancel={onEnd}
        />
        <Palette colour={colour} setColour={setColour} width={areaSize.w} />
      </div>
    </div>
  )
}

function Palette({
  colour,
  setColour,
  width,
}: {
  colour: string
  setColour: React.Dispatch<React.SetStateAction<string>>
  width: number
}) {
  const [size, setSize] = React.useState(width / COLOURS.length)
  React.useEffect(() => {
    setSize(width / COLOURS.length)
  }, [width])
  return (
    <div className="flex flex-row flex-wrap items-center justify-center mt-2">
      {COLOURS.map((c) => (
        <div
          key={c}
          data-colour={c}
          onClick={() => setColour(c)}
          style={{
            border: 2,
            height: size - 2,
            width: size - 2,
            backgroundColor: c,
            borderColor: colour === c ? '#FFFFFF' : c,
            borderStyle: colour === c ? 'inset' : 'solid',
          }}
        />
      ))}
    </div>
  )
}
