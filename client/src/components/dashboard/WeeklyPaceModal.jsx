import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ErrorAlert from '../ui/ErrorAlert';

export default function WeeklyPaceModal({
  isOpen,
  onClose,
  enrolment,
  onUpdatePace,
}) {
  const [weeklyHours, setWeeklyHours] = useState(enrolment?.weeklyHours || 5);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!enrolment) return null;

  const totalHours = enrolment.roadmap?.totalHours || 40;
  const estimatedWeeks = Math.ceil(totalHours / Math.max(1, weeklyHours));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onUpdatePace(enrolment.roadmap.slug, parseInt(weeklyHours, 10));
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update study pace.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Pace: ${enrolment.roadmap?.title}`}
      description="Adjust your weekly time commitment to recalculate your estimated completion schedule."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorAlert title="Update failed" message={error} />}

        <div>
          <label htmlFor="weeklyHoursInput" className="block text-sm font-medium text-ink mb-1.5">
            Weekly Study Hours (1–60)
          </label>
          <div className="flex items-center gap-3">
            <input
              id="weeklyHoursInput"
              type="number"
              min="1"
              max="60"
              required
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(e.target.value)}
              className="w-24 px-3 py-2 bg-surface text-ink text-sm rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <span className="text-xs text-ink-muted">
              At {weeklyHours} hours/week, completion takes ~<strong>{estimatedWeeks} weeks</strong>.
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save Target Pace
          </Button>
        </div>
      </form>
    </Modal>
  );
}
