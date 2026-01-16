
import React, { useState } from 'react';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const allServices = [
  'Web Design',
  'Web Hosting',
  'App Design',
  'UI Design',
  'UX Design',
  'Custom Software',
  'AI Video Generation & Editing',
  'AI Graphic Design',
  'AI Image Generation & Editing',
  'AI Upscaling',
  'AI Creative Strategy',
  'AI Automation',
  'AI Education & Training',
  'AI System Integration',
  'AI System Setup & Installation',
];

export const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleServiceChange = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmissionError(null);

  const formData = {
    name,
    email,
    services: selectedServices.join(", "),
    description: projectDescription,
  };

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwPuGINJpOpYSj0hTHI8KAfjD1fAy_C9CaA034mME6UrdhEDr404bdrKS9HO5UuTc7Y/exec";

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const text = await response.text();

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Respuesta NO es JSON:", text);
      throw new Error("El servidor respondió algo que no es JSON.");
    }

    if (!response.ok || data?.ok === false) {
      throw new Error(data?.message || data?.error || "Failed to submit form.");
    }

    setIsSubmitted(true);
    setName("");
    setEmail("");
    setProjectDescription("");
    setSelectedServices([]);
  } catch (error: any) {
    console.error("Error submitting form:", error);
    setSubmissionError(error.message || "An unexpected error occurred. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-zero-black bg-opacity-90 p-4 transition-opacity duration-500 ease-out`}
      role="dialog"
      aria-modal="true"
      aria-label="Contact form for project inquiry"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-zero-white text-zero-black p-8 md:p-12 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-95 opacity-0 animate-showcase-enter">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zero-black hover:text-zero-accent focus:outline-none focus:ring-2 focus:ring-zero-accent focus:ring-offset-2 rounded-full p-1"
          aria-label="Close contact form"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-medium mb-8">Start Your Project with Zero Onne</h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {submissionError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {submissionError}</span>
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zero-accent bg-gray-50 text-zero-black"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zero-accent bg-gray-50 text-zero-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What type of service are you looking for? (Select all that apply)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 max-h-48 overflow-y-auto custom-scrollbar p-2 border border-gray-300 rounded-md bg-gray-50">
                {allServices.map((service) => (
                  <div key={service} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`service-${service.replace(/\s/g, '-')}`}
                      name="services"
                      value={service}
                      checked={selectedServices.includes(service)}
                      onChange={() => handleServiceChange(service)}
                      className="h-4 w-4 text-zero-black border-gray-300 rounded focus:ring-zero-accent"
                    />
                    <label htmlFor={`service-${service.replace(/\s/g, '-')}`} className="ml-2 text-sm text-zero-black">
                      {service}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zero-accent bg-gray-50 text-zero-black"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-zero-black text-zero-white px-6 py-3 rounded-md text-lg font-medium hover:bg-zero-accent focus:outline-none focus:ring-2 focus:ring-zero-black focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Information'}
            </button>
          </form>
        ) : (
          <div className="text-center py-12 animate-fade-in-slow">
            <h3 className="text-3xl font-medium text-zero-accent mb-4">Thank You!</h3>
            <p className="text-xl text-zero-black leading-relaxed max-w-xl mx-auto">
              Together, we craft what comes next. Your vision, our expertise, infinite possibilities.
            </p>
            <p className="mt-8 text-sm text-gray-600">
              We'll be in touch shortly to discuss your project.
            </p>
            <button
              onClick={onClose}
              className="mt-8 bg-zero-black text-zero-white px-6 py-3 rounded-md text-lg font-medium hover:bg-zero-accent focus:outline-none focus:ring-2 focus:ring-zero-black focus:ring-offset-2 transition-colors"
              aria-label="Close message"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
