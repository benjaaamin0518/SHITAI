import { useState } from "react";
import { X } from "lucide-react";
import { answer, ParticipationSchema } from "../../types/NeonApiInterface";
import { formatDisplayDate } from "../../utils/date";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: answer) => void;
  schema: ParticipationSchema;
  title: string;
  submitButtonText?: string;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onSubmit,
  schema,
  title,
  submitButtonText = "確定",
}: ConfirmationModalProps) => {
  const [formData, setFormData] = useState<answer>({});

  if (!isOpen || schema.type === "none") return null;

  const handleSubmit = (e: React.FormEvent) => {
    if (formData.datetime) {
      formData.datetime = formData.datetime;
    }
    console.log(formData, schema);
    if (schema.datetimeRequired == false && !formData.datetime) {
      formData.datetime = "1900/1/1 0:00";
    }
    if (schema.noteRequired == false && !formData.note) {
      formData.note = "未回答";
    }
    console.log(formData);
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
    onClose();
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 mb-6">
            {schema.type === "datetime" && schema.datetimeLabel && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {schema.datetimeLabel}
                  {schema.datetimeRequired && (
                    <span className="text-red-600 ml-1">*</span>
                  )}
                </label>
                <input
                  type="datetime-local"
                  value={formData.datetime || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, datetime: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required={schema.datetimeRequired}
                />
              </div>
            )}

            {schema.type === "note" && schema.noteLabel && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {schema.noteLabel}
                  {schema.noteRequired && (
                    <span className="text-red-600 ml-1">*</span>
                  )}
                </label>
                <textarea
                  value={formData.note || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={4}
                  required={schema.noteRequired}
                />
              </div>
            )}

            {schema.type === "mixed" && (
              <>
                {schema.datetimeLabel && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {schema.datetimeLabel}
                      {schema.datetimeRequired && (
                        <span className="text-red-600 ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.datetime || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, datetime: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required={schema.datetimeRequired}
                    />
                  </div>
                )}
                {schema.noteLabel && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {schema.noteLabel}
                      {schema.noteRequired && (
                        <span className="text-red-600 ml-1">*</span>
                      )}
                    </label>
                    <textarea
                      value={formData.note || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows={4}
                      required={schema.noteRequired}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md">
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationModal;
