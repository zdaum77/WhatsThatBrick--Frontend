import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

export default function SubmitRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    part_code: '',
    category: '',
    description: '',
    color_variants: [{ name: '', code: '' }]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.color_variants];
    newColors[index][field] = value;
    setFormData({ ...formData, color_variants: newColors });
  };

  const addColor = () => {
    setFormData({
      ...formData,
      color_variants: [...formData.color_variants, { name: '', code: '' }]
    });
  };

  const removeColor = (index) => {
    const newColors = formData.color_variants.filter((_, i) => i !== index);
    setFormData({ ...formData, color_variants: newColors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty color variants
      const cleanedData = {
        ...formData,
        color_variants: formData.color_variants.filter(c => c.name)
      };

      await api.post('/requests', cleanedData);
      toast.success('Request submitted successfully! An admin will review it soon.');
      navigate('/my-contributions');
    } catch (error) {
      console.error('Failed to submit request');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit New Part Request</h1>
        <p className="text-gray-600">
          Found a brick that's not in our database? Submit it for review by our admin team.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Part Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Part Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
              placeholder="e.g., Brick 2x4"
            />
          </div>

          {/* Part Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Part Code (Optional)
            </label>
            <input
              type="text"
              name="part_code"
              value={formData.part_code}
              onChange={handleChange}
              className="input"
              placeholder="e.g., 3001"
            />
            <p className="text-sm text-gray-500 mt-1">
              If known, enter the official LEGO part number
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select a category</option>
              <option value="brick">Brick</option>
              <option value="plate">Plate</option>
              <option value="tile">Tile</option>
              <option value="slope">Slope</option>
              <option value="technic">Technic</option>
              <option value="small-parts">Small Parts</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows={4}
              placeholder="Describe the part, where you found it, any unique characteristics..."
            />
          </div>

          {/* Color Variants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Variants
            </label>
            {formData.color_variants.map((color, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Color name (e.g., Red)"
                  value={color.name}
                  onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                  className="input flex-1"
                />
                <input
                  type="text"
                  placeholder="Hex code (e.g., #FF0000)"
                  value={color.code}
                  onChange={(e) => handleColorChange(index, 'code', e.target.value)}
                  className="input w-32"
                />
                {formData.color_variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addColor}
              className="btn btn-secondary mt-2"
            >
              + Add Color
            </button>
          </div>


          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}