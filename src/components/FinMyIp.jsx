import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FindMyIp = () => {
  const [ip, setIp] = useState('');
  const [mode, setMode] = useState('auto');
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleModeChange = (e) => {
    setMode(e.target.value);
    setIp('');
    setIpData(null);
    setErrorMsg('');
    setShowDetails(false);
  };

  const fetchMyIp = () => {
    setLoading(true);
    setErrorMsg('');
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => {
        setIp(data.ip);
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg('فشل في جلب عنوان IP');
        setLoading(false);
      });
  };

  const fetchIpDetails = () => {
    if (!ip) {
      setErrorMsg('يرجى إدخال عنوان IP أولاً');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setIpData(null);
    setShowDetails(false);

    // المحاولة الأولى: ipapi.co
    fetch(`https://ipapi.co/${ip}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error('ipapi failed');
        setIpData({
          country_name: data.country_name,
          city: data.city,
          region: data.region,
          postal: data.postal,
          latitude: data.latitude,
          longitude: data.longitude,
          org: data.org,
          timezone: data.timezone,
        });
        setShowDetails(true);
        setLoading(false);
      })
      .catch(() => {
        // المحاولة الثانية: ip-api.com
        fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,zip,lat,lon,org,timezone`)
          .then((res) => res.json())
          .then((data) => {
            if (data.status !== 'success') throw new Error('Both APIs failed');
            setIpData({
              country_name: data.country,
              city: data.city,
              region: data.regionName,
              postal: data.zip,
              latitude: data.lat,
              longitude: data.lon,
              org: data.org,
              timezone: data.timezone,
            });
            setShowDetails(true);
            setLoading(false);
          })
          .catch(() => {
            setErrorMsg('تعذر تحميل بيانات الموقع من جميع المصادر');
            setLoading(false);
          });
      });
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg p-4 border-0 rounded-4">
            <h2 className="text-center mb-4">🌍 تحديد عنوان IP وموقعك</h2>

            <div className="mb-3">
              <label className="form-label fw-bold">طريقة الحصول على IP:</label>
              <select className="form-select" value={mode} onChange={handleModeChange}>
                <option value="auto">تلقائي</option>
                <option value="manual">يدوي</option>
              </select>
            </div>

            {mode === 'manual' && (
              <div className="mb-3">
                <label className="form-label">أدخل عنوان IP:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="مثال: 8.8.8.8"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                />
              </div>
            )}

            {mode === 'auto' && (
              <div className="d-grid mb-3">
                <button className="btn btn-outline-primary" onClick={fetchMyIp} disabled={loading}>
                  {loading ? 'جاري التحميل...' : 'جلب عنوان IP'}
                </button>
              </div>
            )}

            {ip && (
              <div className="alert alert-info text-center">
                <strong>عنوان IP:</strong> {ip}
              </div>
            )}

            <div className="d-grid mb-3">
              <button className="btn btn-primary" onClick={fetchIpDetails} disabled={loading}>
                {loading ? 'جاري التحميل...' : 'عرض التفاصيل الجغرافية'}
              </button>
            </div>

            {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}

            {showDetails && ipData && (
              <div className="mt-4">
                <h5 className="text-center mb-3">📌 تفاصيل الموقع</h5>
                <ul className="list-group">
                  <li className="list-group-item"><strong>الدولة:</strong> {ipData.country_name}</li>
                  <li className="list-group-item"><strong>المدينة:</strong> {ipData.city}</li>
                  <li className="list-group-item"><strong>المنطقة:</strong> {ipData.region}</li>
                  <li className="list-group-item"><strong>الرمز البريدي:</strong> {ipData.postal}</li>
                  <li className="list-group-item"><strong>الإحداثيات:</strong> {ipData.latitude}, {ipData.longitude}</li>
                  <li className="list-group-item"><strong>مزود الخدمة:</strong> {ipData.org}</li>
                  <li className="list-group-item"><strong>المنطقة الزمنية:</strong> {ipData.timezone}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMyIp;
