/**
 * Text Selection Container Manager
 * 
 * Manages text selection across different containers according to SOLID principles:
 * - Single Responsibility: Only handles container exclusion logic
 * - Open-Closed: Extensible for new container types
 * - Dependency Inversion: Uses abstraction for container identification
 */

export interface TextSelectionContainer {
  /** Unique identifier for the container */
  id: string;
  /** CSS selector or element reference */
  element: HTMLElement | string;
  /** Whether this container should be excluded from text selection */
  excludeFromSelection: boolean;
  /** Priority for handling conflicts (higher = more priority) */
  priority: number;
}

export interface ITextSelectionManager {
  /**
   * Registers a new container for text selection management.
   * 
   * @param container - Container configuration to register
   * @throws Error if container with same ID already exists
   */
  registerContainer(container: TextSelectionContainer): void;

  /**
   * Unregisters a container from text selection management.
   * 
   * @param containerId - ID of container to unregister
   */
  unregisterContainer(containerId: string): void;

  /**
   * Checks if text selection should be allowed for given element.
   * 
   * @param element - Element where selection occurred
   * @returns True if selection should be allowed, false otherwise
   */
  shouldAllowSelection(element: Node): boolean;

  /**
   * Gets the container configuration for an element.
   * 
   * @param element - Element to check
   * @returns Container configuration if found, null otherwise
   */
  getContainerForElement(element: Node): TextSelectionContainer | null;
}

/**
 * Default implementation of text selection container manager.
 * Follows Single Responsibility and Open-Closed principles.
 */
export class TextSelectionManager implements ITextSelectionManager {
  private containers = new Map<string, TextSelectionContainer>();

  /**
   * Creates a new TextSelectionManager instance.
   */
  constructor() {
    this.registerDefaultContainers();
  }

  /**
   * Registers default containers that should be excluded from text selection.
   * Following Open-Closed principle - can be extended without modification.
   */
  private registerDefaultContainers(): void {
    // Deep learning drawer content should be excluded
    this.registerContainer({
      id: 'deep-learning-drawer',
      element: '[data-container="deep-learning-drawer"]',
      excludeFromSelection: true,
      priority: 10
    });

    // Translation popups should be excluded
    this.registerContainer({
      id: 'translation-popup',
      element: '[data-container="translation-popup"]',
      excludeFromSelection: true,
      priority: 8
    });

    // Quick lookup popups should be excluded
    this.registerContainer({
      id: 'quick-lookup-popup',
      element: '[data-container="quick-lookup-popup"]',
      excludeFromSelection: true,
      priority: 8
    });

    // Main content areas should allow selection
    this.registerContainer({
      id: 'main-content',
      element: '[data-container="main-content"]',
      excludeFromSelection: false,
      priority: 1
    });
  }

  registerContainer(container: TextSelectionContainer): void {
    if (this.containers.has(container.id)) {
      throw new Error(`Container with ID '${container.id}' already exists`);
    }
    this.containers.set(container.id, container);
  }

  unregisterContainer(containerId: string): void {
    this.containers.delete(containerId);
  }

  shouldAllowSelection(element: Node): boolean {
    const container = this.getContainerForElement(element);
    
    // If no specific container found, allow selection by default
    if (!container) {
      return true;
    }

    // Return the opposite of excludeFromSelection flag
    return !container.excludeFromSelection;
  }

  getContainerForElement(element: Node): TextSelectionContainer | null {
    const elementToCheck = element.nodeType === Node.TEXT_NODE 
      ? element.parentElement 
      : element as Element;

    if (!elementToCheck) {
      return null;
    }

    // Find containers that match this element, sorted by priority
    const matchingContainers = Array.from(this.containers.values())
      .filter(container => this.elementMatchesContainer(elementToCheck, container))
      .sort((a, b) => b.priority - a.priority);

    return matchingContainers[0] || null;
  }

  /**
   * Checks if an element matches a container definition.
   * Supports both CSS selectors and direct element references.
   * 
   * @param element - Element to check
   * @param container - Container definition
   * @returns True if element matches container
   */
  private elementMatchesContainer(element: Element, container: TextSelectionContainer): boolean {
    if (typeof container.element === 'string') {
      // CSS selector matching
      return element.matches(container.element) || element.closest(container.element) !== null;
    } else {
      // Direct element reference matching
      return element === container.element || container.element.contains(element);
    }
  }
}

/**
 * Global singleton instance of the text selection manager.
 * Following Dependency Inversion principle by providing abstraction.
 */
export const textSelectionManager: ITextSelectionManager = new TextSelectionManager();