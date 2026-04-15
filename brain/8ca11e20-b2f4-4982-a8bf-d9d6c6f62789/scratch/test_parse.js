
function parseData(data) {
    // Assuming data is a string where each char is a byte (binary string)
    const bytes = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        bytes[i] = data.charCodeAt(i);
    }
    
    console.log("Total bytes:", bytes.length);
    
    // First 16 bytes for UUID
    const uuidBytes = bytes.slice(0, 16);
    const uuidHex = Array.from(uuidBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    console.log("UUID Hex:", uuidHex);
    
    // Rest is value
    const valueBytes = bytes.slice(16);
    console.log("Value Bytes:", valueBytes);
    
    // Try to parse as Float32 (Big Endian)
    if (valueBytes.length >= 4) {
        const view = new DataView(valueBytes.buffer);
        const floatValue = view.getFloat32(0, false);
        console.log("Float32 (BE):", floatValue);
        const floatValueLE = view.getFloat32(0, true);
        console.log("Float32 (LE):", floatValueLE);
    }
}

const example = 'WA\xc2:,tMm\xb1A\x9e\xa7\xbaM$WA\xcc\x00\x00';
// Wait, in JS '\xc2' in a string might be interpreted as a Unicode character.
// If the user's input is a raw byte stream, we need to be careful.
parseData(example);
