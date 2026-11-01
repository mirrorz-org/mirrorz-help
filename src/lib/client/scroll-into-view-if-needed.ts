/*
 * Adapted from https://gist.github.com/jocki84/6ffafd003387179a988e
 * under the ISC licence.
 * Copyright 2015-2019 Jocki84
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

function makeRange(start: number, length: number) {
  return { start, length, end: start + length };
}

function makePoint(x: number, y: number) {
  return { x, y };
}

function absolute(element: Element | null, point: ReturnType<typeof makePoint>) {
  while (element instanceof HTMLElement) {
    point = makePoint(point.x + element.offsetLeft, point.y + element.offsetTop);
    element = element.offsetParent;
    // Offsets are relative to the offset parent's padding edge, not its border edge.
    if (element instanceof HTMLElement) {
      point = makePoint(point.x + element.clientLeft, point.y + element.clientTop);
    }
  }
  return point;
}

// Local ponyfill: importing this module does not modify Element.prototype.
export function scrollIntoViewIfNeeded(targetElement: HTMLElement, centerIfNeeded = true) {
  function coverRange(inner: ReturnType<typeof makeRange>, outer: ReturnType<typeof makeRange>) {
    if (!centerIfNeeded || (outer.start < inner.end && inner.start < outer.end)) {
      return Math.max(inner.end - outer.length, Math.min(outer.start, inner.start));
    }
    return (inner.start + inner.end - outer.length) / 2;
  }

  let target = absolute(targetElement, makePoint(0, 0));
  const extent = makePoint(targetElement.offsetWidth, targetElement.offsetHeight);
  let element = targetElement.parentElement;
  while (element instanceof HTMLElement) {
    const origin = absolute(element, makePoint(element.clientLeft, element.clientTop));
    element.scrollLeft = coverRange(
      makeRange(target.x - origin.x, extent.x),
      makeRange(element.scrollLeft, element.clientWidth)
    );
    element.scrollTop = coverRange(
      makeRange(target.y - origin.y, extent.y),
      makeRange(element.scrollTop, element.clientHeight)
    );
    // Read back the actual, clamped scroll position before visiting the parent.
    target = makePoint(target.x - element.scrollLeft, target.y - element.scrollTop);
    element = element.parentElement;
  }
}
