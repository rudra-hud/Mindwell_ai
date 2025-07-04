
import React, { useRef, useEffect, useState } from 'react';
import { BrushIcon, Trash2Icon } from './Icons';

const colors = ['#0f172a', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']; // slate, red, amber, emerald, blue, violet, pink

const DoodleCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState(colors[0]);
    const [brushSize, setBrushSize] = useState(5);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const parent = canvas.parentElement;
        if(parent) {
            // Set canvas size for high-resolution displays
            canvas.width = parent.clientWidth * 2;
            canvas.height = parent.clientHeight * 2;
            canvas.style.width = `${parent.clientWidth}px`;
            canvas.style.height = `${parent.clientHeight}px`;
        }

        const context = canvas.getContext('2d');
        if (!context) return;
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        contextRef.current = context;
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
        }
    }, [color]);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.lineWidth = brushSize;
        }
    }, [brushSize]);

    const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.beginPath();
        contextRef.current?.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        // Dispatch event to unlock achievement
        document.dispatchEvent(new CustomEvent('doodleToolUsed'));
    };

    const finishDrawing = () => {
        contextRef.current?.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.lineTo(offsetX, offsetY);
        contextRef.current?.stroke();
    };
    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if(canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 h-[50vh] md:h-[60vh] w-full">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Mindful Doodling</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-4 text-center">Let your thoughts flow onto the canvas. No rules, just you and your creativity.</p>
            <div className="w-full flex-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg shadow-inner overflow-hidden">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseOut={finishDrawing}
                    onMouseMove={draw}
                    className="cursor-crosshair"
                />
            </div>
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    {colors.map(c => (
                        <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-6 h-6 rounded-full transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-teal-500' : ''}`} aria-label={`Select color ${c}`}/>
                    ))}
                </div>
                 <div className="flex items-center gap-3">
                    <BrushIcon className="w-5 h-5"/>
                    <input type="range" min="2" max="20" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-32"/>
                </div>
                <button onClick={clearCanvas} className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">
                    <Trash2Icon className="w-4 h-4"/>
                    Clear
                </button>
            </div>
        </div>
    );
};

export default DoodleCanvas;
