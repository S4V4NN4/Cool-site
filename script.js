function resetForm() 
{
    document.getElementById('registrationForm').reset();
}

function setCookie(name, value, days = 1) 
{
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function openDB()
{
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("UserDB", 1);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            db.createObjectStore("users", { keyPath: "email" }); // email = уникальный ключ
        };

        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function saveUser(data) 
{
    const db = await openDB();
    const tx = db.transaction("users", "readwrite");
    const store = tx.objectStore("users");
    store.put(data); // добавляет или обновляет по email
    return new Promise(resolve => tx.oncomplete = () => resolve());
}


document.getElementById("registrationForm").addEventListener("submit", function (event) 
{
    event.preventDefault();

    const form = event.target;
    const data = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        password: form.password.value,
        birthDate: form.birthDate.value,
        country: form.country.value,
    };

    if (form.password.value !== form.confirmPassword.value) {
        alert("Passwords do not match!");
        return;
    }

    const saveOption = form.querySelector("input[name='saveOption']:checked")?.value;

    if (!saveOption) 
    {
        alert("Please select where to save your data.");
        return;
    }

    switch (saveOption)
    {
        case "local":
            localStorage.setItem("userData", JSON.stringify(data));
            window.location.href = "success.html?method=local";
            break;

        case "session":
            sessionStorage.setItem("userData", JSON.stringify(data));
            window.location.href = "success.html?method=session";
            break;

        case "url":
            const queryString = new URLSearchParams(data).toString();
            window.location.href = "success.html?" + queryString + "&method=url";
            break;

        case "cookie":
            setCookie("userData", JSON.stringify(data));
            window.location.href = "success.html?method=cookie";
            break;

        case "indexeddb":
            saveUser(data).then(() => {
                // передаем email для success.html
                window.location.href = `success.html?method=indexeddb&email=${encodeURIComponent(data.email)}`;
            });
        break;

        default:
            alert("Unknown save option selected.");
    }
});
