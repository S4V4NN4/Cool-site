function getDataFromURL() 
{
    const params = new URLSearchParams(window.location.search);
    return {
        firstName: params.get('firstName'),
        lastName: params.get('lastName'),
        email: params.get('email'),
        birthDate: params.get('birthDate'),
        country: params.get('country'),
    };
}

function getDataFromLocalStorage() 
{
    const json = localStorage.getItem('userData');
    return json ? JSON.parse(json) : {};
}

function getDataFromSessionStorage() 
{
    const json = sessionStorage.getItem('userData');
    return json ? JSON.parse(json) : {};
}

function getDataFromCookies() 
{
    const cookieObj = Object.fromEntries(
        document.cookie.split('; ').map(c => c.split('=').map(decodeURIComponent))
    );
    if (cookieObj.userData) {
        try {
            return JSON.parse(cookieObj.userData);
        } catch {
            return {};
        }
    }
    return {};
}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("UserDB", 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            db.createObjectStore("users", { keyPath: "email" });
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

function getUser(email) {
    return openDB().then(db => {
        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");
        return new Promise(resolve => {
            const req = store.get(email);
            req.onsuccess = () => resolve(req.result || {});
        });
    });
}

async function fillIndexedDBData(email) {
    const user = await getUser(email);
    if (!user) return;

    document.getElementById('userName').textContent = user.firstName || '';
    document.getElementById('firstName').textContent = user.firstName || '';
    document.getElementById('lastName').textContent = user.lastName || '';
    document.getElementById('email').textContent = user.email || '';
    document.getElementById('country').textContent = user.country || '';

    const today = new Date();
    const birthDate = new Date(user.birthDate);
    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today)
    {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const diffDays = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    document.getElementById('daysUntilBirthday').textContent = diffDays;
}


const params = new URLSearchParams(window.location.search);
const method = params.get('method');

if (method === 'indexeddb')
{
    const email = params.get('email');
    fillIndexedDBData(email); 
}
else
{
    let data = {};

    switch (method) 
    {
        case 'local':
            data = getDataFromLocalStorage();
            break;
        case 'session':
            data = getDataFromSessionStorage();
            break;
        case 'cookie':
            data = getDataFromCookies();
            break;
        case 'url':
            data = getDataFromURL();
            break;
    }
    
    document.getElementById('userName').textContent = data.firstName || '';
    document.getElementById('firstName').textContent = data.firstName || '';
    document.getElementById('lastName').textContent = data.lastName || '';
    document.getElementById('email').textContent = data.email || '';
    document.getElementById('country').textContent = data.country || '';
    
    const today = new Date();
    const birthDate = new Date(data.birthDate);
            
    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) 
    {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffDays = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    
    document.getElementById('daysUntilBirthday').textContent = diffDays;
}