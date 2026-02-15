import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * Patch removeChild/insertBefore to gracefully handle DOM nodes moved by
 * browser extensions, translation tools, or third-party iframes (e.g. Google Maps).
 * Without this, React's reconciler throws "NotFoundError: The node to be
 * removed is not a child of this node" during commitDeletionEffects.
 * See: https://github.com/facebook/react/issues/17256
 */
const originalRemoveChild = Node.prototype.removeChild;
// @ts-ignore – we intentionally override the signature
Node.prototype.removeChild = function <T extends Node>(child: T): T {
  if (child.parentNode !== this) {
    console.warn('[DOM patch] removeChild: node is not a child — skipping', child);
    return child;
  }
  return originalRemoveChild.call(this, child) as T;
};

const originalInsertBefore = Node.prototype.insertBefore;
// @ts-ignore
Node.prototype.insertBefore = function <T extends Node>(newNode: T, refNode: Node | null): T {
  if (refNode && refNode.parentNode !== this) {
    console.warn('[DOM patch] insertBefore: ref node is not a child — appending instead', refNode);
    return originalInsertBefore.call(this, newNode, null) as T;
  }
  return originalInsertBefore.call(this, newNode, refNode) as T;
};

createRoot(document.getElementById("root")!).render(<App />);
