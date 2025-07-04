import React, { useState, useRef } from 'react';

// minimal inline zip parser + epub loader, no external deps
export default function EpubToHtml() {
  const [html, setHtml] = useState('');
  const inputRef = useRef();

  const onFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const files = parseZip(buffer);

    // find container.xml
    const container = new DOMParser().parseFromString(
      new TextDecoder().decode(files['META-INF/container.xml'] || ''),
      'application/xml'
    );
    const rootfile = container.querySelector('rootfile').getAttribute('full-path');
    const opf = new DOMParser().parseFromString(
      new TextDecoder().decode(files[rootfile]),
      'application/xml'
    );

    // build spine order
    const manifest = {}; opf.querySelectorAll('manifest > item').forEach(i => manifest[i.id] = i.getAttribute('href'));
    const spine = Array.from(opf.querySelectorAll('spine > itemref')).map(i => manifest[i.getAttribute('idref')]);

    let out = '';
    for (let href of spine) {
      const base = rootfile.replace(/[^\/]+$/, '');
      const full = base + href;
      const txt = files[full];
      if (!txt) continue;
      const doc = new DOMParser().parseFromString(new TextDecoder().decode(txt), 'application/xhtml+xml');
      out += doc.body.innerHTML;
    }
    setHtml(out);
  };

  function parseZip(buffer) {
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);
    const files = {};
    let ptr = 0;
    while (ptr < bytes.length) {
      if (view.getUint32(ptr, true) !== 0x04034b50) break; // local file header
      const nameLen = view.getUint16(ptr + 26, true);
      const extraLen = view.getUint16(ptr + 28, true);
      const compSize = view.getUint32(ptr + 18, true);
      const name = new TextDecoder().decode(bytes.subarray(ptr + 30, ptr + 30 + nameLen));
      const dataStart = ptr + 30 + nameLen + extraLen;
      const data = bytes.subarray(dataStart, dataStart + compSize);
      // assume stored or deflated
      const method = view.getUint16(ptr + 8, true);
      let decompressed;
      if (method === 0) {
        decompressed = data;
      } else if (method === 8 && 'DecompressionStream' in window) {
        const ds = new DecompressionStream('deflate');
        const dec = new Response(
          new Blob([data]).stream().pipeThrough(ds)
        );
        decompressed = new Uint8Array(await dec.arrayBuffer());
      } else {
        console.error('unsupported compression', method);
        decompressed = new Uint8Array();
      }
      files[name] = decompressed;
      ptr = dataStart + compSize;
    }
    return files;
  }

  return (
    <div>
      <input type="file" accept=".epub" ref={inputRef} onChange={onFile} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}