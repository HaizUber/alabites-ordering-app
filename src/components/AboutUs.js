import React from 'react';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'Kyle Florentino',
    role: 'Project Lead',
    image: 'https://scontent.fmnl8-1.fna.fbcdn.net/v/t1.6435-9/53881462_2561012473970574_4987455254070034432_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeEUO5NimvDaQOCOJ_HBGOtb0cJ7wpph_DjRwnvCmmH8OAvj6iPrmH8OeBQWxBd7HtC90vgVAvoauAW6Ubcos7me&_nc_ohc=wKlmcnXvbFIQ7kNvgFT43t7&_nc_ht=scontent.fmnl8-1.fna&oh=00_AYA3ihYcQm-W6CXgntjwzh4-kSjdYXj9ZwLHNSY3eODq3Q&oe=66A5717D',
    bio: 'Oversaw project development and ensured alignment with client requirements. Led the team in planning, execution, and delivery of the Alabites platform.'
  },
  {
    name: 'Christian Mejia',
    role: 'Developer',
    image: 'https://scontent.fmnl8-2.fna.fbcdn.net/v/t39.30808-6/281026847_7588635631177503_6344736254591475824_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFsg35MyvjNBHUaJmxIdDE0ZYgpN2_RactliCk3b9FpyyxLYMvRPfz8FOCoePE_W9vTBrVyoyJar90Pa3C9Xep9&_nc_ohc=f7fsyNfePFEQ7kNvgFVDOj3&_nc_ht=scontent.fmnl8-2.fna&oh=00_AYBIQ8nzIcfkr9FmGdv_0Op4_22lMV19HxZpmOHUAaWbDg&oe=6683F35F',
    bio: 'Was responsible for implementing frontend and backend functionalities to ensure smooth operation of the Alabites website. Worked closely with design and QA teams.'
  },
  {
    name: 'Cain Carolino',
    role: 'Developer',
    image: 'https://scontent.fmnl8-1.fna.fbcdn.net/v/t39.30808-6/317812129_1365584814245540_8368079824066655011_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHqYodA9HHsy5JMm-b4QpBTDChhmL1Kl24MKGGYvUqXbmp1MBbHi8Na4H4NVphNkNWZU_TlZheHJg5VT1orgA2U&_nc_ohc=eN3dV_dumLcQ7kNvgF2ZDaF&_nc_ht=scontent.fmnl8-1.fna&oh=00_AYDTUC2D_dHU-a-E_yOKJ0JvvK9LyFu3vQtdAgHLaRt9Jw&oe=6683DA96',
    bio: 'Developed and maintained features that enhanced user experience and optimized platform performance. Collaborated with the team to integrate new technologies.'
  },
  {
    name: 'Micah Marcial',
    role: 'Designer',
    image: 'https://scontent.fmnl8-2.fna.fbcdn.net/v/t39.30808-6/439999698_8158822854145002_307266141039303830_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEa_heb_hxsT03odHvv63JwcphKr1NtU7RymEqvU21TtHQdlkmj5z8VyW6-oky7wcJeIQpUTz0FkFt_7zjDFQHS&_nc_ohc=H6m01KdMxLYQ7kNvgEY8hBa&_nc_ht=scontent.fmnl8-2.fna&oh=00_AYBYoUPughn-fTaf_JTXKpzQUFHL1KBgoTd9JH-IHoQt3g&oe=6683DCE0',
    bio: 'Created intuitive and visually appealing interfaces for the Alabites platform. Designed user interactions to enhance usability and elevate user experience.'
  },
  {
    name: 'Charles Calizo',
    role: 'Designer',
    image: 'https://scontent.fmnl8-2.fna.fbcdn.net/v/t39.30808-6/341615227_3503360726587563_8425340484381423962_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGNlz9cpAL2DeXLKzjoQqIrMC4o3Tlq_-cwLijdOWr_57SR2qZTr4Qa8PkbQArHW3GXLa0ZxX6Iyz8PvNxiGZfZ&_nc_ohc=2L8XQBJWWOMQ7kNvgFo2bZC&_nc_ht=scontent.fmnl8-2.fna&oh=00_AYCAynm355Gq1Vwgs0rkTCPgCfLN26waDLfPF_MTTgkiwQ&oe=6683D905',
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
