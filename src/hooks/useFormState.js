import { useState, useCallback } from 'react';

const initial = {
  fullName: '', email: '', phone: '', jobRole: '', city: '',
  linkedinUrl: '', portfolioUrl: '',
  yearsOfExperience: 'Fresher / 0 years', experience: '',
  companyOrCollege: '', jobDescription: '',
  skills: '', skillTags: [], education: '', achievement: '',
};

export function useFormState() {
  const [formData, setFormData] = useState(() => {
    try {
      const s = localStorage.getItem('hireready_form');
      return s ? JSON.parse(s) : initial;
    } catch { return initial; }
  });
  const updateField = useCallback((field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem('hireready_form', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addTag = useCallback((skill) => {
    const tag = skill.trim().replace(/,/g, '');
    if (!tag) return;
    setFormData(prev => {
      if (prev.skillTags.includes(tag) || prev.skillTags.length >= 15) return prev;
      const updated = { ...prev, skillTags: [...prev.skillTags, tag] };
      localStorage.setItem('hireready_form', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeTag = useCallback((skill) => {
    setFormData(prev => {
      const updated = { ...prev, skillTags: prev.skillTags.filter(s => s !== skill) };
      localStorage.setItem('hireready_form', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const reset = () => {
    setFormData(initial);
    localStorage.removeItem('hireready_form');
    localStorage.removeItem('hireready_resume');
    localStorage.removeItem('hireready_payment');
  };

  return { formData, updateField, addTag, removeTag, reset };
}
