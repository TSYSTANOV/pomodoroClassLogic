
class LocalStor{
    setItem(name, body){
        localStorage.setItem(name, JSON.stringify(body))
    }
    getItem(name){
        return localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : null
    }
}

const LOCAL_STORAGE_component = new LocalStor()
export {LOCAL_STORAGE_component}