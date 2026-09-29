const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getLabels
}

function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy, paramsSerializer: { indexes: null } })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + bug._id, bug)
            .then(res => res.data)
    }
    return axios.post(BASE_URL, bug)
        .then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, labels: [] }
}

function getLabels() {
    return ['back', 'front', 'critical', 'fixed', 'in progress', 'stuck']
}
