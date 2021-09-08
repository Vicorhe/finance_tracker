export function getBreakdownURLObject(a) {
    return {
        pathname: '/breakdown',
        query: {
            area: extractAreaId(a),
        }
    }
}

function extractAreaId(a) {
    if ('label' in a) return a.label
    if ('data' in a) {
        if ('id' in a.data) return a.data.id
    }
    if ('id' in a) return a.id
}