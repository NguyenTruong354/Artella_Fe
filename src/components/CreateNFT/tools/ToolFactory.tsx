import React from 'react';
import { ToolRegistry, ToolDefinition } from './ToolRegistry';
import { ToolProps, ToolHandler } from './types';

export class ToolFactory {
  static createTool(toolId: string, props: ToolProps): React.ComponentType<ToolProps> | null {
    const toolDefinition = ToolRegistry.getTool(toolId);
    
    if (!toolDefinition) {
      console.warn(`Tool with id "${toolId}" not found in registry`);
      return null;
    }

    // Merge default settings with provided settings
    const mergedProps: ToolProps = {
      ...props,
      settings: {
        ...toolDefinition.defaultSettings,
        ...(props.settings || {})
      }
    };    // Create and return the tool component
    const ToolComponent = toolDefinition.component;
    
    // Return a React component that renders the tool
    return (componentProps: ToolProps) => {
      const finalProps = { ...mergedProps, ...componentProps };
      const toolInstance = new ToolComponent(finalProps);
      // Ensure render is a function before calling it
      if (typeof toolInstance.render === 'function') {
        return toolInstance.render();
      }
      // Fallback if render is not available or doesn't return a valid ReactNode
      return <div>Tool settings UI not available</div>;
    };
  }

  static getToolComponent(toolId: string): (new (props: ToolProps) => ToolHandler) | null {
    const toolDefinition = ToolRegistry.getTool(toolId);
    return toolDefinition ? toolDefinition.component : null;
  }
  static createToolInstance(toolId: string, props: ToolProps): ToolHandler | null {
    const ToolComponent = this.getToolComponent(toolId);
    
    if (!ToolComponent) {
      return null;
    }

    const toolDefinition = ToolRegistry.getTool(toolId);
    const mergedProps: ToolProps = {
      ...props,
      settings: {
        ...(toolDefinition?.defaultSettings || {}),
        ...(props.settings || {})
      },
      // Pass through the onSettingsChange callback if provided
      onSettingsChange: props.onSettingsChange,
    };

    return new ToolComponent(mergedProps);
  }

  static getAllToolDefinitions(): ToolDefinition[] {
    return ToolRegistry.getAllTools();
  }

  static getToolsByCategory(category: string): ToolDefinition[] {
    return ToolRegistry.getToolsByCategory(category);
  }

  static validateTool(toolId: string): boolean {
    return ToolRegistry.getTool(toolId) !== undefined;
  }
}
