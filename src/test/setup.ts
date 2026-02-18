import '@testing-library/jest-dom/vitest';

// jsdom 28 removed AnimationEvent as a constructable class; polyfill it so
// fireEvent.animationEnd works in tests.
if (typeof AnimationEvent === 'undefined' || !(new AnimationEvent('test') instanceof Event)) {
    class AnimationEventPolyfill extends Event {
        animationName: string;
        elapsedTime: number;
        pseudoElement: string;
        constructor(type: string, init: AnimationEventInit = {}) {
            super(type, init);
            this.animationName = init.animationName ?? '';
            this.elapsedTime = init.elapsedTime ?? 0;
            this.pseudoElement = init.pseudoElement ?? '';
        }
    }
    Object.defineProperty(globalThis, 'AnimationEvent', { value: AnimationEventPolyfill, writable: true });
}
