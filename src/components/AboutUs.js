import React from 'react';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'Kyle Florentino',
    role: 'Project Lead',
    image: '/assets/pm_kyle.jpeg',
    bio: 'Oversaw project development and ensured alignment with client requirements. Led the team in planning, execution, and delivery of the Alabites platform.'
  },
  {
    name: 'Christian Mejia',
    role: 'Developer',
    image: '/assets/dev_mejia.jpeg',
    bio: 'Was responsible for implementing frontend and backend functionalities to ensure smooth operation of the Alabites website. Worked closely with design and QA teams.'
  },
  {
    name: 'Cain Carolino',
    role: 'Developer',
    image: '/assets/dev_cain.jpeg',
    bio: 'Developed and maintained features that enhanced user experience and optimized platform performance. Collaborated with the team to integrate new technologies.'
  },
  {
    name: 'Micah Marcial',
    role: 'Designer',
    image: '/assets/dev_micah.jpeg',
    bio: 'Created intuitive and visually appealing interfaces for the Alabites platform. Designed user interactions to enhance usability and elevate user experience.'
  },
  {
    name: 'Charles Calizo',
    role: 'Designer',
    image: '/assets/dev_charles.jpeg',
    bio: 'Was responsible for visual concept development and brand consistency across all Alabites assets. Collaborated closely with development and marketing teams.'
  }
];


const AboutUs = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="text-center mb-12">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4 tracking-widest">ABOUT US</h1>
          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
            Alabites is your go-to food ordering platform exclusively for FEU Alabang students. We connect you with your favorite food concessionaires on campus, ensuring convenience and variety right at your fingertips.
          </p>
        </div>
        <div className="flex flex-wrap -m-4 justify-center">
          <div className="w-full text-center mb-12">
            <h2 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4 tracking-widest">Meet the Dedicated Team Behind Alabites</h2>
            <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
              Our team is passionate about providing you with the best food ordering experience at FEU Alabang. Meet the talented individuals driving Alabites forward:
            </p>
          </div>
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="p-4 md:w-1/3 sm:w-1/2 w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-full bg-gray-100 p-8 rounded">
                <img
                  alt={member.name}
                  className="w-20 h-20 mb-4 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100"
                  src={member.image}
                />
                <h2 className="text-gray-900 font-medium title-font">{member.name}</h2>
                <p className="text-gray-500 mb-3">{member.role}</p>
                <p className="leading-relaxed text-base">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col items-center mt-12">
          <div className="w-full text-center mb-12">
            <h2 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4 tracking-widest">Thank You for Choosing Alabites!</h2>
            <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
              We appreciate your support and trust in Alabites. Our team is committed to continuously improving your experience. Stay tuned for more updates!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
