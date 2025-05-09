import React, { useState } from 'react';
import './PlantCheck.css';

const PlantCheck = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // لتخزين مسار الصورة المؤقت
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // إنشاء مسار مؤقت للصورة
            setResult(null);
        } else {
            alert('Please select a valid image file (JPG, PNG, or WEBP)');
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const file = event.dataTransfer.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // إنشاء مسار مؤقت للصورة
            setResult(null);
        } else {
            alert('Please select a valid image file (JPG, PNG, or WEBP)');
        }
    };

    const handleCheckPlant = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setLoading(true);
            setResult(null); // إعادة تعيين النتائج السابقة

            console.log('جاري إرسال الصورة...');
            const response = await fetch('https://8bf2-197-53-108-239.ngrok-free.app/predict?lang=ar ', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log('حالة الاستجابة:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('نص الخطأ:', errorText);
                throw new Error(`خطأ في الاتصال بالسيرفر (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            console.log('البيانات المستلمة:', data);
            setResult(data);
        } catch (error) {
            console.error('خطأ:', error);
            let errorMessage = 'فشل التحقق من الصورة';

            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'فشل الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.';
            } else if (error.message.includes('NetworkError')) {
                errorMessage = 'خطأ في الشبكة. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.';
            } else if (error.message.includes('Timeout')) {
                errorMessage = 'انتهت مهلة الاتصال. حاول مرة أخرى.';
            }

            setResult({ error: `${errorMessage}\n${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="plantCheck-container">
            <div className="plantCheck-box">
                <div
                    className="upload-area"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileSelect}
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                    />

                    {/* عرض الصورة المختارة */}
                    {previewUrl ? (
                        <img src={previewUrl} alt="Selected Plant Image" className="uploaded-image" />
                    ) : (
                        <label htmlFor="file-upload" className="upload-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Upload
                        </label>
                    )}

                    {/* تعليمات اختيار الصورة */}
                    {!previewUrl && (
                        <p className="upload-text">
                            Choose images or drag & drop it here.
                            <br />
                            JPG, JPEG, PNG and WEBP. Max 20 MB.
                        </p>
                    )}
                </div>

                {/* زر التحقق من النبات */}
                <button
                    className="check-plant-button"
                    onClick={handleCheckPlant}
                    disabled={!selectedFile || loading}
                >
                    {loading ? 'Checking...' : 'Check Plant'}
                </button>

                {/* النتائج */}
                {result && (
                    <div className="result-box">
                        {result.error ? (
                            <p className="error-text">{result.error}</p>
                        ) : (
                            <div className="success-text">
                                <h3>✅ النتيجة:</h3>
                                <table className="result-table">
                                    <tbody>
                                        {result.plant && (
                                            <tr>
                                                <td><strong>النبات:</strong></td>
                                                <td>{result.plant}</td>
                                            </tr>
                                        )}
                                        {result.disease && (
                                            <tr>
                                                <td><strong>المرض:</strong></td>
                                                <td>{result.disease}</td>
                                            </tr>
                                        )}
                                        {result.confidence && (
                                            <tr>
                                                <td><strong>درجة الثقة:</strong></td>
                                                <td>{result.confidence}</td>
                                            </tr>
                                        )}
                                        {result.treatment && (
                                            <tr>
                                                <td><strong>العلاج:</strong></td>
                                                <td>{result.treatment}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlantCheck;