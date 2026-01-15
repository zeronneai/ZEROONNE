
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 md:px-16 flex flex-col md:flex-row justify-center items-center text-sm text-zero-accent md:gap-x-12">
      <div className="mb-4 md:mb-0">
        © Zero Onne — All rights reserved
      </div>
      <div className="flex space-x-6">
        <a href="https://www.instagram.com/zeronne.ai" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-zero-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        <a href="https://www.facebook.com/share/1aWvk9VMjy/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-zero-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
        <a href="https://www.youtube.com/zeroonne" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-zero-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
        </a>
        <a href="https://www.tiktok.com/@zeroonne" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-zero-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" width="24" height="24"><path d="M19.5 7.6C19.5 7.4 19.4 7.2 19.3 7.1C19.2 7 19 6.9 18.8 6.9C18.6 6.9 18.4 7 18.3 7.1C18.2 7.2 18.1 7.4 18.1 7.6V12.9C18.1 13 18.1 13.1 18.1 13.1C18.1 13.2 18.1 13.2 18 13.3C17.9 13.4 17.8 13.5 17.6 13.6C17.4 13.7 17.3 13.7 17.1 13.7C16.8 13.7 16.6 13.6 16.4 13.5C16.2 13.3 16.1 13.1 16.1 12.8C16.1 12.6 16.2 12.4 16.3 12.3C16.4 12.2 16.6 12.1 16.8 12.1H18.1C18.1 11.2 17.8 10.3 17.2 9.6C16.6 8.9 15.8 8.4 14.8 8.1V10.7C14.8 10.9 14.7 11 14.6 11.1C14.5 11.2 14.4 11.3 14.2 11.3C14 11.3 13.9 11.2 13.8 11.1C13.7 11 13.6 10.9 13.6 10.7V6.9H11.5C11.3 6.9 11.1 7 11 7.1C10.9 7.2 10.8 7.4 10.8 7.6V12.9C10.8 13 10.8 13.1 10.8 13.1C10.8 13.2 10.8 13.2 10.7 13.3C10.6 13.4 10.5 13.5 10.3 13.6C10.1 13.7 10 13.7 9.8 13.7C9.5 13.7 9.3 13.6 9.1 13.5C8.9 13.3 8.8 13.1 8.8 12.8C8.8 12.6 8.9 12.4 9 12.3C9.1 12.2 9.3 12.1 9.5 12.1H10.8C10.8 11.2 10.5 10.3 9.9 9.6C9.3 8.9 8.5 8.4 7.5 8.1V10.7C7.5 10.9 7.4 11 7.3 11.1C7.2 11.2 7.1 11.3 6.9 11.3C6.7 11.3 6.6 11.2 6.5 11.1C6.4 11 6.3 10.9 6.3 10.7V6.9H4.2C4 6.9 3.8 7 3.7 7.1C3.6 7.2 3.5 7.4 3.5 7.6V12.9C3.5 13 3.5 13.1 3.5 13.1C3.5 13.2 3.5 13.2 3.4 13.3C3.3 13.4 3.2 13.5 3 13.6C2.8 13.7 2.7 13.7 2.5 13.7C2.2 13.7 2 13.6 1.8 13.5C1.6 13.3 1.5 13.1 1.5 12.8C1.5 12.6 1.6 12.4 1.7 12.3C1.8 12.2 2 12.1 2.2 12.1H3.5C3.5 11.2 3.2 10.3 2.6 9.6C2 8.9 1.2 8.4 0.2 8.1V10.7C0.2 10.9 0.1 11 0 11.1C0 11.2 0 11.3 0 11.3V7.6C0 7.4 0.1 7.2 0.2 7.1C0.3 7 0.5 6.9 0.7 6.9H4.2V2.5C4.2 2.3 4.3 2.1 4.4 2C4.5 1.9 4.7 1.8 4.9 1.8H7.7C7.9 1.8 8.1 1.9 8.2 2C8.3 2.1 8.4 2.3 8.4 2.5V5.2C9.4 4.8 10.5 4.6 11.6 4.6C12.8 4.6 13.9 4.8 14.9 5.2V2.5C14.9 2.3 15 2.1 15.1 2C15.2 1.9 15.4 1.8 15.6 1.8H18.4C18.6 1.8 18.8 1.9 18.9 2C19 2.1 19.1 2.3 19.1 2.5V5.2C20.1 4.8 21.2 4.6 22.3 4.6C22.6 4.6 22.8 4.6 23.1 4.7C23.3 4.8 23.6 4.9 23.8 5C24 5.2 24 5.5 24 5.7C24 6 23.8 6.2 23.6 6.4C23.4 6.6 23.2 6.7 22.9 6.8C22.6 6.9 22.3 6.9 22 6.9H19.5V7.6Z"/></svg>
        </a>
        <a href="mailto:fabian.nuron@gmail.com" aria-label="Email" className="hover:text-zero-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </a>
        {/* Updated WhatsApp Icon */}
        <a href="https://wa.me/19152343655?text=Hi%2C%20i%20want%20build%20something%20exceptional%21" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-zero-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.5C21 18.2934 16.2934 23 10.5 23C8.4287 23 6.4716 22.4042 4.79373 21.2828L1 23L2.28284 19.2063C1.59584 17.5284 1 15.6563 1 13.5C1 7.70659 5.70659 3 11.5 3C17.2934 3 22 7.70659 22 13.5C22 13.5 21.5 13.5 21 13.5C21 13.5 21 12.5 21 12.5Z"/>
            <path d="M8 7L16 11L8 15V7Z" fill="currentColor" stroke="none"/>
          </svg>
        </a>
      </div>
    </footer>
  );
};