import { useRef, useEffect, useState, useCallback } from 'react';
import { Eraser } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void;
  isEmpty: boolean;
}

export default function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const getPoint = useCallback((e: MouseEvent | TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const drawLine = useCallback((from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = '#0A1628';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, []);

  const emitSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSignatureChange(dataUrl);
    setHasContent(true);
  }, [onSignatureChange]);

  const handleStart = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPoint.current = getPoint(e);
  }, [getPoint]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing || !lastPoint.current) return;
    e.preventDefault();
    const point = getPoint(e);
    drawLine(lastPoint.current, point);
    lastPoint.current = point;
  }, [isDrawing, getPoint, drawLine]);

  const handleEnd = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPoint.current = null;
      emitSignature();
    }
  }, [isDrawing, emitSignature]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
    onSignatureChange(null);
  }, [onSignatureChange]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 160 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '160px';

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      if (hasContent) {
        ctx.drawImage(tempCanvas, 0, 0, rect.width, 160);
      }
    }
  }, [hasContent]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (e: MouseEvent) => handleStart(e);
    const onMouseMove = (e: MouseEvent) => handleMove(e);
    const onMouseUp = () => handleEnd();
    const onTouchStart = (e: TouchEvent) => handleStart(e);
    const onTouchMove = (e: TouchEvent) => handleMove(e);
    const onTouchEnd = () => handleEnd();

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  return (
    <div className="poa-sig" ref={containerRef}>
      <canvas ref={canvasRef} className="poa-sig-canvas" />
      {hasContent && (
        <button type="button" className="poa-sig-clear" onClick={clear}>
          <Eraser size={14} />
          Loeschen
        </button>
      )}
      {!hasContent && (
        <div className="poa-sig-hint">Hier mit der Maus oder dem Finger unterschreiben</div>
      )}
    </div>
  );
}
