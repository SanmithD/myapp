const CHUNK_SIZE = 16 * 1024; // 16KB — safe default for RTCDataChannel

export function sendFile(peer, file, onProgress) {
    return new Promise((resolve, reject) => {
        if (!peer || !peer.connected) {
            reject(new Error("Peer not connected"));
            return;
        }

        // 1. Send metadata first, as a JSON string
        peer.send(JSON.stringify({
            type: "meta",
            name: file.name,
            size: file.size,
            mime: file.type || "application/octet-stream",
        }));

        let offset = 0;

        const reader = new FileReader();

        const readSlice = (o) => {
            const slice = file.slice(o, o + CHUNK_SIZE);
            reader.readAsArrayBuffer(slice);
        };

        reader.onload = (e) => {
            try {
                peer.send(e.target.result);
            } catch (err) {
                reject(err);
                return;
            }
            offset += e.target.result.byteLength;
            onProgress?.(Math.min(100, Math.round((offset / file.size) * 100)));

            if (offset < file.size) {
                // Yield a tick so we don't flood the data channel buffer
                setTimeout(() => readSlice(offset), 0);
            } else {
                peer.send(JSON.stringify({ type: "done" }));
                resolve();
            }
        };

        reader.onerror = reject;
        readSlice(0);
    });
}

// Wraps a peer's incoming data into full files.
// onFile(fileMeta, blob) is called once a transfer completes.
export function createFileReceiver(peer, onFile) {
    let meta = null;
    let chunks = [];
    let received = 0;

    peer.on("data", (data) => {
        // JSON control messages arrive as strings (simple-peer keeps them as Buffer/string)
        const asString = typeof data === "string" ? data : null;
        let parsed = null;
        if (asString) {
            try {
                parsed = JSON.parse(asString);
            } catch {
                parsed = null;
            }
        }

        if (parsed?.type === "meta") {
            meta = parsed;
            chunks = [];
            received = 0;
            return;
        }

        if (parsed?.type === "done") {
            const blob = new Blob(chunks, { type: meta?.mime || "application/octet-stream" });
            onFile(meta, blob);
            meta = null;
            chunks = [];
            received = 0;
            return;
        }

        // Otherwise it's a binary chunk
        chunks.push(data);
        received += data.byteLength ?? data.length ?? 0;
    });
}