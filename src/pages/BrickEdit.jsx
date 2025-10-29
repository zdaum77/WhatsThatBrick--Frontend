import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';

export default function BrickEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    part_code: '',
    category: '',
    description: '',
    color_variants: [{ name: '', code: '' }],
    image_urls: [''],
    set_appearances: [],
  });

  useEffect(() => {
    loadBrick();
  }, [id]);

  const loadBrick = async () => {
    try {
      const { data } = await api.get(`/bricks/${id}`);
      setFormData({
        name: data.name || '',
        part_code: data.part_code || '',
        category: data.category || '',
        description: data.description || '',
        color_variants: data.color_variants?.length > 0 ? data.color_variants : [{ name: '', code: '' }],
        image_urls: data.image_urls?.length > 0 ? data.image_urls : [''],
        set_appearances: data.set_appearances || [],
      });
    } catch (error) {
      toast.error('Failed to load brick');
      navigate('/');
    }
    setLoading(false);
  };

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

  const handleImageChange = (index, value) => {
    const newImages = [...formData.image_urls];
    newImages[index] = value;
    setFormData({ ...formData, image_urls: newImages });
  };

  const addImage = () => {
    setFormData({ ...formData, image_urls: [...formData.image_urls, ''] });
  };

  const removeImage = (index) => {
    const newImages = formData.image_urls.filter((_, i) => i !== index);
    setFormData({ ...formData, image_urls: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanedData = {
        ...formData,
        color_variants: formData.color_variants.filter(c => c.name),
        image_urls: formData.image_urls.filter(url => url.trim() !== ''),
      };

      await api.put(`/bricks/${id}`, cleanedData);
      toast.success('Brick updated successfully!');
      navigate(`/bricks/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update brick');
    }
    setSaving(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Brick</h1>
        <p className="text-gray-600">Update the information for this brick</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
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
            />
          </div>

          {/* Part Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Part Code
            </label>
            <input
              type="text"
              name="part_code"
              value={formData.part_code}
              onChange={handleChange}
              className="input"
            />
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
                  placeholder="Color name"
                  value={color.name}
                  onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                  className="input flex-1"
                />
                <input
                  type="text"
                  placeholder="#FF0000"
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

          {/* Image URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs
            </label>
            {formData.image_urls.map((url, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="input flex-1"
                />
                {formData.image_urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addImage} className="btn btn-secondary mt-2">
              + Add Image URL
            </button>
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/bricks/${id}`)}
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