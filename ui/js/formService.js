// ui/js/formService.js

/**
 * Load all saved fields for a given reportNumber.
 * Returns an object: { fieldId: { label, value }, … }
 */
export async function loadForm(reportNumber) {
  const res = await fetch(`http://localhost:5500/api/form/${reportNumber}`);
  if (!res.ok) return {}; 
  const { fields } = await res.json();
  return fields || {};
}

/**
 * Save (upsert) just the passed-in fields for this reportNumber.
 * fields should be: { fieldId: { label, value }, … }
 */
export async function saveFields(reportNumber, fields) {
  const res = await fetch(`http://localhost:5500/api/form/${reportNumber}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Save failed');
  }
  return await res.json();
}
