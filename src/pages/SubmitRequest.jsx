
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

export default function SubmitRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    part_code: '',
    category: '',
    description: '',
    color_variants: [{ name: '', code: '' }],
    image_urls: [],
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
      color_variants: [...formData.color_variants, { name: '', code: '' }],
    });
  };

  const removeColor = (index) => {
    const newColors = formData.color_variants.filter((_, i) => i !== index);
    setFormData({ ...formData, color_variants: newColors });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('token'); // <- get JWT token from storage
      const formDataObj = new FormData();
      formDataObj.append('image', file);

      const { data } = await api.post('/upload', formDataObj, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` // <- include JWT in header
        },
      });

      setFormData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, data.url]
      }));

      toast.success('Image uploaded!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
    }
    setUploading(false);
    e.target.value = ''; // Reset input
  };

  const removeImage = (index) => {
    const newImages = formData.image_urls.filter((_, i) => i !== index);
    setFormData({ ...formData, image_urls: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanedData = {
        ...formData,
        color_variants: formData.color_variants.filter(c => c.name),
      };

      await api.post('/requests', cleanedData);
      toast.success('Request submitted successfully!');
      navigate('/my-contributions');
    } catch (error) {
      console.error('Failed to submit request');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-lego-textred">Submit New Part Request</h1>
        <p className="text-gray-600">
          Found a brick that's not in our database? Submit it for review by our admin team.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Part Name */}
          <div>
            <label className="block text-sm font-medium text-lego-textred mb-2">
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
            <label className="block text-sm font-medium text-lego-textred mb-2">
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
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-lego-textred mb-2">
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
            <label className="block text-sm font-medium text-lego-textred mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows={4}
              placeholder="Describe the part..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-lego-textred mb-2">
              Images
            </label>
            
            {/* Upload Button */}
            <label className="btn btn-secondary cursor-pointer inline-flex items-center space-x-2">
              <Upload size={18} />
              <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {/* Uploaded Images Preview */}
            {formData.image_urls.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.image_urls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Color Variants */}
          <div>
            <label className="block text-sm font-medium text-lego-textred mb-2">
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
            <button type="button" onClick={addColor} className="btn btn-secondary mt-2">
              + Add Color
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || uploading}
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
