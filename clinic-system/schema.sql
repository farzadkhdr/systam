-- داتابەیسێکی سادە بۆ بەڕێوەبردنی نەخۆشەکان
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- داتای نموونە
INSERT OR IGNORE INTO patients (name, age, gender, phone) VALUES 
('عەلی محەممەد', 35, 'نێر', '07501234567'),
('سارا عەبدوڵڵا', 28, 'مێ', '07507654321');

INSERT OR IGNORE INTO appointments (patient_id, date, time, reason, status) VALUES
(1, '2024-12-20', '10:00', 'کۆنتڕۆڵی تەندروستی', 'confirmed'),
(2, '2024-12-21', '14:30', 'تاقیکردنەوەی خوێن', 'pending');
