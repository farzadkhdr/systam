// فانکشنەکانی سەرەکی
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    showSection('patients');
});

// نمایشدانی بەشێکی دیاریکراو
function showSection(sectionId) {
    // دۆزینەوەی هەموو بەشەکان و داپۆشینیان
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('d-none');
    });
    
    // نیشاندانی بەشی دیاریکراو
    document.getElementById(`${sectionId}-section`).classList.remove('d-none');
    
    // نوێکردنەوەی داتاکەکاتێ بەشێک دیاری دەکرێت
    if (sectionId === 'patients' || sectionId === 'appointments') {
        loadData();
    }
    
    if (sectionId === 'add-appointment') {
        loadPatientsForSelect();
    }
}

// دانانی گوێگرتنەوەکان
function setupEventListeners() {
    // فۆرمی زیادکردنی نەخۆش
    document.getElementById('add-patient-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addPatient();
    });
    
    // فۆرمی زیادکردنی ژوان
    document.getElementById('add-appointment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addAppointment();
    });
}

// بارکردنی داتا لە localStorage
function loadData() {
    loadPatients();
    loadAppointments();
    updateStats();
}

// بارکردنی نەخۆشەکان
function loadPatients() {
    let patients = getPatients();
    let table = document.getElementById('patients-table');
    table.innerHTML = '';
    
    patients.forEach(patient => {
        let row = `
            <tr>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.phone || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deletePatient(${patient.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

// بارکردنی ژوانەکان
function loadAppointments() {
    let appointments = getAppointments();
    let patients = getPatients();
    let table = document.getElementById('appointments-table');
    table.innerHTML = '';
    
    appointments.forEach(appointment => {
        let patient = patients.find(p => p.id === appointment.patient_id);
        let statusBadge = '';
        
        switch(appointment.status) {
            case 'confirmed':
                statusBadge = '<span class="badge bg-success">دیاریکراو</span>';
                break;
            case 'pending':
                statusBadge = '<span class="badge bg-warning">چاوەڕوان</span>';
                break;
            case 'cancelled':
                statusBadge = '<span class="badge bg-danger">هەڵوەشاوە</span>';
                break;
        }
        
        let row = `
            <tr>
                <td>${patient ? patient.name : 'نەخۆش'}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.reason}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${appointment.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

// بارکردنی نەخۆشەکان بۆ هەڵبژاردن
function loadPatientsForSelect() {
    let patients = getPatients();
    let select = document.getElementById('patient-select');
    select.innerHTML = '<option value="">هەڵبژاردنی نەخۆش</option>';
    
    patients.forEach(patient => {
        let option = document.createElement('option');
        option.value = patient.id;
        option.textContent = `${patient.name} (${patient.age} ساڵ)`;
        select.appendChild(option);
    });
}

// نوێکردنەوەی ئامارەکان
function updateStats() {
    let patients = getPatients();
    let appointments = getAppointments();
    
    document.getElementById('total-patients').textContent = patients.length;
    document.getElementById('total-appointments').textContent = appointments.length;
}

// زیادکردنی نەخۆشی تازە
function addPatient() {
    let name = document.getElementById('name').value;
    let age = document.getElementById('age').value;
    let gender = document.getElementById('gender').value;
    let phone = document.getElementById('phone').value;
    let address = document.getElementById('address').value;
    
    if (!name || !age || !gender) {
        alert('تکایە زانیارییە پێویستەکان پڕ بکەرەوە');
        return;
    }
    
    let patients = getPatients();
    let newPatient = {
        id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
        name: name,
        age: parseInt(age),
        gender: gender,
        phone: phone,
        address: address,
        created_at: new Date().toISOString()
    };
    
    patients.push(newPatient);
    savePatients(patients);
    
    alert('نەخۆش بە سەرکەوتوویی زیاد کرا');
    document.getElementById('add-patient-form').reset();
    loadData();
    showSection('patients');
}

// زیادکردنی ژوانی تازە
function addAppointment() {
    let patientId = document.getElementById('patient-select').value;
    let date = document.getElementById('date').value;
    let time = document.getElementById('time').value;
    let reason = document.getElementById('reason').value;
    let status = document.getElementById('status').value;
    
    if (!patientId || !date || !time || !reason) {
        alert('تکایە هەموو خانە پێویستەکان پڕ بکەرەوە');
        return;
    }
    
    let appointments = getAppointments();
    let newAppointment = {
        id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
        patient_id: parseInt(patientId),
        date: date,
        time: time,
        reason: reason,
        status: status,
        created_at: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    saveAppointments(appointments);
    
    alert('ژوان بە سەرکەوتوویی زیاد کرا');
    document.getElementById('add-appointment-form').reset();
    loadData();
    showSection('appointments');
}

// سڕینەوەی نەخۆش
function deletePatient(id) {
    if (confirm('دڵنیای لە سڕینەوەی ئەم نەخۆشە؟')) {
        let patients = getPatients().filter(p => p.id !== id);
        savePatients(patients);
        
        // سڕینەوەی ژوانەکانی ئەم نەخۆشە
        let appointments = getAppointments().filter(a => a.patient_id !== id);
        saveAppointments(appointments);
        
        loadData();
    }
}

// سڕینەوەی ژوان
function deleteAppointment(id) {
    if (confirm('دڵنیای لە سڕینەوەی ئەم ژوانە؟')) {
        let appointments = getAppointments().filter(a => a.id !== id);
        saveAppointments(appointments);
        loadData();
    }
}

// فانکشنەکانی کارکردن لەگەڵ localStorage
function getPatients() {
    return JSON.parse(localStorage.getItem('clinic_patients') || '[]');
}

function savePatients(patients) {
    localStorage.setItem('clinic_patients', JSON.stringify(patients));
}

function getAppointments() {
    return JSON.parse(localStorage.getItem('clinic_appointments') || '[]');
}

function saveAppointments(appointments) {
    localStorage.setItem('clinic_appointments', JSON.stringify(appointments));
}

// داتای نموونە بۆ دەستپێکردن
function initializeSampleData() {
    if (!localStorage.getItem('clinic_data_initialized')) {
        let samplePatients = [
            {
                id: 1,
                name: "عەلی محەممەد",
                age: 35,
                gender: "نێر",
                phone: "07501234567",
                address: "هەولێر",
                created_at: "2024-01-15T10:30:00Z"
            },
            {
                id: 2,
                name: "سارا عەبدوڵڵا",
                age: 28,
                gender: "مێ",
                phone: "07507654321",
                address: "سلێمانی",
                created_at: "2024-01-16T14:20:00Z"
            }
        ];
        
        let sampleAppointments = [
            {
                id: 1,
                patient_id: 1,
                date: "2024-12-20",
                time: "10:00",
                reason: "کۆنتڕۆڵی تەندروستی",
                status: "confirmed",
                created_at: "2024-01-18T09:00:00Z"
            },
            {
                id: 2,
                patient_id: 2,
                date: "2024-12-21",
                time: "14:30",
                reason: "تاقیکردنەوەی خوێن",
                status: "pending",
                created_at: "2024-01-18T10:15:00Z"
            }
        ];
        
        savePatients(samplePatients);
        saveAppointments(sampleAppointments);
        localStorage.setItem('clinic_data_initialized', 'true');
    }
}

// داتای نموونە زیاد بکە
initializeSampleData();
