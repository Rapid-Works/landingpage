import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, CheckCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { submitToAirtable } from '../utils/airtableService';

const formSteps = [
  {
    id: 'welcome',
    title: "Let's Create Your Brand Identity",
    subtitle: "We'll guide you through everything we need to know",
    type: 'welcome'
  },
  {
    id: 'companyName',
    title: "What's your company name?",
    type: 'input',
    placeholder: 'Enter your company name'
  },
  {
    id: 'industry',
    title: 'What industry are you in?',
    type: 'input',
    placeholder: 'e.g., Technology, Healthcare, Education'
  },
  {
    id: 'targetAudience',
    title: 'Who is your target audience?',
    subtitle: 'Help us understand your customers better',
    type: 'textarea',
    placeholder: 'Tell us about your ideal customers...'
  },
  {
    id: 'businessType',
    title: 'What type of business are you?',
    type: 'select',
    options: [
      { value: 'b2b', label: 'B2B - Business to Business' },
      { value: 'b2c', label: 'B2C - Business to Consumer' },
      { value: 'both', label: 'Both B2B and B2C' }
    ]
  },
  {
    id: 'founders',
    title: 'Tell us about the founders',
    type: 'founders'
  },
  {
    id: 'websiteGoal',
    title: 'What is the main goal of your website?',
    subtitle: 'This helps us optimize your design',
    type: 'select',
    options: [
      { value: 'lead-gen', label: 'Generate Leads' },
      { value: 'sales', label: 'Direct Sales' },
      { value: 'information', label: 'Share Information' },
      { value: 'brand', label: 'Build Brand Awareness' }
    ]
  },
  {
    id: 'brandValues',
    title: 'Select your core brand values',
    subtitle: 'Choose up to 3 that best represent your brand',
    type: 'multiselect',
    maxSelect: 3,
    options: [
      { value: 'innovative', label: 'Innovative' },
      { value: 'trustworthy', label: 'Trustworthy' },
      { value: 'professional', label: 'Professional' },
      { value: 'friendly', label: 'Friendly' },
      { value: 'luxurious', label: 'Luxurious' },
      { value: 'sustainable', label: 'Sustainable' }
    ]
  },
  {
    id: 'contact',
    title: 'Your contact information',
    type: 'contact',
    fields: [
      { id: 'email', label: 'Email', type: 'email' },
      { id: 'phone', label: 'Phone Number', type: 'tel' }
    ]
  },
  {
    id: 'review',
    title: 'Review Your Information',
    subtitle: 'Make sure everything is correct',
    type: 'review'
  },
  {
    id: 'submit',
    type: 'submit',
    title: 'Thank You!',
    subtitle: "We'll start working on your brand identity right away"
  }
];

const BundleForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    founderCount: 1 // Initialize with 1 founder
  });

  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFounder = () => {
    if (formData.founderCount < 4) { // Limit to 4 founders
      setFormData(prev => ({
        ...prev,
        founderCount: (prev.founderCount || 1) + 1
      }));
    }
  };

  const handleClose = () => {
    if (window.confirm('Are you sure you want to cancel? All progress will be lost.')) {
      window.history.back();
    }
  };

  const handleSubmit = async () => {
    try {
      // Create a summary of the form data for the Notes field
      const notes = `
Company: ${formData.companyName || 'N/A'}
Industry: ${formData.industry || 'N/A'}
Target Audience: ${formData.targetAudience || 'N/A'}
Business Type: ${formData.businessType || 'N/A'}
Website Goal: ${formData.websiteGoal || 'N/A'}
Brand Values: ${(formData.brandValues || []).join(', ')}
Founders: ${formData.founderCount || 1}
      `;

      await submitToAirtable({
        email: formData.email,
        service: "Brand Identity Form",
        notes: notes.trim()
      });
      
      console.log('Form submitted to Airtable:', formData);
      nextStep(); // Proceed to the success screen
    } catch (error) {
      console.error("Error submitting to Airtable:", error);
      alert("There was a problem submitting your form. Please try again.");
    }
  };

  const renderFounderFields = (index) => (
    <div key={index} className="bg-gray-50 p-6 rounded-lg space-y-4 mb-4">
      <h3 className="text-xl font-light">Founder {index + 1}</h3>
      <Input
        placeholder="Full Name"
        value={formData[`founder${index}Name`] || ''}
        onChange={(e) => handleInputChange(`founder${index}Name`, e.target.value)}
        className="text-lg p-4 bg-white"
      />
      <Input
        placeholder="Position/Title"
        value={formData[`founder${index}Title`] || ''}
        onChange={(e) => handleInputChange(`founder${index}Title`, e.target.value)}
        className="text-lg p-4 bg-white"
      />
      <Textarea
        placeholder="Brief Bio"
        value={formData[`founder${index}Bio`] || ''}
        onChange={(e) => handleInputChange(`founder${index}Bio`, e.target.value)}
        className="text-lg p-4 bg-white"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="fixed top-4 left-4 p-2 text-gray-400 hover:text-gray-600 z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100">
        <div 
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="fixed top-4 right-4 text-sm text-gray-500">
        {currentStep + 1} of {formSteps.length}
      </div>

      {/* Form content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          <h1 className="text-4xl font-light mb-4 text-center">
            {formSteps[currentStep].title}
          </h1>
          {formSteps[currentStep].subtitle && (
            <p className="text-xl text-gray-500 mb-8 text-center">
              {formSteps[currentStep].subtitle}
            </p>
          )}
          
          {formSteps[currentStep].type === 'welcome' && (
          <div className="text-center">
            <button
              onClick={nextStep}
                className="px-8 py-4 bg-black text-white rounded-lg"
            >
              Let's Begin
              <ArrowRight className="ml-2 inline-block" />
            </button>
          </div>
        )}

          {formSteps[currentStep].type === 'input' && (
            <Input
              placeholder={formSteps[currentStep].placeholder}
              value={formData[formSteps[currentStep].id] || ''}
              onChange={(e) => handleInputChange(formSteps[currentStep].id, e.target.value)}
              className="text-xl p-4"
              onKeyDown={(e) => e.key === 'Enter' && nextStep()}
              autoFocus
            />
          )}

          {formSteps[currentStep].type === 'textarea' && (
            <div className="space-y-4">
              <Textarea
                placeholder={formSteps[currentStep].placeholder}
                value={formData[formSteps[currentStep].id] || ''}
                onChange={(e) => handleInputChange(formSteps[currentStep].id, e.target.value)}
                className="text-xl p-4"
                autoFocus
              />
              <button
                onClick={nextStep}
                className="w-full px-8 py-4 bg-black text-white rounded-lg text-xl"
              >
                Next
                <ArrowRight className="ml-2 inline-block" />
              </button>
            </div>
          )}

          {formSteps[currentStep].type === 'select' && (
            <div className="space-y-4">
              {formSteps[currentStep].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleInputChange(formSteps[currentStep].id, option.value);
                    nextStep();
                  }}
                  
                  className="w-full p-4 text-left text-xl bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {formSteps[currentStep].type === 'founders' && (
            <div className="space-y-6">
              {Array.from({ length: formData.founderCount }).map((_, index) => 
                renderFounderFields(index)
              )}
              
              {formData.founderCount < 4 && (
                <button
                  onClick={addFounder}
                  className="w-full p-4 border-2 border-dashed border-gray-300 text-gray-500 hover:border-black hover:text-black rounded-lg transition-colors"
                >
                  + Add Another Founder
                </button>
              )}

              <button
                onClick={nextStep}
                className="w-full px-8 py-4 bg-black text-white rounded-lg text-xl mt-8"
              >
                Next
                <ArrowRight className="ml-2 inline-block" />
              </button>
            </div>
          )}

          {formSteps[currentStep].type === 'multiselect' && (
            <div className="space-y-4">
              {formSteps[currentStep].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    const currentValues = formData[formSteps[currentStep].id] || [];
                    if (currentValues.includes(option.value)) {
                      handleInputChange(
                        formSteps[currentStep].id,
                        currentValues.filter(v => v !== option.value)
                      );
                    } else if (currentValues.length < formSteps[currentStep].maxSelect) {
                      handleInputChange(
                        formSteps[currentStep].id,
                        [...currentValues, option.value]
                      );
                    }
                  }}
                  className={`w-full p-4 text-left text-xl rounded-lg transition-colors ${
                    (formData[formSteps[currentStep].id] || []).includes(option.value)
                      ? 'bg-black text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
              <button
                onClick={nextStep}
                disabled={!(formData[formSteps[currentStep].id] || []).length}
                className="w-full px-8 py-4 bg-black text-white rounded-lg text-xl mt-4 disabled:opacity-50"
              >
                Next
                <ArrowRight className="ml-2 inline-block" />
              </button>
            </div>
          )}

          {formSteps[currentStep].type === 'contact' && (
            <div className="space-y-6">
              {formSteps[currentStep].fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-gray-600">{field.label}</label>
                  <Input
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="text-xl p-4"
                  />
                </div>
              ))}
              <button
                onClick={nextStep}
                className="w-full px-8 py-4 bg-black text-white rounded-lg text-xl mt-4"
              >
                Next
                <ArrowRight className="ml-2 inline-block" />
              </button>
            </div>
          )}

          {formSteps[currentStep].type === 'review' && (
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-medium">Company Information</h3>
                <p>Company Name: {formData.companyName}</p>
                <p>Industry: {formData.industry}</p>
                <p>Business Type: {formData.businessType}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-medium">Brand Values</h3>
                <div className="flex flex-wrap gap-2">
                  {(formData.brandValues || []).map(value => (
                    <span key={value} className="px-3 py-1 bg-black text-white rounded-full">
                      {value}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full px-8 py-4 bg-black text-white rounded-lg text-xl"
              >
                Submit
                <ArrowRight className="ml-2 inline-block" />
              </button>
            </div>
          )}

          {formSteps[currentStep].type === 'submit' && (
            <div className="text-center space-y-8">
              <div className="w-20 h-20 mx-auto bg-black rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-light">{formSteps[currentStep].title}</h2>
                <p className="text-xl text-gray-500">{formSteps[currentStep].subtitle}</p>
              </div>
              <p className="text-gray-600">
                You'll receive a confirmation email shortly with next steps.
              </p>
            </div>
          )}

          {/* Navigation */}
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="fixed bottom-8 left-8 p-4 text-gray-500 hover:text-black"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BundleForm; 