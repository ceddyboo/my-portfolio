"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ContactFormProps {
  className?: string;
}

// Replace with your Formspree endpoint or another external service
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xblynzjo";

export default function ContactForm({ className = "" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: null, message: '' });

    try {
      // Send to Formspree or another external service
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType,
          message: formData.message
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.next) {
        setFeedback({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.'
        });
        setFormData({
          name: "",
          email: "",
          projectType: "",
          message: ""
        });
      } else if (data.errors && data.errors.length > 0) {
        setFeedback({
          type: 'error',
          message: data.errors.map(e => e.message).join(' ')
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Something went wrong. Please email me directly at cedricguerreroL@gmail.com or reach out on X: https://x.com/_cedricguerrero'
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Network error. Please check your connection or email me directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      action={FORMSPREE_ENDPOINT}
      method="POST"
      className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* Feedback Message */}
      {feedback.type && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl border ${
            feedback.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-300' 
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {feedback.message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Name Field */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mobile-button"
            placeholder="Your full name"
          />
        </motion.div>

        {/* Email Field */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mobile-button"
            placeholder="your.email@example.com"
          />
        </motion.div>
      </div>

      {/* Project Type Dropdown */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <label htmlFor="projectType" className="block text-sm font-semibold text-gray-300 mb-2">
          Project Type *
        </label>
        <select
          id="projectType"
          name="projectType"
          value={formData.projectType}
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mobile-button"
        >
          <option value="" className="bg-gray-800 text-white">Select project type</option>
          <option value="video-editing" className="bg-gray-800 text-white">Video Editing</option>
          <option value="content-strategy" className="bg-gray-800 text-white">Content Strategy</option>
          <option value="thumbnail-design" className="bg-gray-800 text-white">Thumbnail Design</option>
          <option value="other" className="bg-gray-800 text-white">Other</option>
        </select>
      </motion.div>

      {/* Message Field */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
          Project Details *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={6}
          disabled={isSubmitting}
          className="w-full px-4 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed mobile-button"
          placeholder="Tell me about your project, goals, timeline, and any specific requirements..."
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mobile-button w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              <span className="mr-2">Send Inquiry</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </motion.div>

      {/* X Link Subheading */}
      <motion.div 
        className="text-center mt-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <span className="text-gray-400 text-sm md:text-base">
          Or reach out directly:{" "}
          <a 
            href="https://x.com/_cedricguerrero" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200 font-semibold"
          >
            X
          </a>
        </span>
      </motion.div>
    </motion.form>
  );
} 