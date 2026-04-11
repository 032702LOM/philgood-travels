import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How does the Split Payment system work?",
      answer: "When booking a trip, you can choose to split the total cost with your group. Our system will collect your friends' email addresses and generate separate, secure Stripe checkout links for everyone. You can track who has paid directly from your User Dashboard!"
    },
    {
      question: "What is your cancellation and postponement policy?",
      answer: "We offer flexible self-service management through your profile. You can cancel or postpone a trip as long as your travel date is more than 48 hours away. Please note, you are limited to a maximum of 2 postponements per booking."
    },
    {
      question: "Do you offer discounts for children?",
      answer: "Yes! Our dynamic pricing engine automatically applies a 50% discount for children and a 100% discount for infants when you build your itinerary."
    },
    {
      question: "How long do I have to rebook a cancelled trip?",
      answer: "If you decide to cancel a trip instead of postponing it, our system requires you to rebook your adventure within one (1) month of your original cancellation date."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can instantly reach our staff using the Live Chat widget located in the bottom right corner of your screen. Alternatively, you can send us an email through our Connect page."
    }
  ];

  return (
    <div className="fade-in" style={{ minHeight: '80vh', paddingTop: '100px', paddingBottom: '60px', backgroundColor: 'var(--bg-dark)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div className="text-center mb-5">
          <h1 className="text-navy font-montserrat fw-bold mb-3 text-uppercase">Frequently Asked Questions</h1>
          <p className="text-grey">Everything you need to know about booking, payments, and managing your PhilGood adventure.</p>
        </div>

        <div className="d-flex flex-column gap-3">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className="bg-card-dark rounded-4 shadow-sm border border-primary border-opacity-10 overflow-hidden" 
              style={{ backgroundColor: 'var(--card-bg)' }}
            >
              <button 
                className="w-100 text-start p-4 border-0 bg-transparent d-flex justify-content-between align-items-center"
                onClick={() => toggleFAQ(index)}
              >
                {/* ⚡ FIX: Changed text-white to text-navy so it shows up in Light Mode! ⚡ */}
                <span className="text-navy font-montserrat fw-bold fs-5">{faq.question}</span>
                <i className={`fa-solid ${openIndex === index ? 'fa-minus text-accent' : 'fa-plus text-navy'} fs-5 transition-all`}></i>
              </button>
              
              <div 
                className="px-4 text-grey" 
                style={{ 
                  maxHeight: openIndex === index ? '200px' : '0', 
                  opacity: openIndex === index ? '1' : '0',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  paddingBottom: openIndex === index ? '1.5rem' : '0'
                }}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <p className="text-grey mb-2">Still have questions?</p>
          <Link to="/connect" className="btn btn-outline-custom text-uppercase font-montserrat fw-bold">Contact Us</Link>
        </div>

      </div>
    </div>
  );
};

export default FAQ;