import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import the Link component

const BlogSection = () => {
    return (
        <section className="py-8 md:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="mb-6 md:mb-8">
                    <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-4 text-center md:text-left">Our Blog</h2>
                    <div className="w-16 md:w-28 h-0.5 bg-[#E16A3D] mb-2 mx-auto md:mx-0"></div>
                    <p className="text-base md:text-lg text-gray-600 font-rubik text-center md:text-left">An insight into incredible experiences around the world</p>
                </div>
                <div className="flex flex-col md:flex-row items-center md:space-x-8">
                    <div className="w-full md:w-1/2 mb-6 md:mb-0 flex justify-center md:justify-end">
                        <Image
                            src="/images/login.jpg" 
                            alt="Beautiful Italy"
                            width={500}
                            height={300}
                            className="rounded-lg w-full h-auto"
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
                        <h3 className="text-3xl md:text-5xl font-playfair mb-4 leading-tight">
                            Beautiful Italy<br />Let&apos;s travel
                        </h3>

                        <p className="text-gray-700 font-rubik mb-4">
                            But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues...
                        </p>
                        {/* Replace <a> with <Link> */}
                        <Link href="/blog" className="text-[#E16A3D] font-rubik hover:underline flex items-center justify-center md:justify-start">
                            Read More <span className="ml-2">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
