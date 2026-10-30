/**
 * API service layer connecting to the FastAPI backend.
 * Uses real endpoints and respects actual backend status.
 * Does not invent mock predictions or fake responses.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      return {
        online: true,
        modelAvailable: false,
        statusCode: res.status,
        message: `Backend returned status ${res.status}`,
      };
    }
    const data = await res.json();
    return {
      online: true,
      modelAvailable: Boolean(data.model_available),
      status: data.status,
    };
  } catch (err) {
    return {
      online: false,
      modelAvailable: false,
      error: err.message || 'Cannot connect to backend server',
    };
  }
}

export async function getBackendModels() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/models`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return { models: [], note: `Error: HTTP ${res.status}` };
    return await res.json();
  } catch (err) {
    return { models: [], note: 'Backend unreachable' };
  }
}

export async function getBackendBenchmarks() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/models/benchmark`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function predictFeatures(features) {
  const res = await fetch(`${API_BASE}/api/v1/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ features }),
  });

  if (!res.ok) {
    let errDetail = `Status ${res.status}`;
    try {
      const errJson = await res.json();
      errDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errDetail = await res.text();
    }
    throw new Error(errDetail);
  }
  return await res.json();
}

export async function validateEcgCsv(file, fs = 360) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fs', String(fs));
  formData.append('column', '0');

  const res = await fetch(`${API_BASE}/api/v1/ecg/validate`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Validation failed with status ${res.status}`);
  }
  return await res.json();
}

export async function submitEcgAnalysis(file, fs = 360) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fs', String(fs));
  formData.append('column', '0');

  const res = await fetch(`${API_BASE}/api/v1/ecg/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errDetail = `Status ${res.status}`;
    try {
      const errJson = await res.json();
      errDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errDetail = await res.text();
    }
    throw new Error(errDetail);
  }
  return await res.json();
}
