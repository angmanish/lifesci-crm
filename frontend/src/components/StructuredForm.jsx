import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField, saveInteraction } from '../store/interactionSlice';
import { Save } from 'lucide-react';

const StructuredForm = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.interaction.formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ field: name, value }));
  };

  const handleSave = () => {
    if (formData.hcp_name) {
      dispatch(saveInteraction(formData));
    } else {
      alert("HCP Name is required.");
    }
  };

  return (
    <div className="panel-content">
      <div className="form-group">
        <label>HCP Name</label>
        <input 
          type="text" 
          className="form-control" 
          name="hcp_name"
          value={formData.hcp_name} 
          onChange={handleChange}
          placeholder="e.g., Dr. Sarah Smith"
        />
      </div>

      <div className="form-group">
        <label>Specialty</label>
        <input 
          type="text" 
          className="form-control" 
          name="specialty"
          value={formData.specialty} 
          onChange={handleChange}
          placeholder="e.g., Cardiology"
        />
      </div>

      <div className="form-group">
        <label>Discussion Topics</label>
        <input 
          type="text" 
          className="form-control" 
          name="discussion_topics"
          value={formData.discussion_topics} 
          onChange={handleChange}
          placeholder="e.g., New Trial Data"
        />
      </div>

      <div className="form-group">
        <label>Follow-up Date</label>
        <input 
          type="text" 
          className="form-control" 
          name="follow_up_date"
          value={formData.follow_up_date} 
          onChange={handleChange}
          placeholder="e.g., Next Tuesday"
        />
      </div>

      <div className="form-group">
        <label>Sentiment</label>
        <select 
          className="form-control" 
          name="sentiment"
          value={formData.sentiment} 
          onChange={handleChange}
        >
          <option value="Positive">Positive</option>
          <option value="Neutral">Neutral</option>
          <option value="Negative">Negative</option>
        </select>
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea 
          className="form-control" 
          name="notes"
          value={formData.notes} 
          onChange={handleChange}
          placeholder="Detailed notes..."
        ></textarea>
      </div>

      <button className="btn btn-success" onClick={handleSave}>
        <Save size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Save Interaction
      </button>
    </div>
  );
};

export default StructuredForm;
