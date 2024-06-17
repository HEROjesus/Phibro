import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://turnos-3b42a-default-rtdb.firebaseio.com/";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD-tXOsvMb-qJrWLTjsNOZI4SxDMD584Xo",
    authDomain: "turnos-3b42a.firebaseapp.com",
    databaseURL: "https://turnos-3b42a-default-rtdb.firebaseio.com",
    projectId: "turnos-3b42a",
    storageBucket: "turnos-3b42a.appspot.com",
    messagingSenderId: "834124372879",
    appId: "1:834124372879:web:7ddec1d5349127fd4dc9fa",
    measurementId: "G-RCBXLPY2GC"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const Storage = storageBucket(Storage);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const getTimeOfDay = () => {
        const hours = new Date().getHours();
        if (hours < 12) {
            return 'Bom dia';
        } else if (hours < 18) {
            return 'Boa tarde';
        } else {
            return 'Boa noite';
        }
    };

    const getTimeElapsed = (timestamp) => {
        const elapsed = Date.now() - timestamp;
        const minutes = Math.floor(elapsed / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} dias atrás`;
        } else if (hours > 0) {
            return `${hours} horas atrás`;
        } else if (minutes > 0) {
            return `${minutes} minutos atrás`;
        } else {
            return `${Math.floor(elapsed / 1000)} segundos atrás`;
        }
    };

    const saveFormsLocally = (forms) => {
        localStorage.setItem('forms', JSON.stringify(forms));
    };

    const loadFormsFromLocal = () => JSON.parse(localStorage.getItem('forms')) || [];

    const saveFormToFirebase = async (form) => {
        const formsRef = ref(database, 'forms');
        await push(formsRef, form);
    };

    const deleteForm = async (id) => {
        const formRef = ref(database, `forms/${id}`);
        await remove(formRef);
        loadForms();
    };

    const loadFormsFromFirebase = () => {
        return new Promise((resolve, reject) => {
            onValue(ref(database, 'forms'), (snapshot) => {
                const forms = snapshot.val();
                resolve(forms || {});
            }, reject);
        });
    };

    const loadForms = async () => {
        const formRows = document.getElementById('form-rows');
        formRows.innerHTML = '';

        try {
            const forms = await loadFormsFromFirebase();
            Object.keys(forms).forEach((key) => {
                const form = forms[key];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${form.name}</td>
                    <td>${getTimeElapsed(form.created)}</td>
                    <td>${form.responses}</td>
                    <td>${form.misturadores}</td>
                    <td>${form.data}</td>
                    <td>
                        <a href="form.html?id=${key}">Ver mais..</a>
                        <button class="delete-button" data-id="${key}">Excluir</button>
                    </td>
                `;
                formRows.appendChild(row);
            });
            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    deleteForm(event.target.getAttribute('data-id'));
                });
            });
        } catch (error) {
            console.error("Error loading forms from Firebase:", error);
            const forms = loadFormsFromLocal();
            forms.forEach((form, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${form.name}</td>
                    <td>${getTimeElapsed(form.created)}</td>
                    <td>${form.responses}</td>
                    <td>${form.misturadores}</td>
                    <td>${form.data}</td>
                    <td>
                        <a href="form.html?id=${index}">Ver mais..</a>
                        <button class="delete-button" data-id="${index}">Excluir</button>
                    </td>
                `;
                formRows.appendChild(row);
            });
            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');
                    forms.splice(id, 1);
                    saveFormsLocally(forms);
                    loadForms();
                });
            });
        }
    };

    loadForms();

    document.querySelector('header h1').textContent = `${getTimeOfDay()}, Colaborador`;

    const modal = document.getElementById('modal');
    const createFormButton = document.querySelector('.create-form');
    const closeModalButton = document.querySelector('.close');
    const createForm = document.getElementById('createForm');

    createFormButton.onclick = () => {
        modal.style.display = "block";
    };

    closeModalButton.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    createForm.onsubmit = async (event) => {
        event.preventDefault();
        const formName = document.getElementById('formName').value;
        const formData = document.getElementById('formData').value;
        const formResponses = document.getElementById('formResponses').value;
        const formMisturadores = document.getElementById('formMisturadores').value;

        const newForm = {
            name: formName,
            responses: formResponses,
            misturadores: formMisturadores,
            data: formData,
            created: Date.now()
        };

        try {
            await saveFormToFirebase(newForm);
        } catch (error) {
            console.error("Error saving form to Firebase:", error);
            const forms = loadFormsFromLocal();
            forms.push(newForm);
            saveFormsLocally(forms);
        }

        loadForms();
        modal.style.display = "none";
        createForm.reset();
    };
});
