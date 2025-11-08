export function magnitude(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}

export function calculateDistance(posA, posB) {
    let direction = {
        x: posA.x - posB.x,
        y: posA.y - posB.y,
        z: posA.z - posB.z
    };
    return magnitude(direction);
}