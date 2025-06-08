import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext } from '../types';

export class TextTool extends BaseTool {
  private isTextMode: boolean = false;
  private textPosition: { x: number; y: number } | null = null;

  constructor(props: ToolProps) {
    super(props);
  }
  onMouseDown(context: DrawingContext): void {
    if (!context.canvas) return;

    // Don't start new text input if already in text mode
    if (this.isTextMode) return;

    this.textPosition = { x: context.x, y: context.y };
    this.isTextMode = true;
    
    // Create text input overlay
    this.createTextInput(context);
  }
  onMouseMove(_context: DrawingContext): void {
    // Text tool doesn't need mouse move handling
  }

  onMouseUp(_context: DrawingContext): void {
    // Text tool doesn't need mouse up handling
  }

  private createTextInput(_context: DrawingContext): void {
    if (!_context.canvas || !this.textPosition) return;

    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'absolute';
    input.style.left = `${this.textPosition.x}px`;
    input.style.top = `${this.textPosition.y}px`;
    input.style.fontSize = `${this.getToolSize()}px`;
    input.style.color = this.getToolColor();
    input.style.backgroundColor = 'transparent';
    input.style.border = '1px dashed #ccc';
    input.style.outline = 'none';
    input.style.zIndex = '1000';

    // Add to canvas container
    const canvasContainer = _context.canvas.parentElement;
    if (canvasContainer) {
      canvasContainer.appendChild(input);
      input.focus();

      // Handle input completion
      const handleComplete = () => {
        if (input.value.trim()) {
          this.drawText(_context, input.value, this.textPosition!);
        }
        if (canvasContainer.contains(input)) {
          canvasContainer.removeChild(input);
        }
        this.isTextMode = false;
        this.textPosition = null;
      };

      input.addEventListener('blur', handleComplete);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleComplete();
        }
        if (e.key === 'Escape') {
          if (canvasContainer.contains(input)) {
            canvasContainer.removeChild(input);
          }
          this.isTextMode = false;
          this.textPosition = null;
        }
      });
    }
  }
  private drawText(context: DrawingContext, text: string, position: { x: number; y: number }): void {
    if (!context.canvas) return;

    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.font = `${this.getToolSize()}px Arial`;
    ctx.fillStyle = this.getToolColor();
    ctx.textBaseline = 'top';
    
    // Add text to canvas
    ctx.fillText(text, position.x, position.y);
    
    ctx.restore();
  }

  render(): React.ReactElement {
    return (
      <div className="text-tool-settings">
        {/* Text tool specific settings can be added here */}
      </div>
    );
  }
}
