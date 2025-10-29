import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
      <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
      <p className="text-red-800">{message}</p>
    </div>
  );
}