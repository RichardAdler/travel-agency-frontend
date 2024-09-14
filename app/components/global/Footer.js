import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaPinterestP, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white pt-[5vh] sm:pt-[10vh] pb-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Logo and Copyright */}
                <div className="text-center md:text-left md:col-span-1">
                    <Link href="/">
                        <Image 
                            src="/images/white-logo-no-background.png" 
                            alt="Logo" 
                            width={150} 
                            height={75} 
                            className="mb-4 mx-auto md:mx-0"
                        />
                    </Link>
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Holiday Havens. <br />Created by Richard Adler.
                    </p>
                </div>

                {/* Menu */}
                <div className="text-center md:text-left">
                    <h3 className="font-semibold mb-4 text-xl sm:text-2xl">Menu</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/blog">Blog</Link></li>
                        <li><Link href="/contact-us">Contact Us</Link></li>                        
                    </ul>
                </div>

                {/* Information */}
                <div className="text-center md:text-left">
                    <h3 className="font-semibold mb-4 text-xl sm:text-2xl">Information</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
                        <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="text-center md:text-left">
                    <h3 className="font-semibold mb-4 text-xl sm:text-2xl">Contact Info</h3>
                    <ul className="space-y-2 text-sm">
                        <li>+123 456 789</li>
                        <li><a href="mailto:info@holidayhavens.com">info@holidayhavens.com</a></li>
                        <li>12, Royal Leamington Spa, UK</li>
                    </ul>
                </div>

                {/* Social Media */}
                <div className="text-center md:text-left">
                    <h3 className="font-semibold mb-4 text-xl sm:text-2xl">Follow us on</h3>
                    <div className="flex justify-center md:justify-start space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebookF className="w-6 h-6" />
                        </a>
                        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                            <FaPinterestP className="w-6 h-6" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram className="w-6 h-6" />
                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                            <FaXTwitter className="w-6 h-6" />
                        </a>
                    </div>
                    {/* ATOL Protected Logo */}
                    <div className="flex justify-center md:justify-start mt-4">
                        <Image 
                            src="/images/atol-protected.png" 
                            alt="ATOL Protected" 
                            width={50} 
                            height={50}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
