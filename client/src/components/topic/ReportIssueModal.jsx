import React, { useState } from 'react';
import { Flag, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { api } from '../../services/api';

const REPORT_TYPES = [
  { value: 'broken_link', label: 'Broken or dead link' },
  { value: 'outdated_content', label: 'Outdated content' },
  { value: 'incorrect_info', label: 'Incorrect information' },
  { value: 'missing_resource', label: 'Missing or suggested resource' },
  { value: 'other', label: 'Other issue' },
];

export default function ReportIssueModal({
  isOpen,
  onClose,
  topicId,
  topicTitle,
  resources = [],
  preselectedResourceId = null,
}) {
  const [reportType, setReportType] = useState('broken_link');
  const [resourceId, setResourceId] = useState(preselectedResourceId || '');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    // Reset state on close
    setReportType('broken_link');
    setResourceId(preselectedResourceId || '');
    setDescription('');
    setSubmitting(false);
    setSubmitted(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topicId) return;

    setSubmitting(true);
    setError(null);

    try {
      await api.reports.submit({
        topicId,
        resourceId: resourceId || null,
        reportType,
        description: description.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={submitted ? 'Report Submitted' : 'Report an Issue'}
      description={
        submitted
          ? undefined
          : `Help us improve "${topicTitle}" by flagging content problems.`
      }
    >
      {submitted ? (
        <div className="text-center py-4 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
            <Flag className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-sm text-ink font-medium">Thank you for your report!</p>
          <p className="text-xs text-ink-muted leading-relaxed">
            Your feedback has been submitted and will be reviewed by a curator. Reports help
            keep the content accurate and up to date.
          </p>
          <div className="pt-2">
            <Button variant="secondary" onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Issue Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Issue Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {REPORT_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    reportType === type.value
                      ? 'border-brand bg-brand/5 text-brand'
                      : 'border-border hover:border-brand/40 text-ink'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={type.value}
                    checked={reportType === type.value}
                    onChange={(e) => setReportType(e.target.value)}
                    className="text-brand"
                  />
                  <span className="text-sm font-medium">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specific Resource (optional) */}
          {resources.length > 0 && (
            <div className="space-y-1.5">
              <label
                htmlFor="resourceId"
                className="block text-xs font-semibold text-ink-muted uppercase tracking-wider"
              >
                Specific Resource (optional)
              </label>
              <select
                id="resourceId"
                value={resourceId}
                onChange={(e) => setResourceId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              >
                <option value="">— Topic in general —</option>
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Optional description */}
          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-ink-muted uppercase tracking-wider"
            >
              Additional Details (optional)
            </label>
            <textarea
              id="description"
              rows={3}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in a bit more detail…"
              className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand resize-none"
            />
            <p className="text-right text-[11px] text-ink-muted">{description.length}/1000</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 border-t border-border flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
