import React, { useState } from 'react';

export default function EpubToHtml() {
  const [html, setHtml] = useState('');

  const onFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const files = await parseZip(buffer);

    const containerRaw = files['META-INF/container.xml'];
    if (!containerRaw) {
      setHtml('no container.xml found');
      return;
    }

    const container = new DOMParser().parseFromString(
      new TextDecoder().decode(containerRaw),
      'application/xml'
    );

    const rootfileEl = container.querySelector('rootfile');
    if (!rootfileEl) {
      setHtml('no rootfile found');
      return;
    }

    const rootfile = rootfileEl.getAttribute('full-path');
    const opfRaw = files[rootfile];
    if (!opfRaw) {
      setHtml('opf not found');
      return;
    }

    const opf = new DOMParser().parseFromString(
      new TextDecoder().decode(opfRaw),
      'application/xml'
    );

    const manifest = {};
    opf.querySelectorAll('manifest > item').forEach(i => {
      manifest[i.id] = i.getAttribute('href');
    });

    const spine = Array.from(opf.querySelectorAll('spine > itemref')).map(i =>
      manifest[i.getAttribute('idref')]
    );

    let out = '';
    const base = rootfile.replace(/[^/]+$/, '');
    for (let href of spine) {
      const full = base + href;
      const txt = files[full];
      if (!txt) continue;
      const doc = new DOMParser().parseFromString(
        new TextDecoder().decode(txt),
        'application/xhtml+xml'
      );
      out += doc.body?.innerHTML || '';
    }

    setHtml(out);
  };

  async function parseZip(buffer) {
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);
    const files = {};
    let ptr = 0;

    while (ptr + 30 < bytes.length && view.getUint32(ptr, true) === 0x04034b50) {
      const nameLen = view.getUint16(ptr + 26, true);
      const extraLen = view.getUint16(ptr + 28, true);
      const compSize = view.getUint32(ptr + 18, true);
      const uncompSize = view.getUint32(ptr + 22, true);
      const method = view.getUint16(ptr + 8, true);
      const name = new TextDecoder().decode(
        bytes.subarray(ptr + 30, ptr + 30 + nameLen)
      );
      const dataStart = ptr + 30 + nameLen + extraLen;
      const data = bytes.subarray(dataStart, dataStart + compSize);

      let decompressed;
      if (method === 0) {
        decompressed = data;
      } else if (method === 8 && 'DecompressionStream' in window) {
        const ds = new DecompressionStream('deflate');
        const stream = new Response(new Blob([data]).stream().pipeThrough(ds));
        decompressed = new Uint8Array(await stream.arrayBuffer());
      } else {
        console.warn('unsupported compression', method);
        decompressed = new Uint8Array();
      }

      files[name] = decompressed;
      ptr = dataStart + compSize;
    }

    return files;
  }

  return (
    <div>
      <input type="file" accept=\".epub\" onChange={onFile} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}