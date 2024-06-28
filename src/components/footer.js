import React from 'react';
import '../styles/footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-100">
            <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex justify-center text-teal-600">
                    <img className="h-12" src="/assets/logo.png" alt="Alabites Logo" />
                </div>

                <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
                    Alabites - Food Ordering Application for FEU Alabang Food Concessionaires - Made with love by Forgetech
                </p>

                <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
                    <li>
                        <Link to="/" className="text-gray-700 transition hover:text-teal-600">Home</Link>
                    </li>
                    <li>
                        <Link to="/about" className="text-gray-700 transition hover:text-teal-600">About</Link>
                    </li>
                    <li>
                        <Link to="/help-center" className="text-gray-700 transition hover:text-teal-600">Help Center</Link>
                    </li>
                    <li>
                        <Link to="/admin" className="text-gray-700 transition hover:text-teal-600">Admin</Link>
                    </li>
                </ul>

                <ul className="mt-12 flex justify-center gap-6 md:gap-8">
                    <li>
                        <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:text-teal-600" aria-label="Facebook">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                {/* Facebook SVG Path */}
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:text-teal-600" aria-label="Instagram">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                {/* Instagram SVG Path */}
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:text-teal-600" aria-label="Twitter">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                {/* Twitter SVG Path */}
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:text-teal-600" aria-label="GitHub">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                {/* GitHub SVG Path */}
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
